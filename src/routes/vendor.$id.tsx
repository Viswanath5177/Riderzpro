import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { VendorDashboard } from "@/components/vendor/VendorDashboard";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";
import { isMobileDevice } from "@/lib/native/app";

export const VENDOR_ALLOWED_TABS = [
  "overview",
  "shop",
  "listings",
  "inventory",
  "coupons",
  "orders",
  "shipments",
  "reviews",
  "settlements",
  "settings",
  "store",
  "account-status",
] as const;

export type VendorAllowedTab = (typeof VENDOR_ALLOWED_TABS)[number];

const STATIC_VENDOR_ROUTES = new Set(["login", "sign-up", "signup"]);

interface VendorSearchParams {
  tab?: VendorAllowedTab;
  action?: string;
}

export const Route = createFileRoute("/vendor/$id")({
  validateSearch: (search: Record<string, unknown>): VendorSearchParams => {
    let rawTab = typeof search["tab"] === "string" ? search["tab"] : "overview";
    if (rawTab === "products" || rawTab === "product") rawTab = "listings";
    const tab = VENDOR_ALLOWED_TABS.includes(rawTab as VendorAllowedTab)
      ? (rawTab as VendorAllowedTab)
      : "overview";
    const action = typeof search["action"] === "string" ? (search["action"] as string) : undefined;
    return { tab, action };
  },
  beforeLoad: async ({ params, search }) => {
    if (typeof window === "undefined") {
      return;
    }

    if (isMobileDevice()) {
      throw redirect({ to: "/app" });
    }

    const lowerId = params.id.toLowerCase();
    if (STATIC_VENDOR_ROUTES.has(lowerId)) {
      return;
    }

    const role = await getCurrentRole();
    const user = await getCurrentUser();

    if (!role || (role !== "seller" && role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "admin" && role !== "super_admin")) {
      const queryParts: string[] = [];
      if (search.tab) queryParts.push(`tab=${search.tab}`);
      if (search.action) queryParts.push(`action=${search.action}`);
      const queryStr = queryParts.length ? `?${queryParts.join("&")}` : "";
      throw redirect({
        to: "/vendor/login",
        search: { redirect: `/vendor/${params.id}${queryStr}` },
      });
    }

    // If seller, check IDOR: user can only access their own dashboard
    if (role === "seller" && user && user.id !== params.id) {
      throw redirect({
        to: "/vendor/$id",
        params: { id: user.id },
        search: { tab: search["tab"] || "overview", action: search["action"] },
      });
    }

    // Account freeze check
    if (user?.account_status === "FROZEN" || user?.accountStatus === "FROZEN") {
      if (search["tab"] !== "account-status") {
        throw redirect({
          to: "/vendor/$id",
          params: { id: params.id },
          search: { tab: "account-status" },
        });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Vendor Portal & Operations — RiderzPro" },
      {
        name: "description",
        content: "Manage shop listings, inventory, multi-vendor orders, customer reviews, and payouts.",
      },
      { property: "og:title", content: "Vendor Portal & Operations — RiderzPro" },
      { property: "og:description", content: "Vendor shop management and order fulfillment on RiderzPro marketplace." },
    ],
  }),
  component: VendorDashboardRoute,
});

function VendorDashboardRoute() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

  const handleTabChange = (newTab: string) => {
    navigate({
      to: "/vendor/$id",
      params: { id },
      search: { tab: newTab as VendorAllowedTab, action: undefined },
    });
  };

  const handleActionChange = (newAction?: string) => {
    navigate({
      to: "/vendor/$id",
      params: { id },
      search: { tab: search["tab"] || "overview", action: newAction },
    });
  };

  return (
    <VendorDashboard
      vendorId={id}
      initialTab={search["tab"] || "overview"}
      initialAction={search["action"]}
      onTabChange={handleTabChange}
      onActionChange={handleActionChange}
    />
  );
}

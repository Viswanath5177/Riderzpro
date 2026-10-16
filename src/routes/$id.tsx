import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerLayout, type CustomerTab } from "@/components/dashboard/CustomerLayout";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ShopTab } from "@/components/dashboard/ShopTab";
import { GarageTab } from "@/components/dashboard/GarageTab";
import { OrdersTab } from "@/components/dashboard/OrdersTab";
import { TrackingTab } from "@/components/dashboard/TrackingTab";
import { SavedTab } from "@/components/dashboard/SavedTab";
import { ServiceTab } from "@/components/dashboard/ServiceTab";
import { OffersTab } from "@/components/dashboard/OffersTab";
import { InvoicesTab } from "@/components/dashboard/InvoicesTab";
import { NotificationsTab } from "@/components/dashboard/NotificationsTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { SupportTab } from "@/components/dashboard/SupportTab";
import { AddressesTab } from "@/components/dashboard/AddressesTab";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { AddBikeModal } from "@/components/dashboard/AddBikeModal";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const CUSTOMER_ALLOWED_TABS = [
  "overview",
  "shop",
  "garage",
  "orders",
  "tracking",
  "saved",
  "service",
  "addresses",
  "offers",
  "invoices",
  "notifications",
  "settings",
  "support",
] as const;

export type CustomerAllowedTab = (typeof CUSTOMER_ALLOWED_TABS)[number];

const RESERVED_ROUTES = new Set([
  "shop",
  "cart",
  "garage",
  "orders",
  "login",
  "signup",
  "offers",
  "assistant",
  "dashboards",
  "track",
  "product",
  "api",
  "admin",
  "superadmin",
  "super-admin",
  "vendor",
  "assets",
  "auth",
  "dashboard",
  "favicon.ico",
]);

interface CustomerDashboardSearchParams {
  tab?: CustomerAllowedTab;
}

export const Route = createFileRoute("/$id")({
  validateSearch: (search: Record<string, unknown>): CustomerDashboardSearchParams => {
    const rawTab = typeof search["tab"] === "string" ? search["tab"] : "overview";
    const tab = CUSTOMER_ALLOWED_TABS.includes(rawTab as CustomerAllowedTab)
      ? (rawTab as CustomerAllowedTab)
      : "overview";
    return { tab };
  },
  beforeLoad: async ({ params, search }) => {
    if (typeof window === "undefined") {
      return;
    }

    const lowerId = params.id.toLowerCase();
    if (RESERVED_ROUTES.has(lowerId)) {
      return;
    }

    // Redirect vendor / admin ID prefixes
    if (lowerId.startsWith("sel_")) {
      throw redirect({
        to: "/vendor/$id",
        params: { id: params.id },
        search: { tab: (search as any)?.tab || "overview" },
      });
    }
    if (lowerId.startsWith("adm_")) {
      throw redirect({
        to: "/admin/$id",
        params: { id: params.id },
        search: { tab: (search as any)?.tab || "overview" },
      });
    }

    const role = await getCurrentRole();
    const user = await getCurrentUser();

    if (!role || !user) {
      throw redirect({
        to: "/login",
        search: { redirect: `/${params.id}${search["tab"] ? `?tab=${search["tab"]}` : ""}` },
      });
    }

    if (role === "SUPER_ADMIN" || role === "super_admin" || role === "ADMIN" || role === "admin") {
      throw redirect({
        to: "/admin/$id",
        params: { id: user.id || "adm_super_01" },
        search: { tab: "overview" },
      });
    }

    if (role === "seller") {
      throw redirect({
        to: "/vendor/$id",
        params: { id: user.id },
        search: { tab: "overview" },
      });
    }

    if (role === "customer") {
      // IDOR protection: if user is logged in as customer A, cannot access customer B's dashboard
      if (user.id !== params.id) {
        throw redirect({
          to: "/$id",
          params: { id: user.id },
          search: { tab: search["tab"] || "overview" },
        });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Customer Dashboard — RiderzPro" },
      {
        name: "description",
        content: "Manage your registered EVs, live parts dispatches, telemetry and doorstep technician bookings.",
      },
      { property: "og:title", content: "Customer Dashboard — RiderzPro" },
      { property: "og:description", content: "Automotive e-commerce and bike ownership platform." },
    ],
  }),
  component: CustomerDashboardRoute,
});

function CustomerDashboardRoute() {
  return (
    <ProtectedRoute>
      <CustomerDashboard />
    </ProtectedRoute>
  );
}

function CustomerDashboard() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const tab = (search["tab"] || "overview") as CustomerTab;

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);

  const handleTabChange = (newTab: CustomerTab) => {
    navigate({
      to: "/$id",
      params: { id },
      search: { tab: newTab as CustomerAllowedTab },
      replace: true,
    });
  };

  return (
    <>
      <CustomerLayout
        activeTab={tab}
        onTabChange={handleTabChange}
        onOpenBookingModal={() => setIsBookingOpen(true)}
      >
        {tab === "overview" && (
          <OverviewTab
            onTabChange={handleTabChange}
            onOpenBookingModal={() => setIsBookingOpen(true)}
            onOpenAddBikeModal={() => setIsAddBikeOpen(true)}
          />
        )}
        {tab === "shop" && <ShopTab />}
        {tab === "garage" && (
          <GarageTab
            onOpenAddBikeModal={() => setIsAddBikeOpen(true)}
            onOpenBookingModal={() => setIsBookingOpen(true)}
          />
        )}
        {tab === "orders" && <OrdersTab />}
        {tab === "tracking" && <TrackingTab />}
        {tab === "saved" && <SavedTab />}
        {tab === "service" && (
          <ServiceTab onOpenBookingModal={() => setIsBookingOpen(true)} />
        )}
        {tab === "addresses" && <AddressesTab />}
        {tab === "offers" && <OffersTab />}
        {tab === "invoices" && <InvoicesTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "settings" && <SettingsTab />}
        {tab === "support" && <SupportTab />}
      </CustomerLayout>

      {/* Global Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <AddBikeModal
        isOpen={isAddBikeOpen}
        onClose={() => setIsAddBikeOpen(false)}
      />
    </>
  );
}

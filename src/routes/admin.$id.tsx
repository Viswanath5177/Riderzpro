import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/admin/glass/Skeleton";
import { getAdminUser } from "@/lib/adminAuth";

const CombinedOperationsScreen = lazy(() =>
  import("@/components/admin/screens/CombinedOperationsScreen").then((m) => ({
    default: m.CombinedOperationsScreen,
  }))
);
const SellersScreen = lazy(() =>
  import("@/components/admin/screens/SellersScreen").then((m) => ({
    default: m.SellersScreen,
  }))
);
const ProductsScreen = lazy(() =>
  import("@/components/admin/screens/ProductsScreen").then((m) => ({
    default: m.ProductsScreen,
  }))
);
const OrdersScreen = lazy(() =>
  import("@/components/admin/screens/OrdersScreen").then((m) => ({
    default: m.OrdersScreen,
  }))
);
const CustomersScreen = lazy(() =>
  import("@/components/admin/screens/CustomersScreen").then((m) => ({
    default: m.CustomersScreen,
  }))
);
const PaymentsScreen = lazy(() =>
  import("@/components/admin/screens/PaymentsScreen").then((m) => ({
    default: m.PaymentsScreen,
  }))
);
const AnalyticsScreen = lazy(() =>
  import("@/components/admin/screens/AnalyticsScreen").then((m) => ({
    default: m.AnalyticsScreen,
  }))
);
const SettingsScreen = lazy(() =>
  import("@/components/admin/screens/SettingsScreen").then((m) => ({
    default: m.SettingsScreen,
  }))
);
const NotificationsScreen = lazy(() =>
  import("@/components/admin/screens/NotificationsScreen").then((m) => ({
    default: m.NotificationsScreen,
  }))
);
const OffersScreen = lazy(() =>
  import("@/components/admin/screens/OffersScreen").then((m) => ({
    default: m.OffersScreen,
  }))
);
const ReviewsScreen = lazy(() =>
  import("@/components/admin/screens/ReviewsScreen").then((m) => ({
    default: m.ReviewsScreen,
  }))
);
const FitmentScreen = lazy(() =>
  import("@/components/admin/screens/FitmentScreen").then((m) => ({
    default: m.FitmentScreen,
  }))
);

export const ADMIN_ALLOWED_TABS = [
  "overview",
  "orders",
  "shipments",
  "products",
  "categories",
  "customers",
  "vendors",
  "vendor_applications",
  "vendor_offers",
  "commissions",
  "reviews_moderation",
  "payments",
  "returns",
  "offers",
  "reports",
  "notifications",
  "integrations",
  "audit",
  "settings",
] as const;

export type AdminAllowedTab = (typeof ADMIN_ALLOWED_TABS)[number];

const STATIC_ADMIN_ROUTES = new Set(["login"]);

interface AdminSearchParams {
  tab?: AdminAllowedTab;
}

export const Route = createFileRoute("/admin/$id")({
  validateSearch: (search: Record<string, unknown>): AdminSearchParams => {
    const rawTab = typeof search["tab"] === "string" ? search["tab"] : "overview";
    const tab = ADMIN_ALLOWED_TABS.includes(rawTab as AdminAllowedTab)
      ? (rawTab as AdminAllowedTab)
      : "overview";
    return { tab };
  },
  beforeLoad: async ({ params, search }) => {
    if (typeof window === "undefined") {
      return;
    }

    const lowerId = params.id.toLowerCase();
    if (STATIC_ADMIN_ROUTES.has(lowerId)) {
      return;
    }

    const adminUser = await getAdminUser();
    if (!adminUser) {
      throw redirect({
        to: "/vendor/login",
        search: { redirect: `/admin/${params.id}${search["tab"] ? `?tab=${search["tab"]}` : ""}` },
      });
    }

    // Role check: ensure user is ADMIN or SUPER_ADMIN
    if (adminUser.role !== "admin") {
      throw redirect({ to: "/vendor/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Unified Operations Console — RiderzPro Admin" },
      { name: "description", content: "Unified administrative operations console with multi-tab governance and moderation." },
    ],
  }),
  component: AdminUnifiedDashboardPage,
});

function AdminUnifiedDashboardPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const tab = (search["tab"] || "overview") as AdminAllowedTab;

  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      {tab === "overview" && <CombinedOperationsScreen />}
      {(tab === "vendors" || tab === "vendor_applications") && <SellersScreen />}
      {(tab === "products" || tab === "vendor_offers") && <ProductsScreen />}
      {(tab === "orders" || tab === "shipments") && <OrdersScreen />}
      {tab === "customers" && <CustomersScreen />}
      {(tab === "payments" || tab === "commissions" || tab === "returns") && <PaymentsScreen />}
      {tab === "categories" && <FitmentScreen />}
      {tab === "reviews_moderation" && <ReviewsScreen />}
      {tab === "offers" && <OffersScreen />}
      {tab === "reports" && <AnalyticsScreen />}
      {tab === "notifications" && <NotificationsScreen />}
      {(tab === "settings" || tab === "integrations" || tab === "audit") && <SettingsScreen />}
    </Suspense>
  );
}

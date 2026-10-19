import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VendorRouteGuard, useVendorAuth } from "@/lib/vendorAuth";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import { useStore } from "@/lib/store";
import { VendorDashboardShell } from "@/components/vendor/dashboard/VendorDashboardShell";
import { OverviewSection } from "@/components/vendor/dashboard/OverviewSection";
import { OrdersSection } from "@/components/vendor/dashboard/OrdersSection";
import { useSellerOrders } from "@/components/vendor/sellerOrdersApi";
import { ProductsSection } from "@/components/vendor/dashboard/ProductsSection";
import { InventorySection } from "@/components/vendor/dashboard/InventorySection";
import { PricingSection } from "@/components/vendor/dashboard/PricingSection";
import { PaymentsSection } from "@/components/vendor/dashboard/PaymentsSection";
import { ReturnsSection } from "@/components/vendor/dashboard/ReturnsSection";
import { ReviewsSection } from "@/components/vendor/dashboard/ReviewsSection";
import { AnalyticsSection } from "@/components/vendor/dashboard/AnalyticsSection";
import { SettingsSection } from "@/components/vendor/dashboard/SettingsSection";
import { NotificationsSection } from "@/components/vendor/dashboard/NotificationsSection";
import { SupportSection } from "@/components/vendor/dashboard/SupportSection";

import { isMobileDevice } from "@/lib/native/app";

export const Route = createFileRoute("/vendor/dashboard")({
  head: () => ({
    meta: [
      { title: "Seller Dashboard — RiderzPro Vendor Central" },
      {
        name: "description",
        content: "Manage orders, catalogue listings, inventory stock, and payouts on RiderzPro.",
      },
    ],
  }),
  component: VendorDashboardRoute,
});

function VendorDashboardRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

  return (
    <VendorRouteGuard>
      <VendorDashboardContent />
    </VendorRouteGuard>
  );
}

function VendorDashboardContent() {
  const { vendor, currentVendor } = useVendorAuth();
  const activeVendor = vendor || currentVendor;
  const { products } = useVendorStore();
  const { orders } = useStore();
  const { orders: sellerOrders } = useSellerOrders();
  const navigate = useNavigate();

  const placedCount = sellerOrders.filter((o) => o.status === "PLACED").length;

  // Active section tab from URL or local state
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("tab") || "overview";
    }
    return "overview";
  });

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("tab");
      if (t) setActiveTab(t);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (!activeVendor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F6F8] p-4 text-center">
        <div className="max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-3">
          <h2 className="text-base font-bold text-gray-900">Vendor Session Required</h2>
          <p className="text-xs text-gray-500">
            Please sign in with your vendor credentials to access the dashboard.
          </p>
          <a
            href="/vendor/auth"
            className="inline-block rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition"
          >
            Go to Vendor Sign In
          </a>
        </div>
      </div>
    );
  }

  const vendorProducts = products.filter((p) => p.vendorId === activeVendor.id);

  return (
    <VendorDashboardShell
      vendor={activeVendor}
      activeSection={activeTab}
      onSelectSection={handleSelectTab}
      ordersBadge={placedCount}
    >
      {activeTab === "overview" && (
        <OverviewSection vendor={activeVendor} onNavigateTab={handleSelectTab} />
      )}
      {activeTab === "orders" && <OrdersSection vendor={activeVendor} />}
      {activeTab === "products" && <ProductsSection vendor={activeVendor} />}
      {activeTab === "inventory" && <InventorySection vendor={activeVendor} />}
      {activeTab === "pricing" && <PricingSection vendor={activeVendor} />}
      {activeTab === "payments" && <PaymentsSection vendor={activeVendor} />}
      {activeTab === "returns" && <ReturnsSection vendor={activeVendor} />}
      {activeTab === "reviews" && <ReviewsSection vendor={activeVendor} />}
      {activeTab === "analytics" && <AnalyticsSection vendor={activeVendor} />}
      {activeTab === "settings" && <SettingsSection vendor={activeVendor} />}
      {activeTab === "notifications" && <NotificationsSection vendor={activeVendor} />}
      {activeTab === "support" && <SupportSection vendor={activeVendor} />}
    </VendorDashboardShell>
  );
}

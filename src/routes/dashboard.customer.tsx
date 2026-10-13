import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import { getCurrentRole } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/dashboard/customer")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login", search: { redirect: "/dashboard/customer" } });
    if (role === "PRODUCT_ADMIN") throw redirect({ to: "/admin/products" });
    if (role === "SELLER_ADMIN") throw redirect({ to: "/admin/sellers" });
    if (role === "seller") throw redirect({ to: "/dashboard/vendor" });
    if (role !== "customer") throw redirect({ to: "/dashboard/admin" });
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
  const [tab, setTab] = useState<CustomerTab>("overview");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);

  useEffect(() => {
    const handleUrl = () => {
      if (typeof window !== "undefined") {
        const p = new URLSearchParams(window.location.search);
        const t = p.get("tab") as CustomerTab;
        if (t) setTab(t);
      }
    };
    handleUrl();
    window.addEventListener("popstate", handleUrl);
    return () => window.removeEventListener("popstate", handleUrl);
  }, []);

  return (
    <>
      <CustomerLayout
        activeTab={tab}
        onTabChange={(newTab) => {
          setTab(newTab);
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("tab", newTab);
            window.history.pushState({}, "", url.toString());
          }
        }}
        onOpenBookingModal={() => setIsBookingOpen(true)}
      >
        {tab === "overview" && (
          <OverviewTab
            onTabChange={setTab}
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
        {tab === "addresses" && <SettingsTab />}
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

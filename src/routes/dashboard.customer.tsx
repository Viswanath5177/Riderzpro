import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerLayout, type CustomerTab } from "@/components/dashboard/CustomerLayout";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { GarageTab } from "@/components/dashboard/GarageTab";
import { OrdersTab } from "@/components/dashboard/OrdersTab";
import { SavedTab } from "@/components/dashboard/SavedTab";
import { ServiceTab } from "@/components/dashboard/ServiceTab";
import { OffersTab } from "@/components/dashboard/OffersTab";
import { InvoicesTab } from "@/components/dashboard/InvoicesTab";
import { NotificationsTab } from "@/components/dashboard/NotificationsTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { SupportTab } from "@/components/dashboard/SupportTab";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { AddBikeModal } from "@/components/dashboard/AddBikeModal";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/dashboard/customer")({
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

  return (
    <>
      <CustomerLayout
        activeTab={tab}
        onTabChange={setTab}
        onOpenBookingModal={() => setIsBookingOpen(true)}
      >
        {tab === "overview" && (
          <OverviewTab
            onTabChange={setTab}
            onOpenBookingModal={() => setIsBookingOpen(true)}
            onOpenAddBikeModal={() => setIsAddBikeOpen(true)}
          />
        )}
        {tab === "garage" && (
          <GarageTab
            onOpenAddBikeModal={() => setIsAddBikeOpen(true)}
            onOpenBookingModal={() => setIsBookingOpen(true)}
          />
        )}
        {tab === "orders" && <OrdersTab />}
        {tab === "saved" && <SavedTab />}
        {tab === "service" && (
          <ServiceTab onOpenBookingModal={() => setIsBookingOpen(true)} />
        )}
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

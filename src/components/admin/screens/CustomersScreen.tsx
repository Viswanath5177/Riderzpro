import React, { useState } from "react";
import {
  Users,
  Bike,
  Package,
  Headphones,
  Ban,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassDrawer } from "../glass/GlassDrawer";
import { ConfirmDialog } from "../glass/ConfirmDialog";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminCustomer } from "@/mocks/admin/types";

export function CustomersScreen() {
  const { customers, bikes, orders, tickets, toggleCustomerBlock } = useAdminStore();
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const filterTabs = [
    { label: "All Customers", value: "ALL", count: customers.length },
    { label: "VIP Riders", value: "VIP", count: customers.filter((c) => c.status === "VIP").length },
    { label: "Active", value: "Active", count: customers.filter((c) => c.status === "Active").length },
    { label: "Blocked", value: "Blocked", count: customers.filter((c) => c.status === "Blocked").length },
  ];

  const columns: Column<AdminCustomer>[] = [
    {
      key: "name",
      header: "Customer",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-bold text-white text-xs shadow-xs">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[#111111] text-sm">{c.name}</p>
            <p className="text-xs text-[#4B5563] font-medium">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (c) => <span className="font-mono text-[#111111] font-semibold text-xs">{c.phone}</span>,
    },
    {
      key: "city",
      header: "City",
      sortable: true,
      render: (c) => <span className="text-[#111111] font-bold text-xs">{c.city}</span>,
    },
    {
      key: "garageBikes",
      header: "Garage EVs",
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <Bike className="h-3.5 w-3.5 text-[#E31E24]" />
          <span className="font-bold text-[#111111] text-xs">{c.garageBikes.length} registered</span>
        </div>
      ),
    },
    {
      key: "totalSpend",
      header: "Total Spend",
      sortable: true,
      render: (c) => (
        <span className="font-bold text-[#111111] tabular-nums text-xs">
          ₹{c.totalSpend.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (c) => <StatusBadge status={c.status} size="sm" />,
    },
  ];

  // Get orders of the selected customer
  const customerOrders = selectedCustomer ? orders.filter((o) => o.customerId === selectedCustomer.id) : [];
  const customerTickets = selectedCustomer ? tickets.filter((t) => t.customerId === selectedCustomer.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Customer Directory & EV Garages
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Manage registered EV owners, VIN vehicle telemetry, order histories and account statuses.
        </p>
      </div>

      {/* Data Table */}
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customer by name, email, phone or city..."
        searchKey={(c) => `${c.name} ${c.email} ${c.phone} ${c.city}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(c, filter) => c.status === filter}
        onRowClick={(cust) => setSelectedCustomer(cust)}
        keyExtractor={(c) => c.id}
        exportFileName="riderzpro_customers"
      />

      {/* Customer Profile Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        width="lg"
        title={selectedCustomer?.name}
        description={selectedCustomer ? `Member since ${selectedCustomer.registeredDate} · ${selectedCustomer.city}` : undefined}
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs text-[#111111]">
            {/* Header info card */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-display font-extrabold text-white text-base shadow-xs">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#111111] text-base">{selectedCustomer.name}</p>
                    <StatusBadge status={selectedCustomer.status} size="sm" />
                  </div>
                  <p className="text-[#4B5563] font-mono mt-0.5 font-medium">{selectedCustomer.phone}</p>
                  <p className="text-[#6B7280] font-medium">{selectedCustomer.email}</p>
                </div>
              </div>

              <GlassButton
                variant={selectedCustomer.status === "Blocked" ? "primary" : "destructive"}
                size="sm"
                onClick={() => setShowBlockDialog(true)}
              >
                {selectedCustomer.status === "Blocked" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Unblock Account</span>
                  </>
                ) : (
                  <>
                    <Ban className="h-3.5 w-3.5" />
                    <span>Block Account</span>
                  </>
                )}
              </GlassButton>
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>Primary Delivery Address</span>
              </p>
              <p className="text-[#111111] leading-relaxed font-semibold text-sm">{selectedCustomer.address}</p>
              <p className="text-[#4B5563] font-medium mt-1">Pincode: {selectedCustomer.pincode} · City: {selectedCustomer.city}</p>
            </div>

            {/* Registered Garage Bikes */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-2 flex items-center gap-1.5">
                <Bike className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>Registered Garage EVs ({selectedCustomer.garageBikes.length})</span>
              </p>

              <div className="space-y-2">
                {selectedCustomer.garageBikes.map((bikeId) => {
                  const bike = bikes.find((b) => b.id === bikeId);
                  return (
                    <div key={bikeId} className="flex items-center justify-between rounded-xl bg-gray-50/80 p-3 border border-[#E5E7EB]">
                      <div>
                        <p className="font-bold text-[#111111] text-sm">{bike?.model || "Electric Vehicle"}</p>
                        <p className="text-[11px] text-[#4B5563] font-medium">
                          {bike?.brand} · {bike?.voltage}V · Connector: {bike?.connectorType}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5">
                        VIN Verified
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Orders */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-2 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>Order History ({customerOrders.length})</span>
              </p>

              {customerOrders.length === 0 ? (
                <p className="text-[#6B7280] py-2 font-medium">No active orders found.</p>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {customerOrders.map((o) => (
                    <div key={o.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold text-[#111111] text-xs">{o.orderNumber}</p>
                        <p className="text-[11px] text-[#4B5563] font-medium">{o.items[0]?.productName || "Parts"}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#111111] text-xs">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                        <div className="mt-0.5">
                          <StatusBadge status={o.status} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Support Tickets */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <p className="text-[10px] font-bold uppercase text-[#6B7280] mb-2 flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>Support Inquiries ({customerTickets.length})</span>
              </p>

              {customerTickets.length === 0 ? (
                <p className="text-[#6B7280] py-2 font-medium">No open support tickets.</p>
              ) : (
                <div className="space-y-2">
                  {customerTickets.map((t) => (
                    <div key={t.id} className="rounded-xl bg-gray-50/80 p-3 border border-[#E5E7EB]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#111111] text-xs">{t.ticketNumber}</span>
                        <StatusBadge status={t.status} size="sm" />
                      </div>
                      <p className="mt-1 text-[#111111] font-semibold text-xs">{t.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </GlassDrawer>

      {/* Block / Unblock Confirm Dialog */}
      <ConfirmDialog
        isOpen={showBlockDialog}
        onClose={() => setShowBlockDialog(false)}
        onConfirm={() => {
          if (selectedCustomer) {
            toggleCustomerBlock(selectedCustomer.id);
            setSelectedCustomer({
              ...selectedCustomer,
              status: selectedCustomer.status === "Blocked" ? "Active" : "Blocked",
            });
          }
        }}
        title={selectedCustomer?.status === "Blocked" ? "Unblock Account?" : "Block Customer Account?"}
        description={
          selectedCustomer?.status === "Blocked"
            ? "This will restore full ordering and garage access for this user."
            : "This user will not be able to place new orders or use doorstep fleet services."
        }
        confirmLabel={selectedCustomer?.status === "Blocked" ? "Unblock Account" : "Block Customer"}
      />
    </div>
  );
}

import React, { useState } from "react";
import {
  Headphones,
  Send,
  User,
  Clock,
  Package,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassDrawer } from "../glass/GlassDrawer";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminTicket } from "@/mocks/admin/types";

export function SupportScreen() {
  const { tickets, replyToTicket, updateTicketStatus } = useAdminStore();
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [replyText, setReplyText] = useState("");

  const filterTabs = [
    { label: "All Tickets", value: "ALL", count: tickets.length },
    { label: "Open", value: "Open", count: tickets.filter((t) => t.status === "Open").length },
    { label: "In Progress", value: "In Progress", count: tickets.filter((t) => t.status === "In Progress").length },
    { label: "Resolved", value: "Resolved", count: tickets.filter((t) => t.status === "Resolved").length },
    { label: "Escalated", value: "Escalated", count: tickets.filter((t) => t.status === "Escalated").length },
  ];

  const columns: Column<AdminTicket>[] = [
    {
      key: "ticketNumber",
      header: "Ticket #",
      sortable: true,
      render: (t) => <span className="font-mono font-bold text-[#111111] text-xs">{t.ticketNumber}</span>,
    },
    {
      key: "customerName",
      header: "Customer",
      sortable: true,
      render: (t) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{t.customerName}</p>
          <p className="text-[10px] text-[#6B7280] font-medium">Order: {t.orderId || "General"}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject & Issue",
      render: (t) => (
        <div className="max-w-md">
          <p className="font-bold text-[#111111] text-xs truncate">{t.subject}</p>
          <span className="text-[10px] font-bold text-[#E31E24]">{t.category}</span>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (t) => (
        <span
          className={`font-bold text-xs ${
            t.priority === "High" ? "text-red-700" : t.priority === "Medium" ? "text-amber-700" : "text-[#4B5563]"
          }`}
        >
          {t.priority}
        </span>
      ),
    },
    {
      key: "assignedTo",
      header: "Assignee",
      render: (t) => <span className="text-[#111111] font-semibold text-xs">{t.assignedTo}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
  ];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyToTicket(selectedTicket.id, replyText.trim());
    setReplyText("");
    // Update local drawer state
    setSelectedTicket({
      ...selectedTicket,
      status: "In Progress",
      messages: [
        ...selectedTicket.messages,
        {
          id: `msg_${Date.now()}`,
          sender: "agent",
          senderName: "Operations Support",
          text: replyText.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Customer Support & Ticket Desk
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Live technical assistance, fitment queries, delivery escalations and order troubleshooting.
        </p>
      </div>

      {/* Main Table */}
      <DataTable
        data={tickets}
        columns={columns}
        searchPlaceholder="Search ticket #, customer or subject..."
        searchKey={(t) => `${t.ticketNumber} ${t.customerName} ${t.subject} ${t.category}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(t, f) => t.status === f}
        onRowClick={(ticket) => setSelectedTicket(ticket)}
        keyExtractor={(t) => t.id}
        exportFileName="riderzpro_support_tickets"
      />

      {/* Ticket Chat-Style Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        width="lg"
        title={selectedTicket ? `Ticket #${selectedTicket.ticketNumber}` : undefined}
        description={selectedTicket ? `Filed by ${selectedTicket.customerName} · ${selectedTicket.category}` : undefined}
      >
        {selectedTicket && (
          <div className="flex flex-col h-full space-y-4 text-xs text-[#111111]">
            {/* Status & Assignment Header */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3.5 border border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedTicket.status} size="sm" />
                <span className="text-[#4B5563] font-medium">Assigned: <strong className="text-[#111111]">{selectedTicket.assignedTo}</strong></span>
              </div>

              {selectedTicket.status !== "Resolved" ? (
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, "Resolved");
                    setSelectedTicket({ ...selectedTicket, status: "Resolved" });
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Resolved</span>
                </GlassButton>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Issue Closed
                </span>
              )}
            </div>

            {/* Subject Summary */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-2xs">
              <p className="font-bold text-[#111111] text-sm">{selectedTicket.subject}</p>
              <div className="mt-1 flex items-center gap-3 text-[#4B5563] text-[11px] font-medium">
                <span>Category: <strong className="text-[#E31E24]">{selectedTicket.category}</strong></span>
                <span>Priority: <strong className="text-[#111111]">{selectedTicket.priority}</strong></span>
                {selectedTicket.orderId && <span>Order: <strong className="font-mono text-[#111111]">{selectedTicket.orderId}</strong></span>}
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] p-2 pr-1">
              {selectedTicket.messages.map((msg) => {
                const isAgent = msg.sender === "agent";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        isAgent
                          ? "bg-red-50 border border-red-200 text-[#111111]"
                          : "bg-gray-100 border border-gray-200 text-[#111111]"
                      }`}
                    >
                      <p className="font-bold text-[10px] text-[#4B5563] mb-1">{msg.senderName}</p>
                      <p className="font-medium text-[#111111]">{msg.text}</p>
                      <p className="mt-1.5 text-[9px] text-[#6B7280] text-right font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="pt-2 border-t border-[#E5E7EB] flex gap-2">
              <input
                type="text"
                placeholder="Type reply to customer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-xs text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] shadow-2xs font-medium"
              />
              <GlassButton variant="primary" size="sm" type="submit" disabled={!replyText.trim()}>
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </GlassButton>
            </form>
          </div>
        )}
      </GlassDrawer>
    </div>
  );
}

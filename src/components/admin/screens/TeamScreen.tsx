import React, { useState } from "react";
import {
  ShieldAlert,
  UserPlus,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
  Mail,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput } from "../glass/GlassInput";
import { GlassSelect } from "../glass/GlassSelect";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassModal } from "../glass/GlassModal";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminTeamMember } from "@/mocks/admin/types";

export function TeamScreen() {
  const { team, inviteTeamMember, removeTeamMember } = useAdminStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminTeamMember["role"]>("Operations");

  const columns: Column<AdminTeamMember>[] = [
    {
      key: "name",
      header: "Team Member",
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-bold text-white text-xs shadow-xs">
            {m.avatarInitials}
          </div>
          <div>
            <p className="font-bold text-[#111111] text-sm">{m.name}</p>
            <p className="text-xs text-[#4B5563] font-medium">{m.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Console Role",
      sortable: true,
      render: (m) => (
        <span
          className={`font-bold text-xs ${
            m.role === "Super Admin" ? "text-[#E31E24]" : m.role === "Operations" ? "text-sky-700" : "text-[#4B5563]"
          }`}
        >
          {m.role}
        </span>
      ),
    },
    {
      key: "permissions",
      header: "Access Rights",
      render: (m) => (
        <div className="flex gap-1 text-[10px]">
          {m.permissions.orders && <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold">Orders</span>}
          {m.permissions.sellers && <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold">Sellers</span>}
          {m.permissions.payments && <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold">Finance</span>}
          {m.permissions.settings && <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[#111111] font-bold">Settings</span>}
        </div>
      ),
    },
    {
      key: "lastActive",
      header: "Activity",
      render: (m) => <span className="text-[#6B7280] text-[11px] font-medium">{m.lastActive}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (m) => <StatusBadge status={m.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (m) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          {m.role !== "Super Admin" && (
            <button
              onClick={() => removeTeamMember(m.id)}
              className="rounded-lg bg-red-100 hover:bg-red-200 p-1.5 text-red-700 transition cursor-pointer"
              title="Revoke console access"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    inviteTeamMember({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      permissions: {
        orders: true,
        sellers: role === "Super Admin" || role === "Operations",
        riders: role === "Super Admin" || role === "Operations",
        products: role === "Super Admin" || role === "Operations",
        payments: role === "Super Admin" || role === "Finance",
        settings: role === "Super Admin",
      },
    });

    setName("");
    setEmail("");
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Team Members & Role-Based Permissions
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Manage administrative staff, operations specialists, finance managers and granular module access.
          </p>
        </div>

        <GlassButton variant="primary" size="md" onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Invite Team Member</span>
        </GlassButton>
      </div>

      {/* Main Table */}
      <DataTable
        data={team}
        columns={columns}
        searchPlaceholder="Search team member by name or email..."
        searchKey={(m) => `${m.name} ${m.email} ${m.role}`}
        keyExtractor={(m) => m.id}
        exportFileName="riderzpro_team"
      />

      {/* Role Permission Matrix Card */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
        <h3 className="font-bold text-sm text-[#111111] mb-3 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-[#E31E24]" />
          <span>Role Permission Capability Matrix</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] uppercase font-bold bg-gray-50/70">
                <th className="p-3">Role Level</th>
                <th className="p-3 text-center">Orders & Dispatches</th>
                <th className="p-3 text-center">Sellers & KYC</th>
                <th className="p-3 text-center">Fleet GPS</th>
                <th className="p-3 text-center">Payouts & Finance</th>
                <th className="p-3 text-center">Global Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-medium">
              <tr>
                <td className="p-3 font-bold text-[#E31E24]">Super Admin</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-sky-800">Operations Lead</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-[#6B7280]">Read Only</td>
                <td className="p-3 text-center text-gray-400">No Access</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#374151]">Support Specialist</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-[#6B7280]">Read Only</td>
                <td className="p-3 text-center text-[#6B7280]">Read Only</td>
                <td className="p-3 text-center text-gray-400">No Access</td>
                <td className="p-3 text-center text-gray-400">No Access</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-800">Finance Manager</td>
                <td className="p-3 text-center text-[#6B7280]">Read Only</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-gray-400">No Access</td>
                <td className="p-3 text-center text-emerald-800 font-bold">Full Access</td>
                <td className="p-3 text-center text-gray-400">No Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      <GlassModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        maxWidth="md"
        title="Invite New Console User"
        description="Assign a security role and grant immediate operations access."
      >
        <form onSubmit={handleInvite} className="space-y-4 text-xs text-[#111111]">
          <div>
            <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
              Full Name
            </label>
            <GlassInput
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anjali Verma"
            />
          </div>

          <div>
            <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
              Corporate Email Address
            </label>
            <GlassInput
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anjali.v@riderzpro.com"
            />
          </div>

          <div>
            <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
              Assigned Role
            </label>
            <GlassSelect
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              options={[
                { value: "Operations", label: "Operations Specialist (Orders, Riders, KYC)" },
                { value: "Support", label: "Customer Support Specialist (Tickets, Reviews)" },
                { value: "Finance", label: "Finance & Accounts (Payouts, Commissions)" },
                { value: "Super Admin", label: "Super Admin (Full Root System Access)" },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
            <GlassButton type="button" variant="secondary" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Send Console Invite
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}

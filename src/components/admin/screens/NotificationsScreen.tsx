import React, { useState } from "react";
import {
  Bell,
  Send,
  Smartphone,
  Mail,
  MessageSquare,
  Users,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput } from "../glass/GlassInput";
import { GlassSelect } from "../glass/GlassSelect";
import { DataTable, Column } from "../glass/DataTable";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminNotificationHistory } from "@/mocks/admin/types";

export function NotificationsScreen() {
  const { notifications, sendNotificationCampaign } = useAdminStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<AdminNotificationHistory["channel"]>("Push Notification");
  const [targetAudience, setTargetAudience] = useState<AdminNotificationHistory["targetAudience"]>("Bengaluru Users");

  const columns: Column<AdminNotificationHistory>[] = [
    {
      key: "title",
      header: "Campaign Title",
      sortable: true,
      render: (n) => (
        <div>
          <p className="font-bold text-[#111111] text-sm">{n.title}</p>
          <p className="text-xs text-[#4B5563] font-medium line-clamp-1 mt-0.5">{n.body}</p>
        </div>
      ),
    },
    {
      key: "channel",
      header: "Channel",
      render: (n) => (
        <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-[#E31E24]">
          {n.channel}
        </span>
      ),
    },
    {
      key: "targetAudience",
      header: "Audience Segment",
      render: (n) => <span className="font-bold text-[#111111] text-xs">{n.targetAudience}</span>,
    },
    {
      key: "reachCount",
      header: "Delivered To",
      sortable: true,
      render: (n) => (
        <span className="font-bold text-[#111111] tabular-nums text-xs">
          {n.reachCount.toLocaleString("en-IN")} users
        </span>
      ),
    },
    {
      key: "openRate",
      header: "Engagement Rate",
      render: (n) => <span className="font-bold text-emerald-700 text-xs">{n.openRate}</span>,
    },
    {
      key: "sentAt",
      header: "Dispatched",
      sortable: true,
      render: (n) => (
        <span className="text-[11px] text-[#6B7280] font-medium">
          {new Date(n.sentAt).toLocaleDateString("en-IN")}
        </span>
      ),
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    sendNotificationCampaign(title.trim(), body.trim(), channel, targetAudience);
    setTitle("");
    setBody("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Broadcast Communications & Notification Engine
        </h1>
        <p className="text-sm text-[#4B5563] font-medium mt-1">
          Push notifications, SMS dispatch alerts and email newsletters across customer segments and riders.
        </p>
      </div>

      {/* Split Compose & Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
            <h3 className="font-bold text-sm text-[#111111] mb-4 flex items-center gap-2">
              <Send className="h-4 w-4 text-[#E31E24]" />
              <span>Compose Message Broadcast</span>
            </h3>

            <form onSubmit={handleSend} className="space-y-4 text-xs text-[#111111]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                    Delivery Channel
                  </label>
                  <GlassSelect
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    options={[
                      { value: "Push Notification", label: "Mobile Push Notification" },
                      { value: "SMS", label: "Priority SMS Broadcast" },
                      { value: "Email", label: "Email Newsletter" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                    Target Audience Segment
                  </label>
                  <GlassSelect
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    options={[
                      { value: "Bengaluru Users", label: "Bengaluru Hub Users (1,420)" },
                      { value: "Active Riders", label: "Active Delivery Riders (142)" },
                      { value: "All Customers", label: "All Registered Customers (2,840)" },
                      { value: "High-Value Buyers", label: "High-Value VIP Buyers (640)" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                  Notification Header / Subject
                </label>
                <GlassInput
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ⚡ Express 3-Hour Delivery Live in Indiranagar"
                />
              </div>

              <div>
                <label className="block text-[#374151] font-bold mb-1 uppercase text-[10px]">
                  Message Body
                </label>
                <textarea
                  rows={3}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type message content here..."
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#E31E24] shadow-2xs font-medium"
                />
              </div>

              <div className="flex justify-end pt-2">
                <GlassButton variant="primary" size="md" type="submit" disabled={!title.trim() || !body.trim()}>
                  <Send className="h-4 w-4" />
                  <span>Send Broadcast Now</span>
                </GlassButton>
              </div>
            </form>
          </div>
        </div>

        {/* Live Mobile Device Preview */}
        <div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 flex flex-col items-center text-center shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#6B7280] mb-4 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-[#E31E24]" />
              <span>Live Phone Notification Preview</span>
            </h3>

            {/* Mobile frame */}
            <div className="w-64 rounded-[32px] border-4 border-gray-800 bg-gray-950 p-3 shadow-2xl relative text-left">
              {/* Speaker notch */}
              <div className="mx-auto h-3 w-16 rounded-full bg-gray-800 mb-3" />

              {/* Push notification banner */}
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span className="font-bold text-[#E31E24] flex items-center gap-1">
                    <Bell className="h-2.5 w-2.5" /> RIDERZPRO
                  </span>
                  <span>now</span>
                </div>
                <p className="font-bold text-[#111111] text-xs leading-tight">
                  {title || "Notification Title Preview"}
                </p>
                <p className="text-[11px] text-[#4B5563] leading-normal line-clamp-3 font-medium">
                  {body || "Your message body will appear here on customer lockscreens."}
                </p>
              </div>

              <p className="text-center text-[10px] text-gray-500 mt-6 font-mono">RiderzPro OS 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <DataTable
        data={notifications}
        columns={columns}
        searchPlaceholder="Search past campaigns..."
        searchKey="title"
        keyExtractor={(n) => n.id}
        exportFileName="riderzpro_notifications_history"
      />
    </div>
  );
}

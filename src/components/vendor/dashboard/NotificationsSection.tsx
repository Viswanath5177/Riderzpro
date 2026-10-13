import React from "react";
import {
  Bell,
  CheckCircle2,
  Package,
  AlertTriangle,
  IndianRupee,
  Clock,
  Sparkles,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Vendor } from "@/lib/vendor/types";
import { useVendorStore } from "@/lib/vendor/vendorStore";

interface NotificationsSectionProps {
  vendor: Vendor;
}

export function NotificationsSection({ vendor }: NotificationsSectionProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useVendorStore();
  const vendorNotifications = notifications.filter((n) => n.vendorId === vendor.id);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "approval":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "payout":
        return <IndianRupee className="h-4 w-4 text-purple-600" />;
      case "stock":
        return <AlertTriangle className="h-4 w-4 text-rose-600" />;
      default:
        return <Bell className="h-4 w-4 text-[#E31E24]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-black text-xl text-gray-900">Notifications & Alerts</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time updates regarding new orders, catalog moderation results, and settlement payouts.
          </p>
        </div>

        <button
          onClick={() => {
            markAllNotificationsRead?.();
            toast.success("Marked all notifications as read");
          }}
          className="text-xs font-bold text-[#E31E24] hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {/* List */}
      {vendorNotifications.length > 0 ? (
        <div className="space-y-3">
          {vendorNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`rounded-2xl border p-4 transition cursor-pointer flex items-start gap-3.5 ${
                !n.read
                  ? "bg-red-50/40 border-red-200 shadow-2xs"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="h-9 w-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-2xs">
                {getIcon(n.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-gray-900">{n.title}</h4>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : n.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
              </div>

              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-[#E31E24] shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No notifications</h3>
          <p className="text-xs text-gray-500 mt-0.5">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  PackageCheck,
  Store,
  ShieldAlert,
  AlertCircle,
  Clock,
  Sparkles,
  Inbox,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export interface DashboardNotification {
  id: string;
  user_id: string;
  user_role: string;
  type: string;
  title: string;
  message: string;
  entity_id?: string | null;
  target_route?: string | null;
  is_read: number;
  created_at: string;
  read_at?: string | null;
}

interface Props {
  role?: string;
  userId?: string;
  className?: string;
  isDarkTheme?: boolean;
}

export function DashboardNotificationBell({
  role: propRole,
  userId: propUserId,
  className = "",
  isDarkTheme = false,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const effectiveUserId = propUserId || user?.id || "";
  const effectiveRole = propRole || user?.role || "customer";

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const url = new URL("/api/notifications", window.location.origin);
      if (effectiveUserId) url.searchParams.set("user_id", effectiveUserId);
      if (effectiveRole) url.searchParams.set("role", effectiveRole);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // Quiet background failure
    }
  };

  // Poll on mount and interval
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // 20s near-real-time polling
    return () => clearInterval(interval);
  }, [effectiveUserId, effectiveRole]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);

      await fetch("/api/notifications/read-all", {
        method: "POST",
        credentials: "include",
      });
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all as read.");
    } finally {
      setIsLoading(false);
    }
  };

  // Click notification to navigate
  const handleNotificationClick = (item: DashboardNotification) => {
    if (!item.is_read) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);
    if (item.target_route) {
      // Parse query params or pure path
      navigate({ to: item.target_route as any });
    }
  };

  // Icon mapping
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_placed":
      case "new_order_received":
      case "marketplace_order":
        return <PackageCheck className="h-4 w-4 text-[#E31E24]" />;
      case "store_approved":
      case "product_approved":
      case "change_request_approved":
        return <Check className="h-4 w-4 text-emerald-500" />;
      case "store_rejected":
      case "product_rejected":
      case "change_request_rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "vendor_review_required":
      case "vendor_change_request":
        return <Store className="h-4 w-4 text-amber-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-blue-500" />;
    }
  };

  // Time format
  const formatTime = (ts: string) => {
    if (!ts) return "Just now";
    try {
      const date = new Date(ts);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return ts;
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Bell Button */}
      <button
        type="button"
        id="dashboard-notification-bell"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="View notifications"
        className={`relative p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          isDarkTheme
            ? "text-gray-300 hover:text-white hover:bg-gray-800"
            : "text-gray-600 hover:text-black hover:bg-gray-100"
        } ${isOpen ? (isDarkTheme ? "bg-gray-800 text-white" : "bg-gray-100 text-black") : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E31E24] px-1 text-[10px] font-black text-white shadow-xs animate-in zoom-in-50 duration-150">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
            isDarkTheme
              ? "bg-[#181B22] border-gray-800 text-gray-200"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          {/* Header */}
          <div
            className={`p-3.5 px-4 flex items-center justify-between border-b ${
              isDarkTheme ? "border-gray-800 bg-[#161920]" : "border-gray-100 bg-gray-50/70"
            }`}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={isLoading}
                  className="text-xs text-[#E31E24] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400">
                  <Inbox className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  You're all caught up!
                </h4>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                  When new orders, approvals, or operational updates occur, they'll appear right here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 px-4 transition-colors flex items-start gap-3 cursor-pointer group ${
                    !item.is_read
                      ? isDarkTheme
                        ? "bg-red-950/15 hover:bg-red-950/25"
                        : "bg-red-50/30 hover:bg-red-50/60"
                      : isDarkTheme
                      ? "hover:bg-gray-800/50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center mt-0.5 border ${
                      isDarkTheme
                        ? "bg-gray-800 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          !item.is_read ? "text-[#111111] dark:text-white" : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                        {formatTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.target_route && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-[#E31E24] group-hover:underline">
                        <span>View details</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Unread indicator / mark read button */}
                  {!item.is_read && (
                    <button
                      type="button"
                      title="Mark as read"
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      className="shrink-0 p-1 rounded-full text-[#E31E24] hover:bg-[#E31E24]/10 transition"
                    >
                      <span className="block h-2 w-2 rounded-full bg-[#E31E24]" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

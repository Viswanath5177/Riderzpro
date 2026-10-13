import React, { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  ShieldCheck,
  Command,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useAdminAuth } from "@/lib/adminAuth";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { cn } from "@/lib/utils";

export interface AdminTopBarProps {
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
}

export function AdminTopBar({ onOpenCommandPalette, onOpenMobileMenu }: AdminTopBarProps) {
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch live notifications including seller registrations
  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDbNotifications(res.data);
          setUnreadCount(res.unreadCount ?? res.data.length);
        }
      })
      .catch((err) => {
        console.log("[Admin TopBar Notif fetch notice]:", err.message);
      });
  }, []);

  // Generate breadcrumb from path
  const segments = pathname.split("/").filter(Boolean);
  const currentTitle = segments.length > 1 ? segments[1].replace(/-/g, " ") : "Dashboard";

  return (
    <header className="admin-glass-card sticky top-4 z-40 mb-6 flex h-16 items-center justify-between rounded-3xl border border-[#E5E7EB] bg-white/95 px-4 sm:px-6 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-[#0c101a]/95">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-[#4B5563] lg:hidden hover:bg-gray-200 hover:text-[#111111] transition cursor-pointer dark:bg-white/10 dark:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold">
          <Link to="/admin" className="text-[#6B7280] hover:text-[#E31E24] transition dark:text-zinc-400">
            Admin
          </Link>
          <ChevronRight className="h-3 w-3 text-[#9CA3AF]" />
          <span className="capitalize text-[#111111] font-bold dark:text-white">{currentTitle}</span>
        </nav>
      </div>

      {/* Right Controls: Command Palette, Bell, Theme, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger Button (Ctrl/Cmd+K) */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-gray-50 px-3.5 py-2 text-xs text-[#6B7280] hover:border-gray-300 hover:bg-gray-100 hover:text-[#111111] transition shadow-2xs cursor-pointer dark:border-white/15 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white"
        >
          <Search className="h-3.5 w-3.5 text-[#6B7280]" />
          <span>Quick search...</span>
          <span className="flex items-center gap-1 rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-[#4B5563] font-mono dark:bg-white/10 dark:text-zinc-300">
            <Command className="h-2.5 w-2.5" /> K
          </span>
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenCommandPalette}
          aria-label="Search"
          className="flex sm:hidden h-9 w-9 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-gray-50 text-[#6B7280] hover:text-[#111111]"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-gray-50 text-[#4B5563] hover:text-[#111111] hover:bg-gray-100 transition cursor-pointer dark:border-white/15 dark:bg-white/10 dark:text-zinc-300 dark:hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E31E24] px-1 text-[9px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="admin-glass-card absolute right-0 top-12 z-50 w-84 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-xl backdrop-blur-3xl animate-in fade-in duration-150 dark:border-white/20 dark:bg-zinc-950/95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">Seller & System Alerts</p>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#E31E24]">
                  {unreadCount} Pending
                </span>
              </div>

              <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
                {dbNotifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#6B7280]">No registration alerts yet.</p>
                ) : (
                  dbNotifications.slice(0, 5).map((n) => (
                    <Link
                      key={n.id}
                      to="/admin/sellers"
                      onClick={() => setShowNotifications(false)}
                      className="block rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5 hover:bg-red-50/40 hover:border-red-200 transition dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-[#111111] truncate dark:text-white">{n.title}</p>
                        {n.isPending && (
                          <span className="rounded-full bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 font-bold shrink-0">
                            Review
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-[#6B7280] line-clamp-2 dark:text-zinc-400">{n.body}</p>
                    </Link>
                  ))
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 text-center dark:border-white/10">
                <Link
                  to="/admin/sellers"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#E31E24] hover:underline"
                >
                  Go to Seller KYC Approval Queue →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
            className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-gray-50 p-1 pr-2.5 hover:border-gray-300 transition cursor-pointer dark:border-white/15 dark:bg-white/10"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E31E24] text-xs font-bold text-white shadow-xs">
              VM
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#111111] dark:text-white">
              Vikram
            </span>
          </button>

          {showUserMenu && (
            <div className="admin-glass-card absolute right-0 top-12 z-50 w-56 rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-xl backdrop-blur-3xl animate-in fade-in duration-150 text-xs dark:border-white/20 dark:bg-zinc-950/95">
              <div className="p-3 border-b border-gray-100 dark:border-white/10">
                <p className="font-bold text-[#111111] dark:text-white">{adminUser?.name || "Vikram Malhotra"}</p>
                <p className="text-[11px] text-[#6B7280] dark:text-zinc-400">{adminUser?.email || "admin@riderzpro.com"}</p>
                <span className="mt-1.5 inline-block rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-[#E31E24]">
                  Super Admin
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/admin/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-[#4B5563] hover:bg-gray-100 hover:text-[#111111] transition dark:text-zinc-300 dark:hover:bg-white/10"
                >
                  <span>Console Settings</span>
                </Link>
                <a
                  href="/"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-[#4B5563] hover:bg-gray-100 hover:text-[#111111] transition dark:text-zinc-300 dark:hover:bg-white/10"
                >
                  <span>Back to Store</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="pt-1 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-semibold text-[#E31E24] hover:bg-red-50 transition cursor-pointer"
                >
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

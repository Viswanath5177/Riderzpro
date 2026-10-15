import React, { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  Store,
  Bike,
  Box,
  Wrench,
  CreditCard,
  Tag,
  Headphones,
  Star,
  ShieldCheck,
  BarChart3,
  Bot,
  Bell,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/site/bits";
import { useAdminAuth } from "@/lib/adminAuth";
import { cn } from "@/lib/utils";

export interface NavGroup {
  title: string;
  items: {
    title: string;
    to: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: "Core Operations",
    items: [
      { title: "Operations Console", to: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
      { title: "Sellers & KYC", to: "/admin/sellers", icon: <Store className="h-4 w-4" /> },
      { title: "Product Approvals", to: "/admin/products", icon: <ShieldCheck className="h-4 w-4" /> },
    ],
  },
  {
    title: "Performance & Growth",
    items: [
      { title: "Analytics & Metrics", to: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: "Platform Administration",
    items: [
      { title: "Settings", to: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

export interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onItemClick?: () => void;
}

export function AdminSidebar({ isCollapsed, onToggleCollapse, onItemClick }: AdminSidebarProps) {
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const [pendingKycCount, setPendingKycCount] = useState<number>(0);
  const [pendingProductsCount, setPendingProductsCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/admin/sellers/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.metrics?.pendingSellers !== undefined) {
          setPendingKycCount(res.data.metrics.pendingSellers);
        }
      })
      .catch(() => {});

    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const pending = res.data.filter((p: any) => p.verification_status === "pending_approval").length;
          setPendingProductsCount(pending);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const isSuperAdmin =
    adminUser?.role === ("SUPER_ADMIN" as any) ||
    adminUser?.roleTitle?.toLowerCase().includes("super") ||
    adminUser?.email === "admin@riderzpro.com" ||
    pathname.startsWith("/superadmin");

  const navGroups = React.useMemo(() => {
    const groups: NavGroup[] = [];

    if (isSuperAdmin) {
      groups.push({
        title: "Executive Platform",
        items: [
          {
            title: "Super Admin Console",
            to: "/superadmin",
            icon: <ShieldAlert className="h-4 w-4 text-[#E31E24]" />,
          },
        ],
      });
    }

    groups.push({
      title: "Core Operations",
      items: [
        {
          title: "Operations Console",
          to: "/admin",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          title: "Sellers & KYC",
          to: "/admin/sellers",
          icon: <Store className="h-4 w-4" />,
          badge: pendingKycCount > 0 ? String(pendingKycCount) : undefined,
        },
        {
          title: "Product Approvals",
          to: "/admin/products",
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: pendingProductsCount > 0 ? String(pendingProductsCount) : undefined,
        },
      ],
    });

    groups.push({
      title: "Performance & Growth",
      items: [
        {
          title: "Analytics & Metrics",
          to: "/admin/analytics",
          icon: <BarChart3 className="h-4 w-4" />,
        },
      ],
    });

    groups.push({
      title: "Platform Administration",
      items: [
        {
          title: "Settings",
          to: "/admin/settings",
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    });

    return groups;
  }, [isSuperAdmin, pendingKycCount, pendingProductsCount]);

  return (
    <aside
      className={cn(
        "admin-glass-card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white/95 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c101a]/95",
        isCollapsed ? "w-20 p-3" : "w-64 p-4.5"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-white/10">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <Logo className="flex items-center" imgClassName="h-10 sm:h-11 w-auto" />
              <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#E31E24] border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
                {pathname.startsWith("/superadmin") ? "SUPER ADMIN" : "OPERATIONS"}
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E31E24] font-display font-extrabold text-white text-base shadow-sm">
              {pathname.startsWith("/superadmin") ? "SA" : "OP"}
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-xl bg-gray-100 text-[#4B5563] hover:bg-gray-200 hover:text-[#111111] transition cursor-pointer dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20 dark:hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Grouped Nav Items with animated pill indicator */}
        <nav className="mt-4 space-y-5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-zinc-500">
                  {group.title}
                </p>
              )}

              {group.items.map((item) => {
                const isActive = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onItemClick}
                    title={isCollapsed ? item.title : undefined}
                    className={cn(
                      "relative flex items-center rounded-2xl px-3 py-2 text-xs font-semibold transition-all select-none group",
                      isActive
                        ? "text-white"
                        : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-100/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    {/* Active Background Pill in Signature RiderzPro Red */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#ff474d] shadow-sm shadow-red-500/25 transition-all"
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-3">
                      <span className={cn(isActive ? "text-white" : "text-[#6B7280] group-hover:text-[#111111] dark:text-zinc-400 dark:group-hover:text-white")}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </span>

                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          "relative z-10 ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-red-50 text-[#E31E24] border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Card & Sign out */}
      <div className="pt-3 border-t border-[#E5E7EB] dark:border-white/10">
        {!isCollapsed ? (
          <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-2.5 border border-[#E5E7EB] dark:bg-white/[0.04] dark:border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E31E24] font-bold text-white text-xs shadow-sm">
                {adminUser?.name ? adminUser.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "OP"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#111111] dark:text-white">{adminUser?.name || "Operations Admin"}</p>
                <p className="truncate text-[10px] text-[#6B7280] dark:text-zinc-400">
                  {pathname.startsWith("/superadmin") ? "Super Administrator" : adminUser?.roleTitle || "Operations Administrator"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign out from Admin Console"
              className="rounded-xl p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-[#E31E24] transition cursor-pointer dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            title="Sign out"
            className="flex h-10 w-full items-center justify-center rounded-2xl text-[#6B7280] hover:bg-red-50 hover:text-[#E31E24] transition cursor-pointer dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

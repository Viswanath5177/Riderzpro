import React from "react";
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
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/site/bits";
import { useAdminAuth } from "@/lib/adminAuth";
import { useAdminStore } from "@/mocks/admin/adminStore";
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
      { title: "Dashboard", to: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
      { title: "Orders", to: "/admin/orders", icon: <Package className="h-4 w-4" />, badge: "42" },
      { title: "Riders & Fleet", to: "/admin/riders", icon: <Bike className="h-4 w-4" />, badge: "142" },
      { title: "Sellers & KYC", to: "/admin/sellers", icon: <Store className="h-4 w-4" />, badge: "2" },
      { title: "Customers", to: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    title: "Catalog & Fitment",
    items: [
      { title: "Product Approvals", to: "/admin/approvals", icon: <CheckCircle2 className="h-4 w-4" /> },
      { title: "Products & Stock", to: "/admin/products", icon: <Box className="h-4 w-4" /> },
      { title: "Bikes & Fitment", to: "/admin/fitment", icon: <Wrench className="h-4 w-4" /> },
    ],
  },
  {
    title: "Finance & Growth",
    items: [
      { title: "Payments & Payouts", to: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
      { title: "Offers & Coupons", to: "/admin/offers", icon: <Tag className="h-4 w-4" /> },
      { title: "Analytics & SLA", to: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: "Customer Quality",
    items: [
      { title: "Support Tickets", to: "/admin/support", icon: <Headphones className="h-4 w-4" />, badge: "3" },
      { title: "Review Moderation", to: "/admin/reviews", icon: <Star className="h-4 w-4" /> },
      { title: "Warranty & Returns", to: "/admin/warranty", icon: <ShieldCheck className="h-4 w-4" /> },
    ],
  },
  {
    title: "Platform Administration",
    items: [
      { title: "AI Assistant Logs", to: "/admin/ai-assistant", icon: <Bot className="h-4 w-4" /> },
      { title: "Notifications", to: "/admin/notifications", icon: <Bell className="h-4 w-4" /> },
      { title: "Team & Roles", to: "/admin/team", icon: <ShieldAlert className="h-4 w-4" /> },
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
  const { sellers, products } = useAdminStore();
  const location = useLocation();
  const pathname = location.pathname;

  const pendingSellersCount = sellers.filter((s) => s.kycStatus === "Pending").length;
  const pendingProductsCount = products.filter(
    (p) => p.status === "Pending Review" || (p.vendorProductRecord && p.vendorProductRecord.status === "pending_review")
  ).length;

  const navGroups: NavGroup[] = [
    {
      title: "Core Operations",
      items: [
        { title: "Dashboard", to: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
        { title: "Orders", to: "/admin/orders", icon: <Package className="h-4 w-4" />, badge: "42" },
        { title: "Riders & Fleet", to: "/admin/riders", icon: <Bike className="h-4 w-4" />, badge: "142" },
        {
          title: "Sellers & KYC",
          to: "/admin/sellers",
          icon: <Store className="h-4 w-4" />,
          badge: pendingSellersCount > 0 ? String(pendingSellersCount) : undefined,
        },
        { title: "Customers", to: "/admin/customers", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "Catalog & Fitment",
      items: [
        {
          title: "Product Approvals",
          to: "/admin/approvals",
          icon: <CheckCircle2 className="h-4 w-4" />,
          badge: pendingProductsCount > 0 ? String(pendingProductsCount) : undefined,
        },
        { title: "Products & Stock", to: "/admin/products", icon: <Box className="h-4 w-4" /> },
        { title: "Bikes & Fitment", to: "/admin/fitment", icon: <Wrench className="h-4 w-4" /> },
      ],
    },
    {
      title: "Finance & Growth",
      items: [
        { title: "Payments & Payouts", to: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
        { title: "Offers & Coupons", to: "/admin/offers", icon: <Tag className="h-4 w-4" /> },
        { title: "Analytics & SLA", to: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
      ],
    },
    {
      title: "Customer Quality",
      items: [
        { title: "Support Tickets", to: "/admin/support", icon: <Headphones className="h-4 w-4" />, badge: "3" },
        { title: "Review Moderation", to: "/admin/reviews", icon: <Star className="h-4 w-4" /> },
        { title: "Warranty & Returns", to: "/admin/warranty", icon: <ShieldCheck className="h-4 w-4" /> },
      ],
    },
    {
      title: "Platform Administration",
      items: [
        { title: "AI Assistant Logs", to: "/admin/ai-assistant", icon: <Bot className="h-4 w-4" /> },
        { title: "Notifications", to: "/admin/notifications", icon: <Bell className="h-4 w-4" /> },
        { title: "Team & Roles", to: "/admin/team", icon: <ShieldAlert className="h-4 w-4" /> },
        { title: "Settings", to: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ];

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
                ADMIN
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E31E24] font-display font-extrabold text-white text-base shadow-sm">
              R
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
                VM
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#111111] dark:text-white">{adminUser?.name || "Vikram Malhotra"}</p>
                <p className="truncate text-[10px] text-[#6B7280] dark:text-zinc-400">{adminUser?.roleTitle || "Super Admin"}</p>
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

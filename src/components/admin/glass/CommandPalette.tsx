import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
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
  ArrowRight,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SHOW_ADMIN_SELLERS } from "../mockFlags";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Action";
  icon: React.ReactNode;
  to: string;
  badge?: string;
}

const COMMANDS: CommandItem[] = [
  { id: "nav-dash", title: "Executive Dashboard", category: "Navigation", icon: <LayoutDashboard className="h-4 w-4" />, to: "/admin" },
  { id: "nav-orders", title: "Live Orders & Fulfillment", category: "Navigation", icon: <Package className="h-4 w-4" />, to: "/admin/orders", badge: "42 Active" },
  { id: "nav-customers", title: "Customers & EV Garages", category: "Navigation", icon: <Users className="h-4 w-4" />, to: "/admin/customers" },
  ...(SHOW_ADMIN_SELLERS
    ? [
        { id: "nav-sellers", title: "Sellers & KYC Approval", category: "Navigation" as const, icon: <Store className="h-4 w-4" />, to: "/admin/sellers", badge: "2 Pending" },
      ]
    : []),
  { id: "nav-riders", title: "Delivery Fleet & Live GPS", category: "Navigation", icon: <Bike className="h-4 w-4" />, to: "/admin/riders", badge: "142 Live" },
  { id: "nav-products", title: "Products & Parts Inventory", category: "Navigation", icon: <Box className="h-4 w-4" />, to: "/admin/products" },
  { id: "nav-fitment", title: "Bikes & VIN Compatibility Matrix", category: "Navigation", icon: <Wrench className="h-4 w-4" />, to: "/admin/fitment" },
  { id: "nav-payments", title: "Payments, Payouts & Refunds", category: "Navigation", icon: <CreditCard className="h-4 w-4" />, to: "/admin/payments" },
  { id: "nav-offers", title: "Offers, Coupons & Banners", category: "Navigation", icon: <Tag className="h-4 w-4" />, to: "/admin/offers" },
  { id: "nav-support", title: "Customer Support & Tickets", category: "Navigation", icon: <Headphones className="h-4 w-4" />, to: "/admin/support", badge: "3 New" },
  { id: "nav-reviews", title: "Review Moderation", category: "Navigation", icon: <Star className="h-4 w-4" />, to: "/admin/reviews" },
  { id: "nav-warranty", title: "Warranty & Return Claims", category: "Navigation", icon: <ShieldCheck className="h-4 w-4" />, to: "/admin/warranty" },
  { id: "nav-analytics", title: "Analytics & SLA Reports", category: "Navigation", icon: <BarChart3 className="h-4 w-4" />, to: "/admin/analytics" },
  { id: "nav-ai", title: "AI Assistant Telemetry Logs", category: "Navigation", icon: <Bot className="h-4 w-4" />, to: "/admin/ai-assistant" },
  { id: "nav-notifs", title: "Broadcast Notifications", category: "Navigation", icon: <Bell className="h-4 w-4" />, to: "/admin/notifications" },
  { id: "nav-team", title: "Team & Role Permissions", category: "Navigation", icon: <ShieldAlert className="h-4 w-4" />, to: "/admin/team" },
  { id: "nav-settings", title: "Platform Settings & Delivery Fees", category: "Navigation", icon: <Settings className="h-4 w-4" />, to: "/admin/settings" },
];

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Filter commands
  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          navigate({ to: filtered[selectedIndex].to });
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          {/* Glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl text-[#111111]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-4">
              <Search className="h-5 w-5 text-[#6B7280]" />
              <input
                type="text"
                autoFocus
                placeholder="Jump to section or search screens (e.g. Orders, Payouts, Fleet)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none font-medium"
              />
              <span className="flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#4B5563]">
                <Command className="h-3 w-3" /> ESC
              </span>
            </div>

            {/* Commands List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6B7280]">
                  No matching command or destination found.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate({ to: item.to });
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition select-none",
                        isSelected
                          ? "bg-red-50 text-[#E31E24] border border-[#E31E24]/30"
                          : "text-[#374151] hover:bg-gray-50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl",
                            isSelected ? "bg-[#E31E24] text-white" : "bg-gray-100 text-[#4B5563]"
                          )}
                        >
                          {item.icon}
                        </div>
                        <span>{item.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#4B5563]">
                            {item.badge}
                          </span>
                        )}
                        {isSelected && <ArrowRight className="h-3.5 w-3.5 text-[#E31E24]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-gray-50 px-5 py-2.5 text-[11px] text-[#6B7280] font-medium">
              <span className="flex items-center gap-2">
                <span>Navigate</span>
                <kbd className="rounded border border-[#E5E7EB] bg-white px-1 py-0.5 text-[10px] font-bold text-[#374151]">↑</kbd>
                <kbd className="rounded border border-[#E5E7EB] bg-white px-1 py-0.5 text-[10px] font-bold text-[#374151]">↓</kbd>
                <span>Select</span>
                <kbd className="rounded border border-[#E5E7EB] bg-white px-1 py-0.5 text-[10px] font-bold text-[#374151]">↵</kbd>
              </span>
              <span>17 Console Modules Available</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Bike,
  Battery,
  Wrench,
  Shield,
  Car,
  HardHat,
  Package,
  Tag,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "./bits";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  activeName?: string;
  onSignOut: () => void;
}

const shopCategories = [
  { title: "Electric Bikes", cat: "Electric Bikes", icon: Bike },
  { title: "Batteries & Chargers", cat: "Battery", icon: Battery },
  { title: "Spare Parts", cat: "Spare Parts", icon: Wrench },
  { title: "Bike Accessories", cat: "Bike Accessories", icon: Shield },
  { title: "Car Accessories", cat: "Car Accessories", icon: Car },
  { title: "Riding Gear & Helmets", cat: "Riding Gear & Helmets", icon: HardHat },
];

export function MobileDrawer({
  isOpen,
  onClose,
  isAuthenticated,
  activeName,
  onSignOut,
}: MobileDrawerProps) {
  const [isShopExpanded, setIsShopExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as any });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative flex w-full max-w-sm flex-1 flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-[#ececec] px-5">
          <Logo className="flex items-center" imgClassName="h-10 sm:h-11 w-auto" />
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6b7280] hover:bg-[#f7f7f8] hover:text-[#111111] transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#ececec]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parts, batteries, brands..."
              className="h-10 w-full rounded-xl border border-[#ececec] bg-[#f7f7f8] pl-9 pr-4 text-xs font-medium text-[#111111] placeholder:text-[#6b7280] focus:border-[#e11d2a] focus:bg-white focus:outline-none"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6b7280]" />
          </form>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {/* Shop Accordion */}
          <div>
            <button
              onClick={() => setIsShopExpanded(!isShopExpanded)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition cursor-pointer"
            >
              <span>Shop Categories</span>
              {isShopExpanded ? (
                <ChevronDown className="h-4 w-4 text-[#6b7280]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#6b7280]" />
              )}
            </button>

            {isShopExpanded && (
              <div className="mt-1 ml-2 space-y-0.5 border-l-2 border-[#ececec] pl-2">
                {shopCategories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.title}
                      to="/shop"
                      search={{ cat: c.cat } as any}
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#4b5563] hover:text-[#e11d2a] hover:bg-red-50/50 transition"
                    >
                      <Icon className="h-4 w-4 text-[#6b7280]" />
                      <span>{c.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/garage"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition"
          >
            <Bike className="h-4 w-4 text-[#6b7280]" />
            <span>My Garage</span>
          </Link>

          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition"
          >
            <Package className="h-4 w-4 text-[#6b7280]" />
            <span>Orders</span>
          </Link>

          <Link
            to="/offers"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition"
          >
            <Tag className="h-4 w-4 text-[#6b7280]" />
            <span>Offers</span>
          </Link>

          <Link
            to="/assistant"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#f7f7f8] transition"
          >
            <HelpCircle className="h-4 w-4 text-[#6b7280]" />
            <span>Help & Support</span>
          </Link>
        </div>

        {/* Bottom CTA / User Profile */}
        <div className="border-t border-[#ececec] p-4 bg-[#f7f7f8]">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs">
                  {activeName?.slice(0, 2).toUpperCase() || "CU"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#111111] truncate">{activeName || "Customer"}</p>
                  <p className="text-[11px] text-[#6b7280]">Customer Account</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Link
                  to="/dashboard/customer"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-[#ececec] bg-white py-2 text-center text-xs font-semibold text-[#111111] hover:bg-gray-50 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="rounded-xl border border-[#ececec] bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e11d2a] text-xs font-semibold text-white transition hover:bg-[#c91823]"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "@tanstack/react-router";
import { Store, ArrowRight, ShieldCheck, TrendingUp, PackageCheck, LogIn } from "lucide-react";

export function VendorSection() {
  return (
    <section className="bg-white py-16 lg:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF5F5] via-white to-[#FFF0F0] border-2 border-[#E31E24]/15 p-8 sm:p-12 lg:p-16 shadow-xs">
          {/* Subtle background decorative aura */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#E31E24]/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#E31E24]/5 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E31E24]/10 text-[#E31E24] text-xs font-bold uppercase tracking-wider">
                <Store className="h-4 w-4" />
                <span>Marketplace Partner Network</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111111] leading-tight">
                Are You a <span className="text-[#E31E24]">Vendor?</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl font-normal">
                Grow your business with our marketplace. Register your store, manage products, receive orders, and reach more customers through your dedicated vendor dashboard.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/vendor/signup"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#E31E24] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-[#E31E24]/20 hover:bg-[#c9181e] transition-all transform active:scale-95 cursor-pointer"
                >
                  <Store className="h-4 w-4" />
                  <span>Become a Vendor</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/vendor/login"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-white border-2 border-gray-200 px-6 py-3.5 text-sm sm:text-base font-bold text-[#111111] hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
                >
                  <LogIn className="h-4 w-4 text-[#E31E24]" />
                  <span>Vendor Sign In</span>
                </Link>
              </div>
            </div>

            {/* Right Highlights Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">Direct Customer Reach</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Connect directly with EV owners looking for exact-fit battery packs, chargers, and spares.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">Verified Payouts & KYC</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Bank account verification and guaranteed payouts directly to your registered bank account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">Dedicated Vendor Portal</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Real-time order tracking, catalog management, inventory sync, and instant notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

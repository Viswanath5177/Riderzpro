import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./bits";
import { Navbar } from "./Navbar";

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans flex flex-col antialiased">
      {/* Standalone Static Navbar Container */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F7F7F8] text-[#111111] mt-auto">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Brand & Summary */}
        <div className="md:col-span-1">
          <Logo imgClassName="h-8" />
          <p className="mt-3 text-xs text-[#6B7280] leading-relaxed">
            RiderzPro is an automotive e-commerce platform offering electric bikes, accessories, batteries, chargers, and verified spare parts.
          </p>
          <div className="mt-4 space-y-1.5 text-xs text-[#6B7280]">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#111111]" /> MG Road, Bengaluru, Karnataka, India
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#111111]" /> support@riderzpro.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#111111]" /> +91 80 4567 8900
            </p>
          </div>
        </div>

        {/* Product Links */}
        <div className="text-xs">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-3">Products</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li>
              <Link to="/shop" search={{ cat: "Electric Bikes" } as any} className="hover:text-[#E31E24] transition">
                Electric Bikes
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ cat: "Car Accessories" } as any} className="hover:text-[#E31E24] transition">
                Car Accessories
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ cat: "Bike Accessories" } as any} className="hover:text-[#E31E24] transition">
                Bike Accessories
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ cat: "Riding Gear & Helmets" } as any} className="hover:text-[#E31E24] transition">
                Riding Gear & Helmets
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ cat: "Spare Parts" } as any} className="hover:text-[#E31E24] transition">
                Spare Parts
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ cat: "Battery" } as any} className="hover:text-[#E31E24] transition">
                Batteries & Chargers
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support & Orders */}
        <div className="text-xs">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-3">Customer Support</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li>
              <Link to="/dashboard/customer" search={{ tab: "orders" } as any} className="hover:text-[#E31E24] transition">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link to="/dashboard/customer" className="hover:text-[#E31E24] transition">
                Customer Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/customer" search={{ tab: "support" } as any} className="hover:text-[#E31E24] transition">
                Help & Support
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[#E31E24] transition">
                Account Login
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#E31E24] transition">
                View Shopping Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Legal */}
        <div className="text-xs">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-3">Policies & Legal</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li>
              <span className="text-[#6B7280]">Shipping Policy: Tracked courier delivery across India</span>
            </li>
            <li>
              <span className="text-[#6B7280]">Returns Policy: Verified returns within 7 days for eligible items</span>
            </li>
            <li>
              <span className="text-[#6B7280]">Privacy Policy: Compliant customer data protection</span>
            </li>
            <li>
              <span className="text-[#6B7280]">Terms & Conditions: Standard automotive e-commerce terms</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-white py-4 text-center text-xs text-[#6B7280]">
        © {new Date().getFullYear()} RiderzPro Automotive E-Commerce. All rights reserved.
      </div>
    </footer>
  );
}

export { LayoutDashboard, Navbar };

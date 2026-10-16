import React from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./bits";
import { isDevAdminEnabled } from "@/components/dev/AdminDevBypass";

export function Footer() {
  return (
    <footer className="border-t border-[#ececec] bg-white text-[#111111]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo className="flex items-center" imgClassName="h-12 sm:h-13 md:h-14 w-auto" />
            <p className="text-sm text-[#6b7280] leading-relaxed max-w-sm">
              India's specialized automotive marketplace for electric bike batteries, chargers, accessories, and chassis-verified replacement spares.
            </p>
          </div>

          {/* Column 2: Shop Categories */}
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-[#6b7280]">
              <li>
                <Link to="/shop" search={{ cat: "Electric Bikes" } as any} className="hover:text-[#e11d2a] transition">
                  Electric Bikes
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ cat: "Battery" } as any} className="hover:text-[#e11d2a] transition">
                  Batteries & Chargers
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ cat: "Spare Parts" } as any} className="hover:text-[#e11d2a] transition">
                  Spare Parts
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ cat: "Bike Accessories" } as any} className="hover:text-[#e11d2a] transition">
                  Bike Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ cat: "Car Accessories" } as any} className="hover:text-[#e11d2a] transition">
                  Car Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ cat: "Riding Gear & Helmets" } as any} className="hover:text-[#e11d2a] transition">
                  Riding Gear & Helmets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-[#6b7280]">
              <li>
                <Link to="/" className="hover:text-[#e11d2a] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-[#e11d2a] transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#e11d2a] transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/vendor/auth" className="text-[#e11d2a] font-bold hover:underline transition">
                  Sell on RiderzPro →
                </Link>
              </li>
              <li>
                <Link to="/vendor/auth" search={{ mode: "signup" }} className="hover:text-[#e11d2a] transition">
                  Partner with Us (Vendor Sign-Up)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-[#6b7280]">
              <li>
                <Link to="/assistant" className="hover:text-[#e11d2a] transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/garage" className="hover:text-[#e11d2a] transition">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#e11d2a] transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#e11d2a] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#e11d2a] transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#ececec] pt-8 text-xs text-[#6b7280]">
          <p>© 2026 RiderzPro Technologies. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#111111] transition"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#111111] transition"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#111111] transition"
            >
              LinkedIn
            </a>


          </div>
        </div>
      </div>
    </footer>
  );
}

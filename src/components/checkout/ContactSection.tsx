// src/components/checkout/ContactSection.tsx
import React, { forwardRef } from "react";
import { User, Phone, Mail } from "lucide-react";

export interface ContactData {
  name: string;
  phone: string;
  email: string;
}

export interface ContactErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface ContactSectionProps {
  data: ContactData;
  errors: ContactErrors;
  onChange: (field: keyof ContactData, value: string) => void;
  onBlur: (field: keyof ContactData) => void;
  nameInputRef?: React.Ref<HTMLInputElement>;
  phoneInputRef?: React.Ref<HTMLInputElement>;
  emailInputRef?: React.Ref<HTMLInputElement>;
}

export const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(
  ({ data, errors, onChange, onBlur, nameInputRef, phoneInputRef, emailInputRef }, ref) => {
    return (
      <div ref={ref} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
            <User className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold text-gray-900 font-display">1. Contact Details</h2>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-name"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Full Name <span className="text-[#E31E24]">*</span>
            </label>
            <div className="relative">
              <input
                ref={nameInputRef}
                id="checkout-name"
                name="name"
                type="text"
                autoComplete="name"
                value={data.name}
                onChange={(e) => onChange("name", e.target.value)}
                onBlur={() => onBlur("name")}
                placeholder="e.g. Rahul Sharma"
                className={`w-full h-11 rounded-xl border px-3 text-[16px] transition outline-none ${
                  errors.name
                    ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
          </div>

          {/* Mobile Phone */}
          <div>
            <label
              htmlFor="checkout-phone"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Mobile Number <span className="text-[#E31E24]">*</span>
            </label>
            <div className="flex rounded-xl border border-gray-300 focus-within:border-[#E31E24] focus-within:ring-1 focus-within:ring-[#E31E24] overflow-hidden">
              <span className="inline-flex items-center bg-gray-50 px-3 text-xs font-semibold text-gray-600 border-r border-gray-300 select-none">
                +91
              </span>
              <input
                ref={phoneInputRef}
                id="checkout-phone"
                name="tel"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={data.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  onChange("phone", val);
                }}
                onBlur={() => onBlur("phone")}
                placeholder="10-digit number"
                className={`flex-1 h-11 px-3 text-[16px] outline-none ${
                  errors.phone ? "bg-red-50/20" : "bg-white"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="checkout-email"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Email Address <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                ref={emailInputRef}
                id="checkout-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                onBlur={() => onBlur("email")}
                placeholder="name@example.com"
                className={`w-full h-11 rounded-xl border px-3 text-[16px] transition outline-none ${
                  errors.email
                    ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

ContactSection.displayName = "ContactSection";

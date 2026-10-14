// src/components/checkout/AddressSection.tsx
import React, { forwardRef } from "react";
import { MapPin, Truck, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  isDeliverablePincode,
  isValidPincodeFormat,
  NOT_SERVICEABLE_MESSAGE,
  SERVICEABLE_MESSAGE,
  INVALID_PINCODE_MESSAGE,
} from "../../lib/checkoutConfig";

export interface AddressData {
  street: string;
  locality: string;
  landmark: string;
  city: string; // "Delhi"
  state: string; // "Delhi"
  pincode: string;
  deliveryInstructions: string;
}

export interface AddressErrors {
  street?: string;
  locality?: string;
  landmark?: string;
  pincode?: string;
  deliveryInstructions?: string;
}

interface AddressSectionProps {
  data: AddressData;
  errors: AddressErrors;
  onChange: (field: keyof AddressData, value: string) => void;
  onBlur: (field: keyof AddressData) => void;
  streetInputRef?: React.Ref<HTMLInputElement>;
  localityInputRef?: React.Ref<HTMLInputElement>;
  pincodeInputRef?: React.Ref<HTMLInputElement>;
}

export const AddressSection = forwardRef<HTMLDivElement, AddressSectionProps>(
  ({ data, errors, onChange, onBlur, streetInputRef, localityInputRef, pincodeInputRef }, ref) => {
    const trimmedPincode = (data.pincode || "").trim();
    const hasPincode = trimmedPincode.length > 0;
    const isPincodeValidFormat = isValidPincodeFormat(trimmedPincode);
    const isPincodeDeliverable = isDeliverablePincode(trimmedPincode);

    // Dynamic message for pincode
    let pincodeMessage: { type: "success" | "error" | "warning"; text: string } | null = null;
    if (hasPincode) {
      if (isPincodeDeliverable) {
        pincodeMessage = { type: "success", text: SERVICEABLE_MESSAGE };
      } else if (trimmedPincode.length === 6 && !isPincodeDeliverable) {
        pincodeMessage = { type: "error", text: NOT_SERVICEABLE_MESSAGE };
      } else if (trimmedPincode.length < 6) {
        pincodeMessage = { type: "warning", text: INVALID_PINCODE_MESSAGE };
      }
    }

    return (
      <div ref={ref} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
              <MapPin className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 font-display">
              2. Delhi Delivery Address
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Delhi Region Only
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* House / Flat No. & Street */}
          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-street"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              House / Flat No. & Street <span className="text-[#E31E24]">*</span>
            </label>
            <input
              ref={streetInputRef}
              id="checkout-street"
              name="street-address"
              type="text"
              autoComplete="street-address"
              value={data.street}
              onChange={(e) => onChange("street", e.target.value)}
              onBlur={() => onBlur("street")}
              placeholder="e.g. Flat 302, Tower B, Rajendra Enclave"
              className={`w-full h-11 rounded-xl border px-3 text-[16px] transition outline-none ${
                errors.street
                  ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
              }`}
            />
            {errors.street && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.street}</p>
            )}
          </div>

          {/* Locality / Area */}
          <div>
            <label
              htmlFor="checkout-locality"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Locality / Area <span className="text-[#E31E24]">*</span>
            </label>
            <input
              ref={localityInputRef}
              id="checkout-locality"
              name="address-level3"
              type="text"
              value={data.locality}
              onChange={(e) => onChange("locality", e.target.value)}
              onBlur={() => onBlur("locality")}
              placeholder="e.g. Connaught Place"
              className={`w-full h-11 rounded-xl border px-3 text-[16px] transition outline-none ${
                errors.locality
                  ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
              }`}
            />
            {errors.locality && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.locality}</p>
            )}
          </div>

          {/* Landmark */}
          <div>
            <label
              htmlFor="checkout-landmark"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Landmark <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="checkout-landmark"
              name="landmark"
              type="text"
              value={data.landmark}
              onChange={(e) => onChange("landmark", e.target.value)}
              placeholder="e.g. Near Metro Station Gate 2"
              className="w-full h-11 rounded-xl border border-gray-300 px-3 text-[16px] transition outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
            />
          </div>

          {/* City (Fixed Delhi) */}
          <div>
            <label
              htmlFor="checkout-city"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              City
            </label>
            <input
              id="checkout-city"
              type="text"
              readOnly
              value="Delhi"
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-100 px-3 text-[16px] font-medium text-gray-600 select-none cursor-not-allowed outline-none"
            />
          </div>

          {/* State (Fixed Delhi) */}
          <div>
            <label
              htmlFor="checkout-state"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              State
            </label>
            <input
              id="checkout-state"
              type="text"
              readOnly
              value="Delhi"
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-100 px-3 text-[16px] font-medium text-gray-600 select-none cursor-not-allowed outline-none"
            />
          </div>

          {/* Pincode */}
          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-pincode"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Pincode (Delhi Delivery: 110001–110099) <span className="text-[#E31E24]">*</span>
            </label>
            <input
              ref={pincodeInputRef}
              id="checkout-pincode"
              name="postal-code"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={data.pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                onChange("pincode", val);
              }}
              onBlur={() => onBlur("pincode")}
              placeholder="e.g. 110001"
              className={`w-full h-11 rounded-xl border px-3 text-[16px] font-mono transition outline-none ${
                errors.pincode || (hasPincode && !isPincodeDeliverable)
                  ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                  : isPincodeDeliverable
                    ? "border-emerald-500 bg-emerald-50/20 focus:ring-1 focus:ring-emerald-500"
                    : "border-gray-300 focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
              }`}
            />

            {/* Pincode validation & serviceability notice under field */}
            {pincodeMessage && (
              <div
                className={`mt-1.5 flex items-start gap-1.5 text-xs font-medium ${
                  pincodeMessage.type === "success"
                    ? "text-emerald-700"
                    : pincodeMessage.type === "error"
                      ? "text-red-600"
                      : "text-amber-600"
                }`}
              >
                {pincodeMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span>{pincodeMessage.text}</span>
              </div>
            )}
            {errors.pincode && !pincodeMessage && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.pincode}</p>
            )}
          </div>

          {/* Delivery instructions (optional, max 200 chars) */}
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="checkout-instructions"
                className="block text-xs font-semibold text-gray-700"
              >
                Delivery Instructions <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {(data.deliveryInstructions || "").length}/200
              </span>
            </div>
            <textarea
              id="checkout-instructions"
              name="instructions"
              maxLength={200}
              rows={2}
              value={data.deliveryInstructions}
              onChange={(e) => onChange("deliveryInstructions", e.target.value)}
              placeholder="e.g. Leave with security guard at Gate 1"
              className="w-full rounded-xl border border-gray-300 p-3 text-[16px] outline-none transition focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] resize-none"
            />
          </div>
        </div>
      </div>
    );
  },
);

AddressSection.displayName = "AddressSection";

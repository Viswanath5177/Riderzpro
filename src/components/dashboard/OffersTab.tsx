import { useState } from "react";
import { Tag, Copy, Check, Sparkles, Gift, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/data";

export function OffersTab() {
  const { userProfile } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const coupons = [
    {
      code: "RIDERZ10",
      title: "10% Instant Off on Batteries",
      desc: "Valid on all certified NMC and LiFePO4 packs above ₹30,000.",
      expires: "Valid till 31 Oct 2026",
      tag: "Best Value",
    },
    {
      code: "EVSAFE",
      title: "Free 24-Point Monsoon Inspection",
      desc: "Complimentary doorstep technician inspection on parts orders above ₹5,000.",
      expires: "Valid till Sunday",
      tag: "Seasonal",
    },
    {
      code: "FREEDEL",
      title: "Free Express Doorstep Delivery",
      desc: "Zero courier charges on fast chargers, brake pads, and BMS boards.",
      expires: "Active All Month",
      tag: "Popular",
    },
    {
      code: "FIRSTSERVICE",
      title: "₹150 Off Technician Home Visit",
      desc: "Applicable on all first-time preventive maintenance and battery health bookings.",
      expires: "Valid for New Bookings",
      tag: "Technician",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 font-display">Offers, Coupons & Rewards</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Exclusive discounts on EV spare parts, verified battery packs, and doorstep technician service.
        </p>
      </div>

      {/* ProPoints Card */}
      <div className="p-6 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-3xl bg-primary text-white shadow-xs">
            <Gift className="h-7 w-7" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              RiderzPro Loyalty Club
            </span>
            <p className="text-2xl font-extrabold text-gray-900 font-display mt-0.5">
              {userProfile.points} ProPoints Available
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Redeemable for up to <b className="text-gray-900">{inr(userProfile.points)}</b> instant discount at checkout.
            </p>
          </div>
        </div>

        <button
          onClick={() => toast.success("ProPoints auto-applied to your next checkout!")}
          className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition shrink-0"
        >
          Redeem at Checkout
        </button>
      </div>

      {/* Active Coupons Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="p-5 rounded-3xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md">
                  {c.tag}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">{c.expires}</span>
              </div>

              <h3 className="text-base font-bold text-gray-900 font-display mt-2">{c.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.desc}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="font-mono text-xs font-bold text-gray-800 bg-gray-50 border border-dashed border-gray-300 px-3 py-1.5 rounded-xl">
                {c.code}
              </div>

              <button
                onClick={() => copy(c.code)}
                className="px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-xs font-semibold transition flex items-center gap-1.5"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Phone, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SupportTab() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does RiderzPro guarantee 100% EV part fitment?",
      a: "Every part in our catalog is mapped to OEM frame numbers, battery voltages (48V, 60V, 72V), and connector pinouts. When you decode your 17-digit VIN or pick your model from My Garage, we filter and display only verified compatible items.",
    },
    {
      q: "What does the ₹299 Doorstep Technician service cover?",
      a: "Our certified technicians arrive with digital battery impedance testers and BMS calibration scanners. They perform cell voltage drift checks, terminal torque verification, IP67 seal inspections, and brake pad wear analysis right at your home or office.",
    },
    {
      q: "How fast is express parts delivery in Bengaluru?",
      a: "Orders are dispatched directly from verified nearby EV vendor hubs (Indiranagar, Koramangala, Jayanagar, Hebbal). Typical doorstep delivery time is between 25 to 45 minutes, with live GPS rider tracking available on your dashboard.",
    },
    {
      q: "What is your return & replacement policy?",
      a: "We offer a 7-day hassle-free replacement on any unopened or defective EV battery, charger, or controller. All items also include manufacturer warranties ranging from 12 to 48 months.",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Matches Screenshot 2)
         ───────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
          Help, Roadside &amp; Support
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          24/7 emergency EV towing, technician helpline, and comprehensive fitment guidance.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EMERGENCY SOS BANNER (Matches Screenshot 2)
         ───────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-7 rounded-3xl border border-red-100 bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E31E24] text-white shadow-2xs shrink-0">
            <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#E31E24] text-[10px] font-bold uppercase tracking-wider">
                EMERGENCY SOS
              </span>
              <h2 className="text-base font-bold text-[#111111] font-display">
                24/7 Roadside EV Assistance
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 max-w-xl">
              Stranded due to battery drain, motor stall, or flat tire? Call our dispatch center for instant emergency assistance.
            </p>
          </div>
        </div>

        <a
          href="tel:+918045678900"
          className="px-6 py-3 rounded-full bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Phone className="h-3.5 w-3.5 fill-white" />
          <span>Call +91 80 4567 8900</span>
        </a>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FREQUENTLY ASKED QUESTIONS (Matches Screenshot 2)
         ───────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-gray-200/80 bg-white shadow-2xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className="py-4 first:pt-2 last:pb-1">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#111111] hover:text-[#E31E24] transition py-1 cursor-pointer"
                >
                  <span className={cn(isOpen && "text-[#111111]")}>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#E31E24] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

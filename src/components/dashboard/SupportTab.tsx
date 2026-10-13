import { useState } from "react";
import { Phone, ChevronDown, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 font-display">Help, Roadside & Support</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          24/7 emergency EV towing, technician helpline, and comprehensive fitment guidance.
        </p>
      </div>

      {/* Emergency Roadside Assistance Banner */}
      <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500 text-white shadow-xs shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                Emergency SOS
              </span>
              <h3 className="text-base font-bold text-gray-900 font-display">24/7 Roadside EV Assistance</h3>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Stranded due to battery drain, motor stall, or flat tire? Call our dispatch center for instant emergency assistance.
            </p>
          </div>
        </div>

        <a
          href="tel:+918045678900"
          className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-semibold shadow-xs hover:bg-rose-700 active:scale-95 transition flex items-center justify-center gap-2 shrink-0"
        >
          <Phone className="h-4 w-4" />
          <span>Call +91 80 4567 8900</span>
        </a>
      </div>


      {/* FAQs Section */}
      <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 font-display">Frequently Asked Questions</h2>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-900 hover:text-primary transition py-1"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed animate-in fade-in duration-150">
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

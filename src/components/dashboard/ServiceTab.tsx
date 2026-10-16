import { useState, useEffect } from "react";
import {
  Wrench,
  Calendar,
  MapPin,
  Clock,
  Plus,
  CheckCircle,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, type ServiceBooking } from "@/lib/store";
import { getBike, inr } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ServiceTabProps {
  onOpenBookingModal: () => void;
}

export function ServiceTab({ onOpenBookingModal }: ServiceTabProps) {
  const { serviceBookings, cancelServiceBooking, garage } = useStore();
  const [dbBookings, setDbBookings] = useState<any[]>([]);

  // Fetch live bookings from database
  const refreshBookings = () => {
    fetch("/api/service-bookings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDbBookings(res.data);
        }
      })
      .catch((err) => console.log("Service bookings notice:", err));
  };

  useEffect(() => {
    refreshBookings();
  }, [serviceBookings]);

  // Combine store bookings and DB bookings
  const activeBookings = dbBookings.length > 0 ? dbBookings : serviceBookings;

  const handleCancel = async (bookingId: string) => {
    try {
      await fetch(`/api/service-bookings/${bookingId}/cancel`, { method: "PUT" });
      cancelServiceBooking(bookingId);
      toast.info("Appointment cancelled");
      refreshBookings();
    } catch {
      cancelServiceBooking(bookingId);
      toast.info("Appointment cancelled");
    }
  };

  const packages = [
    {
      title: "Monsoon 24-Point Health Audit",
      price: 299,
      time: "45 mins",
      items: [
        "IP67 water ingress check",
        "Cell voltage balance scan",
        "Brake cable lubrication",
      ],
    },
    {
      title: "Battery Capacity & SOH Test",
      price: 499,
      time: "60 mins",
      items: [
        "Coulomb counting test",
        "Thermal sensor diagnostics",
        "Cycle degradation report",
      ],
    },
    {
      title: "Brake Overhaul & Fluid Bleed",
      price: 349,
      time: "40 mins",
      items: [
        "Hydraulic DOT4 fluid replacement",
        "Rotor thickness measurement",
        "Pad wear alignment",
      ],
    },
    {
      title: "Fast Charger Home Setup",
      price: 799,
      time: "90 mins",
      items: [
        "MCB & earthing verification",
        "Wall mount installation",
        "Load testing at 3.3kW",
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & BOOK TECHNICIAN BUTTON (Matches Screenshot 5)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
            Service &amp; Preventive Maintenance
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Book certified doorstep technicians with calibrated BMS scanners or visit partner workshops across Bengaluru.
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>+ Book Technician Visit (₹299)</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SCHEDULED TECHNICIAN APPOINTMENTS (Matches Screenshot 5)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display">
          Scheduled Technician Appointments
        </h2>

        {activeBookings.length === 0 ? (
          /* Empty Card matching Screenshot 5 */
          <div className="rounded-3xl border border-gray-200/80 bg-white p-10 sm:p-14 text-center space-y-3.5 shadow-2xs">
            {/* Clock Icon */}
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-50 text-gray-400 mx-auto">
              <Clock className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                No Scheduled Appointments
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Keep your EV battery at peak capacity by scheduling regular health audits and brake checks.
              </p>
            </div>

            {/* Solid Red Button: Book Service Now */}
            <button
              onClick={onOpenBookingModal}
              className="px-5 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            >
              Book Service Now
            </button>
          </div>
        ) : (
          /* Bookings List */
          <div className="grid gap-4 md:grid-cols-2">
            {activeBookings.map((b) => {
              const isCancelled = b.status === "Cancelled";
              const sType = b.service_type || b.serviceType || "EV Diagnostic Service";
              const sSlot = b.scheduled_slot || b.slot || "Tomorrow, 10:30 AM";
              const sAddr = b.address || b.location || "Indiranagar, Bengaluru";
              const sCost = b.total_amount || b.cost || 299;

              return (
                <div
                  key={b.id}
                  className={cn(
                    "p-5 rounded-3xl border bg-white shadow-2xs space-y-3",
                    isCancelled ? "opacity-60 border-gray-200" : "border-red-100 ring-1 ring-red-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      #{b.id}
                    </span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                        isCancelled
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      )}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 font-display">{sType}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Doorstep Service · {inr(sCost)}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#E31E24]" />
                      <span>{sSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#E31E24]" />
                      <span>{sAddr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-3.5 w-3.5 text-[#E31E24]" />
                      <span>Technician: Assigned EV Specialist</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
                      >
                        Cancel appointment
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. POPULAR EV CARE PACKAGES (Matches Screenshot 5: 4 Cards)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display">
          Popular EV Care Packages
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className="p-5 rounded-3xl border border-gray-200/80 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E31E24] bg-red-50 px-2 py-0.5 rounded-md inline-block">
                  DOORSTEP SERVICE
                </span>

                <h3 className="text-sm font-bold text-[#111111] font-display">
                  {pkg.title}
                </h3>

                <p className="text-xs text-gray-500">Duration: {pkg.time}</p>

                <ul className="text-xs text-gray-600 space-y-1.5 pt-2 border-t border-gray-100">
                  {pkg.items.map((it) => (
                    <li key={it} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-base font-extrabold text-[#111111]">
                  {inr(pkg.price)}
                </span>
                <button
                  onClick={onOpenBookingModal}
                  className="px-4 py-1.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

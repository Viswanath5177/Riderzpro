import { useState } from "react";
import { Wrench, Calendar, MapPin, CheckCircle, Clock, Plus, Phone, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { getBike, inr } from "@/lib/data";

interface ServiceTabProps {
  onOpenBookingModal: () => void;
}

export function ServiceTab({ onOpenBookingModal }: ServiceTabProps) {
  const { serviceBookings, cancelServiceBooking, garage, activeBikeId } = useStore();

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">Service & Preventive Maintenance</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Book certified doorstep technicians with calibrated BMS scanners or visit partner workshops across Bengaluru.
          </p>
        </div>
        <button
          onClick={onOpenBookingModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Book Technician Visit (₹299)</span>
        </button>
      </div>

      {/* Active Scheduled Appointments */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900 font-display">Scheduled Technician Appointments</h2>

        {serviceBookings.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-gray-300 bg-white text-center">
            <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">No Scheduled Appointments</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Keep your EV battery at peak capacity by scheduling regular health audits and brake checks.
            </p>
            <button
              onClick={onOpenBookingModal}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs"
            >
              Book Service Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {serviceBookings.map((b) => {
              const bike = getBike(b.bikeId);
              const isCancelled = b.status === "Cancelled";

              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl border bg-white shadow-2xs space-y-3 ${
                    isCancelled ? "opacity-60 border-gray-200" : "border-emerald-200 ring-1 ring-emerald-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      #{b.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCancelled
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 font-display">{b.serviceType}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      For {bike ? `${bike.make} ${bike.model}` : "EV Motorcycle"} · {inr(b.cost)}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{b.slot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{b.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-3.5 w-3.5 text-primary" />
                      <span>Technician: {b.technician}</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          cancelServiceBooking(b.id);
                          toast.info("Appointment cancelled");
                        }}
                        className="text-xs text-rose-600 hover:underline font-medium"
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

      {/* Available Service Packages */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-bold text-gray-900 font-display">Popular EV Care Packages</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Monsoon 24-Point Health Audit",
              price: 299,
              time: "45 mins",
              items: ["IP67 water ingress check", "Cell voltage balance scan", "Brake cable lubrication"],
            },
            {
              title: "Battery Capacity & SOH Test",
              price: 499,
              time: "60 mins",
              items: ["Coulomb counting test", "Thermal sensor diagnostics", "Cycle degradation report"],
            },
            {
              title: "Brake Overhaul & Fluid Bleed",
              price: 349,
              time: "40 mins",
              items: ["Hydraulic DOT4 fluid replacement", "Rotor thickness measurement", "Pad wear alignment"],
            },
            {
              title: "Fast Charger Home Setup",
              price: 799,
              time: "90 mins",
              items: ["MCB & earthing verification", "Wall mount installation", "Load testing at 3.3kW"],
            },
          ].map((pkg) => (
            <div
              key={pkg.title}
              className="p-5 rounded-3xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 px-2 py-0.5 rounded-md">
                  Doorstep Service
                </span>
                <h3 className="text-sm font-bold text-gray-900 font-display mt-1">{pkg.title}</h3>
                <p className="text-xs text-gray-500">Duration: {pkg.time}</p>
                <ul className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                  {pkg.items.map((it) => (
                    <li key={it} className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                <span className="text-base font-extrabold text-gray-900">{inr(pkg.price)}</span>
                <button
                  onClick={onOpenBookingModal}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
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

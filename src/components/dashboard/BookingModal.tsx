import { useState } from "react";
import { X, Calendar, Wrench, ShieldCheck, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { bikes, getBike, inr } from "@/lib/data";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { garage, activeBikeId, bookService, userProfile } = useStore();

  const [bikeId, setBikeId] = useState(activeBikeId || garage[0]?.bikeId || "ola-s1pro");
  const [serviceType, setServiceType] = useState("24-Point EV Health & BMS Diagnostic");
  const [slot, setSlot] = useState("Tomorrow, 10:30 AM");
  const [locationType, setLocationType] = useState<"doorstep" | "workshop">("doorstep");
  const [address, setAddress] = useState(userProfile.address || "Bellandur, Bengaluru");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const services = [
    { name: "24-Point EV Health & BMS Diagnostic", price: 299, time: "45 mins" },
    { name: "Battery Capacity & Cell Balancing Check", price: 499, time: "60 mins" },
    { name: "Brake Pads Overhaul & Hydraulic Bleed", price: 349, time: "40 mins" },
    { name: "Fast Charger Home Installation & Wiring", price: 799, time: "90 mins" },
  ];

  const currentService = services.find((s) => s.name === serviceType) || services[0];

  const slots = [
    "Today, 4:00 PM",
    "Today, 6:30 PM",
    "Tomorrow, 10:30 AM",
    "Tomorrow, 2:00 PM",
    "Saturday, 11:00 AM",
  ];

  const handleConfirm = () => {
    bookService({
      bikeId,
      serviceType,
      slot,
      location: locationType === "doorstep" ? `Doorstep (${address.slice(0, 24)}...)` : "VoltHub Workshop, Indiranagar",
      status: "Confirmed",
      technician: "Assigned EV Specialist",
      cost: currentService.price,
    });
    toast.success("Service technician booked!", {
      description: `${serviceType} scheduled for ${slot}.`,
    });
    onClose();
  };

  const selectedBike = getBike(bikeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-primary">
              <Wrench className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold text-gray-900 font-display">Book an EV Technician</p>
              <p className="text-xs text-gray-500">Certified technicians with calibrated EV diagnostic scanners.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Select Bike */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Vehicle
            </label>
            <select
              value={bikeId}
              onChange={(e) => setBikeId(e.target.value)}
              className="w-full h-11 rounded-2xl border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none focus:border-primary"
            >
              {garage.map((g) => {
                const b = getBike(g.bikeId)!;
                return (
                  <option key={g.bikeId} value={g.bikeId}>
                    {b.make} {b.model} ({g.year ?? 2023}) — {g.regNo || "KA 01 EQ 8821"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Service Package */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Service Package
            </label>
            <div className="space-y-2">
              {services.map((s) => (
                <div
                  key={s.name}
                  onClick={() => setServiceType(s.name)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                    serviceType === s.name
                      ? "border-primary bg-emerald-50/60 ring-1 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-900">{s.name}</p>
                    <span className="text-[11px] text-gray-500">Duration: {s.time} · Doorstep kit included</span>
                  </div>
                  <span className="font-extrabold text-gray-900 text-sm">{inr(s.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Mode */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Service Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocationType("doorstep")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  locationType === "doorstep"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Doorstep Visit (Home/Office)
              </button>
              <button
                type="button"
                onClick={() => setLocationType("workshop")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  locationType === "workshop"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Drive to Workshop (Indiranagar)
              </button>
            </div>
            {locationType === "doorstep" && (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Doorstep address in Bengaluru"
                className="mt-2 w-full h-10 rounded-xl border border-gray-300 px-3 text-xs text-gray-900 outline-none focus:border-primary"
              />
            )}
          </div>

          {/* Slot Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Date & Time Slot
            </label>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                    slot === s
                      ? "border-primary bg-primary text-white font-semibold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Booking Fee</span>
            <span className="text-lg font-extrabold text-gray-900">{inr(currentService.price)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { User, Mail, Phone, MapPin, Check, Save } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function SettingsTab() {
  const { userProfile, updateUserProfile } = useStore();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [city, setCity] = useState(userProfile.city);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      address,
      city,
    });
    toast.success("Profile & delivery preferences updated successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 font-display">Profile & Account Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal information, doorstep delivery addresses, and dispatch alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 font-display">Personal Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-primary"
                  required
                />
                <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-primary"
                  required
                />
                <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-primary"
                  required
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Doorstep Delivery Address */}
        <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 font-display">Default Doorstep Delivery Address</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Street Address / Flat / Building
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 p-3 pl-10 text-sm outline-none focus:border-primary"
                  required
                />
                <MapPin className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                City & State
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Dispatch Notification Channels */}
        <div className="p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-gray-900 font-display">Communication Preferences</h2>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-xs text-gray-700">
                Receive live SMS dispatch alerts and rider arrival OTPs
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-xs text-gray-700">
                Receive WhatsApp updates with digital tax invoices and tracking links
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}

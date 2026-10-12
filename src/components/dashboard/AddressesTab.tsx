import { useState } from "react";
import { MapPin, Plus, Check, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function AddressesTab() {
  const { userProfile, updateUserProfile } = useStore();

  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      tag: "Home (Primary)",
      name: userProfile.name,
      phone: userProfile.phone,
      addressLine: userProfile.address,
      city: userProfile.city,
      isDefault: true,
    },
    {
      id: "addr-2",
      tag: "Office / Work",
      name: userProfile.name,
      phone: userProfile.phone,
      addressLine: "Tech Park Block 3, Outer Ring Road, Marathahalli",
      city: "Bengaluru 560103",
      isDefault: false,
    },
  ]);

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success("Default delivery address updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#111111]">Delivery Addresses</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage your doorstep parts delivery destinations and garage locations.
          </p>
        </div>
        <button
          onClick={() => toast.success("Add new address modal opened")}
          className="flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-2xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border p-5 bg-white shadow-2xs flex flex-col justify-between transition ${
              a.isDefault ? "border-[#E31E24] ring-1 ring-red-100" : "border-[#E5E7EB]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                  <MapPin className="h-4 w-4 text-[#E31E24]" />
                  <span>{a.tag}</span>
                </span>
                {a.isDefault && (
                  <span className="rounded bg-red-50 text-[#E31E24] px-2 py-0.5 text-[10px] font-bold">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-[#111111]">{a.name}</p>
                <p className="text-gray-600 leading-relaxed">{a.addressLine}</p>
                <p className="text-gray-600">{a.city}</p>
                <p className="text-[#6B7280] pt-1">Phone: {a.phone}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              {!a.isDefault ? (
                <button
                  onClick={() => setDefault(a.id)}
                  className="font-semibold text-[#E31E24] hover:underline"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[#6B7280] text-[11px] flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Selected for Delivery
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.info("Edit address dialog")}
                  className="p-1 rounded text-gray-400 hover:text-gray-700"
                  title="Edit address"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

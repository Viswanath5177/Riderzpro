import { useState, useEffect, useCallback } from "react";
import { MapPin, Plus, Check, Edit2, Trash2, Home, Briefcase, Building, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

interface CustomerAddress {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  street_address: string;
  house_flat?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean | number;
  delivery_instructions?: string | null;
}

export function AddressesTab() {
  const { userProfile, setUserLocation } = useStore();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    recipientName: "",
    phone: "",
    houseFlat: "",
    streetAddress: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    deliveryInstructions: "",
    isDefault: false,
  });

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/addresses", { credentials: "include" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAddresses(data.data);
      } else {
        setAddresses([]);
      }
    } catch {
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      label: "Home",
      recipientName: userProfile.name || user?.name || "Customer",
      phone: userProfile.phone || user?.phone || "",
      houseFlat: "",
      streetAddress: "",
      city: userProfile.city || "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      deliveryInstructions: "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: CustomerAddress) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label || "Home",
      recipientName: addr.recipient_name || "",
      phone: addr.phone || "",
      houseFlat: addr.house_flat || "",
      streetAddress: addr.street_address || "",
      city: addr.city || "Bengaluru",
      state: addr.state || "Karnataka",
      pincode: addr.pincode || "560001",
      deliveryInstructions: addr.delivery_instructions || "",
      isDefault: Boolean(addr.is_default),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName.trim()) {
      toast.error("Please enter recipient name");
      return;
    }
    if (!formData.streetAddress.trim()) {
      toast.error("Please enter street address");
      return;
    }
    const cleanPin = formData.pincode.replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }

    setIsSubmitting(true);
    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `/api/customer/addresses?id=${encodeURIComponent(editingId!)}`
        : "/api/customer/addresses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: formData.recipientName.trim(),
          phone: formData.phone.trim() || "9876543210",
          houseFlat: formData.houseFlat.trim(),
          streetLocality: formData.streetAddress.trim(),
          city: formData.city.trim() || "Bengaluru",
          state: formData.state.trim() || "Karnataka",
          pincode: cleanPin,
          label: formData.label,
          deliveryInstructions: formData.deliveryInstructions.trim(),
          isDefault: formData.isDefault,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Delivery address updated." : "Delivery address added.");
        setIsModalOpen(false);
        await loadAddresses();

        if (formData.isDefault) {
          setUserLocation({
            id: data.data?.id || editingId || "addr_default",
            name: formData.streetAddress.trim(),
            city: formData.city.trim() || "Bengaluru",
            pincode: cleanPin,
            lat: 12.9716,
            lng: 77.5946,
            tag: `${formData.label} (Default)`,
          });
        }
      } else {
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Network error while saving address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDefault = async (addr: CustomerAddress) => {
    try {
      const res = await fetch(`/api/customer/addresses?id=${encodeURIComponent(addr.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            is_default: a.id === addr.id,
          }))
        );
        setUserLocation({
          id: addr.id,
          name: addr.street_address,
          city: addr.city,
          pincode: addr.pincode,
          lat: 12.9716,
          lng: 77.5946,
          tag: `${addr.label} (Default)`,
        });
        toast.success(`Default delivery address set to ${addr.label}`);
      } else {
        toast.error(data.error || "Failed to update default address");
      }
    } catch {
      toast.error("Failed to update default delivery address");
    }
  };

  const handleDelete = async (addrId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/customer/addresses?id=${encodeURIComponent(addrId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== addrId));
        toast.success("Address removed.");
      } else {
        toast.error(data.error || "Failed to delete address");
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#111111]">Delivery Addresses</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage your verified courier destinations and doorstep delivery addresses.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-2xs self-start sm:self-auto cursor-pointer transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#E31E24] mb-2" />
          <span>Loading delivery destinations from database...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <h3 className="text-base font-bold text-gray-800 font-display">No Delivery Addresses Saved</h3>
          <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
            You haven't saved any delivery destinations yet. Add an address to enable fast doorstep parts delivery.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Address Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => {
            const isDef = Boolean(a.is_default);
            const Icon =
              a.label?.toLowerCase() === "work"
                ? Briefcase
                : a.label?.toLowerCase() === "other"
                ? Building
                : Home;

            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-5 bg-white shadow-2xs flex flex-col justify-between transition ${
                  isDef ? "border-[#E31E24] ring-2 ring-[#E31E24]/20 bg-red-50/10" : "border-[#E5E7EB] hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                      <Icon className="h-4 w-4 text-[#E31E24]" />
                      <span>{a.label || "Home"}</span>
                    </span>
                    {isDef && (
                      <span className="rounded-full bg-[#E31E24] text-white px-2.5 py-0.5 text-[10px] font-bold">
                        Primary Default
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-700 space-y-1">
                    <p className="font-bold text-gray-900 text-sm">{a.recipient_name}</p>
                    <p className="text-gray-600 leading-relaxed">
                      {a.house_flat ? `${a.house_flat}, ` : ""}
                      {a.street_address}
                    </p>
                    <p className="text-gray-600 font-medium">
                      {a.city}, {a.state} - <span className="font-mono font-bold text-gray-900">{a.pincode}</span>
                    </p>
                    {a.phone && <p className="text-gray-500 pt-0.5 font-mono text-[11px]">Phone: +91 {a.phone}</p>}
                    {a.delivery_instructions && (
                      <p className="text-[11px] text-gray-400 italic pt-1">
                        "{a.delivery_instructions}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  {!isDef ? (
                    <button
                      onClick={() => setDefault(a)}
                      className="font-bold text-[#E31E24] hover:underline cursor-pointer"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[#6B7280] text-[11px] flex items-center gap-1 font-semibold">
                      <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" /> Active Delivery Destination
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                      title="Edit address"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
              <div className="h-9 w-9 rounded-xl bg-red-50 text-[#E31E24] grid place-items-center">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-950 font-display">
                  {editingId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h3>
                <p className="text-xs text-gray-500">
                  Address will be verified for courier doorstep fulfillment.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {/* Address Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFormData((f) => ({ ...f, label: tag }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        formData.label === tag
                          ? "bg-[#E31E24] text-white border-[#E31E24] shadow-2xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData((f) => ({ ...f, recipientName: e.target.value }))}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    10-Digit Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                    placeholder="9876543210"
                    className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24] font-mono"
                  />
                </div>
              </div>

              {/* Flat / Building (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Flat, House No., Building (Optional)
                </label>
                <input
                  type="text"
                  value={formData.houseFlat}
                  onChange={(e) => setFormData((f) => ({ ...f, houseFlat: e.target.value }))}
                  placeholder="e.g. Flat 302, Green Glen Towers"
                  className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Street Address &amp; Locality *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData((f) => ({ ...f, streetAddress: e.target.value }))}
                  placeholder="Street name, landmark, area..."
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-xs outline-none focus:border-[#E31E24]"
                />
              </div>

              {/* City, State & PIN Code */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Bengaluru"
                    className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData((f) => ({ ...f, state: e.target.value }))}
                    placeholder="Karnataka"
                    className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") }))}
                    placeholder="560001"
                    className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24] font-mono"
                  />
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Partner Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.deliveryInstructions}
                  onChange={(e) => setFormData((f) => ({ ...f, deliveryInstructions: e.target.value }))}
                  placeholder="e.g. Leave at security, call on arrival..."
                  className="w-full h-10 rounded-xl border border-gray-300 px-3 text-xs outline-none focus:border-[#E31E24]"
                />
              </div>

              {/* Set Default Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="rounded text-[#E31E24] focus:ring-[#E31E24] h-4 w-4"
                />
                <span className="text-xs text-gray-700 font-medium">Set as primary default delivery destination</span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingId ? "Update Address" : "Save Destination"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

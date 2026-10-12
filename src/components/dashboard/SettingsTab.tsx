import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  Save,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Home,
  Briefcase,
  Wrench,
  Building2,
  X,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, DEFAULT_PROFILE, type UserAddress } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsTab() {
  const {
    userProfile,
    updateUserProfile,
    selectAddress,
    addAddress,
    updateAddress,
    removeAddress,
  } = useStore();

  // Personal details
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  // Address list & selection
  const addresses: UserAddress[] =
    userProfile.addresses && userProfile.addresses.length > 0
      ? userProfile.addresses
      : DEFAULT_PROFILE.addresses || [];
  const selectedAddressId = userProfile.selectedAddressId || addresses[0]?.id;

  // New address form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTag, setNewTag] = useState("Home");
  const [newName, setNewName] = useState(userProfile.name);
  const [newPhone, setNewPhone] = useState(userProfile.phone);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Bengaluru, Karnataka");
  const [newPincode, setNewPincode] = useState("560066");

  // Editing address state
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editTag, setEditTag] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPincode, setEditPincode] = useState("");

  // Notification preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);

  // Keep local personal fields in sync if userProfile changes
  useEffect(() => {
    setName(userProfile.name);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
  }, [userProfile.name, userProfile.email, userProfile.phone]);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
    });
    toast.success("Personal details updated successfully!");
  };

  const handleSelectAddress = (id: string, tag: string) => {
    selectAddress(id);
    toast.success(`Selected "${tag}" as your active delivery address!`);
  };

  const handleStartEdit = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setEditTag(addr.tag);
    setEditName(addr.name);
    setEditPhone(addr.phone);
    setEditStreet(addr.street);
    setEditCity(addr.city);
    setEditPincode(addr.pincode);
    setIsAddingAddress(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editStreet.trim() || !editCity.trim() || !editPincode.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }
    updateAddress(id, {
      tag: editTag || "Home",
      name: editName || userProfile.name,
      phone: editPhone || userProfile.phone,
      street: editStreet.trim(),
      city: editCity.trim(),
      pincode: editPincode.trim(),
    });
    setEditingAddressId(null);
    toast.success("Delivery address updated successfully!");
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim() || !newPincode.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }
    addAddress({
      tag: newTag,
      name: newName.trim() || userProfile.name,
      phone: newPhone.trim() || userProfile.phone,
      street: newStreet.trim(),
      city: newCity.trim(),
      pincode: newPincode.trim(),
    });
    setIsAddingAddress(false);
    setNewStreet("");
    toast.success(`New address "${newTag}" added and selected as active delivery destination!`);
  };

  const handleDeleteAddress = (id: string, tag: string) => {
    if (addresses.length <= 1) {
      toast.error("You must maintain at least one delivery address in your profile.");
      return;
    }
    removeAddress(id);
    toast.info(`Removed address "${tag}".`);
  };

  const getTagIcon = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes("home")) return <Home className="h-4 w-4" />;
    if (lower.includes("office") || lower.includes("work")) return <Briefcase className="h-4 w-4" />;
    if (lower.includes("workshop") || lower.includes("garage")) return <Wrench className="h-4 w-4" />;
    return <Building2 className="h-4 w-4" />;
  };

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
          Profile & Delivery Addresses
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Manage your personal identity, select your active delivery destination, and configure dispatch alerts.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: DELIVERY ADDRESS SELECTION & MANAGEMENT
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#E31E24]" />
              <h2 className="text-lg font-bold text-[#111111] font-display">
                Delivery Addresses
              </h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Select which address you want to receive parts, accessories, and doorstep technician visits at.
            </p>
          </div>

          {!isAddingAddress && (
            <button
              onClick={() => {
                setIsAddingAddress(true);
                setEditingAddressId(null);
                setNewName(userProfile.name);
                setNewPhone(userProfile.phone);
              }}
              id="btn-add-address"
              className="flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 active:scale-95 transition shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Address</span>
            </button>
          )}
        </div>

        {/* Active Address Status Banner */}
        {activeAddress && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start sm:items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-900">Current Selected Delivery Address:</span>
                <span className="rounded-md bg-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-900">
                  {activeAddress.tag}
                </span>
              </div>
              <p className="text-xs text-emerald-800 truncate mt-0.5">
                {activeAddress.street}, {activeAddress.city} - {activeAddress.pincode} ({activeAddress.name})
              </p>
            </div>
          </div>
        )}

        {/* ADD NEW ADDRESS FORM (COLLAPSIBLE) */}
        {isAddingAddress && (
          <form
            onSubmit={handleCreateAddress}
            className="rounded-2xl border border-red-200 bg-red-50/30 p-5 space-y-4 animate-in fade-in zoom-in-98 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-red-100">
              <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#E31E24]" /> Add New Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address Tag / Label
                </label>
                <div className="flex gap-2">
                  {["Home", "Office", "Workshop", "Other"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewTag(tag)}
                      className={cn(
                        "flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition",
                        newTag === tag
                          ? "bg-[#E31E24] text-white border-[#E31E24]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Aakash Sharma"
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  placeholder="e.g. 560066"
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Flat, Villa, Apartment, Street & Locality
                </label>
                <textarea
                  rows={2}
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="e.g. Villa 42, Palm Meadows, Whitefield"
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-new-address"
                className="px-5 py-2 rounded-xl bg-[#E31E24] text-xs font-semibold text-white hover:bg-red-700 shadow-2xs active:scale-95 transition"
              >
                Save & Select Address
              </button>
            </div>
          </form>
        )}

        {/* LIST OF ADDRESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId;
            const isEditing = editingAddressId === addr.id;

            if (isEditing) {
              return (
                <div
                  key={addr.id}
                  className="rounded-2xl border-2 border-blue-400 bg-blue-50/20 p-5 space-y-3.5 shadow-sm md:col-span-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                    <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Edit3 className="h-3.5 w-3.5 text-blue-600" /> Editing Address ({addr.tag})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingAddressId(null)}
                      className="p-1 rounded text-gray-400 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Tag / Label</label>
                      <input
                        type="text"
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Street Address</label>
                      <textarea
                        rows={2}
                        value={editStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">City & State</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAddressId(null)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(addr.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#E31E24] text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr.id, addr.tag)}
                className={cn(
                  "relative rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between group",
                  isSelected
                    ? "border-2 border-[#E31E24] bg-red-50/20 shadow-xs ring-1 ring-red-100"
                    : "border border-[#E5E7EB] bg-white hover:border-gray-400 hover:shadow-2xs"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                      <span className={cn(isSelected ? "text-[#E31E24]" : "text-gray-500")}>
                        {getTagIcon(addr.tag)}
                      </span>
                      <span>{addr.tag}</span>
                    </span>

                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <Check className="h-3 w-3" /> Active Delivery
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-gray-500 group-hover:text-[#E31E24] transition">
                        Click to select →
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5 space-y-1 text-xs">
                    <p className="font-bold text-[#111111]">{addr.name}</p>
                    <p className="text-gray-700 leading-relaxed">{addr.street}</p>
                    <p className="text-gray-600 font-medium">
                      {addr.city} · <span className="font-mono text-gray-800">{addr.pincode}</span>
                    </p>
                    <p className="text-gray-500 pt-1">
                      Phone: <span className="text-gray-800 font-medium">{addr.phone}</span>
                    </p>
                  </div>
                </div>

                <div
                  className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Select button if not selected */}
                  {!isSelected ? (
                    <button
                      type="button"
                      onClick={() => handleSelectAddress(addr.id, addr.tag)}
                      className="font-bold text-[#E31E24] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Navigation className="h-3 w-3" /> Select This Address
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Selected
                    </span>
                  )}

                  {/* Edit & Delete actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(addr)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                      title="Edit this address"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id, addr.tag)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete this address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: PERSONAL IDENTITY & CONTACT DETAILS
         ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSavePersonal} className="space-y-6">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#E31E24]" />
                <h2 className="text-lg font-bold text-[#111111] font-display">Personal Profile</h2>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Your legal name and primary contact details for billing and GST tax invoices.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                {userProfile.points} ProPoints
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24]"
                  required
                />
                <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Primary Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24]"
                  required
                />
                <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Account Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24]"
                  required
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="btn-save-personal"
              className="px-6 py-2.5 rounded-2xl bg-[#111111] text-white text-xs font-semibold shadow-xs hover:bg-[#E31E24] active:scale-95 transition flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Personal Information</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 3: DISPATCH & COMMUNICATION PREFERENCES
           ───────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#111111] font-display">Communication & Dispatch Alerts</h2>

          <div className="space-y-3 pt-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => {
                  setNotificationsEnabled(e.target.checked);
                  toast.success(e.target.checked ? "SMS alerts enabled" : "SMS alerts paused");
                }}
                className="h-4 w-4 rounded accent-[#E31E24]"
              />
              <span className="text-xs text-gray-700 font-medium">
                Receive live SMS dispatch alerts, courier tracking numbers, and doorstep technician arrival OTPs
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => {
                  setWhatsappEnabled(e.target.checked);
                  toast.success(e.target.checked ? "WhatsApp notifications enabled" : "WhatsApp notifications paused");
                }}
                className="h-4 w-4 rounded accent-[#E31E24]"
              />
              <span className="text-xs text-gray-700 font-medium">
                Receive WhatsApp updates with digital GST tax invoices and Delhivery/BlueDart live tracking links
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

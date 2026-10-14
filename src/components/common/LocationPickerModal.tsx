import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Search,
  Navigation,
  X,
  Check,
  Building,
  Home,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import {
  POPULAR_LOCATIONS,
  vendors,
  distanceKm,
  type LocationArea,
} from "@/lib/data";
import { cn } from "@/lib/utils";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationPickerModal({ isOpen, onClose }: LocationPickerModalProps) {
  const { user } = useAuth();
  const { userProfile, userLocation, setUserLocation } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [newAddr, setNewAddr] = useState({
    label: "Home",
    recipientName: "",
    phone: "",
    houseFlat: "",
    streetLocality: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
  });

  // Fetch customer-specific saved addresses from database
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingAddresses(true);
    const qCustId = user?.id || "";
    const qEmail = user?.email || userProfile?.email || "";

    fetch(`/api/customer/addresses?customer_id=${encodeURIComponent(qCustId)}&email=${encodeURIComponent(qEmail)}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setSavedAddresses(d.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingAddresses(false));
  }, [isOpen, user?.id, user?.email, userProfile?.email]);

  // Filter locations by search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_LOCATIONS;
    const q = searchQuery.toLowerCase().trim();
    return POPULAR_LOCATIONS.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        (l.pincode && l.pincode.includes(q)) ||
        (l.tag && l.tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (loc: LocationArea) => {
    setUserLocation(loc);
    toast.success(`Delivery location updated to ${loc.name}`, {
      description: "Nearby stores, delivery times and fees have been adjusted for this area.",
    });
    onClose();
  };

  const handleSelectSavedAddress = (addr: any) => {
    const loc: LocationArea = {
      id: addr.id,
      name: `${addr.label || "Saved"}: ${addr.street_address || addr.city}`,
      city: addr.city || "Bengaluru",
      pincode: addr.pincode || "560001",
      lat: 12.9716,
      lng: 77.5946,
      tag: addr.label || "Saved Address",
    };
    setUserLocation(loc);
    toast.success(`Delivery location set to ${addr.label || "Saved Address"}`);
    onClose();
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.streetLocality.trim() || !newAddr.pincode.trim()) {
      toast.error("Please enter street address and pincode.");
      return;
    }

    setIsSavingAddress(true);
    try {
      const res = await fetch("/api/customer/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerId: user?.id,
          email: user?.email || userProfile?.email,
          fullName: newAddr.recipientName || userProfile?.name || "Customer",
          phone: newAddr.phone || userProfile?.phone || "",
          label: newAddr.label,
          houseFlat: newAddr.houseFlat,
          streetLocality: newAddr.streetLocality,
          city: newAddr.city,
          state: newAddr.state,
          pincode: newAddr.pincode,
          isDefault: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSavedAddresses((prev) => [data.data, ...prev]);
        handleSelectSavedAddress(data.data);
        setIsAddingAddress(false);
        setNewAddr({
          label: "Home",
          recipientName: "",
          phone: "",
          houseFlat: "",
          streetLocality: "",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
        });
      } else {
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Failed to connect to database");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetectingGps(false);
          const { latitude, longitude } = position.coords;
          let closest = POPULAR_LOCATIONS[0];
          let minDistance = Infinity;
          POPULAR_LOCATIONS.forEach((loc) => {
            const d = distanceKm({ lat: latitude, lng: longitude }, loc);
            if (d < minDistance) {
              minDistance = d;
              closest = loc;
            }
          });

          const detectedLoc: LocationArea = {
            id: closest.id,
            name: closest.name,
            city: closest.city,
            lat: latitude,
            lng: longitude,
            pincode: closest.pincode,
            tag: "GPS Device Location",
          };
          setUserLocation(detectedLoc);
          toast.success(`GPS detected: ${detectedLoc.name}`, {
            description: `Found nearby auto stores within ${Math.round(minDistance * 10) / 10} km.`,
          });
          onClose();
        },
        () => {
          setIsDetectingGps(false);
          const fallback = POPULAR_LOCATIONS[0];
          setUserLocation(fallback);
          toast.info(`Using standard location: ${fallback.name}`, {
            description: "Location permission not granted. Set to Indiranagar default hub.",
          });
          onClose();
        },
        { timeout: 7000 }
      );
    } else {
      setIsDetectingGps(false);
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleCustomLocation = () => {
    if (!searchQuery.trim()) return;
    const customLoc: LocationArea = {
      id: `custom-${Date.now()}`,
      name: searchQuery.trim(),
      city: "Bengaluru",
      lat: 12.9716,
      lng: 77.5946,
      pincode: "",
      tag: "Custom Pin",
    };
    handleSelect(customLoc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#E31E24] flex items-center justify-center shadow-xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] font-display">
                  Select Delivery Location
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                  Hyperlocal
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Currently delivering to:{" "}
                <span className="font-bold text-[#111111]">{userLocation?.name || "Select location"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 grid place-items-center transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input Bar & GPS button */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-white space-y-3">
          <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-[#E31E24]/20 transition shadow-xs">
            <Search className="h-4.5 w-4.5 text-gray-400 shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredLocations.length === 0 && searchQuery.trim()) {
                  handleCustomLocation();
                }
              }}
              placeholder="Search area, landmark, street name, or pincode..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Detect Live GPS Location Button */}
          <button
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-50/70 hover:bg-red-50 text-[#E31E24] border border-red-100/90 hover:border-red-200 transition cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#E31E24] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition shrink-0">
                <Navigation
                  className={cn("h-4 w-4", isDetectingGps ? "animate-spin" : "group-hover:rotate-45 transition-transform")}
                />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-[#E31E24] flex items-center gap-1.5">
                  <span>{isDetectingGps ? "Detecting device coordinates..." : "Use Current Location"}</span>
                  <span className="text-[10px] font-semibold bg-white/80 px-1.5 py-0.5 rounded text-red-700 border border-red-200">
                    GPS
                  </span>
                </p>
                <p className="text-[11px] text-red-600/80">
                  Using device GPS to find auto parts stores nearest to you
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#E31E24] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Saved Addresses Section (Customer Isolated from DB) */}
          {!searchQuery && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                  Saved Delivery Addresses ({savedAddresses.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#E31E24] hover:text-red-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isAddingAddress ? "Cancel" : "Add New Address"}</span>
                </button>
              </div>

              {/* Add New Address Form Modal/Panel */}
              {isAddingAddress && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="mb-4 p-4 rounded-2xl bg-red-50/30 border border-red-200/80 space-y-3"
                >
                  <p className="text-xs font-bold text-gray-900">Add New Delivery Address</p>

                  <div className="flex items-center gap-2">
                    {["Home", "Work", "Garage", "Other"].map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewAddr((prev) => ({ ...prev, label: lbl }))}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition",
                          newAddr.label === lbl
                            ? "bg-[#E31E24] text-white"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      value={newAddr.recipientName}
                      onChange={(e) => setNewAddr((prev) => ({ ...prev, recipientName: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="House / Flat / Building No."
                    value={newAddr.houseFlat}
                    onChange={(e) => setNewAddr((prev) => ({ ...prev, houseFlat: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                  />

                  <input
                    type="text"
                    placeholder="Street, Area, Landmark *"
                    required
                    value={newAddr.streetLocality}
                    onChange={(e) => setNewAddr((prev) => ({ ...prev, streetLocality: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g. Bengaluru)"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code *"
                      required
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr((prev) => ({ ...prev, pincode: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#E31E24] hover:bg-red-700 cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      {isSavingAddress ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      <span>Save & Deliver Here</span>
                    </button>
                  </div>
                </form>
              )}

              {isLoadingAddresses ? (
                <div className="py-6 text-center text-xs text-gray-400">Loading saved addresses...</div>
              ) : savedAddresses.length === 0 && !isAddingAddress ? (
                <div className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 text-center space-y-2">
                  <p className="text-xs text-gray-600">No saved addresses found for your account.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Delivery Address</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {savedAddresses.map((addr) => {
                    const isSelected = userLocation?.id === addr.id;
                    const Icon =
                      addr.label?.toLowerCase() === "work"
                        ? Building
                        : addr.label?.toLowerCase() === "garage"
                        ? Wrench
                        : Home;

                    return (
                      <button
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={cn(
                          "flex flex-col text-left p-3 rounded-2xl border transition relative group cursor-pointer",
                          isSelected
                            ? "bg-red-50/60 border-[#E31E24] shadow-xs"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 shadow-2xs"
                        )}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-[#E31E24] text-white flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className={cn(
                              "h-6 w-6 rounded-lg flex items-center justify-center text-xs",
                              isSelected ? "bg-[#E31E24] text-white" : "bg-gray-100 text-gray-600"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-900">{addr.label || "Saved Address"}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium truncate">
                          {addr.recipient_name} {addr.phone ? `(${addr.phone})` : ""}
                        </p>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                          {addr.street_address}, {addr.city} {addr.pincode}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Popular Areas / Filtered List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                {searchQuery ? `Search Results (${filteredLocations.length})` : "Popular Delivery Hubs & Localities"}
              </span>
              <span className="text-[11px] text-gray-400">Bengaluru & Surrounds</span>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-gray-900">No exact area match for "{searchQuery}"</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You can still set this custom area as your delivery location.
                  </p>
                </div>
                <button
                  onClick={handleCustomLocation}
                  className="rounded-full bg-[#E31E24] text-white px-5 py-2 text-xs font-semibold hover:bg-red-700 transition cursor-pointer shadow-xs"
                >
                  Deliver to "{searchQuery}"
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredLocations.map((loc) => {
                  const isSelected = userLocation?.id === loc.id;
                  const nearestVendor = vendors
                    .map((v) => ({
                      vendor: v,
                      dist: Math.round(distanceKm(v, loc) * 10) / 10,
                    }))
                    .sort((a, b) => a.dist - b.dist)[0];

                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-2xl border transition text-left cursor-pointer group",
                        isSelected
                          ? "bg-red-50/50 border-[#E31E24] ring-1 ring-[#E31E24]/30 shadow-2xs"
                          : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 shadow-2xs"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition",
                            isSelected
                              ? "bg-[#E31E24] text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-900"
                          )}
                        >
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                              {loc.name}
                            </p>
                            {loc.tag && (
                              <span className="text-[9.5px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded shrink-0">
                                {loc.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {nearestVendor ? (
                              <>
                                Nearest store:{" "}
                                <span className="font-semibold text-gray-700">
                                  {nearestVendor.vendor.name} ({nearestVendor.dist} km)
                                </span>
                              </>
                            ) : (
                              `${loc.city} ${loc.pincode ? `· ${loc.pincode}` : ""}`
                            )}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="h-6 w-6 rounded-full bg-[#E31E24] text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hyperlocal delivery powered by RiderzPro Fleet</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-gray-700 hover:text-black cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

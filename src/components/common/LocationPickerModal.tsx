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
  ArrowRight,
  ShieldCheck,
  Plus,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import type { LocationArea } from "@/lib/data";
import { reverseGeocodeCoords, searchPlaces, type PlaceSuggestion } from "@/lib/location";
import { cn } from "@/lib/utils";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationPickerModal({ isOpen, onClose }: LocationPickerModalProps) {
  const { user } = useAuth();
  const { userProfile, userLocation, setUserLocation } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [detectedGpsLocation, setDetectedGpsLocation] = useState<LocationArea | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

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
    pincode: "",
  });

  // Fetch customer-specific saved addresses from database
  const loadAddresses = () => {
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
        } else {
          setSavedAddresses([]);
        }
      })
      .catch(() => {
        setSavedAddresses([]);
      })
      .finally(() => setIsLoadingAddresses(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
      setDetectedGpsLocation(null);
      setGpsError(null);
      setSearchQuery("");
      setPlaceSuggestions([]);
    }
  }, [isOpen, user?.id, user?.email, userProfile?.email]);

  // Live Google Maps / Geocoder place autocomplete debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setPlaceSuggestions([]);
      setIsSearchingPlaces(false);
      return;
    }

    setIsSearchingPlaces(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(trimmed);
        setPlaceSuggestions(results);
      } catch {
        setPlaceSuggestions([]);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectPlaceSuggestion = (place: PlaceSuggestion) => {
    const loc: LocationArea = {
      id: place.id,
      name: place.name,
      city: place.city || "India",
      state: place.state,
      description: place.description,
      pincode: place.pincode || "",
      lat: place.lat || 12.9716,
      lng: place.lng || 77.5946,
      tag: `Maps: ${place.name}`,
    };
    setUserLocation(loc);
    toast.success(`Delivery location set to ${place.name}`, {
      description: place.city ? `${place.city}${place.state ? ", " + place.state : ""}` : undefined,
    });
    onClose();
  };

  const handleSelectSavedAddress = (addr: any) => {
    const loc: LocationArea = {
      id: addr.id,
      name: addr.street_address || addr.city || "Bengaluru",
      city: addr.city || "Bengaluru",
      pincode: addr.pincode || "",
      lat: 12.9716,
      lng: 77.5946,
      tag: addr.label || "Saved Address",
    };
    setUserLocation(loc);
    toast.success(`Delivery location set to ${addr.label || "Saved Address"}`);
    onClose();
  };

  const handleDeleteAddress = async (e: React.MouseEvent, addrId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/customer/addresses?id=${encodeURIComponent(addrId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSavedAddresses((prev) => prev.filter((a) => a.id !== addrId));
        toast.success("Address removed");
      } else {
        toast.error(data.error || "Failed to delete address");
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.streetLocality.trim() || !newAddr.pincode.trim()) {
      toast.error("Please enter street address and PIN code.");
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
        setSavedAddresses((prev) => [data.data, ...prev.filter((a) => a.id !== data.data.id)]);
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
          pincode: "",
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
    setGpsError(null);
    setDetectedGpsLocation(null);

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const geocoded = await reverseGeocodeCoords(latitude, longitude);
            setIsDetectingGps(false);

            const detectedLoc: LocationArea = {
              id: `gps-${Date.now()}`,
              name: geocoded.name || geocoded.city || "Current Location",
              city: geocoded.city || "India",
              lat: latitude,
              lng: longitude,
              pincode: geocoded.pincode || "",
              tag: `GPS: ${geocoded.city || "Current Location"}`,
            };

            setDetectedGpsLocation(detectedLoc);
          } catch (err: any) {
            setIsDetectingGps(false);
            setGpsError("Unable to reverse geocode device location. Please search manually.");
          }
        },
        (error) => {
          setIsDetectingGps(false);
          if (error.code === error.PERMISSION_DENIED) {
            setGpsError("Location permission denied. Please allow location access or search your address manually.");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setGpsError("GPS position unavailable from your device. Please search your address manually.");
          } else {
            setGpsError("Location detection timed out. Please search your address manually.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsError("Geolocation is not supported by your browser. Please search manually.");
    }
  };

  const handleConfirmGpsLocation = () => {
    if (!detectedGpsLocation) return;
    setUserLocation(detectedGpsLocation);
    toast.success(`Delivery location updated to ${detectedGpsLocation.name}, ${detectedGpsLocation.city}`, {
      description: "Browsing catalog and shipping estimates have been adjusted for this location.",
    });
    onClose();
  };

  const handleConfirmCustomSearch = () => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim();
    const parts = trimmed.split(",").map((p) => p.trim());
    const customLoc: LocationArea = {
      id: `custom-${Date.now()}`,
      name: parts[0] || trimmed,
      city: parts[1] || (trimmed.toLowerCase().includes("bengaluru") || trimmed.toLowerCase().includes("bangalore") ? "Bengaluru" : "India"),
      lat: 12.9716,
      lng: 77.5946,
      pincode: "",
      tag: "Custom Pin",
    };
    setUserLocation(customLoc);
    toast.success(`Delivery location set to ${customLoc.name}`, {
      description: "Browsing catalog and shipping estimates adjusted.",
    });
    onClose();
  };

  // Filtered saved addresses when searching
  const filteredSavedAddresses = useMemo(() => {
    if (!searchQuery.trim()) return savedAddresses;
    const q = searchQuery.toLowerCase().trim();
    return savedAddresses.filter(
      (a) =>
        (a.label && a.label.toLowerCase().includes(q)) ||
        (a.street_address && a.street_address.toLowerCase().includes(q)) ||
        (a.city && a.city.toLowerCase().includes(q)) ||
        (a.pincode && a.pincode.includes(q)) ||
        (a.recipient_name && a.recipient_name.toLowerCase().includes(q))
    );
  }, [searchQuery, savedAddresses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#E31E24] flex items-center justify-center shadow-xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] font-display">
                Select Delivery Location
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Currently delivering to:{" "}
                <span className="font-bold text-[#111111]">{userLocation?.name || "Select location"}</span>
                {userLocation?.city ? ` (${userLocation.city})` : ""}
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

        {/* Search Input Bar & GPS Action */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-white space-y-3">
          <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-[#E31E24]/20 transition shadow-xs">
            <Search className="h-4.5 w-4.5 text-gray-400 shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleConfirmCustomSearch();
                }
              }}
              placeholder="Search area, landmark, street name, or PIN code..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              autoFocus
            />
            {isSearchingPlaces && (
              <Loader2 className="h-4 w-4 text-[#E31E24] animate-spin shrink-0 mr-2" />
            )}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPlaceSuggestions([]);
                }}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Detect Live GPS Location Button */}
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-red-50/70 hover:bg-red-50 text-[#E31E24] border border-red-100/90 hover:border-red-200 transition cursor-pointer group active:scale-[0.99] disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#E31E24] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition shrink-0">
                <Navigation
                  className={cn("h-4 w-4", isDetectingGps ? "animate-spin" : "group-hover:rotate-45 transition-transform")}
                />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-[#E31E24] flex items-center gap-1.5">
                  <span>{isDetectingGps ? "Detecting actual device coordinates..." : "Use Current Location"}</span>
                  <span className="text-[10px] font-semibold bg-white/80 px-1.5 py-0.5 rounded text-red-700 border border-red-200">
                    GPS
                  </span>
                </p>
                <p className="text-[11px] text-red-600/80">
                  Request device coordinates and reverse-geocode your real locality
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#E31E24] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* GPS Inline Error */}
          {gpsError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* GPS Detected Confirmation Card */}
          {detectedGpsLocation && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Location Detected via Device GPS
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {detectedGpsLocation.name}, {detectedGpsLocation.city}
                    </p>
                  </div>
                </div>
                {detectedGpsLocation.pincode && (
                  <span className="text-xs font-semibold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                    PIN {detectedGpsLocation.pincode}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmGpsLocation}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer text-center"
                >
                  Confirm & Use This Location
                </button>
                <button
                  type="button"
                  onClick={() => setDetectedGpsLocation(null)}
                  className="py-2 px-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Custom Search Confirmation Card */}
          {searchQuery.trim() && (
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0 mr-2">
                <MapPin className="h-4 w-4 text-[#E31E24] shrink-0" />
                <span className="text-xs font-semibold text-gray-800 truncate">
                  Deliver to: <strong className="text-gray-900 font-bold">"{searchQuery.trim()}"</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmCustomSearch}
                className="py-1.5 px-3.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition shrink-0 cursor-pointer"
              >
                Set Location
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Live Google & Maps Location Suggestions when searching */}
          {searchQuery.trim().length >= 2 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#E31E24]" />
                  Matching Locations ({placeSuggestions.length})
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {isSearchingPlaces ? "Searching maps..." : "Google & Maps Directory"}
                </span>
              </div>

              {isSearchingPlaces && placeSuggestions.length === 0 && (
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-2 text-center text-xs text-gray-500">
                  <Loader2 className="h-5 w-5 text-[#E31E24] animate-spin" />
                  <span>Searching Google & Maps locations for "{searchQuery}"...</span>
                </div>
              )}

              {placeSuggestions.length > 0 && (
                <div className="space-y-2">
                  {placeSuggestions.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => handleSelectPlaceSuggestion(place)}
                      className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-red-50/70 border border-gray-200/80 hover:border-red-300 transition flex items-start gap-3 group cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      <div className="h-9 w-9 rounded-xl bg-gray-100 group-hover:bg-[#E31E24] text-gray-500 group-hover:text-white flex items-center justify-center shrink-0 transition shadow-xs mt-0.5">
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E31E24] truncate">
                            {place.name}
                          </p>
                          {place.pincode && (
                            <span className="text-[10px] font-semibold bg-gray-100 group-hover:bg-red-100 text-gray-700 group-hover:text-red-700 px-1.5 py-0.5 rounded shrink-0">
                              PIN {place.pincode}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 group-hover:text-gray-700 line-clamp-1 mt-0.5">
                          {place.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#E31E24] group-hover:translate-x-0.5 transition shrink-0 mt-2.5" />
                    </button>
                  ))}
                </div>
              )}

              {!isSearchingPlaces && placeSuggestions.length === 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">No exact map landmark found for "{searchQuery}"</p>
                    <p className="text-amber-700 mt-0.5">You can still click "Set Location" above to deliver to "{searchQuery}".</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Divider if searching */}
          {searchQuery.trim().length >= 2 && filteredSavedAddresses.length > 0 && (
            <div className="border-t border-gray-100 pt-3" />
          )}

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
              {searchQuery.trim().length >= 2 ? "Matching Saved Addresses" : "Saved Delivery Addresses"} ({filteredSavedAddresses.length})
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

          {/* Add New Address Form */}
          {isAddingAddress && (
            <form
              onSubmit={handleSaveNewAddress}
              className="p-4 rounded-2xl bg-red-50/30 border border-red-200/80 space-y-3 animate-in fade-in duration-150"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={newAddr.recipientName}
                  onChange={(e) => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
                />
                <input
                  type="text"
                  placeholder="Mobile Phone"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
                />
              </div>

              <input
                type="text"
                placeholder="House / Flat / Block / Floor (Optional)"
                value={newAddr.houseFlat}
                onChange={(e) => setNewAddr({ ...newAddr, houseFlat: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
              />

              <input
                type="text"
                required
                placeholder="Street Address, Area, Landmark *"
                value={newAddr.streetLocality}
                onChange={(e) => setNewAddr({ ...newAddr, streetLocality: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
              />

              <div className="grid grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="City *"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
                />
                <input
                  type="text"
                  required
                  placeholder="State *"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
                />
                <input
                  type="text"
                  required
                  placeholder="PIN Code *"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 outline-none focus:border-[#E31E24]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-4 py-1.5 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSavingAddress ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          )}

          {/* Loading state for addresses */}
          {isLoadingAddresses && (
            <div className="py-8 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#E31E24]" />
              <span>Loading saved addresses...</span>
            </div>
          )}

          {/* Empty state: EXACTLY AS SPECIFIED IN REQUIREMENT */}
          {!isLoadingAddresses && savedAddresses.length === 0 && !isAddingAddress && (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
              <p className="text-sm font-bold text-gray-900">No saved delivery addresses yet</p>
              <p className="text-xs text-gray-500">Add a delivery address to make checkout faster.</p>
              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 cursor-pointer transition shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Address</span>
              </button>
            </div>
          )}

          {/* Populated Saved Addresses List */}
          {!isLoadingAddresses && filteredSavedAddresses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSavedAddresses.map((addr) => {
                const isSelected = userLocation?.id === addr.id;
                const Icon =
                  addr.label?.toLowerCase() === "work"
                    ? Building
                    : addr.label?.toLowerCase() === "garage"
                    ? Wrench
                    : Home;

                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={cn(
                      "flex flex-col justify-between p-3.5 rounded-2xl border transition relative group cursor-pointer text-left",
                      isSelected
                        ? "bg-red-50/60 border-[#E31E24] shadow-xs"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 shadow-2xs"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-6 w-6 rounded-lg flex items-center justify-center text-xs",
                              isSelected ? "bg-[#E31E24] text-white" : "bg-gray-100 text-gray-600"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-900">{addr.label || "Saved Address"}</span>
                          {addr.is_default && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <span className="h-5 w-5 rounded-full bg-[#E31E24] text-white flex items-center justify-center">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAddress(e, addr.id)}
                            className="h-6 w-6 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 grid place-items-center transition cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-700 font-medium truncate">
                        {addr.recipient_name} {addr.phone ? `(${addr.phone})` : ""}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                        {addr.street_address}, {addr.city} {addr.pincode}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {isSelected ? "Current Selection" : "Click to select"}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24] group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hyperlocal delivery powered by RiderzPro Fleet</span>
          </div>
          <button
            type="button"
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

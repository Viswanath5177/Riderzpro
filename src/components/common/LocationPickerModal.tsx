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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import {
  POPULAR_LOCATIONS,
  vendors,
  distanceKm,
  type LocationArea,
  toNormalizedLocation,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { getCurrentLocation, GpsError } from "@/lib/native/location";
import { reverseGeocode } from "@/lib/geo/reverseGeocode";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GpsState = "idle" | "loading" | "success" | "error";

export function LocationPickerModal({ isOpen, onClose }: LocationPickerModalProps) {
  const { userLocation, setUserLocation } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [gpsState, setGpsState] = useState<GpsState>("idle");
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Preview state (DO NOT AUTO-CONFIRM immediately)
  const [previewLocation, setPreviewLocation] = useState<LocationArea | null>(null);

  // Sync preview with userLocation whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewLocation(userLocation);
      setGpsState("idle");
      setGpsError(null);
      setSearchQuery("");
    }
  }, [isOpen, userLocation]);

  // Saved addresses
  const savedAddresses: Array<{
    id: string;
    type: "home" | "work" | "garage";
    title: string;
    address: string;
    loc: LocationArea;
  }> = [
    {
      id: "addr-home",
      type: "home",
      title: "Home",
      address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      loc: {
        id: "bellandur",
        name: "Bellandur / Green Glen",
        city: "Bengaluru",
        lat: 12.9304,
        lng: 77.6784,
        latitude: 12.9304,
        longitude: 77.6784,
        pincode: "560103",
        tag: "Outer Ring Rd",
        isPopular: true,
        source: "saved",
        address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      },
    },
    {
      id: "addr-work",
      type: "work",
      title: "Work / Office",
      address: "Prestige Tech Park, Outer Ring Road, Marathahalli 560103",
      loc: {
        id: "marathahalli",
        name: "Marathahalli",
        city: "Bengaluru",
        lat: 12.9591,
        lng: 77.6974,
        latitude: 12.9591,
        longitude: 77.6974,
        pincode: "560037",
        tag: "East Junction",
        isPopular: false,
        source: "saved",
        address: "Prestige Tech Park, Outer Ring Road, Marathahalli 560103",
      },
    },
    {
      id: "addr-garage",
      type: "garage",
      title: "Preferred Garage",
      address: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
      loc: {
        id: "indiranagar",
        name: "Indiranagar",
        city: "Bengaluru",
        lat: 12.9784,
        lng: 77.6408,
        latitude: 12.9784,
        longitude: 77.6408,
        pincode: "560038",
        tag: "Central-East Hub",
        isPopular: true,
        source: "saved",
        address: "100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
      },
    },
  ];

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

  // Select location in preview mode
  const handleSelect = (loc: LocationArea, source: "hub" | "saved" | "search" = "hub") => {
    const normalized = toNormalizedLocation(loc, source);
    const enriched: LocationArea = {
      ...loc,
      latitude: normalized.latitude,
      longitude: normalized.longitude,
      address: normalized.address,
      area: normalized.area,
      city: normalized.city,
      state: normalized.state,
      pincode: normalized.pincode,
      source,
    };
    setPreviewLocation(enriched);
  };

  // Real device GPS detection
  const handleDetectGps = async () => {
    if (gpsState === "loading") return; // Prevent multiple simultaneous requests

    setGpsState("loading");
    setGpsError(null);

    try {
      // 1. Fetch real GPS coordinates via Capacitor or Browser
      const pos = await getCurrentLocation({ enableHighAccuracy: true, timeout: 10000 });

      // 2. Reverse geocode coordinates via OSM / Nominatim
      const geocoded = await reverseGeocode(pos.latitude, pos.longitude);

      // 3. Construct normalized location object
      const detectedLoc: LocationArea = {
        id: `gps-${Date.now()}`,
        name: geocoded.area || `Location (${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)})`,
        city: geocoded.city || "Bengaluru",
        lat: pos.latitude,
        lng: pos.longitude,
        latitude: pos.latitude,
        longitude: pos.longitude,
        address: geocoded.formattedAddress || geocoded.displayName,
        area: geocoded.area,
        state: geocoded.state,
        pincode: geocoded.pincode,
        source: "gps",
        accuracy: pos.accuracy,
        timestamp: pos.timestamp,
        tag: "GPS Verified",
      };

      // Set preview ONLY — do not auto-confirm
      setPreviewLocation(detectedLoc);
      setGpsState("success");
      toast.success(`GPS location detected: ${detectedLoc.name}`, {
        description: "Review your location and click Done to confirm delivery destination.",
      });
    } catch (err: any) {
      setGpsState("error");
      const friendlyMessage =
        err instanceof GpsError
          ? err.message
          : "Unable to detect your location. Please try again.";
      setGpsError(friendlyMessage);
      toast.error(friendlyMessage);
    }
  };

  // Custom search location handler
  const handleCustomLocation = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    const customLoc: LocationArea = {
      id: `custom-${Date.now()}`,
      name: query,
      city: "Bengaluru",
      lat: 12.9716,
      lng: 77.5946,
      latitude: 12.9716,
      longitude: 77.5946,
      address: `${query}, Bengaluru`,
      area: query,
      state: "Karnataka",
      tag: "Custom Search",
      source: "search",
    };
    setPreviewLocation(customLoc);
  };

  // Done button confirms the selected preview location
  const handleDone = () => {
    if (previewLocation) {
      setUserLocation(previewLocation);
      toast.success(`Delivery location updated to ${previewLocation.name}`, {
        description: "Nearby stores, delivery times and fees have been adjusted for this area.",
      });
    }
    onClose();
  };

  const isGpsLoading = gpsState === "loading";
  const activeSelectedId = previewLocation?.id || userLocation?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-red-50 text-[#E31E24] border border-red-100 flex items-center justify-center shadow-xs shrink-0">
              <MapPin className="h-6 w-6" />
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
                <span className="font-bold text-[#111111]">{userLocation?.name || "Indiranagar"}</span>
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

        {/* Search Input Bar */}
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

          {/* Detect Live GPS Location Button with Exact 4 States */}
          <button
            onClick={handleDetectGps}
            disabled={isGpsLoading}
            className={cn(
              "w-full flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer group active:scale-[0.99]",
              gpsState === "error"
                ? "bg-amber-50/80 hover:bg-amber-100/70 border-amber-200 text-amber-900"
                : gpsState === "success"
                ? "bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200 text-emerald-900"
                : "bg-red-50/70 hover:bg-red-50 text-[#E31E24] border-red-100/90 hover:border-red-200",
              isGpsLoading && "opacity-80 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shadow-xs transition shrink-0",
                  gpsState === "error"
                    ? "bg-amber-600 text-white"
                    : gpsState === "success"
                    ? "bg-emerald-600 text-white"
                    : "bg-[#E31E24] text-white group-hover:scale-105"
                )}
              >
                {isGpsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : gpsState === "success" ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : gpsState === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Navigation className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                )}
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <span>
                    {isGpsLoading
                      ? "Detecting Location..."
                      : gpsState === "success"
                      ? "Location Detected"
                      : gpsState === "error"
                      ? "Unable to detect location — Try Again"
                      : "Use Current Location"}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                      gpsState === "error"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : gpsState === "success"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-white/80 text-red-700 border-red-200"
                    )}
                  >
                    GPS
                  </span>
                </p>
                <p
                  className={cn(
                    "text-[11px]",
                    gpsState === "error"
                      ? "text-amber-800/90 font-medium"
                      : gpsState === "success"
                      ? "text-emerald-700"
                      : "text-red-600/80"
                  )}
                >
                  {isGpsLoading
                    ? "Acquiring GPS fix and resolving street address..."
                    : gpsState === "success"
                    ? "GPS location detected. Click Done below to confirm."
                    : gpsState === "error"
                    ? gpsError || "Unable to detect your location. Please try again."
                    : "Using device GPS to find auto parts stores nearest to you"}
                </p>
              </div>
            </div>
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-transform",
                gpsState === "error"
                  ? "text-amber-600 group-hover:translate-x-1"
                  : gpsState === "success"
                  ? "text-emerald-600"
                  : "text-[#E31E24] group-hover:translate-x-1"
              )}
            />
          </button>

          {/* Detected GPS / Preview Location Banner (Non auto-confirmed) */}
          {previewLocation && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                      {previewLocation.source === "gps" ? "📍 Current Location" : "Preview Selected Location"}
                    </span>
                    {previewLocation.source === "gps" && (
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                        GPS Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {previewLocation.name}
                    {previewLocation.city ? `, ${previewLocation.city}` : ""}
                  </p>
                  <p className="text-[10.5px] text-gray-500 truncate">
                    {previewLocation.address || `${previewLocation.city} ${previewLocation.pincode || ""}`}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                Click Done to Confirm
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Saved Addresses Section */}
          {!searchQuery && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                  Saved Delivery Addresses
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {savedAddresses.map((addr) => {
                  const isSelected = activeSelectedId === addr.loc.id;
                  const Icon = addr.type === "home" ? Home : addr.type === "work" ? Building : Wrench;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => handleSelect(addr.loc, "saved")}
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
                        <span className="font-bold text-xs text-gray-900">{addr.title}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {addr.address}
                      </p>
                    </button>
                  );
                })}
              </div>
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
                  const isSelected = activeSelectedId === loc.id;
                  const nearestVendor = vendors
                    .map((v) => ({
                      vendor: v,
                      dist: Math.round(distanceKm(v, loc) * 10) / 10,
                    }))
                    .sort((a, b) => a.dist - b.dist)[0];

                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc, "hub")}
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
            onClick={handleDone}
            className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-black text-white font-bold text-xs shadow-xs cursor-pointer transition active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

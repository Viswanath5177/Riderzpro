import type {
  CreateShipmentParams,
  LogisticsProvider,
  NormalizedShipment,
  ServiceabilityResult,
  ShipmentEvent,
  ShipmentStatus,
} from "./types";

// Idempotency cache for processed webhook event IDs
const processedWebhookEventIds = new Set<string>();

/**
 * Normalizes vendor-specific status strings into standard RiderzPro ShipmentStatus
 */
export function normalizeProviderStatus(provider: LogisticsProvider, rawStatus: string): ShipmentStatus {
  const s = rawStatus.toLowerCase();

  if (s.includes("delivered") || s.includes("dlvd") || s.includes("handed over")) {
    return "Delivered";
  }
  if (s.includes("out for delivery") || s.includes("dispatched") || s.includes("ofd")) {
    return "Out for Delivery";
  }
  if (s.includes("transit") || s.includes("bagged") || s.includes("inbound") || s.includes("outbound") || s.includes("reached")) {
    return "In Transit";
  }
  if (s.includes("delay") || s.includes("hold") || s.includes("weather") || s.includes("monsoon") || s.includes("congestion")) {
    return "Delayed";
  }
  if (s.includes("fail") || s.includes("undelivered") || s.includes("customer not available") || s.includes("rto initiated")) {
    return "Failed Attempt";
  }
  if (s.includes("rto") || s.includes("return")) {
    return "Returned to Origin";
  }
  if (s.includes("pickup scheduled") || s.includes("manifest") || s.includes("awb created")) {
    return "Manifested";
  }
  return "In Transit";
}

export function checkProviderServiceability(provider: LogisticsProvider, pincode: string): ServiceabilityResult {
  const cleanPin = pincode.replace(/\D/g, "");
  const isSouthOrMetro = ["560", "600", "500", "400", "110", "700"].some((prefix) => cleanPin.startsWith(prefix));
  
  return {
    pincode: cleanPin || "560103",
    serviceable: cleanPin.length === 6,
    codAvailable: provider !== "Shadowfax" || isSouthOrMetro,
    estimatedDays: provider === "RiderzPro Fleet" ? 1 : isSouthOrMetro ? 2 : 4,
    hubName: cleanPin.startsWith("560") ? "Bengaluru Central Sort Center" : "Regional Logistics Facility",
  };
}

export function generateTrackingNumber(provider: LogisticsProvider): string {
  const randomPart = Math.floor(10000000 + Math.random() * 90000000);
  switch (provider) {
    case "Delhivery":
      return `DEL${randomPart}`;
    case "Bluedart":
      return `BLU${randomPart}`;
    case "Shadowfax":
      return `SFX${randomPart}`;
    case "RiderzPro Fleet":
      return `RZP${randomPart}`;
  }
}

export function getProviderTrackingUrl(provider: LogisticsProvider, trackingNumber: string): string {
  switch (provider) {
    case "Delhivery":
      return `https://www.delhivery.com/track/package/${trackingNumber}`;
    case "Bluedart":
      return `https://www.bluedart.com/tracking?trackNumber=${trackingNumber}`;
    case "Shadowfax":
      return `https://tracker.shadowfax.in/track?orderId=${trackingNumber}`;
    case "RiderzPro Fleet":
      return `/track/${trackingNumber}`;
  }
}

export function createNormalizedShipment(params: CreateShipmentParams): NormalizedShipment {
  const trackingNumber = generateTrackingNumber(params.provider);
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  const initialEvent: ShipmentEvent = {
    id: `evt-${Date.now()}-1`,
    timestamp: `${dateStr}, ${timeStr}`,
    status: "Manifested",
    location: `${params.pickupAddress.city} Pickup Facility`,
    description: `Shipment manifested with ${params.provider}. AWB generated.`,
    isGps: false,
    facilityName: `${params.pickupAddress.city} Fulfillment Hub`,
  };

  const isFleet = params.provider === "RiderzPro Fleet";

  return {
    shipmentId: `SHP-${params.orderId.replace(/\D/g, "").slice(-4) || "8821"}-${params.provider.slice(0, 3).toUpperCase()}`,
    orderId: params.orderId,
    provider: params.provider,
    providerReference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    trackingNumber,
    trackingUrl: getProviderTrackingUrl(params.provider, trackingNumber),
    pickupAddress: params.pickupAddress,
    destinationAddress: params.destinationAddress,
    status: "Manifested",
    locationType: isFleet ? "Live GPS Telemetry" : "Facility Checkpoint",
    latestLocation: `${params.pickupAddress.city} Fulfillment Hub`,
    lastEventTimestamp: "Just now",
    estimatedDelivery: isFleet ? "Today within 45 mins" : "Within 2-3 business days",
    events: [initialEvent],
    currentGps: isFleet ? { lat: 12.9716, lng: 77.5946, speedKmph: 28, heading: 45 } : undefined,
  };
}

export interface WebhookResult {
  success: boolean;
  isDuplicate: boolean;
  message: string;
  shipmentId?: string;
  updatedStatus?: ShipmentStatus;
  newEvent?: ShipmentEvent;
}

/**
 * Idempotent Webhook Processor
 * Rejects repeated event IDs, normalizes status, returns updated tracking record
 */
export function processCourierWebhookEvent(payload: {
  eventId: string;
  provider: LogisticsProvider;
  trackingNumber: string;
  rawStatus: string;
  location: string;
  timestamp?: string;
  details?: string;
  isGps?: boolean;
  latitude?: number;
  longitude?: number;
}): WebhookResult {
  if (!payload.eventId || !payload.trackingNumber) {
    return {
      success: false,
      isDuplicate: false,
      message: "Malformed webhook payload: missing eventId or trackingNumber",
    };
  }

  // Idempotency verification
  if (processedWebhookEventIds.has(payload.eventId)) {
    return {
      success: true,
      isDuplicate: true,
      message: `Idempotent skip: Event ${payload.eventId} has already been recorded and processed.`,
    };
  }

  processedWebhookEventIds.add(payload.eventId);

  const normalizedStatus = normalizeProviderStatus(payload.provider, payload.rawStatus);
  const now = new Date();
  const timeStr = payload.timestamp || `${now.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;

  const newEvent: ShipmentEvent = {
    id: payload.eventId,
    timestamp: timeStr,
    status: normalizedStatus,
    location: payload.location,
    description: payload.details || `Courier scan: ${payload.rawStatus} at ${payload.location}`,
    isGps: payload.isGps ?? false,
    facilityName: payload.isGps ? undefined : payload.location,
    coordinates: payload.latitude && payload.longitude ? { lat: payload.latitude, lng: payload.longitude } : undefined,
  };

  return {
    success: true,
    isDuplicate: false,
    message: `Successfully processed ${payload.provider} event ${payload.eventId} -> ${normalizedStatus}`,
    updatedStatus: normalizedStatus,
    newEvent,
  };
}

export type LogisticsProvider = "Delhivery" | "Bluedart" | "Shadowfax" | "RiderzPro Fleet";

export type ShipmentStatus =
  | "Pending Dispatch"
  | "Manifested"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "Failed Attempt"
  | "Cancelled"
  | "Returned to Origin";

export type LocationType = "Facility Checkpoint" | "Live GPS Telemetry";

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  isGps?: boolean;
  coordinates?: { lat: number; lng: number };
  facilityName?: string;
}

export interface AddressRef {
  name: string;
  street: string;
  city: string;
  state?: string;
  pincode: string;
  phone: string;
}

export interface NormalizedShipment {
  shipmentId: string;
  orderId: string;
  provider: LogisticsProvider;
  providerReference: string;
  trackingNumber: string;
  trackingUrl: string;
  pickupAddress: AddressRef;
  destinationAddress: AddressRef;
  status: ShipmentStatus;
  locationType: LocationType;
  latestLocation: string;
  lastEventTimestamp: string;
  estimatedDelivery: string;
  actualDeliveryTimestamp?: string;
  exceptionReason?: string;
  isDelayed?: boolean;
  events: ShipmentEvent[];
  currentGps?: { lat: number; lng: number; heading?: number; speedKmph?: number };
  proofOfDelivery?: {
    signedBy?: string;
    timestamp?: string;
    otpVerified?: boolean;
  };
}

export interface ServiceabilityResult {
  pincode: string;
  serviceable: boolean;
  codAvailable: boolean;
  estimatedDays: number;
  hubName: string;
}

export interface CreateShipmentParams {
  orderId: string;
  provider: LogisticsProvider;
  pickupAddress: AddressRef;
  destinationAddress: AddressRef;
  weightKg: number;
  itemDescription: string;
  isCod?: boolean;
  orderValue: number;
}

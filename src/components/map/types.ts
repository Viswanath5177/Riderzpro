/**
 * TypeScript types for Riderzpro Map Integration & Live Tracking.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Waypoint {
  step?: number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  sequence?: number;
  label?: string;
  eta_minute_offset?: number;
  [key: string]: unknown;
}

export interface RiderTrackingInfo {
  id: string;
  name?: string;
  phone?: string;
  vehicle_type?: string;
  rating?: number;
  current_latitude?: number | null;
  current_longitude?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  last_updated?: string | null;
  heading_degrees?: number | null;
  speed_kmh?: number | null;
  accuracy_meters?: number | null;
  is_stale?: boolean;
}

export interface DeliveryLocation {
  address?: string;
  latitude: number;
  longitude: number;
}

export interface DeliveryTrackingData {
  delivery_id: string;
  order_id: string;
  status: string;
  rider?: RiderTrackingInfo | null;
  pickup: DeliveryLocation;
  dropoff: DeliveryLocation;
  eta_minutes?: number | null;
  distance_km?: number | null;
  route_waypoints?: Waypoint[] | null;
  route_geometry?: Array<{ lat: number; lng: number; latitude?: number; longitude?: number }> | null;
  distance_to_dropoff_meters?: number | null;
  is_approaching?: boolean | null;
  is_arrived?: boolean | null;
  distance_from_route_meters?: number | null;
  is_route_deviating?: boolean | null;
  route_deviation_threshold_meters?: number | null;
}

export type ConnectionState = "connecting" | "connected" | "reconnecting" | "offline" | "completed";

export interface WebSocketTelemetryMessage {
  event:
    | "INITIAL_TRACKING_SNAPSHOT"
    | "RIDER_LOCATION_UPDATED"
    | "RIDER_APPROACHING"
    | "RIDER_ARRIVED"
    | "RIDER_ROUTE_DEVIATION"
    | "DELIVERY_COMPLETED"
    | "PING"
    | "PONG";
  delivery_id?: string;
  order_id?: string;
  rider_id?: string;
  rider?: {
    id: string;
    latitude: number;
    longitude: number;
    heading_degrees?: number | null;
    speed_kmh?: number | null;
  };
  latitude?: number;
  longitude?: number;
  eta_minutes?: number;
  distance_km?: number;
  distance_to_dropoff_meters?: number;
  distance_from_route_meters?: number;
  threshold_meters?: number;
  status?: string;
  tracking?: DeliveryTrackingData;
  timestamp?: string;
  battery?: {
    soc_percent?: number | null;
    temperature_celsius?: number | null;
  };
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface MapViewport {
  center: LatLng;
  zoom: number;
}

export interface MapProviderConfig {
  tileUrlTemplate: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
}

export const DEFAULT_MAP_CONFIG: MapProviderConfig = {
  tileUrlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
  minZoom: 4,
};

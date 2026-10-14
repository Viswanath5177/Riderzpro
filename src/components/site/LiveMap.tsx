import React, { useMemo } from "react";
import type { DeliveryTrackingData } from "../map/types";
import { DeliveryMap } from "../map/DeliveryMap";
import { useDeliveryTracking } from "../map/useDeliveryTracking";

export interface LiveMapProps {
  stops?: number;
  progress?: number;
  className?: string;
  deliveryId?: string | null;
  tracking?: DeliveryTrackingData | null;
  isApproaching?: boolean;
  isArrived?: boolean;
  isDeviating?: boolean;
  deviationDistance?: number | null;
  deviationThreshold?: number;
}

/**
 * High-fidelity fallback tracking dataset connecting Vijayawada Central to Amaravati Secretariat.
 * Used instantly while live REST/WebSocket loads or when running standalone previews.
 */
const FALLBACK_VIJAYAWADA_TRACKING: DeliveryTrackingData = {
  delivery_id: "delivery_vijayawada_amaravati_live",
  order_id: "delivery_vijayawada_amaravati_live",
  status: "in_transit",
  rider: {
    id: "rider_sathesh",
    name: "Sathesh Ittraju",
    phone: "+91 98490 12345",
    vehicle_type: "electric_bike",
    latitude: 16.5182,
    longitude: 80.6050,
    heading_degrees: 285.0,
    speed_kmh: 32.5,
    accuracy_meters: 3.5,
    is_stale: false,
  },
  pickup: {
    address: "Vijayawada Central Hub, MG Road, Vijayawada",
    latitude: 16.5062,
    longitude: 80.6480,
  },
  dropoff: {
    address: "Amaravati Capital Complex, Sector 4, Amaravati",
    latitude: 16.5417,
    longitude: 80.5158,
  },
  eta_minutes: 34.0,
  distance_km: 18.4,
  route_waypoints: [
    { sequence: 0, lat: 16.5062, lng: 80.6480, latitude: 16.5062, longitude: 80.6480, label: "Vijayawada Central Hub" },
    { sequence: 1, lat: 16.5120, lng: 80.6300, latitude: 16.5120, longitude: 80.6300, label: "Prakasam Barrage Road" },
    { sequence: 2, lat: 16.5182, lng: 80.6050, latitude: 16.5182, longitude: 80.6050, label: "Krishna River Crossing" },
    { sequence: 3, lat: 16.5280, lng: 80.5650, latitude: 16.5280, longitude: 80.5650, label: "Seed Access Road" },
    { sequence: 4, lat: 16.5417, lng: 80.5158, latitude: 16.5417, longitude: 80.5158, label: "Amaravati Secretariat" },
  ],
  route_geometry: [
    { lat: 16.5062, lng: 80.6480 },
    { lat: 16.5085, lng: 80.6420 },
    { lat: 16.5105, lng: 80.6350 },
    { lat: 16.5120, lng: 80.6300 },
    { lat: 16.5145, lng: 80.6210 },
    { lat: 16.5160, lng: 80.6120 },
    { lat: 16.5182, lng: 80.6050 },
    { lat: 16.5210, lng: 80.5950 },
    { lat: 16.5235, lng: 80.5840 },
    { lat: 16.5260, lng: 80.5730 },
    { lat: 16.5280, lng: 80.5650 },
    { lat: 16.5315, lng: 80.5520 },
    { lat: 16.5350, lng: 80.5390 },
    { lat: 16.5385, lng: 80.5270 },
    { lat: 16.5417, lng: 80.5158 },
  ],
  distance_to_dropoff_meters: 9800.0,
  is_approaching: false,
  is_arrived: false,
  is_route_deviating: false,
  distance_from_route_meters: 12.0,
  route_deviation_threshold_meters: 250.0,
};

/**
 * Universal LiveMap component:
 * Connects directly to real OpenStreetMap / Carto raster tiles.
 * - Displays authentic road routes, live GPS coordinates, and smooth rider animations.
 * - Streams WebSocket events for active deliveries.
 * - Never renders mock SVG grids.
 */
export function LiveMap({
  stops = 2,
  progress,
  className = "",
  deliveryId,
  tracking: externalTracking,
  isApproaching: externalApproaching,
  isArrived: externalArrived,
  isDeviating: externalDeviating,
  deviationDistance: externalDeviationDist,
  deviationThreshold: externalDeviationThresh,
}: LiveMapProps) {
  // Determine target delivery to track
  const activeDeliveryId = externalTracking
    ? null
    : deliveryId || "delivery_vijayawada_amaravati_live";

  // Stream live coordinates & events via REST + WebSocket
  const {
    data: liveTracking,
    connectionState,
    isApproaching: hookApproaching,
    isArrived: hookArrived,
    isDeviating: hookDeviating,
    deviationDistance: hookDeviationDist,
    deviationThreshold: hookDeviationThresh,
  } = useDeliveryTracking({
    deliveryId: activeDeliveryId,
    userRole: "customer",
  });

  // Consolidate effective tracking data
  const baseTracking = externalTracking ?? liveTracking ?? FALLBACK_VIJAYAWADA_TRACKING;

  // Apply optional simulated progress (if provided by demo slider/simulation)
  const effectiveTracking = useMemo(() => {
    if (!baseTracking) return null;
    if (progress === undefined || progress === null) return baseTracking;

    const geom = baseTracking.route_geometry || [];
    if (geom.length < 2) return baseTracking;

    const clampedP = Math.max(0, Math.min(1, progress));
    const targetIdx = Math.min(
      geom.length - 1,
      Math.floor(clampedP * (geom.length - 1))
    );
    const currPt = geom[targetIdx];
    const nextPt = geom[Math.min(geom.length - 1, targetIdx + 1)];

    // Calculate heading towards next point
    let heading = baseTracking.rider?.heading_degrees ?? 0;
    const curLat = currPt.lat ?? (currPt as { latitude?: number }).latitude ?? 0;
    const curLng = currPt.lng ?? (currPt as { longitude?: number }).longitude ?? 0;
    const nxtLat = nextPt.lat ?? (nextPt as { latitude?: number }).latitude ?? curLat;
    const nxtLng = nextPt.lng ?? (nextPt as { longitude?: number }).longitude ?? curLng;

    const dLat = nxtLat - curLat;
    const dLng = nxtLng - curLng;
    if (Math.abs(dLat) > 1e-6 || Math.abs(dLng) > 1e-6) {
      heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      if (heading < 0) heading += 360;
    }

    return {
      ...baseTracking,
      rider: baseTracking.rider
        ? {
            ...baseTracking.rider,
            latitude: curLat,
            longitude: curLng,
            current_latitude: curLat,
            current_longitude: curLng,
            heading_degrees: heading,
          }
        : {
            id: "rider_sathesh",
            name: "Sathesh Ittraju",
            vehicle_type: "electric_bike",
            latitude: curLat,
            longitude: curLng,
            heading_degrees: heading,
          },
    };
  }, [baseTracking, progress]);

  return (
    <DeliveryMap
      tracking={effectiveTracking}
      connectionState={externalTracking ? "connected" : connectionState}
      isApproaching={externalApproaching ?? hookApproaching}
      isArrived={externalArrived ?? hookArrived}
      isDeviating={externalDeviating ?? hookDeviating}
      deviationDistance={externalDeviationDist ?? hookDeviationDist}
      deviationThreshold={externalDeviationThresh ?? hookDeviationThresh}
      className={className}
    />
  );
}

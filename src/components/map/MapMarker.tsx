/**
 * Individual Map Marker components for Pickup, Dropoff, and Rider.
 * Rendered at exact projected pixel locations on top of the interactive map.
 */

import React from "react";
import { Store, Home, Bike, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { LatLng, RiderTrackingInfo } from "./types";
import { latLngToScreen, metersToPixels } from "./MercatorProjection";

interface MarkerBaseProps {
  position: LatLng;
  center: LatLng;
  zoom: number;
  viewWidth: number;
  viewHeight: number;
}

export function PickupMarker({
  position,
  center,
  zoom,
  viewWidth,
  viewHeight,
  address,
}: MarkerBaseProps & { address?: string }) {
  const { x, y } = latLngToScreen(position.lat, position.lng, center, zoom, viewWidth, viewHeight);

  // If outside visible view with margin, skip
  if (x < -50 || x > viewWidth + 50 || y < -50 || y > viewHeight + 50) return null;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer z-10 transition-transform duration-75"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="relative flex flex-col items-center">
        <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg transition-transform group-hover:scale-110">
          <Store className="h-4 w-4" />
        </span>
        <span className="mt-1 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white whitespace-nowrap shadow backdrop-blur-sm">
          Pickup
        </span>
        {address && (
          <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-30">
            <div className="rounded-lg bg-card/95 border border-border px-3 py-1.5 text-xs text-foreground shadow-xl backdrop-blur-md whitespace-nowrap">
              <p className="font-semibold text-blue-500">Pickup Origin</p>
              <p className="text-muted-foreground">{address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DropoffMarker({
  position,
  center,
  zoom,
  viewWidth,
  viewHeight,
  address,
  isApproaching,
  isArrived,
}: MarkerBaseProps & {
  address?: string;
  isApproaching?: boolean;
  isArrived?: boolean;
}) {
  const { x, y } = latLngToScreen(position.lat, position.lng, center, zoom, viewWidth, viewHeight);

  if (x < -100 || x > viewWidth + 100 || y < -100 || y > viewHeight + 100) return null;

  // Approximate pixel radii for geofence zones
  const approachingPx = metersToPixels(500, position.lat, zoom);
  const arrivalPx = metersToPixels(50, position.lat, zoom);

  return (
    <>
      {/* Geofence Circles */}
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        width={viewWidth}
        height={viewHeight}
      >
        {/* 500m Approaching Radius Zone */}
        {approachingPx > 4 && (
          <circle
            cx={x}
            cy={y}
            r={approachingPx}
            fill={isApproaching ? "rgba(59, 130, 246, 0.12)" : "rgba(100, 116, 139, 0.06)"}
            stroke={isApproaching ? "#3b82f6" : "rgba(100, 116, 139, 0.25)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}
        {/* 50m Arrival Radius Zone */}
        {arrivalPx > 3 && (
          <circle
            cx={x}
            cy={y}
            r={arrivalPx}
            fill={isArrived ? "rgba(34, 197, 94, 0.25)" : "rgba(100, 116, 139, 0.12)"}
            stroke={isArrived ? "#22c55e" : "rgba(100, 116, 139, 0.4)"}
            strokeWidth="2"
          />
        )}
      </svg>

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer z-10 transition-transform duration-75"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <div className="relative flex flex-col items-center">
          <span
            className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-white shadow-lg transition-transform group-hover:scale-110 ${
              isArrived ? "bg-emerald-500 animate-bounce" : "bg-emerald-600"
            }`}
          >
            {isArrived ? <CheckCircle2 className="h-4 w-4" /> : <Home className="h-4 w-4" />}
          </span>
          <span className="mt-1 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white whitespace-nowrap shadow backdrop-blur-sm">
            {isArrived ? "Arrived" : isApproaching ? "Approaching" : "Destination"}
          </span>
          {address && (
            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-30">
              <div className="rounded-lg bg-card/95 border border-border px-3 py-1.5 text-xs text-foreground shadow-xl backdrop-blur-md whitespace-nowrap">
                <p className="font-semibold text-emerald-500">Dropoff Destination</p>
                <p className="text-muted-foreground">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function RiderMarker({
  position,
  center,
  zoom,
  viewWidth,
  viewHeight,
  rider,
  isDeviating,
}: MarkerBaseProps & {
  rider?: RiderTrackingInfo | null;
  isDeviating?: boolean;
}) {
  const { x, y } = latLngToScreen(position.lat, position.lng, center, zoom, viewWidth, viewHeight);

  if (x < -50 || x > viewWidth + 50 || y < -50 || y > viewHeight + 50) return null;

  const heading = rider?.heading_degrees;
  const speed = rider?.speed_kmh;
  const isStale = rider?.is_stale;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer z-20 transition-all duration-300 ease-out"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsating Radar Ring */}
        <span
          className={`absolute -inset-3 rounded-full opacity-75 animate-ping pointer-events-none ${
            isDeviating ? "bg-amber-500" : isStale ? "bg-slate-400" : "bg-primary"
          }`}
        />

        {/* Rider Icon Orb with Heading Orientation */}
        <div
          className={`relative grid h-10 w-10 place-items-center rounded-full border-2 border-white text-white shadow-xl transition-transform ${
            isDeviating
              ? "bg-amber-500 shadow-amber-500/50"
              : isStale
                ? "bg-slate-600 shadow-slate-600/50"
                : "bg-primary shadow-primary/50"
          }`}
        >
          <div
            style={{
              transform:
                heading !== undefined && heading !== null ? `rotate(${heading}deg)` : "none",
              transition: "transform 0.3s ease",
            }}
          >
            <Bike className="h-5 w-5" />
          </div>
        </div>

        {/* Floating Telemetry Badge */}
        <div className="mt-1 flex items-center gap-1 rounded-full bg-black/85 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow backdrop-blur-md">
          {isDeviating && <AlertTriangle className="h-3 w-3 text-amber-400" />}
          <span>{rider?.name ? rider.name.split(" ")[0] : "Rider"}</span>
          {speed !== undefined && speed !== null && speed > 1 && (
            <span className="text-muted-foreground font-normal">· {Math.round(speed)} km/h</span>
          )}
          {isStale && <span className="text-amber-400 text-[9px]">(Stale)</span>}
        </div>

        {/* Hover Card */}
        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30">
          <div className="rounded-xl bg-card/95 border border-border p-3 text-xs text-foreground shadow-2xl backdrop-blur-md whitespace-nowrap min-w-[150px]">
            <p className="font-semibold text-primary">{rider?.name || "Rider / Fleet Unit"}</p>
            <p className="text-muted-foreground">{rider?.vehicle_type || "Electric Bike"}</p>
            {rider?.rating && (
              <p className="text-amber-500 font-semibold">★ {rider.rating.toFixed(1)}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-1">
              GPS: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
            {isDeviating && (
              <p className="text-[10px] font-bold text-amber-500 mt-1">⚠ Route Deviation Active</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Map Marker components for Pickup, Dropoff, and Rider.
 * Rendered at exact projected pixel locations on top of the interactive map.
 * Styled to match modern delivery tracking apps (Rapido, Swiggy, Uber).
 */

import React from "react";
import {
  Store,
  Home,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Zap,
} from "lucide-react";
import type { LatLng, RiderTrackingInfo } from "./types";
import { latLngToScreen, metersToPixels } from "./MercatorProjection";

interface MarkerBaseProps {
  position: LatLng;
  center: LatLng;
  zoom: number;
  viewWidth: number;
  viewHeight: number;
}

/**
 * Modern Delivery Scooter SVG Icon
 * Top-angle delivery scooter with delivery box and rider silhouette.
 */
function DeliveryScooterSvg({ className = "h-6 w-6 text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Front wheel */}
      <circle cx="24" cy="23" r="3.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
      {/* Rear wheel */}
      <circle cx="8" cy="23" r="3.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
      {/* Chassis / Body */}
      <path
        d="M9 22h5l3-7h5l2 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Handlebar */}
      <path
        d="M21 12l2 3h-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Delivery Box (Rear) */}
      <rect
        x="6"
        y="12"
        width="6.5"
        height="6.5"
        rx="1.5"
        fill="#f59e0b"
        stroke="#ffffff"
        strokeWidth="1"
      />
      {/* Rider Helmet */}
      <circle cx="17" cy="8" r="3" fill="#ffffff" />
      {/* Forward Arrow indicator */}
      <path d="M16 2l3 3h-6z" fill="#38bdf8" />
    </svg>
  );
}

/**
 * 6. PICKUP MARKER
 * Modern circular card-style badge labeled PICKUP (Vijayawada Hub).
 */
export function PickupMarker({
  position,
  center,
  zoom,
  viewWidth,
  viewHeight,
  address,
}: MarkerBaseProps & { address?: string }) {
  const { x, y } = latLngToScreen(position.lat, position.lng, center, zoom, viewWidth, viewHeight);

  if (x < -60 || x > viewWidth + 60 || y < -60 || y > viewHeight + 60) return null;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto group cursor-pointer z-10 transition-transform duration-75"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="relative flex flex-col items-center">
        {/* Floating pill badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 text-white px-2.5 py-1 shadow-lg ring-1 ring-black/10 backdrop-blur-sm group-hover:scale-105 transition-transform mb-1">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase">PICKUP</span>
        </div>

        {/* Pin circle */}
        <div className="relative flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white shadow-xl ring-3 ring-white flex items-center justify-center">
            <Store className="h-4 w-4" />
          </div>
          {/* Subtle pin needle */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-blue-600" />
        </div>

        {/* Hover address card */}
        {address && (
          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
            <div className="rounded-xl bg-white/95 border border-slate-200 px-3 py-2 text-xs text-slate-800 shadow-xl backdrop-blur-md whitespace-nowrap">
              <p className="font-bold text-blue-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Pickup Origin
              </p>
              <p className="text-slate-600 text-[11px] mt-0.5">{address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 7. DESTINATION MARKER
 * Modern destination pin clearly indicating Amaravati, with subtle 500m/50m geofence rings.
 */
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

  // Subtle geofence rings
  const approachingPx = metersToPixels(500, position.lat, zoom);
  const arrivalPx = metersToPixels(50, position.lat, zoom);

  return (
    <>
      {/* 15. Subtle Geofence Circles */}
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        width={viewWidth}
        height={viewHeight}
      >
        {/* 500m Approaching Radius Zone */}
        {approachingPx > 6 && (
          <circle
            cx={x}
            cy={y}
            r={approachingPx}
            fill={isApproaching ? "rgba(16, 185, 129, 0.08)" : "rgba(148, 163, 184, 0.04)"}
            stroke={isApproaching ? "#10b981" : "rgba(148, 163, 184, 0.3)"}
            strokeWidth={isApproaching ? "2" : "1"}
            strokeDasharray={isApproaching ? "5 4" : "4 4"}
            className={isApproaching ? "animate-pulse" : ""}
          />
        )}
        {/* 50m Arrival Radius Zone */}
        {arrivalPx > 4 && (
          <circle
            cx={x}
            cy={y}
            r={arrivalPx}
            fill={isArrived ? "rgba(16, 185, 129, 0.25)" : "rgba(148, 163, 184, 0.08)"}
            stroke={isArrived ? "#059669" : "rgba(148, 163, 184, 0.5)"}
            strokeWidth="2"
          />
        )}
      </svg>

      <div
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto group cursor-pointer z-10 transition-transform duration-75"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <div className="relative flex flex-col items-center">
          {/* Destination pill badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-lg ring-1 ring-black/10 backdrop-blur-sm group-hover:scale-105 transition-transform mb-1 ${
              isArrived
                ? "bg-emerald-600 text-white animate-bounce"
                : isApproaching
                ? "bg-slate-900/90 text-emerald-400"
                : "bg-slate-900/90 text-white"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isArrived ? "bg-white animate-ping" : "bg-emerald-400"
              }`}
            />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {isArrived ? "ARRIVED" : "DESTINATION"}
            </span>
          </div>

          {/* Pin circle */}
          <div className="relative flex items-center justify-center">
            <div
              className={`h-8 w-8 rounded-full text-white shadow-xl ring-3 ring-white flex items-center justify-center transition-colors ${
                isArrived
                  ? "bg-emerald-600 ring-emerald-300"
                  : isApproaching
                  ? "bg-emerald-600 ring-emerald-200"
                  : "bg-emerald-600"
              }`}
            >
              {isArrived ? <CheckCircle2 className="h-4 w-4" /> : <Home className="h-4 w-4" />}
            </div>
            {/* Pin needle */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-emerald-600" />
          </div>

          {/* Hover address card */}
          {address && (
            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
              <div className="rounded-xl bg-white/95 border border-slate-200 px-3 py-2 text-xs text-slate-800 shadow-xl backdrop-blur-md whitespace-nowrap">
                <p className="font-bold text-emerald-600 flex items-center gap-1">
                  <Home className="h-3 w-3" /> Amaravati Destination
                </p>
                <p className="text-slate-600 text-[11px] mt-0.5">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * 5. RIDER MARKER (Sathesh Ittraju)
 * Modern vehicle marker with delivery bike/scooter styling, heading rotation,
 * radar pulse, compact pill badge, and stale state handling.
 */
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

  if (x < -60 || x > viewWidth + 60 || y < -60 || y > viewHeight + 60) return null;

  const heading = rider?.heading_degrees ?? 0;
  const speed = rider?.speed_kmh ?? 0;
  const isStale = rider?.is_stale;
  const driverName = rider?.name ? rider.name.split(" ")[0] : "Sathesh";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer z-20 will-change-transform"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Subtle Live Radar Pulse Wave */}
        {!isStale && (
          <span
            className={`absolute -inset-3 rounded-full opacity-60 animate-ping pointer-events-none ${
              isDeviating ? "bg-amber-400" : "bg-sky-400"
            }`}
          />
        )}

        {/* Circular Modern Vehicle Disc with Heading Rotation */}
        <div
          className={`relative h-11 w-11 rounded-full p-1.5 flex items-center justify-center shadow-2xl transition-colors duration-300 ring-2 ${
            isDeviating
              ? "bg-amber-500 ring-white shadow-amber-500/50"
              : isStale
              ? "bg-slate-500 ring-white shadow-slate-500/40"
              : "bg-slate-900 ring-white shadow-black/40"
          }`}
        >
          {/* Inner rotating vehicle icon container */}
          <div
            className="w-full h-full flex items-center justify-center will-change-transform"
            style={{
              transform: `rotate(${heading}deg)`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <DeliveryScooterSvg className="h-7 w-7 text-white" />
          </div>

          {/* Electric / EV green badge in corner */}
          <div
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-white ring-1 ring-white flex items-center justify-center shadow"
            title="Electric Bike Fleet"
          >
            <Zap className="h-2.5 w-2.5 fill-current" />
          </div>
        </div>

        {/* Compact Rider Badge: "Sathesh · 34 km/h" */}
        <div className="mt-1 flex items-center gap-1 rounded-full bg-slate-900/95 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-lg ring-1 ring-black/10 backdrop-blur-md whitespace-nowrap">
          {isDeviating ? (
            <AlertTriangle className="h-3 w-3 text-amber-400 animate-pulse" />
          ) : (
            <span
              className={`h-2 w-2 rounded-full ${
                isStale ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
              }`}
            />
          )}
          <span>{driverName}</span>
          {speed > 1 && (
            <span className="text-slate-300 font-medium text-[10px]">
              · {Math.round(speed)} km/h
            </span>
          )}
          {isStale && <span className="text-amber-400 text-[9px] font-normal">(Stale)</span>}
        </div>

        {/* Hover / Tooltip Card */}
        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
          <div className="rounded-2xl bg-white/95 border border-slate-200 p-3 text-xs text-slate-800 shadow-2xl backdrop-blur-md whitespace-nowrap min-w-[160px]">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900">{rider?.name || "Sathesh Ittraju"}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                ★ 4.9
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-1.5">
              {rider?.vehicle_type ? rider.vehicle_type.replace(/_/g, " ") : "Electric Bike"}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Heading: {Math.round(heading)}° | Speed: {Math.round(speed)} km/h
            </p>
            {isDeviating && (
              <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Off Planned Route
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

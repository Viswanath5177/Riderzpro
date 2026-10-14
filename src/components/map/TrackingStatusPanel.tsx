/**
 * Live Tracking Information Panel.
 * Displays delivery metadata, active telemetry, rider information,
 * geofence states, and route deviation diagnostics.
 */

import React from "react";
import {
  Bike,
  Phone,
  Star,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { DeliveryTrackingData, ConnectionState } from "./types";

interface TrackingStatusPanelProps {
  tracking: DeliveryTrackingData | null;
  connectionState: ConnectionState;
  isApproaching?: boolean;
  isArrived?: boolean;
  isDeviating?: boolean;
  deviationDistance?: number | null;
  deviationThreshold?: number;
}

export function TrackingStatusPanel({
  tracking,
  connectionState,
  isApproaching,
  isArrived,
  isDeviating,
  deviationDistance,
  deviationThreshold = 250,
}: TrackingStatusPanelProps) {
  if (!tracking) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
        <div className="h-6 w-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-16 w-full bg-muted animate-pulse rounded-2xl" />
        <div className="h-24 w-full bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  const rider = tracking.rider;
  const isStale = rider?.is_stale;
  const speed = rider?.speed_kmh;
  const eta = tracking.eta_minutes;
  const distance = tracking.distance_km;

  // Format delivery status for display
  const statusLabel = tracking.status.replace(/_/g, " ").toUpperCase();

  return (
    <div className="space-y-4">
      {/* 1. Primary Status Card */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Delivery Task
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {tracking.delivery_id}
            </p>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border">
            {connectionState === "connected" ? (
              <span className="flex items-center gap-1.5 text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry
              </span>
            ) : connectionState === "reconnecting" ? (
              <span className="flex items-center gap-1.5 text-amber-500 border-amber-500/20 bg-amber-500/10">
                <Wifi className="h-3 w-3 animate-spin" />
                Reconnecting...
              </span>
            ) : connectionState === "completed" ? (
              <span className="flex items-center gap-1.5 text-blue-500 border-blue-500/20 bg-blue-500/10">
                <CheckCircle2 className="h-3 w-3" />
                Concluded
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400 border-slate-400/20 bg-slate-400/10">
                <WifiOff className="h-3 w-3" />
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Live Metrics: ETA & Remaining Distance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted/60 p-3.5 border border-border/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Estimated ETA</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {eta !== null && eta !== undefined ? `${Math.round(eta)} min` : "Calculating..."}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/60 p-3.5 border border-border/40">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Navigation className="h-3.5 w-3.5 text-primary" />
              <span>Remaining Distance</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {distance !== null && distance !== undefined
                ? `${distance.toFixed(1)} km`
                : "Calculating..."}
            </p>
          </div>
        </div>

        {/* Stale Signal Warning */}
        {isStale && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-500 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Rider GPS signal has not updated in over 10 minutes (Stale Signal).</span>
          </div>
        )}

        {/* Route Deviation Box */}
        {isDeviating && (
          <div className="rounded-2xl bg-amber-500/15 border border-amber-500/40 p-3.5 text-xs text-amber-600 dark:text-amber-400 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>Route Deviation Detected</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Rider is currently{" "}
              {deviationDistance ? <strong>{Math.round(deviationDistance)}m</strong> : "outside"}{" "}
              away from the planned route corridor (Allowed threshold:{" "}
              {Math.round(deviationThreshold)}m).
            </p>
          </div>
        )}

        {/* Geofence Milestones */}
        {isArrived ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-500 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Rider has arrived at the delivery destination.</span>
          </div>
        ) : isApproaching ? (
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-3 text-xs text-blue-500 flex items-center gap-2 font-semibold">
            <Navigation className="h-4 w-4 shrink-0 animate-bounce" />
            <span>Rider is approaching the delivery destination.</span>
          </div>
        ) : null}
      </div>

      {/* 2. Rider Information Card */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Assigned Rider & Vehicle
        </p>

        {rider ? (
          <div className="mt-3.5 flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md font-bold text-lg">
              {rider.name ? rider.name[0] : <Bike className="h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {rider.name || "Fleet Technician"}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {rider.vehicle_type ? rider.vehicle_type.replace(/_/g, " ") : "Electric Vehicle"}
                {speed ? ` · ${Math.round(speed)} km/h` : ""}
              </p>
              {rider.rating && (
                <p className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                  <Star className="h-3 w-3 fill-amber-500" />
                  {rider.rating.toFixed(1)}
                </p>
              )}
            </div>

            {rider.phone && (
              <a
                href={`tel:${rider.phone}`}
                className="grid h-10 w-10 place-items-center rounded-xl bg-muted border border-border hover:bg-primary hover:text-white transition-all text-muted-foreground"
                title={`Call ${rider.name || "Rider"}`}
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            A rider has not been assigned to this delivery task yet.
          </p>
        )}
      </div>

      {/* 3. Origin & Destination Waypoints Summary */}
      <div className="rounded-3xl border border-border bg-card p-5 text-xs shadow-card space-y-3">
        <div>
          <span className="font-semibold text-blue-500">Pickup Origin</span>
          <p className="text-muted-foreground mt-0.5">
            {tracking.pickup.address || "Vendor Fulfillment Hub"}
          </p>
        </div>
        <div className="border-t border-border/50 pt-2.5">
          <span className="font-semibold text-emerald-500">Dropoff Destination</span>
          <p className="text-muted-foreground mt-0.5">
            {tracking.dropoff.address || "Customer Delivery Address"}
          </p>
        </div>
      </div>
    </div>
  );
}

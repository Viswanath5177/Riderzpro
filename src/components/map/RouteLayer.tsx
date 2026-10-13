/**
 * SVG Route Polyline and Deviation Corridor Layer.
 * Renders the planned itinerary waypoints and deviation projection lines.
 */

import React, { useMemo } from "react";
import type { LatLng, Waypoint } from "./types";
import { latLngToScreen } from "./MercatorProjection";

interface RouteLayerProps {
  waypoints?: Waypoint[] | null;
  pickup?: LatLng | null;
  dropoff?: LatLng | null;
  riderPosition?: LatLng | null;
  isDeviating?: boolean;
  center: LatLng;
  zoom: number;
  viewWidth: number;
  viewHeight: number;
}

export function RouteLayer({
  waypoints,
  pickup,
  dropoff,
  riderPosition,
  isDeviating,
  center,
  zoom,
  viewWidth,
  viewHeight,
}: RouteLayerProps) {
  // Assemble full sequence of ordered route points
  const points: LatLng[] = useMemo(() => {
    const list: LatLng[] = [];
    if (pickup) list.push({ lat: pickup.lat, lng: pickup.lng });

    if (waypoints && waypoints.length > 0) {
      for (const wp of waypoints) {
        if (typeof wp.lat === "number" && typeof wp.lng === "number") {
          list.push({ lat: wp.lat, lng: wp.lng });
        }
      }
    }

    if (dropoff) list.push({ lat: dropoff.lat, lng: dropoff.lng });

    // Deduplicate consecutive identical points
    return list.filter((pt, i) => {
      if (i === 0) return true;
      const prev = list[i - 1];
      return Math.abs(pt.lat - prev.lat) > 1e-6 || Math.abs(pt.lng - prev.lng) > 1e-6;
    });
  }, [waypoints, pickup, dropoff]);

  // Project points to screen coordinates
  const screenPoints = useMemo(() => {
    return points.map((pt) => latLngToScreen(pt.lat, pt.lng, center, zoom, viewWidth, viewHeight));
  }, [points, center, zoom, viewWidth, viewHeight]);

  // Build SVG path string
  const svgPath = useMemo(() => {
    if (screenPoints.length < 2) return "";
    return screenPoints
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(" ");
  }, [screenPoints]);

  // Find nearest route point to rider when deviating to draw projection line
  const deviationProjection = useMemo(() => {
    if (!isDeviating || !riderPosition || screenPoints.length === 0) return null;

    const riderScreen = latLngToScreen(
      riderPosition.lat,
      riderPosition.lng,
      center,
      zoom,
      viewWidth,
      viewHeight,
    );

    let nearestPt = screenPoints[0];
    let minDistSq = Infinity;

    for (const pt of screenPoints) {
      const dx = pt.x - riderScreen.x;
      const dy = pt.y - riderScreen.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        nearestPt = pt;
      }
    }

    return { from: riderScreen, to: nearestPt };
  }, [isDeviating, riderPosition, screenPoints, center, zoom, viewWidth, viewHeight]);

  if (screenPoints.length < 2) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-[5]"
      width={viewWidth}
      height={viewHeight}
    >
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Route Corridor Casing / Outline */}
      <path
        d={svgPath}
        fill="none"
        stroke="rgba(0, 0, 0, 0.4)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer Glow Line */}
      <path
        d={svgPath}
        fill="none"
        stroke="url(#routeGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#routeGlow)"
        opacity="0.95"
      />

      {/* Inner Active Directional Dash Line */}
      <path
        d={svgPath}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeDasharray="6 8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Route Deviation Warning Projection Line */}
      {deviationProjection && (
        <g>
          <line
            x1={deviationProjection.from.x}
            y1={deviationProjection.from.y}
            x2={deviationProjection.to.x}
            y2={deviationProjection.to.y}
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            opacity="0.9"
          />
          <circle
            cx={deviationProjection.to.x}
            cy={deviationProjection.to.y}
            r="4"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>
      )}
    </svg>
  );
}

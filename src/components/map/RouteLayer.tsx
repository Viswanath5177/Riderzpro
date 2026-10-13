/**
 * SVG Route Polyline and Deviation Corridor Layer.
 * Renders the planned itinerary waypoints and deviation projection lines.
 */

import React, { useMemo } from "react";
import type { LatLng, Waypoint } from "./types";
import { latLngToScreen } from "./MercatorProjection";

interface RouteLayerProps {
  waypoints?: Waypoint[] | null;
  routeGeometry?: Array<{ lat?: number; lng?: number; latitude?: number; longitude?: number }> | null;
  pickup?: LatLng | null;
  dropoff?: LatLng | null;
  riderPosition?: LatLng | null;
  isDeviating?: boolean;
  isDelivered?: boolean;
  center: LatLng;
  zoom: number;
  viewWidth: number;
  viewHeight: number;
}

export function RouteLayer({
  waypoints,
  routeGeometry,
  pickup,
  dropoff,
  riderPosition,
  isDeviating,
  isDelivered = false,
  center,
  zoom,
  viewWidth,
  viewHeight,
}: RouteLayerProps) {
  // Assemble full sequence of ordered route points using real road geometry
  const points: LatLng[] = useMemo(() => {
    const list: LatLng[] = [];

    // Prioritize high-fidelity road route geometry over sparse waypoints
    const geometrySource = routeGeometry && routeGeometry.length > 0 ? routeGeometry : waypoints;

    if (pickup) list.push({ lat: pickup.lat, lng: pickup.lng });

    if (geometrySource && geometrySource.length > 0) {
      for (const pt of geometrySource) {
        const lat =
          typeof pt.lat === "number"
            ? pt.lat
            : typeof (pt as { latitude?: number }).latitude === "number"
              ? (pt as { latitude?: number }).latitude!
              : undefined;
        const lng =
          typeof pt.lng === "number"
            ? pt.lng
            : typeof (pt as { longitude?: number }).longitude === "number"
              ? (pt as { longitude?: number }).longitude!
              : undefined;

        if (typeof lat === "number" && typeof lng === "number") {
          list.push({ lat, lng });
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
  }, [routeGeometry, waypoints, pickup, dropoff]);

  // Split points into: Completed (traveled) and Remaining (ahead) based on rider location
  const { completedPoints, remainingPoints, nearestRoutePoint } = useMemo(() => {
    if (points.length < 2) {
      return { completedPoints: [], remainingPoints: points, nearestRoutePoint: null };
    }

    if (isDelivered) {
      return { completedPoints: points, remainingPoints: [], nearestRoutePoint: null };
    }

    if (!riderPosition) {
      return { completedPoints: [], remainingPoints: points, nearestRoutePoint: null };
    }

    // Find nearest segment on the route to the rider
    let minDistanceSq = Infinity;
    let bestSegIdx = 0;
    let bestProj: LatLng = points[0];

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const dx = p2.lng - p1.lng;
      const dy = p2.lat - p1.lat;
      const lenSq = dx * dx + dy * dy;

      let t = 0;
      if (lenSq > 1e-13) {
        t = Math.max(0, Math.min(1, ((riderPosition.lng - p1.lng) * dx + (riderPosition.lat - p1.lat) * dy) / lenSq));
      }

      const projLat = p1.lat + t * dy;
      const projLng = p1.lng + t * dx;

      const distSq =
        Math.pow(riderPosition.lat - projLat, 2) + Math.pow(riderPosition.lng - projLng, 2);

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        bestSegIdx = i;
        bestProj = { lat: projLat, lng: projLng };
      }
    }

    // Build completed points list
    const completed: LatLng[] = points.slice(0, bestSegIdx + 1);
    completed.push(bestProj);
    completed.push(riderPosition);

    // Build remaining points list
    const remaining: LatLng[] = [riderPosition, bestProj, ...points.slice(bestSegIdx + 1)];

    return {
      completedPoints: completed,
      remainingPoints: remaining,
      nearestRoutePoint: bestProj,
    };
  }, [points, riderPosition, isDelivered]);

  // Project points to screen coordinates
  const completedScreen = useMemo(() => {
    if (completedPoints.length < 2) return [];
    return completedPoints.map((pt) =>
      latLngToScreen(pt.lat, pt.lng, center, zoom, viewWidth, viewHeight),
    );
  }, [completedPoints, center, zoom, viewWidth, viewHeight]);

  const remainingScreen = useMemo(() => {
    if (remainingPoints.length < 2) return [];
    return remainingPoints.map((pt) =>
      latLngToScreen(pt.lat, pt.lng, center, zoom, viewWidth, viewHeight),
    );
  }, [remainingPoints, center, zoom, viewWidth, viewHeight]);

  // Build SVG path strings
  const completedSvgPath = useMemo(() => {
    if (completedScreen.length < 2) return "";
    return completedScreen
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(" ");
  }, [completedScreen]);

  const remainingSvgPath = useMemo(() => {
    if (remainingScreen.length < 2) return "";
    return remainingScreen
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(" ");
  }, [remainingScreen]);

  // Find projection line for off-route warning
  const deviationProjection = useMemo(() => {
    if (!isDeviating || !riderPosition || !nearestRoutePoint) return null;

    const riderScreen = latLngToScreen(
      riderPosition.lat,
      riderPosition.lng,
      center,
      zoom,
      viewWidth,
      viewHeight,
    );

    const nearestScreen = latLngToScreen(
      nearestRoutePoint.lat,
      nearestRoutePoint.lng,
      center,
      zoom,
      viewWidth,
      viewHeight,
    );

    return { from: riderScreen, to: nearestScreen };
  }, [isDeviating, riderPosition, nearestRoutePoint, center, zoom, viewWidth, viewHeight]);

  if (completedScreen.length < 2 && remainingScreen.length < 2) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-[5]"
      width={viewWidth}
      height={viewHeight}
    >
      <defs>
        {/* Modern Vibrant Gradient for Active Ahead Route */}
        <linearGradient id="remainingRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Soft Modern Glow Filter */}
        <filter id="routeGlowSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ======================================================== */}
      {/* 1. COMPLETED TRAVELED ROUTE (Sleek Slate Trail)          */}
      {/* ======================================================== */}
      {completedSvgPath && (
        <g opacity="0.8">
          {/* Subtle Casing */}
          <path
            d={completedSvgPath}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Traveled Polyline */}
          <path
            d={completedSvgPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* ======================================================== */}
      {/* 2. REMAINING ACTIVE ROUTE (Vibrant Swiggy/Uber Blue)     */}
      {/* ======================================================== */}
      {remainingSvgPath && (
        <g>
          {/* Subtle Outer Drop Shadow */}
          <path
            d={remainingSvgPath}
            fill="none"
            stroke="rgba(15, 23, 42, 0.15)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Glowing Route Line */}
          <path
            d={remainingSvgPath}
            fill="none"
            stroke="url(#remainingRouteGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlowSoft)"
          />

          {/* Inner Animated Directional Dashes */}
          <path
            d={remainingSvgPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            className="animate-[dash_20s_linear_infinite]"
          />
        </g>
      )}

      {/* ======================================================== */}
      {/* 3. OFF-ROUTE DEVIATION WARNING PROJECTION                */}
      {/* ======================================================== */}
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
            opacity="0.95"
          />
          <circle
            cx={deviationProjection.to.x}
            cy={deviationProjection.to.y}
            r="4.5"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}

/**
 * DeliveryMap: Modern, provider-agnostic delivery tracking map component.
 * Uses 100% OpenStreetMap / Carto Voyager raster tiles.
 * Features:
 * - Clean modern light map styling (Rapido / Swiggy / Uber aesthetic)
 * - Smooth rider movement interpolation (lerp animation at 60fps)
 * - Heading rotation and live radar pulse for Sathesh Ittraju
 * - Road-following route with traveled vs remaining progress separation
 * - Follow Rider mode with auto-disable on user interaction
 * - Modern floating controls (+ / − / Follow Rider / Recenter)
 * - Modern floating delivery information card with live ETA, distance, and telemetry status
 * - Geofence milestone and route deviation banners
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Minus,
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bike,
  ShieldCheck,
  LocateFixed,
  Zap,
  RefreshCw,
} from "lucide-react";
import type { DeliveryTrackingData, LatLng, ConnectionState } from "./types";
import { useMap, MapProvider } from "./MapProvider";
import { PickupMarker, DropoffMarker, RiderMarker } from "./MapMarker";
import { RouteLayer } from "./RouteLayer";
import { latLngToUnitPoint, screenToLatLng, TILE_SIZE } from "./MercatorProjection";
import { useDeliveryTracking } from "./useDeliveryTracking";

export interface DeliveryMapProps {
  orderId?: string | null;
  deliveryId?: string | null;
  tracking?: DeliveryTrackingData | null;
  connectionState?: ConnectionState;
  isApproaching?: boolean;
  isArrived?: boolean;
  isDeviating?: boolean;
  deviationDistance?: number | null;
  deviationThreshold?: number;
  className?: string;
}

export function DeliveryMap(props: DeliveryMapProps) {
  if (props.tracking !== undefined) {
    return (
      <MapProvider>
        <DeliveryMapInner {...props} />
      </MapProvider>
    );
  }

  return <ConnectedDeliveryMap {...props} />;
}

function ConnectedDeliveryMap({
  orderId,
  deliveryId,
  className = "",
  ...rest
}: DeliveryMapProps) {
  const effectiveId = orderId || deliveryId || null;
  const {
    data: tracking,
    connectionState,
    isApproaching,
    isArrived,
    isDeviating,
    deviationDistance,
    deviationThreshold,
    error,
  } = useDeliveryTracking({
    deliveryId: effectiveId,
    userRole: "customer",
  });

  if (!effectiveId) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-slate-200/90 bg-[#f8fafc] shadow-md min-h-[320px] ${className}`}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-3">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="font-display font-bold text-slate-800 text-sm sm:text-base">
          Live tracking is not available for this order yet.
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Courier GPS telemetry will become active as soon as this delivery is dispatched.
        </p>
      </div>
    );
  }

  // Connecting / loading state
  if (connectionState === "connecting" && !tracking && !error) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-slate-200/90 bg-[#f8fafc] shadow-md min-h-[320px] ${className}`}
      >
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-50 text-[#E31E24] mb-3">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <p className="font-display font-bold text-slate-800 text-sm sm:text-base">
          Connecting to Live Courier Telemetry...
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Establishing real-time GPS telemetry link for order {effectiveId}
        </p>
      </div>
    );
  }

  // Not found or error state
  if (error || !tracking) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-slate-200/90 bg-[#f8fafc] shadow-md min-h-[320px] ${className}`}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-3">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="font-display font-bold text-slate-800 text-sm sm:text-base">
          Live tracking is not available for this order yet.
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Courier GPS telemetry will become active as soon as this delivery is dispatched.
        </p>
      </div>
    );
  }

  return (
    <MapProvider>
      <DeliveryMapInner
        tracking={tracking}
        connectionState={connectionState}
        isApproaching={isApproaching}
        isArrived={isArrived}
        isDeviating={isDeviating}
        deviationDistance={deviationDistance}
        deviationThreshold={deviationThreshold}
        className={className}
        {...rest}
      />
    </MapProvider>
  );
}

/**
 * Custom hook to smoothly interpolate rider coordinates & heading
 * so the vehicle marker glides instead of jumping between GPS updates.
 */
function useSmoothRider(targetPos: LatLng | null, targetHeading: number = 0) {
  const [currentPos, setCurrentPos] = useState<LatLng | null>(targetPos);
  const [currentHeading, setCurrentHeading] = useState<number>(targetHeading);

  const animRef = useRef<number | null>(null);
  const currentPosRef = useRef<LatLng | null>(targetPos);
  const currentHeadingRef = useRef<number>(targetHeading);

  useEffect(() => {
    if (!targetPos) return;

    if (!currentPosRef.current) {
      currentPosRef.current = targetPos;
      currentHeadingRef.current = targetHeading;
      setCurrentPos(targetPos);
      setCurrentHeading(targetHeading);
      return;
    }

    const startPos = { ...currentPosRef.current };
    const startHeading = currentHeadingRef.current;

    // Shortest angular turn for heading
    let dHeading = (targetHeading - startHeading) % 360;
    if (dHeading > 180) dHeading -= 360;
    if (dHeading < -180) dHeading += 360;
    const finalHeading = startHeading + dHeading;

    const startTime = performance.now();
    const duration = 900; // 900ms smooth ease-out glide

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      const lat = startPos.lat + (targetPos.lat - startPos.lat) * ease;
      const lng = startPos.lng + (targetPos.lng - startPos.lng) * ease;
      const heading = (startHeading + (finalHeading - startHeading) * ease + 360) % 360;

      currentPosRef.current = { lat, lng };
      currentHeadingRef.current = heading;
      setCurrentPos({ lat, lng });
      setCurrentHeading(heading);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetPos?.lat, targetPos?.lng, targetHeading]);

  return {
    pos: currentPos || targetPos,
    heading: currentHeading,
  };
}

function DeliveryMapInner({
  tracking,
  connectionState = "connected",
  isApproaching,
  isArrived,
  isDeviating,
  deviationDistance,
  deviationThreshold = 250.0,
  className = "",
}: DeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 480,
  });

  const {
    viewport,
    setViewport,
    zoomIn,
    zoomOut,
    fitPoints,
    config,
    setIsUserInteracting,
  } = useMap();

  const [hasInitialFitted, setHasInitialFitted] = useState(false);
  const [isFollowingRider, setIsFollowingRider] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number; center: LatLng }>({
    x: 0,
    y: 0,
    center: viewport.center,
  });

  // Observe container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Extract raw coordinates
  const pickupCoords: LatLng | null = useMemo(() => {
    if (tracking?.pickup?.latitude && tracking?.pickup?.longitude) {
      return { lat: tracking.pickup.latitude, lng: tracking.pickup.longitude };
    }
    return null;
  }, [tracking]);

  const dropoffCoords: LatLng | null = useMemo(() => {
    if (tracking?.dropoff?.latitude && tracking?.dropoff?.longitude) {
      return { lat: tracking.dropoff.latitude, lng: tracking.dropoff.longitude };
    }
    return null;
  }, [tracking]);

  const rawRiderCoords: LatLng | null = useMemo(() => {
    const r = tracking?.rider;
    const lat = r?.current_latitude ?? r?.latitude;
    const lng = r?.current_longitude ?? r?.longitude;
    if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
      return { lat, lng };
    }
    return null;
  }, [tracking]);

  const riderHeading = tracking?.rider?.heading_degrees ?? 0;

  // Smooth interpolated rider position & heading
  const { pos: smoothRiderCoords, heading: smoothHeading } = useSmoothRider(
    rawRiderCoords,
    riderHeading,
  );

  // Pack interpolated rider info
  const animatedRider = useMemo(() => {
    if (!tracking?.rider) return null;
    return {
      ...tracking.rider,
      heading_degrees: smoothHeading,
    };
  }, [tracking?.rider, smoothHeading]);

  // Initial bounds fit (once on initial load)
  useEffect(() => {
    if (hasInitialFitted || dimensions.width <= 0) return;

    const pointsToFit: LatLng[] = [];
    if (pickupCoords) pointsToFit.push(pickupCoords);
    if (dropoffCoords) pointsToFit.push(dropoffCoords);
    if (rawRiderCoords) pointsToFit.push(rawRiderCoords);

    if (pointsToFit.length >= 2) {
      fitPoints(pointsToFit, dimensions.width, dimensions.height);
      setHasInitialFitted(true);
    } else if (pointsToFit.length === 1) {
      setViewport({ center: pointsToFit[0], zoom: 14 });
      setHasInitialFitted(true);
    }
  }, [
    hasInitialFitted,
    pickupCoords,
    dropoffCoords,
    rawRiderCoords,
    dimensions,
    fitPoints,
    setViewport,
  ]);

  // 11. Follow Rider Camera Tracking
  useEffect(() => {
    if (isFollowingRider && smoothRiderCoords && !isDragging) {
      setViewport((prev) => ({
        ...prev,
        center: smoothRiderCoords,
      }));
    }
  }, [isFollowingRider, smoothRiderCoords, isDragging, setViewport]);

  // Toggle or re-enable Follow Rider
  const handleToggleFollowRider = useCallback(() => {
    if (isFollowingRider) {
      setIsFollowingRider(false);
    } else {
      setIsFollowingRider(true);
      if (smoothRiderCoords) {
        setViewport((prev) => ({
          ...prev,
          center: smoothRiderCoords,
          zoom: Math.max(14, prev.zoom),
        }));
      }
    }
  }, [isFollowingRider, smoothRiderCoords, setViewport]);

  // Fit Route Bounds
  const handleFitRoute = useCallback(() => {
    setIsFollowingRider(false);
    const points: LatLng[] = [];
    if (pickupCoords) points.push(pickupCoords);
    if (dropoffCoords) points.push(dropoffCoords);
    if (smoothRiderCoords) points.push(smoothRiderCoords);
    if (points.length > 0) {
      fitPoints(points, dimensions.width, dimensions.height);
    }
  }, [pickupCoords, dropoffCoords, smoothRiderCoords, fitPoints, dimensions]);

  // Mouse pan handlers: dragging automatically turns off follow mode
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setIsUserInteracting(true);
      setIsFollowingRider(false); // User manually pans
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        center: viewport.center,
      };
    },
    [viewport.center, setIsUserInteracting],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      const newCenter = screenToLatLng(
        dimensions.width / 2 - dx,
        dimensions.height / 2 - dy,
        dragStartRef.current.center,
        viewport.zoom,
        dimensions.width,
        dimensions.height,
      );

      setViewport((prev) => ({ ...prev, center: newCenter }));
    },
    [isDragging, dimensions, viewport.zoom, setViewport],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      setIsUserInteracting(true);
      const delta = e.deltaY < 0 ? 0.35 : -0.35;
      setViewport((prev) => ({
        ...prev,
        zoom: Math.max(config.minZoom, Math.min(config.maxZoom, prev.zoom + delta)),
      }));
    },
    [config.minZoom, config.maxZoom, setIsUserInteracting, setViewport],
  );

  // Touch pan handlers
  const touchStartRef = useRef<{ x: number; y: number; center: LatLng }>({
    x: 0,
    y: 0,
    center: viewport.center,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setIsUserInteracting(true);
        setIsFollowingRider(false);
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          center: viewport.center,
        };
      }
    },
    [viewport.center, setIsUserInteracting],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;

      const newCenter = screenToLatLng(
        dimensions.width / 2 - dx,
        dimensions.height / 2 - dy,
        touchStartRef.current.center,
        viewport.zoom,
        dimensions.width,
        dimensions.height,
      );

      setViewport((prev) => ({ ...prev, center: newCenter }));
    },
    [isDragging, dimensions, viewport.zoom, setViewport],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Compute tile positions for Web Mercator background
  const visibleTiles = useMemo(() => {
    const intZoom = Math.floor(viewport.zoom);
    if (intZoom < 1) return [];

    const numTiles = Math.pow(2, intZoom);
    const centerUnit = latLngToUnitPoint(viewport.center.lat, viewport.center.lng);

    const centerTileX = centerUnit.x * numTiles;
    const centerTileY = centerUnit.y * numTiles;

    const scale = Math.pow(2, viewport.zoom - intZoom);
    const scaledTileSize = TILE_SIZE * scale;

    const tilesAcross = Math.ceil(dimensions.width / scaledTileSize) + 2;
    const tilesDown = Math.ceil(dimensions.height / scaledTileSize) + 2;

    const minX = Math.floor(centerTileX - tilesAcross / 2);
    const maxX = Math.floor(centerTileX + tilesAcross / 2);
    const minY = Math.floor(centerTileY - tilesDown / 2);
    const maxY = Math.floor(centerTileY + tilesDown / 2);

    const tiles: { key: string; url: string; x: number; y: number; size: number }[] = [];

    for (let tx = minX; tx <= maxX; tx++) {
      for (let ty = minY; ty <= maxY; ty++) {
        if (ty < 0 || ty >= numTiles) continue;
        const wrappedX = ((tx % numTiles) + numTiles) % numTiles;
        const screenX = dimensions.width / 2 + (tx - centerTileX) * scaledTileSize;
        const screenY = dimensions.height / 2 + (ty - centerTileY) * scaledTileSize;

        const url = config.tileUrlTemplate
          .replace("{z}", String(intZoom))
          .replace("{x}", String(wrappedX))
          .replace("{y}", String(ty));

        tiles.push({
          key: `${intZoom}-${wrappedX}-${ty}`,
          url,
          x: screenX,
          y: screenY,
          size: scaledTileSize,
        });
      }
    }

    return tiles;
  }, [viewport.center, viewport.zoom, dimensions, config.tileUrlTemplate]);

  // Derived delivery state
  const isDelivered = tracking?.status === "delivered";
  const rider = tracking?.rider;
  const isStale = rider?.is_stale;
  const etaMinutes = tracking?.eta_minutes;
  const distanceKm = tracking?.distance_km;

  // Header status text for floating card
  const headerStatus = useMemo(() => {
    const riderName = tracking?.rider?.name || "Rider";
    if (isDelivered) {
      return {
        icon: "✓",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        dot: "bg-emerald-500",
        title: "Delivered",
      };
    }
    if (isArrived) {
      return {
        icon: "🟢",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        dot: "bg-emerald-500",
        title: `${riderName} has arrived`,
      };
    }
    if (isApproaching) {
      return {
        icon: "🟡",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        dot: "bg-blue-500",
        title: `${riderName} is approaching destination`,
      };
    }
    if (isDeviating) {
      return {
        icon: "⚠️",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        dot: "bg-amber-500",
        title: "Rider is off planned route",
      };
    }
    return {
      icon: "🟢",
      color: "text-emerald-700 bg-emerald-50/80 border-emerald-200/80",
      dot: "bg-emerald-500",
      title: `${riderName} is on the way`,
    };
  }, [isDelivered, isArrived, isApproaching, isDeviating, tracking?.rider?.name]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-3xl border border-slate-200/90 bg-[#f8fafc] shadow-2xl transition-all ${className} ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      {/* ======================================================== */}
      {/* 1. Base Map Tile Layer (Carto Voyager OpenStreetMap)     */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#e5e9ec]">
        {visibleTiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            loading="lazy"
            crossOrigin="anonymous"
            className="absolute pointer-events-none will-change-transform filter-[contrast(1.03)_brightness(1.01)_saturate(0.82)]"
            style={{
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: `${tile.size}px`,
              height: `${tile.size}px`,
            }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ))}
      </div>

      {/* ======================================================== */}
      {/* 2. Route Polyline Layer (Completed Trail + Active Ahead) */}
      {/* ======================================================== */}
      <RouteLayer
        waypoints={tracking?.route_waypoints}
        routeGeometry={tracking?.route_geometry}
        pickup={pickupCoords}
        dropoff={dropoffCoords}
        riderPosition={smoothRiderCoords}
        isDeviating={isDeviating}
        isDelivered={isDelivered}
        center={viewport.center}
        zoom={viewport.zoom}
        viewWidth={dimensions.width}
        viewHeight={dimensions.height}
      />

      {/* ======================================================== */}
      {/* 3. Markers Layer (Pickup, Dropoff, Animated Rider)       */}
      {/* ======================================================== */}
      {pickupCoords && (
        <PickupMarker
          position={pickupCoords}
          center={viewport.center}
          zoom={viewport.zoom}
          viewWidth={dimensions.width}
          viewHeight={dimensions.height}
          address={tracking?.pickup?.address}
        />
      )}

      {dropoffCoords && (
        <DropoffMarker
          position={dropoffCoords}
          center={viewport.center}
          zoom={viewport.zoom}
          viewWidth={dimensions.width}
          viewHeight={dimensions.height}
          address={tracking?.dropoff?.address}
          isApproaching={isApproaching}
          isArrived={isArrived}
        />
      )}

      {smoothRiderCoords && (
        <RiderMarker
          position={smoothRiderCoords}
          center={viewport.center}
          zoom={viewport.zoom}
          viewWidth={dimensions.width}
          viewHeight={dimensions.height}
          rider={animatedRider}
          isDeviating={isDeviating}
        />
      )}

      {/* ======================================================== */}
      {/* 4. Top Telemetry Pill (LIVE / RECONNECTING / STALE)      */}
      {/* ======================================================== */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-auto z-20">
        <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-md ring-1 ring-slate-200/80 backdrop-blur-md">
          {isStale ? (
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              🔴 STALE SIGNAL
            </span>
          ) : connectionState === "connected" ? (
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              🟢 LIVE
            </span>
          ) : connectionState === "reconnecting" ? (
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              🟡 RECONNECTING
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              OFFLINE
            </span>
          )}
        </div>

        {/* Route Deviation Toast Alert */}
        {isDeviating && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3 py-1.5 text-xs font-bold shadow-lg animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>⚠️ Off planned route ({deviationDistance ? `${Math.round(deviationDistance)}m` : "deviating"})</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. Modern Floating Map Controls (+ / − / Follow / Fit)   */}
      {/* ======================================================== */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto z-20">
        <button
          type="button"
          onClick={zoomIn}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/95 text-slate-700 border border-slate-200/90 shadow-md hover:bg-white hover:text-slate-900 active:scale-95 transition-all"
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={zoomOut}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/95 text-slate-700 border border-slate-200/90 shadow-md hover:bg-white hover:text-slate-900 active:scale-95 transition-all"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* 11. Follow Rider Toggle Button */}
        <button
          type="button"
          onClick={handleToggleFollowRider}
          className={`grid h-10 w-10 place-items-center rounded-2xl border shadow-md active:scale-95 transition-all ${
            isFollowingRider
              ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300"
              : "bg-white/95 text-slate-700 border-slate-200/90 hover:bg-white"
          }`}
          title={isFollowingRider ? "Following Rider (Click to disable)" : "Follow Rider"}
        >
          <Navigation
            className={`h-4 w-4 transition-transform ${isFollowingRider ? "fill-white rotate-45" : ""}`}
          />
        </button>

        {/* Fit / Recenter Route */}
        <button
          type="button"
          onClick={handleFitRoute}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/95 text-slate-700 border border-slate-200/90 shadow-md hover:bg-white hover:text-slate-900 active:scale-95 transition-all"
          title="Fit Route to Viewport"
        >
          <LocateFixed className="h-4 w-4" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 6. DELIVERY INFORMATION CARD (Floating Modern Bottom Card) */}
      {/* ======================================================== */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-20 flex justify-center">
        <div className="pointer-events-auto w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-4 shadow-2xl transition-all">
          {/* Card Header Status */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${headerStatus.dot} animate-pulse`} />
              <span className="font-display font-bold text-sm text-slate-900">
                {headerStatus.title}
              </span>
            </div>

            {/* Quick Follow Rider Action Pill */}
            <button
              type="button"
              onClick={handleToggleFollowRider}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                isFollowingRider
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <Navigation className="h-3 w-3" />
              <span>{isFollowingRider ? "Following Rider" : "Follow Rider"}</span>
            </button>
          </div>

          {/* Driver & Metrics Row */}
          <div className="mt-3.5 grid grid-cols-[1fr_auto] items-center gap-4">
            {/* Driver Profile */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-md shrink-0">
                <Bike className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-base text-slate-900 truncate">
                  {rider?.name || "Delivery Partner"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium">
                    <Zap className="h-3 w-3 fill-current" />
                    {rider?.vehicle_type ? rider.vehicle_type.replace(/_/g, " ") : "Electric Bike"}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-amber-500">★ 4.9</span>
                </div>
              </div>
            </div>

            {/* Live Metrics: ETA & Distance */}
            <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-100 rounded-2xl px-3.5 py-2">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ETA</p>
                <p className="font-display font-bold text-base text-slate-900">
                  {etaMinutes !== null && etaMinutes !== undefined
                    ? `${Math.round(etaMinutes)} min`
                    : "—"}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Remaining
                </p>
                <p className="font-display font-bold text-base text-slate-900">
                  {distanceKm !== null && distanceKm !== undefined
                    ? `${distanceKm.toFixed(1)} km`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. Subtle OSM Attribution                                 */}
      {/* ======================================================== */}
      <div className="absolute top-2 right-16 pointer-events-none text-[9px] text-slate-400 bg-white/70 px-2 py-0.5 rounded-md backdrop-blur-sm z-10 hidden sm:block">
        {config.attribution}
      </div>
    </div>
  );
}

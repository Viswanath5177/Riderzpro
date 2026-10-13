/**
 * DeliveryMap: Interactive, provider-agnostic delivery tracking map component.
 * Renders base tiles, route corridors, pickup/dropoff/rider markers,
 * geofence zones, route deviation warnings, and pan/zoom interactions.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Minus,
  Crosshair,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Radio,
} from "lucide-react";
import type { DeliveryTrackingData, LatLng } from "./types";
import { useMap, MapProvider } from "./MapProvider";
import { PickupMarker, DropoffMarker, RiderMarker } from "./MapMarker";
import { RouteLayer } from "./RouteLayer";
import { latLngToUnitPoint, screenToLatLng, TILE_SIZE } from "./MercatorProjection";

interface DeliveryMapProps {
  tracking: DeliveryTrackingData | null;
  isApproaching?: boolean;
  isArrived?: boolean;
  isDeviating?: boolean;
  deviationDistance?: number | null;
  deviationThreshold?: number;
  className?: string;
}

export function DeliveryMap(props: DeliveryMapProps) {
  return (
    <MapProvider>
      <DeliveryMapInner {...props} />
    </MapProvider>
  );
}

function DeliveryMapInner({
  tracking,
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
    height: 450,
  });

  const {
    viewport,
    setViewport,
    zoomIn,
    zoomOut,
    fitPoints,
    config,
    isUserInteracting,
    setIsUserInteracting,
  } = useMap();

  const [hasInitialFitted, setHasInitialFitted] = useState(false);
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

  // Extract coordinates from tracking object
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

  const riderCoords: LatLng | null = useMemo(() => {
    const r = tracking?.rider;
    const lat = r?.current_latitude ?? r?.latitude;
    const lng = r?.current_longitude ?? r?.longitude;
    if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
      return { lat, lng };
    }
    return null;
  }, [tracking]);

  // Fit viewport once on initial load (without overriding subsequent user pan/zoom)
  useEffect(() => {
    if (hasInitialFitted || dimensions.width <= 0) return;

    const pointsToFit: LatLng[] = [];
    if (pickupCoords) pointsToFit.push(pickupCoords);
    if (dropoffCoords) pointsToFit.push(dropoffCoords);
    if (riderCoords) pointsToFit.push(riderCoords);

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
    riderCoords,
    dimensions,
    fitPoints,
    setViewport,
  ]);

  // Manual recenter button handler
  const handleRecenter = useCallback(() => {
    const points: LatLng[] = [];
    if (riderCoords) points.push(riderCoords);
    if (dropoffCoords) points.push(dropoffCoords);
    if (pickupCoords) points.push(pickupCoords);
    if (points.length > 0) {
      fitPoints(points, dimensions.width, dimensions.height);
    }
  }, [riderCoords, dropoffCoords, pickupCoords, fitPoints, dimensions]);

  // Mouse pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      setIsDragging(true);
      setIsUserInteracting(true);
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

  // Wheel zoom handler
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

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-3xl border border-border bg-slate-900 shadow-xl ${className} ${
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
      {/* 1. Base Map Tile Layer (OpenStreetMap / Carto raster tiles) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90 transition-opacity">
        {visibleTiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            loading="lazy"
            crossOrigin="anonymous"
            className="absolute pointer-events-none will-change-transform"
            style={{
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: `${tile.size}px`,
              height: `${tile.size}px`,
            }}
            onError={(e) => {
              // Hide broken tile silently and let canvas grid show through
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ))}
      </div>

      {/* 2. Stylized Dark Ambient Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* 3. SVG Route Corridor & Deviation Projection Layer */}
      <RouteLayer
        waypoints={tracking?.route_waypoints}
        pickup={pickupCoords}
        dropoff={dropoffCoords}
        riderPosition={riderCoords}
        isDeviating={isDeviating}
        center={viewport.center}
        zoom={viewport.zoom}
        viewWidth={dimensions.width}
        viewHeight={dimensions.height}
      />

      {/* 4. Markers Layer */}
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

      {riderCoords && (
        <RiderMarker
          position={riderCoords}
          center={viewport.center}
          zoom={viewport.zoom}
          viewWidth={dimensions.width}
          viewHeight={dimensions.height}
          rider={tracking?.rider}
          isDeviating={isDeviating}
        />
      )}

      {/* 5. Top Alert Badges (Route Deviation / Geofence Milestone) */}
      <div className="absolute top-4 left-4 right-16 flex flex-col gap-2 pointer-events-none z-30">
        {isDeviating && (
          <div className="flex items-center gap-2 rounded-2xl bg-amber-500/95 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md animate-pulse">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Route deviation detected! Rider is{" "}
              {deviationDistance ? `${Math.round(deviationDistance)}m` : "outside"} corridor
              (Threshold: {Math.round(deviationThreshold)}m)
            </span>
          </div>
        )}

        {isArrived ? (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/95 text-white px-4 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Rider has arrived at the delivery destination!</span>
          </div>
        ) : isApproaching ? (
          <div className="flex items-center gap-2 rounded-2xl bg-blue-600/95 text-white px-4 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md">
            <Navigation className="h-4 w-4 shrink-0 animate-bounce" />
            <span>
              Rider is approaching the destination (
              {tracking?.distance_to_dropoff_meters
                ? `${Math.round(tracking.distance_to_dropoff_meters)}m`
                : "within 500m"}
              )
            </span>
          </div>
        ) : null}
      </div>

      {/* 6. Floating Map Controls (Zoom In, Zoom Out, Recenter) */}
      <div className="absolute bottom-5 right-4 flex flex-col gap-1.5 pointer-events-auto z-30">
        <button
          type="button"
          onClick={zoomIn}
          className="grid h-9 w-9 place-items-center rounded-xl bg-card/90 text-foreground border border-border shadow-md hover:bg-card hover:scale-105 active:scale-95 transition-all"
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="grid h-9 w-9 place-items-center rounded-xl bg-card/90 text-foreground border border-border shadow-md hover:bg-card hover:scale-105 active:scale-95 transition-all"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="grid h-9 w-9 place-items-center rounded-xl bg-card/90 text-foreground border border-border shadow-md hover:bg-card hover:scale-105 active:scale-95 transition-all"
          title="Recenter / Fit Bounds"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>

      {/* 7. Bottom Left Map Attribution & Provider Independence Note */}
      <div className="absolute bottom-2 left-3 pointer-events-none text-[9px] text-white/50 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm z-10">
        {config.attribution}
      </div>
    </div>
  );
}

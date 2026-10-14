/**
 * Pure Web Mercator (EPSG:3857) projection math and viewport fitting.
 * Enables fully provider-agnostic, zero-dependency map rendering and pan/zoom interactions.
 */

import type { LatLng, MapBounds, MapViewport } from "./types";

export const TILE_SIZE = 256;

/**
 * Project latitude & longitude (-90..90, -180..180) to normalized Web Mercator coordinates (0..1, 0..1).
 */
export function latLngToUnitPoint(lat: number, lng: number): { x: number; y: number } {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.min(Math.max(sinLat, -0.9999), 0.9999);
  const x = (lng + 180) / 360;
  const y = 0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI);
  return { x, y };
}

/**
 * Inverse Web Mercator: Convert normalized unit coordinates (0..1, 0..1) back to latitude & longitude.
 */
export function unitPointToLatLng(x: number, y: number): LatLng {
  const lng = x * 360 - 180;
  const expY = Math.exp((0.5 - y) * (4 * Math.PI));
  const sinLat = (expY - 1) / (expY + 1);
  const lat = (Math.asin(sinLat) * 180) / Math.PI;
  return { lat, lng };
}

/**
 * Convert geographic coordinates to pixel coordinates on the active screen viewport.
 */
export function latLngToScreen(
  lat: number,
  lng: number,
  center: LatLng,
  zoom: number,
  viewWidth: number,
  viewHeight: number,
): { x: number; y: number } {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const pt = latLngToUnitPoint(lat, lng);
  const centerPt = latLngToUnitPoint(center.lat, center.lng);

  const x = viewWidth / 2 + (pt.x - centerPt.x) * scale;
  const y = viewHeight / 2 + (pt.y - centerPt.y) * scale;

  return { x, y };
}

/**
 * Convert pixel coordinates on the active screen viewport back to geographic coordinates.
 */
export function screenToLatLng(
  screenX: number,
  screenY: number,
  center: LatLng,
  zoom: number,
  viewWidth: number,
  viewHeight: number,
): LatLng {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const centerPt = latLngToUnitPoint(center.lat, center.lng);

  const unitX = centerPt.x + (screenX - viewWidth / 2) / scale;
  const unitY = centerPt.y + (screenY - viewHeight / 2) / scale;

  return unitPointToLatLng(unitX, unitY);
}

/**
 * Calculate the bounding box enclosing a collection of coordinates.
 */
export function calculateBounds(points: LatLng[]): MapBounds | null {
  if (!points || points.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const pt of points) {
    if (typeof pt.lat !== "number" || typeof pt.lng !== "number") continue;
    if (isNaN(pt.lat) || isNaN(pt.lng)) continue;
    minLat = Math.min(minLat, pt.lat);
    maxLat = Math.max(maxLat, pt.lat);
    minLng = Math.min(minLng, pt.lng);
    maxLng = Math.max(maxLng, pt.lng);
  }

  if (minLat === Infinity) return null;

  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Compute the optimal center and zoom level to display a bounding box with padding.
 */
export function fitBoundsToViewport(
  bounds: MapBounds,
  viewWidth: number,
  viewHeight: number,
  padding = 60,
): MapViewport {
  const center: LatLng = {
    lat: (bounds.minLat + bounds.maxLat) / 2,
    lng: (bounds.minLng + bounds.maxLng) / 2,
  };

  const availWidth = Math.max(viewWidth - padding * 2, 100);
  const availHeight = Math.max(viewHeight - padding * 2, 100);

  const minPt = latLngToUnitPoint(bounds.maxLat, bounds.minLng);
  const maxPt = latLngToUnitPoint(bounds.minLat, bounds.maxLng);

  const dx = Math.abs(maxPt.x - minPt.x);
  const dy = Math.abs(maxPt.y - minPt.y);

  if (dx < 1e-7 && dy < 1e-7) {
    return { center, zoom: 14 };
  }

  const zoomX = dx > 0 ? Math.log2(availWidth / (dx * TILE_SIZE)) : 16;
  const zoomY = dy > 0 ? Math.log2(availHeight / (dy * TILE_SIZE)) : 16;

  let zoom = Math.min(zoomX, zoomY);
  zoom = Math.max(3, Math.min(17, zoom)); // Clamp zoom between 3 and 17

  return { center, zoom };
}

/**
 * Convert meters on ground to approximate pixels at current latitude and zoom.
 */
export function metersToPixels(meters: number, lat: number, zoom: number): number {
  const earthCircumference = 40075016.686;
  const metersPerPixel =
    (earthCircumference * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom + 8);
  return meters / Math.max(metersPerPixel, 0.0001);
}

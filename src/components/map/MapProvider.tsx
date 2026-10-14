/**
 * Provider-agnostic Map Context & Provider component.
 * Decouples map controls, viewport state, and tile rendering from specific vendors.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { type LatLng, type MapViewport, type MapProviderConfig, DEFAULT_MAP_CONFIG } from "./types";
import { fitBoundsToViewport, calculateBounds } from "./MercatorProjection";

interface MapContextValue {
  viewport: MapViewport;
  setViewport: React.Dispatch<React.SetStateAction<MapViewport>>;
  zoomIn: () => void;
  zoomOut: () => void;
  setCenter: (center: LatLng) => void;
  fitPoints: (points: LatLng[], viewWidth?: number, viewHeight?: number) => void;
  config: MapProviderConfig;
  isUserInteracting: boolean;
  setIsUserInteracting: (interacting: boolean) => void;
}

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return ctx;
}

interface MapProviderProps {
  children: ReactNode;
  initialCenter?: LatLng;
  initialZoom?: number;
  config?: Partial<MapProviderConfig>;
}

export function MapProvider({
  children,
  initialCenter = { lat: 16.518, lng: 80.582 }, // Vijayawada - Amaravati corridor default
  initialZoom = 12,
  config: customConfig,
}: MapProviderProps) {
  const [viewport, setViewport] = useState<MapViewport>({
    center: initialCenter,
    zoom: initialZoom,
  });
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const config = useMemo(
    () => ({
      ...DEFAULT_MAP_CONFIG,
      ...(customConfig || {}),
    }),
    [customConfig],
  );

  const zoomIn = useCallback(() => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, config.maxZoom),
    }));
  }, [config.maxZoom]);

  const zoomOut = useCallback(() => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, config.minZoom),
    }));
  }, [config.minZoom]);

  const setCenter = useCallback((center: LatLng) => {
    setViewport((prev) => ({ ...prev, center }));
  }, []);

  const fitPoints = useCallback((points: LatLng[], viewWidth = 800, viewHeight = 600) => {
    const bounds = calculateBounds(points);
    if (!bounds) return;
    const nextViewport = fitBoundsToViewport(bounds, viewWidth, viewHeight);
    setViewport(nextViewport);
  }, []);

  const value = useMemo(
    () => ({
      viewport,
      setViewport,
      zoomIn,
      zoomOut,
      setCenter,
      fitPoints,
      config,
      isUserInteracting,
      setIsUserInteracting,
    }),
    [viewport, zoomIn, zoomOut, setCenter, fitPoints, config, isUserInteracting],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

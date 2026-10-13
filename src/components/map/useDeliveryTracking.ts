/**
 * Custom React hook managing real-time delivery tracking via REST + WebSocket.
 * Includes automatic reconnection with exponential backoff, state updates,
 * and comprehensive event handling.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import type { DeliveryTrackingData, ConnectionState, WebSocketTelemetryMessage } from "./types";
import { fetchDeliveryTracking, getWebSocketUrl } from "@/lib/api";

interface UseDeliveryTrackingOptions {
  deliveryId: string | null;
  userId?: string;
  userRole?: string;
  autoConnect?: boolean;
}

export function useDeliveryTracking({
  deliveryId,
  userId,
  userRole = "customer",
  autoConnect = true,
}: UseDeliveryTrackingOptions) {
  const [data, setData] = useState<DeliveryTrackingData | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [isApproaching, setIsApproaching] = useState<boolean>(false);
  const [isArrived, setIsArrived] = useState<boolean>(false);
  const [isDeviating, setIsDeviating] = useState<boolean>(false);
  const [deviationDistance, setDeviationDistance] = useState<number | null>(null);
  const [deviationThreshold, setDeviationThreshold] = useState<number>(250.0);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompletedRef = useRef<boolean>(false);
  const isDestroyedRef = useRef<boolean>(false);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackPollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Fetch initial state via REST
  const loadInitialSnapshot = useCallback(
    async (targetId: string) => {
      try {
        const headers: Record<string, string> = {};
        if (userId) headers["X-User-Id"] = userId;
        if (userRole) headers["X-User-Role"] = userRole;

        const trackingRes: DeliveryTrackingData = await fetchDeliveryTracking(targetId, headers);
        if (!isDestroyedRef.current) {
          setData(trackingRes);
          if (trackingRes.is_approaching !== undefined)
            setIsApproaching(!!trackingRes.is_approaching);
          if (trackingRes.is_arrived !== undefined) setIsArrived(!!trackingRes.is_arrived);
          if (trackingRes.is_route_deviating !== undefined)
            setIsDeviating(!!trackingRes.is_route_deviating);
          if (trackingRes.distance_from_route_meters !== undefined) {
            setDeviationDistance(trackingRes.distance_from_route_meters);
          }
          if (trackingRes.route_deviation_threshold_meters) {
            setDeviationThreshold(trackingRes.route_deviation_threshold_meters);
          }
          setError(null);
        }
      } catch (err: unknown) {
        if (!isDestroyedRef.current) {
          const errMsg = err instanceof Error ? err.message : "Failed to load tracking data";
          console.warn("Failed to load REST tracking snapshot:", errMsg);
          setError(errMsg);
        }
      }
    },
    [userId, userRole],
  );

  // 2. Connect to WebSocket
  const connectWebSocket = useCallback(
    (targetId: string) => {
      if (isDestroyedRef.current || isCompletedRef.current) return;

      // Prevent duplicate active connections
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.CONNECTING ||
          wsRef.current.readyState === WebSocket.OPEN)
      ) {
        return;
      }

      setConnectionState((prev) => (prev === "connected" ? "connected" : "connecting"));

      const url = getWebSocketUrl(targetId, userId, userRole);
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isDestroyedRef.current) {
            ws.close();
            return;
          }
          reconnectAttemptsRef.current = 0;
          setConnectionState("connected");
          setError(null);

          // Periodic heartbeat ping to keep connection healthy
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
            }
          }, 25000);
        };

        ws.onmessage = (event) => {
          if (isDestroyedRef.current) return;
          try {
            const msg: WebSocketTelemetryMessage = JSON.parse(event.data);

            switch (msg.event) {
              case "INITIAL_TRACKING_SNAPSHOT": {
                const snapshotData =
                  msg.tracking ||
                  (msg.delivery_id ? (msg as unknown as DeliveryTrackingData) : null);
                if (snapshotData) {
                  setData(snapshotData);
                  if (snapshotData.is_approaching !== undefined)
                    setIsApproaching(!!snapshotData.is_approaching);
                  if (snapshotData.is_arrived !== undefined)
                    setIsArrived(!!snapshotData.is_arrived);
                  if (snapshotData.is_route_deviating !== undefined)
                    setIsDeviating(!!snapshotData.is_route_deviating);
                  if (snapshotData.distance_from_route_meters !== undefined) {
                    setDeviationDistance(snapshotData.distance_from_route_meters);
                  }
                  if (snapshotData.route_deviation_threshold_meters) {
                    setDeviationThreshold(snapshotData.route_deviation_threshold_meters);
                  }
                }
                break;
              }

              case "RIDER_LOCATION_UPDATED":
                setData((prev) => {
                  if (!prev) return prev;
                  const updatedRider = {
                    ...(prev.rider || { id: msg.rider?.id || "" }),
                    latitude: msg.rider?.latitude,
                    longitude: msg.rider?.longitude,
                    current_latitude: msg.rider?.latitude,
                    current_longitude: msg.rider?.longitude,
                    heading_degrees: msg.rider?.heading_degrees ?? prev.rider?.heading_degrees,
                    speed_kmh: msg.rider?.speed_kmh ?? prev.rider?.speed_kmh,
                    last_updated: msg.timestamp || new Date().toISOString(),
                    is_stale: false,
                  };

                  return {
                    ...prev,
                    rider: updatedRider,
                    eta_minutes: msg.eta_minutes !== undefined ? msg.eta_minutes : prev.eta_minutes,
                    distance_km: msg.distance_km !== undefined ? msg.distance_km : prev.distance_km,
                  };
                });
                break;

              case "RIDER_APPROACHING":
                setIsApproaching(true);
                if (msg.distance_to_dropoff_meters !== undefined) {
                  setData((prev) =>
                    prev
                      ? { ...prev, distance_to_dropoff_meters: msg.distance_to_dropoff_meters }
                      : prev,
                  );
                }
                break;

              case "RIDER_ARRIVED":
                setIsArrived(true);
                setIsApproaching(true);
                if (msg.distance_to_dropoff_meters !== undefined) {
                  setData((prev) =>
                    prev
                      ? { ...prev, distance_to_dropoff_meters: msg.distance_to_dropoff_meters }
                      : prev,
                  );
                }
                break;

              case "RIDER_ROUTE_DEVIATION":
                setIsDeviating(true);
                if (msg.distance_from_route_meters !== undefined) {
                  setDeviationDistance(msg.distance_from_route_meters);
                }
                if (msg.threshold_meters !== undefined) {
                  setDeviationThreshold(msg.threshold_meters);
                }
                break;

              case "DELIVERY_COMPLETED":
                isCompletedRef.current = true;
                setConnectionState("completed");
                setData((prev) => (prev ? { ...prev, status: msg.status || "delivered" } : prev));
                if (ws.readyState === WebSocket.OPEN) {
                  ws.close(1000, "Delivery complete");
                }
                break;

              default:
                break;
            }
          } catch (e) {
            console.error("Error parsing WebSocket message:", e);
          }
        };

        ws.onclose = (event) => {
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          if (isDestroyedRef.current) return;

          // Delivery reached terminal state
          if (isCompletedRef.current) {
            setConnectionState("completed");
            return;
          }

          // Policy violation or unauthorized
          if (event.code === 1008) {
            setConnectionState("offline");
            setError("Unauthorized to stream delivery coordinates");
            return;
          }

          // Reconnect with exponential backoff (1s -> 1.5s -> 2.25s -> max 10s)
          setConnectionState("reconnecting");
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);
          reconnectAttemptsRef.current += 1;

          if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = setTimeout(() => {
            if (!isDestroyedRef.current && !isCompletedRef.current) {
              connectWebSocket(targetId);
            }
          }, delay);
        };

        ws.onerror = (err) => {
          console.warn("Tracking WebSocket error occurred:", err);
        };
      } catch (e: unknown) {
        console.error("Failed to construct tracking WebSocket:", e);
        setConnectionState("offline");
      }
    },
    [userId, userRole],
  );

  // Main WebSocket lifecycle effect (only runs when deliveryId/credentials change)
  useEffect(() => {
    isDestroyedRef.current = false;
    isCompletedRef.current = false;

    if (!deliveryId) {
      setData(null);
      setConnectionState("offline");
      return;
    }

    // 1. Initial REST fetch
    loadInitialSnapshot(deliveryId);

    // 2. Open live WebSocket stream
    if (autoConnect) {
      connectWebSocket(deliveryId);
    }

    return () => {
      isDestroyedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (wsRef.current) {
        try {
          wsRef.current.close(1000, "Component unmounted");
        } catch {
          // Ignore close error
        }
        wsRef.current = null;
      }
    };
  }, [deliveryId, autoConnect, loadInitialSnapshot, connectWebSocket]);

  // Fallback REST polling effect (only active when offline/reconnecting)
  useEffect(() => {
    if (!deliveryId || connectionState === "connected" || connectionState === "completed") {
      return;
    }

    const interval = setInterval(() => {
      if (!isDestroyedRef.current && !isCompletedRef.current) {
        loadInitialSnapshot(deliveryId);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [deliveryId, connectionState, loadInitialSnapshot]);

  return {
    data,
    connectionState,
    isApproaching,
    isArrived,
    isDeviating,
    deviationDistance,
    deviationThreshold,
    error,
    refresh: () => deliveryId && loadInitialSnapshot(deliveryId),
  };
}

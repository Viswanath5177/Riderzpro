/**
 * Centralized API & WebSocket configuration for Riderzpro logistics.
 */

export const API_BASE_URL: string =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_BASE_URL"]) ||
  (typeof window !== "undefined" && window.location.port === "8000"
    ? window.location.origin
    : "http://127.0.0.1:8000");

/**
 * Derive WebSocket URL from API Base URL with proper protocol conversion (http->ws, https->wss).
 */
export function getWebSocketUrl(deliveryId: string, userId?: string, userRole?: string): string {
  const base = API_BASE_URL.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
  const params = new URLSearchParams();
  if (userId) params.set("user_id", userId);
  if (userRole) params.set("user_role", userRole);
  const query = params.toString();
  return `${base}/ws/deliveries/${encodeURIComponent(deliveryId)}/tracking${query ? `?${query}` : ""}`;
}

/**
 * Fetch delivery tracking status snapshot from backend REST API.
 */
export async function fetchDeliveryTracking(deliveryId: string, headers?: Record<string, string>) {
  const url = `${API_BASE_URL}/api/deliveries/${encodeURIComponent(deliveryId)}/tracking`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = errorBody?.detail || `Tracking API request failed with status ${res.status}`;
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return res.json();
}

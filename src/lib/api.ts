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

export interface BackendDelivery {
  id: string;
  order_id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  vendor_id?: string;
  vendor_name?: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  package_weight_kg?: number;
  priority?: string;
  status: string;
  assigned_rider_id?: string;
  assigned_rider?: {
    id: string;
    name: string;
    phone: string;
    vehicle_type: string;
    current_lat?: number;
    current_lng?: number;
    status?: string;
    is_online?: boolean;
    rating?: number;
  };
  latest_route?: {
    id: string;
    distance_km: number;
    duration_minutes: number;
    waypoints?: Array<{ lat: number; lng: number; label?: string }>;
  };
  status_history?: Array<{
    id: string;
    from_status?: string;
    to_status: string;
    reason?: string;
    created_at?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch list of deliveries from backend REST API with optional filtering.
 */
export async function fetchDeliveries(
  filters?: { customer_id?: string; order_id?: string; status?: string; limit?: number },
  headers?: Record<string, string>
): Promise<{ items: BackendDelivery[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.customer_id) params.set("customer_id", filters.customer_id);
  if (filters?.order_id) params.set("order_id", filters.order_id);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.limit) params.set("limit", String(filters.limit));
  const query = params.toString();

  const url = `${API_BASE_URL}/api/deliveries${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `Deliveries API request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch a single delivery by ID.
 */
export async function fetchDelivery(
  deliveryId: string,
  headers?: Record<string, string>
): Promise<BackendDelivery> {
  const url = `${API_BASE_URL}/api/deliveries/${encodeURIComponent(deliveryId)}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `Delivery details request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Create a new delivery fulfillment task in backend.
 */
export async function createDelivery(
  payload: Record<string, any>,
  headers?: Record<string, string>
): Promise<BackendDelivery> {
  const url = `${API_BASE_URL}/api/deliveries`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `Create delivery request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Update delivery status (e.g. advance milestone or cancel).
 */
export async function updateDeliveryStatus(
  deliveryId: string,
  status: string,
  reason?: string,
  actorId?: string,
  actorRole = "customer"
): Promise<BackendDelivery> {
  const url = `${API_BASE_URL}/api/deliveries/${encodeURIComponent(deliveryId)}/status`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(actorId ? { "X-User-Id": actorId } : {}),
      "X-User-Role": actorRole,
    },
    body: JSON.stringify({
      status,
      reason: reason || `Updated to ${status} via customer portal`,
      actor_id: actorId,
      actor_role: actorRole,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || `Update delivery status failed with status ${res.status}`);
  }

  return res.json();
}

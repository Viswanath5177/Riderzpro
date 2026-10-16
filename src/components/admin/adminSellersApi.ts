/**
 * Admin Sellers API Layer & Mock Adapter
 *
 * Provides seller KYC verification status, approval state, bank details, and store locations.
 * Real API endpoint: GET /api/admin/sellers
 */

import { useState, useEffect, useCallback } from "react";
import { USE_MOCK } from "./mockFlags";

// Re-export mock toggle flag for UI components
export { USE_MOCK };

// ==========================================
// TYPES & CONTRACT DEFINITIONS
// ==========================================

export type SellerApprovalStatus = "Approved" | "Pending" | "Rejected";
export type SellerKycStatus = "KYC Verified" | "Pending" | "Missing";

export interface AdminSellerRecord {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  gstin: string;
  city: string;
  pickupLocation: string;
  approvalStatus: SellerApprovalStatus;
  kycStatus: SellerKycStatus;
  joinedDate: string;
  bankName: string;
  bankAccountMasked: string;
  activeCatalogCount: number;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ==========================================
// CORE API CALL: getAdminSellers
// ==========================================

export async function getAdminSellers(): Promise<AdminSellerRecord[]> {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { getMockAdminSellers } = await import("./mocks/adminSellersMock");
    return getMockAdminSellers();
  }

  const res = await fetch("/api/admin/sellers", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new ApiError("Admin access required. Please sign in as an administrator.", res.status);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(
      errBody.error || `Failed to fetch admin sellers (${res.status})`,
      res.status,
    );
  }

  const data = await res.json();
  const rawSellers: AdminSellerRecord[] = Array.isArray(data)
    ? data
    : data.sellers || data.data || [];
  return rawSellers;
}

// ==========================================
// REACT HOOK: useAdminSellers
// ==========================================

export interface UseAdminSellersResult {
  sellers: AdminSellerRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminSellers(): UseAdminSellersResult {
  const [sellers, setSellers] = useState<AdminSellerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminSellers();
      setSellers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load admin sellers";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  return {
    sellers,
    loading,
    error,
    refetch: fetchSellers,
  };
}

/**
 * Admin Sellers API Layer & Mock Adapter
 *
 * Provides seller KYC verification status, approval state, bank details, and store locations.
 * Real API endpoint assumed: GET /api/admin/sellers
 */

import { useState, useEffect, useCallback } from "react";

// ==========================================
// CONFIGURATION & TOGGLE FLAG
// ==========================================
// Set VITE_USE_MOCK_ADMIN_SELLERS="true" to force mocks. Default is live.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_ADMIN_SELLERS === "true";

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
// INITIAL MOCK SELLERS
// Note: Noida seller is Approved with KYC Verified as required by Task 4
// ==========================================

export const initialAdminSellers: AdminSellerRecord[] = [
  {
    id: "sel_noida_01",
    businessName: "Noida EV Spares & Care",
    ownerName: "Virender Gupta",
    phone: "+91 98112 34567",
    email: "orders@noidasparestores.in",
    gstin: "07AAAAA0000A1Z5",
    city: "Noida",
    pickupLocation:
      "Shop 12, Ground Floor, Sector 62 Electronic City, Noida, Uttar Pradesh - 201309",
    approvalStatus: "Approved", // Approved as specified
    kycStatus: "KYC Verified", // KYC Verified as specified
    joinedDate: "2026-08-15",
    bankName: "HDFC Bank",
    bankAccountMasked: "••••4821",
    activeCatalogCount: 8,
  },
  {
    id: "sel_blr_01",
    businessName: "VoltHub Indiranagar",
    ownerName: "Karthik Subramanian",
    phone: "+91 90000 00001",
    email: "contact@volthub.in",
    gstin: "29BBBBB1111B2Z6",
    city: "Bengaluru",
    pickupLocation: "14/2, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038",
    approvalStatus: "Approved",
    kycStatus: "KYC Verified",
    joinedDate: "2026-07-01",
    bankName: "ICICI Bank",
    bankAccountMasked: "••••9920",
    activeCatalogCount: 14,
  },
  {
    id: "sel_pun_01",
    businessName: "Greaves Electric Spares",
    ownerName: "Ajay Kulkarni",
    phone: "+91 98220 12345",
    email: "sales@greaves-spares.com",
    gstin: "27CCCCC2222C3Z7",
    city: "Pune",
    pickupLocation: "Plot 45, MIDC Bhosari, Pune, Maharashtra - 411026",
    approvalStatus: "Pending",
    kycStatus: "Pending",
    joinedDate: "2026-10-02",
    bankName: "Axis Bank",
    bankAccountMasked: "••••3114",
    activeCatalogCount: 4,
  },
  {
    id: "sel_chn_01",
    businessName: "SpeedX EV Components",
    ownerName: "R. Muralidharan",
    phone: "+91 94440 67890",
    email: "info@speedxev.co.in",
    gstin: "33DDDDD3333D4Z8",
    city: "Chennai",
    pickupLocation: "8B, Mount-Poonamallee High Rd, Porur, Chennai, Tamil Nadu - 600116",
    approvalStatus: "Pending",
    kycStatus: "Missing",
    joinedDate: "2026-10-10",
    bankName: "State Bank of India",
    bankAccountMasked: "••••1008",
    activeCatalogCount: 0,
  },
  {
    id: "sel_del_01",
    businessName: "Apex Lithium Works",
    ownerName: "Sanjay Singhal",
    phone: "+91 98100 87654",
    email: "support@apexlithium.in",
    gstin: "07EEEEE4444E5Z9",
    city: "New Delhi",
    pickupLocation: "C-14, Mayapuri Industrial Area Phase II, New Delhi - 110064",
    approvalStatus: "Rejected",
    kycStatus: "Missing",
    joinedDate: "2026-09-18",
    bankName: "Kotak Mahindra Bank",
    bankAccountMasked: "••••7239",
    activeCatalogCount: 0,
  },
];

const mockAdminSellersState: AdminSellerRecord[] = [...initialAdminSellers];

// ==========================================
// CORE API CALL: getAdminSellers
// ==========================================

export async function getAdminSellers(): Promise<AdminSellerRecord[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return [...mockAdminSellersState];
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

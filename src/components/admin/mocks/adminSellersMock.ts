/**
 * Isolated Mock Data and State for Admin Sellers
 * Loaded dynamically ONLY when USE_MOCK is active in development.
 * Tree-shaken completely in production builds.
 */

import type { AdminSellerRecord } from "../adminSellersApi";

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
    approvalStatus: "Approved",
    kycStatus: "KYC Verified",
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

export async function getMockAdminSellers(): Promise<AdminSellerRecord[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [...mockAdminSellersState];
}

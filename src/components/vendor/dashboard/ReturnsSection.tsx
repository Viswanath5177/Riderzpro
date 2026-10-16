import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Camera,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { Vendor } from "@/lib/vendor/types";

interface ReturnsSectionProps {
  vendor: Vendor;
}

interface Claim {
  id: string;
  orderId: string;
  productName: string;
  customerName: string;
  reason: string;
  requestedDate: string;
  status: "Pending Vendor Review" | "Replacement Approved" | "Disputed by Vendor";
  disputeNote?: string;
}

export function ReturnsSection({ vendor }: ReturnsSectionProps) {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-84920",
      orderId: "RZ-849201",
      productName: "VoltRide 60V 30Ah Li-ion Pack",
      customerName: "Aakash S.",
      reason: "BMS not balancing cell group 4 during 60V rapid charge",
      requestedDate: "Today, 10:30 AM",
      status: "Pending Vendor Review",
    },
    {
      id: "CLM-79342",
      orderId: "RZ-793420",
      productName: "ChargeMax 3.3kW Fast Charger",
      customerName: "Rahul M.",
      reason: "Type-2 latch pin cracked in transit packaging",
      requestedDate: "Yesterday",
      status: "Replacement Approved",
    },
  ]);

  const [activeDisputeClaim, setActiveDisputeClaim] = useState<Claim | null>(null);
  const [disputeNote, setDisputeNote] = useState("");
  const [disputePhoto, setDisputePhoto] = useState<string | null>(null);

  const handleApproveClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId ? { ...c, status: "Replacement Approved" } : c
      )
    );
    toast.success("Warranty claim approved! Replacement dispatch label generated.");
  };

  const handleDisputeSubmit = () => {
    if (!activeDisputeClaim || !disputeNote.trim()) {
      toast.error("Please explain your dispute reason with photo evidence");
      return;
    }
    setClaims((prev) =>
      prev.map((c) =>
        c.id === activeDisputeClaim.id
          ? { ...c, status: "Disputed by Vendor", disputeNote }
          : c
      )
    );
    toast.info("Dispute forwarded to RiderzPro Admin Arbitration team.");
    setActiveDisputeClaim(null);
    setDisputeNote("");
    setDisputePhoto(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-xl text-gray-900">
          Returns, Warranty & Claims
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage warranty claims for lithium batteries, chargers and electronic controllers with
          photo arbitration.
        </p>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-gray-900">{claim.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      claim.status === "Replacement Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : claim.status === "Disputed by Vendor"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order {claim.orderId} · Customer: {claim.customerName} · Requested:{" "}
                  {claim.requestedDate}
                </p>
              </div>

              {claim.status === "Pending Vendor Review" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveDisputeClaim(claim)}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Dispute Claim
                  </button>
                  <button
                    onClick={() => handleApproveClaim(claim.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Approve Replacement
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 text-xs border border-gray-100">
              <span className="font-bold text-gray-800">Claim Details & Symptom:</span>
              <p className="text-gray-600 mt-0.5">{claim.reason}</p>
              {claim.disputeNote && (
                <p className="mt-2 text-rose-700 font-semibold border-t border-gray-200 pt-1.5">
                  Vendor Dispute Note: {claim.disputeNote}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dispute Modal */}
      {activeDisputeClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-display font-bold text-base text-gray-900">
              Dispute Claim {activeDisputeClaim.id}
            </h3>
            <p className="text-xs text-gray-500">
              State the reason (e.g. physical damage outside warranty, customer tampering). Admin
              will inspect before closing.
            </p>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Explanation & Reason
              </label>
              <textarea
                rows={3}
                value={disputeNote}
                onChange={(e) => setDisputeNote(e.target.value)}
                placeholder="e.g. Battery pack casing seal broken; physical impact detected on terminal..."
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Photo Evidence (Optional)
              </label>
              <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center cursor-pointer hover:bg-gray-50">
                <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-600 font-medium">
                  {disputePhoto ? "Photo Attached" : "Attach inspection photo"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveDisputeClaim(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisputeSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

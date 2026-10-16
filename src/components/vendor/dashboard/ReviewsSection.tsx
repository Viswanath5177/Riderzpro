import React, { useState } from "react";
import { Star, MessageSquare, Flag, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Vendor } from "@/lib/vendor/types";

interface ReviewsSectionProps {
  vendor: Vendor;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  productName: string;
  date: string;
  comment: string;
  vendorReply?: string;
  isFlagged?: boolean;
}

export function ReviewsSection({ vendor }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, vendorReply: replyText } : r))
    );
    toast.success("Public reply posted!");
    setReplyingReviewId(null);
    setReplyText("");
  };

  const handleFlagReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isFlagged: true } : r))
    );
    toast.info("Review flagged for admin content moderation");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-xl text-gray-900">
          Reviews, Ratings & Reputation
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Engage with rider feedback, post official vendor replies, and report abusive or spam reviews.
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center">
            <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No customer reviews yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Verified buyer reviews and ratings will appear here once delivered orders are reviewed.
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rev.rating ? "fill-amber-400" : "text-gray-200 fill-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-gray-900">{rev.customerName}</span>
                  <span className="text-xs text-gray-400">· {rev.date}</span>
                </div>
                <p className="text-[11px] font-semibold text-[#E31E24] mt-0.5">
                  Verified Purchase: {rev.productName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!rev.vendorReply && replyingReviewId !== rev.id && (
                  <button
                    onClick={() => {
                      setReplyingReviewId(rev.id);
                      setReplyText("");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Reply
                  </button>
                )}

                <button
                  onClick={() => handleFlagReview(rev.id)}
                  disabled={rev.isFlagged}
                  className={`inline-flex items-center gap-1 text-xs font-bold transition cursor-pointer ${
                    rev.isFlagged ? "text-amber-600" : "text-gray-400 hover:text-rose-600"
                  }`}
                  title="Report abusive review to admin"
                >
                  <Flag className="h-3.5 w-3.5" />
                  {rev.isFlagged ? "Reported" : "Report"}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-700">{rev.comment}</p>

            {/* Existing Vendor Reply */}
            {rev.vendorReply && (
              <div className="rounded-2xl bg-gray-50 p-3 text-xs border border-gray-100 space-y-1">
                <span className="font-bold text-gray-900 block">
                  Official Reply from {vendor.storeName}:
                </span>
                <p className="text-gray-600">{rev.vendorReply}</p>
              </div>
            )}

            {/* Reply Input Form */}
            {replyingReviewId === rev.id && (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write an official response on behalf of ${vendor.storeName}...`}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplyingReviewId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="px-4 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
        )}
      </div>
    </div>
  );
}

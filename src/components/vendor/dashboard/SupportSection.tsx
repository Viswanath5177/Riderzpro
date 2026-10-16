import React, { useState } from "react";
import { Headphones, Send, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Vendor } from "@/lib/vendor/types";

interface SupportSectionProps {
  vendor: Vendor;
}

export function SupportSection({ vendor }: SupportSectionProps) {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [category, setCategory] = useState("Payouts & Invoicing");
  const [message, setMessage] = useState("");
  const [submittedTickets, setSubmittedTickets] = useState<
    { id: string; subject: string; status: string; date: string }[]
  >([]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please provide both subject and message");
      return;
    }

    const newTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      subject,
      status: "Open (Pending Admin)",
      date: "Just now",
    };

    setSubmittedTickets((prev) => [newTicket, ...prev]);
    toast.success("Support ticket raised! Our operations desk will respond shortly.");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-xl text-gray-900">Seller Help & Support</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Raise operational support requests directly to RiderzPro Admin, or read the vendor guide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raise Ticket Form */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
            <Headphones className="h-4 w-4 text-[#E31E24]" />
            Raise a Support Ticket
          </h3>

          <form onSubmit={handleSubmitTicket} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Topic Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium bg-white"
              >
                <option value="Payouts & Invoicing">Payouts & Invoicing</option>
                <option value="Product Moderation Rejection">Product Moderation Rejection</option>
                <option value="Rider Handover & Pickup Issues">Rider Handover & Pickup Issues</option>
                <option value="Return / Warranty Disputes">Return / Warranty Disputes</option>
                <option value="Account Settings / Bank Details">Account Settings / Bank Details</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue..."
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Detailed Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include order IDs, SKU numbers or specific details..."
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" /> Submit Ticket
              </button>
            </div>
          </form>
        </div>

        {/* Existing Tickets & FAQs */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-3">
            <h4 className="font-display font-bold text-sm text-gray-900">Your Recent Tickets</h4>
            <div className="space-y-2">
              {submittedTickets.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  No open or past support tickets.
                </p>
              ) : (
                submittedTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-gray-500 mr-2">{t.id}</span>
                      <span className="font-semibold text-gray-800">{t.subject}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">{t.date}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold shrink-0">
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-3">
            <h4 className="font-display font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-[#E31E24]" />
              Quick Seller FAQ
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <details className="cursor-pointer">
                <summary className="font-bold text-gray-800 hover:text-[#E31E24]">
                  When are my payouts settled?
                </summary>
                <p className="mt-1 pl-2 text-gray-500">
                  Payouts are settled automatically every Tuesday on a T+7 basis following confirmed
                  customer delivery.
                </p>
              </details>

              <details className="cursor-pointer">
                <summary className="font-bold text-gray-800 hover:text-[#E31E24]">
                  How long does product review take?
                </summary>
                <p className="mt-1 pl-2 text-gray-500">
                  Our catalog team verifies specs and fitment within 2 to 4 hours. You'll receive an
                  in-app notice when it goes live.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

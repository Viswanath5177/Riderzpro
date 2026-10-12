import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Mail, Phone, MessageSquare, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help & Support — Riderzpro" },
      {
        name: "description",
        content:
          "Customer support, battery fitment queries, order tracking assistance, and contact information.",
      },
      { property: "og:title", content: "Help & Support — Riderzpro" },
      { property: "og:description", content: "Get in touch with Riderzpro customer care." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    toast.success("Support ticket created", {
      description: "Our EV support engineering desk will respond within 4 business hours.",
    });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <Headphones className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-4xl md:text-6xl">Customer Support</h1>
            <p className="text-sm text-muted-foreground">
              We're here to help with your orders and EV fitments
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display text-2xl text-foreground">Direct Help Desk</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Email Support</p>
                  <p className="text-muted-foreground">support@riderzpro.com</p>
                  <p className="text-xs text-muted-foreground">Avg response time: 2 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Helpline (Toll-Free)</p>
                  <p className="text-muted-foreground">+91 1800-419-7433 (RIDER)</p>
                  <p className="text-xs text-muted-foreground">Mon–Sat, 9:00 AM – 8:00 PM IST</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Emergency Battery Escalation</p>
                  <p className="text-muted-foreground">help-ev@riderzpro.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Send us a message
            </h2>
            {submitted ? (
              <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-center">
                <p className="font-semibold text-success">Ticket submitted successfully!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Check your registered email for ticket confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue, order ID, or vehicle fitment question..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

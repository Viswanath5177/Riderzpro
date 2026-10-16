import { useState } from "react";
import { Bell, CheckCheck, Check, Package, Wrench, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function NotificationsTab() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [filter, setFilter] = useState<"all" | "unread" | "offers" | "orders" | "service">("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "offers") return n.type === "offer";
    if (filter === "orders") return n.type === "order";
    if (filter === "service") return n.type === "service";
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "service":
        return <Wrench className="h-4 w-4 text-purple-600" />;
      case "offer":
        return <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">Notifications & Alerts</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Admin festive discounts, order tracking milestones, technician updates, and battery alerts.
          </p>
        </div>
        <button
          onClick={() => {
            markAllNotificationsRead();
            toast.success("All notifications marked as read");
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition self-start sm:self-auto cursor-pointer"
        >
          <CheckCheck className="h-4 w-4 text-primary" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: `All (${notifications.length})` },
          { id: "unread", label: `Unread (${notifications.filter((n) => !n.read).length})` },
          { id: "offers", label: `Special Offers (${notifications.filter((n) => n.type === "offer").length})` },
          { id: "orders", label: "Orders" },
          { id: "service", label: "Technician & Care" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              filter === t.id
                ? "bg-primary text-white border-primary"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-gray-300 bg-white text-center">
            <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">No Notifications</p>
            <p className="text-xs text-gray-500 mt-0.5">You are completely up to date.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-3xl border bg-white shadow-2xs hover:shadow-md transition cursor-pointer flex items-start gap-4 ${
                n.read ? "opacity-75 border-gray-200" : "border-emerald-200 bg-emerald-50/20 ring-1 ring-emerald-100"
              }`}
            >
              <span className={`grid h-10 w-10 place-items-center rounded-2xl shrink-0 mt-0.5 ${
                n.type === "offer" ? "bg-amber-100 text-amber-700" : "bg-gray-100"
              }`}>
                {getIcon(n.type)}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{n.title}</h3>
                    {n.type === "offer" && (
                      <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.2 text-[10px] font-bold">
                        Special Offer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                {n.actionUrl && (
                  <a
                    href={n.actionUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary mt-2 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Offer Deals →
                  </a>
                )}
              </div>

              {!n.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { AdminNotificationHistory } from "./types";

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotificationHistory[] = [
  {
    id: "notif_01",
    title: "⚡ Bengaluru Flash Monsoon Surge Active",
    body: "Riders in Whitefield, Bellandur and Indiranagar are earning ₹35 extra per EV delivery during peak rains.",
    channel: "Push Notification",
    targetAudience: "Active Riders",
    sentAt: "2026-04-14T08:00:00Z",
    reachCount: 142,
    openRate: "88.4%",
  },
  {
    id: "notif_02",
    title: "Weekend EV Battery Maintenance Camp @ HSR Hub",
    body: "Free BMS state-of-health diagnostics for all registered Ather & Ola riders this Saturday.",
    channel: "SMS",
    targetAudience: "Bengaluru Users",
    sentAt: "2026-04-12T10:30:00Z",
    reachCount: 1850,
    openRate: "94.1%",
  },
  {
    id: "notif_03",
    title: "Exclusive 15% OFF Ceramic Brakes & Safety Gear",
    body: "Apply code HELMETSAFE for verified ISI & ECE 22.06 gear delivered in 3 hours.",
    channel: "Email",
    targetAudience: "High-Value Buyers",
    sentAt: "2026-04-09T14:15:00Z",
    reachCount: 620,
    openRate: "42.8%",
  },
  {
    id: "notif_04",
    title: "GST Compliance & Tax Invoice Updates for April 2026",
    body: "Important advisory regarding HSN 8714 EV parts and input tax credit filing deadlines.",
    channel: "Email",
    targetAudience: "All Customers",
    sentAt: "2026-04-02T11:00:00Z",
    reachCount: 2400,
    openRate: "38.5%",
  },
];

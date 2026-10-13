import { AdminTicket } from "./types";
import { MOCK_ADMIN_CUSTOMERS } from "./customers";

export const MOCK_ADMIN_TICKETS: AdminTicket[] = [
  {
    id: "tkt_01",
    ticketNumber: "TCK-88120",
    customerId: "cust_01",
    customerName: "Aakash Sharma",
    orderId: "ord_101",
    subject: "Fitment confirmation for Ather 450X Gen 3 battery connector",
    category: "Fitment Issue",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-04-14T09:50:00Z",
    assignedTo: "Karan Johar (Senior Tech)",
    messages: [
      {
        id: "msg_1",
        sender: "customer",
        senderName: "Aakash Sharma",
        text: "Hi, I ordered the VoltRide 60V 30Ah pack for my Ather 450X Gen 3. Can you verify if the auxiliary CANBUS communication cable is plug-and-play with the 2023 dash harness?",
        timestamp: "2026-04-14T09:50:00Z",
      },
      {
        id: "msg_2",
        sender: "agent",
        senderName: "Karan Johar",
        text: "Hello Aakash! Yes, the VoltRide unit includes the OEM-spec Molex 8-pin jumper wire specifically configured for Ather Gen 3 firmware 13.x. Our Indiranagar hub technician pre-tests the pinout before handover.",
        timestamp: "2026-04-14T10:05:00Z",
      },
    ],
  },
  {
    id: "tkt_02",
    ticketNumber: "TCK-88121",
    customerId: "cust_02",
    customerName: "Pooja Hegde",
    orderId: "ord_102",
    subject: "HyperCharge delivery time estimate for Koramangala",
    category: "Delayed Delivery",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-04-14T08:30:00Z",
    assignedTo: "Priya Menon (Dispatch Support)",
    messages: [
      {
        id: "msg_3",
        sender: "customer",
        senderName: "Pooja Hegde",
        text: "My rider shows en-route for 40 minutes. Can you please check if he is stuck near Sony World signal?",
        timestamp: "2026-04-14T08:30:00Z",
      },
    ],
  },
  {
    id: "tkt_03",
    ticketNumber: "TCK-88122",
    customerId: "cust_06",
    customerName: "Vikram Kulkarni",
    orderId: "ord_106",
    subject: "Refund confirmation for cancelled brake levers",
    category: "Refund Request",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-04-13T11:20:00Z",
    assignedTo: "Finance Automation Bot",
    messages: [
      {
        id: "msg_4",
        sender: "customer",
        senderName: "Vikram Kulkarni",
        text: "I cancelled order #RZP-2026-08417. When will ₹2,279 reflect back in my HDFC credit card?",
        timestamp: "2026-04-13T11:20:00Z",
      },
      {
        id: "msg_5",
        sender: "agent",
        senderName: "Finance Desk",
        text: "Your refund reference RFND_HDFC_991823 was approved. Standard credit card settlement is 2-4 business days.",
        timestamp: "2026-04-13T11:45:00Z",
      },
    ],
  },
  // Generate remaining 22 tickets
  ...Array.from({ length: 22 }).map((_, i) => {
    const idx = i + 4;
    const cust = MOCK_ADMIN_CUSTOMERS[(i + 3) % MOCK_ADMIN_CUSTOMERS.length];
    const cats: AdminTicket["category"][] = ["Fitment Issue", "Delayed Delivery", "Refund Request", "Damaged Part", "Technical Help"];
    const priorities: AdminTicket["priority"][] = ["High", "Medium", "Low"];
    const statuses: AdminTicket["status"][] = ["Open", "In Progress", "Resolved", "Escalated"];
    const cat = cats[i % cats.length];
    const pri = priorities[i % priorities.length];
    const stat = statuses[i % statuses.length];

    const daysAgo = 22 - i;
    const d = new Date("2026-04-14T09:00:00Z");
    d.setDate(d.getDate() - daysAgo);

    return {
      id: `tkt_${idx}`,
      ticketNumber: `TCK-881${idx + 20}`,
      customerId: cust.id,
      customerName: cust.name,
      orderId: `ord_${105 + (i % 30)}`,
      subject: `${cat} inquiry regarding ${cust.garageBikes[0] || "EV Scooter"} order`,
      category: cat,
      priority: pri,
      status: stat,
      createdAt: d.toISOString(),
      assignedTo: i % 2 === 0 ? "Priya Menon" : "Karan Johar",
      messages: [
        {
          id: `msg_${idx}_1`,
          sender: "customer",
          senderName: cust.name,
          text: `Requesting status update on ${cat.toLowerCase()} regarding our recent vehicle parts dispatch.`,
          timestamp: d.toISOString(),
        },
        {
          id: `msg_${idx}_2`,
          sender: "agent",
          senderName: "RiderzPro Support Specialist",
          text: `We have reviewed the diagnostics with the workshop lead. Actions are in progress.`,
          timestamp: new Date(d.getTime() + 1800000).toISOString(),
        },
      ],
    } as AdminTicket;
  }),
];

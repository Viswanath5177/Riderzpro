import { AdminPaymentTransaction } from "./types";

export const MOCK_ADMIN_TRANSACTIONS: AdminPaymentTransaction[] = [
  {
    id: "tx_01",
    transactionRef: "pay_rzp_9941019",
    orderId: "ord_101",
    customerName: "Aakash Sharma",
    type: "Payment",
    amount: 39989,
    gateway: "Razorpay",
    status: "Success",
    timestamp: "2026-04-14T09:42:15Z",
    fee: 799.78,
  },
  {
    id: "tx_02",
    transactionRef: "pay_rzp_9941020",
    orderId: "ord_102",
    customerName: "Pooja Hegde",
    type: "Payment",
    amount: 8979,
    gateway: "Razorpay",
    status: "Success",
    timestamp: "2026-04-14T08:15:30Z",
    fee: 179.58,
  },
  {
    id: "tx_03",
    transactionRef: "pout_cf_881901",
    orderId: "ord_104",
    customerName: "Seller: ElectroDrive Spares",
    type: "Seller Payout",
    amount: 31250,
    gateway: "Cashfree",
    status: "Success",
    timestamp: "2026-04-13T18:00:00Z",
    fee: 10.0,
  },
  {
    id: "tx_04",
    transactionRef: "pout_rider_33190",
    orderId: "ord_104",
    customerName: "Rider: Ramesh Kumar",
    type: "Rider Payout",
    amount: 1450,
    gateway: "UPI",
    status: "Success",
    timestamp: "2026-04-13T20:30:00Z",
    fee: 0,
  },
  {
    id: "tx_05",
    transactionRef: "rfnd_rzp_004918",
    orderId: "ord_106",
    customerName: "Vikram Kulkarni",
    type: "Refund",
    amount: 2279,
    gateway: "Razorpay",
    status: "Success",
    timestamp: "2026-04-13T11:45:00Z",
    fee: 0,
  },
  ...Array.from({ length: 25 }).map((_, i) => {
    const idx = i + 6;
    const types: AdminPaymentTransaction["type"][] = ["Payment", "Payment", "Seller Payout", "Payment", "Refund", "Rider Payout"];
    const type = types[i % types.length];
    const amount = type === "Payment" ? 3500 + i * 400 : type === "Seller Payout" ? 18000 + i * 500 : type === "Rider Payout" ? 1200 + i * 50 : 2100;
    const daysAgo = 25 - i;
    const d = new Date("2026-04-14T07:00:00Z");
    d.setDate(d.getDate() - daysAgo);

    return {
      id: `tx_${idx}`,
      transactionRef: `tx_live_${994100 + idx}`,
      orderId: `ord_${105 + i}`,
      customerName: type === "Seller Payout" ? "Deccan Battery Labs" : type === "Rider Payout" ? "Suresh Gowda" : `Verified Buyer #${idx}`,
      type,
      amount,
      gateway: i % 3 === 0 ? "Razorpay" : i % 3 === 1 ? "UPI" : "Cashfree",
      status: "Success",
      timestamp: d.toISOString(),
      fee: Math.round(amount * 0.02),
    } as AdminPaymentTransaction;
  }),
];

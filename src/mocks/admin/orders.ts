import { AdminOrder } from "./types";
import { MOCK_ADMIN_CUSTOMERS } from "./customers";
import { MOCK_ADMIN_PRODUCTS } from "./products";
import { MOCK_ADMIN_RIDERS } from "./riders";

const cities = ["Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai"] as const;
const couriers = ["Delhivery", "Blue Dart", "Shadowfax", "RiderzPro Fleet"] as const;
const methods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"] as const;

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ord_101",
    orderNumber: "RZP-2026-08412",
    date: "2026-04-14T09:42:00Z",
    customerId: "cust_01",
    customerName: "Aakash Sharma",
    customerPhone: "+91 98765 43210",
    customerCity: "Bengaluru",
    shippingAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
    items: [
      {
        productId: "prod_01",
        productName: "VoltRide 60V 30Ah Lithium NMC Replacement Battery Pack",
        quantity: 1,
        unitPrice: 34999,
        sellerId: "seller_01",
        sellerName: "ElectroDrive Spares Bengaluru",
        bikeCompatible: "Ather 450X Gen 3",
      },
      {
        productId: "prod_03",
        productName: "Kavach Sintered Ceramic Front Brake Pad Set",
        quantity: 1,
        unitPrice: 1599,
        sellerId: "seller_09",
        sellerName: "Kavach EV Brakes & Alloys",
        bikeCompatible: "Ather 450X Gen 3",
      },
    ],
    subtotal: 36598,
    deliveryFee: 0,
    taxGst: 4391,
    discount: 1000,
    totalAmount: 39989,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "In Transit",
    trackingNumber: "DLV-BLR-99410294",
    courier: "Delhivery",
    riderId: "rider_01",
    riderName: "Ramesh Kumar (+91 98450 19284)",
    fitmentVerified: true,
    notes: "Customer confirmed EV chassis VIN match verified before dispatch.",
  },
  {
    id: "ord_102",
    orderNumber: "RZP-2026-08413",
    date: "2026-04-14T08:15:00Z",
    customerId: "cust_02",
    customerName: "Pooja Hegde",
    customerPhone: "+91 98451 22890",
    customerCity: "Bengaluru",
    shippingAddress: "Villa 12, Indiranagar 100ft Road, Bengaluru - 560038",
    items: [
      {
        productId: "prod_02",
        productName: "HyperCharge Pro 72V 12A Smart Fast Charger (Ather / Ola)",
        quantity: 1,
        unitPrice: 7999,
        sellerId: "seller_07",
        sellerName: "VoltMaster FastCharge Systems",
        bikeCompatible: "Ola S1 Pro Gen 2",
      },
    ],
    subtotal: 7999,
    deliveryFee: 40,
    taxGst: 1440,
    discount: 500,
    totalAmount: 8979,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    status: "Dispatched",
    trackingNumber: "RZP-EXP-001289",
    courier: "RiderzPro Fleet",
    riderId: "rider_02",
    riderName: "Suresh Gowda (+91 98801 88201)",
    fitmentVerified: true,
  },
  {
    id: "ord_103",
    orderNumber: "RZP-2026-08414",
    date: "2026-04-14T07:30:00Z",
    customerId: "cust_03",
    customerName: "Karthik Venkat",
    customerPhone: "+91 97412 88301",
    customerCity: "Chennai",
    shippingAddress: "7th Cross, Besant Nagar, Chennai - 600090",
    items: [
      {
        productId: "prod_05",
        productName: "RideSafe AeroShield Pro Full-Face ECE 22.06 Helmet",
        quantity: 1,
        unitPrice: 4899,
        sellerId: "seller_08",
        sellerName: "RideSafe Premium Helmets & Armor",
        bikeCompatible: "Universal Fit",
      },
    ],
    subtotal: 4899,
    deliveryFee: 60,
    taxGst: 882,
    discount: 0,
    totalAmount: 5841,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Processing",
    trackingNumber: "BD-CHN-881920",
    courier: "Blue Dart",
    fitmentVerified: true,
  },
  {
    id: "ord_104",
    orderNumber: "RZP-2026-08415",
    date: "2026-04-13T16:20:00Z",
    customerId: "cust_04",
    customerName: "Rohan Deshmukh",
    customerPhone: "+91 98220 54119",
    customerCity: "Pune",
    shippingAddress: "Plot 88, Viman Nagar, Pune - 411014",
    items: [
      {
        productId: "prod_07",
        productName: "Deccan 48V 28Ah Heavy Duty Swappable Battery",
        quantity: 1,
        unitPrice: 28500,
        sellerId: "seller_03",
        sellerName: "Deccan Battery Labs & Electronics",
        bikeCompatible: "Bajaj Chetak Premium",
      },
    ],
    subtotal: 28500,
    deliveryFee: 0,
    taxGst: 3420,
    discount: 1500,
    totalAmount: 30420,
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    status: "Delivered",
    trackingNumber: "SHD-PUN-448102",
    courier: "Shadowfax",
    riderId: "rider_04",
    riderName: "Anand Shettigar (+91 99002 77192)",
    fitmentVerified: true,
  },
  {
    id: "ord_105",
    orderNumber: "RZP-2026-08416",
    date: "2026-04-13T14:10:00Z",
    customerId: "cust_05",
    customerName: "Sneha Reddy",
    customerPhone: "+91 99890 33412",
    customerCity: "Hyderabad",
    shippingAddress: "Apt 501, Jubilee Hills Road No. 36, Hyderabad - 500033",
    items: [
      {
        productId: "prod_08",
        productName: "GreenPulse 3.5kW Sinusoidal FOC Motor Controller",
        quantity: 1,
        unitPrice: 12999,
        sellerId: "seller_06",
        sellerName: "GreenPulse EV Motors & Controllers",
        bikeCompatible: "Ola S1 Pro Gen 2",
      },
    ],
    subtotal: 12999,
    deliveryFee: 50,
    taxGst: 1560,
    discount: 500,
    totalAmount: 14109,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "In Transit",
    trackingNumber: "DLV-HYD-551092",
    courier: "Delhivery",
    riderId: "rider_07",
    riderName: "Syed Imran (+91 99890 11982)",
    fitmentVerified: true,
  },
  {
    id: "ord_106",
    orderNumber: "RZP-2026-08417",
    date: "2026-04-13T11:05:00Z",
    customerId: "cust_06",
    customerName: "Vikram Kulkarni",
    customerPhone: "+91 98201 99241",
    customerCity: "Mumbai",
    shippingAddress: "B-204, Powai Vihar Complex, Powai, Mumbai - 400076",
    items: [
      {
        productId: "prod_06",
        productName: "Zenith CNC Anodized Adjustable Brake Levers (Pair)",
        quantity: 1,
        unitPrice: 1999,
        sellerId: "seller_04",
        sellerName: "Zenith Moto Accessories",
        bikeCompatible: "Ather 450X",
      },
    ],
    subtotal: 1999,
    deliveryFee: 40,
    taxGst: 240,
    discount: 0,
    totalAmount: 2279,
    paymentMethod: "Credit Card",
    paymentStatus: "Refunded",
    status: "Cancelled",
    trackingNumber: "BD-MUM-110294",
    courier: "Blue Dart",
    fitmentVerified: true,
    notes: "Cancelled upon customer request before hub handoff. Refund processed.",
  },
  // Generate remaining 36 realistic orders spread over 90 days to achieve 42 total orders
  ...Array.from({ length: 36 }).map((_, i) => {
    const orderIdx = 107 + i;
    const custIdx = i % MOCK_ADMIN_CUSTOMERS.length;
    const customer = MOCK_ADMIN_CUSTOMERS[custIdx];
    const prodIdx = (i * 2) % MOCK_ADMIN_PRODUCTS.length;
    const product = MOCK_ADMIN_PRODUCTS[prodIdx];
    const city = customer.city;
    const courier = couriers[i % couriers.length];
    const method = methods[i % methods.length];
    const statuses: AdminOrder["status"][] = ["Placed", "Processing", "Dispatched", "In Transit", "Delivered", "Delivered", "Delivered", "Cancelled"];
    const status = statuses[i % statuses.length];
    const rider = MOCK_ADMIN_RIDERS[i % MOCK_ADMIN_RIDERS.length];

    // Dates spread from Jan 15 to Apr 12
    const daysAgo = (36 - i) * 2;
    const dateObj = new Date("2026-04-14T10:00:00Z");
    dateObj.setDate(dateObj.getDate() - daysAgo);

    const price = product.discountPrice || product.price;
    const gst = Math.round(price * 0.12);
    const fee = price > 5000 ? 0 : 50;
    const discount = i % 4 === 0 ? 300 : 0;
    const total = price + gst + fee - discount;

    return {
      id: `ord_${orderIdx}`,
      orderNumber: `RZP-2026-084${orderIdx}`,
      date: dateObj.toISOString(),
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerCity: city,
      shippingAddress: customer.address,
      items: [
        {
          productId: product.id,
          productName: product.title,
          quantity: 1,
          unitPrice: price,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          bikeCompatible: product.compatibleBikes[0] || "Universal Fit",
        },
      ],
      subtotal: price,
      deliveryFee: fee,
      taxGst: gst,
      discount,
      totalAmount: total,
      paymentMethod: method,
      paymentStatus: status === "Cancelled" ? "Refunded" : "Paid",
      status,
      trackingNumber: `TRK-${city.slice(0, 3).toUpperCase()}-${881900 + orderIdx}`,
      courier,
      riderId: status !== "Placed" && status !== "Processing" ? rider.id : undefined,
      riderName: status !== "Placed" && status !== "Processing" ? `${rider.name} (${rider.phone})` : undefined,
      fitmentVerified: true,
      notes: status === "Cancelled" ? "User initiated cancellation." : undefined,
    } as AdminOrder;
  }),
];

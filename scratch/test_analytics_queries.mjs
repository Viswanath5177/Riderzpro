import { createClient } from "@libsql/client";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const client = createClient({ url: `file:${dbPath}` });

async function testQueries() {
  console.log("=== TESTING LIVE DATABASE ANALYTICS QUERIES ===");

  // 1. Summary counts
  const custRes = await client.execute("SELECT COUNT(*) as count FROM customers");
  const totalCustomers = Number(custRes.rows[0].count);

  const admRes = await client.execute("SELECT COUNT(*) as count FROM admins WHERE is_active = 1");
  const totalAdmins = Number(admRes.rows[0].count);

  const sellersRes = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'PENDING_REVIEW' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN account_status = 'FROZEN' THEN 1 ELSE 0 END) as frozen
    FROM sellers
  `);
  const totalVendors = Number(sellersRes.rows[0].total);
  const pendingVendors = Number(sellersRes.rows[0].pending);
  const approvedVendors = Number(sellersRes.rows[0].approved);
  const frozenVendors = Number(sellersRes.rows[0].frozen);

  const prodsRes = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN verification_status = 'pending_approval' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN verification_status = 'approved' THEN 1 ELSE 0 END) as approved
    FROM products
  `);
  const totalProducts = Number(prodsRes.rows[0].total);
  const pendingProducts = Number(prodsRes.rows[0].pending);
  const approvedProducts = Number(prodsRes.rows[0].approved);

  const ordersRes = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status IN ('completed', 'delivered', 'CONFIRMED') THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
      SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as gross_sales,
      SUM(refund_amount) as total_refunds
    FROM orders
  `);
  const totalOrders = Number(ordersRes.rows[0].total);
  const completedOrders = Number(ordersRes.rows[0].completed);
  const pendingOrders = Number(ordersRes.rows[0].pending);
  const cancelledOrders = Number(ordersRes.rows[0].cancelled);
  const grossSales = Number(ordersRes.rows[0].gross_sales || 0);
  const refunds = Number(ordersRes.rows[0].total_refunds || 0);
  const netRevenue = grossSales - refunds;

  console.log({
    totalCustomers,
    totalAdmins,
    totalVendors,
    pendingVendors,
    approvedVendors,
    frozenVendors,
    totalProducts,
    pendingProducts,
    approvedProducts,
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    grossSales,
    refunds,
    netRevenue,
  });

  // 2. Vendor specific drill-down (for VoltHub)
  const v1Orders = await client.execute({
    sql: `
      SELECT 
        COUNT(DISTINCT o.id) as total,
        SUM(CASE WHEN o.status IN ('completed', 'delivered', 'CONFIRMED') THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount ELSE 0 END) as gross_sales,
        SUM(o.refund_amount) as refunds
      FROM orders o
      WHERE o.seller_id = ?
    `,
    args: ["sel_volthub_01"],
  });
  console.log("\n=== VoltHub Orders Summary ===");
  console.log(v1Orders.rows[0]);

  // 3. Best selling products query
  const bestProds = await client.execute(`
    SELECT 
      p.id, 
      p.name, 
      p.price,
      p.seller_id,
      s.store_name,
      SUM(oi.quantity) as units_sold,
      SUM(oi.subtotal) as total_sales
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN sellers s ON p.seller_id = s.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.payment_status = 'paid'
    GROUP BY p.id, p.name, p.price, p.seller_id, s.store_name
    ORDER BY total_sales DESC
    LIMIT 5
  `);
  console.log("\n=== Best Selling Products ===");
  console.log(bestProds.rows);

  // 4. Daily revenue trend
  const trend = await client.execute(`
    SELECT 
      substr(created_at, 1, 10) as date,
      SUM(CASE WHEN payment_status = 'paid' THEN total_amount - refund_amount ELSE 0 END) as revenue,
      COUNT(id) as orders
    FROM orders
    GROUP BY substr(created_at, 1, 10)
    ORDER BY date ASC
  `);
  console.log("\n=== Revenue Trend ===");
  console.log(trend.rows);
}

testQueries().catch(console.error);

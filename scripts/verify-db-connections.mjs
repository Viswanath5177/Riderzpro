import pg from "pg";
import dotenv from "dotenv";
import { query } from "../src/server/db.js";

dotenv.config();

console.log("=== TESTING LIVE DATABASE QUERY VIA DB.TS ===");

try {
  const sellers = await query(`
    SELECT s.id, s.store_name, s.email, s.city, s.status, s.is_active 
    FROM sellers s 
    WHERE s.is_active = 1
  `);
  console.log(`✓ Active sellers query succeeded! Count: ${sellers.rows.length}`);
  sellers.rows.forEach(s => console.log("  -", s.id, "|", s.store_name, "| Status:", s.status));

  const prods = await query(`
    SELECT id, name, price, stock, category_id, verification_status 
    FROM products 
    LIMIT 5
  `);
  console.log(`✓ Products query succeeded! Count returned: ${prods.rows.length}`);
  prods.rows.forEach(p => console.log("  -", p.name, "| ₹" + p.price, "| Stock:", p.stock, "| Status:", p.verification_status));

  const ords = await query(`
    SELECT id, order_number, total_amount, status 
    FROM orders 
    LIMIT 5
  `);
  console.log(`✓ Orders query succeeded! Count returned: ${ords.rows.length}`);
  ords.rows.forEach(o => console.log("  -", o.order_number, "| ₹" + o.total_amount, "| Status:", o.status));

  console.log("✓ ALL LIVE DATABASE QUERIES OPERATIONAL!");
  process.exit(0);
} catch (err) {
  console.error("✗ Query failed:", err);
  process.exit(1);
}

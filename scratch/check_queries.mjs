import fs from "fs";

const content = fs.readFileSync("src/server/dbMiddleware.ts", "utf-8");
const lines = content.split("\n");
lines.forEach((line, idx) => {
  if (line.includes("seller_id") || line.includes("order_items") || line.includes("user_id")) {
    console.log(`dbMiddleware.ts:${idx + 1}: ${line.trim()}`);
  }
});

const authContent = fs.readFileSync("src/server/authRoutes.ts", "utf-8");
const authLines = authContent.split("\n");
authLines.forEach((line, idx) => {
  if (line.includes("user_id") || line.includes("customer_addresses")) {
    console.log(`authRoutes.ts:${idx + 1}: ${line.trim()}`);
  }
});

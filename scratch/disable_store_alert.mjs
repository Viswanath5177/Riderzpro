import fs from "fs";

let content = fs.readFileSync("src/routes/dashboard.vendor.tsx", "utf-8");

content = content.replace(
  /\/\/ Determine if store action is actually needed[\s\S]*?\}, \[hasConfirmedStore, dbVendor\]\);/,
  "// Store action alert disabled\n  const needsStoreAction = false;"
);

fs.writeFileSync("src/routes/dashboard.vendor.tsx", content);
console.log("Successfully updated needsStoreAction in dashboard.vendor.tsx");

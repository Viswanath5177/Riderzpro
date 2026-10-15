import { createClient } from "@libsql/client";

async function sync() {
  const tpl = createClient({ url: "file:database/dev.db.template" });
  const dev = createClient({ url: "file:dev.db" });

  console.log("Syncing products from template to dev.db...");
  const tplProducts = await tpl.execute("SELECT * FROM products");
  console.log(`Found ${tplProducts.rows.length} products in template.`);

  for (const row of tplProducts.rows) {
    const cols = Object.keys(row);
    const placeholders = cols.map(() => "?").join(", ");
    const quotedCols = cols.map(c => `"${c}"`).join(", ");
    const values = cols.map(c => row[c]);

    await dev.execute({
      sql: `INSERT OR REPLACE INTO products (${quotedCols}) VALUES (${placeholders})`,
      args: values,
    });
  }

  // Also sync sellers
  const tplSellers = await tpl.execute("SELECT * FROM sellers");
  console.log(`Found ${tplSellers.rows.length} sellers in template.`);
  for (const row of tplSellers.rows) {
    const cols = Object.keys(row);
    const placeholders = cols.map(() => "?").join(", ");
    const quotedCols = cols.map(c => `"${c}"`).join(", ");
    const values = cols.map(c => row[c]);

    await dev.execute({
      sql: `INSERT OR REPLACE INTO sellers (${quotedCols}) VALUES (${placeholders})`,
      args: values,
    });
  }

  const pCheck = await dev.execute("SELECT count(*) as c FROM products");
  const sCheck = await dev.execute("SELECT count(*) as c FROM sellers");
  console.log(`Synced! dev.db now has: ${pCheck.rows[0].c} products, ${sCheck.rows[0].c} sellers.`);

  tpl.close();
  dev.close();
}

sync().catch(console.error);

import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function run() {
  const schema = await client.execute("SELECT sql FROM sqlite_master WHERE name='wishlist_items';");
  console.log("wishlist_items SQL:\n", schema.rows[0]?.sql);
  const wSchema = await client.execute("SELECT sql FROM sqlite_master WHERE name='wishlists';");
  console.log("wishlists SQL:\n", wSchema.rows[0]?.sql);
}

run();

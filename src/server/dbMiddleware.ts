import type { IncomingMessage, ServerResponse } from "node:http";
import { initializeDatabaseSchema, isPostgresAvailable } from "./db";
import { handleRoute as authRoute } from "./routes/auth";
import { handleRoute as catalogRoute } from "./routes/catalog";
import { handleRoute as sellerRoute } from "./routes/seller";
import { handleRoute as adminRoute } from "./routes/admin";
import { handleRoute as cartRoute } from "./routes/cart";
import { handleRoute as ordersRoute } from "./routes/orders";
import { handleRoute as riderRoute } from "./routes/rider";
import { handleRoute as deliveriesRoute } from "./routes/deliveries";
import { handleRoute as billingRoute } from "./routes/billing";

let isDbInitialized = false;

export function pgApiMiddleware() {
  return {
    name: "riderzpro-pg-api",
    async configureServer(server: any) {
      if (!isDbInitialized) {
        try {
          await initializeDatabaseSchema();
          isDbInitialized = true;
          if (isPostgresAvailable) {
            console.log("[PostgreSQL] Database schema verified and initialized successfully.");
          }
        } catch (err: any) {
          console.error("[PostgreSQL] Error during schema initialization:", err.message);
        }
      }

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || "";
        const method = req.method?.toUpperCase();
        const [cleanUrl, queryString = ""] = url.split("?");
        const queryParams = new URLSearchParams(queryString);
        if (await authRoute(req, res, cleanUrl, method)) return;
        if (await catalogRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await sellerRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await adminRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await cartRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await ordersRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await billingRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await riderRoute(req, res, cleanUrl, method)) return;
        if (await deliveriesRoute(req, res, cleanUrl, method)) return;
        next();
      });
    },
  };
}

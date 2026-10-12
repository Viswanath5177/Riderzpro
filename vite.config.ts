// @lovable.dev/vite-tanstack-config already includes standard plugins
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { pgApiMiddleware } from "./src/server/dbMiddleware";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    plugins: [pgApiMiddleware()],
  },
});

// @lovable.dev/vite-tanstack-config already includes standard plugins
// Multi-vendor marketplace API middleware enabled
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";
import { pgApiMiddleware } from "./src/server/dbMiddleware";

const cloudflareWorkersDevShim = {
  name: "riderzpro-cloudflare-workers-dev-shim",
  enforce: "pre" as const,
  resolveId(source: string) {
    if (source === "cloudflare:workers") {
      return fileURLToPath(new URL("./node_modules/nitro/dist/presets/cloudflare/runtime/shims/workers.dev.mjs", import.meta.url));
    }
  },
};

export default defineConfig({
  plugins: [cloudflareWorkersDevShim, pgApiMiddleware()],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "cloudflare:workers": fileURLToPath(new URL("./node_modules/nitro/dist/presets/cloudflare/runtime/shims/workers.dev.mjs", import.meta.url)),
      },
    },
    // This runtime-only import is supplied by Nitro's Cloudflare dev shim;
    // Vite's dependency scanner cannot resolve it as a regular package.
    optimizeDeps: {
      exclude: ["cloudflare:workers"],
    },
    // Nitro's Cloudflare preset provides this built-in module at runtime.
    // Keep it external during Vite's intermediate SSR bundle as well.
    build: {
      rolldownOptions: {
        external: ["cloudflare:workers"],
      },
    },
    server: {
      proxy: {
        "/api/v1/chat": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
        },
        "/api/query": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
});

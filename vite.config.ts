// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

const cloudflareWorkersDevShim = {
  name: "riderzpro-cloudflare-workers-dev-shim",
  enforce: "pre" as const,
  apply: "serve" as const,
  resolveId(source: string) {
    if (source === "cloudflare:workers") {
      return fileURLToPath(new URL("./node_modules/nitro/dist/presets/cloudflare/runtime/shims/workers.dev.mjs", import.meta.url));
    }
  },
};

export default defineConfig({
  plugins: [cloudflareWorkersDevShim],
  vite: {
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
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

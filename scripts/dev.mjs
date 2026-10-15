import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ensureEnvironmentAndDatabase } from "./ensure-env-and-db.mjs";

async function startDev() {
  // 1. Ensure .env, .dev.vars, and dev.db exist and are populated
  await ensureEnvironmentAndDatabase();

  // 2. Load variables from .dev.vars into process.env if present
  const devVarsPath = path.resolve(process.cwd(), ".dev.vars");
  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }

  // 3. Start Vite dev server
  const viteBin = path.resolve(process.cwd(), "node_modules", "vite", "bin", "vite.js");
  const child = spawn(process.execPath, ["--env-file=.dev.vars", viteBin, "dev"], {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.exit(0);
    } else {
      process.exit(code || 0);
    }
  });

  const cleanExit = () => {
    try {
      child.kill("SIGTERM");
    } catch {}
    process.exit(0);
  };

  process.on("SIGINT", cleanExit);
  process.on("SIGTERM", cleanExit);
}

startDev().catch((err) => {
  console.error("Failed to start development server:", err);
  process.exit(1);
});

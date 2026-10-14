import type { IncomingMessage, ServerResponse } from "node:http";
import { handleAuthRoute } from "../authRoutes";

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined): Promise<boolean> {
  return handleAuthRoute(req, res, cleanUrl, method || "GET");
}

/**
 * Shared Mock Configuration Helper for Admin modules
 *
 * Mock mode is active ONLY when:
 * 1. The build is not production
 * 2. VITE_USE_MOCK === 'true'
 *
 * In a production build, it is ALWAYS false. Default is false.
 */

const isProd =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.PROD
    : process.env["NODE_ENV"] === "production";

const useMockEnv =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env.VITE_USE_MOCK || import.meta.env.VITE_USE_MOCK_ADMIN_ORDERS || import.meta.env.VITE_USE_MOCK_ADMIN_SELLERS)
    : (process.env["VITE_USE_MOCK"] || process.env["VITE_USE_MOCK_ADMIN_ORDERS"] || process.env["VITE_USE_MOCK_ADMIN_SELLERS"]);

const showSellersEnv =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_SHOW_ADMIN_SELLERS
    : process.env["VITE_SHOW_ADMIN_SELLERS"];

export const USE_MOCK: boolean = !isProd && useMockEnv === "true";

export function isMockEnabled(): boolean {
  return USE_MOCK;
}

export default USE_MOCK;

/**
 * Flag to control visibility of the admin Sellers tab and routes.
 * Default is false, and ALWAYS false in production.
 */
export const SHOW_ADMIN_SELLERS: boolean = !isProd && showSellersEnv === "true";

/**
 * Shared Mock Configuration Helper for Admin modules
 * Re-exports the central mock flags from vendor/mockFlags.
 */
export { USE_MOCK, isMockEnabled } from "../vendor/mockFlags";
export { default } from "../vendor/mockFlags";

/**
 * Flag to control visibility of the admin Sellers tab and routes.
 * Default is false, and ALWAYS false in production.
 */
export const SHOW_ADMIN_SELLERS: boolean =
  !import.meta.env.PROD && import.meta.env.VITE_SHOW_ADMIN_SELLERS === "true";

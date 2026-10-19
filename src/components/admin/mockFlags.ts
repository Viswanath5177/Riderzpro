/**
 * Shared Mock Configuration Helper for Admin modules
 *
 * Mock data is DISABLED: everything is strictly fetched from PostgreSQL / live database API routes.
 */

export const USE_MOCK: boolean = false;

export function isMockEnabled(): boolean {
  return false;
}

export default USE_MOCK;

/**
 * Flag to control visibility of the admin Sellers tab and routes.
 * Enabled for unified platform oversight.
 */
export const SHOW_ADMIN_SELLERS: boolean = true;

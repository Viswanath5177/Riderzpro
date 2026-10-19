/**
 * Shared Mock Configuration Helper for Vendor modules
 *
 * Mock mode is DISABLED: all vendor inventory, orders, and stats are fetched strictly from live database API endpoints.
 */

export const USE_MOCK: boolean = false;

export function isMockEnabled(): boolean {
  return false;
}

export default USE_MOCK;

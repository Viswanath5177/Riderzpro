/**
 * Shared Mock Configuration Helper
 *
 * Mock mode is active ONLY when:
 * 1. The build is not production (!import.meta.env.PROD)
 * 2. import.meta.env.VITE_USE_MOCK === 'true'
 *
 * In a production build, it is ALWAYS false (even if VITE_USE_MOCK is set). Default is false.
 */

export const USE_MOCK: boolean =
  !import.meta.env.PROD &&
  (import.meta.env.VITE_USE_MOCK === "true" ||
    import.meta.env.VITE_USE_MOCK_SELLER_INVENTORY === "true" ||
    import.meta.env.VITE_USE_MOCK_SELLER_ORDERS === "true");

export function isMockEnabled(): boolean {
  return USE_MOCK;
}

export default USE_MOCK;

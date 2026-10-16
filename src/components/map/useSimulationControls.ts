import { useEffect, useState } from "react";

/**
 * Cached server role promise to prevent redundant GET /api/auth/me requests across renders.
 */
let serverRolePromise: Promise<string | null> | null = null;

/**
 * Checks whether the URL contains ?demo=1 (or demo=true) presenter override.
 */
export function hasDemoParam(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("demo");
    return demo === "1" || demo === "true";
  } catch {
    return false;
  }
}

/**
 * Fetches the authenticated user role strictly from the server session endpoint.
 * Never reads from localStorage or client-set values.
 */
export async function fetchServerRole(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!serverRolePromise) {
    serverRolePromise = fetch("/api/auth/me", {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.authenticated) {
          return (data.role || data.user?.role || null) as string | null;
        }
        return null;
      })
      .catch(() => null);
  }

  return serverRolePromise;
}

/**
 * Helper hook to gate delivery simulation controls.
 *
 * Returns true ONLY when:
 * 1. The URL contains ?demo=1 (presenter demo override), OR
 * 2. The signed-in user's role from the server session is 'admin'.
 *
 * In normal customer view (no ?demo=1, not an admin), returns false.
 */
export function useSimulationControls(): boolean {
  const [canSimulate, setCanSimulate] = useState<boolean>(() => hasDemoParam());

  useEffect(() => {
    // If URL already has ?demo=1 override, simulation is enabled immediately
    if (hasDemoParam()) {
      setCanSimulate(true);
      return;
    }

    let isMounted = true;
    fetchServerRole().then((role) => {
      if (!isMounted) return;
      if (role === "admin") {
        setCanSimulate(true);
      } else {
        setCanSimulate(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return canSimulate;
}

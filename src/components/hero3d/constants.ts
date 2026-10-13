/**
 * ════════════════════════════════════════════════════════════════════════════════
 * HERO 3D SCENE CONFIGURATION & TUNING CONSTANTS
 * ════════════════════════════════════════════════════════════════════════════════
 * Calibrated for Ather-450X-inspired EV commuter:
 * - Top of scooter (handlebar/visor) sits at y ~44% (below headline "Power your ride. Parts that fit.")
 * - Ground contact y=0 sits at y ~88% (just above the trust row)
 * - Front wheel extends to the right of the card, rear wheel extends to the left
 */

// 1. SCOOTER SCALE (desktop >=1024px, tablet 768-1023px, mobile <768px)
export const HERO_3D_SCALE = {
  desktop: 1.0,
  tablet: 0.88,
  mobile: 0.72,
} as const;

// 2. SCOOTER POSITION [x, y, z] (centered behind card, ground at y=0)
export const HERO_3D_POSITION = {
  desktop: [0.0, 0.0, 0.0] as [number, number, number],
  tablet: [0.0, 0.0, 0.0] as [number, number, number],
  mobile: [0.0, 0.0, 0.0] as [number, number, number],
} as const;

// 3. CAMERA CONFIGURATION [FOV, position, target]
// Scooter bounding box: X[-0.64, +0.66] Y[0, ~1.02] Z[-0.27, +0.27]
// Centre: [0.01, 0.51, 0.0]
// At z=3.8, fov=44°: vertical frustum height = 2 * 3.8 * tan(22°) ≈ 3.07 m → frames 1.02 m scooter with 3× margin ✓
export const HERO_3D_CAMERA = {
  desktop: {
    fov: 44,
    position: [0.8, 1.4, 3.8] as [number, number, number],
    target: [0.01, 0.51, 0.0] as [number, number, number],
  },
  tablet: {
    fov: 50,
    position: [0.6, 1.3, 3.6] as [number, number, number],
    target: [0.01, 0.51, 0.0] as [number, number, number],
  },
  mobile: {
    fov: 55,
    position: [0.4, 1.2, 3.4] as [number, number, number],
    target: [0.01, 0.51, 0.0] as [number, number, number],
  },
} as const;

// 4. BODY PANEL OPACITY during exploded state (25% opacity per spec)
export const HERO_3D_PANEL_FADE_OPACITY = 0.25;

// 5. CYCLE TIMING (in seconds, total ~11s cycle including repeatDelay)
export const HERO_3D_CYCLE_TIMING = {
  assembledHold: 1.0,
  explodeDuration: 2.0,
  explodedHold: 1.5,
  returnDuration: 2.5,
  repeatDelay: 3.0,
} as const;

// 6. IDLE CAMERA ORBIT AMPLITUDE (±8° azimuth, ±3° elevation in radians)
export const HERO_3D_ORBIT_AMPLITUDE = {
  azimuthMaxRad: (8 * Math.PI) / 180, // ~0.1396 rad (±8°)
  elevationMaxRad: (3 * Math.PI) / 180, // ~0.0523 rad (±3°)
  speed: 0.45,
} as const;

// 7. Node names contract (12 required + 3 optional)
export const REQUIRED_SCOOTER_NODES = [
  "frame",
  "wheel_front",
  "wheel_rear",
  "body_panel_left",
  "body_panel_right",
  "front_fairing",
  "rear_cowl",
  "seat",
  "battery",
  "motor",
  "controller",
  "wiring",
] as const;

export type RequiredScooterNodeName = (typeof REQUIRED_SCOOTER_NODES)[number];

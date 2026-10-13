import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * PROCEDURAL ATHER-450X-INSPIRED ELECTRIC SCOOTER
 * ════════════════════════════════════════════════════════════════════════════════
 * Built from extruded shapes with bevels (bevelSegments >= 3) and primitives.
 *
 * Contract:
 * - Units: Metres. Y-up. Forward = +X. Origin at ground contact (0, 0, 0).
 * - Exact 12 required node names:
 *   frame, wheel_front, wheel_rear, body_panel_left, body_panel_right,
 *   front_fairing, rear_cowl, seat, battery, motor, controller, wiring
 * - Optional: headlamp, floorboard, handlebar.
 */
export function ProceduralScooter() {
  // Shared materials for automotive finish
  const materials = useMemo(() => {
    return {
      bodyPearl: new THREE.MeshPhysicalMaterial({
        color: 0xf4f6f8,
        roughness: 0.22,
        metalness: 0.12,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      }),
      bodyGraphite: new THREE.MeshPhysicalMaterial({
        color: 0x181a1d,
        roughness: 0.35,
        metalness: 0.2,
        clearcoat: 0.5,
      }),
      chassisSteel: new THREE.MeshStandardMaterial({
        color: 0x232528,
        roughness: 0.45,
        metalness: 0.8,
      }),
      tireRubber: new THREE.MeshStandardMaterial({
        color: 0x121314,
        roughness: 0.9,
        metalness: 0.05,
      }),
      alloySilver: new THREE.MeshStandardMaterial({
        color: 0xd8dade,
        roughness: 0.28,
        metalness: 0.85,
      }),
      seatLeather: new THREE.MeshStandardMaterial({
        color: 0x1a1a1d,
        roughness: 0.72,
        metalness: 0.04,
      }),
      batteryCasing: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.35,
        metalness: 0.5,
      }),
      controllerAlu: new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.3,
        metalness: 0.85,
      }),
      motorHub: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.32,
        metalness: 0.85,
      }),
      cyanAccent: new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x000000, // off until revealed
        emissiveIntensity: 0.0,
        roughness: 0.25,
      }),
      cableOrange: new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.45,
      }),
      ledHeadlamp: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.7,
        roughness: 0.1,
      }),
      redTaillight: new THREE.MeshStandardMaterial({
        color: 0xe11d2a,
        emissive: 0xe11d2a,
        emissiveIntensity: 0.5,
      }),
    };
  }, []);

  // Procedural geometries using THREE.Shape & ExtrudeGeometry (bevelSegments >= 3)
  const geometries = useMemo(() => {
    // 1. Angular Side Panel Shape (Sharp Ather-style aerodynamic contour)
    const panelShape = new THREE.Shape();
    panelShape.moveTo(-0.32, -0.14);
    panelShape.lineTo(0.3, -0.12);
    panelShape.lineTo(0.36, 0.08);
    panelShape.lineTo(0.18, 0.16);
    panelShape.lineTo(-0.28, 0.15);
    panelShape.closePath();

    const panelGeo = new THREE.ExtrudeGeometry(panelShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
    panelGeo.center();

    // 2. Pointed Floating Front Fairing & Apron
    const fairingShape = new THREE.Shape();
    fairingShape.moveTo(-0.14, -0.28);
    fairingShape.lineTo(0.16, -0.24);
    fairingShape.lineTo(0.22, 0.18);
    fairingShape.lineTo(0.04, 0.32);
    fairingShape.lineTo(-0.16, 0.22);
    fairingShape.closePath();

    const fairingGeo = new THREE.ExtrudeGeometry(fairingShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
    fairingGeo.center();

    // 3. Ergonomic Commuter Saddle (Seat with raised tail)
    const seatShape = new THREE.Shape();
    seatShape.moveTo(-0.36, -0.04);
    seatShape.lineTo(0.32, -0.03);
    seatShape.lineTo(0.3, 0.05);
    seatShape.lineTo(-0.32, 0.09); // raised tail
    seatShape.closePath();

    const seatGeo = new THREE.ExtrudeGeometry(seatShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.018,
      bevelThickness: 0.018,
    });
    seatGeo.center();

    // 4. Flat Floorboard
    const floorShape = new THREE.Shape();
    floorShape.moveTo(-0.22, -0.12);
    floorShape.lineTo(0.22, -0.12);
    floorShape.lineTo(0.2, 0.12);
    floorShape.lineTo(-0.2, 0.12);
    floorShape.closePath();

    const floorGeo = new THREE.ExtrudeGeometry(floorShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });
    floorGeo.center();

    return { panelGeo, fairingGeo, seatGeo, floorGeo };
  }, []);

  return (
    <group name="scooter_root" rotation={[0, -Math.PI / 12, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. FRAME: Tubular Underbone Steel Chassis (Pivot at center)
         ───────────────────────────────────────────────────────────── */}
      <group name="frame" position={[0.0, 0.38, 0.0]}>
        {/* Main central spine tube */}
        <mesh
          position={[0.08, 0.05, 0]}
          rotation={[0, 0, Math.PI / 7]}
          material={materials.chassisSteel}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.78, 16]} />
        </mesh>
        {/* Lower dual cradle tubes */}
        <mesh position={[0.02, -0.12, 0.09]} material={materials.chassisSteel}>
          <boxGeometry args={[0.52, 0.032, 0.032]} />
        </mesh>
        <mesh position={[0.02, -0.12, -0.09]} material={materials.chassisSteel}>
          <boxGeometry args={[0.52, 0.032, 0.032]} />
        </mesh>
        {/* Rear swingarm support */}
        <mesh
          position={[-0.38, -0.08, 0]}
          rotation={[0, 0, -Math.PI / 10]}
          material={materials.chassisSteel}
        >
          <boxGeometry args={[0.42, 0.04, 0.16]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. FRONT WHEEL (Ground contact at y = 0, axle at y = 0.24m, x = +0.66m)
         ───────────────────────────────────────────────────────────── */}
      <group name="wheel_front" position={[0.66, 0.24, 0.0]}>
        {/* 12-inch style Tire (Torus) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.tireRubber}>
          <torusGeometry args={[0.2, 0.048, 16, 32]} />
        </mesh>
        {/* Alloy Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.alloySilver}>
          <cylinderGeometry args={[0.16, 0.16, 0.045, 24]} />
        </mesh>
        {/* 5-Spoke Pattern */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * 2 * Math.PI) / 5]} material={materials.alloySilver}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          </mesh>
        ))}
        {/* Front Telescopic Forks */}
        <mesh
          position={[-0.04, 0.22, 0.08]}
          rotation={[0, 0, -Math.PI / 14]}
          material={materials.chassisSteel}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.44, 16]} />
        </mesh>
        <mesh
          position={[-0.04, 0.22, -0.08]}
          rotation={[0, 0, -Math.PI / 14]}
          material={materials.chassisSteel}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.44, 16]} />
        </mesh>
        {/* Disc Brake & Caliper */}
        <mesh
          position={[0, 0, 0.04]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.alloySilver}
        >
          <cylinderGeometry args={[0.11, 0.11, 0.008, 24]} />
        </mesh>
        <mesh position={[0.05, 0.08, 0.045]} material={materials.bodyGraphite}>
          <boxGeometry args={[0.05, 0.06, 0.025]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. REAR WHEEL (Ground contact at y = 0, axle at y = 0.24m, x = -0.64m)
         ───────────────────────────────────────────────────────────── */}
      <group name="wheel_rear" position={[-0.64, 0.24, 0.0]}>
        {/* Tire */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.tireRubber}>
          <torusGeometry args={[0.2, 0.048, 16, 32]} />
        </mesh>
        {/* Alloy Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.alloySilver}>
          <cylinderGeometry args={[0.16, 0.16, 0.045, 24]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. BODY PANEL LEFT (Pearl white with graphite crease)
         ───────────────────────────────────────────────────────────── */}
      <group name="body_panel_left" position={[-0.1, 0.48, 0.14]}>
        <mesh geometry={geometries.panelGeo} material={materials.bodyPearl} />
        {/* Sharp aerodynamic crease */}
        <mesh position={[0.02, -0.06, 0.022]} material={materials.bodyGraphite}>
          <boxGeometry args={[0.52, 0.04, 0.01]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. BODY PANEL RIGHT (Pearl white with graphite crease)
         ───────────────────────────────────────────────────────────── */}
      <group name="body_panel_right" position={[-0.1, 0.48, -0.14]}>
        <mesh
          geometry={geometries.panelGeo}
          material={materials.bodyPearl}
          rotation={[0, Math.PI, 0]}
        />
        {/* Sharp aerodynamic crease */}
        <mesh position={[0.02, -0.06, -0.022]} material={materials.bodyGraphite}>
          <boxGeometry args={[0.52, 0.04, 0.01]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          6. FRONT FAIRING (Pointed Ather-inspired cowl)
         ───────────────────────────────────────────────────────────── */}
      <group name="front_fairing" position={[0.42, 0.62, 0.0]}>
        <mesh
          geometry={geometries.fairingGeo}
          material={materials.bodyPearl}
          rotation={[Math.PI / 2, 0, -Math.PI / 14]}
        />
        {/* Smoked Tint Visor / Deflector */}
        <mesh
          position={[0.05, 0.24, 0]}
          rotation={[0, 0, -Math.PI / 8]}
          material={materials.bodyGraphite}
        >
          <boxGeometry args={[0.1, 0.18, 0.2]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          7. REAR COWL (Tapered aerodynamic tail)
         ───────────────────────────────────────────────────────────── */}
      <group name="rear_cowl" position={[-0.46, 0.58, 0.0]}>
        <mesh material={materials.bodyPearl}>
          <boxGeometry args={[0.34, 0.2, 0.22]} />
        </mesh>
        {/* Compact Red LED Taillight */}
        <mesh position={[-0.175, 0.02, 0]} material={materials.redTaillight}>
          <boxGeometry args={[0.02, 0.05, 0.16]} />
        </mesh>
        {/* Aluminum Passenger Grab Rail */}
        <mesh position={[0.04, 0.12, 0]} material={materials.alloySilver}>
          <boxGeometry args={[0.22, 0.025, 0.2]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          8. SEAT (Slim flat commuter saddle with raised tail)
         ───────────────────────────────────────────────────────────── */}
      <group name="seat" position={[-0.16, 0.68, 0.0]}>
        <mesh
          geometry={geometries.seatGeo}
          material={materials.seatLeather}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          9. BATTERY (Modular High-Voltage Pack in underbone cradle)
         ───────────────────────────────────────────────────────────── */}
      <group name="battery" position={[-0.02, 0.35, 0.0]}>
        {/* Main battery casing */}
        <mesh material={materials.batteryCasing}>
          <boxGeometry args={[0.36, 0.2, 0.18]} />
        </mesh>
        {/* Cell Grid Heat Sink detail */}
        <mesh position={[0, 0, 0.095]} material={materials.controllerAlu}>
          <boxGeometry args={[0.32, 0.16, 0.012]} />
        </mesh>
        <mesh position={[0, 0, -0.095]} material={materials.controllerAlu}>
          <boxGeometry args={[0.32, 0.16, 0.012]} />
        </mesh>
        {/* HV Terminal Cap */}
        <mesh position={[0.12, 0.1, 0.04]} material={materials.cableOrange}>
          <cylinderGeometry args={[0.016, 0.016, 0.035, 12]} />
        </mesh>
        {/* Battery Health LED Status Bar (Cyan glow capable) */}
        <mesh position={[-0.08, 0.1, 0]} material={materials.cyanAccent}>
          <boxGeometry args={[0.14, 0.015, 0.03]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          10. MOTOR (Rear Hub Electric Motor with visible stator ring)
         ───────────────────────────────────────────────────────────── */}
      <group name="motor" position={[-0.64, 0.24, 0.02]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.motorHub}>
          <cylinderGeometry args={[0.11, 0.11, 0.08, 24]} />
        </mesh>
        {/* Stator Cooling Fin Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.alloySilver}>
          <torusGeometry args={[0.09, 0.012, 12, 24]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          11. CONTROLLER (Intelligent Finned Inverter Unit)
         ───────────────────────────────────────────────────────────── */}
      <group name="controller" position={[-0.3, 0.42, 0.0]}>
        <mesh material={materials.controllerAlu}>
          <boxGeometry args={[0.16, 0.11, 0.12]} />
        </mesh>
        {/* Extruded cooling fins */}
        <mesh position={[0, 0.06, 0]} material={materials.alloySilver}>
          <boxGeometry args={[0.14, 0.012, 0.1]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          12. WIRING (Shielded High-Voltage Orange / Cyan Harness)
         ───────────────────────────────────────────────────────────── */}
      <group name="wiring" position={[-0.18, 0.32, 0.04]}>
        {/* Battery to controller run */}
        <mesh
          position={[0, 0.04, 0]}
          rotation={[0, 0, Math.PI / 6]}
          material={materials.cableOrange}
        >
          <cylinderGeometry args={[0.009, 0.009, 0.26, 12]} />
        </mesh>
        {/* High-voltage shielded bus to rear hub motor */}
        <mesh
          position={[-0.22, -0.05, 0]}
          rotation={[0, 0, -Math.PI / 5]}
          material={materials.cyanAccent}
        >
          <cylinderGeometry args={[0.008, 0.008, 0.24, 12]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          OPTIONAL: Headlamp, Floorboard, Handlebar
         ───────────────────────────────────────────────────────────── */}
      <group name="headlamp" position={[0.55, 0.68, 0.0]}>
        {/* Pointed Split Headlamp + Thin LED DRL strip */}
        <mesh material={materials.ledHeadlamp}>
          <boxGeometry args={[0.03, 0.04, 0.18]} />
        </mesh>
      </group>

      <group name="floorboard" position={[0.1, 0.26, 0.0]}>
        <mesh
          geometry={geometries.floorGeo}
          material={materials.bodyGraphite}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      <group name="handlebar" position={[0.42, 0.92, 0.0]}>
        {/* Steering stem */}
        <mesh rotation={[0, 0, -Math.PI / 14]} material={materials.alloySilver}>
          <cylinderGeometry args={[0.016, 0.016, 0.24, 12]} />
        </mesh>
        {/* Crossbar */}
        <mesh
          position={[0, 0.1, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.alloySilver}
        >
          <cylinderGeometry args={[0.014, 0.014, 0.54, 16]} />
        </mesh>
        {/* Dual Ergonomic Grips */}
        <mesh
          position={[0, 0.1, 0.24]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.bodyGraphite}
        >
          <cylinderGeometry args={[0.019, 0.019, 0.1, 12]} />
        </mesh>
        <mesh
          position={[0, 0.1, -0.24]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.bodyGraphite}
        >
          <cylinderGeometry args={[0.019, 0.019, 0.1, 12]} />
        </mesh>
        {/* Digital TFT Instrument Dashboard */}
        <mesh
          position={[-0.03, 0.11, 0]}
          rotation={[Math.PI / 6, 0, 0]}
          material={materials.bodyGraphite}
        >
          <boxGeometry args={[0.08, 0.06, 0.12]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * InteractiveScooterCanvas.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive 3D Ather-450X-inspired EV Scooter:
 *   • Scroll-driven assemble (top) ⟷ disassemble (scroll down)
 *   • Left / Right rotation via UI buttons and direct click & drag / touch swipe
 *   • Calibrated camera & explode offsets matching the reference aesthetic
 *   • Glowing cyan tech core on exploded internals
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useRef, useLayoutEffect, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ProceduralScooter } from "./ProceduralScooter";

// ─── Explode offsets per named node ─────────────────────────────────────────
// Calibrated so parts float cleanly into exploded view without leaving screen
const EXPLODE_OFFSETS: Record<string, [number, number, number]> = {
  frame:             [  0.00,  0.00,  0.00 ],
  wheel_front:       [  0.22,  0.00,  0.00 ],
  wheel_rear:        [ -0.22,  0.00,  0.00 ],
  body_panel_left:   [  0.05,  0.22,  0.52 ],
  body_panel_right:  [  0.05,  0.22, -0.52 ],
  front_fairing:     [  0.44,  0.26,  0.08 ],
  rear_cowl:         [ -0.40,  0.24,  0.00 ],
  seat:              [  0.00,  0.42,  0.00 ],
  battery:           [  0.00, -0.04,  0.06 ],
  motor:             [ -0.16,  0.00,  0.12 ],
  controller:        [ -0.09,  0.08, -0.10 ],
  wiring:            [  0.03,  0.12,  0.12 ],
  headlamp:          [  0.52,  0.28,  0.06 ],
  floorboard:        [  0.05, -0.12,  0.00 ],
  handlebar:         [  0.12,  0.36,  0.00 ],
};

// ─── Responsive Camera Rig ──────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    const updateCam = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      if (isMobile) {
        camera.position.set(0.12, 0.60, 4.4);
        (camera as THREE.PerspectiveCamera).fov = 42;
      } else if (isTablet) {
        camera.position.set(0.18, 0.65, 3.8);
        (camera as THREE.PerspectiveCamera).fov = 36;
      } else {
        // Desktop: eye-level view centered on the scooter
        camera.position.set(0.20, 0.68, 3.4);
        (camera as THREE.PerspectiveCamera).fov = 34;
      }
      camera.lookAt(0.0, 0.46, 0.0);
      camera.updateProjectionMatrix();
    };

    updateCam();
    window.addEventListener("resize", updateCam);
    return () => window.removeEventListener("resize", updateCam);
  }, [camera]);

  return null;
}

// ─── Shadow Plane ────────────────────────────────────────────────────────────
function ShadowPlane() {
  return (
    <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 5]} />
      <shadowMaterial opacity={0.28} />
    </mesh>
  );
}

// ─── Scooter Mesh with Lerped Explode & Rotation ────────────────────────────
interface ScooterMeshProps {
  explodeFactor: number;
  rotationY: number;
  cyanLightRef: React.RefObject<THREE.PointLight | null>;
}

function ScooterMesh({ explodeFactor, rotationY, cyanLightRef }: ScooterMeshProps) {
  const wrapperRef = useRef<THREE.Group>(null);
  const origPos = useRef(new Map<string, THREE.Vector3>());
  const ready = useRef(false);

  // Smoothed internal values for 60fps cinematic lerping
  const smoothExplode = useRef(explodeFactor);
  const smoothRotY = useRef(rotationY);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const root = wrapperRef.current;
      if (!root) return;
      Object.keys(EXPLODE_OFFSETS).forEach((name) => {
        const obj = root.getObjectByName(name);
        if (obj) origPos.current.set(name, obj.position.clone());
      });
      ready.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useFrame((_, dt) => {
    const root = wrapperRef.current;
    if (!root) return;

    // Smooth convergence speed (~6x/sec)
    const speed = Math.min(1, dt * 6);
    smoothExplode.current += (explodeFactor - smoothExplode.current) * speed;
    smoothRotY.current    += (rotationY    - smoothRotY.current)    * speed;

    // Apply rotation to entire scooter root
    root.rotation.y = smoothRotY.current;

    // Boost cyan glow as scooter disassembles
    if (cyanLightRef.current) {
      cyanLightRef.current.intensity = 0.5 + smoothExplode.current * 3.2;
    }

    if (!ready.current) return;

    // Interpolate each component's position between assembled and exploded
    const ef = smoothExplode.current;
    Object.entries(EXPLODE_OFFSETS).forEach(([name, [dx, dy, dz]]) => {
      const obj = root.getObjectByName(name);
      const orig = origPos.current.get(name);
      if (!obj || !orig) return;
      obj.position.set(orig.x + dx * ef, orig.y + dy * ef, orig.z + dz * ef);
    });
  });

  return (
    <group ref={wrapperRef}>
      <ProceduralScooter />
    </group>
  );
}

// ─── Public Component ────────────────────────────────────────────────────────
export interface InteractiveScooterCanvasProps {
  explodeFactor: number;
  rotationY: number;
  onPointerDragDelta?: (deltaX: number) => void;
  className?: string;
}

export function InteractiveScooterCanvas({
  explodeFactor,
  rotationY,
  onPointerDragDelta,
  className = "",
}: InteractiveScooterCanvasProps) {
  const cyanLightRef = useRef<THREE.PointLight>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !onPointerDragDelta) return;
    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;
    onPointerDragDelta(deltaX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
        frameloop="always"
        className="w-full h-full"
      >
        <CameraRig />

        {/* ── High-Key Studio Automotive Lighting ── */}
        <hemisphereLight args={["#ffffff", "#cbd5e1", 0.85]} />
        <ambientLight intensity={0.65} />

        {/* Key Directional Sun Light (Soft shadow) */}
        <directionalLight
          position={[4, 9, 5]}
          intensity={1.75}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0005}
        />

        {/* Fill Light for subtle shadow softening */}
        <directionalLight position={[-4, 4, 3]} intensity={0.65} />

        {/* Brand Red Rim Light */}
        <pointLight position={[3, 1.6, -2]} color="#E11D2A" intensity={2.4} distance={8} />

        {/* Dynamic Glowing Cyan EV Core */}
        <pointLight
          ref={cyanLightRef}
          position={[0, 0.4, 0]}
          color="#00e5ff"
          intensity={0.6}
          distance={4}
        />

        {/* Ground Contact Shadow */}
        <ShadowPlane />

        {/* ── 3D Scooter Model ── */}
        <Suspense fallback={null}>
          <ScooterMesh
            explodeFactor={explodeFactor}
            rotationY={rotationY}
            cyanLightRef={cyanLightRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default InteractiveScooterCanvas;

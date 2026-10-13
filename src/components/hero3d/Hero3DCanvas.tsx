import React, { useState, useEffect, useRef, Suspense, useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { HERO_3D_SCALE, HERO_3D_POSITION, HERO_3D_CAMERA } from "./constants";
import { ScooterScene } from "./ScooterScene";

interface Hero3DCanvasProps {
  isVisible: boolean;
  reducedMotion: boolean;
  onReady?: (type: "procedural" | "glb") => void;
  onError?: (err: Error) => void;
}

class SafeDreiBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  override state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override componentDidCatch(err: Error) {
    if (import.meta.env.DEV) {
      console.info(
        "[Hero3D]: SafeDreiBoundary fell back to local hemisphere lighting.",
        err.message,
      );
    }
  }
  override render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function CameraRig({
  position,
  target,
}: {
  position: [number, number, number];
  target: [number, number, number];
}) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);

  return null;
}

export default function Hero3DCanvas({ isVisible, reducedMotion, onReady }: Hero3DCanvasProps) {
  const [deviceTier, setDeviceTier] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceTier("mobile");
      } else if (width < 1024) {
        setDeviceTier("tablet");
      } else {
        setDeviceTier("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement;
    canvasRef.current = canvas;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("[Hero3D]: WebGL context lost. Suspending frames.");
    };

    const onContextRestored = () => {
      console.info("[Hero3D]: WebGL context restored. Resuming.");
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
  };

  const cameraConfig = HERO_3D_CAMERA[deviceTier];
  const scooterScale = HERO_3D_SCALE[deviceTier];
  const scooterPosition = HERO_3D_POSITION[deviceTier];
  const isMobile = deviceTier === "mobile";

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: cameraConfig.fov,
        position: cameraConfig.position,
      }}
      frameloop={isVisible && !reducedMotion ? "always" : "demand"}
      onCreated={handleCreated}
      tabIndex={-1}
      className="pointer-events-none select-none w-full h-full"
      style={{
        pointerEvents: "none",
        touchAction: "auto",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Explicit camera aim at target */}
      <CameraRig position={cameraConfig.position} target={cameraConfig.target} />

      {/* ─────────────────────────────────────────────────────────────
          LIGHTING RIG
          - Transparent canvas: white site background shows through
          - Studio hemisphere + ambient lights
          - Soft key + fill directional lights
          - Restrained red rim lights (#E11D2A) matching brand primary
          - Subtle cyan core electrical highlight
         ───────────────────────────────────────────────────────────── */}
      <hemisphereLight args={["#ffffff", "#94a3b8", 0.75]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 7, 4]} intensity={1.4} castShadow={false} />
      <directionalLight position={[-4, 3, 2]} intensity={0.55} />

      {/* Red Brand Rim Lights */}
      <pointLight position={[2.5, 1.2, -2.5]} color="#E11D2A" intensity={2.4} distance={8} />
      <pointLight position={[-2.5, 1.0, -2.0]} color="#E11D2A" intensity={1.6} distance={8} />

      {/* Subtle Cyan Core Electrical Highlight */}
      <pointLight position={[0, 0.45, 0]} color="#00e5ff" intensity={0.5} distance={2.5} />

      {/* Studio Environment Preset with safe fallback */}
      {!isMobile && (
        <SafeDreiBoundary fallback={null}>
          <Suspense fallback={null}>
            <Environment preset="studio" background={false} environmentIntensity={0.45} />
          </Suspense>
        </SafeDreiBoundary>
      )}

      {/* Soft Ground Contact Shadows (ground at y = 0) */}
      {!isMobile ? (
        <SafeDreiBoundary
          fallback={
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.8, 1.2]} />
              <meshBasicMaterial color="#d4d4d8" transparent opacity={0.3} />
            </mesh>
          }
        >
          <Suspense fallback={null}>
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.4}
              scale={3.6}
              blur={2.2}
              far={2.5}
              color="#18181b"
            />
          </Suspense>
        </SafeDreiBoundary>
      ) : (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.0]} />
          <meshBasicMaterial color="#d4d4d8" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Scooter Model Container */}
      <group position={scooterPosition} scale={scooterScale}>
        <Suspense fallback={null}>
          <ScooterScene isVisible={isVisible} reducedMotion={reducedMotion} onReady={onReady} />
        </Suspense>
      </group>
    </Canvas>
  );
}

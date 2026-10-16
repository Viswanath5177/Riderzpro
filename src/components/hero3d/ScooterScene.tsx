import React, { useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import {
  HERO_3D_PANEL_FADE_OPACITY,
  HERO_3D_CYCLE_TIMING,
  HERO_3D_ORBIT_AMPLITUDE,
  REQUIRED_SCOOTER_NODES,
} from "./constants";
import { ScooterModel } from "./ScooterModel";

interface ScooterSceneProps {
  isVisible: boolean;
  reducedMotion: boolean;
  onReady?: (type: "procedural" | "glb") => void;
}

interface CachedTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  opacity?: number;
  transparent?: boolean;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
}

export function ScooterScene({ isVisible, reducedMotion, onReady }: ScooterSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const cachedTransforms = useRef<Map<string, CachedTransform>>(new Map());
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Validate nodes and cache transforms once mounted
  const cacheAndValidateNodes = useCallback((root: THREE.Group) => {
    const tableData: Record<string, { status: string; type: string }> = {};
    let allFound = true;

    REQUIRED_SCOOTER_NODES.forEach((name) => {
      const obj = root.getObjectByName(name);
      if (obj) {
        tableData[name] = { status: "FOUND", type: obj.type };
        // Cache original transformation
        const cached: CachedTransform = {
          position: obj.position.clone(),
          quaternion: obj.quaternion.clone(),
          scale: obj.scale.clone(),
        };

        // Cache initial material states if mesh
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            if (mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              cached.opacity = stdMat.opacity;
              cached.transparent = stdMat.transparent;
              if (stdMat.emissive) {
                cached.emissive = stdMat.emissive.clone();
                cached.emissiveIntensity = stdMat.emissiveIntensity;
              }
            }
          }
        });

        cachedTransforms.current.set(name, cached);
      } else {
        tableData[name] = { status: "MISSING", type: "N/A" };
        allFound = false;
      }
    });

    if (import.meta.env.DEV) {
      if (!allFound) {
        console.warn("[Hero3D]: Some required nodes were not found.");
        console.table(tableData);
      }
    }

    return allFound;
  }, []);

  // GSAP Animation Timeline
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    cacheAndValidateNodes(rootRef.current);
    onReady?.("procedural");

    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const getPart = (name: string) => root.getObjectByName(name);

      const seat = getPart("seat");
      const leftPanel = getPart("body_panel_left");
      const rightPanel = getPart("body_panel_right");
      const fairing = getPart("front_fairing");
      const rearCowl = getPart("rear_cowl");
      const battery = getPart("battery");
      const motor = getPart("motor");
      const controller = getPart("controller");
      const wiring = getPart("wiring");

      const setTransparent = (obj: THREE.Object3D | undefined, isTrans: boolean) => {
        if (!obj) return;
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material;
            if (mat) {
              const materials = Array.isArray(mat) ? mat : [mat];
              materials.forEach((m) => {
                m.transparent = isTrans;
                m.needsUpdate = true;
              });
            }
          }
        });
      };

      const setMaterialOpacity = (obj: THREE.Object3D | undefined, val: number) => {
        if (!obj) return;
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material;
            if (mat) {
              const materials = Array.isArray(mat) ? mat : [mat];
              materials.forEach((m) => {
                m.opacity = val;
              });
            }
          }
        });
      };

      const setMaterialEmissive = (
        obj: THREE.Object3D | undefined,
        colorHex: number,
        intensity: number,
      ) => {
        if (!obj) return;
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (mat && mat.emissive) {
              mat.emissive.setHex(colorHex);
              mat.emissiveIntensity = intensity;
            }
          }
        });
      };

      // Master GSAP Timeline (~11s cycle with repeatDelay: 3s)
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: HERO_3D_CYCLE_TIMING.repeatDelay,
        paused: !isVisible,
        onRepeat: () => {
          // Dev assertion: verify every part returned within 1e-4 tolerance
          if (import.meta.env.DEV) {
            let maxDeviation = 0;
            cachedTransforms.current.forEach((cached, name) => {
              const node = getPart(name);
              if (node) {
                const dev = node.position.distanceTo(cached.position);
                if (dev > maxDeviation) maxDeviation = dev;
              }
            });
            if (maxDeviation >= 1e-4) {
              console.warn(
                `[Hero3D Dev Assertion]: Transform deviation detected (${maxDeviation.toFixed(6)}m > 1e-4m tolerance).`,
              );
            }
          }
        },
      });

      timelineRef.current = tl;

      // ─────────────────────────────────────────────────────────
      // 0.0 - 1.0s: Assembled hold
      // ─────────────────────────────────────────────────────────
      tl.to({}, { duration: HERO_3D_CYCLE_TIMING.assembledHold });

      // ─────────────────────────────────────────────────────────
      // 1.0 - 3.0s: Explode phase (seat, panels, fairing, cowl)
      // ─────────────────────────────────────────────────────────
      const seatCached = cachedTransforms.current.get("seat");
      const leftCached = cachedTransforms.current.get("body_panel_left");
      const rightCached = cachedTransforms.current.get("body_panel_right");
      const fairingCached = cachedTransforms.current.get("front_fairing");
      const cowlCached = cachedTransforms.current.get("rear_cowl");

      if (seat && seatCached) {
        tl.to(
          seat.position,
          {
            y: seatCached.position.y + 0.32,
            x: seatCached.position.x - 0.1,
            duration: 2.0,
            ease: "power2.inOut",
          },
          1.0,
        );
      }

      if (leftPanel && leftCached) {
        tl.to(
          leftPanel.position,
          {
            z: leftCached.position.z + 0.25,
            y: leftCached.position.y + 0.04,
            duration: 2.0,
            ease: "power2.inOut",
          },
          1.0,
        );
      }

      if (rightPanel && rightCached) {
        tl.to(
          rightPanel.position,
          {
            z: rightCached.position.z - 0.25,
            y: rightCached.position.y + 0.04,
            duration: 2.0,
            ease: "power2.inOut",
          },
          1.0,
        );
      }

      if (fairing && fairingCached) {
        tl.to(
          fairing.position,
          {
            x: fairingCached.position.x + 0.26,
            duration: 2.0,
            ease: "power2.inOut",
          },
          1.0,
        );
      }

      if (rearCowl && cowlCached) {
        tl.to(
          rearCowl.position,
          {
            x: cowlCached.position.x - 0.24,
            duration: 2.0,
            ease: "power2.inOut",
          },
          1.0,
        );
      }

      // ─────────────────────────────────────────────────────────
      // 2.0 - 3.2s: Body materials fade to ~25% opacity
      // ─────────────────────────────────────────────────────────
      tl.call(
        () => {
          setTransparent(leftPanel, true);
          setTransparent(rightPanel, true);
          setTransparent(fairing, true);
          setTransparent(rearCowl, true);
        },
        undefined,
        2.0,
      );

      const opacityTarget = { val: 1.0 };
      tl.to(
        opacityTarget,
        {
          val: HERO_3D_PANEL_FADE_OPACITY,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            setMaterialOpacity(leftPanel, opacityTarget.val);
            setMaterialOpacity(rightPanel, opacityTarget.val);
            setMaterialOpacity(fairing, opacityTarget.val);
            setMaterialOpacity(rearCowl, opacityTarget.val);
          },
        },
        2.0,
      );

      // ─────────────────────────────────────────────────────────
      // 2.4 - 3.4s: Battery, motor, controller slide out & cyan glow
      // ─────────────────────────────────────────────────────────
      const battCached = cachedTransforms.current.get("battery");
      const motorCached = cachedTransforms.current.get("motor");
      const ctrlCached = cachedTransforms.current.get("controller");

      if (battery && battCached) {
        tl.to(
          battery.position,
          {
            y: battCached.position.y + 0.14,
            z: battCached.position.z + 0.12,
            duration: 1.0,
            ease: "sine.inOut",
          },
          2.4,
        );
      }

      if (motor && motorCached) {
        tl.to(
          motor.position,
          {
            z: motorCached.position.z + 0.12,
            duration: 1.0,
            ease: "sine.inOut",
          },
          2.4,
        );
      }

      if (controller && ctrlCached) {
        tl.to(
          controller.position,
          {
            y: ctrlCached.position.y + 0.14,
            z: ctrlCached.position.z - 0.12,
            duration: 1.0,
            ease: "sine.inOut",
          },
          2.4,
        );
      }

      const emissivePulse = { intensity: 0.0 };
      tl.to(
        emissivePulse,
        {
          intensity: 0.6,
          duration: 1.0,
          ease: "sine.inOut",
          onUpdate: () => {
            setMaterialEmissive(battery, 0x00e5ff, emissivePulse.intensity);
            setMaterialEmissive(motor, 0x00e5ff, emissivePulse.intensity * 0.8);
            setMaterialEmissive(controller, 0x00e5ff, emissivePulse.intensity);
            setMaterialEmissive(wiring, 0x00e5ff, emissivePulse.intensity * 0.7);
          },
        },
        2.4,
      );

      // ─────────────────────────────────────────────────────────
      // 3.4 - 4.9s: Hold exploded view (1.5s)
      // ─────────────────────────────────────────────────────────
      tl.to({}, { duration: HERO_3D_CYCLE_TIMING.explodedHold }, 3.4);

      // ─────────────────────────────────────────────────────────
      // 4.9 - 7.4s: Return to exact cached transforms & properties
      // ─────────────────────────────────────────────────────────
      if (seat && seatCached) {
        tl.to(
          seat.position,
          {
            x: seatCached.position.x,
            y: seatCached.position.y,
            z: seatCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (leftPanel && leftCached) {
        tl.to(
          leftPanel.position,
          {
            x: leftCached.position.x,
            y: leftCached.position.y,
            z: leftCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (rightPanel && rightCached) {
        tl.to(
          rightPanel.position,
          {
            x: rightCached.position.x,
            y: rightCached.position.y,
            z: rightCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (fairing && fairingCached) {
        tl.to(
          fairing.position,
          {
            x: fairingCached.position.x,
            y: fairingCached.position.y,
            z: fairingCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (rearCowl && cowlCached) {
        tl.to(
          rearCowl.position,
          {
            x: cowlCached.position.x,
            y: cowlCached.position.y,
            z: cowlCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (battery && battCached) {
        tl.to(
          battery.position,
          {
            x: battCached.position.x,
            y: battCached.position.y,
            z: battCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (motor && motorCached) {
        tl.to(
          motor.position,
          {
            x: motorCached.position.x,
            y: motorCached.position.y,
            z: motorCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      if (controller && ctrlCached) {
        tl.to(
          controller.position,
          {
            x: ctrlCached.position.x,
            y: ctrlCached.position.y,
            z: ctrlCached.position.z,
            duration: 2.5,
            ease: "power2.inOut",
          },
          4.9,
        );
      }

      // Return opacities and emissive to original
      tl.to(
        opacityTarget,
        {
          val: 1.0,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            setMaterialOpacity(leftPanel, opacityTarget.val);
            setMaterialOpacity(rightPanel, opacityTarget.val);
            setMaterialOpacity(fairing, opacityTarget.val);
            setMaterialOpacity(rearCowl, opacityTarget.val);
          },
        },
        5.1,
      );

      tl.to(
        emissivePulse,
        {
          intensity: 0.0,
          duration: 2.0,
          ease: "sine.inOut",
          onUpdate: () => {
            setMaterialEmissive(battery, 0x00e5ff, emissivePulse.intensity);
            setMaterialEmissive(motor, 0x00e5ff, emissivePulse.intensity);
            setMaterialEmissive(controller, 0x00e5ff, emissivePulse.intensity);
            setMaterialEmissive(wiring, 0x00e5ff, emissivePulse.intensity);
          },
          onComplete: () => {
            setTransparent(leftPanel, false);
            setTransparent(rightPanel, false);
            setTransparent(fairing, false);
            setTransparent(rearCowl, false);
          },
        },
        5.1,
      );
    });

    return () => ctx.revert();
  }, [cacheAndValidateNodes, onReady, isVisible, reducedMotion]);

  // Pause / Resume GSAP timeline depending on visibility
  useEffect(() => {
    if (!timelineRef.current) return;
    if (isVisible && !reducedMotion) {
      timelineRef.current.play();
    } else {
      timelineRef.current.pause();
    }
  }, [isVisible, reducedMotion]);

  // Dev-only GLTF template exporter (?exportScooter=1 or window.__exportScooterGLB())
  useEffect(() => {
    if (!import.meta.env.DEV || !rootRef.current) return;

    const exportTemplate = async () => {
      try {
        const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
        const exporter = new GLTFExporter();
        if (!rootRef.current) return;

        exporter.parse(
          rootRef.current,
          (gltf) => {
            const blob = new Blob([gltf as ArrayBuffer], { type: "model/gltf-binary" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "scooter-template.glb";
            a.click();
            URL.revokeObjectURL(url);
            console.info("[Hero3D]: Exported scooter-template.glb successfully!");
          },
          (err) => console.error("[Hero3D]: GLTF export failed", err),
          { binary: true },
        );
      } catch (err) {
        console.error("[Hero3D]: Failed to load GLTFExporter", err);
      }
    };

    (window as unknown as { __exportScooterGLB?: () => Promise<void> }).__exportScooterGLB =
      exportTemplate;

    if (new URLSearchParams(window.location.search).get("exportScooter") === "1") {
      void exportTemplate();
    }
  }, []);

  // Gentle Idle Camera / Scene Orbit (±8° azimuth, ±3° elevation)
  useFrame((state) => {
    if (!orbitGroupRef.current || reducedMotion || !isVisible) return;
    const t = state.clock.getElapsedTime();
    const azimuth =
      Math.sin(t * HERO_3D_ORBIT_AMPLITUDE.speed) * HERO_3D_ORBIT_AMPLITUDE.azimuthMaxRad;
    const elevation =
      Math.sin(t * (HERO_3D_ORBIT_AMPLITUDE.speed * 0.75)) *
      HERO_3D_ORBIT_AMPLITUDE.elevationMaxRad;

    orbitGroupRef.current.rotation.y = azimuth;
    orbitGroupRef.current.rotation.x = elevation;
  });

  return (
    <group ref={orbitGroupRef}>
      <group ref={rootRef}>
        <ScooterModel />
      </group>
    </group>
  );
}

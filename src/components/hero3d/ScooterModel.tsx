import React, { useState, useEffect, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { REQUIRED_SCOOTER_NODES } from "./constants";
import { ProceduralScooter } from "./ProceduralScooter";

const GLB_PATH = "/models/scooter.glb";

interface ScooterModelProps {
  onModelTypeResolved?: (type: "procedural" | "glb") => void;
}

/**
 * Checks quietly for /models/scooter.glb. If available and valid, renders GLB.
 * Otherwise, renders the procedural Ather-450X-inspired scooter.
 */
export function ScooterModel({ onModelTypeResolved }: ScooterModelProps) {
  const [glbStatus, setGlbStatus] = useState<"checking" | "available" | "unavailable">("checking");

  useEffect(() => {
    let active = true;

    async function probeGLB() {
      try {
        const response = await fetch(GLB_PATH, { method: "HEAD" });
        if (active) {
          if (response.ok) {
            setGlbStatus("available");
            onModelTypeResolved?.("glb");
          } else {
            setGlbStatus("unavailable");
            onModelTypeResolved?.("procedural");
          }
        }
      } catch {
        if (active) {
          setGlbStatus("unavailable");
          onModelTypeResolved?.("procedural");
        }
      }
    }

    probeGLB();

    return () => {
      active = false;
    };
  }, [onModelTypeResolved]);

  if (glbStatus === "available") {
    return (
      <Suspense fallback={<ProceduralScooter />}>
        <GLBLoader onFallback={() => setGlbStatus("unavailable")} />
      </Suspense>
    );
  }

  return <ProceduralScooter />;
}

function GLBLoader({ onFallback }: { onFallback: () => void }) {
  const { scene } = useGLTF(GLB_PATH);

  // Validate required 12 nodes
  const isValid = React.useMemo(() => {
    if (!scene) return false;
    const tableData: Record<string, { status: string }> = {};
    let allFound = true;

    REQUIRED_SCOOTER_NODES.forEach((nodeName) => {
      const obj = scene.getObjectByName(nodeName);
      if (obj) {
        tableData[nodeName] = { status: "FOUND" };
      } else {
        tableData[nodeName] = { status: "MISSING" };
        allFound = false;
      }
    });

    if (!allFound) {
      if (import.meta.env.DEV) {
        console.warn(
          "[Hero3D]: GLB model missing required animation nodes. Falling back to procedural.",
        );
        console.table(tableData);
      }
      onFallback();
      return false;
    }

    return true;
  }, [scene, onFallback]);

  if (!isValid || !scene) {
    return <ProceduralScooter />;
  }

  return <primitive object={scene} />;
}

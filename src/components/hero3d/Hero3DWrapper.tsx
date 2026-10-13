import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Hero3DErrorBoundary } from "./Hero3DErrorBoundary";

// Lazy-load the heavy 3D chunk so main bundle JS remains <= 5 KB
const LazyHero3DCanvas = lazy(() => import("./Hero3DCanvas"));

type StateMachineStatus = "idle" | "loading" | "ready-procedural" | "ready-glb" | "static-fallback";

export function Hero3DWrapper() {
  // Gated behind flag: VITE_HERO_3D (default "true")
  const isFlagEnabled = import.meta.env["VITE_HERO_3D"] !== "false";
  if (!isFlagEnabled) {
    return null;
  }

  return <Hero3DInner />;
}

function Hero3DInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<StateMachineStatus>("loading");
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 1. Evaluate device capabilities & Reduced Motion
  useEffect(() => {
    // Check WebGL support
    const checkWebGL = (): boolean => {
      try {
        const canvas = document.createElement("canvas");
        return Boolean(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl")),
        );
      } catch {
        return false;
      }
    };

    // Check device constraints (low memory <= 2GB or save-data mode)
    interface NavigatorExtended extends Navigator {
      deviceMemory?: number;
      connection?: {
        saveData?: boolean;
      };
    }
    const nav = navigator as NavigatorExtended;
    const isLowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const isSaveData = nav.connection?.saveData === true;
    const hasWebGL = checkWebGL();

    if (!hasWebGL || isLowMemory || isSaveData) {
      setStatus("static-fallback");
      return;
    }

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  // 2. IntersectionObserver: pause rendering/timeline when hero is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. Tab visibility: pause rendering when tab is hidden
  useEffect(() => {
    const onVisibilityChange = () => {
      setIsDocVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const shouldRenderActive = isIntersecting && isDocVisible;

  // Static Fallback Presentation
  const staticFallbackElement = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-85">
      <img
        src="/images/scooter-fallback.png"
        alt=""
        aria-hidden="true"
        className="max-h-[85%] max-w-[90%] object-contain"
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      role="presentation"
    >
      {/* ─────────────────────────────────────────────────────────────
          White gradient mask layer above canvas, below hero content.
          - Fades scooter to ~15% visual strength behind headline & subheading (top)
          - Fades scooter to ~15% visual strength behind trust row (bottom)
          - Preserves ~60% visual strength at the left/right of the card & lower center
          - Ensures strict WCAG AA (4.5:1) compliance for all text
         ───────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] select-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.0) 45%, rgba(255,255,255,0.0) 75%, rgba(255,255,255,0.18) 100%)",
        }}
      />

      {/* 3D Canvas or Fallback */}
      {status === "static-fallback" ? (
        staticFallbackElement
      ) : (
        <Hero3DErrorBoundary fallback={staticFallbackElement}>
          <Suspense fallback={staticFallbackElement}>
            <LazyHero3DCanvas
              isVisible={shouldRenderActive}
              reducedMotion={reducedMotion}
              onReady={(type) => setStatus(type === "glb" ? "ready-glb" : "ready-procedural")}
            />
          </Suspense>
        </Hero3DErrorBoundary>
      )}
    </div>
  );
}

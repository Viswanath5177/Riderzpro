/**
 * HeroScrubPanel.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Autoplaying animated scooter video panel with watermark removal.
 * Plays the electric scooter assembled ⟷ exploded ⟷ battery-glow sequence.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const PANEL_OFFSET_Y = 0;
export const TILT_MAX_DEG = 8;
export const SPRING_DURATION_MS = 600;
export const STRIP_HEIGHT_DESKTOP = 120;
export const STRIP_HEIGHT_MOBILE = 96;
export const PANEL_BG = "#08090b";

import React, { useRef, useState, useEffect } from "react";

interface HeroScrubPanelProps {
  children?: React.ReactNode;
}

export function HeroScrubPanel({ children }: HeroScrubPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  // Auto-play video immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {
        // Fallback: play on first user interaction
        const onFirstTouch = () => {
          video.play().catch(() => {});
          window.removeEventListener("touchstart", onFirstTouch);
          window.removeEventListener("click", onFirstTouch);
        };
        window.addEventListener("touchstart", onFirstTouch, { once: true });
        window.addEventListener("click", onFirstTouch, { once: true });
      });
    }
  }, []);

  // ─── Drag Tilt ────────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, [data-no-drag]")) {
      return;
    }

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (videoWrapperRef.current) {
      videoWrapperRef.current.style.transition = "none";
    }

    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !videoWrapperRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deg = Math.max(-TILT_MAX_DEG, Math.min(TILT_MAX_DEG, deltaX * 0.08));

    videoWrapperRef.current.style.transform = `perspective(1200px) rotateY(${deg}deg)`;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (videoWrapperRef.current) {
      videoWrapperRef.current.style.transition = `transform ${SPRING_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      videoWrapperRef.current.style.transform = "perspective(1200px) rotateY(0deg)";
    }
  };

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      role="presentation"
      style={{
        backgroundColor: PANEL_BG,
        transform: `translateY(${PANEL_OFFSET_Y}px)`,
      }}
      className="relative mx-auto w-[min(1240px,94vw)] rounded-[24px] sm:rounded-3xl md:rounded-[32px] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] select-none pointer-events-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          Top Dark Strip (#08090b) with Trust Row
         ───────────────────────────────────────────────────────────── */}
      <div
        style={{ backgroundColor: PANEL_BG }}
        className="relative z-10 flex items-center justify-center h-[96px] md:h-[120px] px-4 sm:px-6 pointer-events-auto"
      >
        {children}

        {/* 40px blend gradient */}
        <div
          className="absolute inset-x-0 -bottom-10 h-10 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to bottom, ${PANEL_BG} 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Video Player with Watermark Removed (Cropped + Masked)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full aspect-[2/1] overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          ref={videoWrapperRef}
          className="relative w-full h-full will-change-transform overflow-hidden"
          style={{
            transform: "perspective(1200px) rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Animated Video playing in a continuous loop */}
          <video
            ref={videoRef}
            src="/videos/hero-scooter-scrub.mp4"
            poster="/images/hero-scooter-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="absolute inset-0 w-full h-full object-cover object-[center_80%] rounded-b-[24px] sm:rounded-b-3xl md:rounded-b-[32px]"
          />

          {/* Interaction hint chip */}
          {!hasInteracted && (
            <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[12px] font-medium text-white/70 backdrop-blur-md transition-opacity duration-500 pointer-events-none">
              <span>Drag to tilt · Electric Scooter Animation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroScrubPanel;

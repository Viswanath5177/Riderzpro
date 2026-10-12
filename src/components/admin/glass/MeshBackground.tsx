import React from "react";

export function MeshBackground({ isLight = true }: { isLight?: boolean }) {
  if (isLight) {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#F5F6F8] transition-colors duration-500">
        {/* Soft RiderzPro ambient light refractions matching landing page */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#E31E24]/[0.06] blur-3xl animate-mesh-1" />
        <div className="pointer-events-none absolute top-1/3 right-10 h-96 w-96 rounded-full bg-amber-500/[0.05] blur-3xl animate-mesh-2" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.04] blur-3xl animate-mesh-3" />

        {/* Faint Charge Lines like Landing Hero */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          {[20, 50, 75].map((top, i) => (
            <div
              key={top}
              className="absolute h-px w-full overflow-hidden"
              style={{ top: `${top}%` }}
            >
              <div
                className="charge-line h-px w-1/2"
                style={{ animationDelay: `${i * 1.2}s` }}
              />
            </div>
          ))}
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #111111 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
    );
  }

  // Dark mode fallback
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#0b0d12] transition-colors duration-500">
      <div
        className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full opacity-25 blur-[130px] animate-mesh-1"
        style={{ backgroundColor: "#e11d2a" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[650px] w-[650px] rounded-full opacity-20 blur-[140px] animate-mesh-2"
        style={{ backgroundColor: "#ff7a1a" }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[700px] w-[700px] rounded-full opacity-20 blur-[150px] animate-mesh-3"
        style={{ backgroundColor: "#6d4aff" }}
      />
    </div>
  );
}

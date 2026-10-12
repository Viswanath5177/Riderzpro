import { useEffect, useState } from "react";
import { Bike, Home, Store } from "lucide-react";

/** Stylised city map with an animated rider travelling through pickup points to the customer. */
export function LiveMap({
  stops = 2,
  progress,
  className = "",
}: {
  stops?: number;
  progress?: number;
  className?: string;
}) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (progress !== undefined) return;
    const i = setInterval(() => setT((x) => (x + 0.004) % 1), 50);
    return () => clearInterval(i);
  }, [progress]);
  const p = progress ?? t;

  const pickups = [
    { x: 70, y: 260 },
    { x: 180, y: 90 },
    { x: 300, y: 200 },
  ].slice(0, Math.max(1, Math.min(3, stops)));
  const pts = [{ x: 30, y: 330 }, ...pickups, { x: 420, y: 60 }];
  const segs = pts
    .slice(1)
    .map((b, i) => ({ a: pts[i], b, len: Math.hypot(b.x - pts[i].x, b.y - pts[i].y) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  let d = p * total;
  let pos = pts[0];
  for (const s of segs) {
    if (d <= s.len) {
      pos = { x: s.a.x + ((s.b.x - s.a.x) * d) / s.len, y: s.a.y + ((s.b.y - s.a.y) * d) / s.len };
      break;
    }
    d -= s.len;
    pos = s.b;
  }
  const path = pts.map((q, i) => `${i ? "L" : "M"}${q.x} ${q.y}`).join(" ");

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border bg-muted ${className}`}
    >
      <svg viewBox="0 0 460 380" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="460" height="380" fill="url(#grid)" />
        {[60, 140, 230, 310].map((y) => (
          <rect key={y} x="0" y={y} width="460" height="10" fill="var(--card)" opacity="0.8" />
        ))}
        {[100, 220, 350].map((x) => (
          <rect key={x} x={x} y="0" width="10" height="380" fill="var(--card)" opacity="0.8" />
        ))}
        <circle cx="380" cy="300" r="40" fill="var(--success)" opacity="0.12" />
        <path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="4"
          strokeDasharray="8 8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      {pickups.map((s, i) => (
        <Pin key={i} x={s.x} y={s.y}>
          <Store className="h-3.5 w-3.5" />
        </Pin>
      ))}
      <Pin x={420} y={60} home>
        <Home className="h-3.5 w-3.5" />
      </Pin>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
        style={{ left: `${(pos.x / 460) * 100}%`, top: `${(pos.y / 380) * 100}%` }}
      >
        <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
          <Bike className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function Pin({
  x,
  y,
  children,
  home,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(x / 460) * 100}%`, top: `${(y / 380) * 100}%` }}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-full border-2 border-background shadow-card ${home ? "bg-foreground text-background" : "bg-card text-foreground"}`}
      >
        {children}
      </span>
    </div>
  );
}

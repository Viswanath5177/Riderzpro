import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Bt as Bike, ct as House, g as Store } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LiveMap-Df7tahlg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Stylised city map with an animated rider travelling through pickup points to the customer. */
function LiveMap({ stops = 2, progress, className = "" }) {
	const [t, setT] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (progress !== void 0) return;
		const i = setInterval(() => setT((x) => (x + .004) % 1), 50);
		return () => clearInterval(i);
	}, [progress]);
	const p = progress ?? t;
	const pickups = [
		{
			x: 70,
			y: 260
		},
		{
			x: 180,
			y: 90
		},
		{
			x: 300,
			y: 200
		}
	].slice(0, Math.max(1, Math.min(3, stops)));
	const pts = [
		{
			x: 30,
			y: 330
		},
		...pickups,
		{
			x: 420,
			y: 60
		}
	];
	const segs = pts.slice(1).map((b, i) => ({
		a: pts[i],
		b,
		len: Math.hypot(b.x - pts[i].x, b.y - pts[i].y)
	}));
	let d = p * segs.reduce((s, x) => s + x.len, 0);
	let pos = pts[0];
	for (const s of segs) {
		if (d <= s.len) {
			pos = {
				x: s.a.x + (s.b.x - s.a.x) * d / s.len,
				y: s.a.y + (s.b.y - s.a.y) * d / s.len
			};
			break;
		}
		d -= s.len;
		pos = s.b;
	}
	const path = pts.map((q, i) => `${i ? "L" : "M"}${q.x} ${q.y}`).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative overflow-hidden rounded-3xl border border-border bg-muted ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 460 380",
				className: "h-full w-full",
				preserveAspectRatio: "xMidYMid slice",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
						id: "grid",
						width: "40",
						height: "40",
						patternUnits: "userSpaceOnUse",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M40 0H0V40",
							fill: "none",
							stroke: "var(--border)",
							strokeWidth: "1"
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "460",
						height: "380",
						fill: "url(#grid)"
					}),
					[
						60,
						140,
						230,
						310
					].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "0",
						y,
						width: "460",
						height: "10",
						fill: "var(--card)",
						opacity: "0.8"
					}, y)),
					[
						100,
						220,
						350
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x,
						y: "0",
						width: "10",
						height: "380",
						fill: "var(--card)",
						opacity: "0.8"
					}, x)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "380",
						cy: "300",
						r: "40",
						fill: "var(--success)",
						opacity: "0.12"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: path,
						fill: "none",
						stroke: "var(--primary)",
						strokeWidth: "4",
						strokeDasharray: "8 8",
						strokeLinecap: "round",
						opacity: "0.5"
					})
				]
			}),
			pickups.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
				x: s.x,
				y: s.y,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" })
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
				x: 420,
				y: 60,
				home: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100",
				style: {
					left: `${pos.x / 460 * 100}%`,
					top: `${pos.y / 380 * 100}%`
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full bg-primary animate-pulse-ring" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "relative grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4" })
				})]
			})
		]
	});
}
function Pin({ x, y, children, home }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute -translate-x-1/2 -translate-y-1/2",
		style: {
			left: `${x / 460 * 100}%`,
			top: `${y / 380 * 100}%`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `grid h-8 w-8 place-items-center rounded-full border-2 border-background shadow-card ${home ? "bg-foreground text-background" : "bg-card text-foreground"}`,
			children
		})
	});
}
//#endregion
export { LiveMap as t };

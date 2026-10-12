import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Charts-Eozq3JuC.js
var import_jsx_runtime = require_jsx_runtime();
var tip = { contentStyle: {
	background: "var(--popover)",
	border: "1px solid var(--border)",
	borderRadius: 12,
	color: "var(--popover-foreground)"
} };
function AreaTrend({ data, k = "value" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: 240,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			margin: {
				left: -20,
				right: 8,
				top: 8
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "ga",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--chart-1)",
						stopOpacity: .5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--chart-1)",
						stopOpacity: 0
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "var(--border)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "name",
					stroke: "var(--muted-foreground)",
					fontSize: 12,
					tickLine: false,
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "var(--muted-foreground)",
					fontSize: 12,
					tickLine: false,
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tip }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: k,
					stroke: "var(--chart-1)",
					strokeWidth: 2.5,
					fill: "url(#ga)"
				})
			]
		})
	});
}
function Bars({ data, k = "value" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: 240,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			margin: {
				left: -20,
				right: 8,
				top: 8
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "var(--border)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "name",
					stroke: "var(--muted-foreground)",
					fontSize: 12,
					tickLine: false,
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					stroke: "var(--muted-foreground)",
					fontSize: 12,
					tickLine: false,
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					...tip,
					cursor: { fill: "var(--muted)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: k,
					fill: "var(--chart-1)",
					radius: [
						8,
						8,
						0,
						0
					]
				})
			]
		})
	});
}
var week = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
var series = (vals) => vals.map((value, i) => ({
	name: week[i % 7],
	value
}));
//#endregion
export { Bars as n, series as r, AreaTrend as t };

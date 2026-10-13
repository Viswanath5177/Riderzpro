import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { at as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as SiteLayout } from "./SiteLayout-tHh2v6uI.mjs";
import { r as ROLE_LINKS } from "./DashboardShell-DbLNxBtd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboards-DDjzAP8P.js
var import_jsx_runtime = require_jsx_runtime();
var desc = {
	Customer: "Garage, live deliveries, orders and technician bookings.",
	Vendor: "Revenue, incoming orders, inventory and payouts.",
	Rider: "Nearby jobs, multi-pickup routes and earnings."
};
function RolePicker() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: ROLE_LINKS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: r.to,
			className: "group rounded-3xl border border-border/80 bg-card/85 p-6 shadow-card backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xs transition group-hover:bg-primary group-hover:text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.Icon, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-2xl font-bold tracking-tight text-foreground",
					children: r.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground leading-relaxed",
					children: desc[r.label]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex items-center gap-1 text-sm font-semibold text-primary",
					children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-1" })]
				})
			]
		}, r.to))
	});
}
function Dashboards() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-12 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
				children: "Workspaces"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-8 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight",
				children: "Choose a dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RolePicker, {})
		]
	}) });
}
//#endregion
export { RolePicker, Dashboards as component };

import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { V as Package, tn as ArrowRight } from "../_libs/lucide-react.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ORDER_STEPS, w as useStore, y as inr } from "./bits-6XfYm-PF.mjs";
import { t as SiteLayout } from "./SiteLayout-CGSp9TSN.mjs";
import { t as ProtectedRoute } from "./ProtectedRoute-Gkr3f-cO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BkSQ4lyi.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {}) });
}
function Orders() {
	const { orders } = useStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-5xl md:text-7xl",
			children: "My orders"
		}), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 rounded-3xl border border-dashed border-border p-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-12 w-12 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-3xl",
					children: "No orders yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground",
					children: "Start shopping"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-3",
			children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/track/$id",
				params: { id: o.id },
				className: "flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold",
							children: [
								o.id,
								" · ",
								o.groups.length,
								" sellers"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: new Date(o.createdAt).toLocaleString("en-IN")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: inr(o.total)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-xs font-semibold ${o.status === 5 ? "text-success" : "text-primary"}`,
							children: ORDER_STEPS[o.status]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground" })
				]
			}, o.id))
		})]
	}) });
}
//#endregion
export { OrdersRoute as component };

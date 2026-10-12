import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as House, N as Mic, O as Package, _ as ShoppingCart, m as Sparkles, o as User, v as ShoppingBag } from "../_libs/lucide-react.mjs";
import { D as useStore, r as Logo } from "./bits-PIC53EAH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteLayout-tHh2v6uI.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/shop",
		label: "Shop"
	},
	{
		to: "/garage",
		label: "My Garage"
	},
	{
		to: "/orders",
		label: "Orders"
	},
	{
		to: "/dashboards",
		label: "Dashboards"
	}
];
function SiteLayout({ children }) {
	const { cart } = useStore();
	const count = cart.reduce((s, c) => s + c.qty, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-20 md:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-2xl shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-4 hidden items-center gap-1 md:flex lg:ml-6",
							children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								className: "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
								activeProps: { className: "!text-primary !bg-primary/10 font-semibold" },
								children: n.label
							}, n.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2 sm:gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/assistant",
									id: "navbar-ai-assistant-btn",
									className: "group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-xs transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow active:scale-95",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-primary-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Assistant" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cart",
									id: "navbar-cart-btn",
									"aria-label": "Cart",
									className: "relative grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-card/80 backdrop-blur-xl transition hover:border-primary/50 hover:bg-card hover:text-primary active:scale-95 sm:h-10 sm:w-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm",
										children: count
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:brightness-105 active:scale-95 sm:inline-flex",
									children: "Sign in"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, { count })
		]
	});
}
function MobileTabBar({ count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-around rounded-full border border-white/20 dark:border-white/10 bg-card/80 px-2 py-2 shadow-2xl backdrop-blur-2xl md:hidden",
		children: [
			{
				to: "/",
				label: "Home",
				Icon: House
			},
			{
				to: "/shop",
				label: "Shop",
				Icon: ShoppingBag
			},
			{
				to: "/assistant",
				label: "Ask AI",
				Icon: Mic,
				center: true
			},
			{
				to: "/orders",
				label: "Orders",
				Icon: Package
			},
			{
				to: "/dashboards",
				label: "Me",
				Icon: User
			}
		].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: t.to,
			activeOptions: { exact: t.to === "/" },
			className: "flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground transition hover:text-foreground",
			activeProps: { className: "!text-primary" },
			children: ["center" in t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "-mt-6 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-95 transition",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.Icon, { className: "h-5 w-5" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.Icon, { className: "h-5 w-5" }), t.to === "/orders" && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" })]
			}), t.label]
		}, t.to))
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-28 border-t border-border/70 bg-card/30 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed",
						children: "The marketplace for EV batteries and parts that actually fit. Compare sellers, order once, track every rider live."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 font-semibold text-foreground",
						children: "Marketplace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2.5 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "hover:text-primary transition-colors",
								children: "Batteries & parts"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/garage",
								className: "hover:text-primary transition-colors",
								children: "VIN lookup"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/assistant",
								className: "hover:text-primary transition-colors",
								children: "Voice assistant"
							}) })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 font-semibold text-foreground",
						children: "Partners"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2.5 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/vendor",
							className: "hover:text-primary transition-colors",
							children: "Sell on Riderzpro"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/rider",
							className: "hover:text-primary transition-colors",
							children: "Ride with us"
						}) })]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "border-t border-border/70 py-6 text-center text-xs text-muted-foreground",
			children: "© 2026 Riderzpro · Designed for India's EV riders"
		})]
	});
}
//#endregion
export { SiteLayout as t };

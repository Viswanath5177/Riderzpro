import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Store, et as Bike, m as Sparkles, ot as ArrowLeft, s as Truck } from "../_libs/lucide-react.mjs";
import { p as cn, r as Logo } from "./bits-PIC53EAH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell-DbLNxBtd.js
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LINKS = [
	{
		to: "/dashboard/customer",
		label: "Customer",
		Icon: Bike
	},
	{
		to: "/dashboard/vendor",
		label: "Vendor",
		Icon: Store
	},
	{
		to: "/dashboard/rider",
		label: "Rider",
		Icon: Truck
	}
];
function DashboardShell({ title, subtitle, sections, active, onSelect, children, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24 md:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 space-y-1",
						children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onSelect(s.id),
							className: cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active === s.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.Icon, { className: "h-4 w-4" }),
								" ",
								s.label
							]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto pt-4 border-t border-sidebar-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-primary transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Back to store"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-64",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border px-4 py-3 glass md:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-3xl leading-none",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: subtitle
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-2",
								children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/assistant",
									className: "group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-xs transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow active:scale-95",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-primary-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "AI Assistant"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm:hidden",
											children: "AI"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pt-4 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl leading-none",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: subtitle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "p-4 md:p-8",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-3 bottom-3 z-50 flex justify-around rounded-2xl border border-border px-1 py-2 shadow-card glass md:hidden",
				children: sections.slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onSelect(s.id),
					className: cn("flex flex-1 flex-col items-center gap-0.5 text-[10px] font-medium", active === s.id ? "text-primary" : "text-muted-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.Icon, { className: "h-5 w-5" }), s.label]
				}, s.id))
			})
		]
	});
}
function Stat({ label, value, delta, Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-4xl leading-none",
				children: value
			}),
			delta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs font-semibold text-success",
				children: delta
			})
		]
	});
}
function Panel({ title, children, className, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-3xl border border-border bg-card p-5 shadow-card", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: title
			}), action]
		}), children]
	});
}
function StatusPill({ s }) {
	const tone = /deliver|approved|paid|active|done|online/i.test(s) ? "bg-success/15 text-success" : /pending|new|review|waiting/i.test(s) ? "bg-warning/20 text-warning" : /reject|cancel|low|dispute/i.test(s) ? "bg-destructive/15 text-destructive" : "bg-accent text-accent-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-full px-2.5 py-1 text-xs font-semibold", tone),
		children: s
	});
}
//#endregion
export { StatusPill as a, Stat as i, Panel as n, ROLE_LINKS as r, DashboardShell as t };

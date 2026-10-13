import { i as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Menu, $t as Box, At as Command, Bt as ChevronRight, D as ShieldCheck, Et as ExternalLink, Ft as CircleCheck, Gt as ChartColumn, J as Moon, K as Package, M as Search, O as ShieldAlert, Ot as CreditCard, Vt as ChevronLeft, _ as Star, ct as LayoutDashboard, en as Bot, g as Store, gt as Headphones, h as Sun, i as Users, k as Settings, m as Tag, nn as Bell, nt as LogOut, r as Wrench, tn as Bike, un as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as useNavigate, _ as Outlet, p as useLocation, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAdminStore, t as AdminStoreProvider } from "./adminStore-CYTUJD7p.mjs";
import { n as AdminRouteGuard, r as useAdminAuth } from "./adminAuth-DGnzUy2F.mjs";
import { n as Logo } from "./bits-BhX7Ijve.mjs";
import { t as MeshBackground } from "./MeshBackground-C-fow3Vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DyrwkSPn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSidebar({ isCollapsed, onToggleCollapse, onItemClick }) {
	const { adminUser, logout } = useAdminAuth();
	const { sellers, products } = useAdminStore();
	const pathname = useLocation().pathname;
	const pendingSellersCount = sellers.filter((s) => s.kycStatus === "Pending").length;
	const pendingProductsCount = products.filter((p) => p.status === "Pending Review" || p.vendorProductRecord && p.vendorProductRecord.status === "pending_review").length;
	const navGroups = [
		{
			title: "Core Operations",
			items: [
				{
					title: "Dashboard",
					to: "/admin",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" })
				},
				{
					title: "Orders",
					to: "/admin/orders",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
					badge: "42"
				},
				{
					title: "Riders & Fleet",
					to: "/admin/riders",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4" }),
					badge: "142"
				},
				{
					title: "Sellers & KYC",
					to: "/admin/sellers",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }),
					badge: pendingSellersCount > 0 ? String(pendingSellersCount) : void 0
				},
				{
					title: "Customers",
					to: "/admin/customers",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
				}
			]
		},
		{
			title: "Catalog & Fitment",
			items: [
				{
					title: "Product Approvals",
					to: "/admin/approvals",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
					badge: pendingProductsCount > 0 ? String(pendingProductsCount) : void 0
				},
				{
					title: "Products & Stock",
					to: "/admin/products",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-4 w-4" })
				},
				{
					title: "Bikes & Fitment",
					to: "/admin/fitment",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" })
				}
			]
		},
		{
			title: "Finance & Growth",
			items: [
				{
					title: "Payments & Payouts",
					to: "/admin/payments",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
				},
				{
					title: "Offers & Coupons",
					to: "/admin/offers",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
				},
				{
					title: "Analytics & SLA",
					to: "/admin/analytics",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" })
				}
			]
		},
		{
			title: "Customer Quality",
			items: [
				{
					title: "Support Tickets",
					to: "/admin/support",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-4 w-4" }),
					badge: "3"
				},
				{
					title: "Review Moderation",
					to: "/admin/reviews",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" })
				},
				{
					title: "Warranty & Returns",
					to: "/admin/warranty",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
				}
			]
		},
		{
			title: "Platform Administration",
			items: [
				{
					title: "AI Assistant Logs",
					to: "/admin/ai-assistant",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
				},
				{
					title: "Notifications",
					to: "/admin/notifications",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
				},
				{
					title: "Team & Roles",
					to: "/admin/team",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" })
				},
				{
					title: "Settings",
					to: "/admin/settings",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
				}
			]
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("admin-glass-card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white/95 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c101a]/95", isCollapsed ? "w-20 p-3" : "w-64 p-4.5"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-white/10",
			children: [!isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md bg-red-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#E31E24] border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
					children: "ADMIN"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E31E24] font-display font-extrabold text-white text-base shadow-sm",
				children: "R"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onToggleCollapse,
				"aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar",
				className: "hidden lg:flex h-7 w-7 items-center justify-center rounded-xl bg-gray-100 text-[#4B5563] hover:bg-gray-200 hover:text-[#111111] transition cursor-pointer dark:bg-white/10 dark:text-zinc-400 dark:hover:bg-white/20 dark:hover:text-white",
				children: isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "mt-4 space-y-5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1",
			children: navGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [!isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-zinc-500",
					children: group.title
				}), group.items.map((item) => {
					const isActive = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: onItemClick,
						title: isCollapsed ? item.title : void 0,
						className: cn("relative flex items-center rounded-2xl px-3 py-2 text-xs font-semibold transition-all select-none group", isActive ? "text-white" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-100/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5", isCollapsed && "justify-center px-0"),
						children: [
							isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#ff474d] shadow-sm shadow-red-500/25 transition-all" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative z-10 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(isActive ? "text-white" : "text-[#6B7280] group-hover:text-[#111111] dark:text-zinc-400 dark:group-hover:text-white"),
									children: item.icon
								}), !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: item.title
								})]
							}),
							!isCollapsed && item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("relative z-10 ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold", isActive ? "bg-white/20 text-white" : "bg-red-50 text-[#E31E24] border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"),
								children: item.badge
							})
						]
					}, item.to);
				})]
			}, group.title))
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-3 border-t border-[#E5E7EB] dark:border-white/10",
			children: !isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-2xl bg-gray-50 p-2.5 border border-[#E5E7EB] dark:bg-white/[0.04] dark:border-white/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E31E24] font-bold text-white text-xs shadow-sm",
						children: "VM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-bold text-[#111111] dark:text-white",
							children: adminUser?.name || "Vikram Malhotra"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[10px] text-[#6B7280] dark:text-zinc-400",
							children: adminUser?.roleTitle || "Super Admin"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: logout,
					title: "Sign out from Admin Console",
					className: "rounded-xl p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-[#E31E24] transition cursor-pointer dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: logout,
				title: "Sign out",
				className: "flex h-10 w-full items-center justify-center rounded-2xl text-[#6B7280] hover:bg-red-50 hover:text-[#E31E24] transition cursor-pointer dark:text-zinc-400 dark:hover:bg-red-500/20 dark:hover:text-red-400",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
			})
		})]
	});
}
function AdminTopBar({ onOpenCommandPalette, onOpenMobileMenu }) {
	const { adminUser, logout } = useAdminAuth();
	const { theme, toggleTheme, notifications } = useAdminStore();
	const pathname = useLocation().pathname;
	const [showNotifications, setShowNotifications] = (0, import_react.useState)(false);
	const [showUserMenu, setShowUserMenu] = (0, import_react.useState)(false);
	const segments = pathname.split("/").filter(Boolean);
	const currentTitle = segments.length > 1 ? segments[1].replace(/-/g, " ") : "Dashboard";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "admin-glass-card sticky top-4 z-40 mb-6 flex h-16 items-center justify-between rounded-3xl border border-[#E5E7EB] bg-white/95 px-4 sm:px-6 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-[#0c101a]/95",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onOpenMobileMenu,
					"aria-label": "Open navigation menu",
					className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-[#4B5563] lg:hidden hover:bg-gray-200 hover:text-[#111111] transition cursor-pointer dark:bg-white/10 dark:text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Breadcrumb",
					className: "flex items-center gap-2 text-xs font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "text-[#6B7280] hover:text-[#E31E24] transition dark:text-zinc-400",
							children: "Admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-[#9CA3AF]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize text-[#111111] font-bold dark:text-white",
							children: currentTitle
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/90 px-3.5 py-1.5 text-xs font-semibold text-[#111111] shadow-2xs dark:border-white/10 dark:bg-white/5 dark:text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2 w-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative h-2 w-2 rounded-full bg-[#E31E24]" })]
					}), "128 riders delivering in Bengaluru now"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 sm:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onOpenCommandPalette,
						className: "hidden sm:flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-gray-50 px-3.5 py-2 text-xs text-[#6B7280] hover:border-gray-300 hover:bg-gray-100 hover:text-[#111111] transition shadow-2xs cursor-pointer dark:border-white/15 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-[#6B7280]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick search..." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-[#4B5563] font-mono dark:bg-white/10 dark:text-zinc-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-2.5 w-2.5" }), " K"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onOpenCommandPalette,
						"aria-label": "Search",
						className: "flex sm:hidden h-9 w-9 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-gray-50 text-[#6B7280] hover:text-[#111111]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: toggleTheme,
						title: theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme",
						className: "flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-gray-50 text-[#4B5563] hover:text-[#111111] hover:bg-gray-100 transition cursor-pointer dark:border-white/15 dark:bg-white/10 dark:text-zinc-300 dark:hover:text-white",
						children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4 text-amber-300" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-zinc-700" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowNotifications(!showNotifications),
							"aria-label": "Notifications",
							className: "relative flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-gray-50 text-[#4B5563] hover:text-[#111111] hover:bg-gray-100 transition cursor-pointer dark:border-white/15 dark:bg-white/10 dark:text-zinc-300 dark:hover:text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E31E24] px-1 text-[9px] font-bold text-white shadow-xs",
								children: "4"
							})]
						}), showNotifications && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-glass-card absolute right-0 top-12 z-50 w-80 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-xl backdrop-blur-3xl animate-in fade-in duration-150 dark:border-white/20 dark:bg-zinc-950/95",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-gray-100 pb-2 mb-3 dark:border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white",
										children: "System Alerts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#E31E24]",
										children: "4 Unread"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 text-xs",
									children: notifications.slice(0, 3).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5 dark:border-white/10 dark:bg-white/[0.04]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111] truncate dark:text-white",
											children: n.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-[#6B7280] line-clamp-2 dark:text-zinc-400",
											children: n.body
										})]
									}, n.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 pt-2 border-t border-gray-100 text-center dark:border-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/notifications",
										onClick: () => setShowNotifications(false),
										className: "text-xs font-semibold text-[#E31E24] hover:underline",
										children: "View all alerts →"
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowUserMenu(!showUserMenu),
							"aria-label": "User menu",
							className: "flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-gray-50 p-1 pr-2.5 hover:border-gray-300 transition cursor-pointer dark:border-white/15 dark:bg-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-xl bg-[#E31E24] text-xs font-bold text-white shadow-xs",
								children: "VM"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline text-xs font-bold text-[#111111] dark:text-white",
								children: "Vikram"
							})]
						}), showUserMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-glass-card absolute right-0 top-12 z-50 w-56 rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-xl backdrop-blur-3xl animate-in fade-in duration-150 text-xs dark:border-white/20 dark:bg-zinc-950/95",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 border-b border-gray-100 dark:border-white/10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111] dark:text-white",
											children: adminUser?.name || "Vikram Malhotra"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-[#6B7280] dark:text-zinc-400",
											children: adminUser?.email || "admin@riderzpro.com"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1.5 inline-block rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-[#E31E24]",
											children: "Super Admin"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/settings",
										onClick: () => setShowUserMenu(false),
										className: "flex items-center gap-2 rounded-xl px-3 py-2 text-[#4B5563] hover:bg-gray-100 hover:text-[#111111] transition dark:text-zinc-300 dark:hover:bg-white/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Console Settings" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/",
										className: "flex items-center justify-between rounded-xl px-3 py-2 text-[#4B5563] hover:bg-gray-100 hover:text-[#111111] transition dark:text-zinc-300 dark:hover:bg-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Store" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-1 border-t border-gray-100 dark:border-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setShowUserMenu(false);
											logout();
										},
										className: "flex w-full items-center gap-2 rounded-xl px-3 py-2 font-semibold text-[#E31E24] hover:bg-red-50 transition cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })
									})
								})
							]
						})]
					})
				]
			})
		]
	});
}
var COMMANDS = [
	{
		id: "nav-dash",
		title: "Executive Dashboard",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }),
		to: "/admin"
	},
	{
		id: "nav-orders",
		title: "Live Orders & Fulfillment",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
		to: "/admin/orders",
		badge: "42 Active"
	},
	{
		id: "nav-customers",
		title: "Customers & EV Garages",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
		to: "/admin/customers"
	},
	{
		id: "nav-sellers",
		title: "Sellers & KYC Approval",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }),
		to: "/admin/sellers",
		badge: "2 Pending"
	},
	{
		id: "nav-riders",
		title: "Delivery Fleet & Live GPS",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4" }),
		to: "/admin/riders",
		badge: "142 Live"
	},
	{
		id: "nav-products",
		title: "Products & Parts Inventory",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-4 w-4" }),
		to: "/admin/products"
	},
	{
		id: "nav-fitment",
		title: "Bikes & VIN Compatibility Matrix",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" }),
		to: "/admin/fitment"
	},
	{
		id: "nav-payments",
		title: "Payments, Payouts & Refunds",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }),
		to: "/admin/payments"
	},
	{
		id: "nav-offers",
		title: "Offers, Coupons & Banners",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" }),
		to: "/admin/offers"
	},
	{
		id: "nav-support",
		title: "Customer Support & Tickets",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-4 w-4" }),
		to: "/admin/support",
		badge: "3 New"
	},
	{
		id: "nav-reviews",
		title: "Review Moderation",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4" }),
		to: "/admin/reviews"
	},
	{
		id: "nav-warranty",
		title: "Warranty & Return Claims",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }),
		to: "/admin/warranty"
	},
	{
		id: "nav-analytics",
		title: "Analytics & SLA Reports",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
		to: "/admin/analytics"
	},
	{
		id: "nav-ai",
		title: "AI Assistant Telemetry Logs",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" }),
		to: "/admin/ai-assistant"
	},
	{
		id: "nav-notifs",
		title: "Broadcast Notifications",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }),
		to: "/admin/notifications"
	},
	{
		id: "nav-team",
		title: "Team & Role Permissions",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }),
		to: "/admin/team"
	},
	{
		id: "nav-settings",
		title: "Platform Settings & Delivery Fees",
		category: "Navigation",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" }),
		to: "/admin/settings"
	}
];
function CommandPalette({ isOpen, onClose }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	const navigate = useNavigate();
	const filtered = COMMANDS.filter((cmd) => cmd.title.toLowerCase().includes(query.toLowerCase()));
	(0, import_react.useEffect)(() => {
		setSelectedIndex(0);
	}, [query]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (!isOpen) return;
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) => prev < filtered.length - 1 ? prev + 1 : 0);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((prev) => prev > 0 ? prev - 1 : filtered.length - 1);
			} else if (e.key === "Enter") {
				e.preventDefault();
				if (filtered[selectedIndex]) {
					navigate({ to: filtered[selectedIndex].to });
					onClose();
				}
			} else if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isOpen,
		filtered,
		selectedIndex,
		navigate,
		onClose
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center pt-20 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			onClick: onClose,
			className: "fixed inset-0 bg-black/70 backdrop-blur-md"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .95,
				y: -20
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .95,
				y: -20
			},
			transition: {
				type: "spring",
				duration: .3,
				bounce: .1
			},
			className: "relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl text-[#111111]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-[#6B7280]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							autoFocus: true,
							placeholder: "Jump to section or search screens (e.g. Orders, Payouts, Fleet)...",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "w-full bg-transparent text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none font-medium"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#4B5563]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-3 w-3" }), " ESC"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-80 overflow-y-auto p-2",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-xs text-[#6B7280]",
						children: "No matching command or destination found."
					}) : filtered.map((item, idx) => {
						const isSelected = idx === selectedIndex;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								navigate({ to: item.to });
								onClose();
							},
							onMouseEnter: () => setSelectedIndex(idx),
							className: cn("flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-pointer transition select-none", isSelected ? "bg-red-50 text-[#E31E24] border border-[#E31E24]/30" : "text-[#374151] hover:bg-gray-50 border border-transparent"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex h-8 w-8 items-center justify-center rounded-xl", isSelected ? "bg-[#E31E24] text-white" : "bg-gray-100 text-[#4B5563]"),
									children: item.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#4B5563]",
									children: item.badge
								}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-[#E31E24]" })]
							})]
						}, item.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-[#E5E7EB] bg-gray-50 px-5 py-2.5 text-[11px] text-[#6B7280] font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Navigate" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "rounded border border-[#E5E7EB] bg-white px-1 py-0.5 text-[10px] font-bold text-[#374151]",
								children: "↑"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "rounded border border-[#E5E7EB] bg-white px-1 py-0.5 text-[10px] font-bold text-[#374151]",
								children: "↓"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "rounded border border-[#E5E7EB] bg-white px-1 py-0.5 text-[10px] font-bold text-[#374151]",
								children: "↵"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "17 Console Modules Available" })]
				})
			]
		})]
	}) });
}
function AdminLayout({ children }) {
	const { theme } = useAdminStore();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, import_react.useState)(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
	const [isCommandPaletteOpen, setIsCommandPaletteOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				setIsCommandPaletteOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative min-h-screen font-sans transition-colors duration-500", theme === "light" ? "theme-light-glass bg-[#f4f6fb] text-zinc-900" : "theme-dark-glass bg-[#0b0d12] text-white"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshBackground, { isLight: theme === "light" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex min-h-screen p-3 sm:p-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden lg:block shrink-0 sticky top-4 h-[calc(100vh-32px)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {
							isCollapsed: isSidebarCollapsed,
							onToggleCollapse: () => setIsSidebarCollapsed((prev) => !prev)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isMobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fixed inset-0 z-50 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							exit: { opacity: 0 },
							onClick: () => setIsMobileMenuOpen(false),
							className: "fixed inset-0 bg-black/60 backdrop-blur-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { x: "-100%" },
							animate: { x: 0 },
							exit: { x: "-100%" },
							transition: {
								type: "spring",
								damping: 25,
								stiffness: 220
							},
							className: "fixed inset-y-0 left-0 w-72 p-3 z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {
								isCollapsed: false,
								onToggleCollapse: () => setIsMobileMenuOpen(false),
								onItemClick: () => setIsMobileMenuOpen(false)
							})
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex flex-col min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTopBar, {
							onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
							onOpenMobileMenu: () => setIsMobileMenuOpen(true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							className: "flex-1 pb-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									opacity: 0,
									y: 12
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { duration: .3 },
								children
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
				isOpen: isCommandPaletteOpen,
				onClose: () => setIsCommandPaletteOpen(false)
			})
		]
	});
}
function AdminRouteWrapper() {
	if (useLocation().pathname.startsWith("/admin/login")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminRouteGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStoreProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) });
}
//#endregion
export { AdminRouteWrapper as component };

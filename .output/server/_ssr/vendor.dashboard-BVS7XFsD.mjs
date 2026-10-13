import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as Menu, B as Plus, Bt as ChevronRight, D as ShieldCheck, Dt as Download, Et as ExternalLink, Ft as CircleCheck, Gt as ChartColumn, H as Percent, K as Package, Lt as CircleAlert, M as Search, Nt as CircleX, O as ShieldAlert, Ot as CreditCard, P as Save, Pt as CircleQuestionMark, Qt as Boxes, St as FileSpreadsheet, U as Pen, Yt as Building, Z as MessageSquare, _ as Star, b as Sparkles, bt as Flag, c as Upload, ct as LayoutDashboard, d as TrendingUp, dn as ArrowLeft, et as MapPin, f as TreePalm, fn as Archive, ft as IndianRupee, g as Store, gt as Headphones, j as Send, jt as Clock, k as Settings, kt as Copy, lt as Layers, m as Tag, n as X, nn as Bell, nt as LogOut, p as Trash2, pt as Image$1, qt as Camera, rt as Lock, st as LayoutGrid, t as Zap, tn as Bike, u as TriangleAlert, un as ArrowRight, w as ShoppingCart, wt as Eye, xt as FileText, z as Printer } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as YAxis, f as Cell, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useVendorStore } from "./vendorStore-jyyPc83P.mjs";
import { _ as inr, a as bikes, b as riders, r as GST_RATE, y as products } from "./data-C7OlInRR.mjs";
import { n as Logo, r as ORDER_STEPS, s as useStore } from "./bits-BhX7Ijve.mjs";
import { i as useVendorAuth, n as VendorRouteGuard } from "./vendorAuth-DcYgxaTS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendor.dashboard-BVS7XFsD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VendorDashboardShell({ vendor, activeSection, onSelectSection, children }) {
	const { logout } = useVendorAuth();
	const { notifications, products } = useVendorStore();
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const unreadNotificationsCount = notifications.filter((n) => n.vendorId === vendor.id && !n.read).length;
	const lowStockCount = products.filter((p) => p.vendorId === vendor.id && p.stock <= (p.minStockAlert || 5) && p.status === "live").length;
	const SECTIONS = [
		{
			id: "overview",
			label: "Overview",
			icon: LayoutDashboard
		},
		{
			id: "orders",
			label: "Orders",
			icon: Package,
			badge: 2
		},
		{
			id: "products",
			label: "Products",
			icon: Layers
		},
		{
			id: "inventory",
			label: "Inventory",
			icon: Boxes,
			badge: lowStockCount > 0 ? lowStockCount : void 0
		},
		{
			id: "pricing",
			label: "Pricing & Offers",
			icon: Percent
		},
		{
			id: "payments",
			label: "Payments",
			icon: CreditCard
		},
		{
			id: "returns",
			label: "Returns & Warranty",
			icon: ShieldAlert
		},
		{
			id: "reviews",
			label: "Reviews",
			icon: Star
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: ChartColumn
		},
		{
			id: "settings",
			label: "Store Settings",
			icon: Settings
		},
		{
			id: "notifications",
			label: "Notifications",
			icon: Bell,
			badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : void 0
		},
		{
			id: "support",
			label: "Help & Support",
			icon: Headphones
		}
	];
	const currentSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F5F6F8] pb-24 md:pb-0 font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#E5E7EB] bg-white p-4.5 md:flex shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between pb-3 border-b border-gray-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-red-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-[#E31E24] border border-red-200",
								children: "VENDOR"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-3.5 flex items-center gap-2.5 rounded-2xl bg-gray-50 p-2.5 border border-gray-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#E31E24] font-bold text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4.5 w-4.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-bold text-[#111111]",
									children: vendor.storeName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-blue-500 shrink-0" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[10px] text-gray-500 font-medium",
								children: vendor.area || "Indiranagar, Bengaluru"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1",
						children: SECTIONS.map((s) => {
							const isActive = activeSection === s.id;
							const Icon = s.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									onSelectSection(s.id);
									setMobileMenuOpen(false);
								},
								className: `flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer select-none ${isActive ? "bg-[#E31E24] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label })]
								}), s.badge !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.2 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-red-50 text-[#E31E24] border border-red-200"}`,
									children: s.badge
								})]
							}, s.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto pt-3 border-t border-gray-100 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/store/$slug",
								params: { slug: vendor.storeSlug || vendor.id },
								target: "_blank",
								className: "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-gray-400" }), "View My Live Store"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-gray-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#E31E24] hover:bg-red-50 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Back to Marketplace"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: logout,
								className: "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5 text-rose-500" }), "Sign Out"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-64",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3 bg-white md:px-8 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMobileMenuOpen(!mobileMenuOpen),
									className: "p-1.5 rounded-xl border border-gray-200 text-gray-600 md:hidden",
									children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-7" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden md:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display font-bold text-xl text-[#111111] leading-none",
										children: currentSection.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-gray-500 mt-0.5",
										children: [vendor.storeName, " · Vendor Dashboard"]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/store/$slug",
									params: { slug: vendor.storeSlug || vendor.id },
									target: "_blank",
									className: "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-bold text-gray-700 shadow-2xs transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-gray-400" }), "Storefront"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onSelectSection("notifications"),
									className: "relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer",
									title: "Notifications",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unreadNotificationsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E31E24] text-white text-[9px] font-bold flex items-center justify-center",
										children: unreadNotificationsCount
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: logout,
									title: "Sign out from vendor dashboard",
									className: "p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-[#E31E24] transition cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
								})
							]
						})]
					}),
					mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fixed inset-0 z-50 bg-black/60 md:hidden backdrop-blur-xs flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-80 max-w-[85vw] bg-white h-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-3 border-b border-gray-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-red-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-[#E31E24] border border-red-200",
												children: "VENDOR"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setMobileMenuOpen(false),
											className: "p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 rounded-2xl bg-gray-50 p-2.5 border border-gray-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#E31E24] font-bold text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4.5 w-4.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs font-bold text-gray-900",
												children: vendor.storeName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-gray-500 font-medium",
												children: [
													"Status:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `font-bold ${vendor.status === "approved" ? "text-emerald-600" : "text-amber-600"}`,
														children: vendor.status === "approved" ? "KYC Approved" : "KYC Pending"
													})
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1",
										children: SECTIONS.map((s) => {
											const isActive = activeSection === s.id;
											const Icon = s.icon;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													onSelectSection(s.id);
													setMobileMenuOpen(false);
												},
												className: `flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${isActive ? "bg-[#E31E24] text-white shadow-xs" : "text-gray-700 hover:bg-gray-100"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label })]
												}), s.badge !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded-full px-2 py-0.2 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-red-50 text-[#E31E24] border border-red-200"}`,
													children: s.badge
												})]
											}, s.id);
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 mt-4 border-t border-gray-100 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/store/$slug",
										params: { slug: vendor.storeSlug || vendor.id },
										target: "_blank",
										className: "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-gray-400" }), "Live Storefront"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-gray-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/",
										className: "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Marketplace Home"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: logout,
										className: "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign Out"]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1",
							onClick: () => setMobileMenuOpen(false)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-3 py-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md px-1 py-2 shadow-card md:hidden",
				children: [SECTIONS.slice(0, 4).map((s) => {
					const isActive = activeSection === s.id;
					const Icon = s.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							onSelectSection(s.id);
							setMobileMenuOpen(false);
						},
						className: `flex flex-1 flex-col items-center gap-0.5 text-[10px] font-bold transition py-1 relative ${isActive ? "text-[#E31E24]" : "text-gray-500"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate max-w-[62px]",
								children: s.label
							}),
							s.badge !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 right-3 h-2 w-2 rounded-full bg-[#E31E24]" })
						]
					}, s.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setMobileMenuOpen(true),
					className: `flex flex-1 flex-col items-center gap-0.5 text-[10px] font-bold transition py-1 relative ${![
						"overview",
						"orders",
						"products",
						"inventory"
					].includes(activeSection) ? "text-[#E31E24]" : "text-gray-500"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4.5 w-4.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "More" }),
						unreadNotificationsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 right-3 h-2 w-2 rounded-full bg-[#E31E24]" })
					]
				})]
			})
		]
	});
}
var SALES_DATA = [
	{
		day: "Mon",
		sales: 42e3,
		orders: 4
	},
	{
		day: "Tue",
		sales: 68e3,
		orders: 7
	},
	{
		day: "Wed",
		sales: 51e3,
		orders: 5
	},
	{
		day: "Thu",
		sales: 94e3,
		orders: 11
	},
	{
		day: "Fri",
		sales: 112e3,
		orders: 13
	},
	{
		day: "Sat",
		sales: 145e3,
		orders: 18
	},
	{
		day: "Sun",
		sales: 128e3,
		orders: 15
	}
];
function OverviewSection({ vendor, products, orders, onNavigateTab }) {
	const vendorOrders = orders.filter((o) => o.groups.some((g) => g.vendorId === vendor.id));
	const pendingOrders = vendorOrders.filter((o) => o.status === 0 || o.status === 1);
	const lowStockProducts = products.filter((p) => p.stock <= (p.minStockAlert || 5) && p.status === "live");
	const pendingProductApprovals = products.filter((p) => p.status === "pending_review" || p.pendingRevision);
	const totalRevenue = vendorOrders.reduce((sum, o) => {
		return sum + (o.groups.find((g) => g.vendorId === vendor.id)?.subtotal || 0);
	}, 284e3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			(pendingOrders.length > 0 || lowStockProducts.length > 0 || pendingProductApprovals.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-orange-50 p-5 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-2xl bg-[#E31E24] text-white flex items-center justify-center shrink-0 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-bold text-sm text-gray-900",
							children: "Seller Action Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-600 mt-0.5",
							children: [
								pendingOrders.length > 0 && `${pendingOrders.length} orders waiting for acceptance · `,
								lowStockProducts.length > 0 && `${lowStockProducts.length} items running low on stock · `,
								pendingProductApprovals.length > 0 && `${pendingProductApprovals.length} products under review`
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [pendingOrders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigateTab("orders"),
							className: "rounded-xl bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer",
							children: "Accept Orders"
						}), lowStockProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigateTab("inventory"),
							className: "rounded-xl border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition cursor-pointer",
							children: "Restock"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Weekly Sales" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-red-50 text-[#E31E24] flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: inr(totalRevenue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+18.4% vs last week" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Orders to Accept" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: pendingOrders.length || 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-400 mt-1",
								children: "SLA: Accept within 15 mins"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Low Stock Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: lowStockProducts.length || 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-rose-600 font-semibold mt-1",
								children: "Auto-hides at 0 units"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Store Rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-1 mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl font-black text-gray-900",
									children: vendor.rating || 4.8
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-gray-400 font-semibold",
									children: "/ 5.0"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-600 font-semibold mt-1",
								children: "99.2% positive feedback"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-bold text-base text-gray-900",
							children: "Revenue & Sales Velocity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Gross order volume past 7 days"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700",
							children: "Live Hyperlocal Dispatch"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: SALES_DATA,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "vendorSalesGrad",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "#E31E24",
											stopOpacity: .25
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "#E31E24",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "#F3F4F6"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: {
											fontSize: 11,
											fill: "#9CA3AF"
										},
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 11,
											fill: "#9CA3AF"
										},
										axisLine: false,
										tickFormatter: (v) => `₹${v / 1e3}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Sales"],
										contentStyle: {
											borderRadius: "16px",
											border: "1px solid #E5E7EB",
											boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "sales",
										stroke: "#E31E24",
										strokeWidth: 2.5,
										fill: "url(#vendorSalesGrad)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-bold text-base text-gray-900",
							children: "Account Health"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Excellent"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500 font-medium",
									children: "Late Dispatch Rate:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-emerald-700",
									children: "0.8% (< 4% target)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-gray-100 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-emerald-500 h-full w-[20%]" })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500 font-medium",
									children: "Seller Cancellation:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-emerald-700",
									children: "0.2% (< 2.5% target)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-gray-100 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-emerald-500 h-full w-[10%]" })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500 font-medium",
									children: "Return Rate:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gray-700",
									children: "1.4% (< 5% target)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-gray-100 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-emerald-500 h-full w-[28%]" })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500 font-medium",
									children: "Customer Rating:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-emerald-700",
									children: "4.8 / 5.0"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-gray-100 h-1.5 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-emerald-500 h-full w-[96%]" })
							})] })
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-2xl bg-gray-50 p-3 border border-gray-100 text-[11px] text-gray-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-gray-900 block mb-0.5",
							children: "Gold Seller Status"
						}), "Your store meets all performance criteria for the top-tier 8% commission rate."]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display font-bold text-base text-gray-900",
						children: "Top Catalog Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-500",
						children: "Fastest selling SKUs by demand"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onNavigateTab("products"),
						className: "text-xs font-bold text-[#E31E24] hover:underline inline-flex items-center gap-1 cursor-pointer",
						children: ["Manage Catalog ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-gray-100",
					children: products.slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images?.[0] || "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80",
								alt: p.title,
								className: "h-10 w-10 rounded-xl object-cover border border-gray-200 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-xs text-gray-900 truncate",
									children: p.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-gray-400 font-mono",
									children: [
										"SKU: ",
										p.sku,
										" · ",
										p.category
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-xs text-gray-900",
								children: inr(p.sellingPrice)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `text-[11px] font-semibold ${p.stock > 5 ? "text-emerald-700" : "text-rose-600"}`,
								children: [p.stock, " units left"]
							})]
						})]
					}, p.id))
				})]
			})
		]
	});
}
function PrintPackingSlipModal({ isOpen, onClose, order, group, vendor }) {
	if (!isOpen) return null;
	const handlePrint = () => {
		window.print();
	};
	const invoiceNumber = `INV-${order.id.replace(/\D/g, "")}-${vendor.id.slice(-3)}`;
	const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	const taxAmount = Math.round(group.subtotal * GST_RATE);
	const totalAmount = group.subtotal + taxAmount + group.fee;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[96vh] w-full max-w-3xl flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 sm:h-5 sm:w-5 text-[#E31E24]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold text-xs sm:text-base text-gray-900 truncate",
							children: "Tax Invoice & Slip"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-gray-200 px-1.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold text-gray-700",
							children: order.id
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrint,
						className: "inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Print / Save PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "Print"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-xl p-1.5 sm:p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-y-auto p-4 sm:p-8 text-xs text-gray-800 print:p-0 font-sans",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-gray-300 pb-5 sm:pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8 sm:h-9" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-gray-500 font-medium",
								children: "RiderzPro Marketplace Hyperlocal Fulfilment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-gray-400 font-mono mt-0.5",
								children: "CIN: U50400KA2024PTC189201 · GSTIN: 29AABCU9821R1Z8"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left sm:text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block rounded-md bg-red-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#E31E24]",
									children: "TAX INVOICE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-mono font-bold text-sm text-gray-900",
									children: invoiceNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-gray-500 mt-0.5",
									children: ["Date: ", invoiceDate]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-gray-500 font-mono",
									children: ["Order: ", order.id]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-b border-gray-300 py-5 sm:py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-1",
								children: "Sold By (Seller)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-sm text-gray-900",
								children: vendor.storeName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-gray-600 mt-0.5",
								children: [vendor.onboarding?.shipping?.pickupAddress?.line1 || "Indiranagar Hub", vendor.onboarding?.shipping?.pickupAddress?.line2 && `, ${vendor.onboarding.shipping.pickupAddress.line2}`]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-gray-600",
								children: [
									vendor.onboarding?.shipping?.pickupAddress?.city || "Bengaluru",
									",",
									" ",
									vendor.onboarding?.shipping?.pickupAddress?.state || "Karnataka",
									" -",
									" ",
									vendor.onboarding?.shipping?.pickupAddress?.pincode || "560038"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[11px] text-gray-700",
								children: ["GSTIN: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: vendor.onboarding?.tax?.gstin || "27AAPFU0939F1ZV"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-gray-700",
								children: ["PAN: ", vendor.onboarding?.tax?.pan || "AAPFU0939F"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold uppercase tracking-wider text-gray-400 text-[10px] mb-1",
									children: "Ship To (Customer)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-sm text-gray-900",
									children: order.customerName || order.shippingAddress?.name || "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-600 mt-0.5",
									children: order.shippingAddress?.street || "MG Road, Indiranagar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-gray-600",
									children: [
										order.shippingAddress?.city || "Bengaluru",
										",",
										" ",
										order.shippingAddress?.pincode || "560001"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-gray-700",
									children: ["Contact: ", order.customerPhone || order.shippingAddress?.phone || "+91 98450 12345"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-gray-500",
									children: [
										"Fulfilment: Hyperlocal Delivery (",
										group.km,
										" km)"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left mt-6 border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b-2 border-gray-300 text-[11px] font-bold uppercase text-gray-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Item Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-center",
									children: "HSN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-center",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right",
									children: "Unit Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right",
									children: "Total"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-200",
							children: group.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-gray-900",
											children: "EV Replacement Component"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] font-mono text-gray-500",
											children: ["ID: ", item.productId]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 text-center font-mono",
										children: "85076000"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 text-center font-bold",
										children: item.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 text-right font-mono",
										children: inr(item.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 text-right font-mono font-bold",
										children: inr(item.price * item.qty)
									})
								]
							}, index))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex justify-end border-t border-gray-300 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-64 space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Subtotal:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: inr(group.subtotal)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Estimated GST (18%):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: inr(taxAmount)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-500",
										children: "Hyperlocal Delivery Fee:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: inr(group.fee)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t-2 border-gray-900 pt-2 text-sm font-extrabold text-gray-900",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Amount:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[#E31E24]",
										children: inr(totalAmount)
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 border-t border-dashed border-gray-300 pt-4 text-[10px] text-gray-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-gray-700",
								children: "Declaration & Li-ion Battery Compliance:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5",
								children: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Packaging meets UN38.3 handling norms for lithium-ion components."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Computer-generated invoice. No physical signature required." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-gray-800",
										children: vendor.storeName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] text-gray-400",
										children: "Authorized Signatory"
									})]
								})]
							})
						]
					})
				]
			})]
		})
	});
}
function OrdersSection({ vendor }) {
	const { orders, updateOrderStatus, cancelOrder } = useStore();
	const [activeTab, setActiveTab] = (0, import_react.useState)("ALL");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [printModalData, setPrintModalData] = (0, import_react.useState)(null);
	const [handoverOrder, setHandoverOrder] = (0, import_react.useState)(null);
	const [handoverOtp, setHandoverOtp] = (0, import_react.useState)("");
	const [rejectOrder, setRejectOrder] = (0, import_react.useState)(null);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("Stock discrepancy / Out of stock");
	const vendorOrders = orders.map((o) => {
		const group = o.groups.find((g) => g.vendorId === vendor.id);
		return group ? {
			order: o,
			group
		} : null;
	}).filter(Boolean);
	const filteredOrders = vendorOrders.filter(({ order }) => {
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			const matchesId = order.id.toLowerCase().includes(q);
			const matchesCustomer = (order.customerName || "").toLowerCase().includes(q);
			if (!matchesId && !matchesCustomer) return false;
		}
		if (activeTab === "NEW") return order.status === 0;
		if (activeTab === "ACCEPTED") return order.status === 1;
		if (activeTab === "PACKED") return order.status === 2;
		if (activeTab === "PICKED_UP") return order.status === 3 || order.status === 4;
		if (activeTab === "DELIVERED") return order.status === 5;
		if (activeTab === "CANCELLED") return order.fulfillmentStatus === "Cancelled";
		return true;
	});
	const countByTab = {
		ALL: vendorOrders.length,
		NEW: vendorOrders.filter((vo) => vo.order.status === 0).length,
		ACCEPTED: vendorOrders.filter((vo) => vo.order.status === 1).length,
		PACKED: vendorOrders.filter((vo) => vo.order.status === 2).length,
		PICKED_UP: vendorOrders.filter((vo) => vo.order.status === 3 || vo.order.status === 4).length,
		DELIVERED: vendorOrders.filter((vo) => vo.order.status === 5).length,
		CANCELLED: vendorOrders.filter((vo) => vo.order.fulfillmentStatus === "Cancelled").length
	};
	const handleAcceptOrder = (orderId) => {
		updateOrderStatus(orderId, 1);
		toast.success(`Order ${orderId} accepted! Please start packing.`);
	};
	const handleMarkPacked = (orderId) => {
		updateOrderStatus(orderId, 2);
		toast.success(`Order ${orderId} marked as Packed & ready for rider pickup!`);
	};
	const handleHandoverSubmit = () => {
		if (!handoverOrder) return;
		if (handoverOtp !== "4921" && handoverOtp !== "1234") {
			toast.error("Invalid Rider OTP. Please ask the rider for their 4-digit handover OTP.");
			return;
		}
		updateOrderStatus(handoverOrder.id, 3);
		toast.success(`Package handed over to rider! Status advanced to Picked up.`);
		setHandoverOrder(null);
		setHandoverOtp("");
	};
	const handleRejectSubmit = () => {
		if (!rejectOrder) return;
		cancelOrder(rejectOrder.id, rejectReason);
		toast.error(`Order ${rejectOrder.id} rejected.`);
		setRejectOrder(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-black text-xl text-gray-900",
					children: "Orders & Fulfilment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Accept incoming customer orders, print GST packing slips and hand over packages to RiderzPro riders."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "Search order ID, customer...",
						className: "w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:border-[#E31E24]"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200",
				children: [
					{
						id: "ALL",
						label: "All Orders"
					},
					{
						id: "NEW",
						label: "New (To Accept)"
					},
					{
						id: "ACCEPTED",
						label: "Accepted"
					},
					{
						id: "PACKED",
						label: "Packed"
					},
					{
						id: "PICKED_UP",
						label: "In Transit"
					},
					{
						id: "DELIVERED",
						label: "Delivered"
					},
					{
						id: "CANCELLED",
						label: "Cancelled"
					}
				].map((tab) => {
					const count = countByTab[tab.id];
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${isActive ? "bg-[#E31E24] text-white shadow-xs" : "text-gray-600 hover:text-black hover:bg-gray-100"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`,
							children: count
						})]
					}, tab.id);
				})
			}),
			filteredOrders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: filteredOrders.map(({ order, group }) => {
					const assignedRider = riders[0];
					const statusIndex = order.status;
					const currentStepLabel = ORDER_STEPS[statusIndex] || "Processing";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs hover:border-gray-300 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start sm:items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-2xl bg-red-50 text-[#E31E24] flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm text-gray-900",
											children: order.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200",
											children: currentStepLabel
										}),
										order.payment?.includes("COD") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700",
											children: "Cash on Delivery"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700",
											children: "Prepaid"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-gray-500 mt-0.5",
									children: [
										"Placed on ",
										new Date(order.createdAt).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											hour: "2-digit",
											minute: "2-digit"
										}),
										" · Customer: ",
										order.customerName || "Rider Customer",
										" (",
										order.customerPhone || "+91 98450 12345",
										")"
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setPrintModalData({
											order,
											group
										}),
										className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), "Invoice & Slip"]
									}),
									statusIndex === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRejectOrder(order),
										className: "px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer",
										children: "Reject"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleAcceptOrder(order.id),
										className: "px-4 py-1.5 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer",
										children: "Accept Order"
									})] }),
									statusIndex === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleMarkPacked(order.id),
										className: "px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs hover:bg-amber-700 transition cursor-pointer",
										children: "Mark as Packed"
									}),
									statusIndex === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setHandoverOrder(order),
										className: "px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 transition cursor-pointer inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5" }), "Hand over to Rider"]
									}),
									statusIndex >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-emerald-700 font-bold flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }),
											"Handed over to ",
											assignedRider.name
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1 text-xs",
								children: group.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold text-gray-800",
									children: [
										it.qty,
										"x Product [",
										it.productId,
										"] —",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-gray-600",
											children: [inr(it.price), " each"]
										})
									]
								}, idx))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-gray-500",
										children: "Group Subtotal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-base font-black text-gray-900",
										children: inr(group.subtotal)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-gray-400",
										children: [
											"Delivery: ",
											inr(group.fee),
											" (~",
											group.km,
											" km)"
										]
									})
								]
							})]
						})]
					}, order.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-10 w-10 text-gray-300 mx-auto mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-gray-800",
						children: "No orders found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-500 mt-0.5",
						children: "There are no orders matching the selected status tab or search query."
					})
				]
			}),
			handoverOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-bold text-base text-gray-900",
								children: "Rider Handover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-gray-500",
								children: ["Order ", handoverOrder.id]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gray-50 p-3.5 border border-gray-200 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-gray-800",
									children: "Assigned Fleet Rider:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-600",
									children: "Ravi Kumar (Ather Rizta · KA 01 EV 4521)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-500",
									children: "Phone: +91 98450 12345"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-purple-700 font-semibold pt-1",
									children: "Demo OTP: 4921"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Enter 4-Digit Rider Pickup OTP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							maxLength: 4,
							value: handoverOtp,
							onChange: (e) => setHandoverOtp(e.target.value),
							placeholder: "4921",
							className: "w-full text-center text-lg font-mono font-bold tracking-widest rounded-xl border border-gray-200 p-2.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setHandoverOrder(null),
								className: "px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleHandoverSubmit,
								className: "px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700",
								children: "Confirm Handover"
							})]
						})
					]
				})
			}),
			rejectOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-base text-gray-900",
							children: ["Reject Order ", rejectOrder.id]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Please specify the fulfillment reason for order cancellation. The customer will be automatically refunded."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: rejectReason,
							onChange: (e) => setRejectReason(e.target.value),
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Item Out of Stock / Damaged Inventory",
									children: "Item Out of Stock / Damaged Inventory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Pickup Address Unserviceable for Courier",
									children: "Pickup Address Unserviceable for Courier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Pricing error on listing",
									children: "Pricing error on listing"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setRejectOrder(null),
								className: "px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleRejectSubmit,
								className: "px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700",
								children: "Confirm Reject"
							})]
						})
					]
				})
			}),
			printModalData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintPackingSlipModal, {
				isOpen: Boolean(printModalData),
				onClose: () => setPrintModalData(null),
				order: printModalData.order,
				group: printModalData.group,
				vendor
			})
		]
	});
}
var DB_NAME = "riderzpro_storage";
var STORE_NAME = "images";
var DB_VERSION = 1;
var dbPromise = null;
var memoryFallback = /* @__PURE__ */ new Map();
function getDB() {
	if (typeof window === "undefined" || !window.indexedDB) return Promise.reject(/* @__PURE__ */ new Error("IndexedDB not available"));
	if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
	return dbPromise;
}
var storageAdapter = {
	/**
	* Saves image data (base64 data URL or Blob) in IndexedDB.
	*/
	async saveImage(id, data) {
		try {
			let dataUrl;
			if (typeof data === "string") dataUrl = data;
			else dataUrl = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(data);
			});
			try {
				const db = await getDB();
				await new Promise((resolve, reject) => {
					const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put({
						id,
						dataUrl,
						savedAt: Date.now()
					});
					req.onsuccess = () => resolve();
					req.onerror = () => reject(req.error);
				});
			} catch {
				memoryFallback.set(id, dataUrl);
			}
			return id;
		} catch (e) {
			console.error("storageAdapter save error:", e);
			throw e;
		}
	},
	/**
	* Retrieves image data URL by ID from IndexedDB or memory.
	*/
	async getImage(id) {
		if (memoryFallback.has(id)) return memoryFallback.get(id) || null;
		try {
			const db = await getDB();
			return new Promise((resolve) => {
				const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
				req.onsuccess = () => {
					if (req.result && req.result.dataUrl) resolve(req.result.dataUrl);
					else resolve(null);
				};
				req.onerror = () => resolve(null);
			});
		} catch {
			return null;
		}
	},
	/**
	* Removes an image from storage.
	*/
	async deleteImage(id) {
		memoryFallback.delete(id);
		try {
			const db = await getDB();
			await new Promise((resolve) => {
				const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
				req.onsuccess = () => resolve();
				req.onerror = () => resolve();
			});
		} catch {}
	},
	/**
	* Compresses and resizes an uploaded file to maximum dimension (default 1600px).
	*/
	async compressAndStore(file, maxDim = 1600) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const reader = new FileReader();
			reader.onload = (e) => {
				img.src = e.target?.result;
			};
			reader.onerror = reject;
			img.onload = async () => {
				let width = img.width;
				let height = img.height;
				if (width > maxDim || height > maxDim) if (width > height) {
					height = Math.round(height * maxDim / width);
					width = maxDim;
				} else {
					width = Math.round(width * maxDim / height);
					height = maxDim;
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(/* @__PURE__ */ new Error("Canvas context failed"));
					return;
				}
				ctx.drawImage(img, 0, 0, width, height);
				const dataUrl = canvas.toDataURL("image/jpeg", .85);
				const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
				await storageAdapter.saveImage(id, dataUrl);
				resolve({
					id,
					dataUrl,
					width: img.width,
					height: img.height,
					sizeBytes: Math.round(dataUrl.length * 3 / 4)
				});
			};
			reader.readAsDataURL(file);
		});
	}
};
var CATEGORIES = [
	"Battery",
	"Charger",
	"BMS",
	"Motor",
	"Controller",
	"Brakes",
	"Electric Bikes",
	"Car Accessories",
	"Bike Accessories",
	"Riding Gear & Helmets",
	"Spare Parts"
];
function AddProductModal({ isOpen, onClose, vendor, productToEdit }) {
	const { products: products$1, addProduct, updateProduct, requestProductRevision } = useVendorStore();
	const isKycApproved = vendor.status === "approved";
	const [mode, setMode] = (0, import_react.useState)("NEW");
	const [existingSearchQuery, setExistingSearchQuery] = (0, import_react.useState)("");
	const [selectedCatalogProduct, setSelectedCatalogProduct] = (0, import_react.useState)(null);
	const [existingOfferPrice, setExistingOfferPrice] = (0, import_react.useState)(0);
	const [existingOfferStock, setExistingOfferStock] = (0, import_react.useState)(10);
	const [existingOfferCondition, setExistingOfferCondition] = (0, import_react.useState)("New");
	const [title, setTitle] = (0, import_react.useState)("");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Battery");
	const [subType, setSubType] = (0, import_react.useState)("");
	const [shortDescription, setShortDescription] = (0, import_react.useState)("");
	const [richDescription, setRichDescription] = (0, import_react.useState)("");
	const [sku, setSku] = (0, import_react.useState)("");
	const [barcode, setBarcode] = (0, import_react.useState)("");
	const [hsnCode, setHsnCode] = (0, import_react.useState)("85076000");
	const [gstRate, setGstRate] = (0, import_react.useState)(18);
	const [mrp, setMrp] = (0, import_react.useState)(0);
	const [sellingPrice, setSellingPrice] = (0, import_react.useState)(0);
	const [stock, setStock] = (0, import_react.useState)(10);
	const [minStockAlert, setMinStockAlert] = (0, import_react.useState)(3);
	const [condition, setCondition] = (0, import_react.useState)("New");
	const [partType, setPartType] = (0, import_react.useState)("Genuine");
	const [warrantyMonths, setWarrantyMonths] = (0, import_react.useState)(24);
	const [weightKg, setWeightKg] = (0, import_react.useState)(4.5);
	const [dimensionsCm, setDimensionsCm] = (0, import_react.useState)({
		length: 30,
		width: 20,
		height: 15
	});
	const [countryOfOrigin, setCountryOfOrigin] = (0, import_react.useState)("India");
	const [manufacturerDetails, setManufacturerDetails] = (0, import_react.useState)("");
	const [inTheBox, setInTheBox] = (0, import_react.useState)("");
	const [specs, setSpecs] = (0, import_react.useState)({
		voltage: "60V",
		capacityAh: "30Ah",
		chemistry: "NMC",
		ipRating: "IP67",
		connectorType: "Chogori / Anderson",
		kw: "",
		certification: "BIS / UN38.3"
	});
	const [fitsAll, setFitsAll] = (0, import_react.useState)(false);
	const [selectedBikes, setSelectedBikes] = (0, import_react.useState)(["ola-s1pro", "ather-450x"]);
	const [images, setImages] = (0, import_react.useState)([]);
	const [isUploadingImage, setIsUploadingImage] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [csvFile, setCsvFile] = (0, import_react.useState)(null);
	const [csvErrors, setCsvErrors] = (0, import_react.useState)([]);
	const [csvSuccessCount, setCsvSuccessCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (productToEdit) {
			setMode("NEW");
			setTitle(productToEdit.title);
			setBrand(productToEdit.brand);
			setCategory(productToEdit.category);
			setSku(productToEdit.sku);
			setHsnCode(productToEdit.hsnCode || "85076000");
			setGstRate(productToEdit.gstRate || 18);
			setMrp(productToEdit.mrp);
			setSellingPrice(productToEdit.sellingPrice);
			setStock(productToEdit.stock);
			setMinStockAlert(productToEdit.minStockAlert || 3);
			setCondition(productToEdit.condition || "New");
			setPartType(productToEdit.partType || "Genuine");
			setWarrantyMonths(productToEdit.warrantyMonths);
			setWeightKg(productToEdit.weightKg || 4.5);
			setShortDescription(productToEdit.description || "");
			setSelectedBikes(productToEdit.fits || []);
			setImages(productToEdit.images || []);
			setSpecs(productToEdit.specs || {});
		} else setImages([
			"https://images.unsplash.com/photo-1558441719-8b489c652758?w=800&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
		]);
	}, [productToEdit]);
	if (!isOpen) return null;
	const handleCategoryChange = (newCat) => {
		setCategory(newCat);
		setGstRate(DEFAULT_GSTRATES[newCat] || 18);
		if (newCat === "Battery") {
			setHsnCode("85076000");
			setSpecs((prev) => ({
				...prev,
				voltage: "60V",
				capacityAh: "30Ah",
				chemistry: "NMC",
				ipRating: "IP67"
			}));
		} else if (newCat === "Charger") {
			setHsnCode("85044030");
			setSpecs((prev) => ({
				...prev,
				voltage: "60V",
				kw: "3.3kW",
				ipRating: "IP65"
			}));
		} else if (newCat === "Riding Gear & Helmets") {
			setHsnCode("65061000");
			setSpecs((prev) => ({
				...prev,
				certification: "ECE 22.06 / ISI 4151"
			}));
		} else setHsnCode("87141090");
	};
	const handleImageUpload = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		if (images.length + files.length > 8) {
			toast.error("Maximum 8 images allowed per listing");
			return;
		}
		setIsUploadingImage(true);
		try {
			const newImageUrls = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.size > 5242880) {
					toast.error(`${file.name} exceeds 5 MB limit`);
					continue;
				}
				const uploaded = await storageAdapter.uploadImage(file);
				newImageUrls.push(uploaded.url);
			}
			setImages((prev) => [...prev, ...newImageUrls]);
			toast.success(`Uploaded ${newImageUrls.length} image(s)`);
		} catch (err) {
			toast.error(err?.message || "Failed to process image upload");
		} finally {
			setIsUploadingImage(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const removeImage = (index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};
	const makeMainImage = (index) => {
		setImages((prev) => {
			const copy = [...prev];
			const [item] = copy.splice(index, 1);
			return [item, ...copy];
		});
		toast.info("Set as main thumbnail");
	};
	const toggleBikeFit = (bikeId) => {
		setSelectedBikes((prev) => prev.includes(bikeId) ? prev.filter((b) => b !== bikeId) : [...prev, bikeId]);
	};
	const parsedVolt = parseInt(String(specs.voltage || "").replace(/\D/g, ""), 10);
	const voltageMismatch = selectedBikes.some((bId) => {
		const b = bikes.find((bk) => bk.id === bId);
		return b && b.voltage && parsedVolt && b.voltage !== parsedVolt;
	});
	const validateForm = () => {
		if (!title.trim() || title.length < 5) {
			toast.error("Title must be at least 5 characters long");
			return false;
		}
		if (!brand.trim()) {
			toast.error("Brand name is required");
			return false;
		}
		if (!sku.trim()) {
			toast.error("SKU is required");
			return false;
		}
		if (mrp <= 0 || sellingPrice <= 0) {
			toast.error("MRP and Selling Price must be greater than 0");
			return false;
		}
		if (sellingPrice > mrp) {
			toast.error("Selling price cannot exceed MRP");
			return false;
		}
		if (images.length < 3) {
			toast.error("Minimum 3 product images required (uploaded: " + images.length + ")");
			return false;
		}
		if (!productToEdit) {
			if (products$1.some((p) => p.vendorId === vendor.id && (p.sku.toLowerCase() === sku.toLowerCase() || p.title.trim().toLowerCase() === title.trim().toLowerCase()))) {
				toast.error("A product with this SKU or title already exists in your store");
				return false;
			}
		}
		return true;
	};
	const handleSave = (submitForReview) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Vendor must be KYC approved by admin before creating or modifying products.");
			return;
		}
		if (!validateForm()) return;
		const targetFits = fitsAll ? bikes.map((b) => b.id) : selectedBikes;
		if (productToEdit) if (productToEdit.status === "live") if (productToEdit.title !== title || productToEdit.category !== category || JSON.stringify(productToEdit.images) !== JSON.stringify(images) || productToEdit.description !== shortDescription) {
			const revision = {
				id: `rev_${Date.now()}`,
				productId: productToEdit.id,
				vendorId: vendor.id,
				submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
				changes: {
					title,
					category,
					images,
					description: shortDescription,
					specs,
					fits: targetFits,
					sellingPrice,
					mrp,
					stock
				},
				status: "pending_review"
			};
			requestProductRevision(productToEdit.id, revision);
			toast.success("Price/stock updated instantly! Content revisions submitted for admin review.");
		} else {
			updateProduct(productToEdit.id, {
				sellingPrice,
				mrp,
				stock,
				minStockAlert
			});
			toast.success("Product price and stock updated instantly!");
		}
		else {
			updateProduct(productToEdit.id, {
				title,
				brand,
				category,
				sku,
				hsnCode,
				gstRate,
				mrp,
				sellingPrice,
				stock,
				minStockAlert,
				condition,
				partType,
				warrantyMonths,
				weightKg,
				fits: targetFits,
				images,
				description: shortDescription,
				specs,
				status: submitForReview ? "pending_review" : "draft"
			});
			toast.success(submitForReview ? "Product submitted for admin review!" : "Product draft saved.");
		}
		else {
			addProduct({
				vendorId: vendor.id,
				vendorName: vendor.storeName,
				title,
				brand,
				category,
				subType,
				sku,
				barcode,
				hsnCode,
				gstRate,
				mrp,
				sellingPrice,
				stock,
				minStockAlert,
				condition,
				partType,
				warrantyMonths,
				weightKg,
				dimensionsCm,
				countryOfOrigin,
				manufacturerDetails,
				fits: targetFits,
				images,
				description: shortDescription,
				specs,
				status: submitForReview ? "pending_review" : "draft"
			});
			toast.success(submitForReview ? "Product created and queued for admin review!" : "Product saved as draft.");
		}
		onClose();
	};
	const handleAddExistingOffer = () => {
		if (!isKycApproved) {
			toast.error("Action blocked: Vendor must be KYC approved by admin before publishing offers.");
			return;
		}
		if (!selectedCatalogProduct) {
			toast.error("Please search and select a catalog product");
			return;
		}
		if (existingOfferPrice <= 0 || existingOfferStock <= 0) {
			toast.error("Please enter a valid selling price and stock");
			return;
		}
		addProduct({
			id: `offer_${selectedCatalogProduct.id}_${vendor.id}`,
			vendorId: vendor.id,
			vendorName: vendor.storeName,
			title: selectedCatalogProduct.name,
			brand: selectedCatalogProduct.brand,
			category: selectedCatalogProduct.category,
			sku: `OFFER-${selectedCatalogProduct.id}-${vendor.id.slice(-3)}`,
			mrp: existingOfferPrice * 1.15,
			sellingPrice: existingOfferPrice,
			stock: existingOfferStock,
			condition: existingOfferCondition,
			partType: "Genuine",
			warrantyMonths: selectedCatalogProduct.warrantyMonths || 12,
			fits: selectedCatalogProduct.fits || [],
			images: [selectedCatalogProduct.image],
			description: `Offer on official ${selectedCatalogProduct.name}`,
			status: "pending_review"
		});
		toast.success("Offer submitted for admin verification!");
		onClose();
	};
	const handleDownloadCsvTemplate = () => {
		const blob = new Blob(["Title,Brand,Category,SKU,MRP,SellingPrice,Stock,WarrantyMonths,PartType,HSN\nLithium 60V 30Ah Battery,VoltRide,Battery,SKU-BATT-6030,65000,58000,15,36,OEM,85076000\nFast Charger 3.3kW Type-2,ChargeMax,Charger,SKU-CHG-3300,16000,13500,25,12,Genuine,85044030\n"], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "riderzpro_bulk_products_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const handleCsvUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setCsvFile(file);
		setCsvErrors([]);
		const reader = new FileReader();
		reader.onload = (event) => {
			const lines = (event.target?.result).split("\n").filter((l) => l.trim().length > 0);
			if (lines.length < 2) {
				setCsvErrors(["CSV file must have a header row and at least 1 data row."]);
				return;
			}
			const errors = [];
			let validCount = 0;
			for (let i = 1; i < lines.length; i++) {
				const cols = lines[i].split(",").map((c) => c.trim());
				if (cols.length < 6) {
					errors.push(`Row ${i + 1}: Missing required columns`);
					continue;
				}
				const [rowTitle, rowBrand, rowCategory, rowSku, rowMrp, rowPrice] = cols;
				if (!rowTitle || !rowBrand || !rowSku) {
					errors.push(`Row ${i + 1}: Title, Brand, and SKU are required`);
					continue;
				}
				if (isNaN(Number(rowMrp)) || isNaN(Number(rowPrice))) {
					errors.push(`Row ${i + 1}: MRP and SellingPrice must be numeric`);
					continue;
				}
				validCount++;
			}
			setCsvErrors(errors);
			setCsvSuccessCount(validCount);
		};
		reader.readAsText(file);
	};
	const handleProcessCsv = () => {
		if (!isKycApproved) {
			toast.error("Action blocked: Vendor must be KYC approved by admin before importing products.");
			return;
		}
		if (csvSuccessCount === 0) {
			toast.error("No valid rows to import");
			return;
		}
		toast.success(`Imported ${csvSuccessCount} products as drafts for review!`);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[94vh] w-full max-w-4xl flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display font-bold text-base sm:text-lg text-gray-900",
						children: productToEdit ? "Edit Product Listing" : "Add Product to Catalog"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] sm:text-xs text-gray-500",
						children: productToEdit ? "Update pricing or create a specification revision." : "List a new SKU or sell an existing catalog product."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				!productToEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex overflow-x-auto border-b border-gray-200 bg-white px-4 sm:px-6 pt-3 gap-4 sm:gap-6 no-scrollbar whitespace-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("NEW"),
							className: `pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${mode === "NEW" ? "border-[#E31E24] text-[#E31E24]" : "border-transparent text-gray-500 hover:text-black"}`,
							children: "1. Create New Product"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("EXISTING_OFFER"),
							className: `pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${mode === "EXISTING_OFFER" ? "border-[#E31E24] text-[#E31E24]" : "border-transparent text-gray-500 hover:text-black"}`,
							children: "2. Sell Existing Product (Amazon-style)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("CSV_BULK"),
							className: `pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${mode === "CSV_BULK" ? "border-[#E31E24] text-[#E31E24]" : "border-transparent text-gray-500 hover:text-black"}`,
							children: "3. Bulk CSV Upload"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6",
					children: [
						!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-amber-300 bg-amber-50 p-3.5 sm:p-4 text-xs text-amber-900 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-amber-950",
								children: "Catalogue Locked — KYC Verification Pending"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-amber-800 leading-relaxed",
								children: [
									"Your seller account is currently",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold uppercase",
										children: vendor.status.replace("_", " ")
									}),
									". Adding and modifying products will be enabled once your seller KYC is approved by the admin."
								]
							})] })]
						}),
						mode === "NEW" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-[#E31E24]" }), "Basic Product Information"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-bold text-gray-700 block mb-1",
												children: "Product Title *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: title,
												onChange: (e) => setTitle(e.target.value),
												placeholder: "e.g. VoltRide 60V 30Ah Li-ion NMC Battery Pack with IP67 BMS",
												className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Brand Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: brand,
											onChange: (e) => setBrand(e.target.value),
											placeholder: "e.g. VoltRide, Brembo, Ather",
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Category *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: category,
											onChange: (e) => handleCategoryChange(e.target.value),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24]",
											children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c,
												children: c
											}, c))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "SKU (Stock Keeping Unit) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: sku,
											onChange: (e) => setSku(e.target.value.toUpperCase()),
											placeholder: "e.g. VR-6030-NMC",
											className: "w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5 bg-white font-medium uppercase focus:border-[#E31E24]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Part Classification"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: partType,
											onChange: (e) => setPartType(e.target.value),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "OEM",
													children: "OEM (Original Equipment Manufacturer)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Genuine",
													children: "Genuine Certified"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Aftermarket",
													children: "Aftermarket High Performance"
												})
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-bold text-gray-700 block mb-1",
												children: "Short Description *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												rows: 2,
												value: shortDescription,
												onChange: (e) => setShortDescription(e.target.value),
												placeholder: "Concise overview of features, chemistry, and warranty...",
												className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium focus:border-[#E31E24]"
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-[#E31E24]" }), "Pricing, Tax & Inventory"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 md:grid-cols-4 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "MRP (₹) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: mrp || "",
											onChange: (e) => setMrp(Number(e.target.value)),
											placeholder: "65000",
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Selling Price (₹) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: sellingPrice || "",
											onChange: (e) => setSellingPrice(Number(e.target.value)),
											placeholder: "58000",
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold text-emerald-700"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Stock Units *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: stock,
											onChange: (e) => setStock(Number(e.target.value)),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Min Stock Alert"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: minStockAlert,
											onChange: (e) => setMinStockAlert(Number(e.target.value)),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "HSN Code"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: hsnCode,
											onChange: (e) => setHsnCode(e.target.value),
											className: "w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "GST Slab (%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: gstRate,
											onChange: (e) => setGstRate(Number(e.target.value)),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 5,
													children: "5% (EV Vehicles)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 12,
													children: "12%"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 18,
													children: "18% (Standard Auto Parts)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 28,
													children: "28%"
												})
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Warranty (Months)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: warrantyMonths,
											onChange: (e) => setWarrantyMonths(Number(e.target.value)),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Weight (kg)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.1",
											value: weightKg,
											onChange: (e) => setWeightKg(Number(e.target.value)),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5"
										})] })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display font-bold text-sm text-gray-900 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-[#E31E24]" }),
											"Technical Specs (",
											category,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-gray-500",
										children: "Category specific parameters"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 md:grid-cols-3 gap-3",
									children: [
										(category === "Battery" || category === "Charger" || category === "BMS" || category === "Motor" || category === "Controller") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Operating Voltage"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: specs.voltage || "60V",
											onChange: (e) => setSpecs((p) => ({
												...p,
												voltage: e.target.value
											})),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "48V",
													children: "48V (Ather / TVS)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "60V",
													children: "60V (Ola / Chetak / Vida)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "72V",
													children: "72V (Revolt / Performance)"
												})
											]
										})] }),
										category === "Battery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-bold text-gray-700 block mb-1",
												children: "Capacity (Ah)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: specs.capacityAh || "",
												onChange: (e) => setSpecs((p) => ({
													...p,
													capacityAh: e.target.value
												})),
												placeholder: "e.g. 30Ah",
												className: "w-full text-xs rounded-xl border border-gray-200 p-2.5"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-bold text-gray-700 block mb-1",
												children: "Chemistry"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: specs.chemistry || "NMC",
												onChange: (e) => setSpecs((p) => ({
													...p,
													chemistry: e.target.value
												})),
												className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "NMC",
														children: "NMC (Nickel Manganese Cobalt)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "LiFePO4",
														children: "LiFePO4 (Lithium Iron Phosphate)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "LTO",
														children: "LTO (Lithium Titanate)"
													})
												]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-bold text-gray-700 block mb-1",
												children: "IP Rating"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: specs.ipRating || "IP67",
												onChange: (e) => setSpecs((p) => ({
													...p,
													ipRating: e.target.value
												})),
												className: "w-full text-xs rounded-xl border border-gray-200 p-2.5"
											})] })
										] }),
										category === "Riding Gear & Helmets" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-bold text-gray-700 block mb-1",
											children: "Safety Certification"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: specs.certification || "ISI 4151 / ECE 22.06",
											onChange: (e) => setSpecs((p) => ({
												...p,
												certification: e.target.value
											})),
											className: "w-full text-xs rounded-xl border border-gray-200 p-2.5"
										})] })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-gray-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-[#E31E24]" }), "Compatible EV Bike Models"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: fitsAll,
												onChange: (e) => setFitsAll(e.target.checked),
												className: "accent-[#E31E24] h-4 w-4 rounded"
											}), "Universal Fit (Fits all models)"]
										})]
									}),
									voltageMismatch && !fitsAll && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5 text-xs text-amber-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Notice: Selected product voltage (",
											specs.voltage,
											") does not match the native battery voltage of one or more checked bike models."
										] })]
									}),
									!fitsAll && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
										children: bikes.map((bike) => {
											const isSelected = selectedBikes.includes(bike.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => toggleBikeFit(bike.id),
												className: `flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${isSelected ? "bg-red-50 border-[#E31E24] text-[#E31E24]" : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													bike.name,
													" (",
													bike.voltage,
													"V)"
												] }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-[#E31E24]" })]
											}, bike.id);
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "h-4 w-4 text-[#E31E24]" }),
												"Product Gallery (",
												images.length,
												" of 8 images)"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-gray-500",
											children: "Minimum 3 images required. High-res, square recommended."
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											disabled: images.length >= 8 || isUploadingImage,
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition disabled:opacity-50 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), "Upload Image"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											accept: "image/png, image/jpeg, image/webp",
											multiple: true,
											onChange: handleImageUpload,
											className: "hidden"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 sm:grid-cols-6 gap-3",
									children: [images.map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-2xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: img,
												alt: `Item ${idx + 1}`,
												className: "w-full h-full object-cover"
											}),
											idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute top-1.5 left-1.5 bg-[#E31E24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs",
												children: "Main"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition",
												children: [idx !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => makeMainImage(idx),
													className: "bg-white text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded hover:bg-gray-100",
													children: "Set Main"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => removeImage(idx),
													className: "bg-red-600 text-white p-1 rounded-full hover:bg-red-700",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
												})]
											})
										]
									}, idx)), images.length < 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => fileInputRef.current?.click(),
										className: "aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#E31E24] flex flex-col items-center justify-center text-gray-400 hover:text-[#E31E24] transition cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold",
											children: "Add Photo"
										})]
									})]
								})]
							})
						] }),
						mode === "EXISTING_OFFER" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-blue-50 border border-blue-200 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-bold text-xs text-blue-900 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-blue-600" }), "List Your Offer on Existing Catalog Products"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-blue-800 mt-1",
										children: "Search from pre-verified products in the RiderzPro catalog. You only need to set your selling price, available inventory, and condition."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "Search Catalog by Title or Brand"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-3 h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: existingSearchQuery,
										onChange: (e) => setExistingSearchQuery(e.target.value),
										placeholder: "Search e.g. VoltRide, Charger, Brembo...",
										className: "w-full text-xs pl-9 rounded-xl border border-gray-200 p-2.5 font-medium"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto",
									children: products.filter((p) => !existingSearchQuery || p.name.toLowerCase().includes(existingSearchQuery.toLowerCase()) || p.brand.toLowerCase().includes(existingSearchQuery.toLowerCase())).map((prod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => {
											setSelectedCatalogProduct(prod);
											setExistingOfferPrice(prod.offers[0]?.price || 1e3);
										},
										className: `p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${selectedCatalogProduct?.id === prod.id ? "border-[#E31E24] bg-red-50/50 shadow-xs" : "border-gray-200 hover:border-gray-300 bg-white"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: prod.image,
											alt: prod.name,
											className: "h-12 w-12 rounded-xl object-cover border border-gray-100"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-gray-900 truncate",
													children: prod.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-gray-500",
													children: [
														prod.category,
														" · ",
														prod.brand
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs font-bold text-[#E31E24] mt-0.5",
													children: ["Base: ₹", prod.offers[0]?.price.toLocaleString("en-IN")]
												})
											]
										})]
									}, prod.id))
								}),
								selectedCatalogProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "font-bold text-xs text-gray-900",
											children: ["Your Offer Details for: ", selectedCatalogProduct.name]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-bold text-gray-700 block mb-1",
													children: "Your Price (₹)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: existingOfferPrice,
													onChange: (e) => setExistingOfferPrice(Number(e.target.value)),
													className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-bold text-gray-700 block mb-1",
													children: "Stock Quantity"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: existingOfferStock,
													onChange: (e) => setExistingOfferStock(Number(e.target.value)),
													className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-bold"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-bold text-gray-700 block mb-1",
													children: "Condition"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: existingOfferCondition,
													onChange: (e) => setExistingOfferCondition(e.target.value),
													className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "New",
														children: "Brand New"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Refurbished",
														children: "Refurbished / Certified"
													})]
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleAddExistingOffer,
												disabled: !isKycApproved,
												className: `inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition ${isKycApproved ? "bg-[#E31E24] text-white hover:bg-red-700 cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"}`,
												children: [!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Publish Offer to Catalog" })]
											})
										})
									]
								})
							]
						}),
						mode === "CSV_BULK" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-gray-50 border border-gray-200 p-5 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-bold text-sm text-gray-900",
												children: "Bulk Product CSV Upload"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleDownloadCsvTemplate,
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download CSV Template"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-gray-600",
										children: "Upload multiple catalog items using our structured CSV file. The system validates SKUs, mandatory columns, and tax slabs with row-level error reporting."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#E31E24] transition bg-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".csv",
										onChange: handleCsvUpload,
										className: "hidden",
										id: "csv-file-input"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: "csv-file-input",
										className: "cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-10 w-10 text-gray-400 mx-auto mb-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-gray-800",
												children: csvFile ? csvFile.name : "Click to select CSV spreadsheet"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-gray-400 mt-0.5",
												children: "Maximum file size: 5 MB"
											})
										]
									})]
								}),
								csvErrors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-red-50 border border-red-200 p-4 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
										className: "font-bold text-xs text-red-900 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-red-600" }),
											"Row Validation Errors (",
											csvErrors.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "text-xs text-red-800 list-disc pl-5 space-y-0.5 max-h-36 overflow-y-auto",
										children: csvErrors.map((err, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: err }, idx))
									})]
								}),
								csvSuccessCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold text-emerald-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [csvSuccessCount, " products ready to import"] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleProcessCsv,
										disabled: !isKycApproved,
										className: `inline-flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition ${isKycApproved ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"}`,
										children: [!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Import All (",
											csvSuccessCount,
											")"
										] })]
									})]
								})
							]
						})
					]
				}),
				mode === "NEW" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "text-xs font-bold text-gray-500 hover:text-black transition py-1 text-center",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleSave(false),
							disabled: !isKycApproved,
							className: `flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold transition ${isKycApproved ? "text-gray-700 hover:bg-gray-100 cursor-pointer" : "text-gray-400 cursor-not-allowed opacity-60"}`,
							children: "Save as Draft"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleSave(true),
							disabled: !isKycApproved,
							className: `flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition ${isKycApproved ? "bg-[#E31E24] text-white hover:bg-red-700 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
							children: [!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Submit for Admin Review" })]
						})]
					})]
				})
			]
		})
	});
}
function ProductsSection({ vendor }) {
	const { products, addProduct, updateProduct, deleteProduct } = useVendorStore();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [isAddModalOpen, setIsAddModalOpen] = (0, import_react.useState)(false);
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const isKycApproved = vendor.status === "approved";
	const filteredProducts = products.filter((p) => p.vendorId === vendor.id).filter((p) => {
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			if (!(p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) return false;
		}
		if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
		return true;
	});
	const handleOpenAdd = () => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before adding products.");
			return;
		}
		setEditingProduct(null);
		setIsAddModalOpen(true);
	};
	const handleOpenEdit = (p) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before editing products.");
			return;
		}
		setEditingProduct(p);
		setIsAddModalOpen(true);
	};
	const handleDuplicate = (p) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before duplicating products.");
			return;
		}
		try {
			addProduct({
				...p,
				sku: `${p.sku}-COPY`,
				title: `${p.title} (Copy)`,
				status: "draft"
			});
			toast.success(`Duplicated "${p.title}" as draft!`);
		} catch (e) {
			toast.error(e.message || "Failed to duplicate product");
		}
	};
	const handleToggleArchive = (p) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying products.");
			return;
		}
		const nextStatus = p.status === "archived" ? "draft" : "archived";
		updateProduct(p.id, { status: nextStatus });
		toast.info(`Product marked as ${nextStatus}`);
	};
	const handleDelete = (id) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before deleting products.");
			return;
		}
		deleteProduct(id);
		toast.error("Product removed from store");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 sm:space-y-6",
		children: [
			!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl sm:rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-bold text-amber-900",
									children: "Catalogue Locked — KYC Verification Pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900",
									children: ["Status: ", vendor.status.replace("_", " ")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-amber-800 leading-relaxed",
								children: "In compliance with marketplace regulations, adding, editing, duplicating, or deleting catalog products unlocks only after your KYC verification has been completed and approved by the RiderzPro admin team."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/vendor/pending",
									className: "inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Verification Status & SLA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-black text-xl text-gray-900",
					children: "Product Catalogue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Manage your EV parts, pricing, stock levels, and review status."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleOpenAdd,
					disabled: !isKycApproved,
					title: isKycApproved ? "Add a new product to catalogue" : "KYC verification must be completed by admin before adding products",
					className: `inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer shrink-0 ${isKycApproved ? "bg-[#E31E24] text-white hover:bg-red-700" : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"}`,
					children: [isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Product" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1",
					children: [
						{
							id: "ALL",
							label: "All Items"
						},
						{
							id: "live",
							label: "Live in Shop"
						},
						{
							id: "pending_review",
							label: "Pending Review"
						},
						{
							id: "changes_requested",
							label: "Needs Changes"
						},
						{
							id: "draft",
							label: "Drafts"
						},
						{
							id: "rejected",
							label: "Rejected"
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter(tab.id),
						className: `px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 whitespace-nowrap ${statusFilter === tab.id ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:text-black hover:border-gray-300"}`,
						children: tab.label
					}, tab.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "Search by SKU, title...",
						className: "w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E31E24]"
					})]
				})]
			}),
			filteredProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: filteredProducts.map((p) => {
					const mainImage = p.images?.[0] || "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: mainImage,
									alt: p.title,
									className: "h-16 w-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-start justify-between gap-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-xs text-gray-900 line-clamp-2 leading-tight",
												children: p.title
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5 mt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600",
													children: p.sku
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-gray-400",
													children: "·"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-gray-500 font-semibold",
													children: p.category
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5",
											children: [
												p.status === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Live"]
												}),
												p.status === "pending_review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Under Review"]
												}),
												p.status === "changes_requested" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 border border-orange-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), " Changes Needed"]
												}),
												p.status === "draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600",
													children: "Draft"
												}),
												p.status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }), " Rejected"]
												})
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl bg-gray-50 p-2.5 border border-gray-100 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-gray-400 block font-medium",
									children: "Selling Price"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-1.5 font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-gray-900",
										children: inr(p.sellingPrice)
									}), p.mrp > p.sellingPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-gray-400 line-through",
										children: inr(p.mrp)
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-gray-400 block font-medium",
										children: "Stock"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-bold ${p.stock <= (p.minStockAlert || 5) ? "text-rose-600" : "text-emerald-700"}`,
										children: [p.stock, " units"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-1.5 pt-1 border-t border-gray-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleOpenEdit(p),
										disabled: !isKycApproved,
										title: isKycApproved ? "Edit Product" : "KYC approval required",
										className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${isKycApproved ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"}`,
										children: [isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Edit" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleDuplicate(p),
										disabled: !isKycApproved,
										title: isKycApproved ? "Duplicate SKU" : "KYC approval required",
										className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${isKycApproved ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Duplicate" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleToggleArchive(p),
										disabled: !isKycApproved,
										title: isKycApproved ? "Archive" : "KYC approval required",
										className: `flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${isKycApproved ? "text-gray-700 bg-gray-100 hover:bg-gray-200" : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.status === "archived" ? "Unarchive" : "Archive" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(p.id),
										disabled: !isKycApproved,
										title: isKycApproved ? "Delete Product" : "KYC approval required",
										className: `p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer ${!isKycApproved ? "opacity-40 cursor-not-allowed" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})
						]
					}, p.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Product & SKU"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Stock Units"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Approval Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-100",
							children: filteredProducts.map((p) => {
								const mainImage = p.images?.[0] || "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-gray-50/70 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: mainImage,
													alt: p.title,
													className: "h-11 w-11 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 max-w-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-gray-900 truncate",
														children: p.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] font-mono text-gray-400 mt-0.5",
														children: [
															"SKU: ",
															p.sku,
															" · ",
															p.brand
														]
													})]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-gray-700",
												children: p.category
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-4 font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-gray-900",
												children: inr(p.sellingPrice)
											}), p.mrp > p.sellingPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block text-[10px] text-gray-400 line-through",
												children: ["MRP ", inr(p.mrp)]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `font-bold ${p.stock <= (p.minStockAlert || 5) ? "text-rose-600" : "text-emerald-700"}`,
												children: [p.stock, " units"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3.5 px-4",
											children: [
												p.status === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Live"]
												}),
												p.status === "pending_review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Under Review"]
												}),
												p.status === "changes_requested" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 border border-orange-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), " Changes Needed"]
												}),
												p.status === "draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600",
													children: "Draft"
												}),
												p.status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3" }), " Rejected"]
												}),
												p.pendingRevision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[10px] text-amber-600 font-semibold mt-0.5",
													children: "Revision pending"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleOpenEdit(p),
														disabled: !isKycApproved,
														title: isKycApproved ? "Edit Listing" : "KYC approval required",
														className: `p-1.5 rounded-lg transition cursor-pointer ${isKycApproved ? "text-gray-500 hover:text-black hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}`,
														children: isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleDuplicate(p),
														disabled: !isKycApproved,
														title: isKycApproved ? "Duplicate SKU" : "KYC approval required",
														className: `p-1.5 rounded-lg transition cursor-pointer ${isKycApproved ? "text-gray-500 hover:text-black hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleToggleArchive(p),
														disabled: !isKycApproved,
														title: isKycApproved ? "Archive" : "KYC approval required",
														className: `p-1.5 rounded-lg transition cursor-pointer ${isKycApproved ? "text-gray-500 hover:text-black hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleDelete(p.id),
														disabled: !isKycApproved,
														title: isKycApproved ? "Delete" : "KYC approval required",
														className: `p-1.5 rounded-lg transition cursor-pointer ${isKycApproved ? "text-gray-400 hover:text-rose-600 hover:bg-rose-50" : "text-gray-300 cursor-not-allowed"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											})
										})
									]
								}, p.id);
							})
						})]
					})
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-10 w-10 text-gray-300 mx-auto mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-gray-800",
						children: "No products match your filter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-500 mt-0.5",
						children: "Try adjusting your search query or add a new product to your catalog."
					})
				]
			}),
			isAddModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddProductModal, {
				isOpen: isAddModalOpen,
				onClose: () => {
					setIsAddModalOpen(false);
					setEditingProduct(null);
				},
				vendor,
				productToEdit: editingProduct
			})
		]
	});
}
function InventorySection({ vendor }) {
	const { products, updateProduct } = useVendorStore();
	const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
	const isKycApproved = vendor.status === "approved";
	const [stockDrafts, setStockDrafts] = (0, import_react.useState)({});
	const [thresholdDrafts, setThresholdDrafts] = (0, import_react.useState)({});
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [autoHideOutOfStock, setAutoHideOutOfStock] = (0, import_react.useState)(true);
	const handleStockChange = (productId, val) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying inventory.");
			return;
		}
		setStockDrafts((prev) => ({
			...prev,
			[productId]: Math.max(0, val)
		}));
	};
	const handleThresholdChange = (productId, val) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying thresholds.");
			return;
		}
		setThresholdDrafts((prev) => ({
			...prev,
			[productId]: Math.max(0, val)
		}));
	};
	const handleSaveRow = (productId) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying inventory.");
			return;
		}
		const newStock = stockDrafts[productId];
		const newThreshold = thresholdDrafts[productId];
		const updates = {};
		if (newStock !== void 0) updates.stock = newStock;
		if (newThreshold !== void 0) updates.minStockAlert = newThreshold;
		updateProduct(productId, updates);
		toast.success("Inventory stock levels updated!");
	};
	const handleQuickAdd = (productId, currentStock, addQty) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying inventory.");
			return;
		}
		const updated = currentStock + addQty;
		updateProduct(productId, { stock: updated });
		toast.success(`Restocked +${addQty} units! Current stock: ${updated}`);
	};
	const filtered = vendorProducts.filter((p) => {
		if (!searchQuery) return true;
		const q = searchQuery.toLowerCase();
		return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 sm:space-y-6",
		children: [
			!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl sm:rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-bold text-amber-900",
									children: "Inventory Management Locked — KYC Verification Pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900",
									children: ["Status: ", vendor.status.replace("_", " ")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-amber-800 leading-relaxed",
								children: "Stock updates, quick restock actions, and low-inventory threshold modifications will be unlocked once your seller KYC is approved by RiderzPro administration."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/vendor/pending",
									className: "inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Check Verification Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-black text-xl text-gray-900",
					children: "Inventory Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Real-time per-SKU stock control, low-inventory warning thresholds, and auto-hide settings."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-2xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: autoHideOutOfStock,
							onChange: (e) => {
								setAutoHideOutOfStock(e.target.checked);
								toast.info(e.target.checked ? "Enabled auto-hide for 0-stock listings" : "Disabled auto-hide: out of stock items will show 'Unavailable' label");
							},
							className: "accent-[#E31E24] h-4 w-4 rounded"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Auto-hide out of stock" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					placeholder: "Filter inventory by SKU or name...",
					className: "w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E31E24]"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: filtered.map((p) => {
					const currentStock = stockDrafts[p.id] !== void 0 ? stockDrafts[p.id] : p.stock;
					const currentThreshold = thresholdDrafts[p.id] !== void 0 ? thresholdDrafts[p.id] : p.minStockAlert || 3;
					const isLow = currentStock <= currentThreshold;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-xs text-gray-900 truncate",
										children: p.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[11px] text-gray-400 mt-0.5",
										children: ["SKU: ", p.sku]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: currentStock === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700",
									children: "Out of Stock"
								}) : isLow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Low Stock"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Healthy"]
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold text-gray-500 block mb-1",
									children: "Available Units"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									disabled: !isKycApproved,
									value: currentStock,
									onChange: (e) => handleStockChange(p.id, Number(e.target.value)),
									className: `w-full px-2 py-1.5 rounded-lg border border-gray-200 font-bold font-mono text-center text-xs bg-white ${!isKycApproved ? "opacity-60 cursor-not-allowed" : ""}`
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold text-gray-500 block mb-1",
									children: "Alert Threshold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									disabled: !isKycApproved,
									value: currentThreshold,
									onChange: (e) => handleThresholdChange(p.id, Number(e.target.value)),
									className: `w-full px-2 py-1.5 rounded-lg border border-gray-200 text-center font-semibold text-xs bg-white ${!isKycApproved ? "opacity-60 cursor-not-allowed" : ""}`
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 pt-1 border-t border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-gray-400 font-medium",
											children: "Restock:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleQuickAdd(p.id, p.stock, 5),
											disabled: !isKycApproved,
											className: `px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isKycApproved ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`,
											children: "+5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleQuickAdd(p.id, p.stock, 20),
											disabled: !isKycApproved,
											className: `px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isKycApproved ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`,
											children: "+20"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSaveRow(p.id),
									disabled: !isKycApproved,
									className: `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${isKycApproved ? "bg-gray-900 text-white hover:bg-black cursor-pointer shadow-2xs" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`,
									children: [isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })]
								})]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Product & SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Available Units"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Restock Shortcut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Low-Stock Alert Threshold"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Stock Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "Update"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-gray-100",
						children: filtered.map((p) => {
							const currentStock = stockDrafts[p.id] !== void 0 ? stockDrafts[p.id] : p.stock;
							const currentThreshold = thresholdDrafts[p.id] !== void 0 ? thresholdDrafts[p.id] : p.minStockAlert || 3;
							const isLow = currentStock <= currentThreshold;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/70 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-gray-900",
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-[11px] text-gray-400",
											children: ["SKU: ", p.sku]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											disabled: !isKycApproved,
											value: currentStock,
											onChange: (e) => handleStockChange(p.id, Number(e.target.value)),
											className: `w-24 px-2.5 py-1.5 rounded-xl border border-gray-200 font-bold font-mono text-center text-gray-900 focus:border-[#E31E24] ${!isKycApproved ? "opacity-60 cursor-not-allowed" : ""}`
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleQuickAdd(p.id, p.stock, 5),
												disabled: !isKycApproved,
												className: `px-2 py-1 rounded-lg text-[10px] font-bold transition ${isKycApproved ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`,
												children: "+5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleQuickAdd(p.id, p.stock, 20),
												disabled: !isKycApproved,
												className: `px-2 py-1 rounded-lg text-[10px] font-bold transition ${isKycApproved ? "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`,
												children: "+20"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 1,
											disabled: !isKycApproved,
											value: currentThreshold,
											onChange: (e) => handleThresholdChange(p.id, Number(e.target.value)),
											className: `w-20 px-2 py-1 rounded-xl border border-gray-200 text-center font-semibold text-gray-700 ${!isKycApproved ? "opacity-60 cursor-not-allowed" : ""}`
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: currentStock === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700",
											children: "Out of Stock"
										}) : isLow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Low Stock"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Healthy"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleSaveRow(p.id),
											disabled: !isKycApproved,
											className: `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${isKycApproved ? "bg-gray-900 text-white hover:bg-black cursor-pointer shadow-2xs" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`,
											children: [isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })]
										})
									})
								]
							}, p.id);
						})
					})]
				})
			})
		]
	});
}
function PricingSection({ vendor }) {
	const { products, updateProduct } = useVendorStore();
	const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
	const isKycApproved = vendor.status === "approved";
	const commissionRate = vendor.commissionRate || 10;
	const [priceDrafts, setPriceDrafts] = (0, import_react.useState)({});
	const handlePriceChange = (productId, val) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying prices.");
			return;
		}
		setPriceDrafts((prev) => ({
			...prev,
			[productId]: Math.max(0, val)
		}));
	};
	const handleSavePrice = (p) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before modifying prices.");
			return;
		}
		const newPrice = priceDrafts[p.id];
		if (newPrice === void 0) return;
		if (newPrice > p.mrp) {
			toast.error("Selling price cannot exceed MRP");
			return;
		}
		updateProduct(p.id, { sellingPrice: newPrice });
		toast.success(`Selling price for "${p.title}" updated to ${inr(newPrice)}!`);
	};
	const handleDownloadPricingCsv = () => {
		let csv = "SKU,Title,MRP,CurrentSellingPrice,NewSellingPrice\n";
		vendorProducts.forEach((p) => {
			csv += `"${p.sku}","${p.title.replace(/"/g, "\"\"")}",${p.mrp},${p.sellingPrice},${p.sellingPrice}\n`;
		});
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `riderzpro_pricing_${vendor.id}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const handleUploadPricingCsv = (e) => {
		if (!isKycApproved) {
			toast.error("Action blocked: Your seller KYC must be approved by admin before updating prices.");
			return;
		}
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const lines = (event.target?.result).split("\n").filter((l) => l.trim().length > 0);
			let updatedCount = 0;
			for (let i = 1; i < lines.length; i++) {
				const cols = lines[i].split(",").map((c) => c.replace(/^"|"$/g, "").trim());
				if (cols.length < 5) continue;
				const [sku, , , , newPriceStr] = cols;
				const newPrice = Number(newPriceStr);
				if (!isNaN(newPrice) && newPrice > 0) {
					const match = vendorProducts.find((p) => p.sku === sku);
					if (match && newPrice <= match.mrp) {
						updateProduct(match.id, { sellingPrice: newPrice });
						updatedCount++;
					}
				}
			}
			toast.success(`Updated pricing for ${updatedCount} products via CSV!`);
		};
		reader.readAsText(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 sm:space-y-6",
		children: [
			!isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl sm:rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-bold text-amber-900",
									children: "Pricing Operations Locked — KYC Verification Pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900",
									children: ["Status: ", vendor.status.replace("_", " ")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-amber-800 leading-relaxed",
								children: "Selling price edits, promotional discounts, and bulk CSV uploads will unlock once your merchant KYC application is approved by the admin team."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/vendor/pending",
									className: "inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Check Verification Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-black text-xl text-gray-900",
					children: "Pricing, Margins & Offers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: [
						"Optimize catalogue pricing, view net payout margins after RiderzPro marketplace commission (",
						commissionRate,
						"%), and perform bulk CSV price updates."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleDownloadPricingCsv,
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition ${isKycApproved ? "bg-gray-900 hover:bg-black text-white cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"}`,
						children: [
							isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bulk CSV" }),
							isKycApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".csv",
								onChange: handleUploadPricingCsv,
								className: "hidden"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl sm:rounded-3xl border border-gray-200 bg-gradient-to-r from-red-50/50 via-white to-gray-50 p-4 sm:p-5 shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-xl bg-[#E31E24] text-white flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-bold text-gray-900",
							children: [
								"Your Tier Commission: ",
								commissionRate,
								"%"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-gray-600 leading-relaxed",
							children: [
								"Net Seller Payout = Selling Price - Commission (",
								commissionRate,
								"%) - 18% GST on Commission - 1% TCS / TDS statutory deduction."
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden space-y-3",
				children: vendorProducts.map((p) => {
					const currentSellingPrice = priceDrafts[p.id] !== void 0 ? priceDrafts[p.id] : p.sellingPrice;
					const discountPct = p.mrp > currentSellingPrice ? Math.round((p.mrp - currentSellingPrice) / p.mrp * 100) : 0;
					const commFee = Math.round(currentSellingPrice * (commissionRate / 100));
					const gstOnComm = Math.round(commFee * .18);
					const tcs = Math.round(currentSellingPrice * .01);
					const netMargin = currentSellingPrice - commFee - gstOnComm - tcs;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-xs text-gray-900 truncate",
										children: p.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[11px] text-gray-400 mt-0.5",
										children: [
											"SKU: ",
											p.sku,
											" · MRP ",
											inr(p.mrp)
										]
									})]
								}), discountPct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-red-50 text-[#E31E24] px-2 py-0.5 text-[10px] font-bold shrink-0",
									children: [discountPct, "% OFF"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold text-gray-500 block mb-1",
									children: "Selling Price (₹)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									disabled: !isKycApproved,
									value: currentSellingPrice,
									onChange: (e) => handlePriceChange(p.id, Number(e.target.value)),
									className: `w-full px-2 py-1.5 rounded-lg border border-gray-200 font-bold font-mono text-center text-xs bg-white text-emerald-800 ${!isKycApproved ? "opacity-60 cursor-not-allowed" : ""}`
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold text-gray-500 block mb-1",
									children: "Net Payout Est."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-center font-mono font-bold text-xs text-gray-900",
									children: inr(netMargin)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-gray-500",
									children: [
										"Fee: ",
										inr(commFee),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-gray-400",
											children: [
												"(+",
												gstOnComm,
												" GST)"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSavePrice(p),
									disabled: !isKycApproved,
									className: `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${isKycApproved ? "bg-gray-900 text-white hover:bg-black cursor-pointer shadow-2xs" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`,
									children: [isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })]
								})]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Product & SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "MRP (₹)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Selling Price (₹)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Discount %"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
								className: "py-3 px-4",
								children: [
									"Marketplace Fee (",
									commissionRate,
									"%)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Net Margin Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "Update"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-gray-100",
						children: vendorProducts.map((p) => {
							const currentSellingPrice = priceDrafts[p.id] !== void 0 ? priceDrafts[p.id] : p.sellingPrice;
							const discountPct = p.mrp > currentSellingPrice ? Math.round((p.mrp - currentSellingPrice) / p.mrp * 100) : 0;
							const commFee = Math.round(currentSellingPrice * (commissionRate / 100));
							const gstOnComm = Math.round(commFee * .18);
							const tcs = Math.round(currentSellingPrice * .01);
							const netMargin = currentSellingPrice - commFee - gstOnComm - tcs;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/70 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-gray-900",
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-[11px] text-gray-400",
											children: ["SKU: ", p.sku]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 font-mono text-gray-500",
										children: inr(p.mrp)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											disabled: !isKycApproved,
											value: currentSellingPrice,
											onChange: (e) => handlePriceChange(p.id, Number(e.target.value)),
											className: `w-28 px-2.5 py-1.5 rounded-xl border border-gray-200 font-bold font-mono text-emerald-800 focus:border-[#E31E24] ${!isKycApproved ? "opacity-60 cursor-not-allowed" : ""}`
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-md bg-red-50 text-[#E31E24] px-2 py-0.5 text-[10px] font-bold",
											children: [discountPct, "% OFF"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4 font-mono text-gray-600",
										children: [inr(commFee), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-gray-400 block",
											children: [
												"+ ₹",
												gstOnComm,
												" GST"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-gray-900",
											children: inr(netMargin)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-emerald-600 font-semibold block",
											children: [
												"~",
												Math.round(netMargin / currentSellingPrice * 100),
												"% of price"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleSavePrice(p),
											disabled: !isKycApproved,
											className: `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${isKycApproved ? "bg-gray-900 text-white hover:bg-black cursor-pointer shadow-2xs" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`,
											children: [isKycApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })]
										})
									})
								]
							}, p.id);
						})
					})]
				})
			})
		]
	});
}
function PaymentsSection({ vendor }) {
	const { settlements, requestBankUpdate } = useVendorStore();
	const [isBankModalOpen, setIsBankModalOpen] = (0, import_react.useState)(false);
	const [newAccHolder, setNewAccHolder] = (0, import_react.useState)(vendor.onboarding?.bank?.accountHolderName || "");
	const [newAccNumber, setNewAccNumber] = (0, import_react.useState)("");
	const [newIfsc, setNewIfsc] = (0, import_react.useState)("");
	const vendorSettlements = settlements.filter((s) => s.vendorId === vendor.id);
	const pendingBalance = vendorSettlements.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.netPayout, 38400);
	const processingBalance = vendorSettlements.filter((s) => s.status === "processing").reduce((sum, s) => sum + s.netPayout, 18500);
	const totalPaidOut = vendorSettlements.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.netPayout, 245e3);
	const handleDownloadStatement = () => {
		let csv = "SettlementID,PeriodStart,PeriodEnd,OrderIDs,GrossSales,CommissionDeduction,GstOnCommission,TcsDeduction,NetPayout,Status\n";
		vendorSettlements.forEach((s) => {
			csv += `"${s.id}","${s.periodStart}","${s.periodEnd}","${s.orderIds.join(";")} ",${s.grossSales},${s.commissionAmount},${s.gstOnCommission},${s.tcsTdsDeduction},${s.netPayout},"${s.status}"\n`;
		});
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `riderzpro_statement_${vendor.id}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Statement CSV downloaded!");
	};
	const handleBankSubmit = (e) => {
		e.preventDefault();
		if (!newAccNumber || !newIfsc) {
			toast.error("Please fill all bank details");
			return;
		}
		requestBankUpdate(vendor.id, {
			accountHolderName: newAccHolder,
			accountNumber: newAccNumber,
			ifscCode: newIfsc.toUpperCase(),
			bankName: "HDFC Bank (Updated)"
		});
		toast.info("Bank account change request submitted for admin review & re-verification.");
		setIsBankModalOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-black text-xl text-gray-900",
					children: "Payments, Settlements & Wallet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Automatic T+7 payout cycles after verified delivery, fee breakdowns and bank management."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleDownloadStatement,
					className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-2xs transition cursor-pointer shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Download Statement (CSV)"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending Payout (In Delivery Cycle)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: inr(pendingBalance)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-400 mt-1",
								children: "Next payout batch: Every Tuesday"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Processing by Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: inr(processingBalance)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-blue-600 font-semibold mt-1",
								children: "NEFT batch queued"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Payouts Completed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: inr(totalPaidOut)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-600 font-semibold mt-1",
								children: "100% on-time settlement"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-sm text-gray-900",
								children: "Settlement Bank Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Verified Penny Drop"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-600 font-mono mt-1",
							children: [
								"Account: ",
								vendor.onboarding?.bank?.maskedAccountNumber || "XXXXXX1234",
								" · IFSC:",
								" ",
								vendor.onboarding?.bank?.ifscCode || "HDFC0001234",
								" ·",
								" ",
								vendor.onboarding?.bank?.bankName || "HDFC Bank"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-gray-400 mt-0.5",
							children: ["Account Holder: ", vendor.onboarding?.bank?.accountHolderName || vendor.storeName]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsBankModalOpen(true),
					className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition cursor-pointer shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" }), "Request Account Change"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold text-xs uppercase tracking-wider text-gray-700",
						children: "Settlement Cycles & Per-Order Fee Breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-gray-500",
						children: "T+7 Delivery Basis"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs border-collapse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-gray-200 bg-white text-[11px] font-bold text-gray-500 uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Cycle ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Period"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Gross Sales"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Commission"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "TCS / TDS (1%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Net Payout"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4 text-right",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-gray-100",
						children: vendorSettlements.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-gray-50/70 transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 font-mono font-bold text-gray-900",
									children: s.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 text-gray-600",
									children: [
										s.periodStart,
										" to ",
										s.periodEnd
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 font-mono font-bold text-gray-900",
									children: inr(s.grossSales)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 font-mono text-gray-500",
									children: [
										"-",
										inr(s.commissionAmount),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-gray-400 block",
											children: [
												"+",
												inr(s.gstOnCommission),
												" GST"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 font-mono text-gray-500",
									children: ["-", inr(s.tcsTdsDeduction)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3.5 px-4 font-mono font-black text-emerald-800 text-sm",
									children: inr(s.netPayout)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3.5 px-4 text-right",
									children: [
										s.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Settled"]
										}),
										s.status === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Processing"]
										}),
										s.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700",
											children: "Pending"
										})
									]
								})
							]
						}, s.id))
					})]
				})]
			}),
			isBankModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-bold text-base text-gray-900",
							children: "Request Bank Account Update"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "To prevent unauthorized changes, modifying settlement bank details requires penny-drop verification and admin approval before payouts shift."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleBankSubmit,
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "Account Holder Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newAccHolder,
									onChange: (e) => setNewAccHolder(e.target.value),
									className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "New Account Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newAccNumber,
									onChange: (e) => setNewAccNumber(e.target.value),
									placeholder: "e.g. 50100234567890",
									className: "w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5 font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "IFSC Code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newIfsc,
									onChange: (e) => setNewIfsc(e.target.value.toUpperCase()),
									placeholder: "e.g. HDFC0001234",
									className: "w-full text-xs font-mono uppercase rounded-xl border border-gray-200 p-2.5 font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setIsBankModalOpen(false),
										className: "px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "px-5 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700",
										children: "Submit for Re-verification"
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
function ReturnsSection({ vendor }) {
	const [claims, setClaims] = (0, import_react.useState)([{
		id: "CLM-84920",
		orderId: "RZ-849201",
		productName: "VoltRide 60V 30Ah Li-ion Pack",
		customerName: "Aakash S.",
		reason: "BMS not balancing cell group 4 during 60V rapid charge",
		requestedDate: "Today, 10:30 AM",
		status: "Pending Vendor Review"
	}, {
		id: "CLM-79342",
		orderId: "RZ-793420",
		productName: "ChargeMax 3.3kW Fast Charger",
		customerName: "Rahul M.",
		reason: "Type-2 latch pin cracked in transit packaging",
		requestedDate: "Yesterday",
		status: "Replacement Approved"
	}]);
	const [activeDisputeClaim, setActiveDisputeClaim] = (0, import_react.useState)(null);
	const [disputeNote, setDisputeNote] = (0, import_react.useState)("");
	const [disputePhoto, setDisputePhoto] = (0, import_react.useState)(null);
	const handleApproveClaim = (claimId) => {
		setClaims((prev) => prev.map((c) => c.id === claimId ? {
			...c,
			status: "Replacement Approved"
		} : c));
		toast.success("Warranty claim approved! Replacement dispatch label generated.");
	};
	const handleDisputeSubmit = () => {
		if (!activeDisputeClaim || !disputeNote.trim()) {
			toast.error("Please explain your dispute reason with photo evidence");
			return;
		}
		setClaims((prev) => prev.map((c) => c.id === activeDisputeClaim.id ? {
			...c,
			status: "Disputed by Vendor",
			disputeNote
		} : c));
		toast.info("Dispute forwarded to RiderzPro Admin Arbitration team.");
		setActiveDisputeClaim(null);
		setDisputeNote("");
		setDisputePhoto(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-black text-xl text-gray-900",
				children: "Returns, Warranty & Claims"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-gray-500 mt-0.5",
				children: "Manage warranty claims for lithium batteries, chargers and electronic controllers with photo arbitration."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: claims.map((claim) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-sm text-gray-900",
								children: claim.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold ${claim.status === "Replacement Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : claim.status === "Disputed by Vendor" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`,
								children: claim.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-500 mt-0.5",
							children: [
								"Order ",
								claim.orderId,
								" · Customer: ",
								claim.customerName,
								" · Requested:",
								" ",
								claim.requestedDate
							]
						})] }), claim.status === "Pending Vendor Review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveDisputeClaim(claim),
								className: "px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer",
								children: "Dispute Claim"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleApproveClaim(claim.id),
								className: "px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition cursor-pointer",
								children: "Approve Replacement"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-gray-50 p-3 text-xs border border-gray-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-gray-800",
								children: "Claim Details & Symptom:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-600 mt-0.5",
								children: claim.reason
							}),
							claim.disputeNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-rose-700 font-semibold border-t border-gray-200 pt-1.5",
								children: ["Vendor Dispute Note: ", claim.disputeNote]
							})
						]
					})]
				}, claim.id))
			}),
			activeDisputeClaim && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-base text-gray-900",
							children: ["Dispute Claim ", activeDisputeClaim.id]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "State the reason (e.g. physical damage outside warranty, customer tampering). Admin will inspect before closing."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Explanation & Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: disputeNote,
							onChange: (e) => setDisputeNote(e.target.value),
							placeholder: "e.g. Battery pack casing seal broken; physical impact detected on terminal...",
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Photo Evidence (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-gray-300 p-4 text-center cursor-pointer hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6 text-gray-400 mx-auto mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-gray-600 font-medium",
								children: disputePhoto ? "Photo Attached" : "Attach inspection photo"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActiveDisputeClaim(null),
								className: "px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleDisputeSubmit,
								className: "px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700",
								children: "Submit Dispute"
							})]
						})
					]
				})
			})
		]
	});
}
function ReviewsSection({ vendor }) {
	const [reviews, setReviews] = (0, import_react.useState)([
		{
			id: "REV-101",
			customerName: "Karthik R.",
			rating: 5,
			productName: "VoltRide 60V 30Ah Li-ion Pack",
			date: "2 days ago",
			comment: "Super fast dispatch! Direct fit on my Ola S1 Pro and getting 115 km range with zero throttle lag.",
			vendorReply: "Thank you Karthik! Glad you are enjoying the smooth performance."
		},
		{
			id: "REV-102",
			customerName: "Pooja V.",
			rating: 4,
			productName: "ChargeMax 3.3kW Fast Charger",
			date: "5 days ago",
			comment: "Solid build quality, charges in under 2 hours. Wire length could be slightly longer."
		},
		{
			id: "REV-103",
			customerName: "Anonymous Rider",
			rating: 1,
			productName: "Wave Disc Brake Rotor",
			date: "1 week ago",
			comment: "Fake seller scam company!!! (Spam review)",
			isFlagged: false
		}
	]);
	const [replyingReviewId, setReplyingReviewId] = (0, import_react.useState)(null);
	const [replyText, setReplyText] = (0, import_react.useState)("");
	const handleSendReply = (reviewId) => {
		if (!replyText.trim()) return;
		setReviews((prev) => prev.map((r) => r.id === reviewId ? {
			...r,
			vendorReply: replyText
		} : r));
		toast.success("Public reply posted!");
		setReplyingReviewId(null);
		setReplyText("");
	};
	const handleFlagReview = (reviewId) => {
		setReviews((prev) => prev.map((r) => r.id === reviewId ? {
			...r,
			isFlagged: true
		} : r));
		toast.info("Review flagged for admin content moderation");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display font-black text-xl text-gray-900",
			children: "Reviews, Ratings & Reputation"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-gray-500 mt-0.5",
			children: "Engage with rider feedback, post official vendor replies, and report abusive or spam reviews."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: reviews.map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center text-amber-400",
									children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${i < rev.rating ? "fill-amber-400" : "text-gray-200 fill-gray-100"}` }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-xs text-gray-900",
									children: rev.customerName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-gray-400",
									children: ["· ", rev.date]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-semibold text-[#E31E24] mt-0.5",
							children: ["Verified Purchase: ", rev.productName]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [!rev.vendorReply && replyingReviewId !== rev.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setReplyingReviewId(rev.id);
									setReplyText("");
								},
								className: "inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-black transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5" }), "Reply"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleFlagReview(rev.id),
								disabled: rev.isFlagged,
								className: `inline-flex items-center gap-1 text-xs font-bold transition cursor-pointer ${rev.isFlagged ? "text-amber-600" : "text-gray-400 hover:text-rose-600"}`,
								title: "Report abusive review to admin",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-3.5 w-3.5" }), rev.isFlagged ? "Reported" : "Report"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-700",
						children: rev.comment
					}),
					rev.vendorReply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-gray-50 p-3 text-xs border border-gray-100 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-gray-900 block",
							children: [
								"Official Reply from ",
								vendor.storeName,
								":"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-600",
							children: rev.vendorReply
						})]
					}),
					replyingReviewId === rev.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-gray-100 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: replyText,
							onChange: (e) => setReplyText(e.target.value),
							placeholder: `Write an official response on behalf of ${vendor.storeName}...`,
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setReplyingReviewId(null),
								className: "px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-black",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleSendReply(rev.id),
								className: "px-4 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black",
								children: "Post Reply"
							})]
						})]
					})
				]
			}, rev.id))
		})]
	});
}
var BIKE_FITMENT_HITS = [
	{
		bike: "Ola S1 Pro",
		hits: 342,
		pct: "38%"
	},
	{
		bike: "Ather 450X",
		hits: 278,
		pct: "31%"
	},
	{
		bike: "Revolt RV400",
		hits: 142,
		pct: "16%"
	},
	{
		bike: "TVS iQube",
		hits: 88,
		pct: "10%"
	},
	{
		bike: "Bajaj Chetak",
		hits: 45,
		pct: "5%"
	}
];
var CITY_SALES = [
	{
		city: "Bengaluru",
		sales: 184e3,
		color: "#E31E24"
	},
	{
		city: "Hyderabad",
		sales: 46e3,
		color: "#2563EB"
	},
	{
		city: "Pune",
		sales: 32e3,
		color: "#16A34A"
	},
	{
		city: "Chennai",
		sales: 22e3,
		color: "#D97706"
	}
];
function AnalyticsSection({ vendor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-black text-xl text-gray-900",
				children: "Store Analytics & Fitment Insights"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-gray-500 mt-0.5",
				children: "Track customer conversion funnel, bike compatibility search impressions, and geographical demand."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Listing Page Views" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-blue-600" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: "14,820"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-600 font-semibold mt-1",
								children: "+24% vs last month"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add-to-Cart Events" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-amber-600" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: "1,240"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-500 mt-1",
								children: "8.4% add-to-cart rate"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Checkout Orders" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: "498"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-600 font-semibold mt-1",
								children: "40.1% cart conversion"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-gray-500 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overall Conversion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-[#E31E24]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-black text-gray-900 mt-2",
								children: "3.36%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-400 mt-1",
								children: "Marketplace benchmark: 2.8%"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display font-bold text-base text-gray-900 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#E31E24]" }), "Customer Fitment Searches"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500",
								children: "EV bike models customers are searching for that matched your inventory"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-2",
							children: BIKE_FITMENT_HITS.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-900",
										children: item.bike
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-gray-500 font-mono",
										children: [
											item.hits,
											" searches (",
											item.pct,
											")"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-gray-100 h-2 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-gradient-to-r from-red-500 to-[#E31E24] h-full rounded-full",
										style: { width: item.pct }
									})
								})]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-gray-400 mt-5 italic",
							children: "Tip: Listing more 60V accessories increases your exposure to Ola S1 Pro and Ather owners."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-base text-gray-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-blue-600" }), "Hyperlocal & Regional Sales"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Sales volume across serviceable cities"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: CITY_SALES,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "#F3F4F6"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "city",
										tick: {
											fontSize: 11,
											fill: "#9CA3AF"
										},
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 11,
											fill: "#9CA3AF"
										},
										axisLine: false,
										tickFormatter: (v) => `₹${v / 1e3}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Sales"],
										contentStyle: {
											borderRadius: "16px",
											border: "1px solid #E5E7EB"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										radius: [
											8,
											8,
											0,
											0
										],
										children: CITY_SALES.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
									})
								]
							})
						})
					})]
				})]
			})
		]
	});
}
function SettingsSection({ vendor }) {
	const { updateVendorOnboarding } = useVendorStore();
	const [storeName, setStoreName] = (0, import_react.useState)(vendor.storeName || "");
	const [tagline, setTagline] = (0, import_react.useState)(vendor.onboarding?.store?.tagline || "");
	const [description, setDescription] = (0, import_react.useState)(vendor.onboarding?.store?.description || "");
	const [prepMins, setPrepMins] = (0, import_react.useState)(vendor.prepMins || vendor.onboarding?.shipping?.prepMins || 15);
	const [holidayMode, setHolidayMode] = (0, import_react.useState)(Boolean(vendor.onboarding?.store?.holidayMode));
	const [line1, setLine1] = (0, import_react.useState)(vendor.onboarding?.shipping?.pickupAddress?.line1 || "Indiranagar Hub");
	const [city, setCity] = (0, import_react.useState)(vendor.onboarding?.shipping?.pickupAddress?.city || "Bengaluru");
	const [pincode, setPincode] = (0, import_react.useState)(vendor.onboarding?.shipping?.pickupAddress?.pincode || "560038");
	const handleSaveStoreProfile = (e) => {
		e.preventDefault();
		updateVendorOnboarding(vendor.id, {
			store: {
				...vendor.onboarding?.store,
				storeName,
				tagline,
				description,
				holidayMode
			},
			shipping: {
				...vendor.onboarding?.shipping,
				prepMins,
				pickupAddress: {
					...vendor.onboarding?.shipping?.pickupAddress,
					line1,
					city,
					pincode
				}
			}
		});
		toast.success(holidayMode ? "Settings saved! Holiday mode is ACTIVE (all customer listings paused)." : "Store profile & shipping preferences updated!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-black text-xl text-gray-900",
				children: "Store Profile & Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-gray-500 mt-0.5",
				children: "Configure store identity, operating hours, holiday mode, prep time, and documents center."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `rounded-3xl border p-5 transition shadow-2xs ${holidayMode ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${holidayMode ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-sm text-gray-900",
								children: "Holiday Mode (Vacation Pause)"
							}), holidayMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-amber-200 text-amber-900 px-2 py-0.5 text-[10px] font-bold",
								children: "Currently Active"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-600 mt-0.5",
							children: "Temporarily pause your products from appearing in customer search and catalog while you take time off or manage inventory offline."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative inline-flex items-center cursor-pointer shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: holidayMode,
							onChange: (e) => setHolidayMode(e.target.checked),
							className: "sr-only peer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E31E24]" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveStoreProfile,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4 text-[#E31E24]" }), "Storefront Identity"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "Store Display Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: storeName,
									onChange: (e) => setStoreName(e.target.value),
									className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "Tagline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: tagline,
									onChange: (e) => setTagline(e.target.value),
									placeholder: "e.g. Authorized EV Spares & Fast Chargers",
									className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-bold text-gray-700 block mb-1",
										children: "Store Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: description,
										onChange: (e) => setDescription(e.target.value),
										className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-[#E31E24]" }), "Fulfilment SLA & Pickup Address"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "Order Prep / Handling Time (Mins)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: prepMins,
									onChange: (e) => setPrepMins(Number(e.target.value)),
									className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium bg-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 10,
											children: "10 Minutes (Express Hyperlocal)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 15,
											children: "15 Minutes (Standard Fast)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 25,
											children: "25 Minutes"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 40,
											children: "40 Minutes"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-bold text-gray-700 block mb-1",
										children: "Pickup Address Line 1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: line1,
										onChange: (e) => setLine1(e.target.value),
										className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: city,
									onChange: (e) => setCity(e.target.value),
									className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-gray-700 block mb-1",
									children: "Pincode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: pincode,
									onChange: (e) => setPincode(e.target.value),
									className: "w-full text-xs font-mono rounded-xl border border-gray-200 p-2.5 font-medium"
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display font-bold text-sm text-gray-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-[#E31E24]" }), "Statutory Documents Centre"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-gray-900",
									children: "GST Registration Certificate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-gray-500 font-mono",
									children: vendor.onboarding?.tax?.gstin || "27AAPFU0939F1ZV"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700",
									children: "Verified"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-gray-900",
									children: "PAN Verification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-gray-500 font-mono",
									children: vendor.onboarding?.tax?.pan || "AAPFU0939F"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700",
									children: "Active"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Settings"]
						})
					})
				]
			})
		]
	});
}
function NotificationsSection({ vendor }) {
	const { notifications, markNotificationRead, markAllNotificationsRead } = useVendorStore();
	const vendorNotifications = notifications.filter((n) => n.vendorId === vendor.id);
	const getIcon = (type) => {
		switch (type) {
			case "order": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-blue-600" });
			case "approval": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" });
			case "payout": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-purple-600" });
			case "stock": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-rose-600" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-[#E31E24]" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-black text-xl text-gray-900",
				children: "Notifications & Alerts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-gray-500 mt-0.5",
				children: "Real-time updates regarding new orders, catalog moderation results, and settlement payouts."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					markAllNotificationsRead();
					toast.success("Marked all notifications as read");
				},
				className: "text-xs font-bold text-[#E31E24] hover:underline cursor-pointer",
				children: "Mark all as read"
			})]
		}), vendorNotifications.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: vendorNotifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => markNotificationRead(n.id),
				className: `rounded-2xl border p-4 transition cursor-pointer flex items-start gap-3.5 ${!n.read ? "bg-red-50/40 border-red-200 shadow-2xs" : "bg-white border-gray-200"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-2xs",
						children: getIcon(n.type)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-xs text-gray-900",
								children: n.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-gray-400 shrink-0",
								children: new Date(n.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-600 mt-0.5",
							children: n.message
						})]
					}),
					!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#E31E24] shrink-0 mt-1" })
				]
			}, n.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-10 w-10 text-gray-300 mx-auto mb-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-gray-800",
					children: "No notifications"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "You're all caught up!"
				})
			]
		})]
	});
}
function SupportSection({ vendor }) {
	const [subject, setSubject] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("Normal");
	const [category, setCategory] = (0, import_react.useState)("Payouts & Invoicing");
	const [message, setMessage] = (0, import_react.useState)("");
	const [submittedTickets, setSubmittedTickets] = (0, import_react.useState)([{
		id: "TCK-492",
		subject: "Query regarding T+7 NEFT settlement timing for weekend deliveries",
		status: "Resolved",
		date: "3 days ago"
	}]);
	const handleSubmitTicket = (e) => {
		e.preventDefault();
		if (!subject.trim() || !message.trim()) {
			toast.error("Please provide both subject and message");
			return;
		}
		const newTicket = {
			id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
			subject,
			status: "Open (Pending Admin)",
			date: "Just now"
		};
		setSubmittedTickets((prev) => [newTicket, ...prev]);
		toast.success("Support ticket raised! Our operations desk will respond shortly.");
		setSubject("");
		setMessage("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display font-black text-xl text-gray-900",
			children: "Seller Help & Support"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-gray-500 mt-0.5",
			children: "Raise operational support requests directly to RiderzPro Admin, or read the vendor guide."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display font-bold text-base text-gray-900 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-4 w-4 text-[#E31E24]" }), "Raise a Support Ticket"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmitTicket,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Topic Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium bg-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Payouts & Invoicing",
									children: "Payouts & Invoicing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Product Moderation Rejection",
									children: "Product Moderation Rejection"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Rider Handover & Pickup Issues",
									children: "Rider Handover & Pickup Issues"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Return / Warranty Disputes",
									children: "Return / Warranty Disputes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Account Settings / Bank Details",
									children: "Account Settings / Bank Details"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							placeholder: "Brief summary of your issue...",
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Detailed Message"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							placeholder: "Include order IDs, SKU numbers or specific details...",
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 font-medium"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E31E24] text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Submit Ticket"]
							})
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-display font-bold text-sm text-gray-900",
						children: "Your Recent Tickets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: submittedTickets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-gray-500 mr-2",
									children: t.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-gray-800",
									children: t.subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-gray-400 mt-0.5",
									children: t.date
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold shrink-0",
								children: t.status
							})]
						}, t.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-display font-bold text-sm text-gray-900 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4 text-[#E31E24]" }), "Quick Seller FAQ"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs text-gray-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "font-bold text-gray-800 hover:text-[#E31E24]",
								children: "When are my payouts settled?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 pl-2 text-gray-500",
								children: "Payouts are settled automatically every Tuesday on a T+7 basis following confirmed customer delivery."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "font-bold text-gray-800 hover:text-[#E31E24]",
								children: "How long does product review take?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 pl-2 text-gray-500",
								children: "Our catalog team verifies specs and fitment within 2 to 4 hours. You'll receive an in-app notice when it goes live."
							})]
						})]
					})]
				})]
			})]
		})]
	});
}
function VendorDashboardRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorRouteGuard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorDashboardContent, {}) });
}
function VendorDashboardContent() {
	const { vendor, currentVendor } = useVendorAuth();
	const activeVendor = vendor || currentVendor;
	const { products } = useVendorStore();
	const { orders } = useStore();
	useNavigate();
	const [activeTab, setActiveTab] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get("tab") || "overview";
		return "overview";
	});
	const handleSelectTab = (tab) => {
		setActiveTab(tab);
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("tab", tab);
			window.history.replaceState({}, "", url.toString());
		}
	};
	(0, import_react.useEffect)(() => {
		const handlePopState = () => {
			const t = new URLSearchParams(window.location.search).get("tab");
			if (t) setActiveTab(t);
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);
	if (!activeVendor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-[#F5F6F8] p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-gray-900",
					children: "Vendor Session Required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500",
					children: "Please sign in with your vendor credentials to access the dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/vendor/auth",
					className: "inline-block rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition",
					children: "Go to Vendor Sign In"
				})
			]
		})
	});
	const vendorProducts = products.filter((p) => p.vendorId === activeVendor.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorDashboardShell, {
		vendor: activeVendor,
		activeSection: activeTab,
		onSelectSection: handleSelectTab,
		children: [
			activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewSection, {
				vendor: activeVendor,
				products: vendorProducts,
				orders,
				onNavigateTab: handleSelectTab
			}),
			activeTab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersSection, { vendor: activeVendor }),
			activeTab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsSection, { vendor: activeVendor }),
			activeTab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventorySection, { vendor: activeVendor }),
			activeTab === "pricing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingSection, { vendor: activeVendor }),
			activeTab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentsSection, { vendor: activeVendor }),
			activeTab === "returns" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnsSection, { vendor: activeVendor }),
			activeTab === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsSection, { vendor: activeVendor }),
			activeTab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsSection, { vendor: activeVendor }),
			activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSection, { vendor: activeVendor }),
			activeTab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsSection, { vendor: activeVendor }),
			activeTab === "support" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportSection, { vendor: activeVendor })
		]
	});
}
//#endregion
export { VendorDashboardRoute as component };

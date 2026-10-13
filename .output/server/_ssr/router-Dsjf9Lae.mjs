import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $t as Box, A as Settings2, B as Plus, Et as ExternalLink, F as RotateCcw, Ft as CircleCheck, Gt as ChartColumn, I as RefreshCw, Jt as Calendar, K as Package, M as Search, Ot as CreditCard, S as SlidersVertical, ct as LayoutDashboard, fn as Archive, ft as IndianRupee, i as Users, jt as Clock, l as Truck, lt as Layers, m as Tag, n as X, nn as Bell, t as Zap, u as TriangleAlert, xt as FileText } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { S as Navigate, _ as Outlet, b as createRootRouteWithContext, d as Scripts, f as HeadContent, g as createRouter, m as useRouterState, v as lazyRouteComponent, w as useRouter, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as VendorStoreProvider } from "./vendorStore-jyyPc83P.mjs";
import { _ as inr, h as getVendor, m as getProduct, y as products } from "./data-C7OlInRR.mjs";
import { t as AdminAuthProvider } from "./adminAuth-DGnzUy2F.mjs";
import { a as StoreProvider, n as Logo, r as ORDER_STEPS, s as useStore } from "./bits-BhX7Ijve.mjs";
import { t as AuthProvider } from "./auth-ga-2flKS.mjs";
import { t as Route$34 } from "./auth-C1_v42If.mjs";
import { t as Route$35 } from "./product._id-DQcwEPp_.mjs";
import { t as VendorAuthProvider } from "./vendorAuth-DcYgxaTS.mjs";
import { t as Route$36 } from "./signup-DUBbWY4e.mjs";
import { t as Route$37 } from "./store._slug-DVP76Tmn.mjs";
import { t as Route$38 } from "./track._id-wwJD7Bwl.mjs";
import { t as Route$39 } from "./vendor.auth-3J0TZcFH.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dsjf9Lae.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C7t7YEWk.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (/^\/(technician|workshop|dashboards|dashboard\/(rider|workshop))/i.test(pathname)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$33 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Riderzpro — EV Batteries & Parts Marketplace" },
			{
				name: "description",
				content: "Find EV batteries and parts that fit your bike, order from many sellers at once and track delivery live."
			},
			{
				name: "theme-color",
				content: "#ffffff"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				property: "og:title",
				content: "Riderzpro — EV Batteries & Parts Marketplace"
			},
			{
				property: "og:description",
				content: "Find EV batteries and parts that fit your bike, order from many sellers at once and track delivery live."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$33.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorStoreProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] }) }) }) }) })
	});
}
var $$splitComponentImporter$31 = () => import("./routes-D0xkBi-m.mjs");
var Route$32 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Riderzpro — EV batteries & parts that fit your bike" },
		{
			name: "description",
			content: "Batteries, chargers and spares matched to your vehicle, delivered by riders you can track."
		},
		{
			property: "og:title",
			content: "Riderzpro — EV batteries & parts that fit your bike"
		},
		{
			property: "og:description",
			content: "Batteries, chargers and spares matched to your vehicle, delivered by riders you can track."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./admin-DyrwkSPn.mjs");
var Route$31 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./assistant-ztOgLgLz.mjs");
var Route$30 = createFileRoute("/assistant")({
	head: () => ({ meta: [
		{ title: "Volt — voice assistant for EV parts — Riderzpro" },
		{
			name: "description",
			content: "Speak or type what you need and Volt finds compatible EV batteries and parts."
		},
		{
			property: "og:title",
			content: "Volt voice assistant — Riderzpro"
		},
		{
			property: "og:description",
			content: "Find EV parts by voice."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./cart-CiFVeJP4.mjs");
var Route$29 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Shopping Cart & Checkout — RiderzPro" },
		{
			name: "description",
			content: "Review items, select doorstep delivery address, apply coupon, and place verified EV parts order."
		},
		{
			property: "og:title",
			content: "Shopping Cart & Checkout — RiderzPro"
		},
		{
			property: "og:description",
			content: "Multi-vendor EV parts checkout with courier delivery."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./garage-BumgjmLV.mjs");
var Route$28 = createFileRoute("/garage")({
	head: () => ({ meta: [
		{ title: "My Garage & VIN lookup — Riderzpro" },
		{
			name: "description",
			content: "Save your EVs and decode your VIN to see only parts that fit."
		},
		{
			property: "og:title",
			content: "My Garage & VIN lookup — Riderzpro"
		},
		{
			property: "og:description",
			content: "Decode your VIN and find compatible EV parts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./login-BhOZo42o.mjs");
var Route$27 = createFileRoute("/login")({
	validateSearch: (search) => {
		const rawRedirect = search["redirect"];
		return { redirect: typeof rawRedirect === "string" ? rawRedirect : void 0 };
	},
	head: () => ({ meta: [
		{ title: "Customer Sign In & Registration — RiderzPro" },
		{
			name: "description",
			content: "Sign in or create your RiderzPro account to manage your electric vehicle garage, order verified spare parts, and book certified doorstep EV service."
		},
		{
			property: "og:title",
			content: "Customer Sign In & Registration — RiderzPro"
		},
		{
			property: "og:description",
			content: "Access your EV ownership, spares, and service dashboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./offers-CfVN2Wib.mjs");
var Route$26 = createFileRoute("/offers")({
	head: () => ({ meta: [{ title: "Offers & Discount Coupons — Riderzpro" }, {
		name: "description",
		content: "Save on EV batteries, chargers, spare parts and accessories with verified discount coupons."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./orders-BKc7Xx_Z.mjs");
var Route$25 = createFileRoute("/orders")({
	head: () => ({ meta: [
		{ title: "My orders — Riderzpro" },
		{
			name: "description",
			content: "All your EV parts orders and their live status."
		},
		{
			property: "og:title",
			content: "My orders — Riderzpro"
		},
		{
			property: "og:description",
			content: "Track all your Riderzpro orders."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./shop-DQtBw8Wk.mjs");
var Route$24 = createFileRoute("/shop")({
	head: () => ({ meta: [
		{ title: "Automotive Store & Spares — RiderzPro" },
		{
			name: "description",
			content: "Electric bikes, car & bike accessories, batteries, fast chargers, and verified spare parts."
		},
		{
			property: "og:title",
			content: "Automotive Store & Spares — RiderzPro"
		},
		{
			property: "og:description",
			content: "Compare automotive parts and accessories from authorized suppliers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./admin.index-PtzN2EI4.mjs");
var Route$23 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Operations Console — RiderzPro Admin" }, {
		name: "description",
		content: "Executive real-time operations console for RiderzPro."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin.ai-assistant-B8RoR-7M.mjs");
var Route$22 = createFileRoute("/admin/ai-assistant")({
	head: () => ({ meta: [{ title: "AI Assistant Telemetry — RiderzPro Admin" }, {
		name: "description",
		content: "Customer EV assistant dialogue logs, resolution benchmarks and human handoffs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./admin.analytics-DK6mQgve.mjs");
var Route$21 = createFileRoute("/admin/analytics")({
	head: () => ({ meta: [{ title: "Analytics & SLA Reports — RiderzPro Admin" }, {
		name: "description",
		content: "Gross merchandise value, delivery speed SLAs, cohort retention and category mix."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./admin.approvals-B-D6msas.mjs");
var Route$20 = createFileRoute("/admin/approvals")({
	head: () => ({ meta: [{ title: "Product Approvals & Moderation — RiderzPro Admin" }, {
		name: "description",
		content: "Review and moderate vendor catalog additions, EV fitment and price compliance."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./admin.customers-CzyA3vSR.mjs");
var Route$19 = createFileRoute("/admin/customers")({
	head: () => ({ meta: [{ title: "Customers — RiderzPro Admin" }, {
		name: "description",
		content: "Customer profiles, connected EV garage vehicles and order history."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./admin.fitment-d8dS14Pi.mjs");
var Route$18 = createFileRoute("/admin/fitment")({
	head: () => ({ meta: [{ title: "Bikes & Fitment Matrix — RiderzPro Admin" }, {
		name: "description",
		content: "EV two-wheeler specifications and parts-vs-bikes compatibility mapping."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin.login-BvJGRhUn.mjs");
var Route$17 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "Admin Console Authentication — RiderzPro" }, {
		name: "description",
		content: "Sign in to the RiderzPro operations and admin console."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin.notifications-C3gVv_1q.mjs");
var Route$16 = createFileRoute("/admin/notifications")({
	head: () => ({ meta: [{ title: "Broadcast Communications — RiderzPro Admin" }, {
		name: "description",
		content: "Targeted push notifications, SMS alerts and customer engagement campaigns."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin.offers-CWY1gMtk.mjs");
var Route$15 = createFileRoute("/admin/offers")({
	head: () => ({ meta: [{ title: "Offers & Coupons — RiderzPro Admin" }, {
		name: "description",
		content: "Promotional discount codes, coupon usage limits and app promo banners."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin.orders-BmCizDtW.mjs");
var Route$14 = createFileRoute("/admin/orders")({
	head: () => ({ meta: [{ title: "Orders Management — RiderzPro Admin" }, {
		name: "description",
		content: "Hyperlocal orders tracking, fitment validation and dispatch routing."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin.payments-CHsLwBvt.mjs");
var Route$13 = createFileRoute("/admin/payments")({
	head: () => ({ meta: [{ title: "Payments & Payouts — RiderzPro Admin" }, {
		name: "description",
		content: "Financial transactions, vendor payouts, rider disbursements and refunds."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin.products-0OwuVpOU.mjs");
var Route$12 = createFileRoute("/admin/products")({
	head: () => ({ meta: [{ title: "Products & Inventory — RiderzPro Admin" }, {
		name: "description",
		content: "EV spare parts catalog, pricing, SKU inventory and compatibility fitment."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin.reviews-BmsO5l-e.mjs");
var Route$11 = createFileRoute("/admin/reviews")({
	head: () => ({ meta: [{ title: "Review Moderation — RiderzPro Admin" }, {
		name: "description",
		content: "Customer product reviews moderation, ratings feedback and sentiment."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.riders-Dk0IqZUJ.mjs");
var Route$10 = createFileRoute("/admin/riders")({
	head: () => ({ meta: [{ title: "Riders & Fleet Operations — RiderzPro Admin" }, {
		name: "description",
		content: "Active hyperlocal dispatch fleet, live GPS radar and shift status."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.sellers-BnDMTu3I.mjs");
var Route$9 = createFileRoute("/admin/sellers")({
	head: () => ({ meta: [{ title: "Sellers & KYC Queue — RiderzPro Admin" }, {
		name: "description",
		content: "Vendor KYC document verification, tier assignments and commission rates."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.settings-2CmC5pPM.mjs");
var Route$8 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [{ title: "System Settings — RiderzPro Admin" }, {
		name: "description",
		content: "Platform policies, delivery geofencing, commission structures and taxation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.support-yRrWeU9y.mjs");
var Route$7 = createFileRoute("/admin/support")({
	head: () => ({ meta: [{ title: "Support Tickets — RiderzPro Admin" }, {
		name: "description",
		content: "Customer and rider support tickets, dispatch disputes and resolutions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.team-36sDoFlo.mjs");
var Route$6 = createFileRoute("/admin/team")({
	head: () => ({ meta: [{ title: "Team & Role Access — RiderzPro Admin" }, {
		name: "description",
		content: "Platform operators, support executives, finance managers and granular permissions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.warranty-Di9LITRo.mjs");
var Route$5 = createFileRoute("/admin/warranty")({
	head: () => ({ meta: [{ title: "Warranty & RMA Claims — RiderzPro Admin" }, {
		name: "description",
		content: "Battery and spare parts warranty claims, defect verifications and RMA."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var Route$4 = createFileRoute("/dashboard/admin")({
	head: () => ({ meta: [
		{ title: "Operations & Admin Console — RiderzPro" },
		{
			name: "description",
			content: "Executive administrative interface for order fulfillment, courier tracking, inventory, and refunds."
		},
		{
			property: "og:title",
			content: "Operations & Admin Console — RiderzPro"
		},
		{
			property: "og:description",
			content: "Manage RiderzPro marketplace, courier shipments, orders and inventory."
		}
	] }),
	component: AdminDashboard
});
function AdminDashboard() {
	const { orders, shipments, createShipment, updateShipmentStatus, processWebhook, inventoryStock, updateInventoryStock, updateOrderStatus, cancelOrder, refundOrder } = useStore();
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [dateRange, setDateRange] = (0, import_react.useState)("7d");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [orderStatusFilter, setOrderStatusFilter] = (0, import_react.useState)("ALL");
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [selectedShipment, setSelectedShipment] = (0, import_react.useState)(null);
	const [testWebhookProvider, setTestWebhookProvider] = (0, import_react.useState)("Delhivery");
	const [testWebhookTracking, setTestWebhookTracking] = (0, import_react.useState)("");
	const [testWebhookStatus, setTestWebhookStatus] = (0, import_react.useState)("In Transit");
	const [testWebhookLocation, setTestWebhookLocation] = (0, import_react.useState)("Whitefield Transit Hub");
	const [lastTestEventId, setLastTestEventId] = (0, import_react.useState)("");
	const [webhookLogs, setWebhookLogs] = (0, import_react.useState)([]);
	const [baseFee, setBaseFee] = (0, import_react.useState)(40);
	const [perKmFee, setPerKmFee] = (0, import_react.useState)(12);
	const [auditLogs, setAuditLogs] = (0, import_react.useState)([
		{
			id: "aud-1",
			timestamp: "10 mins ago",
			actor: "Vikram Malhotra (Ops)",
			action: "Status Transition",
			target: "RZ-849201",
			details: "Dispatched package with Delhivery Express (AWB: DEL984128471)"
		},
		{
			id: "aud-2",
			timestamp: "2 hours ago",
			actor: "System Webhook",
			action: "Checkpoint Scanned",
			target: "RZ-849201",
			details: "Arrived at South Hub Sorting Center, Bommasandra"
		},
		{
			id: "aud-3",
			timestamp: "1 day ago",
			actor: "Anita Sen (Support)",
			action: "Refund Processed",
			target: "RZ-790112",
			details: "Refunded ₹2,400 via Razorpay UPI for returned brake pads"
		}
	]);
	const totalOrdersCount = orders.length + 18;
	const awaitingProcessingCount = orders.filter((o) => o.status === 0).length + 2;
	const readyForDispatchCount = orders.filter((o) => o.status === 1).length + 3;
	const inTransitCount = orders.filter((o) => o.status >= 2 && o.status < 5).length + 4;
	const deliveredCount = orders.filter((o) => o.status === 5).length + 14;
	const delayedOrFailedCount = 1;
	const totalSales = orders.reduce((s, o) => s + o.total, 0) + 184500;
	const lowStockProducts = products.filter((p) => (inventoryStock[p.id] ?? 10) < 5);
	const handleRestock = (productId) => {
		updateInventoryStock(productId, 15);
		toast.success("Inventory restocked (+15 units) successfully");
	};
	const handleAdvanceOrderStatus = (orderId, currentStatus) => {
		if (currentStatus >= 5) {
			toast.info("Order is already fully delivered");
			return;
		}
		const nextStatus = currentStatus + 1;
		updateOrderStatus(orderId, nextStatus);
		const newEntry = {
			id: `aud-${Date.now()}`,
			timestamp: "Just now",
			actor: "Admin (Vikram Malhotra)",
			action: "Status Transition",
			target: orderId,
			details: `Transitioned status to ${ORDER_STEPS[nextStatus]}`
		};
		setAuditLogs((prev) => [newEntry, ...prev]);
		toast.success(`Order ${orderId} updated to: ${ORDER_STEPS[nextStatus]}`);
		if (selectedOrder?.id === orderId) setSelectedOrder((prev) => prev ? {
			...prev,
			status: nextStatus
		} : null);
	};
	const handleProcessRefund = (orderId) => {
		refundOrder(orderId, "Customer return request approved by admin");
		toast.success(`Refund of order ${orderId} processed via payment gateway`);
		const newEntry = {
			id: `aud-${Date.now()}`,
			timestamp: "Just now",
			actor: "Admin (Vikram Malhotra)",
			action: "Refund Initiated",
			target: orderId,
			details: `Full refund authorization processed & recorded`
		};
		setAuditLogs((prev) => [newEntry, ...prev]);
	};
	const handleCancelOrder = (orderId, reason = "Cancelled by admin request") => {
		cancelOrder(orderId, reason);
		const newEntry = {
			id: `aud-${Date.now()}`,
			timestamp: "Just now",
			actor: "Admin (Vikram Malhotra)",
			action: "Order Cancelled",
			target: orderId,
			details: `Cancelled (${reason}). Inventory automatically returned.`
		};
		setAuditLogs((prev) => [newEntry, ...prev]);
		toast.success(`Order ${orderId} cancelled. Stock units restored.`);
		if (selectedOrder?.id === orderId) setSelectedOrder(null);
	};
	const handleCreateCourierShipment = (order, courier) => {
		const newShp = createShipment({
			orderId: order.id,
			provider: courier,
			pickupAddress: {
				name: "RiderzPro Central Hub",
				street: "Electronic City Phase 1",
				city: "Bengaluru",
				pincode: "560100",
				phone: "+91 80 4000 1100"
			},
			destinationAddress: order.shippingAddress || {
				name: order.customerName || "Customer",
				street: "Doorstep Location",
				city: "Bengaluru",
				pincode: "560103",
				phone: order.customerPhone || "+91 98765 43210"
			},
			weightKg: 3.5,
			itemDescription: `EV Spares & Components`,
			orderValue: order.total
		});
		const newEntry = {
			id: `aud-${Date.now()}`,
			timestamp: "Just now",
			actor: "Admin (Vikram Malhotra)",
			action: "Courier Manifest Created",
			target: order.id,
			details: `Manifested with ${courier} (AWB: ${newShp.trackingNumber})`
		};
		setAuditLogs((prev) => [newEntry, ...prev]);
		toast.success(`Shipment manifested with ${courier}! AWB: ${newShp.trackingNumber}`);
		if (selectedOrder?.id === order.id) setSelectedOrder((prev) => prev ? {
			...prev,
			shipmentId: newShp.shipmentId,
			status: 3
		} : null);
	};
	const filteredOrders = (0, import_react.useMemo)(() => {
		return orders.filter((o) => {
			if (!(qMatches(o.id, searchQuery) || o.groups.some((g) => g.items.some((it) => qMatches(getProduct(it.productId)?.name || "", searchQuery))))) return false;
			if (orderStatusFilter === "ALL") return true;
			if (orderStatusFilter === "PLACED") return o.status === 0;
			if (orderStatusFilter === "CONFIRMED") return o.status === 1;
			if (orderStatusFilter === "TRANSIT") return o.status >= 2 && o.status <= 4;
			if (orderStatusFilter === "DELIVERED") return o.status === 5;
			return true;
		});
	}, [
		orders,
		searchQuery,
		orderStatusFilter
	]);
	function qMatches(val, q) {
		return val.toLowerCase().includes(q.toLowerCase());
	}
	const navItems = [
		{
			id: "overview",
			label: "Dashboard",
			Icon: LayoutDashboard
		},
		{
			id: "orders",
			label: "Orders",
			Icon: Package,
			badge: `${awaitingProcessingCount + readyForDispatchCount}`
		},
		{
			id: "shipments",
			label: "Shipments & Tracking",
			Icon: Truck,
			badge: `${inTransitCount}`
		},
		{
			id: "products",
			label: "Products",
			Icon: Box
		},
		{
			id: "categories",
			label: "Categories",
			Icon: Layers
		},
		{
			id: "inventory",
			label: "Inventory",
			Icon: Archive,
			badge: lowStockProducts.length > 0 ? `${lowStockProducts.length} Low` : void 0
		},
		{
			id: "customers",
			label: "Customers",
			Icon: Users
		},
		{
			id: "payments",
			label: "Payments & Refunds",
			Icon: CreditCard
		},
		{
			id: "returns",
			label: "Returns & Cancellations",
			Icon: RotateCcw
		},
		{
			id: "offers",
			label: "Offers & Coupons",
			Icon: Tag
		},
		{
			id: "reports",
			label: "Reports & Analytics",
			Icon: ChartColumn
		},
		{
			id: "notifications",
			label: "Notifications",
			Icon: Bell
		},
		{
			id: "integrations",
			label: "Delivery Integration Settings",
			Icon: SlidersVertical
		},
		{
			id: "audit",
			label: "Audit Logs",
			Icon: FileText
		},
		{
			id: "settings",
			label: "Settings",
			Icon: Settings2
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F5F6F8] text-[#111111] flex flex-col font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-[#E5E7EB] bg-white shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center justify-between px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-black px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider",
								children: "Admin Console"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#6B7280]",
								children: "Operations, Logistics & Inventory"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] px-2 py-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-[#6B7280] mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: dateRange,
									onChange: (e) => setDateRange(e.target.value),
									className: "bg-transparent font-medium text-[#111111] outline-none cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "today",
											children: "Today (Real-time)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "7d",
											children: "Last 7 Days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "30d",
											children: "Last 30 Days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ytd",
											children: "Year to Date (2026)"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard/customer",
								className: "hidden md:flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24] transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer Portal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pl-2 border-l border-gray-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 place-items-center rounded-full bg-[#E31E24] text-xs font-bold text-white shadow-2xs",
									children: "VM"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden lg:block text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-[#111111]",
										children: "Vikram Malhotra"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280]",
										children: "Operations Lead"
									})]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "w-64 border-r border-[#E5E7EB] bg-white p-3 shrink-0 hidden md:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: navItems.map((item) => {
							const isActive = activeTab === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab(item.id),
								className: cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition text-left", isActive ? "bg-red-50 text-[#E31E24] font-semibold border-l-3 border-[#E31E24]" : "text-[#6B7280] hover:bg-gray-100 hover:text-[#111111]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.Icon, { className: cn("h-4 w-4 shrink-0", isActive ? "text-[#E31E24]" : "text-[#6B7280]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									})]
								}), item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-bold", isActive ? "bg-[#E31E24] text-white" : "bg-gray-100 text-gray-700"),
									children: item.badge
								})]
							}, item.id);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 pt-4 border-t border-gray-100 px-3 text-[11px] text-[#6B7280]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-gray-800",
							children: "RiderzPro Core 2.4.0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[10px]",
							children: "Connected to Bluedart & Delhivery Logistics"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden",
					children: [
						activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111]",
										children: "Operational Overview"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#6B7280] mt-0.5",
										children: "Live telemetry across orders, courier dispatches, and warehouse inventory."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => toast.success("Refreshed operational metrics"),
											className: "flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-gray-50 shadow-2xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sync" })]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 md:grid-cols-4 gap-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("orders");
												setOrderStatusFilter("ALL");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Total Orders"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-gray-500" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-[#111111] font-display",
													children: totalOrdersCount
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-emerald-600 font-medium",
													children: "+14% vs last period"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("orders");
												setOrderStatusFilter("PLACED");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Awaiting Processing"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-500" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-amber-600 font-display",
													children: awaitingProcessingCount
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-[#6B7280]",
													children: "Requires vendor accept"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("orders");
												setOrderStatusFilter("CONFIRMED");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Ready for Dispatch"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-4 w-4 text-blue-500" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-blue-600 font-display",
													children: readyForDispatchCount
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-[#6B7280]",
													children: "Packing completed"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("shipments");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Shipments in Transit"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-[#E31E24]" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-[#E31E24] font-display",
													children: inTransitCount
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-[#6B7280]",
													children: "Couriers on route"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("orders");
												setOrderStatusFilter("DELIVERED");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Delivered Orders"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-emerald-700 font-display",
													children: deliveredCount
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-emerald-600 font-medium",
													children: "98.4% on-time SLA"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("shipments");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Delayed / Failed"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-rose-500" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-rose-600 font-display",
													children: delayedOrFailedCount
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-rose-600 font-medium",
													children: "1 weather alert"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("payments");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Gross Sales"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-gray-700" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-[#111111] font-display",
													children: inr(totalSales)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-emerald-600 font-medium",
													children: "Settled to merchants"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setActiveTab("inventory");
											},
											className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs cursor-pointer hover:border-[#E31E24] hover:shadow-sm transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs text-[#6B7280]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold uppercase tracking-wider",
														children: "Low-Stock Items"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4 text-amber-600" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-2xl font-extrabold text-amber-600 font-display",
													children: lowStockProducts.length
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-[11px] text-[#6B7280]",
													children: "Below 5 units threshold"
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-sm text-[#111111]",
												children: "Integrated Courier Logistics Performance"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-[#6B7280]",
												children: "Active API Adapters"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-3",
											children: [
												{
													name: "Delhivery Express",
													shipments: 8,
													status: "Healthy API",
													latency: "142ms",
													color: "bg-emerald-500"
												},
												{
													name: "Bluedart Apex",
													shipments: 5,
													status: "Healthy API",
													latency: "198ms",
													color: "bg-emerald-500"
												},
												{
													name: "Shadowfax Hyperlocal",
													shipments: 3,
													status: "Weather Warning",
													latency: "310ms",
													color: "bg-amber-500"
												},
												{
													name: "RiderzPro Fleet (Dedicated)",
													shipments: 4,
													status: "Real-time Telemetry",
													latency: "42ms",
													color: "bg-emerald-500"
												}
											].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between p-3 rounded-lg bg-[#F5F6F8] border border-gray-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 rounded-full", c.color) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold text-[#111111]",
														children: c.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-[#6B7280]",
														children: [
															c.shipments,
															" packages assigned · Latency ",
															c.latency
														]
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200",
													children: c.status
												})]
											}, c.name))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-sm text-[#111111]",
												children: "Urgent Dispatch Action Queue"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setActiveTab("orders"),
												className: "text-xs font-semibold text-[#E31E24] hover:underline",
												children: "View All Orders →"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2.5",
											children: orders.slice(0, 3).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs font-bold text-[#111111]",
														children: o.id
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded bg-red-50 text-[#E31E24] px-1.5 py-0.5 text-[10px] font-semibold",
														children: ORDER_STEPS[o.status]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-[#6B7280] mt-0.5",
													children: [
														o.groups[0]?.items.length,
														" line items · ",
														inr(o.total)
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setSelectedOrder(o),
														className: "rounded-md border border-[#E5E7EB] px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50",
														children: "Details"
													}), o.status < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleAdvanceOrderStatus(o.id, o.status),
														className: "rounded-md bg-[#E31E24] px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700",
														children: "Advance →"
													})]
												})]
											}, o.id))
										})]
									})]
								})
							]
						}),
						activeTab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl font-extrabold text-[#111111]",
										children: "Order Management"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#6B7280] mt-0.5",
										children: "Search, review status, dispatch and process customer orders."
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex-1 w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 h-4 w-4 text-[#6B7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: searchQuery,
											onChange: (e) => setSearchQuery(e.target.value),
											placeholder: "Search Order ID, customer, parts...",
											className: "h-9 w-full rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] pl-9 pr-3 text-xs text-[#111111] focus:bg-white focus:border-[#E31E24] focus:outline-none"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 w-full sm:w-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-[#6B7280] shrink-0",
											children: "Filter Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: orderStatusFilter,
											onChange: (e) => setOrderStatusFilter(e.target.value),
											className: "rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-medium text-[#111111] outline-none",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "ALL",
													children: "All Statuses"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PLACED",
													children: "Placed (Awaiting Accept)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "CONFIRMED",
													children: "Confirmed / Packing"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "TRANSIT",
													children: "In Transit / Out for Delivery"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "DELIVERED",
													children: "Delivered"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Order ID"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Customer"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Date"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Items"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Total Amount"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Payment"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Fulfillment"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Latest Update"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3 text-right",
													children: "Actions"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-[#E5E7EB]",
											children: filteredOrders.map((o) => {
												const firstProduct = getProduct(o.groups[0]?.items[0]?.productId || "");
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-gray-50/80 transition",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3 font-mono font-bold text-[#111111]",
															children: o.id
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "px-4 py-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-semibold text-gray-900",
																children: "Aakash Sharma"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[10px] text-gray-500",
																children: "Bengaluru"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3 text-[#6B7280]",
															children: new Date(o.createdAt).toLocaleDateString()
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-medium text-gray-800 line-clamp-1 max-w-[150px]",
																children: firstProduct?.name || "Automotive Spare"
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3 font-bold text-[#111111]",
															children: inr(o.total)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold",
																children: [
																	"Paid (",
																	o.payment.split("•")[0].split("·")[0],
																	")"
																]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: cn("rounded px-2 py-0.5 text-[10px] font-bold", o.status === 5 ? "bg-emerald-50 text-emerald-700" : o.status >= 3 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"),
																children: ORDER_STEPS[o.status]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3 text-[#6B7280] text-[11px]",
															children: o.status === 5 ? "Delivered & Signed" : o.status >= 3 ? "Out with Courier" : "Processing at Hub"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "px-4 py-3 text-right space-x-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => setSelectedOrder(o),
																className: "rounded border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100",
																children: "View"
															}), o.status < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => handleAdvanceOrderStatus(o.id, o.status),
																className: "rounded bg-[#E31E24] px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700",
																children: "Step →"
															})]
														})
													]
												}, o.id);
											})
										})]
									})
								})
							]
						}),
						activeTab === "shipments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-extrabold text-[#111111]",
									children: "Shipments & Logistics Tracking"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#6B7280] mt-0.5",
									children: "Integrated courier statuses (Delhivery, Bluedart, Shadowfax, Fleet) with verified facility events."
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Shipment ID"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Courier"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "AWB / Tracking"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Order ID"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Latest Reported Location"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Last Updated"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Est. Delivery"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-right",
												children: "Actions"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#E5E7EB]",
										children: shipments.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-gray-50/80 transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-bold text-[#111111]",
													children: s.shipmentId
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-semibold text-gray-800",
													children: s.provider
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-[#6B7280]",
													children: s.trackingNumber
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-medium text-gray-800",
													children: s.orderId
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("rounded px-2 py-0.5 text-[10px] font-bold", s.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : s.status === "Delayed" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"),
														children: s.status
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-gray-100 text-gray-600 px-1 text-[9px] font-bold",
															children: s.locationType === "Live GPS Telemetry" ? "GPS" : "FACILITY"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-gray-800 font-medium",
															children: s.latestLocation
														})]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-[#6B7280]",
													children: s.lastEventTimestamp
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-[#6B7280]",
													children: s.estimatedDelivery
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setSelectedShipment(s),
														className: "rounded border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer",
														children: "Timeline"
													})
												})
											]
										}, s.shipmentId))
									})]
								})
							})]
						}),
						activeTab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-extrabold text-[#111111]",
									children: "Product Catalog"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#6B7280]",
									children: "Manage automotive parts, electric bikes, and retail pricing."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toast.success("New product modal opened"),
									className: "flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Product" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Product Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Brand"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Category"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Base Price"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Warranty"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Stock Units"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-right",
												children: "Action"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#E5E7EB]",
										children: products.map((p) => {
											const stock = inventoryStock[p.id] ?? 12;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-gray-50/80 transition",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 font-semibold text-gray-900",
														children: p.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 text-[#6B7280]",
														children: p.brand
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-medium",
															children: p.category
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 font-bold text-[#111111]",
														children: inr(p.offers[0]?.price || 0)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "px-4 py-3 text-[#6B7280]",
														children: [p.warrantyMonths, " Months"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 font-semibold",
														children: stock
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => toast.success(`Editing ${p.name}`),
															className: "text-xs text-[#E31E24] font-semibold hover:underline",
															children: "Edit"
														})
													})
												]
											}, p.id);
										})
									})]
								})
							})]
						}),
						activeTab === "categories" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Category Architecture"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
								children: [
									{
										name: "Electric Bikes",
										count: products.filter((product) => product.category === "Electric Bikes").length,
										desc: "Certified high-speed & commuter electric motorbikes & scooters"
									},
									{
										name: "Car Accessories",
										count: 3,
										desc: "Dashcams, tire inflators, level-2 wallbox chargers"
									},
									{
										name: "Bike Accessories",
										count: 3,
										desc: "All-weather covers, alarm disc locks, wireless phone mounts"
									},
									{
										name: "Spare Parts",
										count: 4,
										desc: "Brembo rotors, ceramic pads, Gates kevlar drive belts"
									},
									{
										name: "Battery Packs",
										count: 6,
										desc: "48V, 60V, 72V NMC and LiFePO4 packs with smart BMS"
									},
									{
										name: "Fast Chargers",
										count: 2,
										desc: "3.3kW Type-2 AC chargers and portable home units"
									}
								].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm text-[#111111]",
											children: cat.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700",
											children: [cat.count, " items"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-[#6B7280]",
										children: cat.desc
									})]
								}, cat.name))
							})]
						}),
						activeTab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-extrabold text-[#111111]",
									children: "Inventory & Stock Control"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#6B7280]",
									children: "Reorder thresholds, warehouse levels, and supply restocking."
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Product"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Category"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Available Stock"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Reorder Point"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-right",
												children: "Restock Action"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#E5E7EB]",
										children: products.map((p) => {
											const stock = inventoryStock[p.id] ?? 10;
											const isLow = stock < 5;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-gray-50/80 transition",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 font-semibold text-gray-900",
														children: p.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 text-[#6B7280]",
														children: p.category
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 font-mono font-bold text-base text-[#111111]",
														children: stock
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 text-[#6B7280]",
														children: "5 units"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("rounded px-2 py-0.5 text-[10px] font-bold", isLow ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"),
															children: isLow ? "Low Stock Alert" : "Healthy Stock"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3 text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleRestock(p.id),
															className: "rounded bg-[#E31E24] px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700",
															children: "+ Restock 15 Units"
														})
													})
												]
											}, p.id);
										})
									})]
								})
							})]
						}),
						activeTab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Registered Customers"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Customer Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Email & Phone"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Location"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Registered EV"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Total Orders"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Lifetime GMV"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#E5E7EB]",
										children: [
											{
												name: "Aakash Sharma",
												email: "aakash.sharma@example.com",
												phone: "+91 98765 43210",
												city: "Bengaluru, KA",
												bike: "Ola S1 Pro (60V)",
												orders: 3,
												gmv: 37305
											},
											{
												name: "Pooja Reddy",
												email: "pooja.reddy@example.com",
												phone: "+91 98450 11223",
												city: "Hyderabad, TS",
												bike: "Ather 450X (48V)",
												orders: 2,
												gmv: 18900
											},
											{
												name: "Rahul Verma",
												email: "rahul.v@example.com",
												phone: "+91 99100 44556",
												city: "Pune, MH",
												bike: "Revolt RV400 (72V)",
												orders: 4,
												gmv: 98400
											}
										].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-gray-50/80 transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-semibold text-gray-900",
													children: c.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3 text-[#6B7280]",
													children: [
														c.email,
														" · ",
														c.phone
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: c.city
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-medium text-gray-800",
													children: c.bike
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-bold",
													children: c.orders
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-bold text-[#111111]",
													children: inr(c.gmv)
												})
											]
										}, c.email))
									})]
								})
							})]
						}),
						activeTab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Payments & Gateway Ledger"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Txn Reference"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Order ID"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Gateway / Method"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Amount"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Settlement"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-right",
												children: "Actions"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#E5E7EB]",
										children: [{
											txn: "TXN_UPI_849201",
											order: "RZ-849201",
											method: "Razorpay (Google Pay UPI)",
											amount: 17200,
											status: "Captured"
										}, {
											txn: "TXN_CC_793420",
											order: "RZ-793420",
											method: "HDFC Payment Gateway (Card)",
											amount: 2909,
											status: "Settled"
										}].map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-gray-50/80 transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-bold text-gray-900",
													children: tx.txn
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-gray-700",
													children: tx.order
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-[#6B7280]",
													children: tx.method
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-bold text-[#111111]",
													children: inr(tx.amount)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded bg-emerald-50 text-emerald-800 px-2 py-0.5 text-[10px] font-bold",
														children: tx.status
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleProcessRefund(tx.order),
														className: "rounded border border-gray-200 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50",
														children: "Refund"
													})
												})
											]
										}, tx.txn))
									})]
								})
							})]
						}),
						activeTab === "returns" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Returns & Cancellations (RMA)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-3 border-b border-gray-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-bold text-[#E31E24]",
											children: "RMA-2026-081"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm text-[#111111]",
											children: "Wave Disc Brake Rotor 220mm (Order: RZ-790112)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-[#6B7280]",
											children: "Customer reason: Ordered incorrect caliper bolt pattern for custom swingarm."
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-amber-50 text-amber-700 px-2 py-0.5 text-xs font-bold",
										children: "Inspection Approved"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#6B7280]",
										children: "Restocking destination: Jayanagar Warehouse Hub"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast.success("Item restocked to active inventory"),
										className: "rounded bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800",
										children: "Confirm Restock & Close RMA"
									})]
								})]
							})]
						}),
						activeTab === "offers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-extrabold text-[#111111]",
									children: "Promotions & Coupons"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#6B7280]",
									children: "Create and inspect active discount codes."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toast.success("New coupon creation dialog"),
									className: "rounded-lg bg-[#E31E24] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700",
									children: "+ New Coupon"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									{
										code: "EVSAFE",
										desc: "₹500 off on 60V chargers & diagnostics",
										usage: "142 used",
										active: true
									},
									{
										code: "RIDERZ200",
										desc: "Flat ₹200 off on first spare parts order",
										usage: "389 used",
										active: true
									},
									{
										code: "MONSOON10",
										desc: "10% off waterproofing bike covers",
										usage: "88 used",
										active: false
									}
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-sm font-extrabold text-[#E31E24]",
												children: c.code
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded px-2 py-0.5 text-[10px] font-bold", c.active ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600"),
												children: c.active ? "Active" : "Expired"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-[#111111] font-medium",
											children: c.desc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-[#6B7280]",
											children: c.usage
										})
									]
								}, c.code))
							})]
						}),
						activeTab === "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Logistics & Sales Analytics"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-[#6B7280] uppercase",
												children: "Average Transit Time"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-3xl font-extrabold text-[#111111]",
												children: "34.2 mins"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-emerald-600 font-medium",
												children: "-4.5m improvement vs target"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-[#6B7280] uppercase",
												children: "On-Time SLA Delivery"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-3xl font-extrabold text-[#111111]",
												children: "98.4%"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-emerald-600 font-medium",
												children: "Exceeds 95% contractual SLA"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-[#6B7280] uppercase",
												children: "First-Attempt Delivery Rate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-3xl font-extrabold text-[#111111]",
												children: "96.8%"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-emerald-600 font-medium",
												children: "Minimal customer reschedules"
											})
										]
									})
								]
							})]
						}),
						activeTab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Operations Notifications"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: [
									{
										title: "Low Stock Alert: Kelly 72V 80A Controller",
										time: "15m ago",
										type: "warning"
									},
									{
										title: "Courier Webhook Ping: Delhivery API returned 200 OK",
										time: "1 hour ago",
										type: "info"
									},
									{
										title: "New high-value order RZ-849201 placed by customer",
										time: "2 hours ago",
										type: "order"
									}
								].map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-2xs flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-[#111111]",
										children: n.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#6B7280]",
										children: n.time
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-[#E31E24] bg-red-50 px-2 py-0.5 rounded",
										children: "Unread"
									})]
								}, i))
							})]
						}),
						activeTab === "integrations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Delivery Integration & Pricing Settings"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#6B7280] mt-0.5",
								children: "Configure courier API adapters, webhook secrets, and distance pricing formulas."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-sm text-[#111111] mb-2",
												children: "Distance-Based Delivery Pricing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-[#6B7280] mb-4",
												children: "Fee per vendor = Base fee + (Per km rate × Distance from vendor hub to customer)."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-gray-700",
													children: "Base Fee (₹)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: baseFee,
													onChange: (e) => setBaseFee(+e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#E31E24] focus:outline-none"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-gray-700",
													children: "Per Km Rate (₹)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: perKmFee,
													onChange: (e) => setPerKmFee(+e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#E31E24] focus:outline-none"
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 p-3 rounded-lg bg-[#F5F6F8] border border-gray-200 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-gray-800",
													children: "Example 8 km Delivery calculation:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-gray-600 mt-0.5",
													children: [
														"₹",
														baseFee,
														" + (8 × ₹",
														perKmFee,
														") = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-[#E31E24]",
															children: ["₹", baseFee + 8 * perKmFee]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => toast.success("Delivery pricing saved successfully"),
												className: "mt-4 rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700",
												children: "Save Pricing Changes"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-sm text-[#111111]",
												children: "Courier API Adapters"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold text-gray-700",
												children: "Inbound Webhook Endpoint"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												readOnly: true,
												value: "https://api.riderzpro.com/v1/webhooks/courier-tracking",
												className: "mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-700"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold text-gray-700",
												children: "Webhook Secret Key (HMAC-SHA256)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												readOnly: true,
												value: "rzp_sec_live_9941a87b32c449e0",
												className: "mt-1 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 font-mono text-xs text-gray-700"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 pt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-emerald-800 font-semibold",
													children: "API Credentials Protected on Server Environment"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "lg:col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
													className: "font-bold text-sm text-[#111111] flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interactive Courier Webhook Simulator & Idempotency Testing" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-[#6B7280]",
													children: "Simulate authenticated inbound webhook callbacks from Delhivery, Bluedart, Shadowfax & Fleet. Demonstrates duplicate event prevention."
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200",
													children: "Sandbox Simulation Mode"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-3 sm:grid-cols-4 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block font-semibold text-gray-700 mb-1",
														children: "Provider Adapter"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: testWebhookProvider,
														onChange: (e) => setTestWebhookProvider(e.target.value),
														className: "w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs bg-white",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Delhivery",
																children: "Delhivery Express"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Bluedart",
																children: "Bluedart Apex"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Shadowfax",
																children: "Shadowfax Regional"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "RiderzPro Fleet",
																children: "RiderzPro Fleet"
															})
														]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block font-semibold text-gray-700 mb-1",
														children: "Target Tracking Number (AWB)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: testWebhookTracking || shipments[0]?.trackingNumber || "DEL984128471",
														onChange: (e) => setTestWebhookTracking(e.target.value),
														placeholder: "e.g. DEL984128471",
														className: "w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs font-mono"
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block font-semibold text-gray-700 mb-1",
														children: "Simulated Status"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: testWebhookStatus,
														onChange: (e) => setTestWebhookStatus(e.target.value),
														className: "w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs bg-white",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "In Transit",
																children: "In Transit"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Out for Delivery",
																children: "Out for Delivery"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Delivered",
																children: "Delivered & Signed"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Delayed",
																children: "Delayed (Route Congestion)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Failed Attempt",
																children: "Failed Delivery Attempt"
															})
														]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block font-semibold text-gray-700 mb-1",
														children: "Checkpoint Location"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: testWebhookLocation,
														onChange: (e) => setTestWebhookLocation(e.target.value),
														className: "w-full h-9 rounded-lg border border-gray-300 px-2.5 text-xs"
													})] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3 pt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														const newEventId = `evt-${Date.now()}`;
														setLastTestEventId(newEventId);
														const trackingNum = testWebhookTracking || shipments[0]?.trackingNumber || "DEL984128471";
														const result = processWebhook({
															eventId: newEventId,
															provider: testWebhookProvider,
															trackingNumber: trackingNum,
															rawStatus: testWebhookStatus,
															location: testWebhookLocation
														});
														setWebhookLogs((prev) => [{
															id: newEventId,
															time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
															msg: result.message,
															isDup: result.isDuplicate
														}, ...prev]);
														toast.success(result.message);
													},
													className: "px-4 py-2 rounded-lg bg-[#E31E24] text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer",
													children: "🚀 Fire Authenticated Webhook"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: !lastTestEventId,
													onClick: () => {
														const trackingNum = testWebhookTracking || shipments[0]?.trackingNumber || "DEL984128471";
														const result = processWebhook({
															eventId: lastTestEventId,
															provider: testWebhookProvider,
															trackingNumber: trackingNum,
															rawStatus: testWebhookStatus,
															location: testWebhookLocation
														});
														setWebhookLogs((prev) => [{
															id: lastTestEventId,
															time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
															msg: result.message,
															isDup: result.isDuplicate
														}, ...prev]);
														toast.warning(result.message);
													},
													className: "px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer disabled:opacity-50",
													children: "🔁 Test Idempotent Repeat (Duplicate Event ID)"
												})]
											}),
											webhookLogs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5 max-h-40 overflow-y-auto font-mono",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-gray-700 uppercase tracking-wider text-[10px]",
													children: "Webhook Execution Log:"
												}), webhookLogs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-[11px]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-gray-400",
															children: [
																"[",
																log.time,
																"]"
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: log.isDup ? "text-amber-600 font-bold" : "text-emerald-700 font-bold",
															children: log.isDup ? "[DUPLICATE SKIPPED]" : "[200 OK PROCESSED]"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-gray-700 truncate",
															children: log.msg
														})
													]
												}, idx))]
											})
										]
									})
								]
							})]
						}),
						activeTab === "audit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Audit Trail & Security Logs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-2xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#6B7280] font-semibold uppercase tracking-wider text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Timestamp"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Actor"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Action"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Target Reference"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Details"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-[#E5E7EB]",
										children: auditLogs.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-gray-50/80 transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-[#6B7280]",
													children: a.timestamp
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-semibold text-gray-900",
													children: a.actor
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-bold text-[#E31E24]",
													children: a.action
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-medium",
													children: a.target
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-gray-700",
													children: a.details
												})
											]
										}, a.id))
									})]
								})
							})]
						}),
						activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-extrabold text-[#111111]",
								children: "Platform Settings"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs max-w-xl space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-gray-700",
										children: "Platform Operating City"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										defaultValue: "Bengaluru, Karnataka (HQ)",
										className: "mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-xs"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-gray-700",
										children: "Support Hotline Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										defaultValue: "+91 98765 43210",
										className: "mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-xs"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-gray-700",
										children: "Emergency Operations Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										defaultValue: "ops@riderzpro.com",
										className: "mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-xs"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toast.success("Settings saved"),
										className: "rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700",
										children: "Save Platform Settings"
									})
								]
							})]
						})
					]
				})]
			}),
			selectedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedOrder(null),
							className: "absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-base font-extrabold text-[#111111]",
								children: ["Order ", selectedOrder.id]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-red-50 text-[#E31E24] px-2 py-0.5 text-xs font-bold",
								children: ORDER_STEPS[selectedOrder.status]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[#6B7280] mt-1",
							children: [
								"Placed on ",
								new Date(selectedOrder.createdAt).toLocaleString(),
								" · Paid via ",
								selectedOrder.payment,
								" ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-emerald-700",
									children: selectedOrder.paymentStatus || "Paid"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-[#111111]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: "Doorstep Delivery Destination"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#6B7280] mt-0.5",
									children: [
										selectedOrder.shippingAddress?.street || "Flat 402, Green Glen Layout, Bellandur",
										", ",
										selectedOrder.shippingAddress?.city || "Bengaluru",
										" - ",
										selectedOrder.shippingAddress?.pincode || "560103"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-gray-500 mt-1",
									children: [
										"Recipient: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-800",
											children: selectedOrder.customerName || "Aakash Sharma"
										}),
										" (",
										selectedOrder.customerPhone || "+91 98765 43210",
										")"
									]
								}),
								selectedOrder.shipmentId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] font-mono text-[#E31E24] font-bold",
									children: ["Linked Shipment: ", selectedOrder.shipmentId]
								})
							]
						}),
						selectedOrder.fulfillmentStatus !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-3 rounded-xl bg-red-50/50 border border-red-200 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111] mb-1.5",
								children: "Manifest Courier Consignment:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [
									"Delhivery",
									"Bluedart",
									"Shadowfax",
									"RiderzPro Fleet"
								].map((cr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleCreateCourierShipment(selectedOrder, cr),
									className: "px-2.5 py-1 rounded-md bg-white border border-gray-300 text-[11px] font-semibold text-gray-800 hover:border-[#E31E24] hover:text-[#E31E24] transition shadow-2xs cursor-pointer",
									children: ["+ ", cr]
								}, cr))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-b border-gray-100 py-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-gray-400",
								children: "Items Ordered"
							}), selectedOrder.groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold text-gray-700",
									children: ["Vendor: ", getVendor(g.vendorId).name]
								}), g.items.map((it) => {
									const prod = getProduct(it.productId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-[#111111]",
											children: [
												it.qty,
												" × ",
												prod?.name || "Part"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-[#111111]",
											children: inr(it.price * it.qty)
										})]
									}, it.productId);
								})]
							}, g.vendorId))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Items Subtotal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedOrder.itemsTotal) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery Logistics Fee:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedOrder.deliveryTotal) })]
								}),
								selectedOrder.discountTotal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-emerald-600 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Coupon Discount (",
										selectedOrder.couponCode || "PROMO",
										"):"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["- ", inr(selectedOrder.discountTotal)] })]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GST (18%):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedOrder.tax) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-base font-extrabold text-[#111111] pt-2 border-t border-gray-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedOrder.total) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [selectedOrder.fulfillmentStatus !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleCancelOrder(selectedOrder.id, "Admin cancellation with inventory rollback"),
									className: "rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100",
									children: "Cancel Order"
								}), selectedOrder.paymentStatus !== "Refunded" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleProcessRefund(selectedOrder.id),
									className: "rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50",
									children: "Initiate Refund"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedOrder(null),
									className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100",
									children: "Close"
								}), selectedOrder.status < 5 && selectedOrder.fulfillmentStatus !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleAdvanceOrderStatus(selectedOrder.id, selectedOrder.status),
									className: "rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700",
									children: [
										"Transition to ",
										ORDER_STEPS[selectedOrder.status + 1],
										" →"
									]
								})]
							})]
						})
					]
				})
			}),
			selectedShipment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedShipment(null),
							className: "absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-base font-extrabold text-[#111111]",
								children: selectedShipment.shipmentId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-bold",
								children: selectedShipment.provider
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[#6B7280] mt-1 font-mono",
							children: [
								"AWB: ",
								selectedShipment.trackingNumber,
								" · Order: ",
								selectedShipment.orderId
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-gray-900",
								children: "Verified Location Telemetry: "
							}), selectedShipment.locationType === "Live GPS Telemetry" ? "Live GPS coordinates broadcasted by vehicle telematics OBD unit." : "Official barcode scanner checkpoint verified at courier logistics sorting facility."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-wider text-gray-400",
								children: "Tracking Events History"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 border-l-2 border-red-500 pl-3 ml-2",
								children: selectedShipment.events.map((evt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-[#E31E24]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-gray-900",
											children: evt.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-[#6B7280]",
											children: [
												evt.location,
												" · ",
												evt.timestamp
											]
										})
									]
								}, evt.id || idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedShipment(null),
								className: "rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800",
								children: "Close Tracking Inspector"
							})
						})
					]
				})
			})
		]
	});
}
var $$splitComponentImporter$3 = () => import("./dashboard.customer-Cx8ysm2X.mjs");
var Route$3 = createFileRoute("/dashboard/customer")({
	head: () => ({ meta: [
		{ title: "Customer Dashboard — RiderzPro" },
		{
			name: "description",
			content: "Manage your registered EVs, live parts dispatches, telemetry and doorstep technician bookings."
		},
		{
			property: "og:title",
			content: "Customer Dashboard — RiderzPro"
		},
		{
			property: "og:description",
			content: "Automotive e-commerce and bike ownership platform."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./vendor.dashboard-BVS7XFsD.mjs");
var Route$2 = createFileRoute("/vendor/dashboard")({
	head: () => ({ meta: [{ title: "Seller Dashboard — RiderzPro Vendor Central" }, {
		name: "description",
		content: "Manage orders, catalogue listings, inventory stock, and payouts on RiderzPro."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./vendor.onboarding-C7tyQZyI.mjs");
var Route$1 = createFileRoute("/vendor/onboarding")({
	head: () => ({ meta: [{ title: "Seller Onboarding Stepper — RiderzPro" }, {
		name: "description",
		content: "Complete tax verification, pickup address, bank details and KYC review."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./vendor.pending-Dtqc9849.mjs");
var Route = createFileRoute("/vendor/pending")({
	head: () => ({ meta: [{ title: "Verification Status & KYC SLA — RiderzPro" }, {
		name: "description",
		content: "Track your RiderzPro seller application, KYC document review, and approvals."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$32.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$33
});
var AdminRoute = Route$31.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$33
});
var AssistantRoute = Route$30.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => Route$33
});
var AuthRoute = Route$34.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$33
});
var CartRoute = Route$29.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$33
});
var GarageRoute = Route$28.update({
	id: "/garage",
	path: "/garage",
	getParentRoute: () => Route$33
});
var LoginRoute = Route$27.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$33
});
var OffersRoute = Route$26.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => Route$33
});
var OrdersRoute = Route$25.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$33
});
var ShopRoute = Route$24.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$33
});
var SignupRoute = Route$36.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$33
});
var AdminIndexRoute = Route$23.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAiAssistantRoute = Route$22.update({
	id: "/ai-assistant",
	path: "/ai-assistant",
	getParentRoute: () => AdminRoute
});
var AdminAnalyticsRoute = Route$21.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AdminRoute
});
var AdminApprovalsRoute = Route$20.update({
	id: "/approvals",
	path: "/approvals",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$19.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminFitmentRoute = Route$18.update({
	id: "/fitment",
	path: "/fitment",
	getParentRoute: () => AdminRoute
});
var AdminLoginRoute = Route$17.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminNotificationsRoute = Route$16.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AdminRoute
});
var AdminOffersRoute = Route$15.update({
	id: "/offers",
	path: "/offers",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$14.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminPaymentsRoute = Route$13.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$12.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminReviewsRoute = Route$11.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminRidersRoute = Route$10.update({
	id: "/riders",
	path: "/riders",
	getParentRoute: () => AdminRoute
});
var AdminSellersRoute = Route$9.update({
	id: "/sellers",
	path: "/sellers",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminSupportRoute = Route$7.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => AdminRoute
});
var AdminTeamRoute = Route$6.update({
	id: "/team",
	path: "/team",
	getParentRoute: () => AdminRoute
});
var AdminWarrantyRoute = Route$5.update({
	id: "/warranty",
	path: "/warranty",
	getParentRoute: () => AdminRoute
});
var DashboardAdminRoute = Route$4.update({
	id: "/dashboard/admin",
	path: "/dashboard/admin",
	getParentRoute: () => Route$33
});
var DashboardCustomerRoute = Route$3.update({
	id: "/dashboard/customer",
	path: "/dashboard/customer",
	getParentRoute: () => Route$33
});
var ProductIdRoute = Route$35.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$33
});
var StoreSlugRoute = Route$37.update({
	id: "/store/$slug",
	path: "/store/$slug",
	getParentRoute: () => Route$33
});
var TrackIdRoute = Route$38.update({
	id: "/track/$id",
	path: "/track/$id",
	getParentRoute: () => Route$33
});
var VendorAuthRoute = Route$39.update({
	id: "/vendor/auth",
	path: "/vendor/auth",
	getParentRoute: () => Route$33
});
var VendorDashboardRoute = Route$2.update({
	id: "/vendor/dashboard",
	path: "/vendor/dashboard",
	getParentRoute: () => Route$33
});
var VendorOnboardingRoute = Route$1.update({
	id: "/vendor/onboarding",
	path: "/vendor/onboarding",
	getParentRoute: () => Route$33
});
var VendorPendingRoute = Route.update({
	id: "/vendor/pending",
	path: "/vendor/pending",
	getParentRoute: () => Route$33
});
var AdminRouteChildren = {
	AdminAiAssistantRoute,
	AdminAnalyticsRoute,
	AdminApprovalsRoute,
	AdminCustomersRoute,
	AdminFitmentRoute,
	AdminLoginRoute,
	AdminNotificationsRoute,
	AdminOffersRoute,
	AdminOrdersRoute,
	AdminPaymentsRoute,
	AdminProductsRoute,
	AdminReviewsRoute,
	AdminRidersRoute,
	AdminSellersRoute,
	AdminSettingsRoute,
	AdminSupportRoute,
	AdminTeamRoute,
	AdminWarrantyRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AssistantRoute,
	AuthRoute,
	CartRoute,
	GarageRoute,
	LoginRoute,
	OffersRoute,
	OrdersRoute,
	ShopRoute,
	SignupRoute,
	DashboardAdminRoute,
	DashboardCustomerRoute,
	ProductIdRoute,
	StoreSlugRoute,
	TrackIdRoute,
	VendorAuthRoute,
	VendorDashboardRoute,
	VendorOnboardingRoute,
	VendorPendingRoute
};
var routeTree = Route$33._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

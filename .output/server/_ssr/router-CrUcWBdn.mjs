import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as StoreProvider } from "./bits-PIC53EAH.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as Route$13 } from "./dashboards-BJrpMMXj.mjs";
import { t as Route$14 } from "./product._id-B5s6i8vd.mjs";
import { t as Route$15 } from "./track._id-CxARuhjJ.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CrUcWBdn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-1oRVCFD0.css";
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
var Route$12 = createRootRouteWithContext()({
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
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] })
	});
}
var $$splitComponentImporter$11 = () => import("./routes-Dl5ZO7rK.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Riderzpro — EV batteries & parts that fit your bike" },
		{
			name: "description",
			content: "Enter your VIN or pick your EV, compare sellers, place one order across vendors and track your rider live."
		},
		{
			property: "og:title",
			content: "Riderzpro — EV batteries & parts that fit your bike"
		},
		{
			property: "og:description",
			content: "Compare EV battery sellers, order once, track delivery live."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./assistant-W7FLTf1K.mjs");
var Route$10 = createFileRoute("/assistant")({
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
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./cart-B1g9w38f.mjs");
var Route$9 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Your cart — Riderzpro" },
		{
			name: "description",
			content: "One order across many sellers with distance-based delivery pricing."
		},
		{
			property: "og:title",
			content: "Your cart — Riderzpro"
		},
		{
			property: "og:description",
			content: "Review your multi-vendor EV parts order."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./garage-n_Tjv2ID.mjs");
var Route$8 = createFileRoute("/garage")({
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
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./login-DDKWDCTA.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Sign in — Riderzpro" },
		{
			name: "description",
			content: "Sign in to Riderzpro as a customer, workshop, vendor, rider or admin."
		},
		{
			property: "og:title",
			content: "Sign in — Riderzpro"
		},
		{
			property: "og:description",
			content: "Access your Riderzpro dashboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./orders-BSvAR7m_.mjs");
var Route$6 = createFileRoute("/orders")({
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
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./shop-DW_WoLEe.mjs");
var Route$5 = createFileRoute("/shop")({
	head: () => ({ meta: [
		{ title: "Shop EV parts — Riderzpro" },
		{
			name: "description",
			content: "Shop electric two-wheeler batteries and parts."
		},
		{
			property: "og:title",
			content: "Shop EV parts — Riderzpro"
		},
		{
			property: "og:description",
			content: "Browse electric two-wheeler batteries and parts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./dashboard.admin-DVI6Gnr0.mjs");
var Route$4 = createFileRoute("/dashboard/admin")({
	head: () => ({ meta: [
		{ title: "Admin dashboard — Riderzpro" },
		{
			name: "description",
			content: "Platform KPIs, vendor approvals, fitment review, live orders and delivery settings."
		},
		{
			property: "og:title",
			content: "Admin dashboard — Riderzpro"
		},
		{
			property: "og:description",
			content: "Run the Riderzpro marketplace."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard.customer-BAt2xxIz.mjs");
var Route$3 = createFileRoute("/dashboard/customer")({
	head: () => ({ meta: [
		{ title: "Customer dashboard — Riderzpro" },
		{
			name: "description",
			content: "Your garage, live orders, saved parts and technician bookings."
		},
		{
			property: "og:title",
			content: "Customer dashboard — Riderzpro"
		},
		{
			property: "og:description",
			content: "Manage your EV parts orders."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./dashboard.rider-DKD39kZA.mjs");
var Route$2 = createFileRoute("/dashboard/rider")({
	head: () => ({ meta: [
		{ title: "Rider dashboard — Riderzpro" },
		{
			name: "description",
			content: "Accept nearby EV parts deliveries, follow multi-pickup routes and track earnings."
		},
		{
			property: "og:title",
			content: "Rider dashboard — Riderzpro"
		},
		{
			property: "og:description",
			content: "Deliver EV parts with Riderzpro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./dashboard.vendor-BTqVWzr0.mjs");
var Route$1 = createFileRoute("/dashboard/vendor")({
	head: () => ({ meta: [
		{ title: "Vendor dashboard — Riderzpro" },
		{
			name: "description",
			content: "Sales, incoming orders, inventory and fitment management for EV parts sellers."
		},
		{
			property: "og:title",
			content: "Vendor dashboard — Riderzpro"
		},
		{
			property: "og:description",
			content: "Sell EV batteries and parts on Riderzpro."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./dashboard.workshop-D6j7-QnJ.mjs");
var Route = createFileRoute("/dashboard/workshop")({
	head: () => ({ meta: [
		{ title: "Workshop dashboard — Riderzpro" },
		{
			name: "description",
			content: "Job cards, bulk ordering and spend tracking for EV workshops and mechanics."
		},
		{
			property: "og:title",
			content: "Workshop dashboard — Riderzpro"
		},
		{
			property: "og:description",
			content: "Tools for EV workshops and mechanics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	AssistantRoute: Route$10.update({
		id: "/assistant",
		path: "/assistant",
		getParentRoute: () => Route$12
	}),
	CartRoute: Route$9.update({
		id: "/cart",
		path: "/cart",
		getParentRoute: () => Route$12
	}),
	DashboardsRoute: Route$13.update({
		id: "/dashboards",
		path: "/dashboards",
		getParentRoute: () => Route$12
	}),
	GarageRoute: Route$8.update({
		id: "/garage",
		path: "/garage",
		getParentRoute: () => Route$12
	}),
	LoginRoute: Route$7.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$12
	}),
	OrdersRoute: Route$6.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => Route$12
	}),
	ShopRoute: Route$5.update({
		id: "/shop",
		path: "/shop",
		getParentRoute: () => Route$12
	}),
	DashboardAdminRoute: Route$4.update({
		id: "/dashboard/admin",
		path: "/dashboard/admin",
		getParentRoute: () => Route$12
	}),
	DashboardCustomerRoute: Route$3.update({
		id: "/dashboard/customer",
		path: "/dashboard/customer",
		getParentRoute: () => Route$12
	}),
	DashboardRiderRoute: Route$2.update({
		id: "/dashboard/rider",
		path: "/dashboard/rider",
		getParentRoute: () => Route$12
	}),
	DashboardVendorRoute: Route$1.update({
		id: "/dashboard/vendor",
		path: "/dashboard/vendor",
		getParentRoute: () => Route$12
	}),
	DashboardWorkshopRoute: Route.update({
		id: "/dashboard/workshop",
		path: "/dashboard/workshop",
		getParentRoute: () => Route$12
	}),
	ProductIdRoute: Route$14.update({
		id: "/product/$id",
		path: "/product/$id",
		getParentRoute: () => Route$12
	}),
	TrackIdRoute: Route$15.update({
		id: "/track/$id",
		path: "/track/$id",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
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

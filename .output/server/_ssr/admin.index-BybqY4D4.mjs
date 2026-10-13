import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Skeleton } from "./Skeleton-DQZV-fkI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-BybqY4D4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DashboardScreen = (0, import_react.lazy)(() => import("./DashboardScreen-D1KTEgKl.mjs").then((m) => ({ default: m.DashboardScreen })));
function AdminIndexPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
					children: [...Array(6)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 rounded-2xl" }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-3xl" })
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardScreen, {})
	});
}
//#endregion
export { AdminIndexPage as component };

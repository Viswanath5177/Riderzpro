import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Skeleton } from "./Skeleton-DQZV-fkI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.offers-DNGsuDI-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OffersScreen = (0, import_react.lazy)(() => import("./OffersScreen-Sr2H8vCI.mjs").then((m) => ({ default: m.OffersScreen })));
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
	fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[600px] w-full rounded-3xl" }),
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OffersScreen, {})
});
//#endregion
export { SplitComponent as component };

import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
import { S as Navigate, m as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth } from "./auth-ga-2flKS.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	const currentPath = useRouterState({ select: (s) => s.location.pathname + (s.location.searchStr ? `?${s.location.searchStr}` : "") });
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary animate-pulse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
						className: "h-6 w-6 text-primary",
						fill: "currentColor"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Checking session..."
				})
			]
		})
	});
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/auth",
		search: { redirect: currentPath },
		replace: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { ProtectedRoute as t };

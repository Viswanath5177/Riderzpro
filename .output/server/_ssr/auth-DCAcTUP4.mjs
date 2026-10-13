import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Route } from "./auth-C1_v42If.mjs";
import { t as AuthPage } from "./AuthPage-DqTzV4C2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DCAcTUP4.js
var import_jsx_runtime = require_jsx_runtime();
function AuthRouteComponent() {
	const search = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPage, {
		initialMode: search.mode || "signin",
		redirectPath: search.redirect
	});
}
//#endregion
export { AuthRouteComponent as component };

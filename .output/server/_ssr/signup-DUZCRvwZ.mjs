import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AuthPage } from "./AuthPage-DqTzV4C2.mjs";
import { t as Route } from "./signup-DUBbWY4e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-DUZCRvwZ.js
var import_jsx_runtime = require_jsx_runtime();
function SignUpRouteComponent() {
	const search = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPage, {
		initialMode: "signup",
		redirectPath: search.redirect
	});
}
//#endregion
export { SignUpRouteComponent as component };

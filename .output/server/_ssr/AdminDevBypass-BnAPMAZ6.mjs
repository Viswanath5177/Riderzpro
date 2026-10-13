import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import "../_libs/sonner.mjs";
require_react();
/**
* DEV flag determining whether admin console entry points are rendered.
* Strictly false in production builds unless VITE_SHOW_ADMIN_ENTRY is explicitly set to true.
*/
var isDevAdminEnabled = Boolean({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_SHOW_ADMIN_ENTRY"] === "true" || typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));
//#endregion
export { isDevAdminEnabled as t };

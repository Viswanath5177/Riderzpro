import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendor.auth-3J0TZcFH.js
var $$splitComponentImporter = () => import("./vendor.auth-B-mW9Tyw.mjs");
var Route = createFileRoute("/vendor/auth")({
	validateSearch: (search) => {
		const rawMode = search["mode"];
		const rawRedirect = search["redirect"];
		return {
			mode: rawMode === "signup" ? "signup" : rawMode === "signin" ? "signin" : void 0,
			redirect: typeof rawRedirect === "string" ? rawRedirect : void 0
		};
	},
	head: () => ({ meta: [
		{ title: "Vendor Sign In & Merchant Onboarding — RiderzPro" },
		{
			name: "description",
			content: "Sell EV batteries, fast chargers and spares on RiderzPro marketplace across India."
		},
		{
			property: "og:title",
			content: "Vendor Portal — RiderzPro"
		},
		{
			property: "og:description",
			content: "Direct access to EV riders, live deliveries and merchant settlements."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

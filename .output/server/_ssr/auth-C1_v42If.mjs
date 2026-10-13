import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C1_v42If.js
var $$splitComponentImporter = () => import("./auth-DCAcTUP4.mjs");
var Route = createFileRoute("/auth")({
	validateSearch: (search) => {
		const rawMode = search["mode"];
		const rawRedirect = search["redirect"];
		return {
			mode: rawMode === "signup" ? "signup" : rawMode === "signin" ? "signin" : void 0,
			redirect: typeof rawRedirect === "string" ? rawRedirect : void 0
		};
	},
	head: () => ({ meta: [
		{ title: "Sign in & Sign up — Riderzpro" },
		{
			name: "description",
			content: "Sign in or create your customer account on Riderzpro."
		},
		{
			property: "og:title",
			content: "Customer Account — Riderzpro"
		},
		{
			property: "og:description",
			content: "One account for EV parts, live tracking and garage fitment."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

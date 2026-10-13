import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-QKGYSJQS.js
var $$splitComponentImporter = () => import("./signup-BzDAQ4uw.mjs");
var Route = createFileRoute("/signup")({
	validateSearch: (search) => {
		const rawRedirect = search["redirect"];
		return { redirect: typeof rawRedirect === "string" ? rawRedirect : void 0 };
	},
	head: () => ({ meta: [
		{ title: "Create account — Riderzpro" },
		{
			name: "description",
			content: "Sign up for a customer account on Riderzpro."
		},
		{
			property: "og:title",
			content: "Create account — Riderzpro"
		},
		{
			property: "og:description",
			content: "Get parts that fit, delivered by riders you can track."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

import { X as notFound, v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as getCatalogueVendor } from "./data-C7OlInRR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store._slug-DVP76Tmn.js
var $$splitComponentImporter = () => import("./store._slug-Bg7wqf6T.mjs");
var Route = createFileRoute("/store/$slug")({
	loader: ({ params }) => {
		const vendor = getCatalogueVendor(params.slug);
		if (!vendor) throw notFound();
		return { vendor };
	},
	head: ({ loaderData }) => loaderData ? { meta: [{ title: `${loaderData.vendor.name} — RiderzPro Verified Store` }, {
		name: "description",
		content: `Official storefront of ${loaderData.vendor.name} on RiderzPro. Authentic EV bike batteries, spares, and gear.`
	}] } : { meta: [{ title: "Store Not Found" }] },
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

import { X as notFound, v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as getProduct } from "./bits-6XfYm-PF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-Bc2lvtRv.js
var $$splitComponentImporter = () => import("./product._id-BlQ3WiIM.mjs");
var Route = createFileRoute("/product/$id")({
	loader: ({ params }) => {
		const p = getProduct(params.id);
		if (!p) throw notFound();
		return {
			name: p.name,
			description: p.description
		};
	},
	head: ({ loaderData }) => loaderData ? { meta: [
		{ title: `${loaderData.name} — Riderzpro` },
		{
			name: "description",
			content: loaderData.description
		},
		{
			property: "og:title",
			content: `${loaderData.name} — Riderzpro`
		},
		{
			property: "og:description",
			content: loaderData.description
		}
	] } : { meta: [{ title: "Not found" }, {
		name: "robots",
		content: "noindex"
	}] },
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

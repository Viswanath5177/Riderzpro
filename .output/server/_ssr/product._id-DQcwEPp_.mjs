import { X as notFound, v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as getProduct } from "./data-C7OlInRR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-DQcwEPp_.js
var $$splitComponentImporter = () => import("./product._id-B4zj9Obu.mjs");
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

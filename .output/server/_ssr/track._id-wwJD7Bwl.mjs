import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track._id-wwJD7Bwl.js
var $$splitComponentImporter = () => import("./track._id-TuQNLwbd.mjs");
var Route = createFileRoute("/track/$id")({
	head: ({ params }) => ({ meta: [
		{ title: `Track order ${params.id} — Riderzpro` },
		{
			name: "description",
			content: "Live tracking of your EV parts delivery."
		},
		{
			property: "og:title",
			content: `Track order ${params.id} — Riderzpro`
		},
		{
			property: "og:description",
			content: "Follow your rider live on the map."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

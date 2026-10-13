import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ot as CircleCheck, m as Star, mt as Flag, u as Trash2 } from "../_libs/lucide-react.mjs";
import { t as DataTable } from "./DataTable-CQjqc3RE.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { n as useAdminStore } from "./adminStore-BvZmspaI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ReviewsScreen-Bn8gehmo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewsScreen() {
	const { reviews, moderateReview } = useAdminStore();
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const filterTabs = [
		{
			label: "All Reviews",
			value: "ALL",
			count: reviews.length
		},
		{
			label: "Approved",
			value: "Approved",
			count: reviews.filter((r) => r.status === "Approved").length
		},
		{
			label: "Flagged",
			value: "Flagged",
			count: reviews.filter((r) => r.status === "Flagged").length
		},
		{
			label: "Removed",
			value: "Removed",
			count: reviews.filter((r) => r.status === "Removed").length
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
			children: "Customer Reviews & Content Moderation"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-[#4B5563] font-medium mt-1",
			children: "Approve verified purchaser testimonials, filter spam and maintain high catalog integrity."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			data: reviews,
			columns: [
				{
					key: "productName",
					header: "Product",
					sortable: true,
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] truncate text-sm",
							children: r.productName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[#4B5563] font-medium mt-0.5",
							children: [
								"By ",
								r.customerName,
								" · ",
								r.date
							]
						})]
					})
				},
				{
					key: "rating",
					header: "Rating",
					sortable: true,
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 font-bold text-[#B45309]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.rating, " / 5"] })]
					})
				},
				{
					key: "comment",
					header: "Review Details",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] text-xs",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#374151] text-[11px] font-medium line-clamp-2 mt-0.5",
							children: r.comment
						})]
					})
				},
				{
					key: "verifiedPurchase",
					header: "Verification",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${r.verifiedPurchase ? "bg-emerald-50 text-emerald-800 border border-emerald-300" : "bg-gray-100 text-[#4B5563] border border-gray-200"}`,
						children: r.verifiedPurchase ? "Verified Buyer" : "Unverified"
					})
				},
				{
					key: "status",
					header: "Status",
					sortable: true,
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
						status: r.status,
						size: "sm"
					})
				},
				{
					key: "actions",
					header: "Moderation",
					className: "text-right",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-1.5",
						onClick: (e) => e.stopPropagation(),
						children: [
							r.status !== "Approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => moderateReview(r.id, "Approved"),
								className: "rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-1.5 transition cursor-pointer",
								title: "Approve Review",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" })
							}),
							r.status !== "Flagged" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => moderateReview(r.id, "Flagged"),
								className: "rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 p-1.5 transition cursor-pointer",
								title: "Flag for Review",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-3.5 w-3.5" })
							}),
							r.status !== "Removed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => moderateReview(r.id, "Removed"),
								className: "rounded-lg bg-red-100 hover:bg-red-200 text-red-700 p-1.5 transition cursor-pointer",
								title: "Remove Review",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					})
				}
			],
			searchPlaceholder: "Search review text or customer name...",
			searchKey: (r) => `${r.title} ${r.comment} ${r.customerName} ${r.productName}`,
			filterTabs,
			currentFilter: statusFilter,
			onFilterChange: setStatusFilter,
			filterPredicate: (r, f) => r.status === f,
			keyExtractor: (r) => r.id,
			exportFileName: "riderzpro_reviews"
		})]
	});
}
//#endregion
export { ReviewsScreen };

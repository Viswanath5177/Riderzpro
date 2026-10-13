import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as CircleCheck, u as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WarrantyScreen-MCFRAZP7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WarrantyScreen() {
	const { warrantyClaims, resolveWarrantyClaim } = useAdminStore();
	const [selectedClaim, setSelectedClaim] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "Warranty Claims, RMA & Replacement Desk"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Process battery degradation claims, motor controller defects and doorstep replacement logistics."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: warrantyClaims,
				columns: [
					{
						key: "claimNumber",
						header: "Claim #",
						sortable: true,
						render: (w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-[#111111] text-xs",
							children: w.claimNumber
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-[#6B7280] font-mono",
							children: ["Order: ", w.orderId]
						})] })
					},
					{
						key: "productName",
						header: "Defective Component",
						render: (w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] text-sm",
							children: w.productName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-[#4B5563] font-mono mt-0.5",
							children: ["S/N: ", w.serialNumber]
						})] })
					},
					{
						key: "customerName",
						header: "Customer",
						sortable: true,
						render: (w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-[#111111] text-xs",
							children: w.customerName
						})
					},
					{
						key: "reason",
						header: "Failure Diagnosis",
						render: (w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xs text-xs text-[#374151] font-medium truncate",
							children: w.reason
						})
					},
					{
						key: "dateFiled",
						header: "Filed On",
						sortable: true,
						render: (w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#6B7280] font-medium text-xs",
							children: w.dateFiled
						})
					},
					{
						key: "status",
						header: "Status",
						sortable: true,
						render: (w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: w.status,
							size: "sm"
						})
					}
				],
				searchPlaceholder: "Search claim #, serial # or component...",
				searchKey: (w) => `${w.claimNumber} ${w.serialNumber} ${w.productName} ${w.customerName}`,
				onRowClick: (claim) => setSelectedClaim(claim),
				keyExtractor: (w) => w.id,
				exportFileName: "riderzpro_warranty_claims"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedClaim),
				onClose: () => setSelectedClaim(null),
				width: "lg",
				title: selectedClaim ? `Claim #${selectedClaim.claimNumber}` : void 0,
				description: selectedClaim ? `Filed by ${selectedClaim.customerName} on ${selectedClaim.dateFiled}` : void 0,
				children: selectedClaim && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-[#111111] text-base",
								children: selectedClaim.productName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[#4B5563] font-mono mt-0.5 font-medium",
								children: ["Serial: ", selectedClaim.serialNumber]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: selectedClaim.status,
								size: "md"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-[#111111] flex items-center gap-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer Defect Description" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#111111] leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-[#E5E7EB] font-medium",
									children: [
										"\"",
										selectedClaim.reason,
										"\""
									]
								}),
								selectedClaim.resolutionNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[#6B7280] font-bold uppercase text-[10px]",
										children: "Resolution Notes:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-emerald-700 font-bold mt-0.5",
										children: selectedClaim.resolutionNotes
									})]
								})
							]
						}),
						selectedClaim.status === "Pending Inspection" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "primary",
								size: "md",
								className: "w-full",
								onClick: () => {
									resolveWarrantyClaim(selectedClaim.id, "Approved (Replacement)", "Hub inspection verified manufacturer defect. Doorstep replacement scheduled.");
									setSelectedClaim({
										...selectedClaim,
										status: "Approved (Replacement)"
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve OEM Replacement" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
									variant: "secondary",
									size: "sm",
									className: "flex-1",
									onClick: () => {
										resolveWarrantyClaim(selectedClaim.id, "Approved (Refund)", "Refund approved directly to customer source account.");
										setSelectedClaim({
											...selectedClaim,
											status: "Approved (Refund)"
										});
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve Full Refund" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
									variant: "destructive",
									size: "sm",
									className: "flex-1",
									onClick: () => {
										resolveWarrantyClaim(selectedClaim.id, "Rejected", "Damage attributed to physical impact outside warranty scope.");
										setSelectedClaim({
											...selectedClaim,
											status: "Rejected"
										});
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reject Claim" })
								})]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { WarrantyScreen };

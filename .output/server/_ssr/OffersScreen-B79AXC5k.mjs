import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Plus, Ft as CircleCheck, Nt as CircleX, p as Trash2, pt as Image } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
import { t as GlassSelect } from "./GlassSelect-BzoeLAya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OffersScreen-B79AXC5k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OffersScreen() {
	const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useAdminStore();
	const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const [discountType, setDiscountType] = (0, import_react.useState)("percentage");
	const [discountValue, setDiscountValue] = (0, import_react.useState)(10);
	const [minOrderValue, setMinOrderValue] = (0, import_react.useState)(2500);
	const [maxDiscount, setMaxDiscount] = (0, import_react.useState)(1e3);
	const [usageLimit, setUsageLimit] = (0, import_react.useState)(500);
	const [validTill, setValidTill] = (0, import_react.useState)("2026-06-30");
	const columns = [
		{
			key: "code",
			header: "Promo Code",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono font-bold text-[#E31E24] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg text-xs",
					children: c.code
				}), c.applicableCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] text-[#6B7280] font-medium",
					children: [
						"(",
						c.applicableCategory,
						" only)"
					]
				})]
			})
		},
		{
			key: "discountValue",
			header: "Benefit",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: [c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`, c.maxDiscount ? ` (up to ₹${c.maxDiscount})` : ""]
			})
		},
		{
			key: "minOrderValue",
			header: "Min Order",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] text-xs",
				children: ["₹", c.minOrderValue]
			})
		},
		{
			key: "usageCount",
			header: "Usage Redeemed",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: [
					c.usageCount,
					" / ",
					c.usageLimit
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-[#E31E24] h-full rounded-full",
					style: { width: `${Math.min(100, c.usageCount / c.usageLimit * 100)}%` }
				})
			})] })
		},
		{
			key: "validTill",
			header: "Expires On",
			sortable: true,
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[#4B5563] font-medium text-xs",
				children: c.validTill
			})
		},
		{
			key: "isActive",
			header: "Status",
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: c.isActive ? "Active" : "Expired",
				size: "sm"
			})
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-right",
			render: (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1.5",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => toggleCouponActive(c.id),
					className: "rounded-lg bg-gray-100 hover:bg-gray-200 p-1.5 text-[#374151] transition cursor-pointer",
					title: c.isActive ? "Pause Coupon" : "Activate Coupon",
					children: c.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => deleteCoupon(c.id),
					className: "rounded-lg bg-red-100 hover:bg-red-200 p-1.5 text-red-700 transition cursor-pointer",
					title: "Delete Coupon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
				})]
			})
		}
	];
	const handleCreateCoupon = (e) => {
		e.preventDefault();
		addCoupon({
			code: code.trim().toUpperCase(),
			discountType,
			discountValue,
			minOrderValue,
			maxDiscount: discountType === "percentage" ? maxDiscount : void 0,
			usageLimit,
			validFrom: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			validTill,
			isActive: true
		});
		setIsCreateModalOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Offers, Coupons & Promotional Banners"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Configure checkout discount coupons, minimum cart thresholds and storefront promotion campaigns."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					variant: "primary",
					size: "md",
					onClick: () => {
						setCode("SUPER" + Math.floor(10 + Math.random() * 90));
						setIsCreateModalOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create New Coupon" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: coupons,
				columns,
				searchPlaceholder: "Search coupon code...",
				searchKey: "code",
				keyExtractor: (c) => c.id,
				exportFileName: "riderzpro_coupons"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-[#E5E7EB] pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-[#111111]",
							children: "Storefront Hero Promo Banners"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-[#6B7280] font-bold",
						children: "3 Banners Active on Landing Page"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-[#111111]",
									children: "100% Fitment Guaranteed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold",
									children: "Active"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#4B5563] leading-relaxed text-[11px] font-medium",
								children: "\"Enter your VIN or pick your EV, compare sellers, order in one cart.\""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-[#111111]",
									children: "Monsoon Battery Care Fest"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold",
									children: "Active"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#4B5563] leading-relaxed text-[11px] font-medium",
								children: "\"Up to ₹1,500 off certified NMC & LiFePO4 packs with coupon BATTERYBOOST.\""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-[#111111]",
									children: "Doorstep Tech Installation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold",
									children: "Active"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#4B5563] leading-relaxed text-[11px] font-medium",
								children: "\"Certified technicians visit your garage in 3 hours across Bengaluru.\""
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: isCreateModalOpen,
				onClose: () => setIsCreateModalOpen(false),
				maxWidth: "md",
				title: "Create Promotional Coupon",
				description: "Set the promo code, percentage/flat discount and minimum cart value.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCreateCoupon,
					className: "space-y-4 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
							children: "Coupon Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							required: true,
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "e.g. MONSOON20"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Discount Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
								value: discountType,
								onChange: (e) => setDiscountType(e.target.value),
								options: [{
									value: "percentage",
									label: "Percentage (%)"
								}, {
									value: "fixed",
									label: "Fixed Amount (₹)"
								}]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: [
									"Value (",
									discountType === "percentage" ? "%" : "₹",
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								required: true,
								value: discountValue,
								onChange: (e) => setDiscountValue(parseFloat(e.target.value) || 0)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Min Order Value (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								required: true,
								value: minOrderValue,
								onChange: (e) => setMinOrderValue(parseFloat(e.target.value) || 0)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Max Discount Cap (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								value: maxDiscount || "",
								onChange: (e) => setMaxDiscount(parseFloat(e.target.value) || void 0),
								placeholder: "Optional cap"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Total Usage Limit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								required: true,
								value: usageLimit,
								onChange: (e) => setUsageLimit(parseInt(e.target.value) || 0)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Expiry Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "date",
								required: true,
								value: validTill,
								onChange: (e) => setValidTill(e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => setIsCreateModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								type: "submit",
								variant: "primary",
								size: "sm",
								children: "Save Coupon"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { OffersScreen };

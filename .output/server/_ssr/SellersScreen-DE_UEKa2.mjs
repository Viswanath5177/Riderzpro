import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ct as FileCheck, D as ShieldCheck, H as Percent, O as ShieldAlert, Yt as Building, _ as Star, et as MapPin, it as LockOpen, rt as Lock } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SellersScreen-DE_UEKa2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SellersScreen() {
	const { sellers, approveSellerKyc, requestSellerChanges, rejectSellerKyc, suspendSeller, reinstateSeller, updateSellerCommission, approveAllPending } = useAdminStore();
	const [selectedSeller, setSelectedSeller] = (0, import_react.useState)(null);
	const [kycFilter, setKycFilter] = (0, import_react.useState)("ALL");
	const [approveModalSeller, setApproveModalSeller] = (0, import_react.useState)(null);
	const [approveCommission, setApproveCommission] = (0, import_react.useState)(10);
	const [approveTier, setApproveTier] = (0, import_react.useState)("Standard");
	const [rejectModalSeller, setRejectModalSeller] = (0, import_react.useState)(null);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const [selectedRejectTemplate, setSelectedRejectTemplate] = (0, import_react.useState)("Illegible or incomplete statutory documents");
	const [changesModalSeller, setChangesModalSeller] = (0, import_react.useState)(null);
	const [selectedSections, setSelectedSections] = (0, import_react.useState)(["tax", "documents"]);
	const [changesNotes, setChangesNotes] = (0, import_react.useState)("");
	const [commissionModalSeller, setCommissionModalSeller] = (0, import_react.useState)(null);
	const [newCommission, setNewCommission] = (0, import_react.useState)(10);
	const [revealedBankId, setRevealedBankId] = (0, import_react.useState)(null);
	const [zoomedDocUrl, setZoomedDocUrl] = (0, import_react.useState)(null);
	const [checklist, setChecklist] = (0, import_react.useState)({
		gst_active: true,
		pan_matches: true,
		bank_verified: true,
		docs_legible: true,
		brand_auth_valid: true,
		address_serviceable: true
	});
	const toggleCheck = (key) => {
		setChecklist((prev) => ({
			...prev,
			[key]: !prev[key]
		}));
	};
	const filterTabs = [
		{
			label: "All Sellers",
			value: "ALL",
			count: sellers.length
		},
		{
			label: "KYC Pending",
			value: "Pending",
			count: sellers.filter((s) => s.kycStatus === "Pending").length
		},
		{
			label: "Approved",
			value: "Approved",
			count: sellers.filter((s) => s.kycStatus === "Approved").length
		},
		{
			label: "Changes Requested",
			value: "Changes Requested",
			count: sellers.filter((s) => s.kycStatus === "Changes Requested").length
		},
		{
			label: "Rejected / Suspended",
			value: "Rejected",
			count: sellers.filter((s) => s.kycStatus === "Rejected" || s.kycStatus === "Suspended").length
		}
	];
	const columns = [
		{
			key: "businessName",
			header: "Business & Store",
			sortable: true,
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-[#111111] text-sm",
						children: s.businessName
					}),
					s.vendorRecord?.onboarding?.shipping?.sellsLiIon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5",
						children: "Li-ion"
					}),
					s.vendorRecord?.onboarding?.tax?.gstExempt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded bg-gray-100 text-gray-700 text-[9px] font-bold px-1.5 py-0.5",
						children: "Exempt"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-[#4B5563] font-medium mt-0.5",
				children: [
					"Owner: ",
					s.ownerName,
					" · ",
					s.city
				]
			})] })
		},
		{
			key: "gstin",
			header: "GSTIN Tax ID",
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[#111111] font-bold text-xs",
				children: s.gstin
			})
		},
		{
			key: "commissionRate",
			header: "Commission",
			sortable: true,
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#E31E24] tabular-nums text-xs",
				children: [s.commissionRate, "%"]
			})
		},
		{
			key: "totalSales",
			header: "Sales Volume",
			sortable: true,
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: ["₹", s.totalSales.toLocaleString("en-IN")]
			})
		},
		{
			key: "rating",
			header: "Rating",
			sortable: true,
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 font-bold text-[#B45309]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [s.rating, "★"] })]
			})
		},
		{
			key: "kycStatus",
			header: "KYC Status",
			sortable: true,
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: s.kycStatus,
				size: "sm"
			})
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-right",
			render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1.5",
				onClick: (e) => e.stopPropagation(),
				children: [s.kycStatus === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setApproveModalSeller(s);
							setApproveCommission(s.commissionRate || 10);
						},
						className: "rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 text-xs transition shadow-2xs",
						children: "Approve"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setChangesModalSeller(s);
							setChangesNotes("");
						},
						className: "rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold px-2 py-1 text-xs transition",
						children: "Changes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setRejectModalSeller(s);
							setRejectReason("");
						},
						className: "rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2 py-1 text-xs transition",
						children: "Reject"
					})
				] }), s.kycStatus === "Approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setCommissionModalSeller(s);
						setNewCommission(s.commissionRate);
					},
					className: "text-[#6B7280] hover:text-[#E31E24] p-1.5 transition",
					title: "Edit commission rate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-3.5 w-3.5" })
				})]
			})
		}
	];
	const vr = selectedSeller?.vendorRecord;
	const ob = vr?.onboarding;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-black text-[#111111]",
					children: "Sellers & Vendor KYC Queue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#4B5563] font-medium mt-0.5",
					children: "Audit seller registrations, verify GSTIN certificates and manage platform commission tiers."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: approveAllPending,
						className: "flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shadow-2xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚡ Demo: Approve All Pending" })
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: sellers,
				columns,
				searchPlaceholder: "Search by business name, owner, city, or GSTIN...",
				filterTabs,
				currentFilter: kycFilter,
				onFilterChange: setKycFilter,
				filterPredicate: (s, filter) => {
					if (filter === "Rejected") return s.kycStatus === "Rejected" || s.kycStatus === "Suspended";
					return s.kycStatus === filter;
				},
				onRowClick: (seller) => setSelectedSeller(seller),
				keyExtractor: (s) => s.id,
				exportFileName: "riderzpro_sellers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedSeller),
				onClose: () => setSelectedSeller(null),
				width: "lg",
				title: selectedSeller?.businessName,
				description: selectedSeller ? `Joined ${selectedSeller.joinedDate} · ${selectedSeller.city}` : void 0,
				children: selectedSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-xs text-[#111111]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-base text-[#111111]",
									children: selectedSeller.businessName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#4B5563] font-medium mt-0.5",
									children: ["Managing Owner: ", selectedSeller.ownerName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#6B7280] font-mono mt-0.5",
									children: [
										selectedSeller.phone,
										" · ",
										selectedSeller.email
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: selectedSeller.kycStatus,
									size: "md"
								}), vr?.tier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5",
									children: [vr.tier, " Tier"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [ob?.shipping?.sellsLiIon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900 font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Li-ion Packaging Compliant (UN38.3 Declared)" })]
							}), ob?.tax?.gstExempt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-800 font-bold flex items-center gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Exempt Seller (Non-GST)" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-white p-4 space-y-2.5 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-foreground flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "KYC Verification Checklist" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 pt-1 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.gst_active,
											onChange: () => toggleCheck("gst_active"),
											className: "h-3.5 w-3.5 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GSTIN Status Active" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.pan_matches,
											onChange: () => toggleCheck("pan_matches"),
											className: "h-3.5 w-3.5 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PAN matches signatory" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.bank_verified,
											onChange: () => toggleCheck("bank_verified"),
											className: "h-3.5 w-3.5 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bank penny drop matches" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.docs_legible,
											onChange: () => toggleCheck("docs_legible"),
											className: "h-3.5 w-3.5 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploaded docs legible" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.brand_auth_valid,
											onChange: () => toggleCheck("brand_auth_valid"),
											className: "h-3.5 w-3.5 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Brand authorization valid" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.address_serviceable,
											onChange: () => toggleCheck("address_serviceable"),
											className: "h-3.5 w-3.5 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hub address serviceable" })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GSTIN & Banking Credentials" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Registered GSTIN:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-[#111111]",
										children: selectedSeller.gstin
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Derived PAN:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-[#111111]",
										children: ob?.tax?.pan || selectedSeller.gstin?.slice(2, 12)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Settlement Account:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[#111111] font-semibold",
											children: revealedBankId === selectedSeller.id ? ob?.bank?.accountNumber || selectedSeller.bankAccount : selectedSeller.bankAccount
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												if (revealedBankId === selectedSeller.id) setRevealedBankId(null);
												else if (window.confirm("Confirm admin security credential reveal?")) setRevealedBankId(selectedSeller.id);
											},
											className: "text-xs text-primary font-bold hover:underline flex items-center gap-1",
											children: [revealedBankId === selectedSeller.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: revealedBankId === selectedSeller.id ? "Mask" : "Reveal" })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-[#F3F4F6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "IFSC Code & Bank:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-[#111111]",
										children: [
											ob?.bank?.ifsc || "HDFC0000038",
											" (",
											ob?.bank?.bankName || "Bank",
											")"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#4B5563] font-medium",
										children: "Platform Commission:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-[#E31E24]",
										children: [selectedSeller.commissionRate, "%"]
									})]
								})
							]
						}),
						ob?.shipping?.pickupAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-white p-4 space-y-2 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-foreground flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pickup Dispatch Hub & Logistics" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground space-y-1 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Address:"
										}),
										" ",
										ob.shipping.pickupAddress.line1,
										", ",
										ob.shipping.pickupAddress.city,
										" - ",
										ob.shipping.pickupAddress.pincode
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Coordinates:"
										}),
										" ",
										ob.shipping.pickupAddress.lat,
										", ",
										ob.shipping.pickupAddress.lng
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Prep / Handling Time:"
										}),
										" ",
										ob.shipping.handlingTimeMins || 15,
										" mins"
									] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-white p-4 space-y-3 shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-foreground flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploaded KYC Certificates (Click to Zoom)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									ob?.documents?.panDocUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setZoomedDocUrl(ob.documents.panDocUrl),
										className: "p-2 rounded-xl border border-border bg-muted/20 text-center hover:border-primary transition group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: ob.documents.panDocUrl,
											alt: "PAN Doc",
											className: "h-16 w-full object-cover rounded-lg mb-1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold group-hover:text-primary",
											children: "PAN Card"
										})]
									}),
									ob?.documents?.gstDocUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setZoomedDocUrl(ob.documents.gstDocUrl),
										className: "p-2 rounded-xl border border-border bg-muted/20 text-center hover:border-primary transition group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: ob.documents.gstDocUrl,
											alt: "GST Doc",
											className: "h-16 w-full object-cover rounded-lg mb-1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold group-hover:text-primary",
											children: "GST Cert"
										})]
									}),
									ob?.documents?.chequeDocUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setZoomedDocUrl(ob.documents.chequeDocUrl),
										className: "p-2 rounded-xl border border-border bg-muted/20 text-center hover:border-primary transition group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: ob.documents.chequeDocUrl,
											alt: "Cheque Doc",
											className: "h-16 w-full object-cover rounded-lg mb-1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold group-hover:text-primary",
											children: "Cheque"
										})]
									})
								]
							})]
						}),
						vr?.auditTimeline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-gray-50/60 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-foreground text-xs",
								children: "Audit History Timeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 text-xs",
								children: vr.auditTimeline.map((evt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-l-2 border-primary pl-3 py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground",
											children: evt.action
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground font-mono",
											children: new Date(evt.timestamp).toLocaleDateString()
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground text-[11px]",
										children: ["By ", evt.actor]
									})]
								}, evt.id || i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 flex flex-wrap gap-2",
							children: selectedSeller.kycStatus === "Pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setApproveModalSeller(selectedSeller);
										setApproveCommission(selectedSeller.commissionRate || 10);
									},
									className: "flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs shadow-xs transition",
									children: "Approve KYC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setChangesModalSeller(selectedSeller);
										setChangesNotes("");
									},
									className: "flex-1 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold py-2.5 text-xs transition",
									children: "Request Changes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setRejectModalSeller(selectedSeller);
										setRejectReason("");
									},
									className: "flex-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold py-2.5 text-xs transition",
									children: "Reject"
								})
							] }) : selectedSeller.kycStatus === "Suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									reinstateSeller(selectedSeller.id);
									setSelectedSeller({
										...selectedSeller,
										kycStatus: "Approved"
									});
								},
								className: "w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs transition",
								children: "Reinstate Vendor to Active"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									suspendSeller(selectedSeller.id);
									setSelectedSeller({
										...selectedSeller,
										kycStatus: "Suspended"
									});
								},
								className: "w-full rounded-xl border border-destructive text-destructive hover:bg-destructive/10 font-bold py-2.5 text-xs transition",
								children: "Suspend Vendor Account"
							})
						})
					]
				})
			}),
			approveModalSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: Boolean(approveModalSeller),
				onClose: () => setApproveModalSeller(null),
				title: "Approve Seller KYC Application",
				description: `Grant marketplace access to ${approveModalSeller.businessName}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-foreground mb-1",
							children: "Platform Commission Rate (%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							max: 50,
							value: approveCommission,
							onChange: (e) => setApproveCommission(Number(e.target.value)),
							className: "w-full rounded-xl border border-border bg-background p-2.5 text-sm font-bold outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-foreground mb-1",
							children: "Merchant Tier Assignment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: approveTier,
							onChange: (e) => setApproveTier(e.target.value),
							className: "w-full rounded-xl border border-border bg-background p-2.5 text-xs font-semibold outline-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Standard",
									children: "Standard Tier (Standard SLAs)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Gold",
									children: "Gold Tier (Featured Store)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Platinum",
									children: "Platinum Tier (Priority Fulfillment)"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "outline",
								size: "sm",
								onClick: () => setApproveModalSeller(null),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "primary",
								size: "sm",
								onClick: () => {
									approveSellerKyc(approveModalSeller.id, approveCommission, approveTier);
									if (selectedSeller?.id === approveModalSeller.id) setSelectedSeller({
										...selectedSeller,
										kycStatus: "Approved",
										commissionRate: approveCommission
									});
									setApproveModalSeller(null);
								},
								children: "Confirm Approval"
							})]
						})
					]
				})
			}),
			changesModalSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: Boolean(changesModalSeller),
				onClose: () => setChangesModalSeller(null),
				title: "Request Modifications from Seller",
				description: `Flag specific onboarding sections for ${changesModalSeller.businessName}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-foreground mb-1.5",
							children: "Flagged Sections (Reopened on Vendor's End)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								"tax",
								"store",
								"shipping",
								"bank",
								"documents"
							].map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selectedSections.includes(sec),
									onChange: (e) => {
										if (e.target.checked) setSelectedSections([...selectedSections, sec]);
										else setSelectedSections(selectedSections.filter((s) => s !== sec));
									},
									className: "accent-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "capitalize",
									children: [sec, " Details"]
								})]
							}, sec))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-foreground mb-1",
							children: "Reviewer Instructions & Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: changesNotes,
							onChange: (e) => setChangesNotes(e.target.value),
							placeholder: "Specify exactly what needs to be re-uploaded or corrected...",
							className: "w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "outline",
								size: "sm",
								onClick: () => setChangesModalSeller(null),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "primary",
								size: "sm",
								onClick: () => {
									if (!changesNotes.trim()) {
										toast.error("Please add instructions for the vendor");
										return;
									}
									requestSellerChanges(changesModalSeller.id, selectedSections, changesNotes);
									if (selectedSeller?.id === changesModalSeller.id) setSelectedSeller({
										...selectedSeller,
										kycStatus: "Changes Requested"
									});
									setChangesModalSeller(null);
								},
								children: "Send Request"
							})]
						})
					]
				})
			}),
			rejectModalSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: Boolean(rejectModalSeller),
				onClose: () => setRejectModalSeller(null),
				title: "Reject Seller KYC",
				description: `Provide rejection grounds for ${rejectModalSeller.businessName}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-foreground mb-1",
							children: "Standard Reason Template"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedRejectTemplate,
							onChange: (e) => {
								setSelectedRejectTemplate(e.target.value);
								setRejectReason(e.target.value);
							},
							className: "w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Illegible or incomplete statutory documents",
									children: "Illegible or incomplete statutory documents"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "GSTIN status is cancelled or inactive",
									children: "GSTIN status is cancelled or inactive"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Entity name mismatch with PAN card",
									children: "Entity name mismatch with PAN card"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Prohibited non-homologated goods reported",
									children: "Prohibited non-homologated goods reported"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Custom",
									children: "Custom grounds..."
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-bold text-foreground mb-1",
							children: "Detailed Rejection Note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: rejectReason || selectedRejectTemplate,
							onChange: (e) => setRejectReason(e.target.value),
							placeholder: "Explain why the seller KYC cannot be approved...",
							className: "w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "outline",
								size: "sm",
								onClick: () => setRejectModalSeller(null),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "destructive",
								size: "sm",
								onClick: () => {
									rejectSellerKyc(rejectModalSeller.id, rejectReason || selectedRejectTemplate);
									if (selectedSeller?.id === rejectModalSeller.id) setSelectedSeller({
										...selectedSeller,
										kycStatus: "Rejected"
									});
									setRejectModalSeller(null);
								},
								children: "Confirm Rejection"
							})]
						})
					]
				})
			}),
			commissionModalSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: Boolean(commissionModalSeller),
				onClose: () => setCommissionModalSeller(null),
				title: "Update Platform Commission",
				description: `Adjust commission for ${commissionModalSeller.businessName}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-xs pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-bold text-foreground mb-1",
						children: "Commission Percentage (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						max: 50,
						value: newCommission,
						onChange: (e) => setNewCommission(Number(e.target.value)),
						className: "w-full rounded-xl border border-border bg-background p-2.5 text-sm font-bold outline-none"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							variant: "outline",
							size: "sm",
							onClick: () => setCommissionModalSeller(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							variant: "primary",
							size: "sm",
							onClick: () => {
								updateSellerCommission(commissionModalSeller.id, newCommission);
								if (selectedSeller?.id === commissionModalSeller.id) setSelectedSeller({
									...selectedSeller,
									commissionRate: newCommission
								});
								setCommissionModalSeller(null);
							},
							children: "Save Rate"
						})]
					})]
				})
			}),
			zoomedDocUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-2xl w-full bg-white rounded-2xl p-4 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center pb-2 border-b border-border mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold",
							children: "Document Zoom Inspector"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setZoomedDocUrl(null),
							className: "text-xs font-bold text-primary hover:underline",
							children: "Close ✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: zoomedDocUrl,
						alt: "KYC Zoom",
						className: "w-full max-h-[70vh] object-contain rounded-xl bg-gray-100"
					})]
				})
			})
		]
	});
}
//#endregion
export { SellersScreen };

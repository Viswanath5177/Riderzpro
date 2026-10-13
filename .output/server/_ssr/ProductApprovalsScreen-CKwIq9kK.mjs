import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as CircleCheck, Lt as CircleAlert, Nt as CircleX, O as ShieldAlert, W as PenLine, b as Sparkles, jt as Clock, m as Tag, v as Square, wt as Eye, y as SquareCheckBig } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as GlassDrawer } from "./GlassDrawer-BHZ9qmAu.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
import { t as GlassCard } from "./GlassCard-DlgeqlaV.mjs";
import { a as bikes } from "./data-C7OlInRR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductApprovalsScreen-CKwIq9kK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductApprovalsScreen() {
	const { products, sellers, approveProductReview, requestProductReviewChanges, rejectProductReview, approveAllPending } = useAdminStore();
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	const [filterType, setFilterType] = (0, import_react.useState)("ALL");
	const [selectedProductIds, setSelectedProductIds] = (0, import_react.useState)([]);
	const [zoomedImage, setZoomedImage] = (0, import_react.useState)(null);
	const [isEditModalOpen, setIsEditModalOpen] = (0, import_react.useState)(false);
	const [isChangesModalOpen, setIsChangesModalOpen] = (0, import_react.useState)(false);
	const [isRejectModalOpen, setIsRejectModalOpen] = (0, import_react.useState)(false);
	const [editTitle, setEditTitle] = (0, import_react.useState)("");
	const [editCategory, setEditCategory] = (0, import_react.useState)("Batteries");
	const [editPrice, setEditPrice] = (0, import_react.useState)(0);
	const [editDiscountPrice, setEditDiscountPrice] = (0, import_react.useState)(0);
	const [changeField, setChangeField] = (0, import_react.useState)("images");
	const [changeComment, setChangeComment] = (0, import_react.useState)("");
	const [rejectReason, setRejectReason] = (0, import_react.useState)("Specifications mismatch / Prohibited item");
	const [checklist, setChecklist] = (0, import_react.useState)({
		images: false,
		category: false,
		fitment: false,
		tax: false,
		genuine: false
	});
	(0, import_react.useEffect)(() => {
		setChecklist({
			images: false,
			category: false,
			fitment: false,
			tax: false,
			genuine: false
		});
	}, [selectedProduct?.id]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "Escape") {
				if (zoomedImage) setZoomedImage(null);
				else if (selectedProduct) setSelectedProduct(null);
			} else if (selectedProduct) {
				if (e.key.toLowerCase() === "a" && !isEditModalOpen && !isChangesModalOpen && !isRejectModalOpen) handleApprove(selectedProduct);
				else if (e.key.toLowerCase() === "r" && !isEditModalOpen && !isChangesModalOpen && !isRejectModalOpen) setIsRejectModalOpen(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		selectedProduct,
		zoomedImage,
		isEditModalOpen,
		isChangesModalOpen,
		isRejectModalOpen
	]);
	const pendingQueue = (0, import_react.useMemo)(() => {
		return products.filter((p) => {
			if (!(p.status === "Pending Review" || p.vendorProductRecord && p.vendorProductRecord.status === "pending_review" || Boolean(p.pendingRevision))) return false;
			if (filterType === "REVISION") return Boolean(p.pendingRevision);
			if (filterType === "NEW") return !p.pendingRevision && !p.id.startsWith("offer_");
			if (filterType === "OFFER") return p.id.startsWith("offer_");
			return true;
		});
	}, [products, filterType]);
	const allPendingCount = (0, import_react.useMemo)(() => products.filter((p) => p.status === "Pending Review" || p.pendingRevision).length, [products]);
	const revisionsCount = (0, import_react.useMemo)(() => products.filter((p) => Boolean(p.pendingRevision)).length, [products]);
	const newProductsCount = (0, import_react.useMemo)(() => products.filter((p) => (p.status === "Pending Review" || p.vendorProductRecord?.status === "pending_review") && !p.pendingRevision).length, [products]);
	const handleApprove = (p) => {
		approveProductReview(p.id);
		toast.success(`Approved "${p.title}"! It is now live in the store.`);
		setSelectedProduct(null);
	};
	const handleApproveWithEdits = () => {
		if (!selectedProduct) return;
		approveProductReview(selectedProduct.id, {
			title: editTitle,
			category: editCategory,
			price: editPrice,
			discountPrice: editDiscountPrice
		});
		toast.success(`Approved "${editTitle}" with revisions!`);
		setIsEditModalOpen(false);
		setSelectedProduct(null);
	};
	const handleRequestChanges = () => {
		if (!selectedProduct) return;
		requestProductReviewChanges(selectedProduct.id, { [changeField]: changeComment || "Please review and rectify specified product details." });
		toast.info(`Requested revisions on "${selectedProduct.title}"`);
		setIsChangesModalOpen(false);
		setSelectedProduct(null);
	};
	const handleReject = () => {
		if (!selectedProduct) return;
		rejectProductReview(selectedProduct.id, rejectReason);
		toast.error(`Rejected "${selectedProduct.title}"`);
		setIsRejectModalOpen(false);
		setSelectedProduct(null);
	};
	const handleBulkApprove = () => {
		if (selectedProductIds.length === 0) return;
		selectedProductIds.forEach((id) => approveProductReview(id));
		toast.success(`Approved ${selectedProductIds.length} listings in bulk!`);
		setSelectedProductIds([]);
	};
	const handleBulkReject = () => {
		if (selectedProductIds.length === 0) return;
		selectedProductIds.forEach((id) => rejectProductReview(id, "Bulk rejected during moderation batch"));
		toast.error(`Rejected ${selectedProductIds.length} listings`);
		setSelectedProductIds([]);
	};
	const toggleSelectProduct = (id) => {
		setSelectedProductIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
	};
	const toggleSelectAll = () => {
		if (selectedProductIds.length === pendingQueue.length) setSelectedProductIds([]);
		else setSelectedProductIds(pendingQueue.map((p) => p.id));
	};
	const priceSanity = (0, import_react.useMemo)(() => {
		if (!selectedProduct) return null;
		const sameCat = products.filter((p) => p.id !== selectedProduct.id && p.category === selectedProduct.category && p.status === "Active");
		if (sameCat.length === 0) return {
			status: "normal",
			note: "First product in category"
		};
		const avgPrice = sameCat.reduce((sum, p) => sum + (p.discountPrice || p.price), 0) / sameCat.length;
		const currentPrice = selectedProduct.discountPrice || selectedProduct.price;
		const diffPct = Math.round((currentPrice - avgPrice) / avgPrice * 100);
		if (diffPct < -40) return {
			status: "low",
			note: `Price is ${Math.abs(diffPct)}% below category benchmark (₹${Math.round(avgPrice)}). Verify genuine parts.`
		};
		else if (diffPct > 60) return {
			status: "high",
			note: `Price is ${diffPct}% above category benchmark (₹${Math.round(avgPrice)}).`
		};
		return {
			status: "normal",
			note: `Within typical category benchmark (avg ₹${Math.round(avgPrice)}).`
		};
	}, [selectedProduct, products]);
	const duplicateWarning = (0, import_react.useMemo)(() => {
		if (!selectedProduct) return null;
		const dup = products.find((p) => p.id !== selectedProduct.id && (p.sku.toLowerCase() === selectedProduct.sku.toLowerCase() || p.title.trim().toLowerCase() === selectedProduct.title.trim().toLowerCase()));
		return dup ? `Potential duplicate of "${dup.title}" (SKU: ${dup.sku})` : null;
	}, [selectedProduct, products]);
	const fitmentWarnings = (0, import_react.useMemo)(() => {
		if (!selectedProduct) return [];
		const specsVoltageStr = selectedProduct.specs?.voltage || selectedProduct.vendorProductRecord?.specs?.voltage || "";
		const parsedVolt = parseInt(specsVoltageStr.replace(/\D/g, ""), 10);
		if (!parsedVolt) return [];
		const warnings = [];
		(selectedProduct.compatibleBikes || []).forEach((bikeId) => {
			const b = bikes.find((bk) => bk.id === bikeId);
			if (b && b.voltage && b.voltage !== parsedVolt) warnings.push(`Voltage mismatch with ${b.name}: part is ${parsedVolt}V, bike runs on ${b.voltage}V`);
		});
		return warnings;
	}, [selectedProduct]);
	const columns = [
		{
			key: "id",
			header: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleSelectAll,
					className: "text-gray-400 hover:text-[#E31E24] transition cursor-pointer",
					children: selectedProductIds.length > 0 && selectedProductIds.length === pendingQueue.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-[#E31E24]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select" })]
			}),
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					toggleSelectProduct(p.id);
				},
				className: "text-gray-400 hover:text-[#E31E24] transition cursor-pointer",
				children: selectedProductIds.includes(p.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-[#E31E24]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
			})
		},
		{
			key: "title",
			header: "Product & SKU",
			sortable: true,
			render: (p) => {
				const vp = p.vendorProductRecord;
				const mainImg = vp?.images?.[0] || p.imageUrl;
				const isRevision = Boolean(p.pendingRevision);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: mainImg,
							alt: p.title,
							className: "h-11 w-11 rounded-xl object-cover border border-[#E5E7EB] shrink-0 bg-gray-100"
						}), isRevision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-extrabold px-1 rounded-full shadow-xs",
							children: "REV"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-[#111111] truncate text-sm",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-gray-500",
								children: p.sku
							}), vp?.partType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded-md border border-gray-200",
								children: vp.partType
							})]
						})]
					})]
				});
			}
		},
		{
			key: "sellerName",
			header: "Vendor Store",
			sortable: true,
			render: (p) => {
				const seller = sellers.find((s) => s.id === p.sellerId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-xs text-[#111111]",
					children: p.sellerName || seller?.storeName || "Vendor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-gray-500",
					children: ["ID: ", p.sellerId]
				})] });
			}
		},
		{
			key: "category",
			header: "Category",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-xs text-[#111111]",
				children: p.category
			})
		},
		{
			key: "price",
			header: "Pricing",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-xs text-[#111111] tabular-nums",
				children: ["₹", (p.discountPrice || p.price).toLocaleString("en-IN")]
			}), p.discountPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-gray-400 line-through tabular-nums",
				children: ["MRP ₹", p.price.toLocaleString("en-IN")]
			})] })
		},
		{
			key: "status",
			header: "Submission Type",
			render: (p) => {
				if (p.pendingRevision) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Revision"]
				});
				if (p.id.startsWith("offer_")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }), " Offer Listing"]
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " New Product"]
				});
			}
		},
		{
			key: "actions",
			header: "Actions",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					size: "sm",
					variant: "ghost",
					onClick: (e) => {
						e.stopPropagation();
						setSelectedProduct(p);
					},
					className: "text-xs h-7.5 px-2.5 font-bold text-[#E31E24] hover:bg-red-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 mr-1" }), "Review"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
					size: "sm",
					variant: "ghost",
					onClick: (e) => {
						e.stopPropagation();
						handleApprove(p);
					},
					className: "text-xs h-7.5 px-2 text-emerald-600 hover:bg-emerald-50",
					title: "Quick Approve",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
				})]
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-black text-[#111111]",
						children: "Product Approvals Queue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-[#E31E24]",
						children: [allPendingCount, " pending"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#4B5563] mt-1",
					children: "Review vendor catalog listings, fitment compatibility, HSN tax accuracy and image authenticity."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 flex-wrap",
					children: [selectedProductIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-gray-700",
								children: [selectedProductIds.length, " selected"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								size: "sm",
								onClick: handleBulkApprove,
								className: "bg-emerald-600 text-white text-xs h-7 px-2.5 font-bold",
								children: "Approve"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								size: "sm",
								variant: "destructive",
								onClick: handleBulkReject,
								className: "text-xs h-7 px-2.5 font-bold",
								children: "Reject"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
						onClick: approveAllPending,
						className: "bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs shadow-sm hover:from-red-700 hover:to-red-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 mr-1.5" }), "Approve All Pending (Demo)"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4 border-l-4 border-l-[#E31E24]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 font-medium",
								children: "Pending Review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-[#111111] mt-1",
								children: allPendingCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-400 mt-0.5",
								children: "Average SLA: < 4 hours"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4 border-l-4 border-l-purple-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 font-medium",
								children: "New Products"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-[#111111] mt-1",
								children: newProductsCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-purple-600 font-semibold mt-0.5",
								children: "Brand new catalog SKUs"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4 border-l-4 border-l-amber-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 font-medium",
								children: "Live Revisions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-[#111111] mt-1",
								children: revisionsCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-amber-600 font-semibold mt-0.5",
								children: "Old version remains live"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4 border-l-4 border-l-emerald-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 font-medium",
								children: "Auto-Checks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Fitment & HSN Active"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-gray-400 mt-0.5",
								children: "Instant validation guardrails"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-gray-200 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilterType("ALL"),
						className: `px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === "ALL" ? "bg-[#E31E24] text-white" : "text-gray-600 hover:text-black hover:bg-gray-100"}`,
						children: [
							"All Items (",
							allPendingCount,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilterType("NEW"),
						className: `px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === "NEW" ? "bg-[#E31E24] text-white" : "text-gray-600 hover:text-black hover:bg-gray-100"}`,
						children: [
							"New Listings (",
							newProductsCount,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilterType("REVISION"),
						className: `px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === "REVISION" ? "bg-[#E31E24] text-white" : "text-gray-600 hover:text-black hover:bg-gray-100"}`,
						children: [
							"Revisions (",
							revisionsCount,
							")"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns,
				data: pendingQueue,
				selectable: false,
				keyExtractor: (p) => p.id,
				searchKeys: [
					"title",
					"sku",
					"sellerName",
					"category"
				],
				searchPlaceholder: "Search listings by title, SKU, vendor...",
				emptyTitle: "Approvals queue is clear!",
				emptyDescription: "There are no products currently waiting for admin moderation.",
				onRowClick: (p) => setSelectedProduct(p)
			}),
			selectedProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassDrawer, {
				isOpen: Boolean(selectedProduct),
				onClose: () => setSelectedProduct(null),
				title: `Review Listing: ${selectedProduct.title}`,
				subtitle: `SKU: ${selectedProduct.sku} · Submitted by ${selectedProduct.sellerName}`,
				size: "xl",
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-gray-500 font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shortcuts:" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border",
								children: "A"
							}),
							" Approve",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border",
								children: "R"
							}),
							" Reject",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border",
								children: "Esc"
							}),
							" Close"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "destructive",
								size: "sm",
								onClick: () => setIsRejectModalOpen(true),
								className: "font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 mr-1" }), "Reject"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "secondary",
								size: "sm",
								onClick: () => {
									setChangeField("images");
									setChangeComment("");
									setIsChangesModalOpen(true);
								},
								className: "font-bold text-xs",
								children: "Request Changes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								variant: "secondary",
								size: "sm",
								onClick: () => {
									setEditTitle(selectedProduct.title);
									setEditCategory(selectedProduct.category);
									setEditPrice(selectedProduct.price);
									setEditDiscountPrice(selectedProduct.discountPrice || selectedProduct.price);
									setIsEditModalOpen(true);
								},
								className: "font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 mr-1" }), "Approve with Edits"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
								size: "sm",
								onClick: () => handleApprove(selectedProduct),
								className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-1" }), "Approve Listing"]
							})
						]
					})]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						selectedProduct.pendingRevision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl bg-amber-50 border border-amber-200 p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-amber-900",
									children: "Pending Revision for Live Product"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-amber-800 mt-0.5",
									children: "The original version of this product remains live to customers with existing specs. Approving this replaces the live catalog version with the updated details below."
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								duplicateWarning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2.5 text-xs text-red-800 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-red-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: duplicateWarning })]
								}),
								priceSanity && priceSanity.status !== "normal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5 text-xs text-amber-800 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: priceSanity.note })]
								}),
								fitmentWarnings.map((w, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-orange-50 border border-orange-200 p-3 flex items-center gap-2.5 text-xs text-orange-800 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-orange-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: w })]
								}, idx))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "font-bold text-sm text-[#111111] mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Product Images (",
								selectedProduct.vendorProductRecord?.images?.length || 1,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-normal text-gray-500",
								children: "Click any image to view full-resolution"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 sm:grid-cols-6 gap-2.5",
							children: (selectedProduct.vendorProductRecord?.images || [selectedProduct.imageUrl]).map((img, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setZoomedImage(img),
								className: "group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:border-[#E31E24] transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: `Thumb ${index + 1}`,
										className: "w-full h-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-white" })
									}),
									index === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded",
										children: "Main"
									})
								]
							}, index))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "font-bold text-xs uppercase tracking-wider text-gray-500",
									children: "Core Listing Info"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Title:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-gray-900 text-right",
												children: selectedProduct.title
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Category:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-gray-900",
												children: selectedProduct.category
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Part Type:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-gray-900",
												children: selectedProduct.vendorProductRecord?.partType || "Genuine"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "SKU / Barcode:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-gray-900",
												children: selectedProduct.sku
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Warranty:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-gray-900",
												children: [selectedProduct.warrantyMonths, " Months Replacement"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Stock Units:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-gray-900",
												children: [selectedProduct.stock, " units"]
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "font-bold text-xs uppercase tracking-wider text-gray-500",
									children: "Tax, Pricing & Compliance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "MRP:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-gray-900",
												children: ["₹", selectedProduct.price.toLocaleString("en-IN")]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Selling Price:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-emerald-700 text-sm",
												children: ["₹", (selectedProduct.discountPrice || selectedProduct.price).toLocaleString("en-IN")]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "HSN Code:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-gray-900",
												children: selectedProduct.vendorProductRecord?.hsnCode || "85076000"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "GST Slab:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-gray-900",
												children: [selectedProduct.vendorProductRecord?.gstRate || 18, "%"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between py-1 border-b border-gray-200/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-500",
												children: "Li-ion Hazardous:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-gray-900",
												children: selectedProduct.category === "Batteries" ? "Yes (UN38.3 Certified)" : "No"
											})]
										})
									]
								})]
							})]
						}),
						selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-2xl p-4 border border-gray-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "font-bold text-xs uppercase tracking-wider text-gray-500 mb-2",
								children: "Technical Parameters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
								children: Object.entries(selectedProduct.specs).map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-gray-50 p-2 rounded-xl text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-400 block text-[10px] uppercase font-bold",
										children: key
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-gray-800",
										children: String(val)
									})]
								}, key))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-2xl p-4 border border-gray-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compatible EV Bike Models" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-[#E31E24]",
									children: [selectedProduct.compatibleBikes?.length || 0, " models mapped"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: (selectedProduct.compatibleBikes || []).map((bikeId) => {
									const b = bikes.find((bk) => bk.id === bikeId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2.5 py-1 bg-red-50 text-[#E31E24] border border-red-200 rounded-lg text-xs font-bold",
										children: [
											b?.name || bikeId,
											" ",
											b?.voltage ? `(${b.voltage}V)` : ""
										]
									}, bikeId);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
								className: "font-bold text-xs uppercase tracking-wider text-gray-600 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-[#E31E24]" }), "Admin Moderation Checklist"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.images,
											onChange: (e) => setChecklist((prev) => ({
												...prev,
												images: e.target.checked
											})),
											className: "accent-[#E31E24] h-4 w-4 rounded"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Images are authentic and unwatermarked" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.category,
											onChange: (e) => setChecklist((prev) => ({
												...prev,
												category: e.target.checked
											})),
											className: "accent-[#E31E24] h-4 w-4 rounded"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Category & sub-type accurately matched" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.fitment,
											onChange: (e) => setChecklist((prev) => ({
												...prev,
												fitment: e.target.checked
											})),
											className: "accent-[#E31E24] h-4 w-4 rounded"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fitment & voltage compatibility verified" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.tax,
											onChange: (e) => setChecklist((prev) => ({
												...prev,
												tax: e.target.checked
											})),
											className: "accent-[#E31E24] h-4 w-4 rounded"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HSN code & GST slab compliant" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: checklist.genuine,
											onChange: (e) => setChecklist((prev) => ({
												...prev,
												genuine: e.target.checked
											})),
											className: "accent-[#E31E24] h-4 w-4 rounded"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No prohibited or counterfeit parts detected" })]
									})
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: isEditModalOpen,
				onClose: () => setIsEditModalOpen(false),
				title: "Approve with Revisions",
				size: "md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Fix minor taxonomy or naming issues directly so the vendor does not need to re-submit."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Product Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							value: editTitle,
							onChange: (e) => setEditTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: editCategory,
							onChange: (e) => setEditCategory(e.target.value),
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Batteries",
									children: "Batteries"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Motors & Controllers",
									children: "Motors & Controllers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Chargers & Cables",
									children: "Chargers & Cables"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Brakes & Suspension",
									children: "Brakes & Suspension"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Tires & Wheels",
									children: "Tires & Wheels"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Accessories",
									children: "Accessories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Riding Gear",
									children: "Riding Gear"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-gray-700 block mb-1",
								children: "MRP (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								value: editPrice,
								onChange: (e) => setEditPrice(Number(e.target.value))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-gray-700 block mb-1",
								children: "Selling Price (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								value: editDiscountPrice,
								onChange: (e) => setEditDiscountPrice(Number(e.target.value))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "ghost",
								onClick: () => setIsEditModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								onClick: handleApproveWithEdits,
								className: "bg-emerald-600 text-white font-bold text-xs",
								children: "Save & Approve Live"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: isChangesModalOpen,
				onClose: () => setIsChangesModalOpen(false),
				title: "Request Changes from Vendor",
				size: "md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Specify the section that needs attention. The vendor will receive an in-app notice to update and resubmit."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Field / Area"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: changeField,
							onChange: (e) => setChangeField(e.target.value),
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "images",
									children: "Product Images (Quality / Missing main image)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "title_description",
									children: "Title & Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "specs",
									children: "Technical Specs / Battery Voltage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "fitment",
									children: "Bike Fitment Mapping"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tax_pricing",
									children: "HSN Code or GST Slab"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Admin Feedback Note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: changeComment,
							onChange: (e) => setChangeComment(e.target.value),
							placeholder: "e.g. Please upload higher-resolution non-blurry images of the terminal connectors...",
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "ghost",
								onClick: () => setIsChangesModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								onClick: handleRequestChanges,
								className: "bg-amber-600 text-white font-bold text-xs",
								children: "Send Revision Request"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: isRejectModalOpen,
				onClose: () => setIsRejectModalOpen(false),
				title: "Reject Listing",
				size: "md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Rejection delists this product permanently from the queue. State the regulatory or marketplace reason."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-gray-700 block mb-1",
							children: "Rejection Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: rejectReason,
							onChange: (e) => setRejectReason(e.target.value),
							className: "w-full text-xs rounded-xl border border-gray-200 p-2.5 bg-white font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Prohibited or counterfeit automotive item",
									children: "Prohibited or counterfeit automotive item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Uncertified Li-ion cells / Missing UN38.3 test summary",
									children: "Uncertified Li-ion cells / Missing UN38.3 test summary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Incorrect brand claim or unauthorized resale",
									children: "Incorrect brand claim or unauthorized resale"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Severe price gouging or misleading listing",
									children: "Severe price gouging or misleading listing"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "ghost",
								onClick: () => setIsRejectModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								variant: "destructive",
								onClick: handleReject,
								className: "font-bold text-xs",
								children: "Confirm Rejection"
							})]
						})
					]
				})
			}),
			zoomedImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setZoomedImage(null),
				className: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-4xl max-h-[90vh]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: zoomedImage,
						alt: "Zoomed Product",
						className: "max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain bg-white"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-white/80 text-xs mt-2",
						children: "Click anywhere or press Esc to close"
					})]
				})
			})
		]
	});
}
//#endregion
export { ProductApprovalsScreen };

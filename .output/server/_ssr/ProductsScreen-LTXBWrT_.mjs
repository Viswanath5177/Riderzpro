import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Plus, U as Pen, p as Trash2 } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as DataTable } from "./DataTable-DPLKpKie.mjs";
import { t as StatusBadge } from "./StatusBadge-C1LTnUEc.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-Dvo5t1xh.mjs";
import { n as useAdminStore } from "./adminStore-CYTUJD7p.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
import { t as GlassSelect } from "./GlassSelect-BzoeLAya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductsScreen-LTXBWrT_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductsScreen() {
	const { products, bikes, sellers, addProduct, updateProduct, deleteProduct } = useAdminStore();
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [isAddModalOpen, setIsAddModalOpen] = (0, import_react.useState)(false);
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const [deleteModalProduct, setDeleteModalProduct] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [sku, setSku] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Batteries");
	const [sellerId, setSellerId] = (0, import_react.useState)(sellers[0]?.id || "seller_01");
	const [price, setPrice] = (0, import_react.useState)(2500);
	const [discountPrice, setDiscountPrice] = (0, import_react.useState)(1999);
	const [stock, setStock] = (0, import_react.useState)(20);
	const [minStockThreshold, setMinStockThreshold] = (0, import_react.useState)(5);
	const [warrantyMonths, setWarrantyMonths] = (0, import_react.useState)(24);
	const [selectedBikes, setSelectedBikes] = (0, import_react.useState)([bikes[0]?.id || "bike_ather_450x"]);
	const [imageUrl, setImageUrl] = (0, import_react.useState)("https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80");
	const filterTabs = [
		{
			label: "All Catalog",
			value: "ALL",
			count: products.length
		},
		{
			label: "Active",
			value: "Active",
			count: products.filter((p) => p.status === "Active").length
		},
		{
			label: "Low Stock",
			value: "Low Stock",
			count: products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length
		},
		{
			label: "Pending Review",
			value: "Pending Review",
			count: products.filter((p) => p.status === "Pending Review").length
		}
	];
	const columns = [
		{
			key: "title",
			header: "Product & SKU",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.imageUrl,
					alt: p.title,
					className: "h-10 w-10 rounded-xl object-cover border border-[#E5E7EB] shrink-0 bg-gray-100"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-[#111111] truncate text-sm",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-[#4B5563] font-mono mt-0.5",
						children: [
							"SKU: ",
							p.sku,
							" · Seller: ",
							p.sellerName
						]
					})]
				})]
			})
		},
		{
			key: "category",
			header: "Category",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold text-[#111111] text-xs",
				children: p.category
			})
		},
		{
			key: "price",
			header: "Price",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-[#111111] tabular-nums text-xs",
				children: ["₹", (p.discountPrice || p.price).toLocaleString("en-IN")]
			}), p.discountPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-[#6B7280] line-through font-medium",
				children: ["₹", p.price.toLocaleString("en-IN")]
			})] })
		},
		{
			key: "stock",
			header: "Stock Units",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `font-bold tabular-nums text-xs ${p.stock <= p.minStockThreshold ? "text-red-700" : "text-emerald-700"}`,
				children: [p.stock, " units"]
			}), p.stock <= p.minStockThreshold && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] font-bold text-red-700 uppercase",
				children: ["Alert: Below ", p.minStockThreshold]
			})] })
		},
		{
			key: "compatibleBikes",
			header: "Fitment",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[11px] font-bold text-[#374151]",
				children: [p.compatibleBikes.length, " Bikes Compatible"]
			})
		},
		{
			key: "status",
			header: "Status",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				status: p.status,
				size: "sm"
			})
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-right",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1.5",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setEditingProduct(p);
						setTitle(p.title);
						setSku(p.sku);
						setCategory(p.category);
						setPrice(p.price);
						setDiscountPrice(p.discountPrice || p.price);
						setStock(p.stock);
						setMinStockThreshold(p.minStockThreshold);
						setWarrantyMonths(p.warrantyMonths);
						setSelectedBikes(p.compatibleBikes);
						setImageUrl(p.imageUrl);
					},
					className: "rounded-lg bg-gray-100 text-[#374151] hover:bg-gray-200 p-1.5 transition cursor-pointer",
					title: "Edit Product",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setDeleteModalProduct(p),
					className: "rounded-lg bg-red-100 text-red-700 hover:bg-red-200 p-1.5 transition cursor-pointer",
					title: "Delete Product",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
				})]
			})
		}
	];
	const handleSaveProduct = (e) => {
		e.preventDefault();
		const seller = sellers.find((s) => s.id === sellerId) || sellers[0];
		if (editingProduct) {
			updateProduct(editingProduct.id, {
				title,
				sku,
				category,
				price,
				discountPrice,
				stock,
				minStockThreshold,
				warrantyMonths,
				compatibleBikes: selectedBikes,
				imageUrl,
				status: stock <= 0 ? "Out of Stock" : stock <= minStockThreshold ? "Low Stock" : "Active"
			});
			setEditingProduct(null);
		} else {
			addProduct({
				title,
				sku,
				category,
				sellerId: seller.id,
				sellerName: seller.businessName,
				price,
				discountPrice,
				stock,
				minStockThreshold,
				warrantyMonths,
				compatibleBikes: selectedBikes,
				imageUrl,
				status: "Active",
				specs: {
					"Standard": "Certified OEM Replacement",
					"Fitment Guarantee": "100% VIN Matched"
				}
			});
			setIsAddModalOpen(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
					children: "Catalog Inventory & Fitment Mapping"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#4B5563] font-medium mt-1",
					children: "Manage EV spare parts, batteries, chargers, threshold stock alerts and multi-brand compatibility."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					variant: "primary",
					size: "md",
					onClick: () => {
						setTitle("");
						setSku(`RZP-${Math.floor(1e3 + Math.random() * 9e3)}`);
						setPrice(3500);
						setDiscountPrice(2999);
						setStock(25);
						setIsAddModalOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add New Part / Product" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: products,
				columns,
				searchPlaceholder: "Search product by title, SKU, category or seller...",
				searchKey: (p) => `${p.title} ${p.sku} ${p.category} ${p.sellerName}`,
				filterTabs,
				currentFilter: statusFilter,
				onFilterChange: setStatusFilter,
				filterPredicate: (p, filter) => filter === "Low Stock" ? p.status === "Low Stock" || p.status === "Out of Stock" : p.status === filter,
				keyExtractor: (p) => p.id,
				exportFileName: "riderzpro_products"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
				isOpen: isAddModalOpen || Boolean(editingProduct),
				onClose: () => {
					setIsAddModalOpen(false);
					setEditingProduct(null);
				},
				maxWidth: "xl",
				title: editingProduct ? "Edit Product Details" : "Add New EV Component to Catalog",
				description: "Configure pricing, inventory stock, warranty, and compatible two-wheeler models.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveProduct,
					className: "space-y-4 text-xs text-[#111111]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
									children: "Product Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
									required: true,
									value: title,
									onChange: (e) => setTitle(e.target.value),
									placeholder: "e.g. VoltRide 60V 30Ah Lithium NMC Replacement Battery Pack"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "SKU Code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								required: true,
								value: sku,
								onChange: (e) => setSku(e.target.value),
								placeholder: "BAT-VR-60V30AH"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
								value: category,
								onChange: (e) => setCategory(e.target.value),
								options: [
									{
										value: "Batteries",
										label: "Batteries & BMS"
									},
									{
										value: "Chargers",
										label: "Chargers & Docks"
									},
									{
										value: "Brakes & Suspension",
										label: "Brakes & Suspension"
									},
									{
										value: "Motors & Controllers",
										label: "Motors & Controllers"
									},
									{
										value: "Body & Accessories",
										label: "Body & Accessories"
									},
									{
										value: "Riding Gear",
										label: "Riding Gear & Helmets"
									}
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "MRP Price (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								required: true,
								value: price,
								onChange: (e) => setPrice(parseFloat(e.target.value) || 0)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Discounted Offer Price (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								value: discountPrice,
								onChange: (e) => setDiscountPrice(parseFloat(e.target.value) || 0)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Available Stock Units"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								required: true,
								value: stock,
								onChange: (e) => setStock(parseInt(e.target.value) || 0)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
								children: "Low Stock Threshold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
								type: "number",
								required: true,
								value: minStockThreshold,
								onChange: (e) => setMinStockThreshold(parseInt(e.target.value) || 0)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#374151] font-bold mb-1 uppercase text-[10px]",
									children: "Image URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
									value: imageUrl,
									onChange: (e) => setImageUrl(e.target.value),
									placeholder: "https://..."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2 rounded-2xl bg-gray-50 p-3.5 border border-[#E5E7EB]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[#111111] font-bold mb-2 uppercase text-[10px]",
									children: "Compatible Bike Models (VIN Fitment Mapping)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
									children: bikes.map((b) => {
										const isChecked = selectedBikes.includes(b.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer text-xs text-[#374151] font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: isChecked,
												onChange: (e) => {
													if (e.target.checked) setSelectedBikes([...selectedBikes, b.id]);
													else setSelectedBikes(selectedBikes.filter((id) => id !== b.id));
												},
												className: "rounded border-gray-300 text-[#E31E24] accent-[#E31E24] focus:ring-0 cursor-pointer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b.model })]
										}, b.id);
									})
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							type: "button",
							variant: "secondary",
							size: "sm",
							onClick: () => {
								setIsAddModalOpen(false);
								setEditingProduct(null);
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							type: "submit",
							variant: "primary",
							size: "sm",
							children: "Save Product"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				isOpen: Boolean(deleteModalProduct),
				onClose: () => setDeleteModalProduct(null),
				onConfirm: () => {
					if (deleteModalProduct) {
						deleteProduct(deleteModalProduct.id);
						setDeleteModalProduct(null);
					}
				},
				title: "Remove Product?",
				description: `Are you sure you want to delete ${deleteModalProduct?.title}? It will no longer appear on the customer storefront.`,
				confirmLabel: "Delete from Catalog"
			})
		]
	});
}
//#endregion
export { ProductsScreen };

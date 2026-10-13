import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Et as CircleX, Kt as Bike, O as Search, Ot as CircleCheck, rt as Layers, t as Zap } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAdminStore } from "./adminStore-BvZmspaI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FitmentScreen-J7jahggY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FitmentScreen() {
	const { bikes, products, updateProduct } = useAdminStore();
	const [selectedBrand, setSelectedBrand] = (0, import_react.useState)("ALL");
	const [searchProduct, setSearchProduct] = (0, import_react.useState)("");
	const brands = ["ALL", ...Array.from(new Set(bikes.map((b) => b.brand)))];
	const filteredBikes = bikes.filter((b) => selectedBrand === "ALL" ? true : b.brand === selectedBrand);
	const filteredProducts = products.filter((p) => searchProduct ? p.title.toLowerCase().includes(searchProduct.toLowerCase()) : true);
	const handleToggleFitment = (productId, bikeId, currentChecked) => {
		const product = products.find((p) => p.id === productId);
		if (!product) return;
		let nextBikes;
		if (currentChecked) nextBikes = product.compatibleBikes.filter((id) => id !== bikeId);
		else nextBikes = [...product.compatibleBikes, bikeId];
		updateProduct(productId, { compatibleBikes: nextBikes });
		toast.info("Fitment Matrix Updated", { description: `${currentChecked ? "Removed" : "Linked"} compatibility for ${product.title.slice(0, 25)}...` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight",
				children: "Bikes & VIN Fitment Compatibility Matrix"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] font-medium mt-1",
				children: "Precision matching matrix between verified EV models, voltages, connector types and catalog spare parts."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-bold text-sm text-[#111111] flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Supported Two-Wheeler Architectures (",
						filteredBikes.length,
						")"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-1 text-xs",
					children: brands.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelectedBrand(brand),
						className: `rounded-xl px-3 py-1 font-bold transition cursor-pointer ${selectedBrand === brand ? "bg-[#E31E24] text-white shadow-xs" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-200/60"}`,
						children: brand
					}, brand))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filteredBikes.map((bike) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-extrabold uppercase tracking-wider text-[#E31E24]",
								children: bike.brand
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-[#111111] text-base mt-0.5",
								children: bike.model
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#4B5563] font-medium",
								children: bike.yearRange
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-[#E31E24] border border-red-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4.5 w-4.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-[#F3F4F6] space-y-1.5 text-xs text-[#374151]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#6B7280] font-medium",
									children: "System Voltage:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-[#111111] font-mono",
									children: [bike.voltage, "V"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#6B7280] font-medium",
									children: "Battery Pack:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-[#111111]",
									children: bike.batteryCapacity
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#6B7280] font-medium",
									children: "Motor Power:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-[#111111]",
									children: [bike.powerKw, " kW Peak"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#6B7280] font-medium",
									children: "Connector Port:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-[#111111] truncate max-w-[140px]",
									title: bike.connectorType,
									children: bike.connectorType
								})]
							})
						]
					})]
				}, bike.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-[#111111] flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interactive Parts-vs-Bikes Compatibility Matrix" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#4B5563] font-medium",
						children: "Click any cell to toggle instant VIN fitment guarantee for that bike model."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search part name...",
							value: searchProduct,
							onChange: (e) => setSearchProduct(e.target.value),
							className: "h-9 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-9 pr-3 text-xs text-[#111111] font-medium placeholder:text-[#9CA3AF] shadow-2xs outline-none focus:border-[#E31E24]"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white overflow-x-auto shadow-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[#E5E7EB] bg-gray-50/80 text-[#374151] uppercase font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5 pl-5 min-w-[220px]",
									children: "Product / Component"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5",
									children: "Category"
								}),
								bikes.map((bike) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
									className: "p-3 text-center min-w-[110px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold text-[#111111] truncate max-w-[100px]",
										title: bike.model,
										children: bike.model.split(" ")[0]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[9px] text-[#6B7280] font-mono font-bold",
										children: [bike.voltage, "V"]
									})]
								}, bike.id))
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#F3F4F6] text-[#111111]",
							children: filteredProducts.slice(0, 15).map((prod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/80 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-3.5 pl-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111] truncate max-w-xs",
											children: prod.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-[#4B5563] font-mono mt-0.5",
											children: ["SKU: ", prod.sku]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-[#4B5563] font-medium",
										children: prod.category
									}),
									bikes.map((bike) => {
										const isLinked = prod.compatibleBikes.includes(bike.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleToggleFitment(prod.id, bike.id, isLinked),
												className: `h-7 w-7 rounded-xl flex items-center justify-center mx-auto transition cursor-pointer ${isLinked ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200 hover:text-gray-600"}`,
												title: `${isLinked ? "Compatible" : "Incompatible"} with ${bike.model}`,
												children: isLinked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" })
											})
										}, bike.id);
									})
								]
							}, prod.id))
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { FitmentScreen };

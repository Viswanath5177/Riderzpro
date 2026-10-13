import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Mt as ChevronsLeft, Nt as ChevronRight, O as Search, Pt as ChevronLeft, bt as Download, en as ArrowUpDown, jt as ChevronsRight, pt as Funnel } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DataTable-CQjqc3RE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DataTable({ data, columns, pageSize = 10, searchPlaceholder = "Search records...", searchKey, filterTabs, currentFilter, onFilterChange, filterPredicate, onRowClick, keyExtractor, actions, exportFileName = "export", emptyMessage = "No matching records found" }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const [sortKey, setSortKey] = (0, import_react.useState)(null);
	const [sortOrder, setSortOrder] = (0, import_react.useState)("asc");
	const [page, setPage] = (0, import_react.useState)(1);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const filteredData = (0, import_react.useMemo)(() => {
		let result = [...data];
		if (currentFilter && currentFilter !== "ALL" && filterPredicate) result = result.filter((item) => filterPredicate(item, currentFilter));
		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter((item) => {
				if (typeof searchKey === "function") return searchKey(item).toLowerCase().includes(q);
				else if (searchKey) return String(item[searchKey] || "").toLowerCase().includes(q);
				return Object.values(item).some((val) => typeof val === "string" ? val.toLowerCase().includes(q) : false);
			});
		}
		if (sortKey) result.sort((a, b) => {
			const valA = a[sortKey];
			const valB = b[sortKey];
			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
		return result;
	}, [
		data,
		search,
		searchKey,
		currentFilter,
		filterPredicate,
		sortKey,
		sortOrder
	]);
	const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
	const paginatedData = (0, import_react.useMemo)(() => {
		const start = (page - 1) * pageSize;
		return filteredData.slice(start, start + pageSize);
	}, [
		filteredData,
		page,
		pageSize
	]);
	const handleSort = (key) => {
		if (sortKey === key) setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortOrder("asc");
		}
	};
	const handleSelectAll = (checked) => {
		if (checked) setSelectedIds(new Set(paginatedData.map(keyExtractor)));
		else setSelectedIds(/* @__PURE__ */ new Set());
	};
	const handleSelectRow = (id) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};
	const handleExportCsv = () => {
		if (!filteredData.length) return;
		const csvContent = "data:text/csv;charset=utf-8," + [columns.map((c) => `"${c.header}"`).join(","), ...filteredData.map((item) => columns.map((c) => {
			const val = item[c.key];
			return typeof val === "string" ? `"${val.replace(/"/g, "\"\"")}"` : val ?? "";
		}).join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `${exportFileName}_${Date.now()}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: searchPlaceholder,
					value: search,
					onChange: (e) => {
						setSearch(e.target.value);
						setPage(1);
					},
					className: "h-10 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm font-medium text-[#111111] placeholder:text-[#9CA3AF] shadow-2xs outline-none transition focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					filterTabs && onFilterChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-1",
						children: filterTabs.map((tab) => {
							const isActive = (currentFilter || "ALL") === tab.value;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									onFilterChange(tab.value);
									setPage(1);
								},
								className: cn("flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer", isActive ? "bg-[#E31E24] text-white shadow-xs" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-200/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }), tab.count !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-1.5 py-0.2 text-[10px] leading-tight font-bold", isActive ? "bg-white/20 text-white" : "bg-gray-200 text-[#4B5563]"),
									children: tab.count
								})]
							}, tab.value);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleExportCsv,
						title: "Export filtered data to CSV",
						className: "flex items-center gap-1.5 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-gray-50 px-3.5 py-2 text-xs font-semibold text-[#111111] shadow-2xs transition cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-[#4B5563]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Export CSV"
						})]
					}),
					actions
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left border-collapse text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-[#E5E7EB] bg-gray-50/90 text-[#4B5563] uppercase tracking-wider font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3.5 pl-5 w-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								"aria-label": "Select all",
								checked: paginatedData.length > 0 && selectedIds.size === paginatedData.length,
								onChange: (e) => handleSelectAll(e.target.checked),
								className: "rounded border-gray-300 text-[#E31E24] focus:ring-0 cursor-pointer accent-[#E31E24]"
							})
						}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							onClick: () => col.sortable && handleSort(col.key),
							className: cn("p-3.5 font-bold select-none text-[#374151]", col.sortable && "cursor-pointer hover:text-[#111111] transition", col.className),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: col.header }), col.sortable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 text-[#9CA3AF]" })]
							})
						}, col.key))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-[#E5E7EB] text-[#111111]",
						children: paginatedData.length > 0 ? paginatedData.map((item) => {
							const id = keyExtractor(item);
							const isSelected = selectedIds.has(id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								onClick: () => onRowClick && onRowClick(item),
								className: cn("transition-colors", onRowClick ? "cursor-pointer hover:bg-gray-50/80" : "hover:bg-gray-50/50", isSelected && "bg-red-50/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3.5 pl-5",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										"aria-label": `Select row ${id}`,
										checked: isSelected,
										onChange: () => handleSelectRow(id),
										className: "rounded border-gray-300 text-[#E31E24] focus:ring-0 cursor-pointer accent-[#E31E24]"
									})
								}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("p-3.5 text-[#111111]", col.className),
									children: col.render ? col.render(item) : String(item[col.key] ?? "")
								}, col.key))]
							}, id);
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: columns.length + 1,
							className: "py-12 text-center text-[#6B7280]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-6 w-6 text-[#9CA3AF]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-sm text-[#111111]",
										children: emptyMessage
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#6B7280]",
										children: "Try clearing search or filters to see more results."
									})
								]
							})
						}) })
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E7EB] bg-gray-50/50 px-5 py-3 text-xs text-[#4B5563]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-[#111111]",
							children: filteredData.length ? (page - 1) * pageSize + 1 : 0
						}),
						" to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-[#111111]",
							children: Math.min(page * pageSize, filteredData.length)
						}),
						" of",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-[#111111]",
							children: filteredData.length
						}),
						" records"
					] }), selectedIds.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#E31E24]",
						children: [selectedIds.size, " selected"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage(1),
							disabled: page === 1,
							"aria-label": "First page",
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: page === 1,
							"aria-label": "Previous page",
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-3 font-semibold text-[#111111]",
							children: [
								"Page ",
								page,
								" of ",
								totalPages
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							disabled: page === totalPages,
							"aria-label": "Next page",
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage(totalPages),
							disabled: page === totalPages,
							"aria-label": "Last page",
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsRight, { className: "h-4 w-4" })
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { DataTable as t };

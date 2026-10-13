import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  Download,
  Filter,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  searchKey?: string | ((item: T) => string);
  searchKeys?: string[];
  searchable?: boolean;
  filterTabs?: { label: string; value: string; count?: number }[];
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterPredicate?: (item: T, filterValue: string) => boolean;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string | number;
  selectable?: boolean;
  actions?: React.ReactNode;
  exportFileName?: string;
  emptyMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchPlaceholder = "Search records...",
  searchKey,
  searchKeys,
  searchable = true,
  filterTabs,
  currentFilter,
  onFilterChange,
  filterPredicate,
  onRowClick,
  keyExtractor,
  selectable = true,
  actions,
  exportFileName = "export",
  emptyMessage = "No matching records found",
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const getKey = React.useCallback(
    (item: T): string | number => {
      if (typeof keyExtractor === "function") {
        return keyExtractor(item);
      }
      return (item as any)?.id ?? (item as any)?.key ?? (item as any)?._id ?? String(Math.random());
    },
    [keyExtractor]
  );

  // Filter & Search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Status filter
    if (currentFilter && currentFilter !== "ALL" && filterPredicate) {
      result = result.filter((item) => filterPredicate(item, currentFilter));
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => {
        if (typeof searchKey === "function") {
          return searchKey(item).toLowerCase().includes(q);
        } else if (typeof searchKey === "string") {
          return String(item[searchKey] || "").toLowerCase().includes(q);
        } else if (Array.isArray(searchKeys) && searchKeys.length > 0) {
          return searchKeys.some((k) => String(item[k] || "").toLowerCase().includes(q));
        }
        // Fallback: search across all string values
        return Object.values(item).some((val) =>
          typeof val === "string" ? val.toLowerCase().includes(q) : false
        );
      });
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, searchKey, searchKeys, currentFilter, filterPredicate, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedData.map(getKey)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportCsv = () => {
    if (!filteredData.length) return;
    const headers = columns.map((c) => {
      const headerText = typeof c.header === "string" ? c.header : c.key;
      return `"${headerText.replace(/"/g, '""')}"`;
    }).join(",");
    const rows = filteredData.map((item) =>
      columns
        .map((c) => {
          const val = item[c.key];
          return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Search, Filters & Actions */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input - Clean high-contrast style */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm font-medium text-[#111111] placeholder:text-[#9CA3AF] shadow-2xs outline-none transition focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* Filter Tabs & Export Action */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs && onFilterChange && (
            <div className="flex rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-1">
              {filterTabs.map((tab) => {
                const isActive = (currentFilter || "ALL") === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => {
                      onFilterChange(tab.value);
                      setPage(1);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                      isActive
                        ? "bg-[#E31E24] text-white shadow-xs"
                        : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-200/60"
                    )}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.2 text-[10px] leading-tight font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-gray-200 text-[#4B5563]"
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleExportCsv}
            title="Export filtered data to CSV"
            className="flex items-center gap-1.5 rounded-2xl border border-[#E5E7EB] bg-white hover:bg-gray-50 px-3.5 py-2 text-xs font-semibold text-[#111111] shadow-2xs transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#4B5563]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {actions}
        </div>
      </div>

      {/* High-Contrast Data Table Card */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50/90 text-[#4B5563] uppercase tracking-wider font-bold">
                {selectable && (
                  <th className="p-3.5 pl-5 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#E31E24] focus:ring-0 cursor-pointer accent-[#E31E24]"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      "p-3.5 font-bold select-none text-[#374151]",
                      col.sortable && "cursor-pointer hover:text-[#111111] transition",
                      col.className
                    )}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && <ArrowUpDown className="h-3 w-3 text-[#9CA3AF]" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111111]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => {
                  const id = getKey(item);
                  const isSelected = selectedIds.has(id);

                  return (
                    <tr
                      key={id}
                      onClick={() => onRowClick && onRowClick(item)}
                      className={cn(
                        "transition-colors",
                        onRowClick ? "cursor-pointer hover:bg-gray-50/80" : "hover:bg-gray-50/50",
                        isSelected && "bg-red-50/40"
                      )}
                    >
                      {selectable && (
                        <td className="p-3.5 pl-5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            aria-label={`Select row ${id}`}
                            checked={isSelected}
                            onChange={() => handleSelectRow(id)}
                            className="rounded border-gray-300 text-[#E31E24] focus:ring-0 cursor-pointer accent-[#E31E24]"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={cn("p-3.5 text-[#111111]", col.className)}>
                          {col.render ? col.render(item) : String(item[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="h-6 w-6 text-[#9CA3AF]" />
                      <p className="font-semibold text-sm text-[#111111]">{emptyTitle || emptyMessage}</p>
                      <p className="text-xs text-[#6B7280]">{emptyDescription || "Try clearing search or filters to see more results."}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E7EB] bg-gray-50/50 px-5 py-3 text-xs text-[#4B5563]">
          <div className="flex items-center gap-2">
            <span>
              Showing <b className="text-[#111111]">{filteredData.length ? (page - 1) * pageSize + 1 : 0}</b> to{" "}
              <b className="text-[#111111]">{Math.min(page * pageSize, filteredData.length)}</b> of{" "}
              <b className="text-[#111111]">{filteredData.length}</b> records
            </span>
            {selectedIds.size > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#E31E24]">
                {selectedIds.size} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="First page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 font-semibold text-[#111111]">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              aria-label="Last page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

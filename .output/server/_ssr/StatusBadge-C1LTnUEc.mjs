import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function StatusBadge({ status, size = "md", className }) {
	const normalized = status.toLowerCase();
	let colorClasses = "bg-gray-100 text-[#374151] border-gray-300 font-bold";
	if ([
		"active",
		"approved",
		"delivered",
		"paid",
		"success",
		"resolved",
		"online",
		"vip"
	].includes(normalized)) colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold";
	else if ([
		"in transit",
		"delivering",
		"shipped"
	].includes(normalized)) colorClasses = "bg-sky-50 text-sky-800 border-sky-300 font-bold";
	else if ([
		"dispatched",
		"processing",
		"pending",
		"pending review",
		"pending inspection",
		"in progress",
		"idle",
		"medium"
	].includes(normalized)) colorClasses = "bg-amber-50 text-amber-900 border-amber-300 font-bold";
	else if ([
		"placed",
		"open",
		"invited"
	].includes(normalized)) colorClasses = "bg-purple-50 text-purple-900 border-purple-300 font-bold";
	else if ([
		"cancelled",
		"refunded",
		"failed",
		"rejected",
		"blocked",
		"suspended",
		"low stock",
		"out of stock",
		"flagged",
		"high",
		"escalated"
	].includes(normalized)) colorClasses = "bg-red-50 text-red-700 border-red-300 font-bold";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border tracking-wide select-none shadow-2xs", size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs", colorClasses, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: status })]
	});
}
//#endregion
export { StatusBadge as t };

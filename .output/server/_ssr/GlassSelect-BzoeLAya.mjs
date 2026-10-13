import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassSelect-BzoeLAya.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GlassSelect = import_react.forwardRef(({ label, error, options, children, className, id, ...props }, ref) => {
	const selectId = id || (label ? `sel_${label.toLowerCase().replace(/\s+/g, "_")}` : void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: selectId,
				className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					ref,
					id: selectId,
					className: cn("w-full appearance-none rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-[#111111] shadow-2xs outline-none transition-all cursor-pointer", "focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20", "[&>option]:bg-white [&>option]:text-[#111111]", error && "border-red-500 focus:border-red-500", className),
					...props,
					children: options ? options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: opt.value,
						children: opt.label
					}, opt.value)) : children
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute right-3.5 h-4 w-4 text-[#6B7280]" })]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-red-600 font-medium",
				children: error
			})
		]
	});
});
GlassSelect.displayName = "GlassSelect";
//#endregion
export { GlassSelect as t };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassInput-CT-MOjp5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GlassInput = import_react.forwardRef(({ label, icon, rightElement, error, className, id, ...props }, ref) => {
	const inputId = id || (label ? `inp_${label.toLowerCase().replace(/\s+/g, "_")}` : void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: inputId,
				className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center",
				children: [
					icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute left-3.5 flex items-center justify-center text-[#6B7280]",
						children: icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref,
						id: inputId,
						className: cn("w-full rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm font-medium text-[#111111] placeholder:text-[#9CA3AF] shadow-2xs outline-none transition-all", "focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20", icon && "pl-10", rightElement && "pr-10", error && "border-red-500 focus:border-red-500 focus:ring-red-500/30", className),
						...props
					}),
					rightElement && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-3.5 flex items-center justify-center",
						children: rightElement
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-red-600 font-medium",
				children: error
			})
		]
	});
});
GlassInput.displayName = "GlassInput";
//#endregion
export { GlassInput as t };

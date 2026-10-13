import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassButton-BkBaQfDX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GlassButton = import_react.forwardRef(({ children, className, variant = "primary", size = "md", isLoading = false, loading = false, icon: Icon, disabled, ...props }, ref) => {
	const isSpinnerActive = isLoading || loading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		disabled: disabled || isSpinnerActive,
		className: cn("inline-flex items-center justify-center font-semibold transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50", size === "sm" && "h-8 px-3 text-xs rounded-xl gap-1.5", size === "md" && "h-10 px-4 text-sm rounded-2xl gap-2", size === "lg" && "h-12 px-6 text-base rounded-2xl gap-2.5", size === "icon" && "h-9 w-9 rounded-xl p-0", variant === "primary" && "bg-[#E31E24] hover:bg-[#CC181E] text-white shadow-xs border border-transparent", variant === "glass" && "border border-[#E5E7EB] bg-white text-[#111111] hover:bg-gray-50 hover:border-gray-300 shadow-2xs", variant === "secondary" && "bg-gray-100 text-[#111111] hover:bg-gray-200 border border-[#E5E7EB] shadow-2xs", variant === "destructive" && "bg-red-600 hover:bg-red-700 text-white shadow-xs border border-transparent", variant === "outline" && "border border-[#E5E7EB] bg-white text-[#111111] hover:bg-gray-50 shadow-2xs", variant === "ghost" && "text-[#4B5563] hover:text-[#111111] hover:bg-gray-100", className),
		...props,
		children: isSpinnerActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: typeof children === "string" ? "Processing..." : children })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4" }), children] })
	});
});
GlassButton.displayName = "GlassButton";
//#endregion
export { GlassButton as t };

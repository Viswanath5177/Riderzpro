import { i as __toESM } from "../_runtime.mjs";
import { t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassCard-DlgeqlaV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GlassCard = import_react.forwardRef(({ children, className, hoverEffect = false, intensity = "normal", ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		ref,
		whileHover: hoverEffect ? {
			y: -3,
			transition: { duration: .2 }
		} : void 0,
		className: cn("admin-glass-card relative overflow-hidden rounded-3xl border transition-all duration-300", intensity === "normal" && "border-[#E5E7EB] bg-white/95 text-[#111111] shadow-xs hover:shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-[#121826]/90 dark:text-white", intensity === "subtle" && "border-[#E5E7EB]/80 bg-white/80 text-[#111111] shadow-2xs backdrop-blur-lg dark:border-white/10 dark:bg-[#0e1422]/80 dark:text-white", intensity === "heavy" && "border-[#E5E7EB] bg-white text-[#111111] shadow-lg backdrop-blur-2xl dark:border-white/15 dark:bg-[#161e30] dark:text-white", "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent dark:before:via-white/20", hoverEffect && "hover:border-[#E31E24]/30 hover:shadow-lg hover:shadow-red-500/5", className),
		...props,
		children
	});
});
GlassCard.displayName = "GlassCard";
//#endregion
export { GlassCard as t };

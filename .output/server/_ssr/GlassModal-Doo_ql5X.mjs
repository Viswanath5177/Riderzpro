import { i as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassModal-Doo_ql5X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlassModal({ isOpen, onClose, title, description, children, maxWidth = "md", className }) {
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			onClick: onClose,
			className: "fixed inset-0 bg-black/65 backdrop-blur-md"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .95,
				y: 15
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .95,
				y: 15
			},
			transition: {
				type: "spring",
				duration: .35,
				bounce: .1
			},
			className: cn("relative z-10 w-full overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6 text-[#111111] shadow-2xl", maxWidth === "sm" && "max-w-sm", maxWidth === "md" && "max-w-md", maxWidth === "lg" && "max-w-lg", maxWidth === "xl" && "max-w-xl", maxWidth === "2xl" && "max-w-2xl", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-bold tracking-tight text-[#111111]",
					children: title
				}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-[#4B5563] font-medium",
					children: description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Close modal",
					className: "rounded-full p-1.5 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#111111] cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children
			})]
		})]
	}) });
}
//#endregion
export { GlassModal as t };

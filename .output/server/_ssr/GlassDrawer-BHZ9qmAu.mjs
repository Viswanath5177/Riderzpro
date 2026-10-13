import { i as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as X } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlassDrawer-BHZ9qmAu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlassDrawer({ isOpen, onClose, title, description, children, width = "lg", className }) {
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			onClick: onClose,
			className: "fixed inset-0 bg-black/60 backdrop-blur-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-y-0 right-0 flex max-w-full pl-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: { x: "100%" },
				animate: { x: 0 },
				exit: { x: "100%" },
				transition: {
					type: "spring",
					damping: 25,
					stiffness: 200
				},
				className: cn("relative flex w-screen flex-col border-l border-[#E5E7EB] bg-white text-[#111111] shadow-2xl", width === "md" && "max-w-md", width === "lg" && "max-w-lg", width === "xl" && "max-w-xl", width === "2xl" && "max-w-2xl", className),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 border-b border-[#E5E7EB] bg-gray-50/70 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl font-bold tracking-tight text-[#111111]",
						children: title
					}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-[#4B5563] font-medium",
						children: description
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						"aria-label": "Close drawer",
						className: "rounded-full p-2 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#111111] cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-6",
					children
				})]
			})
		})]
	}) });
}
//#endregion
export { GlassDrawer as t };

import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { t as GlassModal } from "./GlassModal-Doo_ql5X.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "destructive" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassModal, {
		isOpen,
		onClose,
		maxWidth: "sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-500 border border-red-500/30 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-bold text-[#111111]",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-[#4B5563] font-medium leading-relaxed",
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex w-full gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						variant: "secondary",
						className: "flex-1",
						onClick: onClose,
						children: cancelLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						variant,
						className: "flex-1",
						onClick: () => {
							onConfirm();
							onClose();
						},
						children: confirmLabel
					})]
				})
			]
		})
	});
}
//#endregion
export { ConfirmDialog as t };

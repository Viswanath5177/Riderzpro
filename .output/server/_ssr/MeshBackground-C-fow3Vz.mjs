import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function MeshBackground({ isLight = true }) {
	if (isLight) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#F5F6F8] transition-colors duration-500",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#E31E24]/[0.06] blur-3xl animate-mesh-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-1/3 right-10 h-96 w-96 rounded-full bg-amber-500/[0.05] blur-3xl animate-mesh-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.04] blur-3xl animate-mesh-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 overflow-hidden opacity-20",
				children: [
					20,
					50,
					75
				].map((top, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute h-px w-full overflow-hidden",
					style: { top: `${top}%` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "charge-line h-px w-1/2",
						style: { animationDelay: `${i * 1.2}s` }
					})
				}, top))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-[0.035]",
				style: {
					backgroundImage: `radial-gradient(circle at 1px 1px, #111111 1px, transparent 0)`,
					backgroundSize: "32px 32px"
				}
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#0b0d12] transition-colors duration-500",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full opacity-25 blur-[130px] animate-mesh-1",
				style: { backgroundColor: "#e11d2a" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/3 -right-32 h-[650px] w-[650px] rounded-full opacity-20 blur-[140px] animate-mesh-2",
				style: { backgroundColor: "#ff7a1a" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-40 left-1/4 h-[700px] w-[700px] rounded-full opacity-20 blur-[150px] animate-mesh-3",
				style: { backgroundColor: "#6d4aff" }
			})
		]
	});
}
//#endregion
export { MeshBackground as t };

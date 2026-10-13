import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as Navigate, p as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/adminAuth-DGnzUy2F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_SESSION_KEY = "riderzpro_admin_session";
var DEFAULT_SUPER_ADMIN = {
	id: "adm_vikram_01",
	name: "Vikram Malhotra",
	email: "admin@riderzpro.com",
	role: "admin",
	roleTitle: "Super Admin",
	department: "Operations & Platform Oversight"
};
var AdminAuthContext = (0, import_react.createContext)(null);
function AdminAuthProvider({ children }) {
	const [adminUser, setAdminUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [pendingUser, setPendingUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(ADMIN_SESSION_KEY);
			if (raw) {
				const session = JSON.parse(raw);
				if (session.role === "admin" && session.token) setAdminUser(session.user);
			}
		} catch (e) {
			console.error("Failed to restore admin session:", e);
		} finally {
			setLoading(false);
		}
	}, []);
	const saveSession = (0, import_react.useCallback)((user) => {
		const session = {
			token: `mock_jwt_adm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
			role: "admin",
			user,
			loginTime: Date.now()
		};
		localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
		setAdminUser(user);
		setPendingUser(null);
	}, []);
	const login = (0, import_react.useCallback)(async (email, pass) => {
		const trimmedEmail = email.trim().toLowerCase();
		await new Promise((res) => setTimeout(res, 400));
		if (trimmedEmail === "admin@riderzpro.com" && pass === "Admin@123") {
			setPendingUser(DEFAULT_SUPER_ADMIN);
			return {
				success: true,
				requireOtp: true
			};
		}
		return {
			success: false,
			error: "Invalid admin credentials"
		};
	}, []);
	const verifyOtp = (0, import_react.useCallback)(async (code) => {
		await new Promise((res) => setTimeout(res, 350));
		if (code === "123456" || code === "111111") {
			saveSession(pendingUser || DEFAULT_SUPER_ADMIN);
			return { success: true };
		}
		return {
			success: false,
			error: "Invalid OTP code. Please enter 123456 for testing."
		};
	}, [pendingUser, saveSession]);
	const loginWithDevBypass = (0, import_react.useCallback)(() => {
		saveSession(DEFAULT_SUPER_ADMIN);
	}, [saveSession]);
	const logout = (0, import_react.useCallback)(() => {
		localStorage.removeItem(ADMIN_SESSION_KEY);
		setAdminUser(null);
		setPendingUser(null);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		isAuthenticated: Boolean(adminUser),
		loading,
		adminUser,
		login,
		verifyOtp,
		loginWithDevBypass,
		logout
	}), [
		adminUser,
		loading,
		login,
		verifyOtp,
		loginWithDevBypass,
		logout
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthContext.Provider, {
		value,
		children
	});
}
function useAdminAuth() {
	const ctx = (0, import_react.useContext)(AdminAuthContext);
	if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
	return ctx;
}
/**
* Route guard for /admin/* paths.
* Redirects unauthenticated visits to /admin/login.
*/
function AdminRouteGuard({ children }) {
	const { isAuthenticated, loading } = useAdminAuth();
	if (useLocation().pathname.startsWith("/admin/login")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#0b0d12] text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-zinc-400",
				children: "Verifying Admin Session..."
			})]
		})
	});
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/admin/login",
		replace: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { AdminRouteGuard as n, useAdminAuth as r, AdminAuthProvider as t };

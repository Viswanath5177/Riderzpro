import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-ga-2flKS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
var AUTH_USER_KEY = "riderzpro_auth_user";
var AUTH_TOKEN_KEY = "riderzpro_auth_token";
var USERS_STORE_KEY = "riderzpro_registered_users";
async function hashPassword(plain) {
	if (typeof window === "undefined" || !window.crypto?.subtle) {
		let hash = 0;
		for (let i = 0; i < plain.length; i++) {
			hash = (hash << 5) - hash + plain.charCodeAt(i);
			hash |= 0;
		}
		return `h_${Math.abs(hash)}`;
	}
	const data = new TextEncoder().encode(plain);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function initAuth() {
			try {
				if (!localStorage.getItem(USERS_STORE_KEY)) {
					const defaultUser = {
						id: "usr_aakash_default",
						name: "Aakash Sharma",
						email: "aakash@riderzpro.com",
						phone: "9876543210",
						role: "customer",
						passwordHash: await hashPassword("Password123")
					};
					localStorage.setItem(USERS_STORE_KEY, JSON.stringify([defaultUser]));
				}
				const rawUser = localStorage.getItem(AUTH_USER_KEY);
				const rawToken = localStorage.getItem(AUTH_TOKEN_KEY);
				if (rawUser && rawToken) {
					const parsed = JSON.parse(rawUser);
					setUser(parsed);
				}
			} catch (e) {
				console.error("Failed to restore auth session:", e);
			} finally {
				setLoading(false);
			}
		}
		initAuth();
	}, []);
	const signIn = (0, import_react.useCallback)(async (emailOrPhone, password, remember = true) => {
		try {
			const trimmed = emailOrPhone.trim();
			const isEmail = trimmed.includes("@");
			const hashed = await hashPassword(password);
			const rawUsers = localStorage.getItem(USERS_STORE_KEY);
			const found = (rawUsers ? JSON.parse(rawUsers) : []).find((u) => {
				if (isEmail) return u.email.toLowerCase() === trimmed.toLowerCase();
				else {
					const cleanPhone = trimmed.replace(/\D/g, "").slice(-10);
					return u.phone.replace(/\D/g, "").slice(-10) === cleanPhone;
				}
			});
			if (!found || found.passwordHash !== hashed) return {
				success: false,
				error: "Invalid email/phone or password"
			};
			const sessionUser = {
				id: found.id,
				name: found.name,
				email: found.email,
				phone: found.phone,
				role: "customer",
				avatarUrl: found.avatarUrl
			};
			const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
			if (remember) {
				localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
				localStorage.setItem(AUTH_TOKEN_KEY, token);
			} else {
				sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
				sessionStorage.setItem(AUTH_TOKEN_KEY, token);
			}
			setUser(sessionUser);
			return { success: true };
		} catch (e) {
			console.error("Sign in error:", e);
			return {
				success: false,
				error: "An unexpected error occurred during sign in"
			};
		}
	}, []);
	const signUp = (0, import_react.useCallback)(async (data) => {
		try {
			const cleanEmail = data.email.trim().toLowerCase();
			const cleanPhone = data.phone.replace(/\D/g, "").slice(-10);
			const rawUsers = localStorage.getItem(USERS_STORE_KEY);
			const users = rawUsers ? JSON.parse(rawUsers) : [];
			const existing = users.find((u) => u.email.toLowerCase() === cleanEmail || u.phone.replace(/\D/g, "").slice(-10) === cleanPhone);
			if (existing) {
				if (existing.email.toLowerCase() === cleanEmail) return {
					success: false,
					error: "An account with this email already exists"
				};
				return {
					success: false,
					error: "An account with this phone number already exists"
				};
			}
			const passwordHash = await hashPassword(data.password);
			const newUser = {
				id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
				name: data.name.trim(),
				email: cleanEmail,
				phone: cleanPhone,
				role: "customer",
				passwordHash
			};
			const updatedUsers = [...users, newUser];
			localStorage.setItem(USERS_STORE_KEY, JSON.stringify(updatedUsers));
			const sessionUser = {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				phone: newUser.phone,
				role: "customer"
			};
			const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
			localStorage.setItem(AUTH_TOKEN_KEY, token);
			setUser(sessionUser);
			return { success: true };
		} catch (e) {
			console.error("Sign up error:", e);
			return {
				success: false,
				error: "Failed to create account"
			};
		}
	}, []);
	const signInWithGoogle = (0, import_react.useCallback)(async () => {
		try {
			const googleUser = {
				id: "usr_google_aakash",
				name: "Aakash Sharma",
				email: "aakash.sharma@gmail.com",
				phone: "9876543210",
				role: "customer"
			};
			const token = `tok_g_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
			localStorage.setItem(AUTH_TOKEN_KEY, token);
			setUser(googleUser);
			return { success: true };
		} catch (e) {
			return {
				success: false,
				error: "Google sign in failed"
			};
		}
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		try {
			localStorage.removeItem(AUTH_USER_KEY);
			localStorage.removeItem(AUTH_TOKEN_KEY);
			sessionStorage.removeItem(AUTH_USER_KEY);
			sessionStorage.removeItem(AUTH_TOKEN_KEY);
			setUser(null);
		} catch (e) {
			console.error("Sign out error:", e);
		}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		user,
		isAuthenticated: Boolean(user),
		loading,
		signIn,
		signUp,
		signInWithGoogle,
		signOut
	}), [
		user,
		loading,
		signIn,
		signUp,
		signInWithGoogle,
		signOut
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };

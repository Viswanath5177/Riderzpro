import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
import { S as Navigate, m as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useVendorStore } from "./vendorStore-jyyPc83P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendorAuth-DcYgxaTS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var attemptsMap = /* @__PURE__ */ new Map();
var MAX_ATTEMPTS = 5;
var LOCKOUT_MS = 6e5;
var DEMO_OTP = "123456";
var otpAdapter = {
	/**
	* Sends an OTP to the given email or phone number.
	*/
	async send(channel, target) {
		const key = `${channel}:${target.trim().toLowerCase()}`;
		const record = attemptsMap.get(key);
		if (record && record.lockedUntil > Date.now()) return {
			success: false,
			message: `Too many failed attempts. Locked for ${Math.ceil((record.lockedUntil - Date.now()) / 6e4)} more minute(s).`
		};
		toast.info(`Demo OTP for ${channel === "sms" ? "Mobile" : "Email"} (${target}): ${DEMO_OTP}`, {
			duration: 8e3,
			description: "Use 123456 to verify in demo mode."
		});
		return {
			success: true,
			message: `OTP sent successfully to ${target}`
		};
	},
	/**
	* Verifies the provided 6-digit code against the target.
	*/
	async verify(channel, target, code) {
		const key = `${channel}:${target.trim().toLowerCase()}`;
		let record = attemptsMap.get(key);
		if (record && record.lockedUntil > Date.now()) return {
			success: false,
			error: `Too many failed attempts. Account locked for ${Math.ceil((record.lockedUntil - Date.now()) / 6e4)} minute(s).`
		};
		if (!record) {
			record = {
				attempts: 0,
				lockedUntil: 0
			};
			attemptsMap.set(key, record);
		}
		if (code.trim() === "123456") {
			attemptsMap.delete(key);
			return { success: true };
		}
		record.attempts += 1;
		if (record.attempts >= MAX_ATTEMPTS) {
			record.lockedUntil = Date.now() + LOCKOUT_MS;
			return {
				success: false,
				error: `Maximum 5 attempts exceeded. Locked for 10 minutes.`
			};
		}
		return {
			success: false,
			error: `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempt(s) remaining. (Hint: use ${DEMO_OTP})`
		};
	}
};
var VendorAuthContext = (0, import_react.createContext)(null);
var VENDOR_SESSION_KEY = "riderzpro_vendor_session";
var VENDOR_AUTH_CRED_KEY = "riderzpro_vendor_credentials";
async function hashPassword(plain) {
	if (typeof window === "undefined" || !window.crypto?.subtle) {
		let hash = 0;
		for (let i = 0; i < plain.length; i++) {
			hash = (hash << 5) - hash + plain.charCodeAt(i);
			hash |= 0;
		}
		return `vh_${Math.abs(hash)}`;
	}
	const data = new TextEncoder().encode(plain);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function VendorAuthProvider({ children }) {
	const { vendors, saveVendorDraft, getVendorByPhone, getVendorByEmail, getVendor } = useVendorStore();
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function initCredentials() {
			try {
				if (!localStorage.getItem(VENDOR_AUTH_CRED_KEY)) {
					const defaultHash = await hashPassword("Vendor@123");
					const defaultCreds = {
						"9000000001": defaultHash,
						"volthub@riderzpro.com": defaultHash,
						"9000000002": defaultHash,
						"ecocharge@spares.in": defaultHash,
						"9000000003": defaultHash,
						"torque@evparts.com": defaultHash
					};
					localStorage.setItem(VENDOR_AUTH_CRED_KEY, JSON.stringify(defaultCreds));
				}
				const wasExplicitlySignedOut = localStorage.getItem("vendor_signed_out") === "true";
				const rawSession = localStorage.getItem(VENDOR_SESSION_KEY) || sessionStorage.getItem(VENDOR_SESSION_KEY);
				if (rawSession) {
					const parsed = JSON.parse(rawSession);
					setSession(parsed);
				} else if (!wasExplicitlySignedOut) {
					const defaultVendor = vendors.find((v) => v.id === "v1");
					if (defaultVendor) {
						const defaultSession = {
							vendorId: defaultVendor.id,
							email: defaultVendor.email,
							phone: defaultVendor.phone,
							storeName: defaultVendor.storeName,
							status: defaultVendor.status,
							token: `vtok_demo_default`
						};
						setSession(defaultSession);
						localStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(defaultSession));
					}
				}
			} catch (e) {
				console.error("Failed to restore vendor session:", e);
			} finally {
				setLoading(false);
			}
		}
		initCredentials();
	}, []);
	const currentVendor = (0, import_react.useMemo)(() => {
		if (!session?.vendorId) return null;
		return getVendor(session.vendorId) || null;
	}, [session, getVendor]);
	const setVendorSession = (0, import_react.useCallback)((vendor, remember = true) => {
		localStorage.removeItem("vendor_signed_out");
		const s = {
			vendorId: vendor.id,
			email: vendor.email,
			phone: vendor.phone,
			storeName: vendor.storeName,
			status: vendor.status,
			token: `vtok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
		};
		if (remember) localStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(s));
		else sessionStorage.setItem(VENDOR_SESSION_KEY, JSON.stringify(s));
		setSession(s);
	}, []);
	const signInWithPassword = (0, import_react.useCallback)(async (emailOrPhone, password, remember = true) => {
		try {
			const trimmed = emailOrPhone.trim();
			const isEmail = trimmed.includes("@");
			const cleanPhone = trimmed.replace(/\D/g, "").slice(-10);
			const matchedVendor = isEmail ? getVendorByEmail(trimmed) : getVendorByPhone(cleanPhone);
			if (!matchedVendor) return {
				success: false,
				error: "No vendor account found with this mobile or email"
			};
			const rawCreds = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
			const creds = rawCreds ? JSON.parse(rawCreds) : {};
			const expectedHash = creds[cleanPhone] || creds[matchedVendor.email.toLowerCase()];
			const inputHash = await hashPassword(password);
			if (!expectedHash || expectedHash !== inputHash) return {
				success: false,
				error: "Invalid password. (Demo: Vendor@123)"
			};
			setVendorSession(matchedVendor, remember);
			toast.success(`Welcome back, ${matchedVendor.storeName || "Vendor"}!`);
			return { success: true };
		} catch (e) {
			return {
				success: false,
				error: "An unexpected error occurred during vendor sign in"
			};
		}
	}, [
		getVendorByEmail,
		getVendorByPhone,
		setVendorSession
	]);
	const signInWithOtp = (0, import_react.useCallback)(async (emailOrPhone, code) => {
		try {
			const trimmed = emailOrPhone.trim();
			const isEmail = trimmed.includes("@");
			const cleanPhone = trimmed.replace(/\D/g, "").slice(-10);
			const matchedVendor = isEmail ? getVendorByEmail(trimmed) : getVendorByPhone(cleanPhone);
			if (!matchedVendor) return {
				success: false,
				error: "No vendor account found with this mobile or email"
			};
			const channel = isEmail ? "email" : "sms";
			const verifyRes = await otpAdapter.verify(channel, trimmed, code);
			if (!verifyRes.success) return {
				success: false,
				error: verifyRes.error || "Invalid OTP"
			};
			setVendorSession(matchedVendor, true);
			toast.success(`Welcome back, ${matchedVendor.storeName || "Vendor"}!`);
			return { success: true };
		} catch (e) {
			return {
				success: false,
				error: "OTP verification failed"
			};
		}
	}, [
		getVendorByEmail,
		getVendorByPhone,
		setVendorSession
	]);
	const signUpVendor = (0, import_react.useCallback)(async (data) => {
		try {
			const cleanEmail = data.email.trim().toLowerCase();
			const cleanPhone = data.mobile.replace(/\D/g, "").slice(-10);
			if (getVendorByPhone(cleanPhone)) return {
				success: false,
				error: "A vendor account with this mobile number already exists."
			};
			if (getVendorByEmail(cleanEmail)) return {
				success: false,
				error: "A vendor account with this email address already exists."
			};
			const passwordHash = await hashPassword(data.password);
			const rawCreds = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
			const creds = rawCreds ? JSON.parse(rawCreds) : {};
			creds[cleanPhone] = passwordHash;
			creds[cleanEmail] = passwordHash;
			localStorage.setItem(VENDOR_AUTH_CRED_KEY, JSON.stringify(creds));
			const vendorId = `v_${Date.now()}`;
			const defaultStoreName = `${data.fullName}'s EV Store`;
			const slug = defaultStoreName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const initialOnboarding = {
				currentStep: 2,
				completedSteps: [1],
				account: {
					fullName: data.fullName,
					businessType: data.businessType,
					mobile: cleanPhone,
					email: cleanEmail,
					mobileVerified: true,
					emailVerified: true,
					agreedToTerms: true
				},
				tax: {
					gstExempt: false,
					legalName: data.fullName,
					pan: "",
					registeredAddress: "",
					sameAsGstAddress: true,
					chargesIgst: true,
					govtIdType: "Passport",
					govtIdLast4: ""
				},
				store: {
					storeName: defaultStoreName,
					slug,
					tagline: "Quality EV Spares & Accessories",
					description: "Supplying verified electric vehicle parts and accessories across the city.",
					sellerType: "Retailer",
					categories: ["Spare Parts", "Bike Accessories"],
					brands: [],
					yearsInBusiness: 1
				},
				shipping: {
					pickupAddress: {
						line1: "",
						pincode: "560038",
						city: "Bengaluru",
						state: "Karnataka",
						lat: 12.9716,
						lng: 77.5946
					},
					contactName: data.fullName,
					contactPhone: cleanPhone,
					workingHours: {
						monday: {
							open: "09:00",
							close: "19:00"
						},
						tuesday: {
							open: "09:00",
							close: "19:00"
						},
						wednesday: {
							open: "09:00",
							close: "19:00"
						},
						thursday: {
							open: "09:00",
							close: "19:00"
						},
						friday: {
							open: "09:00",
							close: "19:00"
						},
						saturday: {
							open: "09:00",
							close: "19:00"
						}
					},
					handlingTimeMins: 20,
					fulfillmentMode: "hyperlocal",
					serviceableRadiusKm: 20,
					acceptsCod: false,
					returnWindowDays: 7,
					returnAddressSameAsPickup: true,
					sellsLiIon: false,
					un38_3Declared: false
				},
				bank: {
					accountHolderName: data.fullName,
					accountNumber: "",
					maskedAccountNumber: "",
					ifsc: "",
					bankName: "",
					branchName: "",
					accountType: "Current",
					pennyDropVerified: false
				},
				documents: {
					brandAuthDocs: [],
					safetyCertDocs: [],
					agreementAccepted: false,
					signatureName: data.fullName
				}
			};
			const newVendor = {
				id: vendorId,
				email: cleanEmail,
				phone: cleanPhone,
				businessName: data.fullName,
				storeName: defaultStoreName,
				slug,
				status: "draft",
				commissionRate: 12,
				rating: 5,
				totalSales: 0,
				activeProductsCount: 0,
				holidayMode: false,
				lat: 12.9716,
				lng: 77.5946,
				prepMins: 20,
				area: "Bengaluru",
				onboarding: initialOnboarding,
				auditTimeline: [{
					id: `evt_${Date.now()}`,
					timestamp: Date.now(),
					actor: data.fullName,
					actorRole: "vendor",
					action: "Created seller account"
				}],
				createdAt: Date.now(),
				updatedAt: Date.now()
			};
			saveVendorDraft(newVendor);
			setVendorSession(newVendor, true);
			return {
				success: true,
				vendorId
			};
		} catch (e) {
			console.error("Vendor sign up error:", e);
			return {
				success: false,
				error: "Failed to create vendor account"
			};
		}
	}, [
		getVendorByEmail,
		getVendorByPhone,
		saveVendorDraft,
		setVendorSession
	]);
	const resetPasswordWithOtp = (0, import_react.useCallback)(async (emailOrPhone, code, newPass) => {
		try {
			const clean = emailOrPhone.trim();
			const channel = clean.includes("@") ? "email" : "sms";
			const verifyRes = await otpAdapter.verify(channel, clean, code);
			if (!verifyRes.success) return {
				success: false,
				error: verifyRes.error || "Invalid OTP"
			};
			const hashed = await hashPassword(newPass);
			const rawCreds = localStorage.getItem(VENDOR_AUTH_CRED_KEY);
			const creds = rawCreds ? JSON.parse(rawCreds) : {};
			creds[clean] = hashed;
			localStorage.setItem(VENDOR_AUTH_CRED_KEY, JSON.stringify(creds));
			toast.success("Password reset successfully. You can now sign in.");
			return { success: true };
		} catch (e) {
			return {
				success: false,
				error: "Failed to reset password"
			};
		}
	}, []);
	const signOutVendor = (0, import_react.useCallback)(async () => {
		localStorage.setItem("vendor_signed_out", "true");
		localStorage.removeItem(VENDOR_SESSION_KEY);
		sessionStorage.removeItem(VENDOR_SESSION_KEY);
		setSession(null);
		toast.info("Signed out of Vendor Portal");
		if (typeof window !== "undefined") window.location.href = "/vendor/auth";
	}, []);
	const refreshVendorSession = (0, import_react.useCallback)(() => {
		const raw = localStorage.getItem(VENDOR_SESSION_KEY) || sessionStorage.getItem(VENDOR_SESSION_KEY);
		if (raw) setSession(JSON.parse(raw));
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		vendor: currentVendor,
		currentVendor,
		session,
		isAuthenticated: Boolean(session && currentVendor),
		loading,
		signInWithPassword,
		signInWithOtp,
		signUpVendor,
		resetPasswordWithOtp,
		signOutVendor,
		logout: signOutVendor,
		refreshVendorSession
	}), [
		currentVendor,
		session,
		loading,
		signInWithPassword,
		signInWithOtp,
		signUpVendor,
		resetPasswordWithOtp,
		signOutVendor,
		refreshVendorSession
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorAuthContext.Provider, {
		value,
		children
	});
}
function useVendorAuth() {
	const context = (0, import_react.useContext)(VendorAuthContext);
	if (!context) throw new Error("useVendorAuth must be used within VendorAuthProvider");
	return context;
}
/**
* Route guard for Vendor portal screens.
*/
function VendorRouteGuard({ children, allowPending = false }) {
	const { vendor, isAuthenticated, loading } = useVendorAuth();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const currentPath = useRouterState({ select: (s) => s.location.pathname + (s.location.searchStr ? `?${s.location.searchStr}` : "") });
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary animate-pulse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
						className: "h-6 w-6 text-primary",
						fill: "currentColor"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Checking vendor credentials..."
				})
			]
		})
	});
	if (!isAuthenticated || !vendor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/vendor/auth",
		search: { redirect: currentPath },
		replace: true
	});
	if (vendor.status === "draft" && (vendor.onboarding?.currentStep ?? 1) < 6) {
		if (pathname !== "/vendor/onboarding") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/vendor/onboarding",
			replace: true
		});
	}
	if (!allowPending && vendor.status !== "approved") {
		if (pathname !== "/vendor/pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
			to: "/vendor/pending",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { useVendorAuth as i, VendorRouteGuard as n, otpAdapter as r, VendorAuthProvider as t };

import { i as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as ShieldCheck, Tt as EyeOff, b as Sparkles, dn as ArrowLeft, rt as Lock, tt as Mail, un as ArrowRight, ut as KeyRound, wt as Eye } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useAdminAuth } from "./adminAuth-DGnzUy2F.mjs";
import { n as Logo } from "./bits-BhX7Ijve.mjs";
import { t as MeshBackground } from "./MeshBackground-C-fow3Vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-BvJGRhUn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const { login, verifyOtp, loginWithDevBypass } = useAdminAuth();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("credentials");
	const [email, setEmail] = (0, import_react.useState)("admin@riderzpro.com");
	const [password, setPassword] = (0, import_react.useState)("Admin@123");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [rememberDevice, setRememberDevice] = (0, import_react.useState)(true);
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isDevBypassing, setIsDevBypassing] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [shake, setShake] = (0, import_react.useState)(false);
	const isDev = Boolean({
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SHOW_ADMIN_ENTRY"] === "true" || typeof window !== "undefined" && window.location.hostname === "localhost");
	const triggerShake = () => {
		setShake(true);
		setTimeout(() => setShake(false), 500);
	};
	const handleCredentialsSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		if (!email.trim() || !password) {
			setErrorMessage("Please enter both email and password.");
			triggerShake();
			return;
		}
		setIsLoading(true);
		try {
			const res = await login(email, password);
			if (res.success && res.requireOtp) {
				setStep("otp");
				toast.info("Security Verification Required", { description: "Enter test OTP 123456 to complete authentication." });
			} else {
				setErrorMessage(res.error || "Invalid admin credentials");
				triggerShake();
			}
		} finally {
			setIsLoading(false);
		}
	};
	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null);
		if (!otpCode || otpCode.length < 6) {
			setErrorMessage("Please enter the 6-digit verification code (123456)");
			triggerShake();
			return;
		}
		setIsLoading(true);
		try {
			const res = await verifyOtp(otpCode);
			if (res.success) {
				toast.success("Welcome back, Admin", { description: "Signed in as Vikram Malhotra (Super Admin)." });
				navigate({ to: "/admin" });
			} else {
				setErrorMessage(res.error || "Invalid OTP code");
				triggerShake();
			}
		} finally {
			setIsLoading(false);
		}
	};
	const handleDevBypass = () => {
		setIsDevBypassing(true);
		setTimeout(() => {
			loginWithDevBypass();
			toast.success("Welcome back, Admin (Dev Bypass)", { description: "Authenticated with Super Admin privileges." });
			navigate({ to: "/admin" });
		}, 200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center p-4 font-sans text-white select-none bg-[#0b0d12]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .4 },
			className: `admin-glass-card relative z-10 w-full max-w-[440px] rounded-[28px] border border-white/20 bg-white/[0.08] p-7 sm:p-9 shadow-2xl backdrop-blur-[24px] saturate-[180%] ${shake ? "animate-shake" : ""} before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent`,
			style: { boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(225, 29, 42, 0.15)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-9" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-bold tracking-wider text-red-400 uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin Console" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white",
							children: step === "credentials" ? "Welcome back, Admin" : "Two-Step Verification"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs text-zinc-300 max-w-xs leading-relaxed",
							children: step === "credentials" ? "Sign in to manage orders, sellers, riders and parts." : "Enter the 6-digit security code sent to your registered admin device."
						})
					]
				}),
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: -5
					},
					animate: {
						opacity: 1,
						y: 0
					},
					className: "mt-5 rounded-2xl border border-red-500/40 bg-red-500/20 px-3.5 py-2.5 text-xs font-semibold text-red-200",
					children: errorMessage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: step === "credentials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
							initial: {
								opacity: 0,
								x: -15
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: 15
							},
							onSubmit: handleCredentialsSubmit,
							noValidate: true,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "admin-email",
									className: "block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5",
									children: "Admin Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "admin-email",
										type: "email",
										autoComplete: "username",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "admin@riderzpro.com",
										className: "w-full rounded-2xl border border-white/15 bg-white/[0.08] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 backdrop-blur-xl outline-none transition-all focus:border-[#e11d2a] focus:bg-white/[0.12] focus:ring-2 focus:ring-[#e11d2a]/30"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "admin-password",
										className: "block text-xs font-semibold uppercase tracking-wider text-zinc-300",
										children: "Password"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "admin-password",
											type: showPassword ? "text" : "password",
											autoComplete: "current-password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											placeholder: "••••••••",
											className: "w-full rounded-2xl border border-white/15 bg-white/[0.08] pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 backdrop-blur-xl outline-none transition-all focus:border-[#e11d2a] focus:bg-white/[0.12] focus:ring-2 focus:ring-[#e11d2a]/30"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPassword(!showPassword),
											"aria-label": showPassword ? "Hide password" : "Show password",
											className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer",
											children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-0.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer select-none text-zinc-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: rememberDevice,
											onChange: (e) => setRememberDevice(e.target.checked),
											className: "rounded border-white/20 bg-white/10 text-red-500 accent-[#e11d2a] focus:ring-0 cursor-pointer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remember this device" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											toast.info("Mock password hint", { description: "Use admin@riderzpro.com / Admin@123" });
										},
										className: "font-medium text-orange-400 hover:underline cursor-pointer",
										children: "Forgot password?"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
									type: "submit",
									variant: "primary",
									size: "lg",
									isLoading,
									className: "w-full shadow-red-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign in to Console" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}),
								isDev && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
									type: "button",
									variant: "glass",
									size: "md",
									isLoading: isDevBypassing,
									onClick: handleDevBypass,
									className: "w-full border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Use Dev Bypass (Super Admin)" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[11px] text-zinc-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-zinc-300",
										children: "Default Test Credentials:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 font-mono text-zinc-400",
										children: [
											"Email: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-white font-semibold",
												children: "admin@riderzpro.com"
											}),
											" · Password:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-white font-semibold",
												children: "Admin@123"
											})
										]
									})]
								})
							]
						}, "step-credentials") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
							initial: {
								opacity: 0,
								x: 15
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: -15
							},
							onSubmit: handleOtpSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "admin-otp",
										className: "block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 text-center",
										children: "6-Digit Verification Code"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "admin-otp",
											type: "text",
											maxLength: 6,
											autoFocus: true,
											value: otpCode,
											onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, "")),
											placeholder: "123456",
											className: "w-full text-center font-mono tracking-[0.4em] text-lg rounded-2xl border border-white/20 bg-white/[0.08] pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-[#e11d2a] focus:ring-2 focus:ring-[#e11d2a]/30"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-center text-[11px] text-zinc-400",
										children: ["Mock test code: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono font-bold text-amber-300",
											children: "123456"
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2.5 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
										type: "button",
										variant: "glass",
										size: "md",
										onClick: () => setStep("credentials"),
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
										type: "submit",
										variant: "primary",
										size: "md",
										isLoading,
										className: "flex-[2]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify & Launch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setOtpCode("123456"),
									className: "w-full text-center text-[11px] text-orange-400 hover:underline pt-1 cursor-pointer",
									children: "Click here to auto-fill code: 123456"
								})
							]
						}, "step-otp")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 border-t border-white/10 pt-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Riderzpro Store" })]
					})
				})
			]
		})]
	});
}
var SplitComponent = AdminLogin;
//#endregion
export { SplitComponent as component };

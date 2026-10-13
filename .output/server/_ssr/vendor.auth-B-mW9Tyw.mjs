import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as CircleCheck, Tt as EyeOff, V as Phone, at as LoaderCircle, g as Store, un as ArrowRight, ut as KeyRound, wt as Eye } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { v as parts_default } from "./data-C7OlInRR.mjs";
import { n as Logo } from "./bits-BhX7Ijve.mjs";
import { i as useVendorAuth, r as otpAdapter } from "./vendorAuth-DcYgxaTS.mjs";
import { t as Route } from "./vendor.auth-3J0TZcFH.mjs";
import { i as validateMobile } from "./validators-BPymqWry.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendor.auth-B-mW9Tyw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VendorAuthPage({ initialMode = "signin", redirectPath }) {
	const [mode, setMode] = (0, import_react.useState)(initialMode);
	const { vendor, isAuthenticated, loading } = useVendorAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setMode(initialMode);
	}, [initialMode]);
	(0, import_react.useEffect)(() => {
		if (!loading && isAuthenticated && vendor) if (vendor.status === "approved") navigate({ to: redirectPath || "/vendor/dashboard" });
		else if (vendor.status === "draft" && vendor.onboarding.currentStep < 6) navigate({ to: "/vendor/onboarding" });
		else navigate({ to: "/vendor/pending" });
	}, [
		loading,
		isAuthenticated,
		vendor,
		navigate,
		redirectPath
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2 bg-background font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden lg:block overflow-hidden bg-zinc-950",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: parts_default,
					alt: "Riderzpro EV Spares & Warehouse",
					width: 1280,
					height: 896,
					className: "absolute inset-0 h-full w-full object-cover opacity-80"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-10 left-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }), "Verified EV Merchant Network"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-12 left-12 right-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-lg bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }), "Merchant Portal"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]",
							children: [
								"Sell EV parts to riders",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"across your city."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-sm text-zinc-300 leading-relaxed font-normal",
							children: "Direct access to verified EV riders, chassis-fitment matching, automated hyperlocal rider pickups, and guaranteed T+7 direct bank settlements."
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col min-h-screen p-5 sm:p-8 md:p-12 lg:p-14 overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "← Customer Store" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-auto py-8 sm:py-12 mx-auto w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center justify-center p-1 rounded-2xl bg-muted border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "flex-1 text-center rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition",
							children: "Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex-1 rounded-xl py-2 text-xs font-bold transition bg-white text-primary shadow-xs cursor-default",
							children: "Vendor"
						})]
					}), mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorSignInForm, { onSwitchToSignUp: () => setMode("signup") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorSignUpForm, { onSwitchToSignIn: () => setMode("signin") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-auto pt-6 text-center text-xs text-muted-foreground border-t border-border/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 Riderzpro · Secure Vendor Onboarding & Merchant Portal" })
				})
			]
		})]
	});
}
function VendorSignInForm({ onSwitchToSignUp }) {
	const { signInWithPassword, signInWithOtp, resetPasswordWithOtp } = useVendorAuth();
	useNavigate();
	const [tab, setTab] = (0, import_react.useState)("password");
	const [identifier, setIdentifier] = (0, import_react.useState)("9000000001");
	const [password, setPassword] = (0, import_react.useState)("Vendor@123");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [rememberMe, setRememberMe] = (0, import_react.useState)(true);
	const [otpSent, setOtpSent] = (0, import_react.useState)(false);
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [otpCountdown, setOtpCountdown] = (0, import_react.useState)(0);
	const [showForgotModal, setShowForgotModal] = (0, import_react.useState)(false);
	const [forgotTarget, setForgotTarget] = (0, import_react.useState)("");
	const [forgotOtp, setForgotOtp] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [forgotStep, setForgotStep] = (0, import_react.useState)("send");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (otpCountdown > 0) {
			const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1e3);
			return () => clearTimeout(timer);
		}
	}, [otpCountdown]);
	const handleSendOtp = async () => {
		if (!identifier.trim()) {
			toast.error("Enter your registered mobile or email");
			return;
		}
		setIsSubmitting(true);
		const channel = identifier.includes("@") ? "email" : "sms";
		const res = await otpAdapter.send(channel, identifier);
		setIsSubmitting(false);
		if (res.success) {
			setOtpSent(true);
			setOtpCountdown(30);
		} else toast.error(res.message);
	};
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		if (!identifier.trim() || !password.trim()) {
			toast.error("Please enter both contact and password.");
			return;
		}
		setIsSubmitting(true);
		const res = await signInWithPassword(identifier, password, rememberMe);
		setIsSubmitting(false);
		if (res.success) {} else toast.error(res.error || "Sign in failed");
	};
	const handleOtpSubmit = async (e) => {
		e.preventDefault();
		if (!otpCode.trim()) {
			toast.error("Please enter the 6-digit OTP");
			return;
		}
		setIsSubmitting(true);
		const res = await signInWithOtp(identifier, otpCode);
		setIsSubmitting(false);
		if (res.success) {} else toast.error(res.error || "OTP sign in failed");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-extrabold tracking-tight text-foreground",
					children: "Vendor Sign In"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Access your catalog, live orders, settlements and inventory."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex p-1 rounded-xl bg-muted border border-border mb-5 text-xs font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("password"),
					className: `flex-1 py-2 rounded-lg transition ${tab === "password" ? "bg-white text-foreground shadow-2xs font-bold" : "text-muted-foreground"}`,
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("otp"),
					className: `flex-1 py-2 rounded-lg transition ${tab === "otp" ? "bg-white text-foreground shadow-2xs font-bold" : "text-muted-foreground"}`,
					children: "Login with OTP"
				})]
			}),
			tab === "password" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handlePasswordSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Mobile Number or Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: identifier,
							onChange: (e) => setIdentifier(e.target.value),
							placeholder: "9000000001 or store@example.com",
							className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute right-3.5 top-3 h-4 w-4 text-muted-foreground" })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setForgotTarget(identifier);
								setShowForgotModal(true);
							},
							className: "text-xs text-primary hover:underline font-semibold",
							children: "Forgot password?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: showPassword ? "text" : "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm pr-10 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowPassword(!showPassword),
							className: "absolute right-3.5 top-3 text-muted-foreground hover:text-foreground",
							children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-xs text-muted-foreground cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: rememberMe,
								onChange: (e) => setRememberMe(e.target.checked),
								className: "h-4 w-4 rounded border-border text-primary accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remember me" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: isSubmitting,
						className: "w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60",
						children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In as Vendor" })
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleOtpSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Registered Mobile or Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: identifier,
							onChange: (e) => setIdentifier(e.target.value),
							placeholder: "9000000001 or store@example.com",
							className: "flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleSendOtp,
							disabled: otpCountdown > 0 || isSubmitting,
							className: "rounded-xl border border-primary text-primary font-semibold text-xs px-3 py-2 hover:bg-primary/10 transition disabled:opacity-50 shrink-0",
							children: otpCountdown > 0 ? `Resend (${otpCountdown}s)` : otpSent ? "Resend OTP" : "Send OTP"
						})]
					})] }),
					otpSent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Enter 6-digit OTP (Demo: 123456)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						maxLength: 6,
						value: otpCode,
						onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, "")),
						placeholder: "123456",
						className: "w-full tracking-widest text-center font-mono font-bold text-lg rounded-xl border border-border bg-background px-3.5 py-2.5 outline-none focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !otpSent || isSubmitting,
						className: "w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60",
						children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify & Sign In" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 text-xs text-emerald-800 dark:text-emerald-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-semibold flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), "Demo Approved Vendor:"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5",
					children: [
						"Mobile: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono font-bold",
							children: "9000000001"
						}),
						" · Password: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono font-bold",
							children: "Vendor@123"
						}),
						" · OTP: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "font-mono font-bold",
							children: "123456"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-5 text-center text-sm border-t border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "New vendor to RiderzPro? "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onSwitchToSignUp,
					className: "font-semibold text-primary hover:underline ml-1",
					children: "Create seller account →"
				})]
			}),
			showForgotModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold",
							children: "Reset Vendor Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Enter your registered mobile or email to verify via OTP."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Mobile or Email",
									value: forgotTarget,
									onChange: (e) => setForgotTarget(e.target.value),
									className: "w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none"
								}),
								forgotStep === "verify" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									maxLength: 6,
									placeholder: "Enter 6-digit OTP (123456)",
									value: forgotOtp,
									onChange: (e) => setForgotOtp(e.target.value),
									className: "w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-center font-mono font-bold outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									placeholder: "New password (min 8 chars)",
									value: newPassword,
									onChange: (e) => setNewPassword(e.target.value),
									className: "w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowForgotModal(false),
										className: "flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-muted",
										children: "Cancel"
									}), forgotStep === "send" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: async () => {
											if (!forgotTarget) return toast.error("Enter target");
											const channel = forgotTarget.includes("@") ? "email" : "sms";
											await otpAdapter.send(channel, forgotTarget);
											setForgotStep("verify");
										},
										className: "flex-1 rounded-xl bg-primary text-white py-2 text-xs font-semibold",
										children: "Send OTP"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: async () => {
											const res = await resetPasswordWithOtp(forgotTarget, forgotOtp, newPassword);
											if (res.success) setShowForgotModal(false);
											else toast.error(res.error || "Reset failed");
										},
										className: "flex-1 rounded-xl bg-primary text-white py-2 text-xs font-semibold",
										children: "Set Password"
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
function VendorSignUpForm({ onSwitchToSignIn }) {
	const { signUpVendor } = useVendorAuth();
	const navigate = useNavigate();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [businessType, setBusinessType] = (0, import_react.useState)("Proprietorship");
	const [mobile, setMobile] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [agreedToTerms, setAgreedToTerms] = (0, import_react.useState)(false);
	const [mobileOtpSent, setMobileOtpSent] = (0, import_react.useState)(false);
	const [mobileOtpCode, setMobileOtpCode] = (0, import_react.useState)("");
	const [mobileVerified, setMobileVerified] = (0, import_react.useState)(false);
	const [mobileCountdown, setMobileCountdown] = (0, import_react.useState)(0);
	const [emailOtpSent, setEmailOtpSent] = (0, import_react.useState)(false);
	const [emailOtpCode, setEmailOtpCode] = (0, import_react.useState)("");
	const [emailVerified, setEmailVerified] = (0, import_react.useState)(false);
	const [emailCountdown, setEmailCountdown] = (0, import_react.useState)(0);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (mobileCountdown > 0) {
			const timer = setTimeout(() => setMobileCountdown(mobileCountdown - 1), 1e3);
			return () => clearTimeout(timer);
		}
	}, [mobileCountdown]);
	(0, import_react.useEffect)(() => {
		if (emailCountdown > 0) {
			const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1e3);
			return () => clearTimeout(timer);
		}
	}, [emailCountdown]);
	const passwordStrength = (() => {
		if (!password) return 0;
		let s = 0;
		if (password.length >= 8) s += 30;
		if (/[0-9]/.test(password)) s += 35;
		if (/[a-zA-Z]/.test(password)) s += 35;
		return Math.min(100, s);
	})();
	const handleSendMobileOtp = async () => {
		if (!validateMobile(mobile)) {
			toast.error("Please enter a valid 10-digit Indian mobile number");
			return;
		}
		const res = await otpAdapter.send("sms", mobile);
		if (res.success) {
			setMobileOtpSent(true);
			setMobileCountdown(30);
		} else toast.error(res.message);
	};
	const handleVerifyMobileOtp = async () => {
		const res = await otpAdapter.verify("sms", mobile, mobileOtpCode);
		if (res.success) {
			setMobileVerified(true);
			toast.success("Mobile number verified successfully!");
		} else toast.error(res.error || "Invalid mobile OTP");
	};
	const handleSendEmailOtp = async () => {
		if (!email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}
		const res = await otpAdapter.send("email", email);
		if (res.success) {
			setEmailOtpSent(true);
			setEmailCountdown(30);
		} else toast.error(res.message);
	};
	const handleVerifyEmailOtp = async () => {
		const res = await otpAdapter.verify("email", email, emailOtpCode);
		if (res.success) {
			setEmailVerified(true);
			toast.success("Email address verified successfully!");
		} else toast.error(res.error || "Invalid email OTP");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!fullName.trim()) return toast.error("Enter full legal name");
		if (!mobileVerified) return toast.error("Please verify your mobile number with OTP");
		if (!emailVerified) return toast.error("Please verify your email address with OTP");
		if (password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) return toast.error("Password must be at least 8 characters with 1 letter and 1 number");
		if (password !== confirmPassword) return toast.error("Passwords do not match");
		if (!agreedToTerms) return toast.error("You must accept the Seller Agreement & Policies");
		setIsSubmitting(true);
		const res = await signUpVendor({
			fullName,
			businessType,
			mobile,
			email,
			password
		});
		setIsSubmitting(false);
		if (res.success) {
			toast.success("Seller account created! Continuing to Onboarding Stepper...");
			navigate({ to: "/vendor/onboarding" });
		} else toast.error(res.error || "Failed to create seller account");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-primary tracking-wider uppercase",
						children: "Step 1 of 6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-extrabold tracking-tight text-foreground mt-1",
						children: "Seller Account Creation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Create your verified EV parts vendor profile."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Full Name of Authorized Representative"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: fullName,
						onChange: (e) => setFullName(e.target.value),
						placeholder: "e.g. Ramesh Chandra",
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Business Constitution / Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: businessType,
						onChange: (e) => setBusinessType(e.target.value),
						className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Proprietorship",
								children: "Proprietorship"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Individual",
								children: "Individual (Unregistered)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Partnership",
								children: "Partnership"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Pvt Ltd",
								children: "Private Limited (Pvt Ltd)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "LLP",
								children: "Limited Liability Partnership (LLP)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Company",
								children: "Public Ltd / Other Company"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Mobile Number (+91)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									maxLength: 10,
									disabled: mobileVerified,
									value: mobile,
									onChange: (e) => setMobile(e.target.value.replace(/\D/g, "")),
									placeholder: "9876543210",
									className: `w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary ${mobileVerified ? "border-emerald-500 bg-emerald-50/30" : "border-border"}`
								}), mobileVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "absolute right-3 top-3 h-4 w-4 text-emerald-600" })]
							}), !mobileVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSendMobileOtp,
								disabled: mobileCountdown > 0,
								className: "rounded-xl border border-primary text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/10 transition disabled:opacity-50 shrink-0",
								children: mobileCountdown > 0 ? `${mobileCountdown}s` : mobileOtpSent ? "Resend" : "Send OTP"
							})]
						}),
						mobileOtpSent && !mobileVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								maxLength: 6,
								value: mobileOtpCode,
								onChange: (e) => setMobileOtpCode(e.target.value.replace(/\D/g, "")),
								placeholder: "OTP (123456)",
								className: "w-32 rounded-xl border border-border bg-background px-3 py-2 text-center text-xs font-mono font-bold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleVerifyMobileOtp,
								className: "rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold hover:bg-emerald-700",
								children: "Verify Mobile"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Official Store Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									disabled: emailVerified,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "store@domain.com",
									className: `w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary ${emailVerified ? "border-emerald-500 bg-emerald-50/30" : "border-border"}`
								}), emailVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "absolute right-3 top-3 h-4 w-4 text-emerald-600" })]
							}), !emailVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleSendEmailOtp,
								disabled: emailCountdown > 0,
								className: "rounded-xl border border-primary text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/10 transition disabled:opacity-50 shrink-0",
								children: emailCountdown > 0 ? `${emailCountdown}s` : emailOtpSent ? "Resend" : "Send OTP"
							})]
						}),
						emailOtpSent && !emailVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								maxLength: 6,
								value: emailOtpCode,
								onChange: (e) => setEmailOtpCode(e.target.value.replace(/\D/g, "")),
								placeholder: "OTP (123456)",
								className: "w-32 rounded-xl border border-border bg-background px-3 py-2 text-center text-xs font-mono font-bold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleVerifyEmailOtp,
								className: "rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold hover:bg-emerald-700",
								children: "Verify Email"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Create Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showPassword ? "text" : "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Min 8 chars, 1 letter, 1 number",
								className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm pr-10 outline-none focus:border-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 top-3 text-muted-foreground hover:text-foreground",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 flex-1 rounded-full bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full transition-all ${passwordStrength < 60 ? "bg-destructive w-1/3" : passwordStrength < 100 ? "bg-amber-500 w-2/3" : "bg-emerald-500 w-full"}` })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-muted-foreground",
								children: passwordStrength < 60 ? "Weak" : passwordStrength < 100 ? "Medium" : "Strong"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Confirm Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						required: true,
						value: confirmPassword,
						onChange: (e) => setConfirmPassword(e.target.value),
						placeholder: "Re-enter password",
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2.5 pt-2 text-xs text-muted-foreground cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: agreedToTerms,
							onChange: (e) => setAgreedToTerms(e.target.checked),
							className: "mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"I agree to the RiderzPro ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground underline",
								children: "Seller Services Agreement"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground underline",
								children: "Merchant Terms"
							}),
							", and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground underline",
								children: "Privacy Policy"
							}),
							"."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: isSubmitting || !mobileVerified || !emailVerified,
						className: "w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 font-bold text-primary-foreground shadow-glow hover:brightness-105 active:scale-[0.99] transition disabled:opacity-50 mt-2",
						children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Tax Verification" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-5 text-center text-sm border-t border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Already have a seller account? "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onSwitchToSignIn,
					className: "font-semibold text-primary hover:underline ml-1",
					children: "Sign in here"
				})]
			})
		]
	});
}
function VendorAuthRouteComponent() {
	const search = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorAuthPage, {
		initialMode: search.mode || "signin",
		redirectPath: search.redirect
	});
}
//#endregion
export { VendorAuthRouteComponent as component };

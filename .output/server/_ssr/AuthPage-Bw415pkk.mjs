import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { $ as LoaderCircle, _t as Eye, g as Sparkles, vt as EyeOff } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Logo } from "./bits-6XfYm-PF.mjs";
import { n as useAuth } from "./auth-ga-2flKS.mjs";
import { t as isDevAdminEnabled } from "./AdminDevBypass-BnAPMAZ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthPage-Bw415pkk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var rider_default = "/assets/rider-CxFpmyvi.jpg";
function GoogleIcon({ className = "h-5 w-5" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
			})
		]
	});
}
function AuthPage({ initialMode = "signin", redirectPath }) {
	const [mode, setMode] = (0, import_react.useState)(initialMode);
	const { isAuthenticated, loading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setMode(initialMode);
	}, [initialMode]);
	const targetPath = redirectPath || "/dashboard/customer";
	(0, import_react.useEffect)(() => {
		if (!loading && isAuthenticated) navigate({ to: targetPath });
	}, [
		loading,
		isAuthenticated,
		navigate,
		targetPath
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2 bg-background font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden lg:block overflow-hidden bg-zinc-950",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: rider_default,
					alt: "Riderzpro delivery rider",
					width: 1280,
					height: 896,
					className: "absolute inset-0 h-full w-full object-cover opacity-85"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-10 left-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }), "Official EV Rider Network"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-12 left-12 right-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]",
						children: [
							"Every part.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Every rider.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"One app."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-sm text-zinc-300 leading-relaxed font-normal",
						children: "Direct access to verified EV batteries, parts that match your VIN, and real-time tracked doorstep delivery across India."
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col min-h-screen p-5 sm:p-8 md:p-12 lg:p-14 overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/assistant",
						className: "flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-2xs transition hover:bg-primary hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Assistant" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-auto py-8 sm:py-12 mx-auto w-full max-w-md",
					children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInForm, {
						onSwitchToSignUp: () => setMode("signup"),
						targetPath
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUpForm, {
						onSwitchToSignIn: () => setMode("signin"),
						targetPath
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-auto pt-6 text-center text-xs text-muted-foreground border-t border-border/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 Riderzpro · Safe & secure customer authentication" })
				})
			]
		})]
	});
}
function SignInForm({ onSwitchToSignUp, targetPath }) {
	const { signIn, signInWithGoogle } = useAuth();
	const navigate = useNavigate();
	const [identifier, setIdentifier] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [rememberMe, setRememberMe] = (0, import_react.useState)(true);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [isGoogleSubmitting, setIsGoogleSubmitting] = (0, import_react.useState)(false);
	const [showForgotModal, setShowForgotModal] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const validate = () => {
		const newErrors = {};
		const trimmed = identifier.trim();
		if (!trimmed) newErrors.identifier = "Please enter your email or 10-digit mobile number.";
		else if (trimmed.includes("@")) {
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) newErrors.identifier = "Please enter a valid email address.";
		} else if (trimmed.replace(/\D/g, "").length !== 10) newErrors.identifier = "Please enter a valid 10-digit phone number.";
		if (!password) newErrors.password = "Please enter your password.";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;
		setIsSubmitting(true);
		try {
			const res = await signIn(identifier, password, rememberMe);
			if (res.success) {
				toast.success("Welcome back!", { description: "Signed in successfully to your Riderzpro account." });
				navigate({ to: targetPath });
			} else {
				toast.error("Invalid email or password", { description: res.error || "Please check your credentials and try again." });
				setErrors((prev) => ({
					...prev,
					password: "The password or identifier you entered does not match."
				}));
			}
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleGoogleSignIn = async () => {
		setIsGoogleSubmitting(true);
		try {
			const res = await signInWithGoogle();
			if (res.success) {
				toast.success("Welcome back!", { description: "Signed in with Google successfully." });
				navigate({ to: targetPath });
			} else toast.error("Google sign in failed", { description: res.error });
		} finally {
			setIsGoogleSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/80 bg-white dark:bg-card p-6 sm:p-8 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground",
					children: "Welcome back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Sign in to your Riderzpro account."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				noValidate: true,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signin-identifier",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5",
							children: "Email or Phone Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "signin-identifier",
								type: "text",
								autoFocus: true,
								autoComplete: "username",
								placeholder: "name@example.com or 9876543210",
								value: identifier,
								onChange: (e) => {
									setIdentifier(e.target.value);
									if (errors.identifier) setErrors((prev) => ({
										...prev,
										identifier: void 0
									}));
								},
								"aria-invalid": Boolean(errors.identifier),
								"aria-describedby": errors.identifier ? "signin-identifier-error" : void 0,
								className: `w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${errors.identifier ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
							})
						}),
						errors.identifier && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signin-identifier-error",
							className: "mt-1.5 text-xs font-medium text-destructive",
							children: errors.identifier
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "signin-password",
								className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Password"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "signin-password",
								type: showPassword ? "text" : "password",
								autoComplete: "current-password",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									if (errors.password) setErrors((prev) => ({
										...prev,
										password: void 0
									}));
								},
								"aria-invalid": Boolean(errors.password),
								"aria-describedby": errors.password ? "signin-password-error" : void 0,
								className: `w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${errors.password ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								"aria-label": showPassword ? "Hide password" : "Show password",
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signin-password-error",
							className: "mt-1.5 text-xs font-medium text-destructive",
							children: errors.password
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								id: "signin-remember",
								checked: rememberMe,
								onChange: (e) => setRememberMe(e.target.checked),
								className: "h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Remember me"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowForgotModal(true),
							className: "text-xs font-semibold text-primary hover:underline",
							children: "Forgot password?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						id: "signin-submit-btn",
						disabled: isSubmitting,
						className: "w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed",
						children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Signing in..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign in" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-4 flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border/80" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative bg-white dark:bg-card px-3 text-xs uppercase text-muted-foreground font-medium",
							children: "or"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleGoogleSignIn,
						disabled: isGoogleSubmitting,
						className: "w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background hover:bg-muted/60 py-2.5 px-4 text-sm font-semibold text-foreground transition active:scale-[0.99] disabled:opacity-60",
						children: [isGoogleSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue with Google" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-2.5 text-xs text-emerald-800 dark:text-emerald-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Demo Customer credentials:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5",
							children: [
								"Email: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "font-mono font-semibold",
									children: "aakash@riderzpro.com"
								}),
								" · Password: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "font-mono font-semibold",
									children: "Password123"
								})
							]
						})]
					}),
					isDevAdminEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-2.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-amber-800 dark:text-amber-300",
							children: "Development Phase:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-amber-700 dark:text-amber-400",
							children: "Operations & Admin console testing"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							className: "rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold px-2.5 py-1 text-[11px] transition shadow-xs shrink-0",
							children: "Admin Bypass →"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-5 text-center text-sm border-t border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "New to Riderzpro? "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onSwitchToSignUp,
					className: "font-semibold text-primary hover:underline ml-1",
					children: "Create an account"
				})]
			}),
			showForgotModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold",
							children: "Reset Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Enter your email and we'll send you a password reset link."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							placeholder: "name@example.com",
							defaultValue: identifier.includes("@") ? identifier : "",
							className: "mt-4 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowForgotModal(false),
								className: "rounded-xl px-4 py-2 text-xs font-semibold hover:bg-muted",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setShowForgotModal(false);
									toast.success("Password reset instructions sent", { description: "Check your email for the reset link." });
								},
								className: "rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground",
								children: "Send instructions"
							})]
						})
					]
				})
			})
		]
	});
}
function SignUpForm({ onSwitchToSignIn, targetPath }) {
	const { signUp, signInWithGoogle } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [agreeTerms, setAgreeTerms] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [isGoogleSubmitting, setIsGoogleSubmitting] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const validate = () => {
		const newErrors = {};
		if (!name.trim()) newErrors.name = "Please enter your full name.";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) newErrors.email = "Please enter your email address.";
		else if (!emailRegex.test(email.trim())) newErrors.email = "Please enter a valid email format.";
		const cleanPhone = phone.replace(/\D/g, "");
		if (!cleanPhone) newErrors.phone = "Please enter your 10-digit phone number.";
		else if (cleanPhone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits.";
		if (!password) newErrors.password = "Password is required.";
		else if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
		else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) newErrors.password = "Password must include at least one letter and one number.";
		if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
		else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match.";
		if (!agreeTerms) newErrors.agreeTerms = "You must accept the Terms & Privacy Policy.";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;
		setIsSubmitting(true);
		try {
			const res = await signUp({
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim(),
				password
			});
			if (res.success) {
				toast.success("Account created!", { description: "Welcome to Riderzpro. You're now signed in." });
				navigate({ to: targetPath });
			} else {
				toast.error("Sign up failed", { description: res.error });
				if (res.error?.includes("email")) setErrors((prev) => ({
					...prev,
					email: res.error
				}));
				else if (res.error?.includes("phone")) setErrors((prev) => ({
					...prev,
					phone: res.error
				}));
			}
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleGoogleSignIn = async () => {
		setIsGoogleSubmitting(true);
		try {
			const res = await signInWithGoogle();
			if (res.success) {
				toast.success("Welcome!", { description: "Signed up with Google successfully." });
				navigate({ to: targetPath });
			} else toast.error("Google sign in failed", { description: res.error });
		} finally {
			setIsGoogleSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/80 bg-white dark:bg-card p-6 sm:p-8 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground",
					children: "Create your account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Get parts that fit, delivered by riders you can track."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				noValidate: true,
				className: "space-y-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-name",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Full Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "signup-name",
							type: "text",
							autoFocus: true,
							autoComplete: "name",
							placeholder: "Aakash Sharma",
							value: name,
							onChange: (e) => {
								setName(e.target.value);
								if (errors.name) setErrors((prev) => ({
									...prev,
									name: void 0
								}));
							},
							"aria-invalid": Boolean(errors.name),
							"aria-describedby": errors.name ? "signup-name-error" : void 0,
							className: `w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
						}),
						errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signup-name-error",
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.name
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-email",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Email Address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "signup-email",
							type: "email",
							autoComplete: "email",
							placeholder: "aakash@example.com",
							value: email,
							onChange: (e) => {
								setEmail(e.target.value);
								if (errors.email) setErrors((prev) => ({
									...prev,
									email: void 0
								}));
							},
							"aria-invalid": Boolean(errors.email),
							"aria-describedby": errors.email ? "signup-email-error" : void 0,
							className: `w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
						}),
						errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signup-email-error",
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.email
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-phone",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Phone Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center px-3.5 bg-muted/60 text-xs font-bold text-foreground border-r border-border select-none",
								children: "+91"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "signup-phone",
								type: "tel",
								autoComplete: "tel-national",
								maxLength: 10,
								placeholder: "9876543210",
								value: phone,
								onChange: (e) => {
									const numOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
									setPhone(numOnly);
									if (errors.phone) setErrors((prev) => ({
										...prev,
										phone: void 0
									}));
								},
								"aria-invalid": Boolean(errors.phone),
								"aria-describedby": errors.phone ? "signup-phone-error" : void 0,
								className: "w-full bg-transparent px-3.5 py-2.5 text-sm outline-none"
							})]
						}),
						errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signup-phone-error",
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.phone
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-password",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "signup-password",
								type: showPassword ? "text" : "password",
								autoComplete: "new-password",
								placeholder: "Min 8 chars, 1 letter & 1 number",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									if (errors.password) setErrors((prev) => ({
										...prev,
										password: void 0
									}));
								},
								"aria-invalid": Boolean(errors.password),
								"aria-describedby": errors.password ? "signup-password-error" : void 0,
								className: `w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${errors.password ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								"aria-label": showPassword ? "Hide password" : "Show password",
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signup-password-error",
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.password
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-confirm-password",
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Confirm Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "signup-confirm-password",
								type: showConfirmPassword ? "text" : "password",
								autoComplete: "new-password",
								placeholder: "Re-enter password",
								value: confirmPassword,
								onChange: (e) => {
									setConfirmPassword(e.target.value);
									if (errors.confirmPassword) setErrors((prev) => ({
										...prev,
										confirmPassword: void 0
									}));
								},
								"aria-invalid": Boolean(errors.confirmPassword),
								"aria-describedby": errors.confirmPassword ? "signup-confirm-password-error" : void 0,
								className: `w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${errors.confirmPassword ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowConfirmPassword(!showConfirmPassword),
								"aria-label": showConfirmPassword ? "Hide password" : "Show password",
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
								children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						errors.confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "signup-confirm-password-error",
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.confirmPassword
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2.5 cursor-pointer select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								id: "signup-terms",
								checked: agreeTerms,
								onChange: (e) => {
									setAgreeTerms(e.target.checked);
									if (errors.agreeTerms) setErrors((prev) => ({
										...prev,
										agreeTerms: void 0
									}));
								},
								className: "mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground leading-normal",
								children: [
									"I agree to the",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-medium underline",
										children: "Terms of Service"
									}),
									" and",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-medium underline",
										children: "Privacy Policy"
									}),
									"."
								]
							})]
						}), errors.agreeTerms && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.agreeTerms
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						id: "signup-submit-btn",
						disabled: isSubmitting,
						className: "w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2",
						children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Creating account..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create account" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-4 flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border/80" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative bg-white dark:bg-card px-3 text-xs uppercase text-muted-foreground font-medium",
							children: "or"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleGoogleSignIn,
						disabled: isGoogleSubmitting,
						className: "w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background hover:bg-muted/60 py-2.5 px-4 text-sm font-semibold text-foreground transition active:scale-[0.99] disabled:opacity-60",
						children: [isGoogleSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue with Google" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-5 text-center text-sm border-t border-border/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Already have an account? "
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onSwitchToSignIn,
					className: "font-semibold text-primary hover:underline ml-1",
					children: "Sign in"
				})]
			})
		]
	});
}
//#endregion
export { AuthPage as t };

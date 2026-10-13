import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, I as Phone, Kt as Bike, Nt as ChevronRight, Q as Lock, _t as Eye, a as User, tn as ArrowRight, vt as EyeOff } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Logo, l as bikes, w as useStore } from "./bits-6XfYm-PF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-ySYdRcf8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ev_login_showcase_default = "/assets/ev-login-showcase-nZh_Lq1H.jpg";
function CustomerLogin() {
	const navigate = useNavigate();
	const { userProfile, setRole, signIn, updateUserProfile, addBike } = useStore();
	const [activeTab, setActiveTab] = (0, import_react.useState)("signin");
	const [signInContact, setSignInContact] = (0, import_react.useState)("");
	const [signInPassword, setSignInPassword] = (0, import_react.useState)("");
	const [showSignInPassword, setShowSignInPassword] = (0, import_react.useState)(false);
	const [signUpName, setSignUpName] = (0, import_react.useState)("");
	const [signUpPhone, setSignUpPhone] = (0, import_react.useState)("");
	const [signUpBikeId, setSignUpBikeId] = (0, import_react.useState)("");
	const [signUpPassword, setSignUpPassword] = (0, import_react.useState)("");
	const [showSignUpPassword, setShowSignUpPassword] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const getRedirectTarget = () => {
		if (typeof window !== "undefined") {
			const redir = new URLSearchParams(window.location.search).get("redirect");
			if (redir && redir.startsWith("/")) return redir;
		}
		return "/dashboard/customer";
	};
	const handleSignIn = (e) => {
		e.preventDefault();
		if (!signInContact.trim()) {
			toast.error("Please enter your mobile number or email.");
			return;
		}
		if (!signInPassword.trim()) {
			toast.error("Please enter your password.");
			return;
		}
		setIsLoading(true);
		setTimeout(() => {
			const isEmail = signInContact.includes("@");
			if (isEmail && !userProfile?.email) updateUserProfile({ email: signInContact.trim() });
			else if (!isEmail && !userProfile?.phone) updateUserProfile({ phone: signInContact.trim() });
			signIn();
			setRole("customer");
			const welcomeName = userProfile?.name?.trim() ? userProfile.name.trim().split(" ")[0] : "Rider";
			toast.success(`Welcome back, ${welcomeName}!`);
			const target = getRedirectTarget();
			navigate({ to: target });
			setIsLoading(false);
		}, 350);
	};
	const handleSignUp = (e) => {
		e.preventDefault();
		if (!signUpName.trim()) {
			toast.error("Please enter your full name.");
			return;
		}
		if (!signUpPhone.trim()) {
			toast.error("Please enter your mobile number.");
			return;
		}
		if (!signUpPassword.trim() || signUpPassword.length < 4) {
			toast.error("Password must be at least 4 characters.");
			return;
		}
		setIsLoading(true);
		setTimeout(() => {
			updateUserProfile({
				name: signUpName.trim(),
				phone: signUpPhone.trim(),
				email: `${signUpPhone.trim()}@riderzpro.in`,
				city: "Bengaluru, KA",
				address: ""
			});
			if (signUpBikeId && signUpBikeId !== "none") {
				const selectedBike = bikes.find((b) => b.id === signUpBikeId);
				if (selectedBike) addBike({
					bikeId: selectedBike.id,
					year: selectedBike.years.at(-1),
					nickname: `${signUpName.trim().split(" ")[0]}'s ${selectedBike.model}`,
					batteryHealth: 99,
					nextServiceDays: 90,
					odoKm: 0
				});
			}
			signIn();
			setRole("customer");
			toast.success(`Account created! Welcome, ${signUpName.trim().split(" ")[0]}!`);
			const target = getRedirectTarget();
			navigate({ to: target });
			setIsLoading(false);
		}, 400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center sm:p-4 md:p-6 antialiased",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full sm:max-w-[425px] min-h-screen sm:min-h-[820px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:border sm:border-gray-200/80 flex flex-col justify-between overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-56 sm:h-60 w-full overflow-hidden bg-black shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ev_login_showcase_default,
						alt: "RiderzPro Electric Motorcycle",
						className: "absolute inset-0 h-full w-full object-cover object-center brightness-95"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 p-4 sm:p-5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-6 w-auto" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition active:scale-95",
							children: "← Store"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-6 left-5 right-5 z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[#E31E24] animate-pulse" }), "EV Mobility & Doorstep Care"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-black text-white mt-1 leading-tight tracking-tight font-display drop-shadow-sm",
							children: "Your Ride. Verified Spares."
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative -mt-5 rounded-t-[28px] bg-white px-5 sm:px-6 pt-5 pb-6 flex-1 flex flex-col justify-between shadow-2xl z-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex p-1 rounded-2xl bg-gray-100 border border-gray-200/70 mb-5 text-sm font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("signin"),
							className: `flex-1 py-2.5 rounded-xl transition cursor-pointer text-center ${activeTab === "signin" ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-black" : "text-gray-500 hover:text-gray-900"}`,
							children: "Sign In"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("signup"),
							className: `flex-1 py-2.5 rounded-xl transition cursor-pointer text-center ${activeTab === "signup" ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-black" : "text-gray-500 hover:text-gray-900"}`,
							children: "Create Account"
						})]
					}),
					activeTab === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-black text-gray-900 tracking-tight font-display",
								children: "Welcome to RiderzPro"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-gray-500 mt-1 leading-relaxed",
								children: "Access your garage, live delivery tracking, and certified service."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSignIn,
								className: "space-y-3.5 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5",
										children: "Mobile Number or Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "username",
											autoComplete: "username",
											value: signInContact,
											onChange: (e) => setSignInContact(e.target.value),
											placeholder: "e.g. 9876543210 or name@mail.com",
											className: "w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-gray-700 uppercase tracking-wider",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => toast.info("Demo reset code sent."),
											className: "text-xs text-[#E31E24] font-bold hover:underline cursor-pointer",
											children: "Forgot Password?"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: showSignInPassword ? "text" : "password",
												name: "password",
												autoComplete: "current-password",
												value: signInPassword,
												onChange: (e) => setSignInPassword(e.target.value),
												placeholder: "Enter your password",
												className: "w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowSignInPassword(!showSignInPassword),
												className: "absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer",
												children: showSignInPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4.5 w-4.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4.5 w-4.5" })
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: isLoading,
										className: "w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#C1121F] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3",
										children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Signing in..."]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 text-center text-sm text-gray-500",
								children: [
									"New to RiderzPro?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActiveTab("signup"),
										className: "font-bold text-[#E31E24] hover:underline cursor-pointer",
										children: "Create an account"
									})
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-black text-gray-900 tracking-tight font-display",
								children: "Create Your Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-gray-500 mt-1 leading-relaxed",
								children: "Set up your EV garage to get verified spares and doorstep service."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSignUp,
								className: "space-y-3.5 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5",
										children: ["Full Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#E31E24]",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "name",
											autoComplete: "name",
											value: signUpName,
											onChange: (e) => setSignUpName(e.target.value),
											placeholder: "e.g. Rahul Sharma",
											className: "w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5",
										children: ["Mobile Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#E31E24]",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "tel",
											name: "tel",
											autoComplete: "tel",
											value: signUpPhone,
											onChange: (e) => setSignUpPhone(e.target.value),
											placeholder: "10-digit mobile number",
											className: "w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5",
										children: ["Electric Vehicle Model ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-400 font-normal",
											children: "(Optional)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: signUpBikeId,
												onChange: (e) => setSignUpBikeId(e.target.value),
												className: "w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-10 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition text-gray-800 appearance-none cursor-pointer",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Select your model (e.g. Ather, Ola...)"
													}),
													bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: b.id,
														children: [
															b.make,
															" ",
															b.model
														]
													}, b.id)),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "none",
														children: "I don't own an EV yet"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4.5 w-4.5 text-gray-400 absolute right-3.5 rotate-90 pointer-events-none" })
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5",
										children: ["Password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#E31E24]",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: showSignUpPassword ? "text" : "password",
												name: "password",
												autoComplete: "new-password",
												value: signUpPassword,
												onChange: (e) => setSignUpPassword(e.target.value),
												placeholder: "Min. 4 characters",
												className: "w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowSignUpPassword(!showSignUpPassword),
												className: "absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer",
												children: showSignUpPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4.5 w-4.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4.5 w-4.5" })
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: isLoading,
										className: "w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#C1121F] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3",
										children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Creating account..."]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 text-center text-sm text-gray-500",
								children: [
									"Already registered?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActiveTab("signin"),
										className: "font-bold text-[#E31E24] hover:underline cursor-pointer",
										children: "Sign in here"
									})
								]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "256-Bit SSL Encrypted · RiderzPro Mobility" })]
				})]
			})]
		})
	});
}
//#endregion
export { CustomerLogin as component };

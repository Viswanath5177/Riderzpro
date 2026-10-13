import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Plus, D as ShieldCheck, E as Shield, Ft as CircleCheck, Lt as CircleAlert, Nt as CircleX, O as ShieldAlert, Ot as CreditCard, U as Pen, Ut as Check, Yt as Building, at as LoaderCircle, c as Upload, dn as ArrowLeft, et as MapPin, jt as Clock, nt as LogOut, un as ArrowRight, wt as Eye } from "../_libs/lucide-react.mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useVendorStore } from "./vendorStore-jyyPc83P.mjs";
import { n as Logo } from "./bits-BhX7Ijve.mjs";
import { i as useVendorAuth, n as VendorRouteGuard } from "./vendorAuth-DcYgxaTS.mjs";
import { a as vendorBankSchema, c as vendorTaxSchema, n as validateGstin, o as vendorShippingSchema, r as validateIfsc, s as vendorStoreSchema, t as derivePanFromGstin } from "./validators-BPymqWry.mjs";
import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendor.onboarding-C7tyQZyI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ONBOARDING_STEPS = [
	{
		number: 1,
		title: "Seller account creation",
		shortTitle: "Account"
	},
	{
		number: 2,
		title: "Verify tax details",
		shortTitle: "Tax & GST"
	},
	{
		number: 3,
		title: "Store name & profile",
		shortTitle: "Store"
	},
	{
		number: 4,
		title: "Shipping & pickup",
		shortTitle: "Pickup & Prep"
	},
	{
		number: 5,
		title: "Bank details",
		shortTitle: "Bank & Payouts"
	},
	{
		number: 6,
		title: "Documents & Review",
		shortTitle: "Documents"
	}
];
function OnboardingLayout({ currentStep, completedSteps, onSelectStep, children }) {
	const { vendor, signOutVendor } = useVendorAuth();
	const currentMeta = ONBOARDING_STEPS.find((s) => s.number === currentStep) || ONBOARDING_STEPS[1];
	const progressPct = Math.round((currentStep - 1) / (ONBOARDING_STEPS.length - 1) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F5F6F8] flex flex-col font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 bg-white border-b border-border shadow-2xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline-block text-xs font-bold text-muted-foreground border-l border-border pl-3",
							children: "Seller Onboarding"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 text-xs font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden md:flex items-center gap-1.5 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Draft Autosaved" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOutVendor,
							className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save & Sign Out" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:block mx-auto max-w-6xl px-4 sm:px-6 pt-2 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 w-full bg-gray-200 rounded-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary transition-all duration-300",
								style: { width: `${progressPct}%` }
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: ONBOARDING_STEPS.map((s) => {
							const isDone = completedSteps.includes(s.number);
							const isCurrent = s.number === currentStep;
							const isClickable = isDone || s.number <= currentStep;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !isClickable,
								onClick: () => isClickable && onSelectStep(s.number),
								className: `flex items-center gap-2 text-left group transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${isDone ? "bg-emerald-600 text-white" : isCurrent ? "bg-primary text-white ring-4 ring-primary/20" : "bg-gray-200 text-gray-600"}`,
									children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : s.number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `text-xs font-bold leading-tight ${isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"}`,
										children: s.shortTitle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground hidden lg:block",
										children: isDone ? "Completed" : isCurrent ? "In progress" : "Pending"
									})]
								})]
							}, s.number);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:hidden border-t border-border/60 bg-white px-4 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-bold mb-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary",
							children: [
								"Step ",
								currentStep,
								" of ",
								ONBOARDING_STEPS.length
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: currentMeta.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full bg-gray-200 rounded-full overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-all duration-300",
							style: { width: `${currentStep / ONBOARDING_STEPS.length * 100}%` }
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 mx-auto w-full max-w-4xl p-4 sm:p-6 md:p-8",
			children
		})]
	});
}
function Step1Account({ vendor, onNext }) {
	const account = vendor.onboarding.account;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between pb-6 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), "Verified & Done"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-extrabold text-foreground mt-2",
						children: "Seller Account Details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "Your representative credentials created during signup."
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border bg-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Representative Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-foreground mt-1",
							children: account.fullName || vendor.businessName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border bg-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Business Constitution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-foreground mt-1",
							children: account.businessType
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border bg-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Verified Mobile Number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-base font-bold text-foreground",
								children: ["+91 ", account.mobile || vendor.phone]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5",
								children: "OTP Verified"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border bg-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Verified Store Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-bold text-foreground truncate",
								children: account.email || vendor.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5",
								children: "OTP Verified"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-end pt-4 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onNext,
					className: "flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Tax Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			})
		]
	});
}
var STATE_CODE_MAP = {
	"01": "Jammu & Kashmir",
	"02": "Himachal Pradesh",
	"03": "Punjab",
	"04": "Chandigarh",
	"05": "Uttarakhand",
	"06": "Haryana",
	"07": "Delhi",
	"08": "Rajasthan",
	"09": "Uttar Pradesh",
	"10": "Bihar",
	"11": "Sikkim",
	"12": "Arunachal Pradesh",
	"13": "Nagaland",
	"14": "Manipur",
	"15": "Mizoram",
	"16": "Tripura",
	"17": "Meghalaya",
	"18": "Assam",
	"19": "West Bengal",
	"20": "Jharkhand",
	"21": "Odisha",
	"22": "Chhattisgarh",
	"23": "Madhya Pradesh",
	"24": "Gujarat",
	"27": "Maharashtra",
	"29": "Karnataka",
	"30": "Goa",
	"32": "Kerala",
	"33": "Tamil Nadu",
	"36": "Telangana",
	"37": "Andhra Pradesh"
};
var gstAdapter = { 
/**
* Mock GSTIN lookup adapter. In production this connects to GST Portal / Sandbox API.
*/
async lookup(gstin) {
	const check = validateGstin(gstin);
	if (!check.valid) throw new Error(check.error || "Invalid GSTIN format or checksum");
	const clean = gstin.trim().toUpperCase();
	const stateName = STATE_CODE_MAP[clean.slice(0, 2)] || "Karnataka";
	const pan = derivePanFromGstin(clean);
	await new Promise((resolve) => setTimeout(resolve, 400));
	if (clean === "27AAPFU0939F1ZV") return {
		gstin: clean,
		legalName: "VoltHub Energy Systems Solutions Private Limited",
		tradeName: "VoltHub Mobility & Spares",
		state: stateName,
		registrationDate: "14/08/2021",
		taxpayerType: "Regular",
		status: "Active",
		address: "Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093",
		pan
	};
	if (clean.startsWith("29")) return {
		gstin: clean,
		legalName: "Riderz Spares & Batteries Karnataka LLP",
		tradeName: "EV Power Solutions Indiranagar",
		state: "Karnataka",
		registrationDate: "01/04/2022",
		taxpayerType: "Regular",
		status: "Active",
		address: "742, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
		pan
	};
	return {
		gstin: clean,
		legalName: `Auto Parts Retailers (${pan}) Pvt Ltd`,
		tradeName: `EV Spares & Components Hub`,
		state: stateName,
		registrationDate: "10/01/2023",
		taxpayerType: "Regular",
		status: "Active",
		address: `Industrial Estate, Sector 5, ${stateName}`,
		pan
	};
} };
function Step2Tax({ vendor, onBack, onSaveAndNext }) {
	const defaultTax = vendor.onboarding.tax;
	const [gstExempt, setGstExempt] = (0, import_react.useState)(defaultTax?.gstExempt || false);
	const [gstLookupLoading, setGstLookupLoading] = (0, import_react.useState)(false);
	const [gstData, setGstData] = (0, import_react.useState)(null);
	const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
		resolver: u(vendorTaxSchema),
		defaultValues: {
			gstExempt: defaultTax?.gstExempt || false,
			gstin: defaultTax?.gstin || "27AAPFU0939F1ZV",
			legalName: defaultTax?.legalName || vendor.businessName,
			tradeName: defaultTax?.tradeName || "",
			pan: defaultTax?.pan || "AAPFU0939F",
			panHolderName: defaultTax?.panHolderName || defaultTax?.legalName || "",
			chargesIgst: defaultTax?.chargesIgst ?? true,
			registeredAddress: defaultTax?.registeredAddress || "",
			sameAsGstAddress: defaultTax?.sameAsGstAddress ?? true,
			govtIdType: defaultTax?.govtIdType || "Driving Licence",
			govtIdLast4: defaultTax?.govtIdLast4 || "4192"
		}
	});
	const gstinValue = watch("gstin");
	const legalNameValue = watch("legalName");
	const panHolderNameValue = watch("panHolderName");
	(0, import_react.useEffect)(() => {
		if (gstinValue && gstinValue.length === 15 && !gstExempt) handleLookupGst(gstinValue);
	}, [gstinValue, gstExempt]);
	const handleLookupGst = async (gstinToLookup) => {
		setGstLookupLoading(true);
		try {
			const res = await gstAdapter.lookup(gstinToLookup);
			setGstData(res);
			setValue("legalName", res.legalName);
			setValue("tradeName", res.tradeName);
			setValue("pan", res.pan);
			if (!watch("panHolderName")) setValue("panHolderName", res.legalName);
			if (watch("sameAsGstAddress")) setValue("registeredAddress", res.address);
			toast.success("GSTIN verified successfully from tax registry!");
		} catch (e) {
			setGstData(null);
			toast.error(e.message || "Failed to verify GSTIN");
		} finally {
			setGstLookupLoading(false);
		}
	};
	const onSubmit = (formData) => {
		if (!gstExempt && gstData && gstData.status !== "Active") {
			toast.error("GST status is not Active. You cannot proceed with a cancelled GSTIN.");
			return;
		}
		onSaveAndNext({ tax: {
			...formData,
			gstExempt,
			status: gstData?.status || (gstExempt ? "Active" : void 0),
			registrationDate: gstData?.registrationDate,
			taxpayerType: gstData?.taxpayerType
		} });
	};
	const nameMismatch = panHolderNameValue && legalNameValue && !legalNameValue.toLowerCase().includes(panHolderNameValue.toLowerCase().split(" ")[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-primary tracking-wider uppercase",
					children: "Step 2 of 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-extrabold text-foreground mt-1",
					children: "Verify Tax Details (GST & PAN)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Enter your 15-digit GSTIN to auto-fetch your legal entity details and derive your PAN."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/30 p-3.5 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "gst-exempt-toggle",
							checked: gstExempt,
							onChange: (e) => {
								const checked = e.target.checked;
								setGstExempt(checked);
								setValue("gstExempt", checked);
							},
							className: "h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "gst-exempt-toggle",
							className: "text-xs font-semibold text-foreground cursor-pointer",
							children: "I don't have a GSTIN (Individual / Exempt Seller)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground hidden sm:inline",
						children: "Subject to category restrictions"
					})]
				}),
				!gstExempt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "GSTIN (15-Character Tax Identification Number)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setValue("gstin", "27AAPFU0939F1ZV");
									handleLookupGst("27AAPFU0939F1ZV");
								},
								className: "text-xs text-primary font-bold hover:underline",
								children: "Use Valid Sample (27AAPFU0939F1ZV)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									maxLength: 15,
									...register("gstin"),
									placeholder: "27AAPFU0939F1ZV",
									className: `w-full font-mono uppercase font-bold tracking-wider rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${errors.gstin ? "border-destructive" : "border-border focus:border-primary"}`
								}),
								gstLookupLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "absolute right-3.5 top-3 h-4 w-4 animate-spin text-primary" }),
								gstData && !gstLookupLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "absolute right-3.5 top-3 h-4 w-4 text-emerald-600" })
							]
						}),
						errors.gstin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-medium text-destructive",
							children: errors.gstin.message
						})
					] }), gstData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2 text-xs animate-in fade-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), "GST Active Verified Entity"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold uppercase",
								children: gstData.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-muted-foreground pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Legal Name:"
									}),
									" ",
									gstData.legalName
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Trade Name:"
									}),
									" ",
									gstData.tradeName
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "State:"
									}),
									" ",
									gstData.state
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: "Registration Date:"
									}),
									" ",
									gstData.registrationDate
								] })
							]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold",
						children: "GST Exemption Notice:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-amber-800 dark:text-amber-300",
						children: "You are onboarding as a GST-exempt seller. Your application will be flagged for closer review by RiderzPro Admin, and products requiring statutory GST invoices (e.g. high-capacity Li-ion packs) will be gated."
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Business Legal Entity Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						...register("legalName"),
						placeholder: "Official legal name registered with tax department",
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
					}),
					errors.legalName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-destructive",
						children: errors.legalName.message
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Permanent Account Number (PAN)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							maxLength: 10,
							readOnly: !gstExempt,
							...register("pan"),
							placeholder: "ABCDE1234F",
							className: `w-full font-mono uppercase font-bold rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none ${!gstExempt ? "bg-muted cursor-not-allowed border-border" : "border-border focus:border-primary"}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-1",
							children: !gstExempt ? "Auto-derived from chars 3 to 12 of your GSTIN" : "Enter 10-char PAN"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "PAN Card Holder Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							...register("panHolderName"),
							placeholder: "Name on physical PAN card",
							className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
						}),
						nameMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-amber-600 mt-1 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), "Note: PAN holder name differs from legal name. This will be verified."]
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Registered Business Address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						...register("registeredAddress"),
						placeholder: "Complete address registered on GST Certificate",
						className: "w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
					}),
					errors.registeredAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-destructive",
						children: errors.registeredAddress.message
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-bold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Identity Proof (Aadhaar-Free Secure Identification)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "For privacy security, RiderzPro never stores Aadhaar numbers. Select a government ID and enter the last 4 characters only."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-semibold text-muted-foreground mb-1",
								children: "ID Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								...register("govtIdType"),
								className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Driving Licence",
										children: "Driving Licence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Voter ID",
										children: "Voter ID Card"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Passport",
										children: "Passport"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-muted-foreground mb-1",
									children: "Last 4 Digits / Chars"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									maxLength: 4,
									...register("govtIdLast4"),
									placeholder: "4192",
									className: "w-full font-mono text-center font-bold rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
								}),
								errors.govtIdLast4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.govtIdLast4.message
								})
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-4 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onBack,
						className: "flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Store Profile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})]
	});
}
var ALL_CATEGORIES = [
	"Battery",
	"Charger",
	"BMS",
	"Motor",
	"Controller",
	"Brakes",
	"Electric Bikes",
	"Car Accessories",
	"Bike Accessories",
	"Riding Gear & Helmets",
	"Spare Parts"
];
function Step3Store({ vendor, onBack, onSaveAndNext }) {
	const { vendors } = useVendorStore();
	const defaultStore = vendor.onboarding.store;
	const [selectedCategories, setSelectedCategories] = (0, import_react.useState)(defaultStore?.categories?.length ? defaultStore.categories : ["Battery", "Charger"]);
	const [brands, setBrands] = (0, import_react.useState)(defaultStore?.brands?.length ? defaultStore.brands : [{
		name: "VoltRide",
		authType: "Authorised"
	}, {
		name: "ChargeMax",
		authType: "Authorised"
	}]);
	const [newBrandName, setNewBrandName] = (0, import_react.useState)("");
	const [newBrandAuth, setNewBrandAuth] = (0, import_react.useState)("Authorised");
	const [logoPreview, setLogoPreview] = (0, import_react.useState)(defaultStore?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80");
	const [bannerPreview, setBannerPreview] = (0, import_react.useState)(defaultStore?.bannerUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=80");
	const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
		resolver: u(vendorStoreSchema),
		defaultValues: {
			storeName: defaultStore?.storeName || vendor.storeName || "VoltHub Indiranagar",
			slug: defaultStore?.slug || vendor.slug || "volthub-indiranagar",
			tagline: defaultStore?.tagline || "Premier EV Batteries & Chargers",
			description: defaultStore?.description || "Verified distributor and dealer for EV spares, batteries and high-power fast chargers.",
			sellerType: defaultStore?.sellerType || "Authorised dealer",
			categories: selectedCategories,
			brands,
			yearsInBusiness: defaultStore?.yearsInBusiness ?? 3,
			website: defaultStore?.website || "",
			instagram: defaultStore?.instagram || ""
		}
	});
	const storeNameValue = watch("storeName");
	const isNameAvailable = storeNameValue && storeNameValue.trim().length >= 3 && !vendors.some((v) => v.id !== vendor.id && v.storeName?.toLowerCase() === storeNameValue.trim().toLowerCase());
	const handleNameChange = (val) => {
		setValue("storeName", val);
		const generatedSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
		setValue("slug", generatedSlug);
	};
	const toggleCategory = (cat) => {
		let next;
		if (selectedCategories.includes(cat)) {
			if (selectedCategories.length === 1) {
				toast.error("Select at least one category to sell");
				return;
			}
			next = selectedCategories.filter((c) => c !== cat);
		} else next = [...selectedCategories, cat];
		setSelectedCategories(next);
		setValue("categories", next);
	};
	const handleAddBrand = () => {
		if (!newBrandName.trim()) return;
		if (brands.some((b) => b.name.toLowerCase() === newBrandName.trim().toLowerCase())) {
			toast.error("Brand already added");
			return;
		}
		const updated = [...brands, {
			name: newBrandName.trim(),
			authType: newBrandAuth
		}];
		setBrands(updated);
		setValue("brands", updated);
		setNewBrandName("");
	};
	const handleRemoveBrand = (index) => {
		if (brands.length <= 1) {
			toast.error("Please keep at least one brand listed");
			return;
		}
		const updated = brands.filter((_, i) => i !== index);
		setBrands(updated);
		setValue("brands", updated);
	};
	const handleLogoUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const url = reader.result;
				setLogoPreview(url);
				setValue("storeName", watch("storeName"));
			};
			reader.readAsDataURL(file);
		}
	};
	const handleBannerUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const url = reader.result;
				setBannerPreview(url);
			};
			reader.readAsDataURL(file);
		}
	};
	const onSubmit = (formData) => {
		if (!selectedCategories.length) {
			toast.error("Select at least one category to sell");
			return;
		}
		if (!brands.length) {
			toast.error("Please add at least one brand");
			return;
		}
		onSaveAndNext({ store: {
			...formData,
			categories: selectedCategories,
			brands,
			logoUrl: logoPreview,
			bannerUrl: bannerPreview
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-primary tracking-wider uppercase",
					children: "Step 3 of 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-extrabold text-foreground mt-1",
					children: "Store Profile & Brand Offerings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Define your storefront brand name, customer slug, categories and authorized dealership brands."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Store Display Name"
							}), isNameAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-emerald-600 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), "Name Available"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							...register("storeName"),
							onChange: (e) => handleNameChange(e.target.value),
							placeholder: "e.g. VoltHub Indiranagar",
							className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-bold outline-none focus:border-primary"
						}),
						errors.storeName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.storeName.message
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Storefront URL Slug"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground font-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-gray-400",
							children: "/store/"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							...register("slug"),
							className: "w-full bg-transparent font-bold text-foreground outline-none"
						})]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Store Tagline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						...register("tagline"),
						placeholder: "e.g. Authorized EV Batteries & Fast Chargers",
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Store Description (Max 300 Characters)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							maxLength: 300,
							...register("description"),
							placeholder: "Tell riders about your genuine parts, battery certifications and warranty support...",
							className: "w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
						}),
						errors.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.description.message
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Seller Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						...register("sellerType"),
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Authorised dealer",
								children: "Authorised Dealer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Manufacturer",
								children: "Manufacturer / OEM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Distributor",
								children: "Distributor / Stockist"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Retailer",
								children: "Independent Retailer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Reseller",
								children: "Reseller"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Years in Auto / EV Business"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						max: 100,
						...register("yearsInBusiness"),
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
					children: "Categories You Intend to Sell (Multi-Select)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: ALL_CATEGORIES.map((cat) => {
						const active = selectedCategories.includes(cat);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleCategory(cat),
							className: `px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${active ? "bg-primary text-white border-primary shadow-xs" : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"}`,
							children: cat
						}, cat);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-foreground",
							children: "Brands You Sell & Authorization Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2 mb-2",
							children: brands.map((b, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-border text-xs font-semibold shadow-2xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground font-normal",
										children: [
											"(",
											b.authType,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleRemoveBrand(idx),
										className: "text-gray-400 hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" })
									})
								]
							}, b.name + idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newBrandName,
									onChange: (e) => setNewBrandName(e.target.value),
									placeholder: "Brand name (e.g. Daly, Brembo)",
									className: "flex-1 min-w-[140px] rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: newBrandAuth,
									onChange: (e) => setNewBrandAuth(e.target.value),
									className: "rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Authorised",
											children: "Authorised"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Own brand",
											children: "Own Brand"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Unbranded",
											children: "Unbranded"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleAddBrand,
									className: "rounded-xl bg-foreground text-background px-4 py-2 text-xs font-bold hover:opacity-90 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Add Brand"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground mb-2",
							children: "Store Logo (Square)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [logoPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logoPreview,
								alt: "Store Logo",
								className: "h-14 w-14 rounded-xl object-cover border border-border bg-white shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Change Logo"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: handleLogoUpload,
									className: "hidden"
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl border border-border bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-muted-foreground mb-2",
							children: "Storefront Banner"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [bannerPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: bannerPreview,
								alt: "Store Banner",
								className: "h-14 w-24 rounded-xl object-cover border border-border bg-white shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex-1 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Change Banner"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: handleBannerUpload,
									className: "hidden"
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-4 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onBack,
						className: "flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Shipping & Pickup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})]
	});
}
var PINCODE_MAP = {
	"560038": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Indiranagar",
		lat: 12.9784,
		lng: 77.6408
	},
	"560034": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Koramangala",
		lat: 12.9352,
		lng: 77.6245
	},
	"560011": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Jayanagar",
		lat: 12.925,
		lng: 77.5938
	},
	"560024": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Hebbal",
		lat: 13.0358,
		lng: 77.597
	},
	"560066": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Whitefield",
		lat: 12.9698,
		lng: 77.75
	},
	"560003": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Malleshwaram",
		lat: 13.0035,
		lng: 77.5709
	},
	"560001": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "MG Road / CBD",
		lat: 12.9716,
		lng: 77.5946
	},
	"560076": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "BTM Layout",
		lat: 12.9165,
		lng: 77.6101
	},
	"560100": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Electronic City",
		lat: 12.8452,
		lng: 77.6602
	},
	"560095": {
		city: "Bengaluru",
		state: "Karnataka",
		area: "Koramangala 1st Block",
		lat: 12.9279,
		lng: 77.6271
	},
	"400001": {
		city: "Mumbai",
		state: "Maharashtra",
		area: "Fort",
		lat: 18.9322,
		lng: 72.8354
	},
	"400093": {
		city: "Mumbai",
		state: "Maharashtra",
		area: "Andheri East",
		lat: 19.1136,
		lng: 72.8697
	},
	"400050": {
		city: "Mumbai",
		state: "Maharashtra",
		area: "Bandra West",
		lat: 19.0596,
		lng: 72.8295
	},
	"500081": {
		city: "Hyderabad",
		state: "Telangana",
		area: "Hitec City",
		lat: 17.4435,
		lng: 78.3772
	},
	"500001": {
		city: "Hyderabad",
		state: "Telangana",
		area: "Abids",
		lat: 17.385,
		lng: 78.4867
	},
	"600002": {
		city: "Chennai",
		state: "Tamil Nadu",
		area: "Anna Salai",
		lat: 13.0674,
		lng: 80.2678
	},
	"411001": {
		city: "Pune",
		state: "Maharashtra",
		area: "Shivajinagar",
		lat: 18.5314,
		lng: 73.8446
	},
	"110001": {
		city: "New Delhi",
		state: "Delhi",
		area: "Connaught Place",
		lat: 28.6315,
		lng: 77.2167
	}
};
var pincodeAdapter = { async lookup(pincode) {
	const clean = pincode.trim();
	if (!/^[1-9][0-9]{5}$/.test(clean)) throw new Error("Invalid Indian postal pincode");
	await new Promise((resolve) => setTimeout(resolve, 300));
	if (PINCODE_MAP[clean]) return {
		pincode: clean,
		...PINCODE_MAP[clean]
	};
	if (clean.startsWith("56")) return {
		pincode: clean,
		city: "Bengaluru",
		state: "Karnataka",
		area: `Bengaluru (${clean})`,
		lat: 12.9716,
		lng: 77.5946
	};
	if (clean.startsWith("40")) return {
		pincode: clean,
		city: "Mumbai",
		state: "Maharashtra",
		area: `Mumbai (${clean})`,
		lat: 19.076,
		lng: 72.8777
	};
	if (clean.startsWith("50")) return {
		pincode: clean,
		city: "Hyderabad",
		state: "Telangana",
		area: `Hyderabad (${clean})`,
		lat: 17.385,
		lng: 78.4867
	};
	if (clean.startsWith("60")) return {
		pincode: clean,
		city: "Chennai",
		state: "Tamil Nadu",
		area: `Chennai (${clean})`,
		lat: 13.0827,
		lng: 80.2707
	};
	if (clean.startsWith("41")) return {
		pincode: clean,
		city: "Pune",
		state: "Maharashtra",
		area: `Pune (${clean})`,
		lat: 18.5204,
		lng: 73.8567
	};
	if (clean.startsWith("11")) return {
		pincode: clean,
		city: "New Delhi",
		state: "Delhi",
		area: `Delhi (${clean})`,
		lat: 28.6139,
		lng: 77.209
	};
	return {
		pincode: clean,
		city: "Bengaluru",
		state: "Karnataka",
		area: `Area ${clean}`,
		lat: 12.9716,
		lng: 77.5946
	};
} };
function Step4Shipping({ vendor, onBack, onSaveAndNext }) {
	const defaultShipping = vendor.onboarding.shipping;
	const [pincodeLookupLoading, setPincodeLookupLoading] = (0, import_react.useState)(false);
	const [sellsLiIon, setSellsLiIon] = (0, import_react.useState)(defaultShipping?.sellsLiIon ?? true);
	const [unDeclared, setUnDeclared] = (0, import_react.useState)(defaultShipping?.un38_3Declared ?? true);
	const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
		resolver: u(vendorShippingSchema),
		defaultValues: {
			pickupAddress: {
				line1: defaultShipping?.pickupAddress?.line1 || "Plot 42, 100ft Road, HAL 2nd Stage",
				line2: defaultShipping?.pickupAddress?.line2 || "",
				landmark: defaultShipping?.pickupAddress?.landmark || "Near Metro Station",
				pincode: defaultShipping?.pickupAddress?.pincode || "560038",
				city: defaultShipping?.pickupAddress?.city || "Bengaluru",
				state: defaultShipping?.pickupAddress?.state || "Karnataka",
				lat: defaultShipping?.pickupAddress?.lat || 12.9784,
				lng: defaultShipping?.pickupAddress?.lng || 77.6408
			},
			contactName: defaultShipping?.contactName || vendor.onboarding.account.fullName || "Store Dispatcher",
			contactPhone: defaultShipping?.contactPhone || vendor.phone || "9000000001",
			handlingTimeMins: defaultShipping?.handlingTimeMins || 15,
			fulfillmentMode: defaultShipping?.fulfillmentMode || "hyperlocal",
			serviceableRadiusKm: defaultShipping?.serviceableRadiusKm || 25,
			acceptsCod: defaultShipping?.acceptsCod ?? true,
			returnWindowDays: defaultShipping?.returnWindowDays ?? 10,
			returnAddressSameAsPickup: defaultShipping?.returnAddressSameAsPickup ?? true,
			sellsLiIon,
			un38_3Declared: unDeclared
		}
	});
	watch("pickupAddress.pincode");
	const handlePincodeBlur = async (code) => {
		if (code && code.trim().length === 6) {
			setPincodeLookupLoading(true);
			try {
				const res = await pincodeAdapter.lookup(code);
				setValue("pickupAddress.city", res.city);
				setValue("pickupAddress.state", res.state);
				setValue("pickupAddress.lat", res.lat);
				setValue("pickupAddress.lng", res.lng);
				toast.success(`Location set: ${res.area}, ${res.city}`);
			} catch (e) {
				toast.error("Invalid pincode");
			} finally {
				setPincodeLookupLoading(false);
			}
		}
	};
	const onSubmit = (formData) => {
		if (sellsLiIon && !unDeclared) {
			toast.error("You must declare packaging compliance (UN38.3) for Li-ion battery logistics");
			return;
		}
		onSaveAndNext({ shipping: {
			...formData,
			sellsLiIon,
			un38_3Declared: unDeclared,
			workingHours: defaultShipping?.workingHours || {
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
			}
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-primary tracking-wider uppercase",
					children: "Step 4 of 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-extrabold text-foreground mt-1",
					children: "Shipping Preferences & Pickup Hub"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Your dispatch address and handling prep time directly calculate live customer delivery fee and rider ETA."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-bold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Warehouse / Shop Dispatch Address" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-semibold text-muted-foreground mb-1",
										children: "Pincode (Auto-fills City & GPS)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										maxLength: 6,
										...register("pickupAddress.pincode"),
										onBlur: (e) => handlePincodeBlur(e.target.value),
										placeholder: "560038",
										className: "w-full font-mono font-bold rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
									}),
									errors.pickupAddress?.pincode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-destructive mt-0.5",
										children: errors.pickupAddress.pincode.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-muted-foreground mb-1",
									children: "City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									...register("pickupAddress.city"),
									placeholder: "Bengaluru",
									className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-semibold text-muted-foreground mb-1",
									children: "State"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									...register("pickupAddress.state"),
									placeholder: "Karnataka",
									className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-semibold text-muted-foreground mb-1",
								children: "Address Line 1 (Building, Street, Unit No.)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								...register("pickupAddress.line1"),
								placeholder: "e.g. 42, 100 Feet Road, Indiranagar",
								className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
							}),
							errors.pickupAddress?.line1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-destructive mt-0.5",
								children: errors.pickupAddress.line1.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-semibold text-muted-foreground mb-1",
								children: "Landmark (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								...register("pickupAddress.landmark"),
								placeholder: "e.g. Opposite Metro Pillar 42",
								className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-semibold text-muted-foreground mb-1",
								children: "Coordinates (Lat / Lng)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "any",
									...register("pickupAddress.lat", { valueAsNumber: true }),
									className: "w-1/2 rounded-xl border border-border bg-muted px-2.5 py-1.5 text-[11px] font-mono"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "any",
									...register("pickupAddress.lng", { valueAsNumber: true }),
									className: "w-1/2 rounded-xl border border-border bg-muted px-2.5 py-1.5 text-[11px] font-mono"
								})]
							})] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Dispatch Contact Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							...register("contactName"),
							placeholder: "e.g. Store Manager",
							className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Dispatch Phone (+91)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							maxLength: 10,
							...register("contactPhone"),
							placeholder: "9876543210",
							className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
								children: "Prep Time (Minutes)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 5,
									max: 180,
									...register("handlingTimeMins", { valueAsNumber: true }),
									placeholder: "15",
									className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary font-bold"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "absolute right-3.5 top-3 h-4 w-4 text-muted-foreground" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5",
								children: "Calculates order ETA"
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Fulfilment Mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						...register("fulfillmentMode"),
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "hyperlocal",
							children: "RiderzPro rider pickup (Hyperlocal EV Delivery)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "courier",
							children: "I ship via my own courier (Surface / Air)"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Serviceable Hyperlocal Radius"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						...register("serviceableRadiusKm", { valueAsNumber: true }),
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 10,
								children: "10 km radius"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 15,
								children: "15 km radius"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 20,
								children: "20 km radius"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 25,
								children: "25 km radius (Standard City Wide)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 35,
								children: "35 km radius"
							})
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Customer Return Window"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						...register("returnWindowDays", { valueAsNumber: true }),
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 0,
								children: "No returns (Replacement for DOA only)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 7,
								children: "7 Days Return Policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 10,
								children: "10 Days Return Policy (Recommended)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 15,
								children: "15 Days Return Policy"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer p-2.5 rounded-xl border border-border bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								...register("acceptsCod"),
								className: "h-4 w-4 rounded border-border text-primary accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Accept Cash on Delivery (COD)" })]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 p-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-xs text-amber-950 dark:text-amber-200 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600" }), "EV Hazardous Goods & Li-ion Battery Compliance"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-1.5 text-xs text-amber-900 font-semibold cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: sellsLiIon,
								onChange: (e) => setSellsLiIon(e.target.checked),
								className: "h-4 w-4 accent-amber-600"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "We sell Li-ion Batteries / Fast Chargers" })]
						})]
					}), sellsLiIon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 text-xs space-y-2 text-amber-900 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] leading-relaxed",
							children: "Lithium-ion cells and battery modules require UN38.3 test certifications and fire-retardant outer packaging for dispatch via RiderzPro hyperlocal logistics fleet."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2 text-xs font-bold text-amber-950 dark:text-amber-100 cursor-pointer pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: unDeclared,
								onChange: (e) => setUnDeclared(e.target.checked),
								className: "mt-0.5 h-4 w-4 accent-amber-600"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I declare that all Li-ion battery packages comply with UN38.3 testing norms and AIS-156 safety guidelines." })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-4 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onBack,
						className: "flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Bank Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})]
	});
}
var BANK_PREFIXES = {
	HDFC: "HDFC Bank",
	ICIC: "ICICI Bank",
	SBIN: "State Bank of India",
	UTIB: "Axis Bank",
	KKBK: "Kotak Mahindra Bank",
	PUNB: "Punjab National Bank",
	BARB: "Bank of Baroda",
	CNRB: "Canara Bank",
	IDIB: "Indian Bank",
	YESB: "Yes Bank",
	INDB: "IndusInd Bank"
};
var ifscAdapter = { async lookup(ifsc) {
	const clean = ifsc.trim().toUpperCase();
	if (!validateIfsc(clean)) throw new Error("Invalid 11-character IFSC code");
	await new Promise((resolve) => setTimeout(resolve, 300));
	const prefix = clean.slice(0, 4);
	const bankName = BANK_PREFIXES[prefix] || `${prefix} Commercial Bank`;
	let branch = "Main Branch";
	let city = "Bengaluru";
	let state = "Karnataka";
	if (clean.includes("0002") || clean.includes("0038")) {
		branch = "Indiranagar Branch";
		city = "Bengaluru";
		state = "Karnataka";
	} else if (clean.includes("0034")) {
		branch = "Koramangala Branch";
		city = "Bengaluru";
		state = "Karnataka";
	} else if (clean.includes("0093")) {
		branch = "MIDC Andheri East Branch";
		city = "Mumbai";
		state = "Maharashtra";
	}
	return {
		ifsc: clean,
		bankName,
		branch,
		city,
		state
	};
} };
var bankAdapter = { 
/**
* Simulates an NPCI/RazorpayX Penny Drop verification.
* Deposits ₹1 into the account to fetch the legal account holder name from the bank switch.
*/
async verify(accountNo, ifsc, holderName) {
	const cleanAccount = accountNo.trim();
	ifsc.trim().toUpperCase();
	const cleanHolder = holderName.trim().toUpperCase();
	await new Promise((resolve) => setTimeout(resolve, 600));
	if (cleanAccount.length < 9 || cleanAccount === "000000000") return {
		verified: false,
		registeredName: "",
		nameMatchScore: 0,
		referenceId: `REF_FAIL_${Date.now()}`,
		error: "Bank rejected account verification: Invalid account number"
	};
	return {
		verified: true,
		registeredName: cleanHolder || "VERIFIED HOLDER",
		nameMatchScore: 98,
		referenceId: `NPCI_PD_${Date.now().toString(36).toUpperCase()}`
	};
} };
function Step5Bank({ vendor, onBack, onSaveAndNext }) {
	const defaultBank = vendor.onboarding.bank;
	const [ifscLoading, setIfscLoading] = (0, import_react.useState)(false);
	const [bankInfo, setBankInfo] = (0, import_react.useState)(defaultBank?.bankName ? {
		ifsc: defaultBank.ifsc,
		bankName: defaultBank.bankName,
		branch: defaultBank.branchName,
		city: "Bengaluru",
		state: "Karnataka"
	} : null);
	const [verifyingPenny, setVerifyingPenny] = (0, import_react.useState)(false);
	const [pennyResult, setPennyResult] = (0, import_react.useState)(defaultBank?.pennyDropVerified ? {
		verified: true,
		registeredName: defaultBank.pennyDropName || defaultBank.accountHolderName,
		nameMatchScore: 98,
		referenceId: "NPCI_VERIFIED"
	} : null);
	const [chequeFilePreview, setChequeFilePreview] = (0, import_react.useState)(defaultBank?.chequeDocUrl || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80");
	const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
		resolver: u(vendorBankSchema),
		defaultValues: {
			accountHolderName: defaultBank?.accountHolderName || vendor.businessName || "VoltHub Energy Systems Pvt Ltd",
			accountNumber: defaultBank?.accountNumber || "50200049281726",
			confirmAccountNumber: defaultBank?.accountNumber || "50200049281726",
			ifsc: defaultBank?.ifsc || "HDFC0000038",
			accountType: defaultBank?.accountType || "Current",
			upiId: defaultBank?.upiId || ""
		}
	});
	const ifscValue = watch("ifsc");
	const accountHolderVal = watch("accountHolderName");
	const accountNumVal = watch("accountNumber");
	const handleIfscBlur = async (code) => {
		if (code && code.trim().length === 11) {
			setIfscLoading(true);
			try {
				const res = await ifscAdapter.lookup(code);
				setBankInfo(res);
				toast.success(`Bank identified: ${res.bankName} (${res.branch})`);
			} catch (e) {
				setBankInfo(null);
				toast.error("Invalid IFSC code");
			} finally {
				setIfscLoading(false);
			}
		}
	};
	const handleTriggerPennyDrop = async () => {
		if (!accountNumVal || !ifscValue || !accountHolderVal) {
			toast.error("Please enter account number, IFSC and holder name before verifying");
			return;
		}
		setVerifyingPenny(true);
		try {
			const res = await bankAdapter.verify(accountNumVal, ifscValue, accountHolderVal);
			setPennyResult(res);
			if (res.verified) toast.success(`Penny drop verified! Bank account holder confirmed as: ${res.registeredName}`);
			else toast.error(res.error || "Penny drop verification failed");
		} catch {
			toast.error("Verification connection error");
		} finally {
			setVerifyingPenny(false);
		}
	};
	const onSubmit = (formData) => {
		if (!pennyResult?.verified) {
			toast.error("Please run penny drop verification to validate your bank account before continuing");
			return;
		}
		const masked = formData.accountNumber.length > 4 ? "X".repeat(formData.accountNumber.length - 4) + formData.accountNumber.slice(-4) : formData.accountNumber;
		onSaveAndNext({ bank: {
			...formData,
			maskedAccountNumber: masked,
			bankName: bankInfo?.bankName || "Commercial Bank",
			branchName: bankInfo?.branch || "Main Branch",
			pennyDropVerified: pennyResult.verified,
			pennyDropName: pennyResult.registeredName,
			chequeDocUrl: chequeFilePreview
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-primary tracking-wider uppercase",
					children: "Step 5 of 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-extrabold text-foreground mt-1",
					children: "Bank Account & Payout Settlements"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Direct bank transfer for your sales payouts. Verified with instant Penny Drop verification."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit(onSubmit),
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Bank Account Holder Name (Must match Business / PAN)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						...register("accountHolderName"),
						placeholder: "e.g. VoltHub Energy Systems Pvt Ltd",
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
					}),
					errors.accountHolderName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-destructive",
						children: errors.accountHolderName.message
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Bank Account Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							...register("accountNumber"),
							placeholder: "Enter account number",
							className: "w-full font-mono rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
						}),
						errors.accountNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.accountNumber.message
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Confirm Account Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							...register("confirmAccountNumber"),
							placeholder: "Re-enter to confirm",
							className: "w-full font-mono rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
						}),
						errors.confirmAccountNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.confirmAccountNumber.message
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "IFSC Code (11-Character)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setValue("ifsc", "HDFC0000038");
									handleIfscBlur("HDFC0000038");
								},
								className: "text-xs text-primary font-bold hover:underline",
								children: "Sample (HDFC0000038)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								maxLength: 11,
								...register("ifsc"),
								onBlur: (e) => handleIfscBlur(e.target.value),
								placeholder: "HDFC0000038",
								className: "w-full font-mono uppercase font-bold rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
							}), ifscLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "absolute right-3.5 top-3 h-4 w-4 animate-spin text-primary" })]
						}),
						errors.ifsc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.ifsc.message
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Account Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						...register("accountType"),
						className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Current",
							children: "Current Account (Recommended for Business)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "Savings",
							children: "Savings Account"
						})]
					})] })]
				}),
				bankInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/40 p-3.5 flex items-center justify-between text-xs animate-in fade-in",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-foreground",
							children: bankInfo.bankName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground text-[11px] mt-0.5",
							children: [
								"Branch: ",
								bankInfo.branch,
								" · ",
								bankInfo.city,
								", ",
								bankInfo.state
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold",
						children: "IFSC Valid"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-foreground",
									children: "Penny Drop Bank Account Verification"
								})]
							}), pennyResult?.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), "Verified"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleTriggerPennyDrop,
								disabled: verifyingPenny,
								className: "rounded-xl bg-foreground text-background px-3.5 py-1.5 text-xs font-bold hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer",
								children: verifyingPenny ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying with NPCI..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify with ₹1 Penny Drop" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground leading-relaxed",
							children: "We deposit a reversible ₹1 penny amount via IMPS to verify the exact registered account title with your bank."
						}),
						pennyResult?.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 p-2.5 text-xs text-emerald-800 dark:text-emerald-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Registered Holder Name on Bank Record:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono font-bold mt-0.5",
								children: pennyResult.registeredName
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-xs space-y-1 text-blue-950 dark:text-blue-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-blue-600" }), "Payout Settlement Cycle: T+7 Days"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-blue-800 dark:text-blue-400",
						children: "Payouts for delivered orders are credited automatically to this verified bank account on a rolling T+7 schedule. Platform commission (10–12%) and applicable TCS/TDS are deducted automatically."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-4 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onBack,
						className: "flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Documents & Review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})]
	});
}
function Step6DocumentsReview({ vendor, onBack, onEditStep, onSubmitApplication }) {
	const [agreementChecked, setAgreementChecked] = (0, import_react.useState)(true);
	const [signatureName, setSignatureName] = (0, import_react.useState)(vendor.onboarding.account.fullName || vendor.businessName || "Vikram Rathore");
	const [panDoc, setPanDoc] = (0, import_react.useState)(vendor.onboarding.documents?.panDocUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80");
	const [gstDoc, setGstDoc] = (0, import_react.useState)(vendor.onboarding.documents?.gstDocUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80");
	const [chequeDoc, setChequeDoc] = (0, import_react.useState)(vendor.onboarding.documents?.chequeDocUrl || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80");
	const [tradeLicenseDoc, setTradeLicenseDoc] = (0, import_react.useState)(vendor.onboarding.documents?.tradeLicenseDocUrl || "");
	const [activePreviewUrl, setActivePreviewUrl] = (0, import_react.useState)(null);
	const handleUpload = (e, setter) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5242880) {
				toast.error("File size exceeds 5 MB limit");
				return;
			}
			const reader = new FileReader();
			reader.onload = () => setter(reader.result);
			reader.readAsDataURL(file);
			toast.success("Document uploaded successfully");
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!agreementChecked) {
			toast.error("You must accept the digital merchant agreement before submitting");
			return;
		}
		if (!signatureName.trim()) {
			toast.error("Please type your legal signature name");
			return;
		}
		onSubmitApplication();
	};
	const ob = vendor.onboarding;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-4 border-b border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-primary tracking-wider uppercase",
						children: "Step 6 of 6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-extrabold text-foreground mt-1",
						children: "KYC Documents & Final Review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Upload required statutory certificates, review your information, and digitally sign to submit."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-bold text-foreground",
					children: "1. Required Verification Documents (PDF / JPG / PNG, Max 5 MB)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground",
								children: "PAN Card"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Physical PAN of entity"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 flex items-center justify-between",
								children: [panDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Ready"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActivePreviewUrl(panDoc),
										className: "text-gray-500 hover:text-foreground",
										title: "Preview",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-amber-600",
									children: "Pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-primary font-bold hover:underline",
										children: "Replace"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*,application/pdf",
										onChange: (e) => handleUpload(e, setPanDoc),
										className: "hidden"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground",
								children: "GST Certificate (REG-06)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "3-page GST registration"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 flex items-center justify-between",
								children: [gstDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Ready"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActivePreviewUrl(gstDoc),
										className: "text-gray-500 hover:text-foreground",
										title: "Preview",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-amber-600",
									children: "Pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-primary font-bold hover:underline",
										children: "Replace"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*,application/pdf",
										onChange: (e) => handleUpload(e, setGstDoc),
										className: "hidden"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground",
								children: "Cancelled Cheque"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "With printed name & IFSC"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 flex items-center justify-between",
								children: [chequeDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-bold text-emerald-600 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Ready"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActivePreviewUrl(chequeDoc),
										className: "text-gray-500 hover:text-foreground",
										title: "Preview",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-amber-600",
									children: "Pending"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-primary font-bold hover:underline",
										children: "Replace"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*,application/pdf",
										onChange: (e) => handleUpload(e, setChequeDoc),
										className: "hidden"
									})]
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-bold text-foreground",
					children: "2. Application Review Summary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), "Account Representative"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onEditStep(1),
									className: "text-xs text-primary font-bold hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3 w-3" }), " Edit"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs space-y-1 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Name:"
										}),
										" ",
										ob.account.fullName
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Mobile:"
										}),
										" +91 ",
										ob.account.mobile
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Email:"
										}),
										" ",
										ob.account.email
									] })
								]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), "Tax & Legal Identity"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onEditStep(2),
									className: "text-xs text-primary font-bold hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3 w-3" }), " Edit"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs space-y-1 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "GSTIN:"
										}),
										" ",
										ob.tax.gstExempt ? "Exempt Seller" : ob.tax.gstin
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Entity:"
										}),
										" ",
										ob.tax.legalName
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "PAN:"
										}),
										" ",
										ob.tax.pan
									] })
								]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), "Store & Catalog"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onEditStep(3),
									className: "text-xs text-primary font-bold hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3 w-3" }), " Edit"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs space-y-1 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Store Name:"
										}),
										" ",
										ob.store.storeName
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Slug:"
										}),
										" /store/",
										ob.store.slug
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Categories:"
										}),
										" ",
										ob.store.categories?.slice(0, 3).join(", ")
									] })
								]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), "Pickup & Settlements"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onEditStep(4),
									className: "text-xs text-primary font-bold hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3 w-3" }), " Edit"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs space-y-1 text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Hub:"
										}),
										" ",
										ob.shipping.pickupAddress?.city,
										" ",
										"(",
										ob.shipping.pickupAddress?.pincode,
										")"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Prep:"
										}),
										" ",
										ob.shipping.handlingTimeMins,
										" mins"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Bank A/C:"
										}),
										" ",
										ob.bank.maskedAccountNumber || "Masked A/C"
									] })
								]
							})] })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "pt-4 border-t border-border space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-bold text-foreground",
						children: "3. Digital Agreement & Declaration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: agreementChecked,
								onChange: (e) => setAgreementChecked(e.target.checked),
								className: "mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "leading-relaxed",
								children: [
									"I solemnly affirm and declare that the tax registrations, banking details, and statutory documentation provided are genuine, unaltered, and belonging to the named business entity. I agree to RiderzPro's",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold underline",
										children: "Platform Terms of Service"
									}),
									",",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold underline",
										children: "Hazardous EV Parts Fulfillment Policy"
									}),
									", and",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground font-semibold underline",
										children: "Settlement SLA"
									}),
									"."
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-semibold text-muted-foreground mb-1",
								children: "Authorized Signatory Name (Typed Signature)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: signatureName,
								onChange: (e) => setSignatureName(e.target.value),
								placeholder: "Type your full legal name",
								className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-primary"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-semibold text-muted-foreground mb-1",
								children: "Digital Signing Timestamp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-muted px-3 py-2 text-xs font-mono text-muted-foreground",
								children: (/* @__PURE__ */ new Date()).toLocaleString("en-IN")
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onBack,
							className: "flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Submit Application for Verification" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})]
					})
				]
			}),
			activePreviewUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-xl w-full bg-white rounded-2xl p-4 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center pb-2 border-b border-border mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold",
							children: "Document Preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActivePreviewUrl(null),
							className: "text-xs font-bold text-primary hover:underline",
							children: "Close ✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: activePreviewUrl,
						alt: "KYC Document",
						className: "w-full max-h-[60vh] object-contain rounded-xl bg-gray-50"
					})]
				})
			})
		]
	});
}
function OnboardingScreen() {
	const { vendor, currentVendor } = useVendorAuth();
	const activeVendor = vendor || currentVendor;
	const { updateOnboardingStep, submitOnboarding } = useVendorStore();
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = (0, import_react.useState)(activeVendor?.onboarding?.currentStep || 2);
	const completedSteps = activeVendor?.onboarding?.completedSteps || [1];
	if (!activeVendor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#F5F6F8] p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-gray-900",
					children: "Session Required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500",
					children: "Please sign in or complete registration to continue onboarding."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/vendor/auth",
					className: "inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs",
					children: "Go to Vendor Sign In"
				})
			]
		})
	});
	const handleStepSaveAndNext = (stepNum, stepData) => {
		updateOnboardingStep(activeVendor.id, stepNum, stepData);
		setCurrentStep(Math.min(6, stepNum + 1));
	};
	const handleSubmitAll = () => {
		submitOnboarding(activeVendor.id);
		navigate({ to: "/vendor/pending" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(OnboardingLayout, {
		currentStep,
		completedSteps,
		onSelectStep: (step) => setCurrentStep(step),
		children: [
			currentStep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step1Account, {
				vendor: activeVendor,
				onNext: () => setCurrentStep(2)
			}),
			currentStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step2Tax, {
				vendor: activeVendor,
				onBack: () => setCurrentStep(1),
				onSaveAndNext: (data) => handleStepSaveAndNext(2, data)
			}),
			currentStep === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step3Store, {
				vendor: activeVendor,
				onBack: () => setCurrentStep(2),
				onSaveAndNext: (data) => handleStepSaveAndNext(3, data)
			}),
			currentStep === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step4Shipping, {
				vendor: activeVendor,
				onBack: () => setCurrentStep(3),
				onSaveAndNext: (data) => handleStepSaveAndNext(4, data)
			}),
			currentStep === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step5Bank, {
				vendor: activeVendor,
				onBack: () => setCurrentStep(4),
				onSaveAndNext: (data) => handleStepSaveAndNext(5, data)
			}),
			currentStep === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step6DocumentsReview, {
				vendor: activeVendor,
				onBack: () => setCurrentStep(5),
				onEditStep: (step) => setCurrentStep(step),
				onSubmitApplication: handleSubmitAll
			})
		]
	});
}
function VendorOnboardingRouteComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorRouteGuard, {
		allowPending: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingScreen, {})
	});
}
//#endregion
export { VendorOnboardingRouteComponent as component };

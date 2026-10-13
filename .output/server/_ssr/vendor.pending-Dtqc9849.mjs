import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as ShieldCheck, Ft as CircleCheck, Lt as CircleAlert, Nt as CircleX, O as ShieldAlert, an as Ban, jt as Clock, nt as LogOut, u as TriangleAlert, un as ArrowRight } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useVendorStore } from "./vendorStore-jyyPc83P.mjs";
import { n as Logo } from "./bits-BhX7Ijve.mjs";
import { i as useVendorAuth, n as VendorRouteGuard } from "./vendorAuth-DcYgxaTS.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function VendorPendingPage() {
	const { vendor, signOutVendor } = useVendorAuth();
	const { updateOnboardingStep } = useVendorStore();
	const navigate = useNavigate();
	if (!vendor) return null;
	const status = vendor.status;
	const isApproved = status === "approved";
	const isChangesRequested = status === "changes_requested";
	const isRejected = status === "rejected";
	const isSuspended = status === "suspended";
	const isUnderReview = status === "submitted" || status === "under_review";
	const handleFixAndResubmit = () => {
		let targetStep = 2;
		if (vendor.changesRequestedSections?.includes("tax")) targetStep = 2;
		else if (vendor.changesRequestedSections?.includes("store")) targetStep = 3;
		else if (vendor.changesRequestedSections?.includes("shipping")) targetStep = 4;
		else if (vendor.changesRequestedSections?.includes("bank")) targetStep = 5;
		else if (vendor.changesRequestedSections?.includes("documents")) targetStep = 6;
		updateOnboardingStep(vendor.id, targetStep - 1, { currentStep: targetStep });
		navigate({ to: "/vendor/onboarding" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F5F6F8] flex flex-col font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 bg-white border-b border-border shadow-2xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-muted-foreground border-l border-border pl-3 hidden sm:inline",
						children: "Merchant Verification Status"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3 text-xs font-semibold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: signOutVendor,
						className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign Out" })]
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 mx-auto w-full max-w-3xl p-4 sm:p-6 md:p-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card text-center space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl",
							children: [
								isApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10" })
								}),
								isUnderReview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center animate-pulse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-10 w-10" })
								}),
								isChangesRequested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-10 w-10" })
								}),
								isRejected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-10 w-10" })
								}),
								isSuspended && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-10 w-10" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-3xl font-black text-foreground",
							children: [
								isApproved && "Merchant Account Approved!",
								isUnderReview && "Application Under Verification",
								isChangesRequested && "Action Required: Changes Requested",
								isRejected && "Application Not Approved",
								isSuspended && "Merchant Account Suspended"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed",
							children: [
								isApproved && "Your seller account and KYC documents have been fully approved. You can now access your dashboard and publish products to the marketplace.",
								isUnderReview && "Our compliance team is verifying your GSTIN, banking credentials, and representative identity. Expected turnaround is usually 24 to 48 hours.",
								isChangesRequested && "The compliance reviewer requested modifications to your submitted details. Please fix the flagged sections and resubmit.",
								isRejected && "Your application did not meet RiderzPro merchant compliance standards. See reasons below.",
								isSuspended && "Your seller account has been paused by platform administration. Reach out to support."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex flex-wrap items-center justify-center gap-3",
							children: [
								isApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/vendor/dashboard",
									className: "inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-glow hover:brightness-105 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Vendor Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}),
								isChangesRequested && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleFixAndResubmit,
									className: "inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-glow hover:brightness-105 transition cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fix Flagged Sections & Resubmit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}),
								isUnderReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verification SLA: ~24 Hours" })]
								})
							]
						})
					]
				}),
				!isApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs sm:text-sm font-bold text-amber-950",
							children: "Product Catalogue & Operations Locked Until Approval"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-amber-800 leading-relaxed",
							children: "Adding, updating, duplicating, or deleting products, modifying inventory stock levels, and accepting customer orders will automatically unlock once the platform admin approves your KYC credentials."
						})]
					})]
				}),
				(isChangesRequested || isRejected) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-orange-200 bg-orange-50/70 dark:bg-orange-950/20 p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-bold text-orange-900 dark:text-orange-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-orange-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reviewer Feedback & Required Corrections" })]
						}),
						vendor.changesRequestedSections && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-orange-800 dark:text-orange-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "Flagged Sections:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1.5",
								children: vendor.changesRequestedSections.map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-orange-200/80 dark:bg-orange-900/40 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-orange-950 dark:text-orange-100",
									children: sec
								}, sec))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-orange-900 dark:text-orange-200 leading-relaxed font-medium bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-orange-200/60",
							children: [
								"\"",
								vendor.changesRequestedNotes || vendor.rejectionReason || "Please re-upload clear copies of required documents.",
								"\""
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Application Verification Timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border",
						children: vendor.auditTimeline?.map((evt, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary shadow-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground",
											children: evt.action
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: new Date(evt.timestamp).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground mt-0.5",
										children: [
											"By ",
											evt.actor,
											" (",
											evt.actorRole,
											")"
										]
									}),
									evt.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg",
										children: evt.notes
									})
								]
							})]
						}, evt.id || idx))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold text-foreground",
						children: "Submitted Profile Snapshot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Store Display Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-foreground mt-0.5",
									children: vendor.storeName
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "GST Identification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-foreground mt-0.5 font-mono",
									children: vendor.onboarding.tax.gstExempt ? "Exempt Seller" : vendor.onboarding.tax.gstin
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Pickup Hub Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-bold text-foreground mt-0.5",
									children: [
										vendor.onboarding.shipping.pickupAddress?.city,
										" (PIN:",
										" ",
										vendor.onboarding.shipping.pickupAddress?.pincode,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl border border-border bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Settlement Bank"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-bold text-foreground mt-0.5 font-mono",
									children: [
										vendor.onboarding.bank.maskedAccountNumber || "Masked A/C",
										" (",
										vendor.onboarding.bank.bankName,
										")"
									]
								})]
							})
						]
					})]
				})
			]
		})]
	});
}
function VendorPendingRouteComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorRouteGuard, {
		allowPending: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorPendingPage, {})
	});
}
//#endregion
export { VendorPendingRouteComponent as component };

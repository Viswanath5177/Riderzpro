import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Plus, D as ShieldCheck, Ft as CircleCheck, Lt as CircleAlert, Ot as CreditCard, Y as Minus, et as MapPin, g as Store, in as Banknote, jt as Clock, l as Truck, m as Tag, rt as Lock, un as ArrowRight, w as ShoppingCart, x as Smartphone } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as inr, h as getVendor, m as getProduct } from "./data-C7OlInRR.mjs";
import { o as quoteCart, s as useStore } from "./bits-BhX7Ijve.mjs";
import { n as useAuth } from "./auth-ga-2flKS.mjs";
import { t as SiteLayout } from "./SiteLayout-Bzq_a5Ga.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CiFVeJP4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { cart, setQty, placeOrderWithOptions, userProfile, inventoryStock } = useStore();
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("UPI");
	const [couponInput, setCouponInput] = (0, import_react.useState)("EVSAFE");
	const [appliedCoupon, setAppliedCoupon] = (0, import_react.useState)({
		code: "EVSAFE",
		discount: 500
	});
	const [couponError, setCouponError] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [confirmedOrder, setConfirmedOrder] = (0, import_react.useState)(null);
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-[#E31E24] shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 font-display text-2xl sm:text-3xl font-extrabold text-[#111111]",
				children: "Sign in to view orders & tracking"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[#6B7280]",
				children: "Please sign in to access your orders, live courier dispatch milestones, and tax invoices."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					search: { redirect: "/dashboard/customer?tab=orders" },
					className: "inline-flex items-center justify-center rounded-lg bg-[#E31E24] px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-red-700 transition",
					children: "Sign In to Continue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#111111] hover:bg-gray-50 transition",
					children: "Back to Storefront"
				})]
			})
		]
	}) });
	const [address, setAddress] = (0, import_react.useState)(() => {
		const selectedAddr = userProfile.addresses?.find((a) => a.id === userProfile.selectedAddressId) || userProfile.addresses?.[0];
		return {
			name: userProfile.name || selectedAddr?.name || "",
			phone: userProfile.phone || selectedAddr?.phone || "",
			street: selectedAddr?.street || userProfile.address || "",
			city: selectedAddr?.city || userProfile.city || "",
			state: "Karnataka",
			pincode: selectedAddr?.pincode || ""
		};
	});
	const [isEditingAddress, setIsEditingAddress] = (0, import_react.useState)(false);
	const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
	const quote = quoteCart(cart, discountAmount);
	const stockErrors = [];
	cart.forEach((item) => {
		const product = getProduct(item.productId);
		const available = inventoryStock[item.productId] ?? 10;
		if (item.qty > available) stockErrors.push(`${product?.name || item.productId} exceeds available stock (${available} units left).`);
	});
	const handleApplyCoupon = (e) => {
		e.preventDefault();
		setCouponError("");
		const code = couponInput.trim().toUpperCase();
		if (code === "EVSAFE") {
			setAppliedCoupon({
				code: "EVSAFE",
				discount: 500
			});
			toast.success("Coupon EVSAFE applied! ₹500 discount added.");
		} else if (code === "RIDER10") {
			const disc = Math.round(quote.itemsTotal * .1);
			setAppliedCoupon({
				code: "RIDER10",
				discount: disc
			});
			toast.success(`Coupon RIDER10 applied! ₹${disc} discount added.`);
		} else setCouponError("Invalid coupon code. Try 'EVSAFE' for ₹500 off.");
	};
	const handlePlaceOrder = () => {
		if (!isAuthenticated) {
			toast.info("Please sign in to place your order.");
			navigate({
				to: "/auth",
				search: { redirect: "/cart" }
			});
			return;
		}
		if (stockErrors.length > 0) {
			toast.error("Please adjust quantities to match available inventory.");
			return;
		}
		if (!address.name || !address.phone || !address.street || !address.pincode) {
			toast.error("Please complete your delivery address before placing order.");
			setIsEditingAddress(true);
			return;
		}
		if (isSubmitting) return;
		setIsSubmitting(true);
		setTimeout(() => {
			try {
				const order = placeOrderWithOptions({
					payment: paymentMethod,
					shippingAddress: address,
					couponCode: appliedCoupon?.code,
					discount: appliedCoupon?.discount
				});
				setIsSubmitting(false);
				setConfirmedOrder(order);
				toast.success(`Order ${order.id} placed successfully!`);
			} catch (err) {
				setIsSubmitting(false);
				toast.error("Error processing order. Please try again.");
			}
		}, 600);
	};
	if (confirmedOrder) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-16 text-center animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-4 inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider",
				children: "Order Confirmed & Manifested"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-2 text-3xl sm:text-4xl font-extrabold text-[#111111] font-display",
				children: [
					"Thank you, ",
					confirmedOrder.customerName || "Customer",
					"!"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-[#6B7280]",
				children: [
					"Your order ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono font-bold text-[#111111]",
						children: ["#", confirmedOrder.id]
					}),
					" has been received and scheduled for courier pickup."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 text-left shadow-2xs space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-[#E5E7EB] pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-[#6B7280] uppercase",
							children: "Delivery Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-[#E31E24]",
							children: "Doorstep Fulfillment"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-[#111111] space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: confirmedOrder.shippingAddress?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[#6B7280]",
								children: [
									confirmedOrder.shippingAddress?.street,
									", ",
									confirmedOrder.shippingAddress?.city,
									" - ",
									confirmedOrder.shippingAddress?.pincode
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[#6B7280]",
								children: ["Phone: ", confirmedOrder.shippingAddress?.phone]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-[#E5E7EB] pt-3 flex justify-between items-center text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-[#6B7280]",
							children: [
								"Total Paid (",
								confirmedOrder.payment,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-lg text-[#111111]",
							children: inr(confirmedOrder.total)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/customer",
					className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track in Customer Dashboard" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition",
					children: "Continue Shopping"
				})]
			})
		]
	}) });
	if (cart.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-[#E31E24]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-3xl sm:text-4xl font-extrabold text-[#111111]",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[#6B7280]",
				children: "Browse our catalog of electric bikes, lithium batteries, fast chargers, and verified spare parts."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-6 inline-flex rounded-xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition",
				children: "Shop Electric Bikes & Parts →"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-extrabold text-[#111111] font-display",
					children: "Cart & Checkout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-[#6B7280] mt-0.5",
					children: [
						quote.groups.length,
						" authorized supplier",
						quote.groups.length > 1 ? "s" : "",
						" · Combined consolidated dispatch"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Genuine Fitment Guaranteed" })]
				})]
			}),
			stockErrors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inventory Allocation Warning:" })]
				}), stockErrors.map((err, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["• ", err] }, i))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-[1fr_390px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-[#111111]",
									children: "Doorstep Delivery Address"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsEditingAddress(!isEditingAddress),
								className: "text-xs font-semibold text-[#E31E24] hover:underline cursor-pointer",
								children: isEditingAddress ? "Done" : "Change Address"
							})]
						}), isEditingAddress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-semibold text-gray-700 mb-1",
									children: "Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: address.name,
									onChange: (e) => setAddress({
										...address,
										name: e.target.value
									}),
									className: "w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-semibold text-gray-700 mb-1",
									children: "Contact Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: address.phone,
									onChange: (e) => setAddress({
										...address,
										phone: e.target.value
									}),
									className: "w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-semibold text-gray-700 mb-1",
										children: "Street Address / Landmark"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: address.street,
										onChange: (e) => setAddress({
											...address,
											street: e.target.value
										}),
										className: "w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-semibold text-gray-700 mb-1",
									children: "City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: address.city,
									onChange: (e) => setAddress({
										...address,
										city: e.target.value
									}),
									className: "w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block font-semibold text-gray-700 mb-1",
									children: "Pincode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: address.pincode,
									onChange: (e) => setAddress({
										...address,
										pincode: e.target.value
									}),
									className: "w-full h-9 rounded-lg border border-gray-300 px-3 text-xs"
								})] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex items-start justify-between text-xs text-[#6B7280]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-bold text-[#111111]",
									children: [
										address.name,
										" (",
										address.phone,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5",
									children: [
										address.street,
										", ",
										address.city,
										" - ",
										address.pincode
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }), " Serviceable via Delhivery & Bluedart"]
								})
							] })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: quote.groups.map((g) => {
							const v = getVendor(g.vendorId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4 text-[#E31E24]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-xs text-[#111111]",
												children: v.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-[#6B7280]",
												children: [
													"(",
													v.area,
													")"
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-3 text-xs text-[#6B7280]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5 text-gray-400" }),
												g.km,
												" km · ",
												inr(g.fee)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-gray-400" }),
												"~",
												g.eta,
												" min"
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-[#E5E7EB]",
									children: g.items.map((it) => {
										const p = getProduct(it.productId);
										const availableStock = inventoryStock[it.productId] ?? 10;
										const isStockLow = availableStock <= 3;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 py-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: p.image,
													alt: p.name,
													loading: "lazy",
													width: 70,
													height: 70,
													className: "h-14 w-14 rounded-xl object-cover border border-[#E5E7EB] shrink-0"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-bold text-xs text-[#111111] leading-tight truncate",
														children: p.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-0.5 flex items-center gap-2 text-[11px] text-[#6B7280]",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [inr(it.price), " each"] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
															isStockLow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-amber-600 font-semibold",
																children: [
																	"Only ",
																	availableStock,
																	" left in stock"
																]
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-emerald-600 font-semibold",
																children: [
																	"In Stock (",
																	availableStock,
																	")"
																]
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 rounded-lg border border-[#E5E7EB] p-0.5 bg-gray-50",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															"aria-label": "Decrease",
															onClick: () => setQty(it.productId, g.vendorId, it.qty - 1),
															className: "grid h-6 w-6 place-items-center rounded hover:bg-gray-200 text-gray-600 transition cursor-pointer",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "w-5 text-center text-xs font-bold text-gray-900",
															children: it.qty
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															"aria-label": "Increase",
															onClick: () => setQty(it.productId, g.vendorId, it.qty + 1),
															className: "grid h-6 w-6 place-items-center rounded hover:bg-gray-200 text-gray-600 transition cursor-pointer",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "w-20 text-right font-extrabold text-xs text-[#111111]",
													children: inr(it.price * it.qty)
												})
											]
										}, it.productId);
									})
								})]
							}, g.vendorId);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-[#111111] pb-3 border-b border-[#E5E7EB]",
								children: "Price Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 space-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[#6B7280]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Items Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-semibold text-[#111111]",
											children: inr(quote.itemsTotal)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[#6B7280]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Doorstep Consolidated Logistics" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-semibold text-[#111111]",
											children: inr(quote.deliveryTotal)
										})]
									}),
									appliedCoupon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-emerald-600 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Coupon (",
												appliedCoupon.code,
												")"
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["- ", inr(appliedCoupon.discount)] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[#6B7280]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "GST (18% Statutory EV Tax)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-semibold text-[#111111]",
											children: inr(quote.tax)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-[#E5E7EB] pt-3 flex justify-between font-extrabold text-base text-[#111111]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-[#E31E24]",
											children: inr(quote.total)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-4 border-t border-[#E5E7EB]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleApplyCoupon,
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: couponInput,
											onChange: (e) => setCouponInput(e.target.value),
											placeholder: "Enter Coupon (e.g. EVSAFE)",
											className: "flex-1 h-9 rounded-lg border border-gray-300 px-3 text-xs uppercase font-mono outline-none focus:border-[#E31E24]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "h-9 px-3 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition cursor-pointer",
											children: "Apply"
										})]
									}),
									couponError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-red-600",
										children: couponError
									}),
									appliedCoupon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-emerald-600 font-medium",
										children: ["✓ Promo applied: Save ", inr(appliedCoupon.discount)]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-4 border-t border-[#E5E7EB]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-[#111111] mb-2 uppercase tracking-wider",
									children: "Payment Method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1.5",
									children: [
										["UPI", Smartphone],
										["Card", CreditCard],
										["COD", Banknote]
									].map(([label, IconComp]) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPaymentMethod(label),
											className: `flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${paymentMethod === label ? "border-[#E31E24] bg-red-50 text-[#E31E24]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComp, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
										}, label);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePlaceOrder,
								disabled: isSubmitting || stockErrors.length > 0,
								className: "mt-5 w-full h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50",
								children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Securing Order & Manifesting..." }) : !isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sign in to Checkout · ", inr(quote.total)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Confirm Order · ", inr(quote.total)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified 256-Bit SSL Checkout · No Duplicate Submissions" })]
							})
						]
					})
				})]
			})
		]
	}) });
}
//#endregion
export { CartPage as component };

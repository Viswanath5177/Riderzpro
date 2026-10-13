import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Plus, G as Palette, H as Percent, O as ShieldAlert, Ot as CreditCard, P as Save, k as Settings, l as Truck, tt as Mail } from "../_libs/lucide-react.mjs";
import { t as GlassButton } from "./GlassButton-BkBaQfDX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as GlassInput } from "./GlassInput-CT-MOjp5.mjs";
import { t as GlassSelect } from "./GlassSelect-BzoeLAya.mjs";
import { t as GlassCard } from "./GlassCard-DlgeqlaV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SettingsScreen-CMOdZPlA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SettingsScreen = () => {
	const [activeTab, setActiveTab] = (0, import_react.useState)("general");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [platformName, setPlatformName] = (0, import_react.useState)("Riderzpro Hyperlocal EV");
	const [supportEmail, setSupportEmail] = (0, import_react.useState)("ops@riderzpro.com");
	const [supportPhone, setSupportPhone] = (0, import_react.useState)("+91 80 4910 8888");
	const [maintenanceMode, setMaintenanceMode] = (0, import_react.useState)(false);
	const [cities, setCities] = (0, import_react.useState)([
		{
			name: "Bengaluru",
			active: true,
			radius: 25,
			hubs: 8
		},
		{
			name: "Hyderabad",
			active: true,
			radius: 20,
			hubs: 5
		},
		{
			name: "Chennai",
			active: true,
			radius: 18,
			hubs: 4
		},
		{
			name: "Pune",
			active: true,
			radius: 15,
			hubs: 3
		},
		{
			name: "Mumbai",
			active: true,
			radius: 22,
			hubs: 6
		}
	]);
	const [baseFee, setBaseFee] = (0, import_react.useState)("40");
	const [perKmFee, setPerKmFee] = (0, import_react.useState)("12");
	const [freeDeliveryThreshold, setFreeDeliveryThreshold] = (0, import_react.useState)("999");
	const [maxRadius, setMaxRadius] = (0, import_react.useState)("30");
	const [defaultCommission, setDefaultCommission] = (0, import_react.useState)("12");
	const [batteryCommission, setBatteryCommission] = (0, import_react.useState)("8");
	const [sparePartsGst, setSparePartsGst] = (0, import_react.useState)("18");
	const [evBatteryGst, setEvBatteryGst] = (0, import_react.useState)("5");
	const [panNumber, setPanNumber] = (0, import_react.useState)("AABCR4920F");
	const [gstin, setGstin] = (0, import_react.useState)("29AABCR4920F1ZT");
	const [razorpayEnabled, setRazorpayEnabled] = (0, import_react.useState)(true);
	const [cashfreeEnabled, setCashfreeEnabled] = (0, import_react.useState)(true);
	const [codEnabled, setCodEnabled] = (0, import_react.useState)(false);
	const [settlementCycle, setSettlementCycle] = (0, import_react.useState)("T+1 Days");
	const [orderSmsTemplate, setOrderSmsTemplate] = (0, import_react.useState)("Hi {CUSTOMER_NAME}, your Riderzpro order #{ORDER_ID} for {PRODUCT_NAME} has been dispatched with rider {RIDER_NAME} ({RIDER_PHONE}). Track: {TRACKING_URL}");
	const [kycEmailTemplate, setKycEmailTemplate] = (0, import_react.useState)("Hello {SELLER_NAME}, your EV parts vendor account KYC verification is completed. You are now live on Riderzpro.");
	const [defaultTheme, setDefaultTheme] = (0, import_react.useState)("light");
	const [accentColor, setAccentColor] = (0, import_react.useState)("crimson");
	const [glassIntensity, setGlassIntensity] = (0, import_react.useState)("high");
	const handleSave = () => {
		setSaving(true);
		setTimeout(() => {
			setSaving(false);
			toast.success("Settings saved successfully", { description: "System configurations updated across all nodes" });
		}, 600);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl lg:text-3xl font-extrabold tracking-tight text-[#111111]",
				children: "System Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-[#4B5563] mt-1 font-medium",
				children: "Configure platform policies, dispatch radii, fees, taxation and payment routing."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
					variant: "primary",
					icon: Save,
					loading: saving,
					onClick: handleSave,
					children: "Save All Changes"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-3 lg:col-span-1 h-fit space-y-1 bg-white border-[#E5E7EB]",
				children: [
					{
						id: "general",
						label: "General",
						icon: Settings
					},
					{
						id: "delivery",
						label: "Delivery & Cities",
						icon: Truck
					},
					{
						id: "commission",
						label: "Commission & GST",
						icon: Percent
					},
					{
						id: "payments",
						label: "Payment Gateways",
						icon: CreditCard
					},
					{
						id: "templates",
						label: "Notifications & Templates",
						icon: Mail
					},
					{
						id: "appearance",
						label: "Appearance",
						icon: Palette
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-red-50 text-[#E31E24] border border-[#E31E24]/30 shadow-xs" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-50 border border-transparent"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 ${isActive ? "text-[#E31E24]" : "text-[#6B7280]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-3 space-y-6",
				children: [
					activeTab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-6 bg-white border-[#E5E7EB]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111]",
								children: "Platform Essentials"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#4B5563] mt-0.5",
								children: "General brand identity and emergency control switches."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Platform Name",
										value: platformName,
										onChange: (e) => setPlatformName(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Operations Email",
										type: "email",
										value: supportEmail,
										onChange: (e) => setSupportEmail(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Support Helpline",
										value: supportPhone,
										onChange: (e) => setSupportPhone(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										label: "Primary Timezone",
										value: "Asia/Kolkata",
										options: [{
											value: "Asia/Kolkata",
											label: "Asia/Kolkata (IST +5:30)"
										}],
										onChange: () => {}
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-[#E5E7EB] flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-bold text-[#111111] flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-amber-600" }), "Maintenance Mode"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#4B5563] mt-0.5",
									children: "Temporarily pause public marketplace access for scheduled upgrades."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex items-center cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "sr-only peer",
										checked: maintenanceMode,
										onChange: (e) => setMaintenanceMode(e.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E31E24]" })]
								})]
							})
						]
					}),
					activeTab === "delivery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-6 bg-white border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111]",
								children: "Delivery & Fare Matrix"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#4B5563] mt-0.5",
								children: "Hyperlocal dispatch pricing algorithm for EV spare deliveries."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Base Delivery Fee (₹)",
										type: "number",
										value: baseFee,
										onChange: (e) => setBaseFee(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Per KM Charge (₹)",
										type: "number",
										value: perKmFee,
										onChange: (e) => setPerKmFee(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Free Delivery Above (₹)",
										type: "number",
										value: freeDeliveryThreshold,
										onChange: (e) => setFreeDeliveryThreshold(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Max Dispatch Radius (km)",
										type: "number",
										value: maxRadius,
										onChange: (e) => setMaxRadius(e.target.value)
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-4 bg-white border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-bold text-[#111111]",
									children: "Active Operational Cities"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#4B5563] mt-0.5",
									children: "Enable or adjust maximum geofence radius for supported metro regions."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
									variant: "secondary",
									size: "sm",
									icon: Plus,
									onClick: () => toast.info("Contact dev ops to provision new city node"),
									children: "Add City"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5",
								children: cities.map((city, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-2.5 h-2.5 rounded-full ${city.active ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-neutral-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-bold text-[#111111]",
											children: city.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-[#4B5563] font-medium",
											children: [
												city.hubs,
												" Micro-fulfillment Hubs · Max ",
												city.radius,
												" km radius"
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-[#4B5563] font-semibold",
													children: "Radius:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: city.radius,
													onChange: (e) => {
														const updated = [...cities];
														updated[idx].radius = Number(e.target.value);
														setCities(updated);
													},
													className: "w-16 bg-white border border-[#E5E7EB] rounded-lg px-2 py-1 text-xs text-[#111111] font-bold text-center focus:outline-none focus:border-[#E31E24]"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-[#4B5563] font-semibold",
													children: "km"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "relative inline-flex items-center cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												className: "sr-only peer",
												checked: city.active,
												onChange: (e) => {
													const updated = [...cities];
													updated[idx].active = e.target.checked;
													setCities(updated);
												}
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" })]
										})]
									})]
								}, city.name))
							})]
						})]
					}),
					activeTab === "commission" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-6 bg-white border-[#E5E7EB]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111]",
								children: "Commission Slabs & GST Compliance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#4B5563] mt-0.5",
								children: "Platform take-rate deductions and Indian GST tax brackets."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Standard Seller Commission (%)",
										type: "number",
										value: defaultCommission,
										onChange: (e) => setDefaultCommission(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "High-value Battery Commission (%)",
										type: "number",
										value: batteryCommission,
										onChange: (e) => setBatteryCommission(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Spare Parts GST Rate (%)",
										type: "number",
										value: sparePartsGst,
										onChange: (e) => setSparePartsGst(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "EV Battery Packs GST Rate (%)",
										type: "number",
										value: evBatteryGst,
										onChange: (e) => setEvBatteryGst(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Corporate PAN",
										value: panNumber,
										onChange: (e) => setPanNumber(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
										label: "Registered GSTIN",
										value: gstin,
										onChange: (e) => setGstin(e.target.value)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-bold text-amber-950",
									children: "Tax Compliance Notice:"
								}), " Invoices generated for orders within Karnataka apply CGST 9% + SGST 9%. Interstate dispatches across Maharashtra or Tamil Nadu incur integrated IGST 18%."]
							})
						]
					}),
					activeTab === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-6 bg-white border-[#E5E7EB]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-[#111111]",
							children: "Payment Gateways & Settlement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#4B5563] mt-0.5",
							children: "Configure checkout payment rails, automated escrow and payout intervals."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-[#111111]",
										children: "Razorpay PG & UPI AutoPay"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-[#4B5563] font-medium",
										children: "Primary gateway for Cards, UPI, Netbanking and Cred"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "relative inline-flex items-center cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "sr-only peer",
											checked: razorpayEnabled,
											onChange: (e) => setRazorpayEnabled(e.target.checked)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-[#111111]",
										children: "Cashfree Payouts API"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-[#4B5563] font-medium",
										children: "Automated instant IMPS/NEFT transfers to sellers and riders"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "relative inline-flex items-center cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "sr-only peer",
											checked: cashfreeEnabled,
											onChange: (e) => setCashfreeEnabled(e.target.checked)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-gray-50/70 border border-[#E5E7EB] flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-[#111111]",
										children: "Cash on Delivery (COD)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-[#4B5563] font-medium",
										children: "Restricted to orders under ₹3,000 to minimize return friction"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "relative inline-flex items-center cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "sr-only peer",
											checked: codEnabled,
											onChange: (e) => setCodEnabled(e.target.checked)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										label: "Vendor Payout Settlement Schedule",
										value: settlementCycle,
										options: [
											{
												value: "Instant",
												label: "Instant (Upon Delivery Confirmed)"
											},
											{
												value: "T+1 Days",
												label: "T+1 Business Days (Recommended)"
											},
											{
												value: "T+3 Days",
												label: "T+3 Business Days"
											},
											{
												value: "Weekly",
												label: "Weekly Batch Settlement"
											}
										],
										onChange: (e) => setSettlementCycle(e.target.value)
									})
								})
							]
						})]
					}),
					activeTab === "templates" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-6 bg-white border-[#E5E7EB]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-[#111111]",
							children: "Automated Messaging Templates"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#4B5563] mt-0.5",
							children: "DLT approved SMS headers and automated customer notification content."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-[#374151] mb-1.5 uppercase",
									children: "Order Dispatch SMS (DLT Header: RZPRO)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: orderSmsTemplate,
									onChange: (e) => setOrderSmsTemplate(e.target.value),
									className: "w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E31E24] font-mono leading-relaxed shadow-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-[#6B7280]",
									children: [
										"Variables: ",
										"{CUSTOMER_NAME}",
										", ",
										"{ORDER_ID}",
										",",
										" ",
										"{PRODUCT_NAME}",
										", ",
										"{RIDER_NAME}",
										", ",
										"{RIDER_PHONE}",
										",",
										" ",
										"{TRACKING_URL}"
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-[#374151] mb-1.5 uppercase",
									children: "Seller KYC Approval Notification Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: kycEmailTemplate,
									onChange: (e) => setKycEmailTemplate(e.target.value),
									className: "w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E31E24] font-mono leading-relaxed shadow-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-[#6B7280]",
									children: [
										"Variables: ",
										"{SELLER_NAME}",
										", ",
										"{COMMISSION_RATE}"
									]
								})
							] })]
						})]
					}),
					activeTab === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-6 bg-white border-[#E5E7EB]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111]",
								children: "Console UI & Brand Preferences"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#4B5563] mt-0.5",
								children: "Fine-tune brand accents and contrast ratios."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										label: "Default Theme",
										value: defaultTheme,
										options: [{
											value: "light",
											label: "Riderzpro Crisp White (Active)"
										}, {
											value: "dark",
											label: "Dark Glass Console"
										}],
										onChange: (e) => setDefaultTheme(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										label: "Accent Color Palette",
										value: accentColor,
										options: [
											{
												value: "crimson",
												label: "Riderzpro Red (#E31E24)"
											},
											{
												value: "orange",
												label: "Hyper Electric Orange"
											},
											{
												value: "violet",
												label: "Cyber Violet"
											}
										],
										onChange: (e) => setAccentColor(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassSelect, {
										label: "Card Surface Elevation",
										value: glassIntensity,
										options: [
											{
												value: "high",
												label: "High Definition Clean Border"
											},
											{
												value: "medium",
												label: "Subtle Shadow Frost"
											},
											{
												value: "low",
												label: "Flat Minimal"
											}
										],
										onChange: (e) => setGlassIntensity(e.target.value)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-[#E5E7EB] bg-gray-50/70 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold text-[#111111]",
									children: "Reduced Motion Mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#4B5563]",
									children: "Honors system accessibility setting by disabling background animations."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-white border border-[#E5E7EB] text-[#374151]",
									children: "Auto-detected"
								})]
							})
						]
					})
				]
			})]
		})]
	});
};
//#endregion
export { SettingsScreen };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as Save, Bt as Calendar, C as ShieldCheck, F as Plus, Ft as ChevronDown, G as Mic, H as Navigation, Ht as Building2, I as Phone, It as Check, J as Menu, Kt as Bike, Lt as CheckCheck, N as Receipt, Nt as ChevronRight, O as Search, Ot as CircleCheck, P as Radio, Pt as ChevronLeft, St as Copy, Ut as Briefcase, V as Package, X as Mail, Y as MapPin, Z as LogOut, _t as Eye, a as User, at as Info, b as ShoppingCart, bt as Download, c as Truck, ct as House, et as LifeBuoy, ft as Gift, g as Sparkles, k as ScanLine, kt as CircleCheckBig, l as TriangleAlert, lt as Heart, n as X, qt as Bell, r as Wrench, s as UserCog, t as Zap, tt as LayoutGrid, u as Trash2, wt as Clock, x as ShoppingBag, y as SlidersHorizontal, yt as ExternalLink, z as PenLine } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as scooter_default, S as riders, _ as getVendor, a as ORDER_STEPS, b as products, c as bestOffer, g as getProduct, h as getBike, i as Logo, l as bikes, o as ProductCard, u as decodeVin, w as useStore, y as inr } from "./bits-6XfYm-PF.mjs";
import { n as useAuth } from "./auth-ga-2flKS.mjs";
import { t as LiveMap } from "./LiveMap-Df7tahlg.mjs";
import { t as ProtectedRoute } from "./ProtectedRoute-Gkr3f-cO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.customer-BrvHChFI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VinSearchModal({ isOpen, onClose, onViewInGarage }) {
	const { addToCart, toggleSaved, isSaved, addBike, garage } = useStore();
	const [vin, setVin] = (0, import_react.useState)("P6R1S1PR2PN000001");
	const decodedResult = (0, import_react.useMemo)(() => {
		if (!vin.trim()) return null;
		return decodeVin(vin);
	}, [vin]);
	const decodedBike = decodedResult?.ok && decodedResult.bike ? decodedResult.bike : null;
	const compatibleParts = (0, import_react.useMemo)(() => {
		if (!decodedBike) return [];
		return products.filter((p) => p.fits.includes(decodedBike.id));
	}, [decodedBike]);
	if (!isOpen) return null;
	const samples = [
		{
			label: "Ola S1 Pro",
			vin: "P6R1S1PR2PN000001"
		},
		{
			label: "Ather 450X",
			vin: "MD9A450XAN1234567"
		},
		{
			label: "TVS iQube",
			vin: "MD6IQUBESN1234567"
		},
		{
			label: "Revolt RV400",
			vin: "MCRV400XXN1234567"
		},
		{
			label: "Bajaj Chetak",
			vin: "MD2CHETAKN1234567"
		}
	];
	const isBikeInGarage = decodedBike ? garage.some((g) => g.bikeId === decodedBike.id) : false;
	const handleAddBikeToGarage = () => {
		if (!decodedBike) return;
		addBike({
			bikeId: decodedBike.id,
			year: decodedResult?.year || 2024,
			vin: vin.toUpperCase(),
			regNo: "KA 01 EV 9900",
			nickname: `${decodedBike.make} ${decodedBike.model}`,
			odoKm: 5e3,
			batteryHealth: 99,
			nextServiceDays: 60
		});
		toast.success(`${decodedBike.make} ${decodedBike.model} added to your garage!`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-xs pt-12 sm:pt-20 px-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-3xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F7F9FB]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white shadow-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-gray-900 font-display",
							children: "Search Compatible Items by VIN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Enter your 17-digit chassis/VIN number to see only parts verified to fit your EV."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 border-b border-gray-100 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									type: "text",
									value: vin,
									onChange: (e) => setVin(e.target.value.toUpperCase()),
									maxLength: 17,
									placeholder: "Enter 17-digit VIN (e.g. P6R1S1PR2PN000001)",
									className: "w-full h-12 rounded-2xl border border-gray-300 bg-white px-4 font-mono text-sm tracking-wider uppercase text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute right-4 top-3.5 text-xs text-gray-400 font-mono",
									children: [vin.length, "/17"]
								})]
							}), vin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setVin(""),
								className: "px-3 h-12 rounded-2xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-xs font-semibold",
								children: "Clear"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-gray-700",
								children: "Quick Test VINs:"
							}), samples.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setVin(s.vin),
								className: `px-2.5 py-1 rounded-lg border text-xs transition ${vin === s.vin ? "bg-primary text-white border-primary font-bold" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}`,
								children: s.label
							}, s.label))]
						}),
						decodedBike && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-gray-900 font-display",
										children: [
											decodedBike.make,
											" ",
											decodedBike.model,
											" (",
											decodedResult?.year || 2023,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-bold",
										children: [decodedBike.voltage, "V DC Architecture"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-emerald-700 mt-0.5",
									children: ["Chassis verified · Found ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [compatibleParts.length, " verified compatible parts"] })]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: !isBikeInGarage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleAddBikeToGarage,
									className: "px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-emerald-600 transition",
									children: "+ Add to My Garage"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " In Your Garage"]
								})
							})]
						}),
						decodedResult && !decodedResult.ok && vin.length === 17 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs",
							children: decodedResult.error || "VIN not recognized. Please check your RC book or pick manually."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 overflow-y-auto flex-1 space-y-4",
					children: !decodedBike ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-12 text-center text-xs text-gray-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-10 w-10 text-gray-300 mx-auto mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-gray-700",
								children: "Enter a 17-digit VIN to view matching parts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-400 mt-0.5 max-w-sm mx-auto",
								children: "Try clicking any of the test VIN buttons above for Ather, Ola, TVS, Revolt or Bajaj."
							})
						]
					}) : compatibleParts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-xs text-gray-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-gray-700",
							children: "No compatible parts found for this specific VIN."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold text-gray-400 uppercase tracking-wider",
							children: [
								"Compatible Spares & Accessories (",
								compatibleParts.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: compatibleParts.map((p) => {
								const offer = p.offers[0];
								const saved = isSaved(p.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm transition flex gap-3.5 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.image,
										alt: p.name,
										className: "h-20 w-20 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0 flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded",
													children: ["✓ Fits ", decodedBike.model]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														toggleSaved(p.id);
														toast.success(saved ? "Removed from saved" : "Saved to wishlist");
													},
													className: "text-gray-400 hover:text-rose-500 transition",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${saved ? "fill-rose-500 text-rose-500" : ""}` })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-gray-900 group-hover:text-primary transition line-clamp-1 mt-1",
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-gray-500",
												children: [
													p.category,
													" · ",
													p.brand,
													" · ",
													p.warrantyMonths,
													"m warranty"
												]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-extrabold text-gray-900",
												children: inr(offer.price)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													addToCart(p.id, offer.vendorId);
													toast.success(`${p.name} added to cart`);
												},
												className: "px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition",
												children: "+ Add"
											})]
										})]
									})]
								}, p.id);
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gray-500",
						children: decodedBike ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["All shown parts are 100% verified for ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
							decodedBike.make,
							" ",
							decodedBike.model
						] })] }) : "RiderzPro 100% Fitment Verification Engine"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition",
						children: "Close"
					})]
				})
			]
		})
	});
}
function CustomerLayout({ activeTab, onTabChange, children, onOpenBookingModal }) {
	const { userProfile, garage, orders, savedProductIds, serviceBookings, notifications, cart } = useStore();
	const { user: authUser, signOut } = useAuth();
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = (0, import_react.useState)(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
	const [isSearchOpen, setIsSearchOpen] = (0, import_react.useState)(false);
	const [isVinSearchOpen, setIsVinSearchOpen] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isProfileOpen, setIsProfileOpen] = (0, import_react.useState)(false);
	const cartCount = cart.reduce((s, c) => s + c.qty, 0);
	const liveOrder = orders.find((o) => o.status < 5);
	const upcomingServicesCount = serviceBookings.filter((s) => s.status === "Confirmed" || s.status === "In progress").length;
	const filteredSearchResults = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase();
		return products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
	}, [searchQuery]);
	const navItems = [
		{
			id: "overview",
			label: "Overview",
			Icon: LayoutGrid
		},
		{
			id: "shop",
			label: "Shop Bikes & Parts",
			Icon: ShoppingBag
		},
		{
			id: "orders",
			label: "My Orders",
			Icon: Package,
			badge: orders.length > 0 ? `${orders.length}` : void 0
		},
		{
			id: "tracking",
			label: "Track Delivery",
			Icon: Truck,
			badge: liveOrder ? "Live" : void 0,
			badgeColor: "bg-[#E31E24] text-white"
		},
		{
			id: "garage",
			label: "My Garage",
			Icon: Bike,
			badge: `${garage.length}`
		},
		{
			id: "service",
			label: "Service & Maintenance",
			Icon: Wrench,
			badge: upcomingServicesCount > 0 ? `${upcomingServicesCount} Due` : void 0,
			badgeColor: "bg-blue-600 text-white"
		},
		{
			id: "invoices",
			label: "Payments & Invoices",
			Icon: Receipt
		},
		{
			id: "settings",
			label: "Profile & Addresses",
			Icon: UserCog
		},
		{
			id: "support",
			label: "Help & Support",
			Icon: LifeBuoy
		}
	];
	const handleNavClick = (tabId) => {
		onTabChange(tabId);
		setIsMobileMenuOpen(false);
	};
	const getBreadcrumbTitle = () => {
		switch (activeTab) {
			case "overview": return "Dashboard Overview";
			case "shop": return "Shop Bikes & Parts";
			case "garage": return "My Registered EV Garage";
			case "orders": return "My Orders";
			case "tracking": return "Track Delivery & Courier Shipments";
			case "saved": return "Saved Items & Wishlist";
			case "service": return "Service & Doorstep Maintenance";
			case "addresses": return "Saved Delivery Addresses";
			case "invoices": return "Payments, Tax Invoices & Receipts";
			case "notifications": return "Notifications & Alerts";
			case "settings": return "Profile & Preferences";
			case "support": return "Help & Dedicated Support";
			default: return "Customer Dashboard";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F7F9FB] text-[#111827] flex flex-col antialiased",
		children: [
			isSearchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs pt-20 px-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center px-5 py-4 border-b border-gray-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-gray-400 mr-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search EV batteries, chargers, brake rotors, BMS boards...",
								className: "flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setIsSearchOpen(false);
									setSearchQuery("");
								},
								className: "p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[380px] overflow-y-auto p-4",
						children: searchQuery.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-8 text-center text-sm text-gray-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-gray-700 mb-1",
									children: "Quick Search Categories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap justify-center gap-2 mt-3",
									children: [
										"60V Li-ion Battery",
										"Fast Chargers",
										"Brembo Disc Rotor",
										"Smart BMS",
										"Ather 450X Parts",
										"Ola S1 Pro"
									].map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSearchQuery(tag),
										className: "px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-primary/10 hover:text-primary transition",
										children: tag
									}, tag))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setIsSearchOpen(false);
										setIsVinSearchOpen(true);
									},
									className: "mt-5 w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between hover:bg-emerald-100 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Know your 17-digit VIN? Search verified parts directly by VIN" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-primary text-white px-2 py-0.5 rounded-md font-bold",
										children: "VIN Lookup →"
									})]
								})
							]
						}) : filteredSearchResults.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-10 text-center text-sm text-gray-500",
							children: [
								"No parts found matching “",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-gray-800",
									children: searchQuery
								}),
								"”."
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold text-gray-400 uppercase tracking-wider px-2",
								children: [
									"Found ",
									filteredSearchResults.length,
									" matching items"
								]
							}), filteredSearchResults.map((prod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/product/$id",
								params: { id: prod.id },
								onClick: () => setIsSearchOpen(false),
								className: "flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: prod.image,
										alt: prod.name,
										className: "h-12 w-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-gray-900 group-hover:text-primary truncate transition",
											children: prod.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-gray-500",
											children: [
												prod.category,
												" · ",
												prod.brand,
												" · Fits ",
												prod.fits.length,
												" EV models"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold text-gray-900",
											children: inr(prod.offers[0].price)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-medium text-primary",
											children: "View →"
										})]
									})
								]
							}, prod.id))]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 min-h-screen bg-[#F6F8FB] bg-[radial-gradient(circle_at_0%_0%,rgba(227,30,36,0.06),transparent_45%),radial-gradient(circle_at_0%_100%,rgba(37,99,235,0.05),transparent_45%),radial-gradient(circle_at_100%_0%,rgba(249,115,22,0.03),transparent_45%)] relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("hidden md:flex flex-col sticky top-0 h-screen shrink-0 z-30 select-none", "bg-white/65 backdrop-blur-3xl backdrop-saturate-200 border-r border-slate-200/80 shadow-[2px_0_20px_rgba(15,23,42,0.03)] transition-all duration-300", isCollapsed ? "w-20" : "w-64"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-18 shrink-0 flex items-center justify-center px-4 border-b border-slate-200/70 bg-white/50 backdrop-blur-md",
						children: [!isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
								className: "justify-center",
								imgClassName: "h-9 w-auto"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white font-bold text-lg shadow-sm",
								children: "R"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsCollapsed(!isCollapsed),
							"aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar",
							className: cn("hidden lg:grid h-7 w-7 place-items-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white hover:border hover:border-slate-200 hover:shadow-2xs transition-all duration-150 absolute top-1/2 -translate-y-1/2 cursor-pointer", isCollapsed ? "right-1.5" : "right-3"),
							children: isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 overflow-y-auto px-3 py-4 space-y-1.5",
						children: navItems.map((item) => {
							const isActive = activeTab === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleNavClick(item.id),
								className: cn("group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ease-out cursor-pointer select-none", isActive ? "bg-red-500/10 text-[#E31E24] font-bold border border-red-500/25 shadow-xs backdrop-blur-md" : "text-slate-600 border border-transparent hover:bg-white hover:text-slate-950 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-slate-200/80 active:scale-[0.98]", isCollapsed && "justify-center px-0"),
								title: isCollapsed ? item.label : void 0,
								children: [
									isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute left-1.5 top-2.5 bottom-2.5 w-1.25 rounded-full bg-[#E31E24] shadow-[0_0_8px_rgba(227,30,36,0.6)] animate-in fade-in duration-200", isCollapsed && "left-1") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.Icon, { className: cn("h-4 w-4 shrink-0 transition-all duration-150 ease-out", isActive ? "text-[#E31E24] scale-110 drop-shadow-xs" : "text-slate-500 group-hover:text-[#E31E24] group-hover:scale-110") }),
									!isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex-1 text-left flex items-center justify-between min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("truncate transition-all duration-150", isActive ? "font-bold text-[#E31E24]" : "font-medium group-hover:text-slate-950 group-hover:translate-x-0.5 group-hover:font-semibold"),
											children: item.label
										}), item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shrink-0 transition-all duration-150", isActive ? "bg-[#E31E24]/15 text-[#E31E24] border border-[#E31E24]/25 shadow-2xs" : item.badgeColor || "bg-slate-100 text-slate-700 border border-slate-200/70 group-hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-2xs"),
											children: item.badge
										})]
									})
								]
							}, item.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col min-w-0 min-h-screen",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 h-16 sm:h-18 bg-white/85 backdrop-blur-xl border-b border-gray-200/80 px-3.5 sm:px-6 md:px-8 flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsMobileMenuOpen(true),
										className: "md:hidden p-1.5 -ml-1 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition cursor-pointer",
										"aria-label": "Open navigation menu",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5.5 w-5.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "md:hidden flex items-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { imgClassName: "h-7 w-auto" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden md:block min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs text-gray-500 font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer Portal" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-900 font-semibold truncate",
													children: getBreadcrumbTitle()
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
											className: "text-base font-bold text-gray-900 leading-tight",
											children: ["Welcome back", userProfile?.name?.trim() ? `, ${userProfile.name.trim().split(" ")[0]}` : ""]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 max-w-md hidden md:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsSearchOpen(true),
									className: "w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#F5F6F8] hover:bg-white text-sm text-gray-700 transition shadow-2xs group border border-[#E5E7EB] hover:border-gray-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-gray-500 group-hover:text-primary transition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-gray-600 font-medium",
											children: "Search EV batteries, chargers, fitments..."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-gray-600 bg-white border border-[#E5E7EB] rounded-full shadow-2xs",
										children: "⌘K"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 sm:gap-2.5 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setIsVinSearchOpen(true),
										className: "hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white hover:border-[#E31E24] hover:text-[#E31E24] text-xs font-semibold text-[#111111] transition active:scale-95 shadow-2xs",
										title: "Search items based on 17-digit VIN number",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search by VIN" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsSearchOpen(true),
										className: "md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition",
										"aria-label": "Search products",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/assistant",
										className: "hidden sm:flex group items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24] transition shadow-2xs active:scale-95",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5 text-primary transition group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Voice" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => onTabChange("orders"),
										id: "dashboard-header-cart-btn",
										"aria-label": "Shopping Cart and Orders",
										className: cn("relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition shadow-2xs active:scale-95 cursor-pointer", activeTab === "orders" ? "border-[#E31E24] bg-red-50 text-[#E31E24]" : "border-[#E5E7EB] bg-white text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24]"),
										title: "View Orders & Delivery Tracking",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-[#E31E24]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: "Cart"
											}),
											(orders.length > 0 || cartCount > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#E31E24] px-1 text-[10px] font-bold text-white leading-none",
												children: orders.length || cartCount
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setIsProfileOpen(!isProfileOpen),
											className: "flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer",
											"aria-label": "Account menu",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-9 w-9 place-items-center rounded-full bg-primary text-white font-bold text-xs shadow-xs",
												children: (authUser?.name || userProfile?.name || "CP").trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
											})
										}), isProfileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-gray-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "px-3 py-2.5 border-b border-gray-100",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-bold text-gray-900 truncate",
															children: authUser?.name || userProfile?.name || "Customer Account"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs text-gray-500 truncate",
															children: authUser?.email || userProfile?.email || ""
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ProPoints Loyalty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-bold",
																children: [userProfile?.points || 0, " pts"]
															})]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1 space-y-0.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => {
																setIsProfileOpen(false);
																onTabChange("garage");
															},
															className: "w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manage My Garage" })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => {
																setIsProfileOpen(false);
																onTabChange("orders");
															},
															className: "w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Orders" })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => {
																setIsProfileOpen(false);
																onTabChange("settings");
															},
															className: "w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profile & Delivery Addresses" })]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "pt-1 border-t border-gray-100",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: async () => {
															setIsProfileOpen(false);
															await signOut();
															toast.success("Signed out successfully", { description: "You have been logged out of your customer account." });
															navigate({ to: "/" });
														},
														className: "w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })]
													})
												})
											]
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-28 md:pb-8",
						children
					})]
				})]
			}),
			isMobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex md:hidden bg-black/40 backdrop-blur-sm animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-72 bg-white/90 backdrop-blur-2xl backdrop-saturate-180 h-full flex flex-col p-5 shadow-2xl border-r border-white/60 animate-in slide-in-from-left duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-center pb-4 border-b border-slate-200/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
							className: "justify-center",
							imgClassName: "h-8.5 w-auto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsMobileMenuOpen(false),
							className: "absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/80 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 overflow-y-auto py-4 space-y-1.5",
						children: navItems.map((item) => {
							const isActive = activeTab === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleNavClick(item.id),
								className: cn("group relative flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ease-out", isActive ? "bg-red-500/10 text-[#E31E24] font-bold border border-red-500/20 shadow-xs" : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-2xs"),
								children: [
									isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1.5 top-2 bottom-2 w-1 rounded-full bg-[#E31E24] shadow-[0_0_8px_rgba(227,30,36,0.6)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.Icon, { className: cn("h-4 w-4 shrink-0 transition", isActive ? "text-[#E31E24]" : "text-slate-500") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn(isActive && "pl-1.5"),
											children: item.label
										})]
									}),
									item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("px-2 py-0.5 rounded-full text-[10px] font-bold", isActive ? "bg-[#E31E24]/15 text-[#E31E24] border border-[#E31E24]/20" : item.badgeColor || "bg-slate-100 text-slate-700"),
										children: item.badge
									})
								]
							}, item.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-2 py-2 flex items-center justify-around md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("overview"),
						className: cn("flex flex-1 flex-col items-center gap-0.5 py-1 text-xs font-bold transition active:scale-95 cursor-pointer", activeTab === "overview" ? "text-[#E31E24]" : "text-gray-500 hover:text-gray-900"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: cn("h-5 w-5", activeTab === "overview" ? "stroke-[2.5]" : "stroke-[1.75]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("shop"),
						className: cn("flex flex-1 flex-col items-center gap-0.5 py-1 text-xs font-bold transition active:scale-95 cursor-pointer", activeTab === "shop" ? "text-[#E31E24]" : "text-gray-500 hover:text-gray-900"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: cn("h-5 w-5", activeTab === "shop" ? "stroke-[2.5]" : "stroke-[1.75]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("garage"),
						className: cn("flex flex-1 flex-col items-center gap-0.5 py-1 text-xs font-bold transition active:scale-95 cursor-pointer", activeTab === "garage" ? "text-[#E31E24]" : "text-gray-500 hover:text-gray-900"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: cn("h-5 w-5", activeTab === "garage" ? "stroke-[2.5]" : "stroke-[1.75]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Garage" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("orders"),
						className: cn("flex flex-1 flex-col items-center gap-0.5 py-1 text-xs font-bold transition active:scale-95 cursor-pointer relative", activeTab === "orders" ? "text-[#E31E24]" : "text-gray-500 hover:text-gray-900"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: cn("h-5 w-5", activeTab === "orders" ? "stroke-[2.5]" : "stroke-[1.75]") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Orders" }),
							orders.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-[28%] h-2 w-2 rounded-full bg-[#E31E24]" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("settings"),
						className: cn("flex flex-1 flex-col items-center gap-0.5 py-1 text-xs font-bold transition active:scale-95 cursor-pointer", activeTab === "settings" ? "text-[#E31E24]" : "text-gray-500 hover:text-gray-900"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: cn("h-5 w-5", activeTab === "settings" ? "stroke-[2.5]" : "stroke-[1.75]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Account" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VinSearchModal, {
				isOpen: isVinSearchOpen,
				onClose: () => setIsVinSearchOpen(false)
			})
		]
	});
}
function OverviewTab({ onTabChange, onOpenBookingModal, onOpenAddBikeModal }) {
	const { userProfile, garage, activeBikeId, orders, shipments, addToCart, advanceOrder, simulateDemoOrder } = useStore();
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(null);
	const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
	const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;
	const liveOrder = orders.find((o) => o.status < 5);
	shipments.find((s) => s.status !== "Delivered" && s.status !== "Cancelled") || shipments[0];
	liveOrder?.riderId && riders.find((r) => r.id === liveOrder.riderId);
	const recommendedParts = products.filter((p) => activeBike ? p.fits.includes(activeBike.bikeId) : true).slice(0, 4);
	const copyCoupon = (code) => {
		navigator.clipboard?.writeText(code);
		setCopiedCode(code);
		toast.success(`Coupon "${code}" copied!`);
		setTimeout(() => setCopiedCode(null), 2500);
	};
	const handleAddBikeClick = () => {
		if (onOpenAddBikeModal) onOpenAddBikeModal();
		else onTabChange("garage");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 sm:space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display truncate",
						children: [
							"Hi, ",
							userProfile?.name?.trim() ? userProfile.name.trim().split(" ")[0] : "Rider",
							" 👋"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 mt-0.5 truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-[#E31E24] shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: userProfile?.city?.trim() || "Bengaluru, KA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gray-300",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-600 font-bold shrink-0",
								children: "EV Connected"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleAddBikeClick,
					className: "shrink-0 flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-red-50 hover:bg-red-100 text-xs sm:text-sm font-bold text-[#E31E24] border border-red-200/80 transition active:scale-95 cursor-pointer shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: garage.length > 0 ? "My Garage" : "Add Bike" })]
				})]
			}),
			garage.length > 0 && activeBike ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E31E24] via-[#DC2626] to-[#B91C1C] p-4.5 sm:p-6 text-white shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-8 -top-8 h-44 w-44 rounded-full bg-white/10 blur-xl pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Connected Vehicle" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight font-display truncate",
									children: activeBike.nickname || `${activeBikeMeta?.make} ${activeBikeMeta?.model}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs sm:text-sm text-red-100 mt-0.5 font-medium truncate",
									children: [
										activeBikeMeta?.voltage,
										"V Architecture · ",
										activeBike.odoKm ? `${activeBike.odoKm} km` : "Ready to ride"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/25",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 fill-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [activeBike.batteryHealth || 98, "% Health"] })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mt-4 sm:mt-5 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 sm:gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onOpenBookingModal,
								className: "py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-white text-[#E31E24] hover:bg-red-50 text-xs sm:text-sm font-bold text-center transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Service" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onTabChange("shop"),
								className: "py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold text-center transition active:scale-95 flex items-center justify-center gap-1.5 border border-white/25 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Parts" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onTabChange("garage"),
								className: "py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold text-center transition active:scale-95 cursor-pointer",
								children: "Garage"
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/40 p-4.5 sm:p-6 border border-red-200/90 shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-[#E31E24] text-xs font-bold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My EV Garage" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base sm:text-lg font-black text-gray-900 tracking-tight",
								children: "Add your electric scooter or bike"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed",
								children: "Select your vehicle to get 100% verified fitment spares, battery diagnostics, and doorstep care."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleAddBikeClick,
						className: "self-start sm:self-auto shrink-0 px-4 py-2 sm:py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Vehicle" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gray-500 mb-2.5",
				children: "Quick Actions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("shop"),
						className: "p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between h-28 sm:h-32 cursor-pointer group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-red-50 text-[#E31E24] grid place-items-center mb-1.5 group-hover:scale-105 transition shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4.5 w-4.5 sm:h-5 sm:w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm font-bold text-gray-900 leading-tight",
							children: "Shop Spares"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate",
							children: "Batteries & chargers"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onOpenBookingModal,
						className: "p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between h-28 sm:h-32 cursor-pointer group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mb-1.5 group-hover:scale-105 transition shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4.5 w-4.5 sm:h-5 sm:w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm font-bold text-gray-900 leading-tight",
							children: "Doorstep Service"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate",
							children: "Certified visit ₹299"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("orders"),
						className: "p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between h-28 sm:h-32 cursor-pointer group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center mb-1.5 group-hover:scale-105 transition shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4.5 w-4.5 sm:h-5 sm:w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm font-bold text-gray-900 leading-tight",
							children: "My Orders"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate",
							children: liveOrder ? "1 active dispatch" : `${orders.length} past orders`
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("garage"),
						className: "p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between h-28 sm:h-32 cursor-pointer group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-purple-50 text-purple-600 grid place-items-center mb-1.5 group-hover:scale-105 transition shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-4.5 w-4.5 sm:h-5 sm:w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm font-bold text-gray-900 leading-tight",
							children: "VIN Fitment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate",
							children: "17-digit decoder"
						})] })]
					})
				]
			})] }),
			liveOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-red-200/80 bg-red-50/40 p-4 sm:p-4.5 shadow-2xs space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2.5 w-2.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31E24] opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E31E24]" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs sm:text-sm font-bold text-gray-900 truncate",
							children: [
								"Delivery in Progress · ETA ~",
								Math.max(5, liveOrder.eta),
								" mins"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-mono font-bold text-gray-700 shrink-0",
						children: liveOrder.id
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-[#E31E24] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-gray-900",
								children: ORDER_STEPS[liveOrder.status]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onTabChange("orders"),
						className: "text-xs sm:text-sm font-bold text-[#E31E24] hover:underline flex items-center gap-0.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track Live" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24] shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.5 rounded bg-red-100 text-[#E31E24] text-[10px] font-bold shrink-0",
								children: "SPECIAL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs sm:text-sm font-bold text-gray-900 truncate",
								children: "₹200 Off First Visit"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 mt-0.5 truncate",
							children: "Valid on all doorstep service bookings."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => copyCoupon("RIDERZ200"),
					className: "shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-[#E31E24] bg-red-50/50 text-[#E31E24] text-xs font-mono font-bold hover:bg-red-50 transition cursor-pointer",
					children: [copiedCode === "RIDERZ200" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RIDERZ200" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2.5 sm:mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm sm:text-base font-black text-gray-900",
					children: "Doorstep Technician Care"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500",
					children: "Certified technicians at your location"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onOpenBookingModal,
					className: "text-xs sm:text-sm font-bold text-[#E31E24] hover:underline flex items-center gap-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Book Visit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 sm:p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center sm:flex-col justify-between sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center sm:block gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-9 w-9 rounded-xl bg-red-50 text-[#E31E24] grid place-items-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4.5 w-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs sm:text-sm font-bold text-gray-900 truncate",
											children: "24-Point General Care"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm:hidden text-xs font-black text-[#E31E24] font-mono shrink-0",
											children: "₹299"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] sm:text-xs text-gray-500 truncate sm:line-clamp-2 mt-0.5",
										children: "Brakes, tire wear, electrical harnesses & torque check."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:block text-sm font-black text-[#E31E24] font-mono mt-1.5",
										children: "₹299"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onOpenBookingModal,
							className: "shrink-0 sm:w-full py-1.5 sm:py-2 px-3 rounded-xl bg-red-50 hover:bg-[#E31E24] hover:text-white text-[#E31E24] text-xs font-bold transition text-center cursor-pointer active:scale-95",
							children: "Book"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 sm:p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center sm:flex-col justify-between sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center sm:block gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-9 w-9 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4.5 w-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs sm:text-sm font-bold text-gray-900 truncate",
											children: "Battery & BMS Check"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm:hidden text-xs font-black text-[#E31E24] font-mono shrink-0",
											children: "₹399"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] sm:text-xs text-gray-500 truncate sm:line-clamp-2 mt-0.5",
										children: "Cell balance test, voltage audit & thermal seal check."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:block text-sm font-black text-[#E31E24] font-mono mt-1.5",
										children: "₹399"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onOpenBookingModal,
							className: "shrink-0 sm:w-full py-1.5 sm:py-2 px-3 rounded-xl bg-red-50 hover:bg-[#E31E24] hover:text-white text-[#E31E24] text-xs font-bold transition text-center cursor-pointer active:scale-95",
							children: "Book"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 sm:p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex items-center sm:flex-col justify-between sm:justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center sm:block gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4.5 w-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs sm:text-sm font-bold text-gray-900 truncate",
											children: "Brake Overhaul"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sm:hidden text-xs font-black text-[#E31E24] font-mono shrink-0",
											children: "₹249"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] sm:text-xs text-gray-500 truncate sm:line-clamp-2 mt-0.5",
										children: "Pad replacement, fluid flush & regen calibration."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:block text-sm font-black text-[#E31E24] font-mono mt-1.5",
										children: "₹249"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onOpenBookingModal,
							className: "shrink-0 sm:w-full py-1.5 sm:py-2 px-3 rounded-xl bg-red-50 hover:bg-[#E31E24] hover:text-white text-[#E31E24] text-xs font-bold transition text-center cursor-pointer active:scale-95",
							children: "Book"
						})]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2.5 sm:mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm sm:text-base font-black text-gray-900",
					children: activeBikeMeta ? `Verified Parts for ${activeBikeMeta.model}` : "Recommended EV Spares"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500",
					children: "100% Guaranteed OEM fitment"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onTabChange("shop"),
					className: "text-xs sm:text-sm font-bold text-[#E31E24] hover:underline flex items-center gap-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View All" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3",
				children: recommendedParts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs flex flex-col justify-between group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-square rounded-xl overflow-hidden bg-gray-50/80 mb-2 flex items-center justify-center p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: p.name,
								className: "h-full w-full object-contain group-hover:scale-105 transition"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-[#E31E24] uppercase tracking-wider block truncate",
							children: p.brand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold text-gray-900 line-clamp-2 mt-0.5 leading-snug min-h-[32px]",
							children: p.name
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs sm:text-sm font-black text-gray-900 font-mono truncate",
							children: inr(p.offers[0]?.price || 999)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								const vendorId = p.offers[0]?.vendorId || "v1";
								addToCart(p.id, vendorId);
								toast.success(`Added to cart!`);
							},
							className: "shrink-0 px-2.5 py-1 rounded-lg bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs",
							children: "+ Add"
						})]
					})]
				}, p.id))
			})] })
		]
	});
}
var SHOP_CATEGORIES = [
	"All",
	"Electric Bikes",
	"EV Batteries",
	"Car Accessories",
	"Bike Accessories"
];
var PAGE_SIZE = 40;
function matchesShopCategory(product, category) {
	if (category === "All") return true;
	if (category === "Electric Bikes") return product.category === "Electric Bikes";
	if (category === "EV Batteries") return product.category === "Battery" || product.category === "EV Batteries";
	if (category === "Car Accessories") return product.isAccessoryProduct && (product.vehicleType === "car" || product.vehicleType === "both");
	return product.isAccessoryProduct && (product.vehicleType === "bike" || product.vehicleType === "both");
}
function ShopTab() {
	const { activeBikeId, setActiveBikeId } = useStore();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const [brand, setBrand] = (0, import_react.useState)("All brands");
	const [subcat, setSubcat] = (0, import_react.useState)("All");
	const [volt, setVolt] = (0, import_react.useState)(null);
	const [onlyFit, setOnlyFit] = (0, import_react.useState)(false);
	const [sort, setSort] = (0, import_react.useState)("relevance");
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(PAGE_SIZE);
	const accessoryVehicleType = cat === "Car Accessories" ? "car" : cat === "Bike Accessories" ? "bike" : null;
	const categoryProducts = (0, import_react.useMemo)(() => products.filter((p) => matchesShopCategory(p, cat)), [cat]);
	const categoryOptions = (0, import_react.useMemo)(() => [...new Set(categoryProducts.map((p) => p.category))].sort((a, b) => a.localeCompare(b)).map((category) => ({
		category,
		count: categoryProducts.filter((p) => p.category === category).length
	})), [categoryProducts]);
	const subcategoryProducts = (0, import_react.useMemo)(() => categoryProducts.filter((p) => subcat === "All" || p.category.toLowerCase() === subcat.toLowerCase() || p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase() || Array.isArray(p.subcategories) && p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase())), [categoryProducts, subcat]);
	const accessoryBrands = (0, import_react.useMemo)(() => {
		if (!accessoryVehicleType) return [];
		return [...new Set(subcategoryProducts.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)).map((name) => ({
			name,
			count: subcategoryProducts.filter((p) => p.brand === name).length
		}));
	}, [accessoryVehicleType, subcategoryProducts]);
	const availableVoltages = (0, import_react.useMemo)(() => [...new Set(categoryProducts.map((p) => p.voltage).filter((voltage) => typeof voltage === "number"))].sort((a, b) => a - b), [categoryProducts]);
	const categoryCounts = (0, import_react.useMemo)(() => Object.fromEntries(SHOP_CATEGORIES.map((category) => [category, products.filter((p) => matchesShopCategory(p, category)).length])), []);
	const filteredProducts = (0, import_react.useMemo)(() => {
		let list = products.filter((p) => {
			const matchesCat = matchesShopCategory(p, cat);
			const matchesSubcat = subcat === "All" || p.category.toLowerCase() === subcat.toLowerCase() || p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase() || Array.isArray(p.subcategories) && p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase());
			const matchesVolt = volt === null || p.voltage === volt;
			const matchesFit = !onlyFit || Boolean(activeBikeId && p.fits.length > 0 && p.fits.includes(activeBikeId));
			const matchesBrand = !accessoryVehicleType || brand === "All brands" || p.brand === brand;
			const queryLower = q.toLowerCase().trim();
			const matchesQuery = !queryLower || `${p.name} ${p.brand} ${p.category} ${p.subcategory || ""} ${p.description}`.toLowerCase().includes(queryLower);
			return matchesCat && matchesSubcat && matchesVolt && matchesFit && matchesBrand && matchesQuery;
		});
		if (sort === "low") list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
		else if (sort === "high") list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
		return list;
	}, [
		q,
		cat,
		brand,
		accessoryVehicleType,
		subcat,
		volt,
		onlyFit,
		activeBikeId,
		sort
	]);
	const activeBike = activeBikeId ? getBike(activeBikeId) : null;
	const showVoltageFilter = availableVoltages.length > 0;
	const showFitFilter = Boolean(activeBike && cat !== "Car Accessories");
	const hasActiveFilters = cat !== "All" || brand !== "All brands" || subcat !== "All" || volt !== null || onlyFit || Boolean(q);
	const resetFilters = () => {
		setCat("All");
		setBrand("All brands");
		setSubcat("All");
		setVolt(null);
		setOnlyFit(false);
		setQ("");
		setVisibleCount(PAGE_SIZE);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 fill-[#E31E24]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official Store Catalog" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#6B7280]",
								children: "100% Genuine Components"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display",
						children: "Shop Electric Bikes, Spares & Accessories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[#6B7280] max-w-2xl leading-relaxed",
						children: "Order certified high-voltage lithium battery packs, smart fast chargers, precision brake rotors, and riding gear with guaranteed vehicle compatibility."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex shrink-0 flex-col gap-2 text-xs font-semibold text-[#6B7280] md:min-w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#E31E24]" }), " Vehicle fitment"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: activeBikeId ?? "",
						onChange: (event) => {
							const bikeId = event.target.value || null;
							setActiveBikeId(bikeId);
							setOnlyFit(Boolean(bikeId));
							setVisibleCount(PAGE_SIZE);
						},
						"aria-label": "Choose a vehicle to show compatible products",
						className: "w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#111111] outline-none shadow-2xs hover:border-gray-400 focus:border-[#E31E24]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All vehicles"
						}), bikes.map((bike) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: bike.id,
							children: [
								bike.make,
								" ",
								bike.model
							]
						}, bike.id))]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#E5E7EB] shadow-2xs rounded-2xl p-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row gap-3 items-stretch lg:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex flex-1 items-center bg-[#F5F6F8] rounded-full border border-[#E5E7EB] px-4 py-2 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-[#E31E24]/20 shadow-2xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-[#6B7280] shrink-0 mr-2.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: q,
										onChange: (e) => {
											setQ(e.target.value);
											setVisibleCount(PAGE_SIZE);
										},
										placeholder: "Search by part name, brand (Motul, Brembo, Ather), voltage, or specification...",
										className: "w-full bg-transparent text-xs text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
									}),
									q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setQ("");
											setVisibleCount(PAGE_SIZE);
										},
										className: "text-gray-400 hover:text-gray-700 p-1",
										"aria-label": "Clear search",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-[#6B7280]",
									children: "Category:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: subcat,
									onChange: (e) => {
										setSubcat(e.target.value);
										setBrand("All brands");
										setVisibleCount(PAGE_SIZE);
									},
									"aria-label": "Filter by product category",
									className: "rounded-full bg-white border border-[#E5E7EB] px-3.5 py-2 text-xs font-semibold text-[#111111] outline-none cursor-pointer shadow-2xs hover:border-gray-400 max-w-[200px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "All",
										children: [
											"All categories (",
											categoryProducts.length,
											")"
										]
									}), categoryOptions.map(({ category, count }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: category,
										children: [
											category,
											" (",
											count,
											")"
										]
									}, category))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-[#6B7280] hidden sm:inline",
									children: "Sort by:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sort,
									onChange: (e) => setSort(e.target.value),
									className: "rounded-full bg-white border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#111111] outline-none cursor-pointer shadow-2xs hover:border-gray-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "relevance",
											children: "Featured & Relevant"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "low",
											children: "Price: Low to High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "high",
											children: "Price: High to Low"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none",
						children: SHOP_CATEGORIES.map((c) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setCat(c);
									setBrand("All brands");
									setSubcat("All");
									setVolt(null);
									setOnlyFit(false);
									setVisibleCount(PAGE_SIZE);
								},
								className: cn("whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95", cat === c ? "bg-[#E31E24] text-white shadow-xs" : "bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#111111] hover:bg-gray-50 shadow-2xs"),
								children: [
									c,
									" (",
									categoryCounts[c],
									")"
								]
							}, c);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 pt-3 border-t border-[#E5E7EB] text-xs",
						children: [
							accessoryVehicleType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-[#6B7280] font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Brand:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: brand,
									onChange: (e) => {
										setBrand(e.target.value);
										setVisibleCount(PAGE_SIZE);
									},
									"aria-label": `Filter ${accessoryVehicleType} accessories by brand`,
									className: "rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] outline-none shadow-2xs hover:border-gray-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All brands",
										children: "All brands"
									}), accessoryBrands.map(({ name, count }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: name,
										children: [
											name,
											" (",
											count,
											")"
										]
									}, name))]
								})]
							}),
							showVoltageFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-[#6B7280] font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Voltage:" })]
							}), availableVoltages.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setVolt(volt === v ? null : v);
									setVisibleCount(PAGE_SIZE);
								},
								className: cn("rounded-full px-3 py-1 font-semibold transition active:scale-95 shadow-2xs", volt === v ? "bg-[#E31E24] text-white" : "bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#111111]"),
								children: [v, "V"]
							}, v))] }),
							showFitFilter && activeBike && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "ml-auto flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#111111] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: onlyFit,
									onChange: (e) => {
										setOnlyFit(e.target.checked);
										setVisibleCount(PAGE_SIZE);
									},
									className: "rounded border-gray-300 accent-[#E31E24]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Fit for ",
									activeBike.make,
									" ",
									activeBike.model,
									" only"
								] })]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-bold text-[#6B7280] uppercase tracking-wider",
					children: [
						"Showing ",
						Math.min(visibleCount, filteredProducts.length),
						" of ",
						filteredProducts.length,
						" items",
						subcat !== "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-[#E31E24]",
							children: subcat
						})] })
					]
				}), hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetFilters,
					className: "text-xs font-semibold text-[#E31E24] hover:underline",
					children: "Reset all filters"
				})]
			}), filteredProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-12 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-bold text-[#111111]",
						children: "No products found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#6B7280] max-w-md mx-auto",
						children: "No parts match your current filters. Clear them to browse the full catalog."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: resetFilters,
						className: "rounded-full bg-[#E31E24] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700",
						children: "Show All Products"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
				children: filteredProducts.slice(0, visibleCount).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
			}), visibleCount < filteredProducts.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length)),
					className: "rounded-xl border border-[#E5E7EB] bg-white px-6 py-2.5 text-xs font-bold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-gray-50 cursor-pointer transition",
					children: [
						"Load More Products (",
						filteredProducts.length - visibleCount,
						" remaining)"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setVisibleCount(filteredProducts.length),
					className: "rounded-xl bg-[#E31E24] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 cursor-pointer transition",
					children: [
						"Show All ",
						filteredProducts.length,
						" Items"
					]
				})]
			})] })] })
		]
	});
}
function GarageTab({ onOpenAddBikeModal, onOpenBookingModal }) {
	const { garage, activeBikeId, setActiveBikeId, removeBike, addToCart, toggleSaved, isSaved } = useStore();
	const [selectedBikeId, setSelectedBikeId] = (0, import_react.useState)(activeBikeId || garage[0]?.bikeId || "ola-s1pro");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All");
	const [partsSearch, setPartsSearch] = (0, import_react.useState)("");
	const [isVinModalOpen, setIsVinModalOpen] = (0, import_react.useState)(false);
	const partsSectionRef = (0, import_react.useRef)(null);
	const activeBike = garage.find((b) => b.bikeId === selectedBikeId) || garage[0];
	const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;
	const compatibleProducts = (0, import_react.useMemo)(() => {
		if (!activeBike) return [];
		let items = products.filter((p) => p.fits.includes(activeBike.bikeId));
		if (selectedCategory !== "All") items = items.filter((p) => {
			if (selectedCategory === "BMS Boards") return p.category === "BMS";
			if (selectedCategory === "Motors & Controllers") return p.category === "Motor" || p.category === "Controller";
			return p.category === selectedCategory;
		});
		if (partsSearch.trim()) {
			const q = partsSearch.toLowerCase();
			items = items.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.chemistry && p.chemistry.toLowerCase().includes(q));
		}
		return items;
	}, [
		activeBike,
		selectedCategory,
		partsSearch
	]);
	const categories = [
		"All",
		"Battery",
		"Charger",
		"BMS Boards",
		"Motors & Controllers",
		"Brakes"
	];
	const handleSelectBikeToShop = (bikeId) => {
		setSelectedBikeId(bikeId);
		partsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-extrabold text-gray-900 font-display",
					children: "My Registered EV Garage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Manage your registered electric two-wheelers and browse guaranteed compatible OEM parts, batteries, and chargers right here."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsVinModalOpen(true),
						className: "inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search by VIN" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onOpenAddBikeModal,
						className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add New EV" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold text-gray-900 font-display",
						children: [
							"Registered Electric Vehicles (",
							garage.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-gray-500",
						children: "Click any bike to view its compatible spares below"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
					children: [garage.map((g) => {
						const b = getBike(g.bikeId);
						const isPrimary = activeBikeId === g.bikeId;
						const isSelected = selectedBikeId === g.bikeId;
						const bikePartsCount = products.filter((p) => p.fits.includes(g.bikeId)).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-3xl border bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${isSelected ? "border-primary ring-2 ring-primary/30" : isPrimary ? "border-emerald-200" : "border-gray-200"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[16/10] bg-gray-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: scooter_default,
										alt: b.model,
										className: "h-full w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-3 left-3 flex gap-2",
										children: [isPrimary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold shadow-xs",
											children: "Primary EV"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold",
											children: [b.voltage, "V Architecture"]
										})]
									}),
									isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute bottom-3 left-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2.5 py-0.5 rounded-md bg-white text-emerald-800 text-[10px] font-bold shadow-2xs border border-emerald-300 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-primary" }), " Currently Viewing Spares"]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 flex-1 flex flex-col justify-between space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-xl font-extrabold text-gray-900 font-display",
											children: [
												b.make,
												" ",
												b.model
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md",
											children: g.regNo || "KA 01 EQ 8821"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-gray-500 mt-1",
										children: [
											g.year ?? "2023",
											" Model · System Voltage: ",
											b.voltage,
											"V DC · WMI: ",
											b.wmi
										]
									}),
									g.vin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] font-mono text-gray-400 mt-0.5",
										children: ["VIN: ", g.vin]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-xl bg-gray-50 border border-gray-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider block",
												children: "Odometer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-bold text-gray-900",
												children: [g.odoKm?.toLocaleString("en-IN") ?? 12450, " km"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-emerald-700 uppercase tracking-wider block",
												children: "Battery SOH"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-bold text-emerald-800",
												children: [g.batteryHealth ?? 96, "% Optimal"]
											})]
										})]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 pt-2 border-t border-gray-100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleSelectBikeToShop(g.bikeId),
											className: `w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-semibold shadow-xs transition active:scale-95 ${isSelected ? "bg-primary text-white hover:bg-emerald-600" : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-primary hover:text-white"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"View Compatible Spares (",
												bikePartsCount,
												" items)"
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: onOpenBookingModal,
												className: "py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition",
												children: "Book Service"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setActiveBikeId(g.bikeId);
													setSelectedBikeId(g.bikeId);
													toast.success(`${b.make} ${b.model} set as primary active vehicle`);
												},
												disabled: isPrimary,
												className: `py-1.5 rounded-xl text-xs font-semibold transition ${isPrimary ? "bg-gray-100 text-gray-400 cursor-default" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`,
												children: isPrimary ? "Primary Bike" : "Set Primary"
											})]
										}),
										garage.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												removeBike(g.bikeId);
												toast.info(`${b.make} ${b.model} removed from garage`);
											},
											className: "w-full text-center text-[11px] font-medium text-rose-500 hover:text-rose-700 py-1 transition",
											children: "Remove from Garage"
										})
									]
								})]
							})]
						}, g.bikeId);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: onOpenAddBikeModal,
						className: "rounded-3xl border-2 border-dashed border-[#E5E7EB] hover:border-primary bg-white p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[360px] hover:bg-red-50/20 transition-all shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-primary mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold text-gray-900 font-display",
								children: "Add Another EV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 mt-1 max-w-xs",
								children: "Enter VIN or select your model to unlock verified batteries, chargers, and spare parts."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs",
								children: "+ Decode VIN or Add"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				ref: partsSectionRef,
				className: "pt-6 border-t border-gray-200 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl sm:text-2xl font-extrabold text-gray-900 font-display",
								children: ["Compatible Spares & Parts for ", activeBikeMeta ? `${activeBikeMeta.make} ${activeBikeMeta.model}` : "Your Bike"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-500 mt-1",
							children: [
								"Guaranteed 100% fitment for your ",
								activeBikeMeta ? `${activeBikeMeta.voltage}V system` : "vehicle",
								". Zero guesswork — verified against chassis and connector pinouts."
							]
						})] }), garage.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 p-1 rounded-2xl bg-gray-100 border border-gray-200 self-start md:self-auto",
							children: garage.map((g) => {
								const b = getBike(g.bikeId);
								const isCur = selectedBikeId === g.bikeId;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelectedBikeId(g.bikeId),
									className: `px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isCur ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-gray-900"}`,
									children: [
										b.make,
										" ",
										b.model
									]
								}, g.bikeId);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedCategory(cat),
								className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${selectedCategory === cat ? "bg-primary text-white shadow-2xs font-bold" : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"}`,
								children: cat
							}, cat))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[240px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-gray-400 absolute left-3.5 top-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: partsSearch,
									onChange: (e) => setPartsSearch(e.target.value),
									placeholder: "Filter garage spares...",
									className: "w-full h-10 rounded-2xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs text-gray-900 outline-none focus:bg-white focus:border-primary transition"
								}),
								partsSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPartsSearch(""),
									className: "absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-700",
									children: "✕"
								})
							]
						})]
					}),
					compatibleProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-12 rounded-3xl border border-dashed border-gray-300 bg-white text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-10 w-10 text-gray-300 mx-auto mb-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold text-gray-800 font-display",
								children: "No Parts Found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-gray-500 mt-0.5",
								children: [
									"No parts matched “",
									partsSearch || selectedCategory,
									"” for ",
									activeBikeMeta?.make,
									" ",
									activeBikeMeta?.model,
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setSelectedCategory("All");
									setPartsSearch("");
								},
								className: "mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold",
								children: "Reset Filters"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: compatibleProducts.map((p) => {
							const offer = p.offers[0];
							const saved = isSaved(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-[4/3] bg-gray-100 overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image,
											alt: p.name,
											className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-3 left-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-800 text-[10px] font-bold shadow-2xs",
												children: p.category
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												toggleSaved(p.id);
												toast.success(saved ? "Removed from saved" : "Saved to wishlist");
											},
											className: "absolute top-3 right-3 p-2 rounded-full bg-white border border-[#E5E7EB] text-gray-600 hover:text-rose-500 shadow-2xs transition",
											title: saved ? "Remove from wishlist" : "Save item",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}` })
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 flex-1 flex flex-col justify-between space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md",
											children: ["✓ Fits ", activeBikeMeta?.model]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/product/$id",
											params: { id: p.id },
											className: "block text-sm font-bold text-gray-900 group-hover:text-primary transition mt-1.5 line-clamp-1",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-gray-500 mt-0.5 line-clamp-2",
											children: p.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex flex-wrap gap-1 text-[11px] text-gray-500 font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "bg-gray-100 px-2 py-0.5 rounded-md",
													children: ["Brand: ", p.brand]
												}),
												p.voltage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-emerald-800",
													children: [p.voltage, "V"]
												}),
												p.capacityAh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "bg-gray-100 px-2 py-0.5 rounded-md",
													children: [p.capacityAh, "Ah"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "bg-gray-100 px-2 py-0.5 rounded-md",
													children: [p.warrantyMonths, "m Warranty"]
												})
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 border-t border-gray-100 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-base font-extrabold text-gray-900",
											children: inr(offer.price)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-emerald-600 font-semibold",
											children: "In stock · Express dispatch"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												addToCart(p.id, offer.vendorId);
												toast.success(`${p.name} added to cart`);
											},
											className: "px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add" })]
										})]
									})]
								})]
							}, p.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VinSearchModal, {
				isOpen: isVinModalOpen,
				onClose: () => setIsVinModalOpen(false)
			})
		]
	});
}
function OrdersTab() {
	const { orders, advanceOrder, simulateDemoOrder } = useStore();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [selectedInvoiceOrder, setSelectedInvoiceOrder] = (0, import_react.useState)(null);
	const filteredOrders = orders.filter((o) => {
		if (filter === "active") return o.status < 5;
		if (filter === "delivered") return o.status === 5;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			selectedInvoiceOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-gray-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold text-gray-900 font-display",
								children: "Tax Invoice & Receipt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-gray-500 font-mono",
								children: ["Invoice #", selectedInvoiceOrder.id]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedInvoiceOrder(null),
								className: "p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Date: ", new Date(selectedInvoiceOrder.createdAt).toLocaleDateString("en-IN")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Payment: ", selectedInvoiceOrder.payment] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100",
									children: selectedInvoiceOrder.groups.map((g) => {
										const v = getVendor(g.vendorId);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "py-2 first:pt-0 last:pb-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-gray-800",
												children: v?.name || "Verified EV Vendor"
											}), g.items.map((it) => {
												const p = getProduct(it.productId);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-gray-600 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														it.qty,
														" × ",
														p?.name || "EV Spare"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-gray-900",
														children: inr(it.price * it.qty)
													})]
												}, it.productId);
											})]
										}, g.vendorId);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedInvoiceOrder.itemsTotal) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Doorstep Delivery (GPS Logged)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedInvoiceOrder.deliveryTotal) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GST (18% Statutory EV Tax)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedInvoiceOrder.tax) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Amount Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: inr(selectedInvoiceOrder.total)
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3 border-t border-gray-100 flex justify-end gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									toast.success(`Invoice ${selectedInvoiceOrder.id}.pdf downloaded`);
									setSelectedInvoiceOrder(null);
								},
								className: "px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-emerald-600 transition flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download PDF Receipt" })]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-gray-900 font-display",
					children: "Orders & Delivery Tracking"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Monitor real-time courier dispatch progress, vendor acceptance, and access tax receipts."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							simulateDemoOrder();
							toast.success("Sample order created!");
						},
						className: "px-3.5 py-2 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition",
						children: "+ Simulate Demo Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "px-4 py-2 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition",
						children: "Shop Parts"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					{
						id: "all",
						label: `All Orders (${orders.length})`
					},
					{
						id: "active",
						label: `Active Deliveries (${orders.filter((o) => o.status < 5).length})`
					},
					{
						id: "delivered",
						label: `Delivered (${orders.filter((o) => o.status === 5).length})`
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(t.id),
					className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${filter === t.id ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"}`,
					children: t.label
				}, t.id))
			}),
			filteredOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-10 w-10 text-gray-300 mx-auto mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-bold text-gray-800 font-display",
						children: "No Orders Found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-500 mt-1 max-w-sm mx-auto",
						children: filter === "active" ? "No live orders currently in transit. Explore our catalog of EV batteries, chargers, and spare parts." : "You haven't placed any orders yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition",
							children: "Browse Shop"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								simulateDemoOrder();
								toast.success("Demo order created!");
							},
							className: "px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition",
							children: "Simulate Demo Order"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: filteredOrders.map((o) => {
					const isLive = o.status < 5;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md transition space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "grid h-10 w-10 place-items-center rounded-2xl bg-gray-100 text-gray-700 font-mono text-xs font-bold",
										children: ["#", o.id.slice(-4)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-gray-900 text-sm font-mono",
											children: o.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${o.status === 5 ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800 animate-pulse"}`,
											children: ORDER_STEPS[o.status]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-gray-500 mt-0.5",
										children: [
											"Placed on ",
											new Date(o.createdAt).toLocaleString("en-IN"),
											" · Paid via ",
											o.payment
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-extrabold text-gray-900",
										children: inr(o.total)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-gray-500",
										children: [o.groups.reduce((s, g) => s + g.items.reduce((n, i) => n + i.qty, 0), 0), " items total"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-6 gap-1 text-center",
									children: ORDER_STEPS.map((step, idx) => {
										const isPassed = idx <= o.status;
										const isCurrent = idx === o.status;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold transition-all ${isCurrent ? "bg-primary text-white ring-4 ring-emerald-100 scale-105" : isPassed ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"}`,
												children: isPassed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : idx + 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `mt-1.5 text-[9px] line-clamp-1 ${isCurrent ? "font-bold text-gray-900" : isPassed ? "font-medium text-gray-700" : "text-gray-400"}`,
												children: step
											})]
										}, step);
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs",
								children: o.groups.map((g) => {
									const v = getVendor(g.vendorId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-900",
											children: v?.name || "EV Spares Hub"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-gray-400 ml-2",
											children: [
												"(",
												g.km,
												" km away · ~",
												g.eta,
												" min dispatch)"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-gray-600",
											children: g.items.map((it) => {
												const p = getProduct(it.productId);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-block mr-2 font-medium",
													children: [
														it.qty,
														"x ",
														p?.name || "Spare"
													]
												}, it.productId);
											})
										})]
									}, g.vendorId);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [isLive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => advanceOrder(o.id),
										className: "px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:border-primary hover:text-primary transition",
										children: "Simulate Next Milestone →"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setSelectedInvoiceOrder(o),
										className: "px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Invoice" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/track/$id",
									params: { id: o.id },
									className: "px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track Live GPS Courier" })]
								})]
							})
						]
					}, o.id);
				})
			})
		]
	});
}
function TrackingTab() {
	const { shipments, orders } = useStore();
	const [selectedShipmentId, setSelectedShipmentId] = (0, import_react.useState)(shipments[0]?.shipmentId || "");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [isReportIssueOpen, setIsReportIssueOpen] = (0, import_react.useState)(false);
	const [issueText, setIssueText] = (0, import_react.useState)("");
	const activeShipment = shipments.find((s) => s.shipmentId === selectedShipmentId) || shipments[0];
	const handleCopyTracking = (trackNum) => {
		navigator.clipboard.writeText(trackNum);
		setCopied(true);
		toast.success("Tracking number copied to clipboard");
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleReportIssue = (e) => {
		e.preventDefault();
		if (!issueText.trim()) return;
		toast.success("Logistics issue reported", { description: `Support ticket created for shipment ${activeShipment?.trackingNumber}. Priority escalation initiated.` });
		setIssueText("");
		setIsReportIssueOpen(false);
	};
	if (!activeShipment) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-2xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-12 w-12 text-gray-400" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 text-base font-bold text-[#111111]",
				children: "No Active Shipments Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-[#6B7280]",
				children: "Orders placed will appear here with live courier telemetry and facility checkpoint updates."
			})
		]
	});
	const isDelivered = activeShipment.status === "Delivered";
	const isDelayed = activeShipment.status === "Delayed";
	const isGpsActive = activeShipment.locationType === "Live GPS Telemetry" && !!activeShipment.currentGps;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#111111] font-display",
						children: "Track Consignments & Dispatches"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#6B7280]",
						children: "Synchronized 3rd-party logistics tracking with verified checkpoints"
					})] })]
				}), shipments.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-[#6B7280]",
						children: "Active Consignment:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: selectedShipmentId,
						onChange: (e) => setSelectedShipmentId(e.target.value),
						className: "h-9 rounded-lg border border-[#E5E7EB] bg-gray-50 px-3 text-xs font-semibold text-[#111111] outline-none focus:border-[#E31E24]",
						children: shipments.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: s.shipmentId,
							children: [
								s.provider,
								" (",
								s.trackingNumber,
								") — ",
								s.status
							]
						}, s.shipmentId))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-[#E5E7EB] bg-gray-50/70 p-5 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold uppercase tracking-wider text-[#6B7280]",
										children: "Logistics Partner:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#111111] border border-gray-200 shadow-2xs",
										children: activeShipment.provider
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `px-2.5 py-1 rounded-full text-xs font-bold ${isDelivered ? "bg-emerald-100 text-emerald-800" : isDelayed ? "bg-amber-100 text-amber-800" : "bg-red-50 text-[#E31E24] border border-red-200"}`,
										children: ["● ", activeShipment.status]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-2 text-xl sm:text-2xl font-extrabold text-[#111111] font-display",
								children: ["AWB: ", activeShipment.trackingNumber]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-[#6B7280]",
								children: [
									"Linked Order: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-[#111111]",
										children: ["#", activeShipment.orderId]
									}),
									" · Reference: ",
									activeShipment.providerReference
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleCopyTracking(activeShipment.trackingNumber),
								className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs cursor-pointer",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy AWB" })]
							}), activeShipment.trackingUrl.startsWith("http") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: activeShipment.trackingUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Courier Portal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-gray-200/80 pt-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-[#6B7280]",
								children: "Telemetry Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 font-bold text-[#111111] flex items-center gap-1",
								children: activeShipment.locationType === "Live GPS Telemetry" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5 text-[#E31E24] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live GPS Telemetry" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Facility Checkpoints" })] })
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-[#6B7280]",
								children: "Latest Checkpoint"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 font-bold text-[#111111] truncate",
								children: activeShipment.latestLocation
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-[#6B7280]",
								children: "Estimated Delivery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 font-bold text-[#E31E24]",
								children: activeShipment.estimatedDelivery
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-[#6B7280]",
								children: "Last Event Timestamp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 font-bold text-[#111111]",
								children: activeShipment.lastEventTimestamp
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 sm:p-6 space-y-6",
					children: [
						isGpsActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-[#111111] flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Fleet GPS Stream" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200",
									children: [
										"Speed: ",
										activeShipment.currentGps?.speedKmph,
										" km/h · Heading: ",
										activeShipment.currentGps?.heading,
										"°"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl overflow-hidden border border-gray-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
									stops: 1,
									progress: .65,
									className: "h-64 sm:h-80 w-full"
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-800 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-blue-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: "Authoritative Logistics Facility Verification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-blue-700",
								children: [
									"This consignment is routed through certified regional sorting hubs. Physical barcoded checkpoints are scanned by ",
									activeShipment.provider,
									" personnel at each hub transfer."
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 rounded-xl bg-gray-50 p-4 border border-gray-200 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold text-[#6B7280] uppercase tracking-wider",
									children: "Origin (Pickup Hub)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-[#111111] mt-1",
									children: activeShipment.pickupAddress.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#6B7280]",
									children: [
										activeShipment.pickupAddress.street,
										", ",
										activeShipment.pickupAddress.city,
										" - ",
										activeShipment.pickupAddress.pincode
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold text-[#6B7280] uppercase tracking-wider",
									children: "Destination (Customer Address)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-[#111111] mt-1",
									children: activeShipment.destinationAddress.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#6B7280]",
									children: [
										activeShipment.destinationAddress.street,
										", ",
										activeShipment.destinationAddress.city,
										" - ",
										activeShipment.destinationAddress.pincode
									]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-sm text-[#111111] mb-4",
							children: [
								"Verified Tracking History (",
								activeShipment.events.length,
								" Events)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200",
							children: activeShipment.events.map((evt, idx) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${idx === 0 ? "bg-[#E31E24] ring-4 ring-red-100" : "bg-gray-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-[#111111]",
													children: evt.description
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600",
													children: evt.status
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[#6B7280] flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-gray-400" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: evt.location }),
													evt.facilityName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-gray-400",
														children: [
															"(",
															evt.facilityName,
															")"
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-gray-400",
												children: evt.timestamp
											})
										]
									})]
								}, evt.id || idx);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-[#E5E7EB] pt-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-[#6B7280]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Courier telemetry synchronized with RiderzPro backend" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setIsReportIssueOpen(true),
									className: "inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Report Delivery Issue" })]
								})
							})]
						})
					]
				})]
			}),
			isReportIssueOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-gray-100 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-sm text-[#111111]",
							children: "Report Delivery Issue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsReportIssueOpen(false),
							className: "text-gray-400 hover:text-gray-600 cursor-pointer",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReportIssue,
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[#6B7280]",
								children: [
									"Experiencing a delay, wrong location, or damaged shipment for AWB",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-[#111111]",
										children: activeShipment.trackingNumber
									}),
									"? Submit details below:"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-semibold text-gray-700 mb-1",
								children: "Issue Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: issueText,
								onChange: (e) => setIssueText(e.target.value),
								placeholder: "e.g. Courier marked out-for-delivery but not received, reschedule request...",
								className: "w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#E31E24]",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsReportIssueOpen(false),
									className: "px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-4 py-2 rounded-lg bg-[#E31E24] text-white font-bold hover:bg-red-700 transition cursor-pointer",
									children: "Submit Ticket"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
function SavedTab() {
	const { savedProductIds, toggleSaved, addToCart, garage, activeBikeId } = useStore();
	const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
	const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;
	const savedProducts = products.filter((p) => savedProductIds.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-gray-900 font-display",
				children: "Saved Parts & Wishlist"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-gray-500 mt-0.5",
				children: "Components, fast chargers, and accessories saved for future maintenance and bike upgrades."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition self-start sm:self-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop More Parts" })]
			})]
		}), savedProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-10 w-10 text-gray-300 mx-auto mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-bold text-gray-800 font-display",
					children: "Your Wishlist is Empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-1 max-w-sm mx-auto",
					children: "Browse compatible EV batteries, replacement chargers, and brake pads, and tap the heart icon to save items here."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "mt-5 inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition",
					children: "Explore Compatible Parts"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: savedProducts.map((p) => {
				const offer = p.offers[0];
				const isFit = activeBike ? p.fits.includes(activeBike.bikeId) : false;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[4/3] bg-gray-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: p.name,
								className: "h-full w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 left-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-800 text-[10px] font-bold shadow-2xs",
									children: p.category
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									toggleSaved(p.id);
									toast.info(`${p.name} removed from saved`);
								},
								className: "absolute top-3 right-3 p-2 rounded-full bg-white border border-[#E5E7EB] text-rose-500 hover:bg-rose-50 shadow-2xs transition",
								title: "Remove from wishlist",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 flex-1 flex flex-col justify-between space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							isFit && activeBikeMeta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold",
								children: [
									"✓ Verified for ",
									activeBikeMeta.make,
									" ",
									activeBikeMeta.model
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$id",
								params: { id: p.id },
								className: "block text-base font-bold text-gray-900 hover:text-primary transition mt-1.5",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 mt-1 line-clamp-2",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-gray-400 mt-2",
								children: [
									"Brand: ",
									p.brand,
									" · Warranty: ",
									p.warrantyMonths,
									" months"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-gray-100 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-extrabold text-gray-900",
								children: inr(offer.price)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-emerald-600 font-semibold",
								children: [
									"In stock at ",
									offer.stock,
									" units"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									addToCart(p.id, offer.vendorId);
									toast.success(`${p.name} added to cart`);
								},
								className: "px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add to Cart" })]
							})]
						})]
					})]
				}, p.id);
			})
		})]
	});
}
function ServiceTab({ onOpenBookingModal }) {
	const { serviceBookings, cancelServiceBooking, garage, activeBikeId } = useStore();
	const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
	activeBike && getBike(activeBike.bikeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-gray-900 font-display",
					children: "Service & Preventive Maintenance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Book certified doorstep technicians with calibrated BMS scanners or visit partner workshops across Bengaluru."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onOpenBookingModal,
					className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Book Technician Visit (₹299)" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-gray-900 font-display",
					children: "Scheduled Technician Appointments"
				}), serviceBookings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 rounded-3xl border border-dashed border-gray-300 bg-white text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-8 w-8 text-gray-300 mx-auto mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-gray-700",
							children: "No Scheduled Appointments"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 mt-0.5",
							children: "Keep your EV battery at peak capacity by scheduling regular health audits and brake checks."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onOpenBookingModal,
							className: "mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs",
							children: "Book Service Now"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: serviceBookings.map((b) => {
						const bike = getBike(b.bikeId);
						const isCancelled = b.status === "Cancelled";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `p-5 rounded-3xl border bg-white shadow-2xs space-y-3 ${isCancelled ? "opacity-60 border-gray-200" : "border-emerald-200 ring-1 ring-emerald-100"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md",
										children: ["#", b.id]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCancelled ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`,
										children: b.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-gray-900 font-display",
									children: b.serviceType
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-gray-500 mt-0.5",
									children: [
										"For ",
										bike ? `${bike.make} ${bike.model}` : "EV Motorcycle",
										" · ",
										inr(b.cost)
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b.slot })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b.location })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Technician: ", b.technician] })]
										})
									]
								}),
								!isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end gap-2 pt-1 border-t border-gray-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											cancelServiceBooking(b.id);
											toast.info("Appointment cancelled");
										},
										className: "text-xs text-rose-600 hover:underline font-medium",
										children: "Cancel appointment"
									})
								})
							]
						}, b.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-gray-900 font-display",
					children: "Popular EV Care Packages"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						{
							title: "Monsoon 24-Point Health Audit",
							price: 299,
							time: "45 mins",
							items: [
								"IP67 water ingress check",
								"Cell voltage balance scan",
								"Brake cable lubrication"
							]
						},
						{
							title: "Battery Capacity & SOH Test",
							price: 499,
							time: "60 mins",
							items: [
								"Coulomb counting test",
								"Thermal sensor diagnostics",
								"Cycle degradation report"
							]
						},
						{
							title: "Brake Overhaul & Fluid Bleed",
							price: 349,
							time: "40 mins",
							items: [
								"Hydraulic DOT4 fluid replacement",
								"Rotor thickness measurement",
								"Pad wear alignment"
							]
						},
						{
							title: "Fast Charger Home Setup",
							price: 799,
							time: "90 mins",
							items: [
								"MCB & earthing verification",
								"Wall mount installation",
								"Load testing at 3.3kW"
							]
						}
					].map((pkg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-3xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 px-2 py-0.5 rounded-md",
									children: "Doorstep Service"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-gray-900 font-display mt-1",
									children: pkg.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-gray-500",
									children: ["Duration: ", pkg.time]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100",
									children: pkg.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it })]
									}, it))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 border-t border-gray-100 flex items-center justify-between mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-extrabold text-gray-900",
								children: inr(pkg.price)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onOpenBookingModal,
								className: "px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition",
								children: "Book"
							})]
						})]
					}, pkg.title))
				})]
			})
		]
	});
}
function OffersTab() {
	const { userProfile } = useStore();
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(null);
	const copy = (code) => {
		navigator.clipboard?.writeText(code);
		setCopiedCode(code);
		toast.success(`Coupon code "${code}" copied!`);
		setTimeout(() => setCopiedCode(null), 2500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-gray-900 font-display",
					children: "Offers, Coupons & Rewards"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Exclusive discounts on EV spare parts, verified battery packs, and doorstep technician service."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-14 w-14 place-items-center rounded-3xl bg-primary text-white shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-7 w-7" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full",
							children: "RiderzPro Loyalty Club"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-extrabold text-gray-900 font-display mt-0.5",
							children: [userProfile.points, " ProPoints Available"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-600 mt-0.5",
							children: [
								"Redeemable for up to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-gray-900",
									children: inr(userProfile.points)
								}),
								" instant discount at checkout."
							]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => toast.success("ProPoints auto-applied to your next checkout!"),
					className: "px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition shrink-0",
					children: "Redeem at Checkout"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					{
						code: "RIDERZ10",
						title: "10% Instant Off on Batteries",
						desc: "Valid on all certified NMC and LiFePO4 packs above ₹30,000.",
						expires: "Valid till 31 Oct 2026",
						tag: "Best Value"
					},
					{
						code: "EVSAFE",
						title: "Free 24-Point Monsoon Inspection",
						desc: "Complimentary doorstep technician inspection on parts orders above ₹5,000.",
						expires: "Valid till Sunday",
						tag: "Seasonal"
					},
					{
						code: "FREEDEL",
						title: "Free Express Doorstep Delivery",
						desc: "Zero courier charges on fast chargers, brake pads, and BMS boards.",
						expires: "Active All Month",
						tag: "Popular"
					},
					{
						code: "FIRSTSERVICE",
						title: "₹150 Off Technician Home Visit",
						desc: "Applicable on all first-time preventive maintenance and battery health bookings.",
						expires: "Valid for New Bookings",
						tag: "Technician"
					}
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 rounded-3xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md",
								children: c.tag
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-gray-400 font-medium",
								children: c.expires
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-gray-900 font-display mt-2",
							children: c.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 mt-1 leading-relaxed",
							children: c.desc
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-gray-100 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs font-bold text-gray-800 bg-gray-50 border border-dashed border-gray-300 px-3 py-1.5 rounded-xl",
							children: c.code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => copy(c.code),
							className: "px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-xs font-semibold transition flex items-center gap-1.5",
							children: copiedCode === c.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copied!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy Code" })] })
						})]
					})]
				}, c.code))
			})
		]
	});
}
function InvoicesTab() {
	const { orders, userProfile } = useStore();
	const [selectedInvoice, setSelectedInvoice] = (0, import_react.useState)(null);
	const totalSpent = orders.reduce((s, o) => s + o.total, 0);
	const totalTax = orders.reduce((s, o) => s + o.tax, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			selectedInvoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-gray-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold text-gray-900 font-display",
								children: "RiderzPro Official GST Invoice"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-gray-500 font-mono",
								children: ["Invoice #", selectedInvoice.id]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedInvoice(null),
								className: "p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Date: ", new Date(selectedInvoice.createdAt).toLocaleDateString("en-IN")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Payment Mode: ", selectedInvoice.payment] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100",
									children: selectedInvoice.groups.map((g) => {
										const v = getVendor(g.vendorId);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "py-2 first:pt-0 last:pb-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-gray-800",
												children: v?.name || "Verified EV Vendor"
											}), g.items.map((it) => {
												const p = getProduct(it.productId);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-gray-600 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														it.qty,
														" × ",
														p?.name || "EV Spare"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-gray-900",
														children: inr(it.price * it.qty)
													})]
												}, it.productId);
											})]
										}, g.vendorId);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Spares Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedInvoice.itemsTotal) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Express Courier & Delivery Fee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedInvoice.deliveryTotal) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IGST / CGST+SGST (18%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(selectedInvoice.tax) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: inr(selectedInvoice.total)
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3 border-t border-gray-100 flex justify-end gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									toast.success(`Invoice ${selectedInvoice.id}.pdf downloaded`);
									setSelectedInvoice(null);
								},
								className: "px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-emerald-600 transition flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download PDF Receipt" })]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-gray-900 font-display",
					children: "Payments & Invoices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Download GST tax invoices, review payment methods, and reconcile parts purchases."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider block",
								children: "Total Invoiced"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-extrabold text-gray-900 font-display mt-1",
								children: inr(totalSpent)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-gray-500",
								children: [orders.length, " transactions total"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider block",
								children: "Total GST Input Credit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-extrabold text-gray-900 font-display mt-1",
								children: inr(totalTax)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-gray-500",
								children: "18% GST itemized"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs col-span-2 sm:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider block",
								children: "Billing Profile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-bold text-gray-900 mt-1",
								children: userProfile?.name?.trim() || "Customer Account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-emerald-600 font-semibold",
								children: userProfile?.email?.trim() || "Active Consumer"
							})
						]
					})
				]
			}),
			orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-12 rounded-3xl border border-dashed border-gray-300 bg-white text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-10 w-10 text-gray-300 mx-auto mb-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-gray-700",
						children: "No Invoices Generated Yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-500 mt-0.5",
						children: "Tax receipts and billing history will appear here once an order is placed."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[10px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "Invoice #"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "Vendors"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "Payment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "GST (18%)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-100 text-gray-700 font-medium",
							children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50/80 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4 font-mono font-bold text-gray-900",
										children: ["INV-", o.id]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-gray-500",
										children: new Date(o.createdAt).toLocaleDateString("en-IN")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3.5 px-4",
										children: [
											o.groups.length,
											" EV Vendor",
											o.groups.length > 1 ? "s" : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[11px]",
											children: o.payment
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-gray-500",
										children: inr(o.tax)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 font-bold text-gray-900",
										children: inr(o.total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setSelectedInvoice(o),
												className: "p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition",
												title: "View Invoice",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => toast.success(`Invoice INV-${o.id}.pdf downloaded`),
												className: "p-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition",
												title: "Download PDF",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
											})]
										})
									})
								]
							}, o.id))
						})]
					})
				})
			})
		]
	});
}
function NotificationsTab() {
	const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const filtered = notifications.filter((n) => {
		if (filter === "unread") return !n.read;
		if (filter === "orders") return n.type === "order";
		if (filter === "service") return n.type === "service";
		return true;
	});
	const getIcon = (type) => {
		switch (type) {
			case "order": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-blue-600" });
			case "service": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 text-purple-600" });
			case "offer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-600" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-primary" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-gray-900 font-display",
					children: "Notifications & Alerts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "Stay updated with live GPS delivery milestones, technician arrivals, and battery health alerts."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						markAllNotificationsRead();
						toast.success("All notifications marked as read");
					},
					className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mark All Read" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					{
						id: "all",
						label: `All (${notifications.length})`
					},
					{
						id: "unread",
						label: `Unread (${notifications.filter((n) => !n.read).length})`
					},
					{
						id: "orders",
						label: "Orders"
					},
					{
						id: "service",
						label: "Technician & Care"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(t.id),
					className: `px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${filter === t.id ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"}`,
					children: t.label
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 rounded-3xl border border-dashed border-gray-300 bg-white text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-8 w-8 text-gray-300 mx-auto mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-gray-700",
							children: "No Notifications"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500 mt-0.5",
							children: "You are completely up to date."
						})
					]
				}) : filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => markNotificationRead(n.id),
					className: `p-4 rounded-3xl border bg-white shadow-2xs hover:shadow-md transition cursor-pointer flex items-start gap-4 ${n.read ? "opacity-75 border-gray-200" : "border-emerald-200 bg-emerald-50/20 ring-1 ring-emerald-100"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-2xl bg-gray-100 shrink-0 mt-0.5",
							children: getIcon(n.type)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-gray-900",
									children: n.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-gray-400 shrink-0",
									children: n.time
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-600 mt-1 leading-relaxed",
								children: n.message
							})]
						}),
						!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-primary shrink-0 self-center" })
					]
				}, n.id))
			})
		]
	});
}
function SettingsTab() {
	const { userProfile, updateUserProfile, selectAddress, addAddress, updateAddress, removeAddress } = useStore();
	const [name, setName] = (0, import_react.useState)(userProfile.name);
	const [email, setEmail] = (0, import_react.useState)(userProfile.email);
	const [phone, setPhone] = (0, import_react.useState)(userProfile.phone);
	const addresses = Array.isArray(userProfile.addresses) ? userProfile.addresses : [];
	const selectedAddressId = userProfile.selectedAddressId || addresses[0]?.id;
	const [isAddingAddress, setIsAddingAddress] = (0, import_react.useState)(false);
	const [newTag, setNewTag] = (0, import_react.useState)("Home");
	const [newName, setNewName] = (0, import_react.useState)(userProfile.name || "");
	const [newPhone, setNewPhone] = (0, import_react.useState)(userProfile.phone || "");
	const [newStreet, setNewStreet] = (0, import_react.useState)("");
	const [newCity, setNewCity] = (0, import_react.useState)(userProfile.city || "");
	const [newPincode, setNewPincode] = (0, import_react.useState)("");
	const [editingAddressId, setEditingAddressId] = (0, import_react.useState)(null);
	const [editTag, setEditTag] = (0, import_react.useState)("");
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editPhone, setEditPhone] = (0, import_react.useState)("");
	const [editStreet, setEditStreet] = (0, import_react.useState)("");
	const [editCity, setEditCity] = (0, import_react.useState)("");
	const [editPincode, setEditPincode] = (0, import_react.useState)("");
	const [notificationsEnabled, setNotificationsEnabled] = (0, import_react.useState)(true);
	const [whatsappEnabled, setWhatsappEnabled] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setName(userProfile.name);
		setEmail(userProfile.email);
		setPhone(userProfile.phone);
	}, [
		userProfile.name,
		userProfile.email,
		userProfile.phone
	]);
	const handleSavePersonal = (e) => {
		e.preventDefault();
		updateUserProfile({
			name,
			email,
			phone
		});
		toast.success("Personal details updated successfully!");
	};
	const handleSelectAddress = (id, tag) => {
		selectAddress(id);
		toast.success(`Selected "${tag}" as your active delivery address!`);
	};
	const handleStartEdit = (addr) => {
		setEditingAddressId(addr.id);
		setEditTag(addr.tag);
		setEditName(addr.name);
		setEditPhone(addr.phone);
		setEditStreet(addr.street);
		setEditCity(addr.city);
		setEditPincode(addr.pincode);
		setIsAddingAddress(false);
	};
	const handleSaveEdit = (id) => {
		if (!editStreet.trim() || !editCity.trim() || !editPincode.trim()) {
			toast.error("Please fill in all address fields");
			return;
		}
		updateAddress(id, {
			tag: editTag || "Home",
			name: editName || userProfile.name,
			phone: editPhone || userProfile.phone,
			street: editStreet.trim(),
			city: editCity.trim(),
			pincode: editPincode.trim()
		});
		setEditingAddressId(null);
		toast.success("Delivery address updated successfully!");
	};
	const handleCreateAddress = (e) => {
		e.preventDefault();
		if (!newStreet.trim() || !newCity.trim() || !newPincode.trim()) {
			toast.error("Please fill in all address fields");
			return;
		}
		addAddress({
			tag: newTag,
			name: newName.trim() || userProfile.name,
			phone: newPhone.trim() || userProfile.phone,
			street: newStreet.trim(),
			city: newCity.trim(),
			pincode: newPincode.trim()
		});
		setIsAddingAddress(false);
		setNewStreet("");
		toast.success(`New address "${newTag}" added and selected as active delivery destination!`);
	};
	const handleDeleteAddress = (id, tag) => {
		if (addresses.length <= 1) {
			toast.error("You must maintain at least one delivery address in your profile.");
			return;
		}
		removeAddress(id);
		toast.info(`Removed address "${tag}".`);
	};
	const getTagIcon = (tag) => {
		const lower = tag.toLowerCase();
		if (lower.includes("home")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" });
		if (lower.includes("office") || lower.includes("work")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" });
		if (lower.includes("workshop") || lower.includes("garage")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" });
	};
	const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 animate-in fade-in duration-200 max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-4 border-b border-[#E5E7EB]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-extrabold text-[#111111] font-display",
					children: "Profile & Delivery Addresses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-[#6B7280] mt-1",
					children: "Manage your personal identity, select your active delivery destination, and configure dispatch alerts."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-[#111111] font-display",
								children: "Delivery Addresses"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#6B7280] mt-1",
							children: "Select which address you want to receive parts, accessories, and doorstep technician visits at."
						})] }), !isAddingAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setIsAddingAddress(true);
								setEditingAddressId(null);
								setNewName(userProfile.name);
								setNewPhone(userProfile.phone);
							},
							id: "btn-add-address",
							className: "flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 active:scale-95 transition shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add New Address" })]
						})]
					}),
					activeAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start sm:items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-emerald-900",
									children: "Current Selected Delivery Address:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-900",
									children: activeAddress.tag
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-emerald-800 truncate mt-0.5",
								children: [
									activeAddress.street,
									", ",
									activeAddress.city,
									" - ",
									activeAddress.pincode,
									" (",
									activeAddress.name,
									")"
								]
							})]
						})]
					}),
					isAddingAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateAddress,
						className: "rounded-2xl border border-red-200 bg-red-50/30 p-5 space-y-4 animate-in fade-in zoom-in-98 duration-150",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-red-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-bold text-[#111111] flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 text-[#E31E24]" }), " Add New Delivery Address"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsAddingAddress(false),
									className: "p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-gray-700 mb-1",
										children: "Address Tag / Label"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2",
										children: [
											"Home",
											"Office",
											"Workshop",
											"Other"
										].map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setNewTag(tag),
											className: cn("flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition", newTag === tag ? "bg-[#E31E24] text-white border-[#E31E24]" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"),
											children: tag
										}, tag))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-gray-700 mb-1",
										children: "Recipient Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: newName,
										onChange: (e) => setNewName(e.target.value),
										placeholder: "e.g. Aakash Sharma",
										className: "w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]",
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-gray-700 mb-1",
										children: "Contact Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										value: newPhone,
										onChange: (e) => setNewPhone(e.target.value),
										placeholder: "+91 98765 43210",
										className: "w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]",
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-gray-700 mb-1",
										children: "Pincode"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: newPincode,
										onChange: (e) => setNewPincode(e.target.value),
										placeholder: "e.g. 560066",
										className: "w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]",
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-700 mb-1",
											children: "Flat, Villa, Apartment, Street & Locality"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											value: newStreet,
											onChange: (e) => setNewStreet(e.target.value),
											placeholder: "e.g. Villa 42, Palm Meadows, Whitefield",
											className: "w-full rounded-xl border border-gray-300 bg-white p-3 text-xs outline-none focus:border-[#E31E24]",
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-700 mb-1",
											children: "City & State"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: newCity,
											onChange: (e) => setNewCity(e.target.value),
											placeholder: "e.g. Bengaluru, Karnataka",
											className: "w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]",
											required: true
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsAddingAddress(false),
									className: "px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									id: "btn-save-new-address",
									className: "px-5 py-2 rounded-xl bg-[#E31E24] text-xs font-semibold text-white hover:bg-red-700 shadow-2xs active:scale-95 transition",
									children: "Save & Select Address"
								})]
							})
						]
					}),
					addresses.length === 0 && !isAddingAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-8 text-center rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-gray-50/50 p-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-8 w-8 text-gray-400 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-gray-900",
								children: "No Delivery Addresses Added"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-500 mt-1 max-w-md mx-auto",
								children: "Add your delivery destination to receive parts, accessories, and doorstep maintenance services."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsAddingAddress(true),
								className: "inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 transition active:scale-95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Your Address" })]
							})
						]
					}),
					addresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: addresses.map((addr) => {
							const isSelected = addr.id === selectedAddressId;
							if (editingAddressId === addr.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-blue-400 bg-blue-50/20 p-5 space-y-3.5 shadow-sm md:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-2 border-b border-blue-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-bold text-blue-900 flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5 text-blue-600" }),
												" Editing Address (",
												addr.tag,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setEditingAddressId(null),
											className: "p-1 rounded text-gray-400 hover:text-gray-700",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-semibold text-gray-600 mb-1",
												children: "Tag / Label"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: editTag,
												onChange: (e) => setEditTag(e.target.value),
												className: "w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-semibold text-gray-600 mb-1",
												children: "Recipient Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: editName,
												onChange: (e) => setEditName(e.target.value),
												className: "w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-semibold text-gray-600 mb-1",
												children: "Contact Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "tel",
												value: editPhone,
												onChange: (e) => setEditPhone(e.target.value),
												className: "w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-semibold text-gray-600 mb-1",
												children: "Pincode"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: editPincode,
												onChange: (e) => setEditPincode(e.target.value),
												className: "w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-semibold text-gray-600 mb-1",
													children: "Street Address"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 2,
													value: editStreet,
													onChange: (e) => setEditStreet(e.target.value),
													className: "w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs outline-none focus:border-[#E31E24]"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-semibold text-gray-600 mb-1",
													children: "City & State"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: editCity,
													onChange: (e) => setEditCity(e.target.value),
													className: "w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs outline-none focus:border-[#E31E24]"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setEditingAddressId(null),
											className: "px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50",
											children: "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleSaveEdit(addr.id),
											className: "px-4 py-1.5 rounded-lg bg-[#E31E24] text-xs font-semibold text-white hover:bg-red-700",
											children: "Save Changes"
										})]
									})
								]
							}, addr.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => handleSelectAddress(addr.id, addr.tag),
								className: cn("relative rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between group", isSelected ? "border-2 border-[#E31E24] bg-red-50/20 shadow-xs ring-1 ring-red-100" : "border border-[#E5E7EB] bg-white hover:border-gray-400 hover:shadow-2xs"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 text-xs font-bold text-[#111111]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn(isSelected ? "text-[#E31E24]" : "text-gray-500"),
											children: getTagIcon(addr.tag)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: addr.tag })]
									}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Active Delivery"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-gray-500 group-hover:text-[#E31E24] transition",
										children: "Click to select →"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3.5 space-y-1 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-[#111111]",
											children: addr.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-gray-700 leading-relaxed",
											children: addr.street
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-gray-600 font-medium",
											children: [
												addr.city,
												" · ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-gray-800",
													children: addr.pincode
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-gray-500 pt-1",
											children: ["Phone: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-800 font-medium",
												children: addr.phone
											})]
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs",
									onClick: (e) => e.stopPropagation(),
									children: [!isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleSelectAddress(addr.id, addr.tag),
										className: "font-bold text-[#E31E24] hover:underline flex items-center gap-1 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3 w-3" }), " Select This Address"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 font-semibold text-[11px] flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }), " Selected"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleStartEdit(addr),
											className: "p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition",
											title: "Edit this address",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" })
										}), addresses.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleDeleteAddress(addr.id, addr.tag),
											className: "p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition",
											title: "Delete this address",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})]
								})]
							}, addr.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSavePersonal,
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-[#E5E7EB]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-[#E31E24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-[#111111] font-display",
									children: "Personal Profile"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#6B7280] mt-0.5",
								children: "Your legal name and primary contact details for billing and GST tax invoices."
							})] }), (userProfile?.points || 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200",
									children: [userProfile.points, " ProPoints"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
									children: "Full Legal Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: name,
										onChange: (e) => setName(e.target.value),
										className: "w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
									children: "Primary Phone Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										className: "w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
										children: "Account Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											className: "w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24]",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								id: "btn-save-personal",
								className: "px-6 py-2.5 rounded-2xl bg-[#111111] text-white text-xs font-semibold shadow-xs hover:bg-[#E31E24] active:scale-95 transition flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save Personal Information" })]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold text-[#111111] font-display",
						children: "Communication & Dispatch Alerts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: notificationsEnabled,
								onChange: (e) => {
									setNotificationsEnabled(e.target.checked);
									toast.success(e.target.checked ? "SMS alerts enabled" : "SMS alerts paused");
								},
								className: "h-4 w-4 rounded accent-[#E31E24]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-gray-700 font-medium",
								children: "Receive live SMS dispatch alerts, courier tracking numbers, and doorstep technician arrival OTPs"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: whatsappEnabled,
								onChange: (e) => {
									setWhatsappEnabled(e.target.checked);
									toast.success(e.target.checked ? "WhatsApp notifications enabled" : "WhatsApp notifications paused");
								},
								className: "h-4 w-4 rounded accent-[#E31E24]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-gray-700 font-medium",
								children: "Receive WhatsApp updates with digital GST tax invoices and Delhivery/BlueDart live tracking links"
							})]
						})]
					})]
				})]
			})
		]
	});
}
function SupportTab() {
	const [openFaq, setOpenFaq] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200 max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-4 border-b border-gray-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold text-gray-900 font-display",
					children: "Help, Roadside & Support"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mt-0.5",
					children: "24/7 emergency EV towing, technician helpline, and comprehensive fitment guidance."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-3xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-12 w-12 place-items-center rounded-2xl bg-rose-500 text-white shadow-xs shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider",
							children: "Emergency SOS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-gray-900 font-display",
							children: "24/7 Roadside EV Assistance"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-600 mt-0.5",
						children: "Stranded due to battery drain, motor stall, or flat tire? Call our dispatch center for instant emergency assistance."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "tel:+918045678900",
					className: "px-5 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-semibold shadow-xs hover:bg-rose-700 active:scale-95 transition flex items-center justify-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Call +91 80 4567 8900" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 rounded-3xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-gray-900 font-display",
						children: "Volt — AI Parts & Fitment Assistant"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-600",
						children: "Ask questions by voice or text to find exact battery replacements instantly."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/assistant",
					className: "px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition shrink-0",
					children: "Talk to Volt"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 rounded-3xl border border-gray-200 bg-white shadow-2xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-gray-900 font-display",
					children: "Frequently Asked Questions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-gray-100",
					children: [
						{
							q: "How does RiderzPro guarantee 100% EV part fitment?",
							a: "Every part in our catalog is mapped to OEM frame numbers, battery voltages (48V, 60V, 72V), and connector pinouts. When you decode your 17-digit VIN or pick your model from My Garage, we filter and display only verified compatible items."
						},
						{
							q: "What does the ₹299 Doorstep Technician service cover?",
							a: "Our certified technicians arrive with digital battery impedance testers and BMS calibration scanners. They perform cell voltage drift checks, terminal torque verification, IP67 seal inspections, and brake pad wear analysis right at your home or office."
						},
						{
							q: "How fast is express parts delivery in Bengaluru?",
							a: "Orders are dispatched directly from verified nearby EV vendor hubs (Indiranagar, Koramangala, Jayanagar, Hebbal). Typical doorstep delivery time is between 25 to 45 minutes, with live GPS rider tracking available on your dashboard."
						},
						{
							q: "What is your return & replacement policy?",
							a: "We offer a 7-day hassle-free replacement on any unopened or defective EV battery, charger, or controller. All items also include manufacturer warranties ranging from 12 to 48 months."
						}
					].map((faq, idx) => {
						const isOpen = openFaq === idx;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpenFaq(isOpen ? null : idx),
								className: "w-full flex items-center justify-between text-left text-xs font-bold text-gray-900 hover:text-primary transition py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: faq.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}` })]
							}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-600 mt-2 leading-relaxed animate-in fade-in duration-150",
								children: faq.a
							})]
						}, faq.q);
					})
				})]
			})
		]
	});
}
function BookingModal({ isOpen, onClose }) {
	const { garage, activeBikeId, bookService, userProfile } = useStore();
	const [bikeId, setBikeId] = (0, import_react.useState)(activeBikeId || garage[0]?.bikeId || "ola-s1pro");
	const [serviceType, setServiceType] = (0, import_react.useState)("24-Point EV Health & BMS Diagnostic");
	const [slot, setSlot] = (0, import_react.useState)("Tomorrow, 10:30 AM");
	const [locationType, setLocationType] = (0, import_react.useState)("doorstep");
	const [address, setAddress] = (0, import_react.useState)(userProfile.address || "Bellandur, Bengaluru");
	const [notes, setNotes] = (0, import_react.useState)("");
	if (!isOpen) return null;
	const services = [
		{
			name: "24-Point EV Health & BMS Diagnostic",
			price: 299,
			time: "45 mins"
		},
		{
			name: "Battery Capacity & Cell Balancing Check",
			price: 499,
			time: "60 mins"
		},
		{
			name: "Brake Pads Overhaul & Hydraulic Bleed",
			price: 349,
			time: "40 mins"
		},
		{
			name: "Fast Charger Home Installation & Wiring",
			price: 799,
			time: "90 mins"
		}
	];
	const currentService = services.find((s) => s.name === serviceType) || services[0];
	const slots = [
		"Today, 4:00 PM",
		"Today, 6:30 PM",
		"Tomorrow, 10:30 AM",
		"Tomorrow, 2:00 PM",
		"Saturday, 11:00 AM"
	];
	const handleConfirm = () => {
		bookService({
			bikeId,
			serviceType,
			slot,
			location: locationType === "doorstep" ? `Doorstep (${address.slice(0, 24)}...)` : "VoltHub Workshop, Indiranagar",
			status: "Confirmed",
			technician: "Assigned EV Specialist",
			cost: currentService.price
		});
		toast.success("Service technician booked!", { description: `${serviceType} scheduled for ${slot}.` });
		onClose();
	};
	getBike(bikeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-5 border-b border-gray-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-gray-900 font-display",
							children: "Book an EV Technician"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Certified technicians with calibrated EV diagnostic scanners."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 overflow-y-auto space-y-5 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2",
							children: "Select Vehicle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: bikeId,
							onChange: (e) => setBikeId(e.target.value),
							className: "w-full h-11 rounded-2xl border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none focus:border-primary",
							children: garage.map((g) => {
								const b = getBike(g.bikeId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: g.bikeId,
									children: [
										b.make,
										" ",
										b.model,
										" (",
										g.year ?? 2023,
										") — ",
										g.regNo || "KA 01 EQ 8821"
									]
								}, g.bikeId);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2",
							children: "Service Package"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setServiceType(s.name),
								className: `p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${serviceType === s.name ? "border-primary bg-emerald-50/60 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300 bg-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-gray-900",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-gray-500",
									children: [
										"Duration: ",
										s.time,
										" · Doorstep kit included"
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-extrabold text-gray-900 text-sm",
									children: inr(s.price)
								})]
							}, s.name))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2",
								children: "Service Location"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLocationType("doorstep"),
									className: `py-2 px-3 rounded-xl border text-xs font-semibold transition ${locationType === "doorstep" ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`,
									children: "Doorstep Visit (Home/Office)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLocationType("workshop"),
									className: `py-2 px-3 rounded-xl border text-xs font-semibold transition ${locationType === "workshop" ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`,
									children: "Drive to Workshop (Indiranagar)"
								})]
							}),
							locationType === "doorstep" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: address,
								onChange: (e) => setAddress(e.target.value),
								placeholder: "Doorstep address in Bengaluru",
								className: "mt-2 w-full h-10 rounded-xl border border-gray-300 px-3 text-xs text-gray-900 outline-none focus:border-primary"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2",
							children: "Select Date & Time Slot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSlot(s),
								className: `px-3 py-1.5 rounded-xl border text-xs font-medium transition ${slot === s ? "border-primary bg-primary text-white font-semibold" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`,
								children: s
							}, s))
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-gray-400 uppercase font-semibold block",
						children: "Total Booking Fee"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-extrabold text-gray-900",
						children: inr(currentService.price)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleConfirm,
							className: "px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition",
							children: "Confirm Booking"
						})]
					})]
				})
			]
		})
	});
}
function AddBikeModal({ isOpen, onClose }) {
	const { addBike } = useStore();
	const [mode, setMode] = (0, import_react.useState)("vin");
	const [vin, setVin] = (0, import_react.useState)("");
	const [bikeId, setBikeId] = (0, import_react.useState)(bikes[0].id);
	const [year, setYear] = (0, import_react.useState)(bikes[0].years.at(-1));
	const [regNo, setRegNo] = (0, import_react.useState)("");
	const [nickname, setNickname] = (0, import_react.useState)("");
	if (!isOpen) return null;
	const sel = getBike(bikeId);
	const handleDecode = () => {
		const r = decodeVin(vin);
		if (!r.ok || !r.bike) return toast.error(r.error || "Invalid VIN");
		addBike({
			bikeId: r.bike.id,
			year: r.year,
			vin: vin.toUpperCase(),
			regNo: regNo || "KA 01 EQ 9000",
			nickname: nickname || `${r.bike.make} ${r.bike.model}`,
			odoKm: 5e3,
			batteryHealth: 99,
			nextServiceDays: 60
		});
		toast.success(`${r.bike.make} ${r.bike.model} (${r.year ?? "2024"}) added to your garage!`);
		onClose();
	};
	const handleManualAdd = () => {
		addBike({
			bikeId,
			year,
			regNo: regNo || "KA 01 EV 1234",
			nickname: nickname || `${sel.make} ${sel.model}`,
			odoKm: 8500,
			batteryHealth: 97,
			nextServiceDays: 45
		});
		toast.success(`${sel.make} ${sel.model} added to your garage!`);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-5 border-b border-gray-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-gray-900 font-display",
							children: "Add Electric Vehicle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: "Ensure 100% verified battery, charger & brake rotor fitment."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 pt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("vin"),
						className: `flex-1 py-2 text-xs font-semibold rounded-xl border transition ${mode === "vin" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`,
						children: "Decode 17-Digit VIN"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("manual"),
						className: `flex-1 py-2 text-xs font-semibold rounded-xl border transition ${mode === "manual" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`,
						children: "Pick Manually by Model"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 space-y-4",
					children: mode === "vin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
								children: "Vehicle Identification Number (VIN)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: vin,
									onChange: (e) => setVin(e.target.value),
									maxLength: 17,
									placeholder: "e.g. MD9A450XAN1234567",
									className: "flex-1 h-11 rounded-2xl border border-gray-300 px-3.5 font-mono text-sm uppercase tracking-wider outline-none focus:border-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleDecode,
									disabled: vin.length < 17,
									className: "px-4 h-11 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs disabled:opacity-40 hover:bg-emerald-600 transition",
									children: "Decode & Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-gray-500 mt-1",
								children: [
									vin.length,
									"/17 characters · Sample VINs:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVin("MD9A450XAN1234567"),
										className: "text-primary underline font-mono",
										children: "Ather"
									}),
									" ",
									"or",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVin("P6R1S1PR2PN000001"),
										className: "text-primary underline font-mono",
										children: "Ola"
									})
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
							children: "Registration Number (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: regNo,
							onChange: (e) => setRegNo(e.target.value),
							placeholder: "e.g. KA 01 EQ 8821",
							className: "w-full h-10 rounded-xl border border-gray-300 px-3.5 text-xs uppercase outline-none focus:border-primary"
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
									children: "Manufacturer & Model"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: bikeId,
									onChange: (e) => {
										setBikeId(e.target.value);
										setYear(getBike(e.target.value).years.at(-1));
									},
									className: "w-full h-11 rounded-2xl border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-primary",
									children: bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: b.id,
										children: [
											b.make,
											" ",
											b.model
										]
									}, b.id))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
									children: "Model Year"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: year,
									onChange: (e) => setYear(+e.target.value),
									className: "w-full h-11 rounded-2xl border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-primary",
									children: sel.years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: y,
										children: y
									}, y))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
								children: "Vehicle Plate Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: regNo,
								onChange: (e) => setRegNo(e.target.value),
								placeholder: "e.g. KA 05 EV 4410",
								className: "w-full h-10 rounded-xl border border-gray-300 px-3.5 text-xs uppercase outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5",
								children: "Custom Nickname (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: nickname,
								onChange: (e) => setNickname(e.target.value),
								placeholder: "e.g. Daily Commuter",
								className: "w-full h-10 rounded-xl border border-gray-300 px-3.5 text-xs outline-none focus:border-primary"
							})] })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition",
						children: "Cancel"
					}), mode === "manual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleManualAdd,
						className: "px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition",
						children: "Add to Garage"
					})]
				})
			]
		})
	});
}
function CustomerDashboardRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtectedRoute, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDashboard, {}) });
}
function CustomerDashboard() {
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [isBookingOpen, setIsBookingOpen] = (0, import_react.useState)(false);
	const [isAddBikeOpen, setIsAddBikeOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleUrl = () => {
			if (typeof window !== "undefined") {
				const t = new URLSearchParams(window.location.search).get("tab");
				if (t) setTab(t);
			}
		};
		handleUrl();
		window.addEventListener("popstate", handleUrl);
		return () => window.removeEventListener("popstate", handleUrl);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CustomerLayout, {
			activeTab: tab,
			onTabChange: (newTab) => {
				setTab(newTab);
				if (typeof window !== "undefined") {
					const url = new URL(window.location.href);
					url.searchParams.set("tab", newTab);
					window.history.pushState({}, "", url.toString());
				}
			},
			onOpenBookingModal: () => setIsBookingOpen(true),
			children: [
				tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewTab, {
					onTabChange: setTab,
					onOpenBookingModal: () => setIsBookingOpen(true),
					onOpenAddBikeModal: () => setIsAddBikeOpen(true)
				}),
				tab === "shop" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopTab, {}),
				tab === "garage" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarageTab, {
					onOpenAddBikeModal: () => setIsAddBikeOpen(true),
					onOpenBookingModal: () => setIsBookingOpen(true)
				}),
				tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersTab, {}),
				tab === "tracking" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackingTab, {}),
				tab === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedTab, {}),
				tab === "service" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceTab, { onOpenBookingModal: () => setIsBookingOpen(true) }),
				tab === "addresses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {}),
				tab === "offers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OffersTab, {}),
				tab === "invoices" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoicesTab, {}),
				tab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsTab, {}),
				tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {}),
				tab === "support" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportTab, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingModal, {
			isOpen: isBookingOpen,
			onClose: () => setIsBookingOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBikeModal, {
			isOpen: isAddBikeOpen,
			onClose: () => setIsAddBikeOpen(false)
		})
	] });
}
//#endregion
export { CustomerDashboardRoute as component };

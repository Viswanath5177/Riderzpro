import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, It as Check, Jt as Battery, Kt as Bike, O as Search, Qt as ArrowUp, S as Shield, Y as MapPin, Zt as Award, b as ShoppingCart, c as Truck, d as Tag, dt as HardHat, g as Sparkles, p as Store, r as Wrench, tn as ArrowRight, zt as Car } from "../_libs/lucide-react.mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as products, c as bestOffer, l as bikes, u as decodeVin, v as hero_bike_default, w as useStore, y as inr } from "./bits-6XfYm-PF.mjs";
import { t as SiteLayout } from "./SiteLayout-CGSp9TSN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dfr68sme.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BikeFinder() {
	const navigate = useNavigate();
	const { addBike } = useStore();
	const [tab, setTab] = (0, import_react.useState)("bike");
	const [selectedBikeId, setSelectedBikeId] = (0, import_react.useState)(bikes[0].id);
	const [vinInput, setVinInput] = (0, import_react.useState)("");
	const handleFindParts = (e) => {
		e.preventDefault();
		if (tab === "vin") {
			if (!vinInput.trim()) {
				toast.error("Please enter a VIN number");
				return;
			}
			const res = decodeVin(vinInput.trim());
			if (!res.ok || !res.bike) {
				toast.error(res.error || "Invalid VIN number. Please verify.");
				return;
			}
			addBike({
				bikeId: res.bike.id,
				year: res.year,
				vin: vinInput.toUpperCase()
			});
			toast.success(`Matched ${res.bike.make} ${res.bike.model}${res.year ? ` (${res.year})` : ""}`);
			navigate({ to: "/shop" });
		} else {
			const selectedBike = bikes.find((b) => b.id === selectedBikeId) || bikes[0];
			addBike({ bikeId: selectedBike.id });
			toast.success(`Selected ${selectedBike.make} ${selectedBike.model}`);
			navigate({ to: "/shop" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "bike-finder",
		className: "rounded-2xl border border-[#ececec] bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex rounded-xl bg-[#f7f7f8] p-1 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("bike"),
				className: `flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${tab === "bike" ? "bg-white text-[#111111] shadow-xs" : "text-[#6b7280] hover:text-[#111111]"}`,
				children: "Pick my bike"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab("vin"),
				className: `flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${tab === "vin" ? "bg-white text-[#111111] shadow-xs" : "text-[#6b7280] hover:text-[#111111]"}`,
				children: "Enter VIN"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleFindParts,
			className: "flex flex-col sm:flex-row gap-2.5",
			children: [tab === "bike" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-12 w-full items-center gap-2.5 rounded-xl border border-[#ececec] bg-[#f7f7f8] px-3.5 focus-within:border-[#e11d2a] focus-within:bg-white transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-4 w-4 text-[#e11d2a] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: selectedBikeId,
						onChange: (e) => setSelectedBikeId(e.target.value),
						className: "w-full bg-transparent text-xs sm:text-sm font-semibold text-[#111111] outline-none cursor-pointer",
						children: bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: b.id,
							children: [
								b.make,
								" ",
								b.model,
								" · ",
								b.voltage,
								"V (",
								b.years[0],
								"–",
								b.years[b.years.length - 1],
								")"
							]
						}, b.id))
					})]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-12 w-full items-center gap-2.5 rounded-xl border border-[#ececec] bg-[#f7f7f8] px-3.5 focus-within:border-[#e11d2a] focus-within:bg-white transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-[#e11d2a] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: vinInput,
						onChange: (e) => setVinInput(e.target.value.toUpperCase()),
						maxLength: 17,
						placeholder: "Enter 17-digit VIN (e.g. P6R1S1PR2PN000001)",
						className: "w-full bg-transparent text-xs sm:text-sm font-mono font-semibold text-[#111111] uppercase placeholder:font-sans placeholder:text-[#6b7280] outline-none"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				className: "flex h-12 items-center justify-center gap-2 rounded-xl bg-[#e11d2a] hover:bg-[#c91823] px-6 text-xs sm:text-sm font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Find parts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})]
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white py-12 lg:py-20 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-[#f7f7f8] px-3.5 py-1 text-xs font-semibold text-[#111111]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Serving Bengaluru" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.1] font-extrabold tracking-tight text-[#111111]",
							children: ["Power your ride. Parts that ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#e11d2a]",
								children: "fit."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base sm:text-lg text-[#6b7280] font-normal leading-relaxed",
							children: "Batteries, chargers and spares matched to your vehicle, delivered by riders you can track."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BikeFinder, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-semibold text-[#4b5563]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-[#e11d2a] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% fitment guaranteed" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-[#e11d2a] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live rider tracking" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4 text-[#e11d2a] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified sellers" })]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-2xl border border-[#ececec] bg-[#f7f7f8] shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_bike_default,
							alt: "Electric motorcycle maintenance and compatible EV battery pack",
							width: 800,
							height: 600,
							className: "h-full w-full object-cover object-center max-h-[460px] transition-transform duration-500 hover:scale-[1.02]"
						})
					})
				})]
			})
		})
	});
}
var categories = [
	{
		title: "Electric Bikes",
		desc: "Smart performance electric motorcycles & commuters",
		cat: "Electric Bikes",
		icon: Bike
	},
	{
		title: "Batteries & Chargers",
		desc: "OEM replacement packs, BMS & portable fast chargers",
		cat: "Battery",
		icon: Battery
	},
	{
		title: "Spare Parts",
		desc: "Disc rotors, ceramic pads, drive belts & hub motors",
		cat: "Spare Parts",
		icon: Wrench
	},
	{
		title: "Bike Accessories",
		desc: "Waterproof covers, sirens, disc locks & phone mounts",
		cat: "Bike Accessories",
		icon: Shield
	},
	{
		title: "Car Accessories",
		desc: "Dashcams, 150PSI tire inflators & Level-2 wallboxes",
		cat: "Car Accessories",
		icon: Car
	},
	{
		title: "Riding Gear & Helmets",
		desc: "ECE 22.06 helmets, CE Level-2 armored jackets & gloves",
		cat: "Riding Gear & Helmets",
		icon: HardHat
	}
];
function CategoryGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#f7f7f8] py-16 lg:py-24 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-8 lg:mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]",
					children: "Shop by category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#6b7280] mt-1",
					children: "Select a department to explore compatible products"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					className: "group inline-flex items-center gap-1 text-sm font-semibold text-[#e11d2a] hover:text-[#c91823] transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View all" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
				children: categories.map((c) => {
					const Icon = c.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { cat: c.cat },
						className: "group relative flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-6 transition-all duration-200 hover:border-[#e11d2a] hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7f7f8] text-[#111111] transition-colors group-hover:bg-red-50 group-hover:text-[#e11d2a] mb-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111] transition-colors group-hover:text-[#e11d2a]",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[#6b7280] mt-1.5 leading-relaxed",
								children: c.desc
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#e11d2a] opacity-0 transition-opacity group-hover:opacity-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Browse department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})]
					}, c.title);
				})
			})]
		})
	});
}
var steps = [
	{
		number: "01",
		title: "Select your vehicle",
		description: "Saved to My Garage so you only ever browse parts verified for your exact model and voltage.",
		icon: Bike
	},
	{
		number: "02",
		title: "Get parts that fit",
		description: "We filter and show only compatible batteries, chargers and replacement spares with 100% fitment guarantee.",
		icon: ShieldCheck
	},
	{
		number: "03",
		title: "Delivered and tracked",
		description: "A verified rider brings it straight from the nearest vendor hub, with real-time GPS live tracking.",
		icon: MapPin
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white py-16 lg:py-24 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto mb-12 lg:mb-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base text-[#6b7280] mt-2",
					children: "Three simple steps from selecting your vehicle to live delivery"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8",
				children: steps.map((step) => {
					const Icon = step.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-7 transition hover:shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-2xl font-extrabold text-[#e11d2a]",
									children: step.number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f7f8] text-[#111111]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111]",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[#6b7280] mt-2 leading-relaxed",
								children: step.description
							})
						] })
					}, step.number);
				})
			})]
		})
	});
}
function FeaturedProducts() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("batteries");
	const { addToCart, cart, activeBikeId } = useStore();
	const getFilteredProducts = () => {
		switch (activeTab) {
			case "batteries": return products.filter((p) => p.category === "Battery").slice(0, 8);
			case "chargers": return products.filter((p) => p.category === "Charger").slice(0, 8);
			case "spares": return products.filter((p) => [
				"Spare Parts",
				"Brakes",
				"Motor",
				"Controller",
				"BMS"
			].includes(p.category)).slice(0, 8);
			case "accessories": return products.filter((p) => [
				"Bike Accessories",
				"Car Accessories",
				"Riding Gear & Helmets"
			].includes(p.category)).slice(0, 8);
			default: return products.slice(0, 8);
		}
	};
	const currentProducts = getFilteredProducts();
	const handleAddToCart = (p) => {
		const offer = bestOffer(p);
		addToCart(p.id, offer.vendorId);
		toast.success("Added to cart", { description: `${p.name} added to your shopping bag.` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#f7f7f8] py-16 lg:py-24 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 lg:mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]",
					children: "Popular for your ride"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#6b7280] mt-1",
					children: "Top-rated components with verified compatibility"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-xl bg-white border border-[#ececec] p-1 self-start sm:self-auto overflow-x-auto max-w-full",
					children: [
						{
							id: "batteries",
							label: "Batteries"
						},
						{
							id: "chargers",
							label: "Chargers"
						},
						{
							id: "spares",
							label: "Spares"
						},
						{
							id: "accessories",
							label: "Accessories"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab(t.id),
						className: `rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap ${activeTab === t.id ? "bg-[#e11d2a] text-white shadow-xs" : "text-[#6b7280] hover:text-[#111111]"}`,
						children: t.label
					}, t.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 sm:pb-0 snap-x",
				children: currentProducts.map((p) => {
					const offer = bestOffer(p);
					const isInCart = cart.some((c) => c.productId === p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md min-w-[260px] sm:min-w-0 snap-start shrink-0 sm:shrink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8] mb-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/product/$id",
									params: { id: p.id },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.image,
										alt: p.name,
										loading: "lazy",
										width: 400,
										height: 400,
										className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Fits ", p.fits.length ? `${p.fits.length} EV Models` : "Universal"] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$id",
								params: { id: p.id },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-[#111111] line-clamp-2 hover:text-[#e11d2a] transition",
									children: p.name
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-[#ececec] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#6b7280]",
								children: "From"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-extrabold text-[#111111] tabular-nums",
								children: inr(offer.price)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleAddToCart(p),
								className: `flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${isInCart ? "bg-emerald-600 text-white" : "bg-[#e11d2a] hover:bg-[#c91823] text-white shadow-xs"}`,
								children: isInCart ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Added" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add" })] })
							})]
						})]
					}, p.id);
				})
			})]
		})
	});
}
var benefits = [
	{
		title: "Fitment guaranteed",
		description: "Every part is cross-verified against OEM chassis dimensions and battery voltages.",
		icon: ShieldCheck
	},
	{
		title: "Compare across sellers",
		description: "View pricing, inventory stock and dispatch speed from multiple certified local vendors.",
		icon: Store
	},
	{
		title: "Fast tracked delivery",
		description: "Live real-time rider tracking with direct calling and instant dispatch notifications.",
		icon: Truck
	},
	{
		title: "Genuine warranty",
		description: "Original brand warranties with easy warranty registration and digital service receipts.",
		icon: Award
	}
];
function WhyRiderzpro() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white py-16 lg:py-24 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-2xl mx-auto mb-12 lg:mb-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]",
						children: "Why Riderzpro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-[#6b7280] mt-2",
						children: "The reliable automotive platform built for EV riders, workshops and fleet owners"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: benefits.map((b) => {
						const Icon = b.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#ececec] bg-white p-6 transition hover:shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#e11d2a] mb-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-[#111111]",
									children: b.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#6b7280] mt-2 leading-relaxed",
									children: b.description
								})
							]
						}, b.title);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 mx-auto max-w-3xl rounded-xl border border-[#ececec] bg-[#f7f7f8] py-3.5 px-6 text-center text-xs sm:text-sm font-semibold text-[#4b5563]",
					children: "6+ verified sellers · 1.2k parts · 4.8★ rating · 38 min avg delivery"
				})
			]
		})
	});
}
var promos = [
	{
		tag: "LIMITED OFFER",
		title: "Flat ₹500 off on batteries",
		description: "Use coupon VOLT500 at checkout on lithium-ion and LiFePO4 packs above ₹10,000.",
		cta: "Claim offer",
		link: "/shop",
		search: { cat: "Battery" },
		icon: Tag
	},
	{
		tag: "BENGALURU LOCAL",
		title: "Free delivery above ₹999",
		description: "Automatically applied across all hub dispatches and doorstep express drop-offs.",
		cta: "Shop now",
		link: "/shop",
		search: {},
		icon: Truck
	},
	{
		tag: "GEAR & SAFETY",
		title: "10% off on accessories",
		description: "Protect your ride with certified alarms, waterproof covers, jackets and helmets.",
		cta: "Explore gear",
		link: "/shop",
		search: { cat: "Bike Accessories" },
		icon: Sparkles
	}
];
function OffersBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#f7f7f8] py-16 lg:py-20 border-b border-[#ececec]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-8 lg:mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]",
					children: "Current offers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[#6b7280] mt-1",
					children: "Active promotional discounts and dispatch vouchers"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/offers",
					className: "group inline-flex items-center gap-1 text-sm font-semibold text-[#e11d2a] hover:text-[#c91823] transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View all offers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6",
				children: promos.map((promo) => {
					const Icon = promo.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-red-50 border border-red-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#e11d2a]",
									children: promo.tag
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-[#e11d2a]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-[#111111]",
								children: promo.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-[#6b7280] mt-2 leading-relaxed",
								children: promo.description
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 pt-4 border-t border-[#ececec]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: promo.link,
								search: promo.search,
								className: "inline-flex items-center gap-1.5 text-xs font-bold text-[#e11d2a] hover:text-[#c91823] transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: promo.cta }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})
						})]
					}, promo.title);
				})
			})]
		})
	});
}
function FinalCTA() {
	const scrollToBikeFinder = () => {
		const el = document.getElementById("bike-finder");
		if (el) el.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		else window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-white py-16 lg:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative overflow-hidden rounded-3xl bg-[#e11d2a] p-8 sm:p-14 text-center text-white shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight",
							children: "Find parts that fit your bike"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base sm:text-lg text-white/90 font-normal leading-relaxed",
							children: "Select your vehicle or enter your VIN to unlock verified batteries, chargers and replacement spares."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: scrollToBikeFinder,
								className: "inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#111111] hover:bg-gray-100 transition active:scale-95 shadow-xs cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pick my bike" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4 text-[#e11d2a]" })]
							})
						})
					]
				})
			})
		})
	});
}
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryGrid, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedProducts, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyRiderzpro, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OffersBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCTA, {})
	] });
}
//#endregion
export { LandingPage as component };

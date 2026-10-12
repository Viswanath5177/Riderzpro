import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as PackageCheck, C as Search, G as Cpu, H as Gauge, I as MapPin, N as Mic, U as Disc, at as ArrowRight, d as Store, et as Bike, f as Star, nt as BatteryCharging, r as Wrench, s as Truck, t as Zap, tt as Battery, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { C as parts_default, D as useStore, a as ProductCard, c as battery_1_default, d as bikes, f as charger_default, l as battery_3_default, m as decodeVin, o as SectionTitle, w as products } from "./bits-PIC53EAH.mjs";
import { t as SiteLayout } from "./SiteLayout-tHh2v6uI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as scooter_default } from "./scooter-ILmB-gJJ.mjs";
import { t as rider_default } from "./rider-BEkdeuIu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dl5ZO7rK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_bike_default = "/assets/hero-bike-DadL1ogz.jpg";
var workshop_default = "/assets/workshop-Dml3A2bw.jpg";
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandStrip, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Categories, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Featured, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Roles, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCta, {})
	] });
}
function Hero() {
	const nav = useNavigate();
	const { addBike } = useStore();
	const [mode, setMode] = (0, import_react.useState)("bike");
	const [vin, setVin] = (0, import_react.useState)("");
	const [bikeId, setBikeId] = (0, import_react.useState)(bikes[0].id);
	const go = () => {
		if (mode === "vin") {
			const r = decodeVin(vin);
			if (!r.ok || !r.bike) return toast.error(r.error);
			addBike({
				bikeId: r.bike.id,
				year: r.year,
				vin: vin.toUpperCase()
			});
			toast.success(`Found ${r.bike.make} ${r.bike.model}${r.year ? ` (${r.year})` : ""}`);
		} else addBike({ bikeId });
		nav({ to: "/shop" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate min-h-[92svh] overflow-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: hero_bike_default,
				alt: "Electric motorbike",
				width: 1920,
				height: 1088,
				className: "absolute inset-0 -z-20 h-full w-full object-cover object-[75%_center] opacity-15 filter contrast-125"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-background to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-1/3 right-10 -z-10 h-96 w-96 rounded-full bg-[oklch(0.65_0.15_220/8%)] blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30",
				children: [
					22,
					48,
					71
				].map((top, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute h-px w-full overflow-hidden",
					style: { top: `${top}%` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "charge-line h-px w-1/2",
						style: { animationDelay: `${i * 1.1}s` }
					})
				}, top))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-16 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-xl shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2 w-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative h-2 w-2 rounded-full bg-primary" })]
						}), "128 riders delivering in Bengaluru now"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-[5.5rem] leading-[1.05] text-foreground",
						children: [
							"Power your ride.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-r from-primary via-[oklch(0.55_0.19_145)] to-[oklch(0.50_0.18_160)] bg-clip-text text-transparent",
								children: "Parts that fit."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed font-normal",
						children: "Batteries, chargers and spares for every EV — matched to your VIN, compared across sellers, delivered in one order with a rider you can track live."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 max-w-xl rounded-3xl border border-border/80 bg-card/85 p-3 shadow-2xl backdrop-blur-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1.5 p-1",
							children: ["bike", "vin"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMode(m),
								className: `flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-all ${mode === m ? "bg-primary text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`,
								children: m === "bike" ? "Pick my bike" : "Enter VIN"
							}, m))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 p-2 sm:flex-row",
							children: [mode === "bike" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center gap-2.5 rounded-2xl border border-border/80 bg-background/80 px-4 backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bike, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: bikeId,
									onChange: (e) => setBikeId(e.target.value),
									className: "h-12 w-full bg-transparent text-foreground outline-none [&>option]:text-foreground [&>option]:bg-card",
									children: bikes.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: b.id,
										children: [
											b.make,
											" ",
											b.model,
											" · ",
											b.voltage,
											"V"
										]
									}, b.id))
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center gap-2.5 rounded-2xl border border-border/80 bg-background/80 px-4 backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: vin,
									onChange: (e) => setVin(e.target.value),
									maxLength: 17,
									placeholder: "e.g. P6R1S1PR2PN000001",
									className: "h-12 w-full bg-transparent font-mono uppercase tracking-wider text-foreground outline-none placeholder:text-muted-foreground/60"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: go,
								className: "flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all hover:brightness-105 active:scale-95",
								children: ["Find parts ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/assistant",
							className: "flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary backdrop-blur-xl transition hover:bg-primary hover:text-primary-foreground hover:shadow-glow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" }), " Talk to AI assistant"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							className: "flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:border-primary/50",
							children: ["Browse all parts ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative hidden h-[520px] lg:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-float absolute right-0 top-4 w-76 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-2xl backdrop-blur-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-muted-foreground font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order #RZ48213" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 text-primary font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary animate-pulse" }), " Live"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-2xl font-bold tracking-tight text-foreground",
									children: "Arriving in 18 min"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 h-2 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-2/3 rounded-full bg-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground shadow-sm",
										children: "RK"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground",
											children: "Ravi Kumar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "2 pickups · Ather Rizta"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-float absolute left-4 top-56 w-64 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-2xl backdrop-blur-2xl",
							style: { animationDelay: "1.5s" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Fitment verified"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-foreground/80 leading-snug",
								children: ["VoltRide 60V 30Ah fits your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-foreground",
									children: "Ola S1 Pro 2023"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-6 right-6 grid grid-cols-2 gap-3",
							children: [
								["6+", "Verified sellers"],
								["1.2k", "Parts listed"],
								["38m", "Avg delivery"],
								["4.8★", "Rider rating"]
							].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/80 bg-card/90 px-4 py-3 shadow-md backdrop-blur-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl font-bold tracking-tight text-primary",
									children: v
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: l
								})]
							}, l))
						})
					]
				})]
			})
		]
	});
}
function BrandStrip() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-y border-border/70 bg-card/40 backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 font-display text-lg font-semibold tracking-wide text-muted-foreground md:justify-between",
			children: [
				"Ather",
				"Ola Electric",
				"TVS iQube",
				"Bajaj Chetak",
				"Revolt",
				"Hero Vida"
			].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "opacity-70 transition hover:text-primary hover:opacity-100",
				children: b
			}, b))
		})
	});
}
function Categories() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 pt-24 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "Shop by category",
			title: "Everything your EV runs on"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				{
					name: "Batteries",
					img: battery_1_default,
					Icon: Battery,
					count: 6
				},
				{
					name: "Chargers",
					img: charger_default,
					Icon: BatteryCharging,
					count: 2
				},
				{
					name: "Motors & Controllers",
					img: parts_default,
					Icon: Cpu,
					count: 2
				},
				{
					name: "Performance packs",
					img: battery_3_default,
					Icon: Gauge,
					count: 2
				}
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "group relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.img,
						alt: c.name,
						loading: "lazy",
						width: 1024,
						height: 1024,
						className: "absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5 text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 pr-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.Icon, { className: "mb-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold leading-tight sm:text-xl lg:text-2xl",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-xs text-white/70",
									children: [c.count, "+ products"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:rotate-[-45deg]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						})]
					})
				]
			}, c.name))
		})]
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 pt-28 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "How it works",
			title: "From VIN to doorstep",
			sub: "Built for riders, workshops and dealers who are tired of guessing which battery fits."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-4",
			children: [
				{
					Icon: Search,
					t: "Find",
					d: "Enter your VIN or pick your bike. We show only parts verified to fit."
				},
				{
					Icon: Disc,
					t: "Compare",
					d: "See prices, stock and delivery time from every nearby seller side by side."
				},
				{
					Icon: PackageCheck,
					t: "One order",
					d: "Mix items from many vendors. Delivery is priced per km — no surprises."
				},
				{
					Icon: MapPin,
					t: "Track live",
					d: "Watch your rider on the map, then call or chat once they accept."
				}
			].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-3xl border border-border/80 bg-card/75 p-6 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-4xl font-extrabold text-primary/30",
						children: ["0", i + 1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.Icon, { className: "mt-3 h-7 w-7 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-xl font-bold tracking-tight",
						children: s.t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground leading-relaxed",
						children: s.d
					})
				]
			}, s.t))
		})]
	});
}
function Featured() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 pt-28 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				eyebrow: "Trending now",
				title: "Top batteries this week"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "mb-10 hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline md:flex",
				children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: products.filter((p) => p.category === "Battery").slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
		})]
	});
}
function Roles() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 pt-28 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "One platform, every role",
			title: "Pick your dashboard"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					t: "Riders & owners",
					d: "Garage, VIN fitment, live tracking.",
					img: scooter_default,
					to: "/dashboard/customer",
					Icon: Bike
				},
				{
					t: "Workshops & mechanics",
					d: "Bulk orders and job cards per vehicle.",
					img: workshop_default,
					to: "/dashboard/workshop",
					Icon: Wrench
				},
				{
					t: "Vendors & dealers",
					d: "Inventory, fitment tags and payouts.",
					img: battery_3_default,
					to: "/dashboard/vendor",
					Icon: Store
				},
				{
					t: "Delivery riders",
					d: "Accept jobs, multi-pickup routes, earnings.",
					img: rider_default,
					to: "/dashboard/rider",
					Icon: Truck
				}
			].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: r.to,
				className: "group overflow-hidden rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[4/3] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: r.img,
						alt: r.t,
						loading: "lazy",
						width: 1280,
						height: 896,
						className: "h-full w-full object-cover transition duration-700 group-hover:scale-105"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.Icon, { className: "h-5 w-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-base font-bold tracking-tight",
							children: r.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground leading-relaxed",
							children: r.d
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 flex items-center gap-1 text-xs font-semibold text-primary",
							children: ["Open dashboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition group-hover:translate-x-1" })]
						})
					]
				})]
			}, r.t))
		})]
	});
}
function Testimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 pt-28 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
			eyebrow: "Loved on the road",
			title: "Riders trust Riderzpro"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: [
				{
					n: "Priya S.",
					r: "Ather 450X owner",
					q: "Entered my VIN and got three verified batteries in seconds. Rider showed up in 32 minutes."
				},
				{
					n: "Manjunath Auto Works",
					r: "Workshop, Jayanagar",
					q: "We order from four vendors in one go now. Delivery charges are finally transparent."
				},
				{
					n: "VoltHub",
					r: "Dealer, Indiranagar",
					q: "Orders come pre-matched to the customer's bike — almost zero returns this month."
				}
			].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "rounded-3xl border border-border/80 bg-card/75 p-6 backdrop-blur-xl shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-0.5",
						children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-warning text-warning" }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
						className: "mt-4 text-base leading-relaxed text-foreground/90",
						children: [
							"“",
							x.q,
							"”"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "mt-6 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "font-semibold",
								children: x.n
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["· ", x.r]
							})
						]
					})
				]
			}, x.n))
		})]
	});
}
function AppCta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 pt-28 md:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-primary via-[oklch(0.68_0.20_145)] to-[oklch(0.58_0.19_150)] p-10 text-primary-foreground shadow-2xl backdrop-blur-2xl md:p-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
					className: "absolute -right-10 -top-10 h-72 w-72 opacity-10",
					fill: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-[1.08]",
					children: [
						"Install Riderzpro",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"on your phone."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-lg text-primary-foreground/90 leading-relaxed font-normal",
					children: "Open this site on your phone and tap “Add to Home Screen” — it works like a native app with live tracking and voice search."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					className: "mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-foreground shadow-lg transition hover:bg-white/90 active:scale-95",
					children: ["Start shopping ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})
			]
		})
	});
}
//#endregion
export { Landing as component };

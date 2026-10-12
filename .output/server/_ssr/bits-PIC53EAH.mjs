import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as CircleX, X as CircleCheck, Y as CircleQuestionMark, f as Star, t as Zap } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bits-PIC53EAH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var battery_1_default = "/assets/battery-1-_p6elVN9.jpg";
var battery_2_default = "/assets/battery-2-CfyVlm3O.jpg";
var battery_3_default = "/assets/battery-3-BCrKU8_w.jpg";
var charger_default = "/assets/charger-vP7h56_5.jpg";
var parts_default = "/assets/parts-BjTUtiQx.jpg";
var CUSTOMER_LOCATION = {
	lat: 12.9716,
	lng: 77.5946,
	label: "MG Road, Bengaluru"
};
var bikes = [
	{
		id: "ather-450x",
		make: "Ather",
		model: "450X",
		years: [
			2021,
			2022,
			2023,
			2024,
			2025
		],
		voltage: 48,
		wmi: "MD9"
	},
	{
		id: "ola-s1pro",
		make: "Ola",
		model: "S1 Pro",
		years: [
			2022,
			2023,
			2024,
			2025
		],
		voltage: 60,
		wmi: "P6R"
	},
	{
		id: "tvs-iqube",
		make: "TVS",
		model: "iQube S",
		years: [
			2021,
			2022,
			2023,
			2024
		],
		voltage: 48,
		wmi: "MD6"
	},
	{
		id: "bajaj-chetak",
		make: "Bajaj",
		model: "Chetak",
		years: [
			2020,
			2021,
			2022,
			2023,
			2024,
			2025
		],
		voltage: 60,
		wmi: "MD2"
	},
	{
		id: "revolt-rv400",
		make: "Revolt",
		model: "RV400",
		years: [
			2020,
			2021,
			2022,
			2023,
			2024
		],
		voltage: 72,
		wmi: "MCR"
	},
	{
		id: "hero-vida-v1",
		make: "Hero",
		model: "Vida V1",
		years: [
			2023,
			2024,
			2025
		],
		voltage: 60,
		wmi: "MBL"
	}
];
var vendors = [
	{
		id: "v1",
		name: "VoltHub Indiranagar",
		area: "Indiranagar",
		lat: 12.9784,
		lng: 77.6408,
		rating: 4.8,
		prepMins: 15
	},
	{
		id: "v2",
		name: "ChargeKart Koramangala",
		area: "Koramangala",
		lat: 12.9352,
		lng: 77.6245,
		rating: 4.6,
		prepMins: 20
	},
	{
		id: "v3",
		name: "EV Spares Jayanagar",
		area: "Jayanagar",
		lat: 12.925,
		lng: 77.5938,
		rating: 4.5,
		prepMins: 25
	},
	{
		id: "v4",
		name: "Ampere Auto Hebbal",
		area: "Hebbal",
		lat: 13.0358,
		lng: 77.597,
		rating: 4.7,
		prepMins: 15
	},
	{
		id: "v5",
		name: "GreenWheels Whitefield",
		area: "Whitefield",
		lat: 12.9698,
		lng: 77.75,
		rating: 4.4,
		prepMins: 30
	},
	{
		id: "v6",
		name: "Riderz Dealer Malleshwaram",
		area: "Malleshwaram",
		lat: 13.0035,
		lng: 77.5709,
		rating: 4.9,
		prepMins: 10
	}
];
var img = {
	b1: battery_1_default,
	b2: battery_2_default,
	b3: battery_3_default,
	ch: charger_default,
	pt: parts_default
};
var products = [
	{
		name: "VoltRide 60V 30Ah Li-ion Pack",
		brand: "VoltRide",
		category: "Battery",
		image: img.b1,
		voltage: 60,
		capacityAh: 30,
		chemistry: "NMC",
		warrantyMonths: 36,
		rangeKm: 110,
		weightKg: 13,
		fits: [
			"ola-s1pro",
			"bajaj-chetak",
			"hero-vida-v1"
		],
		description: "High-density NMC pack with smart BMS, IP67 casing and fast-charge support.",
		base: 62e3,
		vendors: [
			"v1",
			"v2",
			"v6"
		]
	},
	{
		name: "VoltEdge 48V 50Ah LiFePO4",
		brand: "VoltEdge",
		category: "Battery",
		image: img.b2,
		voltage: 48,
		capacityAh: 50,
		chemistry: "LiFePO4",
		warrantyMonths: 48,
		rangeKm: 120,
		weightKg: 18,
		fits: ["ather-450x", "tvs-iqube"],
		description: "Ultra-safe LiFePO4 chemistry with 3000+ cycles. Built for daily commuters and fleets.",
		base: 54e3,
		vendors: [
			"v1",
			"v3",
			"v4"
		]
	},
	{
		name: "Titan 72V 120Ah Motorcycle Module",
		brand: "Titan Energy",
		category: "Battery",
		image: img.b3,
		voltage: 72,
		capacityAh: 120,
		chemistry: "NMC",
		warrantyMonths: 36,
		rangeKm: 180,
		weightKg: 38,
		fits: ["revolt-rv400"],
		description: "High-capacity module for performance EV motorcycles with CAN-bus communication.",
		base: 98e3,
		vendors: [
			"v2",
			"v4",
			"v5"
		]
	},
	{
		name: "VoltRide 60V 24Ah City Pack",
		brand: "VoltRide",
		category: "Battery",
		image: img.b1,
		voltage: 60,
		capacityAh: 24,
		chemistry: "NMC",
		warrantyMonths: 24,
		rangeKm: 85,
		weightKg: 11,
		fits: ["ola-s1pro", "hero-vida-v1"],
		description: "Lightweight swap-friendly pack for city riders.",
		base: 46e3,
		vendors: ["v1", "v5"]
	},
	{
		name: "VoltEdge 48V 30Ah Compact",
		brand: "VoltEdge",
		category: "Battery",
		image: img.b2,
		voltage: 48,
		capacityAh: 30,
		chemistry: "LiFePO4",
		warrantyMonths: 36,
		rangeKm: 75,
		weightKg: 12,
		fits: ["ather-450x", "tvs-iqube"],
		description: "Compact LiFePO4 replacement with plug-and-play connectors.",
		base: 36e3,
		vendors: ["v3", "v6"]
	},
	{
		name: "Titan 72V 60Ah Sport",
		brand: "Titan Energy",
		category: "Battery",
		image: img.b3,
		voltage: 72,
		capacityAh: 60,
		chemistry: "NMC",
		warrantyMonths: 24,
		rangeKm: 120,
		weightKg: 22,
		fits: ["revolt-rv400"],
		description: "Sport-tuned discharge curve for quick acceleration.",
		base: 72e3,
		vendors: ["v4", "v6"]
	},
	{
		name: "ChargeMax 3.3kW Fast Charger",
		brand: "ChargeMax",
		category: "Charger",
		image: img.ch,
		voltage: 60,
		warrantyMonths: 12,
		weightKg: 3,
		fits: [
			"ola-s1pro",
			"bajaj-chetak",
			"hero-vida-v1"
		],
		description: "3.3kW portable fast charger with Type-2 connector and LED status.",
		base: 14500,
		vendors: [
			"v1",
			"v2",
			"v3",
			"v6"
		]
	},
	{
		name: "ChargeMax 48V Home Charger",
		brand: "ChargeMax",
		category: "Charger",
		image: img.ch,
		voltage: 48,
		warrantyMonths: 12,
		weightKg: 2,
		fits: ["ather-450x", "tvs-iqube"],
		description: "Smart home charger with auto cut-off and temperature protection.",
		base: 7800,
		vendors: ["v3", "v4"]
	},
	{
		name: "SmartBMS 16S 60A Board",
		brand: "Daly",
		category: "BMS",
		image: img.ch,
		voltage: 60,
		warrantyMonths: 12,
		weightKg: .4,
		fits: [
			"ola-s1pro",
			"bajaj-chetak",
			"hero-vida-v1"
		],
		description: "Bluetooth BMS with cell balancing, over-current and thermal protection.",
		base: 4200,
		vendors: ["v2", "v5"]
	},
	{
		name: "QS 3000W 72V Hub Motor",
		brand: "QS Motor",
		category: "Motor",
		image: img.pt,
		voltage: 72,
		warrantyMonths: 18,
		weightKg: 9,
		fits: ["revolt-rv400"],
		description: "Brushless hub motor rated 3kW continuous with hall sensors.",
		base: 28e3,
		vendors: ["v4", "v5"]
	},
	{
		name: "Kelly 72V 80A Controller",
		brand: "Kelly",
		category: "Controller",
		image: img.pt,
		voltage: 72,
		warrantyMonths: 12,
		weightKg: 1.6,
		fits: ["revolt-rv400"],
		description: "Programmable sinusoidal controller with regen braking.",
		base: 9500,
		vendors: ["v2", "v4"]
	},
	{
		name: "Wave Disc Brake Rotor 220mm",
		brand: "Brembo",
		category: "Brakes",
		image: img.pt,
		warrantyMonths: 6,
		weightKg: .8,
		fits: [
			"ather-450x",
			"ola-s1pro",
			"tvs-iqube",
			"bajaj-chetak",
			"revolt-rv400",
			"hero-vida-v1"
		],
		description: "Stainless wave rotor for improved heat dissipation.",
		base: 2400,
		vendors: [
			"v1",
			"v3",
			"v6"
		]
	}
].map((s, i) => {
	const { base, vendors: vs, ...rest } = s;
	return {
		...rest,
		id: `p${i + 1}`,
		offers: vs.map((v, j) => ({
			vendorId: v,
			price: Math.round(base * (1 + (j - 1) * .04) / 10) * 10,
			stock: (i + j) * 7 % 23
		}))
	};
});
var riders = [{
	id: "r1",
	name: "Ravi Kumar",
	phone: "+91 98450 12345",
	vehicle: "Ather Rizta",
	plate: "KA 01 EV 4521",
	rating: 4.9,
	avatar: "RK"
}, {
	id: "r2",
	name: "Salma Begum",
	phone: "+91 99000 54321",
	vehicle: "TVS iQube",
	plate: "KA 03 EV 1180",
	rating: 4.8,
	avatar: "SB"
}];
var getVendor = (id) => vendors.find((v) => v.id === id);
var getProduct = (id) => products.find((p) => p.id === id);
var getBike = (id) => bikes.find((b) => b.id === id);
var bestOffer = (p) => [...p.offers].sort((a, b) => a.price - b.price)[0];
var inr = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
function distanceKm(a, b) {
	const R = 6371;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLng = (b.lng - a.lng) * Math.PI / 180;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}
var GST_RATE = .18;
function deliveryFee(km) {
	return Math.round(40 + km * 12);
}
function etaMinutes(km, prepMins) {
	return Math.round(prepMins + km / 22 * 60 + 5);
}
function fitmentFor(p, bikeId) {
	if (!bikeId) return "unknown";
	return p.fits.includes(bikeId) ? "compatible" : "incompatible";
}
var YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";
function decodeVin(raw) {
	const vin = raw.trim().toUpperCase();
	if (vin.length !== 17) return {
		ok: false,
		error: "VIN must be exactly 17 characters"
	};
	if (/[IOQ]/.test(vin)) return {
		ok: false,
		error: "VIN cannot contain I, O or Q"
	};
	if (!/^[A-Z0-9]+$/.test(vin)) return {
		ok: false,
		error: "Only letters and numbers allowed"
	};
	const bike = bikes.find((b) => vin.startsWith(b.wmi));
	const idx = YEAR_CODES.indexOf(vin[9]);
	const year = idx >= 0 ? 2010 + idx : void 0;
	if (!bike) return {
		ok: false,
		error: "Manufacturer not recognised — pick your bike manually"
	};
	return {
		ok: true,
		bike,
		year
	};
}
var ORDER_STEPS = [
	"Placed",
	"Vendor accepted",
	"Rider assigned",
	"Picked up",
	"On the way",
	"Delivered"
];
function quoteCart(cart) {
	const map = /* @__PURE__ */ new Map();
	for (const c of cart) {
		const p = getProduct(c.productId);
		if (!p) continue;
		const offer = p.offers.find((o) => o.vendorId === c.vendorId) ?? p.offers[0];
		let g = map.get(c.vendorId);
		if (!g) {
			const v = getVendor(c.vendorId);
			const km = Math.round(distanceKm(v, CUSTOMER_LOCATION) * 10) / 10;
			g = {
				vendorId: c.vendorId,
				items: [],
				subtotal: 0,
				km,
				fee: deliveryFee(km),
				eta: etaMinutes(km, v.prepMins)
			};
			map.set(c.vendorId, g);
		}
		g.items.push({
			productId: c.productId,
			qty: c.qty,
			price: offer.price
		});
		g.subtotal += offer.price * c.qty;
	}
	const groups = [...map.values()];
	const itemsTotal = groups.reduce((s, g) => s + g.subtotal, 0);
	const deliveryTotal = groups.reduce((s, g) => s + g.fee, 0);
	const tax = Math.round(itemsTotal * GST_RATE);
	const eta = groups.reduce((m, g) => Math.max(m, g.eta), 0) + Math.max(0, groups.length - 1) * 8;
	return {
		groups,
		itemsTotal,
		deliveryTotal,
		tax,
		total: itemsTotal + deliveryTotal + tax,
		eta
	};
}
var StoreCtx = (0, import_react.createContext)(null);
var KEY = "riderzpro-v1";
function StoreProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [cart, setCart] = (0, import_react.useState)([]);
	const [garage, setGarage] = (0, import_react.useState)([{
		bikeId: "ola-s1pro",
		year: 2023,
		nickname: "Daily ride"
	}]);
	const [activeBikeId, setActiveBikeId] = (0, import_react.useState)("ola-s1pro");
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [role, setRole] = (0, import_react.useState)("customer");
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) {
				const s = JSON.parse(raw);
				if (s.cart) setCart(s.cart);
				if (s.garage) setGarage(s.garage);
				if ("activeBikeId" in s) setActiveBikeId(s.activeBikeId);
				if (s.orders) setOrders(s.orders);
				if (s.role) setRole(s.role);
			}
			localStorage.removeItem("riderzpro-theme");
			setTheme("light");
		} catch {}
		setLoaded(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!loaded) return;
		localStorage.setItem(KEY, JSON.stringify({
			cart,
			garage,
			activeBikeId,
			orders,
			role
		}));
	}, [
		cart,
		garage,
		activeBikeId,
		orders,
		role,
		loaded
	]);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.remove("dark");
	}, [theme, loaded]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			setOrders((os) => os.map((o) => {
				if (o.status >= ORDER_STEPS.length - 1) return o;
				if (Date.now() - o.createdAt < (o.status + 1) * 12e3) return o;
				const status = o.status + 1;
				return {
					...o,
					status,
					riderId: status >= 2 ? o.riderId ?? riders[0].id : void 0
				};
			}));
		}, 3e3);
		return () => clearInterval(t);
	}, []);
	const addToCart = (0, import_react.useCallback)((productId, vendorId, qty = 1) => {
		setCart((c) => {
			const ex = c.find((i) => i.productId === productId && i.vendorId === vendorId);
			if (ex) return c.map((i) => i === ex ? {
				...i,
				qty: i.qty + qty
			} : i);
			return [...c, {
				productId,
				vendorId,
				qty
			}];
		});
	}, []);
	const setQty = (0, import_react.useCallback)((productId, vendorId, qty) => {
		setCart((c) => qty <= 0 ? c.filter((i) => !(i.productId === productId && i.vendorId === vendorId)) : c.map((i) => i.productId === productId && i.vendorId === vendorId ? {
			...i,
			qty
		} : i));
	}, []);
	const placeOrder = (0, import_react.useCallback)((payment) => {
		const q = quoteCart(cart);
		const order = {
			id: `RZ${Date.now().toString().slice(-6)}`,
			createdAt: Date.now(),
			payment,
			status: 0,
			...q
		};
		setOrders((o) => [order, ...o]);
		setCart([]);
		return order;
	}, [cart]);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		toggleTheme: () => setTheme((t) => t === "dark" ? "light" : "dark"),
		cart,
		addToCart,
		setQty,
		clearCart: () => setCart([]),
		garage,
		addBike: (b) => {
			setGarage((g) => [...g.filter((x) => x.bikeId !== b.bikeId), b]);
			setActiveBikeId(b.bikeId);
		},
		removeBike: (id) => setGarage((g) => g.filter((x) => x.bikeId !== id)),
		activeBikeId,
		setActiveBikeId,
		orders,
		placeOrder,
		advanceOrder: (id) => setOrders((os) => os.map((o) => o.id === id && o.status < ORDER_STEPS.length - 1 ? {
			...o,
			status: o.status + 1,
			riderId: o.status + 1 >= 2 ? riders[0].id : void 0
		} : o)),
		role,
		setRole
	}), [
		theme,
		cart,
		addToCart,
		setQty,
		garage,
		activeBikeId,
		orders,
		placeOrder,
		role
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreCtx.Provider, {
		value,
		children
	});
}
function useStore() {
	const c = (0, import_react.useContext)(StoreCtx);
	if (!c) throw new Error("useStore outside provider");
	return c;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Logo({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("group flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow transition group-hover:scale-105",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
				className: "h-5 w-5",
				fill: "currentColor"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-xl font-extrabold tracking-tight",
			children: ["RIDERZ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: "PRO"
			})]
		})]
	});
}
var fitMeta = {
	compatible: {
		label: "Fits your bike",
		cls: "bg-success/15 text-success border-success/30 backdrop-blur-md",
		Icon: CircleCheck
	},
	incompatible: {
		label: "Doesn't fit",
		cls: "bg-destructive/15 text-destructive border-destructive/30 backdrop-blur-md",
		Icon: CircleX
	},
	unknown: {
		label: "Fitment unknown",
		cls: "bg-muted/70 text-muted-foreground border-border/70 backdrop-blur-md",
		Icon: CircleQuestionMark
	}
};
function FitmentBadge({ fit, className }) {
	const m = fitMeta[fit];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-xl shadow-sm", m.cls, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.Icon, { className: "h-3.5 w-3.5" }),
			" ",
			m.label
		]
	});
}
function ProductCard({ p }) {
	const { activeBikeId, addToCart } = useStore();
	const offer = bestOffer(p);
	const fit = fitmentFor(p, activeBikeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/75 backdrop-blur-2xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$id",
			params: { id: p.id },
			className: "relative block aspect-square overflow-hidden bg-muted/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.image,
					alt: p.name,
					loading: "lazy",
					width: 1024,
					height: 1024,
					className: "h-full w-full object-cover transition duration-700 group-hover:scale-105"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-3 top-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FitmentBadge, {
						fit,
						className: "glass border-white/20 dark:border-white/10"
					})
				}),
				p.voltage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute right-3 top-3 rounded-full border border-white/20 bg-background/80 px-2.5 py-1 font-display text-xs font-bold leading-none text-foreground backdrop-blur-md",
					children: [p.voltage, "V"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-2 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium uppercase tracking-wider",
						children: [
							p.category,
							" · ",
							p.brand
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-warning text-warning" }), getVendor(offer.vendorId).rating]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: p.id },
					className: "line-clamp-2 font-semibold text-base leading-snug tracking-tight transition-colors hover:text-primary",
					children: p.name
				}),
				p.capacityAh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						p.capacityAh,
						"Ah · ",
						p.chemistry,
						" · ~",
						p.rangeKm,
						" km range"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [p.offers.length, " sellers from"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-bold tracking-tight",
						children: inr(offer.price)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => addToCart(p.id, offer.vendorId),
						className: "rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all hover:brightness-105 active:scale-95",
						children: "Add"
					})]
				})
			]
		})]
	});
}
function SectionTitle({ eyebrow, title, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl",
				children: title
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed",
				children: sub
			})
		]
	});
}
//#endregion
export { parts_default as C, useStore as D, riders as E, vendors as O, inr as S, quoteCart as T, etaMinutes as _, ProductCard as a, getProduct as b, battery_1_default as c, bikes as d, charger_default as f, distanceKm as g, deliveryFee as h, ORDER_STEPS as i, battery_3_default as l, decodeVin as m, FitmentBadge as n, SectionTitle as o, cn as p, Logo as r, StoreProvider as s, CUSTOMER_LOCATION as t, bestOffer as u, fitmentFor as v, products as w, getVendor as x, getBike as y };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Ft as CircleCheck, Nt as CircleX, Pt as CircleQuestionMark, _ as Star, ht as Heart, w as ShoppingCart } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as inr, b as riders, c as distanceKm, h as getVendor, i as bestOffer, l as etaMinutes, m as getProduct, n as CUSTOMER_LOCATION, r as GST_RATE, s as deliveryFee, u as fitmentFor, y as products } from "./data-C7OlInRR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bits-BhX7Ijve.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var processedWebhookEventIds = /* @__PURE__ */ new Set();
/**
* Normalizes vendor-specific status strings into standard RiderzPro ShipmentStatus
*/
function normalizeProviderStatus(provider, rawStatus) {
	const s = rawStatus.toLowerCase();
	if (s.includes("delivered") || s.includes("dlvd") || s.includes("handed over")) return "Delivered";
	if (s.includes("out for delivery") || s.includes("dispatched") || s.includes("ofd")) return "Out for Delivery";
	if (s.includes("transit") || s.includes("bagged") || s.includes("inbound") || s.includes("outbound") || s.includes("reached")) return "In Transit";
	if (s.includes("delay") || s.includes("hold") || s.includes("weather") || s.includes("monsoon") || s.includes("congestion")) return "Delayed";
	if (s.includes("fail") || s.includes("undelivered") || s.includes("customer not available") || s.includes("rto initiated")) return "Failed Attempt";
	if (s.includes("rto") || s.includes("return")) return "Returned to Origin";
	if (s.includes("pickup scheduled") || s.includes("manifest") || s.includes("awb created")) return "Manifested";
	return "In Transit";
}
function generateTrackingNumber(provider) {
	const randomPart = Math.floor(1e7 + Math.random() * 9e7);
	switch (provider) {
		case "Delhivery": return `DEL${randomPart}`;
		case "Bluedart": return `BLU${randomPart}`;
		case "Shadowfax": return `SFX${randomPart}`;
		case "RiderzPro Fleet": return `RZP${randomPart}`;
	}
}
function getProviderTrackingUrl(provider, trackingNumber) {
	switch (provider) {
		case "Delhivery": return `https://www.delhivery.com/track/package/${trackingNumber}`;
		case "Bluedart": return `https://www.bluedart.com/tracking?trackNumber=${trackingNumber}`;
		case "Shadowfax": return `https://tracker.shadowfax.in/track?orderId=${trackingNumber}`;
		case "RiderzPro Fleet": return `/track/${trackingNumber}`;
	}
}
function createNormalizedShipment(params) {
	const trackingNumber = generateTrackingNumber(params.provider);
	const now = /* @__PURE__ */ new Date();
	const timeStr = now.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit"
	});
	const dateStr = now.toLocaleDateString("en-IN", {
		month: "short",
		day: "numeric"
	});
	const initialEvent = {
		id: `evt-${Date.now()}-1`,
		timestamp: `${dateStr}, ${timeStr}`,
		status: "Manifested",
		location: `${params.pickupAddress.city} Pickup Facility`,
		description: `Shipment manifested with ${params.provider}. AWB generated.`,
		isGps: false,
		facilityName: `${params.pickupAddress.city} Fulfillment Hub`
	};
	const isFleet = params.provider === "RiderzPro Fleet";
	return {
		shipmentId: `SHP-${params.orderId.replace(/\D/g, "").slice(-4) || "8821"}-${params.provider.slice(0, 3).toUpperCase()}`,
		orderId: params.orderId,
		provider: params.provider,
		providerReference: `REF-${Math.floor(1e5 + Math.random() * 9e5)}`,
		trackingNumber,
		trackingUrl: getProviderTrackingUrl(params.provider, trackingNumber),
		pickupAddress: params.pickupAddress,
		destinationAddress: params.destinationAddress,
		status: "Manifested",
		locationType: isFleet ? "Live GPS Telemetry" : "Facility Checkpoint",
		latestLocation: `${params.pickupAddress.city} Fulfillment Hub`,
		lastEventTimestamp: "Just now",
		estimatedDelivery: isFleet ? "Today within 45 mins" : "Within 2-3 business days",
		events: [initialEvent],
		currentGps: isFleet ? {
			lat: 12.9716,
			lng: 77.5946,
			speedKmph: 28,
			heading: 45
		} : void 0
	};
}
/**
* Idempotent Webhook Processor
* Rejects repeated event IDs, normalizes status, returns updated tracking record
*/
function processCourierWebhookEvent(payload) {
	if (!payload.eventId || !payload.trackingNumber) return {
		success: false,
		isDuplicate: false,
		message: "Malformed webhook payload: missing eventId or trackingNumber"
	};
	if (processedWebhookEventIds.has(payload.eventId)) return {
		success: true,
		isDuplicate: true,
		message: `Idempotent skip: Event ${payload.eventId} has already been recorded and processed.`
	};
	processedWebhookEventIds.add(payload.eventId);
	const normalizedStatus = normalizeProviderStatus(payload.provider, payload.rawStatus);
	const now = /* @__PURE__ */ new Date();
	const timeStr = payload.timestamp || `${now.toLocaleDateString("en-IN", {
		month: "short",
		day: "numeric"
	})}, ${now.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit"
	})}`;
	const newEvent = {
		id: payload.eventId,
		timestamp: timeStr,
		status: normalizedStatus,
		location: payload.location,
		description: payload.details || `Courier scan: ${payload.rawStatus} at ${payload.location}`,
		isGps: payload.isGps ?? false,
		facilityName: payload.isGps ? void 0 : payload.location,
		coordinates: payload.latitude && payload.longitude ? {
			lat: payload.latitude,
			lng: payload.longitude
		} : void 0
	};
	return {
		success: true,
		isDuplicate: false,
		message: `Successfully processed ${payload.provider} event ${payload.eventId} -> ${normalizedStatus}`,
		updatedStatus: normalizedStatus,
		newEvent
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
function quoteCart(cart, discount = 0) {
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
	const discountedSubtotal = Math.max(0, itemsTotal - discount);
	const tax = Math.round(discountedSubtotal * GST_RATE);
	const eta = groups.reduce((m, g) => Math.max(m, g.eta), 0) + Math.max(0, groups.length - 1) * 8;
	return {
		groups,
		itemsTotal,
		deliveryTotal,
		tax,
		discountTotal: discount,
		total: discountedSubtotal + deliveryTotal + tax,
		eta
	};
}
var StoreCtx = (0, import_react.createContext)(null);
var KEY = "riderzpro-v2";
var DEFAULT_PROFILE = {
	name: "",
	phone: "",
	email: "",
	city: "",
	address: "",
	points: 0,
	selectedAddressId: "",
	addresses: []
};
var DEFAULT_ADDRESS = {
	name: "",
	street: "",
	city: "",
	state: "",
	pincode: "",
	phone: ""
};
function StoreProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [cart, setCart] = (0, import_react.useState)([]);
	const [garage, setGarage] = (0, import_react.useState)([]);
	const [activeBikeId, setActiveBikeId] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [shipments, setShipments] = (0, import_react.useState)([]);
	const [inventoryStock, setInventoryStock] = (0, import_react.useState)(() => {
		const initial = {};
		products.forEach((p) => {
			initial[p.id] = p.offers.reduce((s, o) => s + o.stock, 0) || 12;
		});
		return initial;
	});
	const [savedProductIds, setSavedProductIds] = (0, import_react.useState)([]);
	const [serviceBookings, setServiceBookings] = (0, import_react.useState)([]);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [userProfile, setUserProfile] = (0, import_react.useState)(DEFAULT_PROFILE);
	const [role, setRole] = (0, import_react.useState)("customer");
	const [isLoggedIn, setIsLoggedIn] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const auth = localStorage.getItem("riderzpro_auth");
			const user = localStorage.getItem(KEY);
			if (user && (user.includes("Aakash") || user.includes("RZ-849201") || user.includes("P6R1S1PR2PN000001"))) {
				localStorage.removeItem("riderzpro_auth");
				localStorage.removeItem(KEY);
				return false;
			}
			return auth === "true";
		}
		return false;
	});
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) {
				const s = JSON.parse(raw);
				if (!(s.orders && s.orders.some((o) => o.id === "RZ-849201" || o.id === "RZ-793420") || s.garage && s.garage.some((g) => g.vin === "P6R1S1PR2PN000001" || g.bikeId === "ola-s1pro") || s.serviceBookings && s.serviceBookings.some((b) => b.id === "SB-1042"))) {
					if (Array.isArray(s.cart)) setCart(s.cart);
					if (Array.isArray(s.garage)) setGarage(s.garage);
					if ("activeBikeId" in s) setActiveBikeId(s.activeBikeId);
					if (Array.isArray(s.orders)) setOrders(s.orders);
					if (Array.isArray(s.shipments)) setShipments(s.shipments);
					if (s.inventoryStock) setInventoryStock(s.inventoryStock);
					if (Array.isArray(s.savedProductIds)) setSavedProductIds(s.savedProductIds);
					if (Array.isArray(s.serviceBookings)) setServiceBookings(s.serviceBookings);
					if (Array.isArray(s.notifications)) setNotifications(s.notifications);
					if (s.userProfile) if (!(s.userProfile.name === "Aakash Sharma" || s.userProfile.email === "aakash.sharma@example.com")) setUserProfile({
						...DEFAULT_PROFILE,
						...s.userProfile,
						addresses: Array.isArray(s.userProfile.addresses) ? s.userProfile.addresses : [],
						selectedAddressId: s.userProfile.selectedAddressId || ""
					});
					else setUserProfile(DEFAULT_PROFILE);
					if (s.role) setRole(s.role);
				} else {
					localStorage.removeItem(KEY);
					setUserProfile(DEFAULT_PROFILE);
					setOrders([]);
					setShipments([]);
					setGarage([]);
					setActiveBikeId(null);
					setServiceBookings([]);
					setNotifications([]);
					setSavedProductIds([]);
				}
			}
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
			shipments,
			inventoryStock,
			savedProductIds,
			serviceBookings,
			notifications,
			userProfile,
			role
		}));
	}, [
		cart,
		garage,
		activeBikeId,
		orders,
		shipments,
		inventoryStock,
		savedProductIds,
		serviceBookings,
		notifications,
		userProfile,
		role,
		loaded
	]);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.remove("dark");
	}, [theme, loaded]);
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
	const updateInventoryStock = (0, import_react.useCallback)((productId, delta) => {
		setInventoryStock((prev) => ({
			...prev,
			[productId]: Math.max(0, (prev[productId] ?? 10) + delta)
		}));
	}, []);
	const createShipment = (0, import_react.useCallback)((params) => {
		const newShipment = createNormalizedShipment(params);
		setShipments((prev) => [newShipment, ...prev]);
		setOrders((prev) => prev.map((o) => o.id === params.orderId ? {
			...o,
			shipmentId: newShipment.shipmentId,
			status: Math.max(o.status, 2),
			fulfillmentStatus: "Dispatched"
		} : o));
		return newShipment;
	}, []);
	const updateShipmentStatus = (0, import_react.useCallback)((shipmentId, status, newEvent) => {
		setShipments((prev) => prev.map((s) => {
			if (s.shipmentId !== shipmentId) return s;
			const updatedEvents = newEvent ? [newEvent, ...s.events] : s.events;
			const isDelivered = status === "Delivered";
			return {
				...s,
				status,
				events: updatedEvents,
				latestLocation: newEvent?.location || s.latestLocation,
				lastEventTimestamp: newEvent?.timestamp || "Just now",
				actualDeliveryTimestamp: isDelivered ? (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN") : s.actualDeliveryTimestamp,
				isDelayed: status === "Delayed"
			};
		}));
		const targetShipment = shipments.find((s) => s.shipmentId === shipmentId);
		if (targetShipment) {
			let orderNumericStatus = 3;
			let fulfillmentStatus = "Dispatched";
			if (status === "Delivered") {
				orderNumericStatus = 5;
				fulfillmentStatus = "Delivered";
			} else if (status === "Out for Delivery") {
				orderNumericStatus = 4;
				fulfillmentStatus = "Dispatched";
			} else if (status === "In Transit") {
				orderNumericStatus = 3;
				fulfillmentStatus = "Dispatched";
			} else if (status === "Manifested") {
				orderNumericStatus = 2;
				fulfillmentStatus = "Packed";
			}
			setOrders((prev) => prev.map((o) => o.id === targetShipment.orderId ? {
				...o,
				status: orderNumericStatus,
				fulfillmentStatus
			} : o));
		}
	}, [shipments]);
	const processWebhook = (0, import_react.useCallback)((payload) => {
		const res = processCourierWebhookEvent(payload);
		if (res.success && !res.isDuplicate && res.updatedStatus) {
			const s = shipments.find((item) => item.trackingNumber === payload.trackingNumber);
			if (s) updateShipmentStatus(s.shipmentId, res.updatedStatus, res.newEvent);
		}
		return res;
	}, [shipments, updateShipmentStatus]);
	const placeOrderWithOptions = (0, import_react.useCallback)((options) => {
		const discount = options.discount || 0;
		const q = quoteCart(cart, discount);
		const newOrderId = `RZ-${Math.floor(1e5 + Math.random() * 9e5)}`;
		const order = {
			id: newOrderId,
			createdAt: Date.now(),
			payment: options.payment,
			paymentStatus: options.payment.includes("COD") ? "Pending" : "Paid",
			status: 0,
			fulfillmentStatus: "Awaiting Fulfillment",
			shippingAddress: options.shippingAddress,
			customerName: options.shippingAddress.name,
			customerPhone: options.shippingAddress.phone,
			couponCode: options.couponCode,
			...q
		};
		cart.forEach((c) => {
			updateInventoryStock(c.productId, -c.qty);
		});
		const autoShipment = createNormalizedShipment({
			orderId: newOrderId,
			provider: "Delhivery",
			pickupAddress: {
				name: "RiderzPro Central Hub",
				street: "Electronic City Phase 1",
				city: "Bengaluru",
				pincode: "560100",
				phone: "+91 80 4000 1100"
			},
			destinationAddress: options.shippingAddress,
			weightKg: 4.5,
			itemDescription: `${cart.length} EV Parts & Accessories`,
			orderValue: q.total
		});
		order.shipmentId = autoShipment.shipmentId;
		setOrders((prev) => [order, ...prev]);
		setShipments((prev) => [autoShipment, ...prev]);
		setCart([]);
		return order;
	}, [cart, updateInventoryStock]);
	const placeOrder = (0, import_react.useCallback)((payment) => {
		return placeOrderWithOptions({
			payment,
			shippingAddress: DEFAULT_ADDRESS
		});
	}, [placeOrderWithOptions]);
	const updateOrderStatus = (0, import_react.useCallback)((id, status) => {
		setOrders((os) => os.map((o) => {
			if (o.id !== id) return o;
			let fulfillmentStatus = o.fulfillmentStatus;
			if (status === 1) fulfillmentStatus = "Preparing";
			else if (status === 2) fulfillmentStatus = "Packed";
			else if (status >= 3 && status < 5) fulfillmentStatus = "Dispatched";
			else if (status === 5) fulfillmentStatus = "Delivered";
			return {
				...o,
				status,
				fulfillmentStatus,
				riderId: status >= 2 ? o.riderId || riders[0].id : void 0
			};
		}));
	}, []);
	const cancelOrder = (0, import_react.useCallback)((id, reason) => {
		setOrders((os) => os.map((o) => {
			if (o.id !== id) return o;
			o.groups.forEach((g) => {
				g.items.forEach((it) => {
					updateInventoryStock(it.productId, it.qty);
				});
			});
			return {
				...o,
				fulfillmentStatus: "Cancelled",
				cancelReason: reason
			};
		}));
	}, [updateInventoryStock]);
	const refundOrder = (0, import_react.useCallback)((id, reason) => {
		setOrders((os) => os.map((o) => o.id === id ? {
			...o,
			paymentStatus: "Refunded",
			refundReason: reason
		} : o));
	}, []);
	const toggleSaved = (0, import_react.useCallback)((id) => {
		setSavedProductIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}, []);
	const isSaved = (0, import_react.useCallback)((id) => savedProductIds.includes(id), [savedProductIds]);
	const bookService = (0, import_react.useCallback)((b) => {
		const booking = {
			...b,
			id: `SB-${Math.floor(1e3 + Math.random() * 9e3)}`,
			createdAt: Date.now()
		};
		setServiceBookings((prev) => [booking, ...prev]);
		return booking;
	}, []);
	const cancelServiceBooking = (0, import_react.useCallback)((id) => {
		setServiceBookings((prev) => prev.map((b) => b.id === id ? {
			...b,
			status: "Cancelled"
		} : b));
	}, []);
	const markNotificationRead = (0, import_react.useCallback)((id) => {
		setNotifications((prev) => prev.map((n) => n.id === id ? {
			...n,
			read: true
		} : n));
	}, []);
	const markAllNotificationsRead = (0, import_react.useCallback)(() => {
		setNotifications((prev) => prev.map((n) => ({
			...n,
			read: true
		})));
	}, []);
	const signIn = (0, import_react.useCallback)(() => {
		setIsLoggedIn(true);
		if (typeof window !== "undefined") localStorage.setItem("riderzpro_auth", "true");
	}, []);
	const signOut = (0, import_react.useCallback)(() => {
		setIsLoggedIn(false);
		if (typeof window !== "undefined") localStorage.removeItem("riderzpro_auth");
	}, []);
	const updateUserProfile = (0, import_react.useCallback)((p) => {
		setUserProfile((prev) => ({
			...prev,
			...p
		}));
	}, []);
	const selectAddress = (0, import_react.useCallback)((id) => {
		setUserProfile((prev) => {
			const target = (prev.addresses || DEFAULT_PROFILE.addresses || []).find((a) => a.id === id);
			if (!target) return prev;
			return {
				...prev,
				selectedAddressId: id,
				address: target.street,
				city: `${target.city} - ${target.pincode}`
			};
		});
	}, []);
	const addAddress = (0, import_react.useCallback)((addr) => {
		const newAddr = {
			...addr,
			id: `addr-${Date.now()}`
		};
		setUserProfile((prev) => {
			const currentList = prev.addresses || DEFAULT_PROFILE.addresses || [];
			return {
				...prev,
				addresses: [...currentList, newAddr],
				selectedAddressId: newAddr.id,
				address: newAddr.street,
				city: `${newAddr.city} - ${newAddr.pincode}`
			};
		});
	}, []);
	const updateAddress = (0, import_react.useCallback)((id, updated) => {
		setUserProfile((prev) => {
			const newList = (prev.addresses || DEFAULT_PROFILE.addresses || []).map((a) => a.id === id ? {
				...a,
				...updated
			} : a);
			const target = newList.find((a) => a.id === id);
			const isCurrentlySelected = prev.selectedAddressId === id;
			return {
				...prev,
				addresses: newList,
				address: isCurrentlySelected && target ? target.street : prev.address,
				city: isCurrentlySelected && target ? `${target.city} - ${target.pincode}` : prev.city
			};
		});
	}, []);
	const removeAddress = (0, import_react.useCallback)((id) => {
		setUserProfile((prev) => {
			const newList = (prev.addresses || DEFAULT_PROFILE.addresses || []).filter((a) => a.id !== id);
			const fallback = newList[0];
			return {
				...prev,
				addresses: newList,
				selectedAddressId: prev.selectedAddressId === id ? fallback?.id || "" : prev.selectedAddressId,
				address: prev.selectedAddressId === id && fallback ? fallback.street : prev.address,
				city: prev.selectedAddressId === id && fallback ? `${fallback.city} - ${fallback.pincode}` : prev.city
			};
		});
	}, []);
	const simulateDemoOrder = (0, import_react.useCallback)(() => {
		const demoOrder = {
			id: `RZ-${Math.floor(1e5 + Math.random() * 9e5)}`,
			createdAt: Date.now() - 9e5,
			groups: [{
				vendorId: "v1",
				items: [{
					productId: "p7",
					qty: 1,
					price: 14500
				}],
				subtotal: 14500,
				km: 3.8,
				fee: 86,
				eta: 25
			}],
			itemsTotal: 14500,
			deliveryTotal: 86,
			tax: 2610,
			total: 17196,
			eta: 25,
			payment: "UPI · Google Pay",
			paymentStatus: "Paid",
			status: 3,
			fulfillmentStatus: "Dispatched",
			customerName: userProfile?.name?.trim() || "Customer Account",
			customerPhone: userProfile?.phone?.trim() || "",
			shippingAddress: DEFAULT_ADDRESS,
			shipmentId: "SHP-DEMO-FLEET"
		};
		const demoShipment = {
			shipmentId: "SHP-DEMO-FLEET",
			orderId: demoOrder.id,
			provider: "RiderzPro Fleet",
			providerReference: "FLEET-FAST-9021",
			trackingNumber: "RZP9021334",
			trackingUrl: `/track/${demoOrder.id}`,
			pickupAddress: {
				name: "VoltHub Indiranagar",
				street: "100ft Road",
				city: "Bengaluru",
				pincode: "560038",
				phone: "+91 80 4123 9901"
			},
			destinationAddress: DEFAULT_ADDRESS,
			status: "In Transit",
			locationType: "Live GPS Telemetry",
			latestLocation: "Indiranagar 100ft Rd -> Koramangala Ring Rd",
			lastEventTimestamp: "2m ago",
			estimatedDelivery: "Arriving in 18 mins",
			currentGps: {
				lat: 12.9554,
				lng: 77.625,
				speedKmph: 32,
				heading: 140
			},
			events: [{
				id: "evt-fl-1",
				timestamp: "12m ago",
				status: "Manifested",
				location: "VoltHub Indiranagar",
				description: "Rider Ravi Kumar accepted order and collected package",
				isGps: true,
				coordinates: {
					lat: 12.9784,
					lng: 77.6408
				}
			}, {
				id: "evt-fl-2",
				timestamp: "2m ago",
				status: "In Transit",
				location: "Intermediate Ring Road",
				description: "Live GPS broadcast: En route to Bellandur doorstep",
				isGps: true,
				coordinates: {
					lat: 12.9554,
					lng: 77.625
				}
			}]
		};
		setOrders((prev) => [demoOrder, ...prev]);
		setShipments((prev) => [demoShipment, ...prev]);
		return demoOrder;
	}, []);
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
		placeOrderWithOptions,
		advanceOrder: (id) => setOrders((os) => os.map((o) => o.id === id && o.status < ORDER_STEPS.length - 1 ? {
			...o,
			status: o.status + 1,
			riderId: o.status + 1 >= 2 ? riders[0].id : void 0
		} : o)),
		updateOrderStatus,
		cancelOrder,
		refundOrder,
		simulateDemoOrder,
		shipments,
		createShipment,
		updateShipmentStatus,
		processWebhook,
		inventoryStock,
		updateInventoryStock,
		savedProductIds,
		toggleSaved,
		isSaved,
		serviceBookings,
		bookService,
		cancelServiceBooking,
		notifications,
		markNotificationRead,
		markAllNotificationsRead,
		userProfile,
		updateUserProfile,
		role,
		setRole,
		isLoggedIn,
		setIsLoggedIn,
		signIn,
		signOut,
		selectAddress,
		addAddress,
		updateAddress,
		removeAddress
	}), [
		theme,
		cart,
		addToCart,
		setQty,
		garage,
		activeBikeId,
		orders,
		placeOrder,
		placeOrderWithOptions,
		updateOrderStatus,
		cancelOrder,
		refundOrder,
		simulateDemoOrder,
		shipments,
		createShipment,
		updateShipmentStatus,
		processWebhook,
		inventoryStock,
		updateInventoryStock,
		savedProductIds,
		toggleSaved,
		isSaved,
		serviceBookings,
		bookService,
		cancelServiceBooking,
		notifications,
		markNotificationRead,
		markAllNotificationsRead,
		userProfile,
		updateUserProfile,
		role,
		isLoggedIn,
		signIn,
		signOut,
		selectAddress,
		addAddress,
		updateAddress,
		removeAddress
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
var riderzpro_logo_default = "/assets/riderzpro-logo-CWZDaQYu.png";
function Logo({ className, imgClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: cn("group inline-flex items-center", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: riderzpro_logo_default,
			alt: "RiderzPro - Car & Bike Accessories",
			className: cn("h-8 md:h-9.5 w-auto object-contain transition-transform group-hover:scale-[1.02]", imgClassName)
		})
	});
}
var fitMeta = {
	compatible: {
		label: "Verified Fit",
		cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
		Icon: CircleCheck
	},
	incompatible: {
		label: "Doesn't fit",
		cls: "bg-rose-50 text-rose-700 border-rose-200",
		Icon: CircleX
	},
	unknown: {
		label: "Fitment unverified",
		cls: "bg-gray-100 text-gray-700 border-gray-200",
		Icon: CircleQuestionMark
	}
};
function FitmentBadge({ fit, className }) {
	const m = fitMeta[fit];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold shadow-2xs", m.cls, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.Icon, { className: "h-3 w-3 shrink-0" }),
			" ",
			m.label
		]
	});
}
function ProductCard({ p }) {
	const { activeBikeId, addToCart, toggleSaved, isSaved } = useStore();
	const [imageFailed, setImageFailed] = (0, import_react.useState)(false);
	const offer = bestOffer(p);
	const fit = fitmentFor(p, activeBikeId);
	const mrp = Math.round(offer.price * 1.14 / 100) * 100;
	const discountPct = Math.round((mrp - offer.price) / mrp * 100);
	const saved = isSaved(p.id);
	const vendor = getVendor(offer.vendorId);
	const hasImage = Boolean(p.image && p.image.trim() !== "" && !imageFailed);
	const batterySummary = p.batterySpec || [
		p.batteryCapacityKwh ? `${p.batteryCapacityKwh} kWh` : "",
		p.voltage && p.capacityAh ? `${p.voltage} V · ${p.capacityAh} Ah` : "",
		p.chemistry || ""
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative block aspect-square overflow-hidden bg-[#F5F6F8]",
			children: [
				hasImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: p.id },
					className: "block h-full w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						loading: "lazy",
						width: 600,
						height: 600,
						onError: () => setImageFailed(true),
						className: "h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/product/$id",
					params: { id: p.id },
					className: "flex h-full w-full flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#FAFAFA] to-[#F1F3F5] transition group-hover:bg-[#E5E7EB]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-white border border-[#E5E7EB] text-2xl shadow-2xs",
							children: "🧰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 text-xs font-semibold text-[#4B5563] leading-snug",
							children: "Product image not available"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 text-[10px] text-[#9CA3AF]",
							children: "Verified Genuine Spares"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute left-2.5 top-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none",
					children: [discountPct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-md bg-[#E31E24] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs",
						children: [discountPct, "% OFF"]
					}), activeBikeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FitmentBadge, {
						fit,
						className: "bg-white border border-[#E5E7EB] text-gray-800 shadow-2xs text-[10px]"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleSaved(p.id);
						toast.success(saved ? "Removed from saved items" : "Added to saved items");
					},
					"aria-label": saved ? "Remove from saved items" : "Save item",
					className: cn("absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white border border-[#E5E7EB] shadow-2xs transition hover:scale-110", saved ? "text-[#E31E24]" : "text-gray-500 hover:text-[#E31E24]"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4", saved && "fill-current") })
				}),
				p.voltage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute right-2.5 bottom-2.5 rounded-md bg-[#111111] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs",
					children: [p.voltage, "V"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-[11px] text-[#6B7280]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold uppercase tracking-wider truncate max-w-[140px]",
						children: [
							p.category,
							" · ",
							p.brand
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 font-semibold text-gray-700 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-amber-400 text-amber-400" }), vendor.rating]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: p.id },
					className: "mt-1 line-clamp-2 font-semibold text-sm leading-snug text-[#111111] transition-colors hover:text-[#E31E24]",
					children: p.name
				}),
				batterySummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[10px] leading-snug text-[#6B7280]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-[#111111]",
							children: "Battery:"
						}),
						" ",
						batterySummary
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-1.5 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-700 font-medium",
							children: "In Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-400",
							children: "·"
						}),
						p.warrantyMonths > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[#6B7280]",
							children: [p.warrantyMonths, "m Warranty"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-extrabold text-[#111111]",
							children: inr(offer.price)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-gray-400 line-through",
							children: inr(mrp)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-[10px] text-[#6B7280]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sold by" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/store/$slug",
							params: { slug: getVendor(offer.vendorId).storeSlug || offer.vendorId },
							onClick: (e) => e.stopPropagation(),
							className: "font-bold text-gray-800 hover:text-[#E31E24] inline-flex items-center gap-0.5 truncate max-w-[120px]",
							children: [getVendor(offer.vendorId).name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-2.5 w-2.5 text-blue-500 fill-blue-50 shrink-0" })]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
							addToCart(p.id, offer.vendorId);
							toast.success(`Added ${p.name} to cart`);
						},
						className: "flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add" })]
					})]
				})
			]
		})]
	});
}
//#endregion
export { StoreProvider as a, ProductCard as i, Logo as n, quoteCart as o, ORDER_STEPS as r, useStore as s, FitmentBadge as t };

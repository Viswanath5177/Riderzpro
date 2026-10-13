import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as BroadcastChannel } from "../_libs/unenv.mjs";
import { i as SEED_VENDOR_PRODUCTS, r as SEED_VENDORS } from "./seedData-2nQl08Qt.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendorStore-jyyPc83P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VENDORS_STORAGE_KEY = "riderzpro_vendors";
var VENDOR_PRODUCTS_STORAGE_KEY = "riderzpro_vendor_products";
var VENDOR_NOTIFS_STORAGE_KEY = "riderzpro_vendor_notifications";
var VENDOR_TICKETS_STORAGE_KEY = "riderzpro_vendor_tickets";
var VendorStoreContext = (0, import_react.createContext)(null);
var broadcastChannel = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) try {
	broadcastChannel = new BroadcastChannel("riderzpro_vendor_bus");
} catch (e) {
	console.warn("BroadcastChannel not supported", e);
}
function VendorStoreProvider({ children }) {
	const [vendors, setVendors] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return SEED_VENDORS;
		try {
			const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
			if (stored) return JSON.parse(stored);
			localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(SEED_VENDORS));
			return SEED_VENDORS;
		} catch {
			return SEED_VENDORS;
		}
	});
	const [products, setProducts] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return SEED_VENDOR_PRODUCTS;
		try {
			const stored = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
			if (stored) return JSON.parse(stored);
			localStorage.setItem(VENDOR_PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_VENDOR_PRODUCTS));
			return SEED_VENDOR_PRODUCTS;
		} catch {
			return SEED_VENDOR_PRODUCTS;
		}
	});
	const [notifications, setNotifications] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return [];
		try {
			const stored = localStorage.getItem(VENDOR_NOTIFS_STORAGE_KEY);
			if (stored) return JSON.parse(stored);
			return [{
				id: "notif_01",
				vendorId: "v1",
				title: "KYC Approved",
				message: "Your seller account has been approved. You can now list catalog items.",
				time: "Yesterday",
				read: true,
				type: "approval"
			}];
		} catch {
			return [];
		}
	});
	const [tickets, setTickets] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return [];
		try {
			const stored = localStorage.getItem(VENDOR_TICKETS_STORAGE_KEY);
			if (stored) return JSON.parse(stored);
			return [];
		} catch {
			return [];
		}
	});
	const notifyBroadcast = (0, import_react.useCallback)((type, payload) => {
		if (broadcastChannel) try {
			broadcastChannel.postMessage({
				type,
				payload,
				timestamp: Date.now()
			});
		} catch (e) {
			console.error("Broadcast failed:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		function handleStorage(e) {
			if (e.key === "riderzpro_vendors" && e.newValue) try {
				setVendors(JSON.parse(e.newValue));
			} catch {}
			else if (e.key === "riderzpro_vendor_products" && e.newValue) try {
				setProducts(JSON.parse(e.newValue));
			} catch {}
			else if (e.key === "riderzpro_vendor_notifications" && e.newValue) try {
				setNotifications(JSON.parse(e.newValue));
			} catch {}
		}
		function handleChannelMessage(e) {
			const { type } = e.data || {};
			if (type === "VENDORS_UPDATED") {
				const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
				if (stored) setVendors(JSON.parse(stored));
			} else if (type === "PRODUCTS_UPDATED") {
				const stored = localStorage.getItem(VENDOR_PRODUCTS_STORAGE_KEY);
				if (stored) setProducts(JSON.parse(stored));
			}
		}
		window.addEventListener("storage", handleStorage);
		if (broadcastChannel) broadcastChannel.addEventListener("message", handleChannelMessage);
		return () => {
			window.removeEventListener("storage", handleStorage);
			if (broadcastChannel) broadcastChannel.removeEventListener("message", handleChannelMessage);
		};
	}, []);
	const persistVendors = (0, import_react.useCallback)((updated) => {
		setVendors(updated);
		try {
			localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(updated));
			notifyBroadcast("VENDORS_UPDATED");
		} catch (e) {
			console.error("Failed to persist vendors:", e);
		}
	}, [notifyBroadcast]);
	const persistProducts = (0, import_react.useCallback)((updated) => {
		setProducts(updated);
		try {
			localStorage.setItem(VENDOR_PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
			notifyBroadcast("PRODUCTS_UPDATED");
		} catch (e) {
			console.error("Failed to persist products:", e);
		}
	}, [notifyBroadcast]);
	const persistNotifications = (0, import_react.useCallback)((updated) => {
		setNotifications(updated);
		try {
			localStorage.setItem(VENDOR_NOTIFS_STORAGE_KEY, JSON.stringify(updated));
		} catch {}
	}, []);
	const persistTickets = (0, import_react.useCallback)((updated) => {
		setTickets(updated);
		try {
			localStorage.setItem(VENDOR_TICKETS_STORAGE_KEY, JSON.stringify(updated));
		} catch {}
	}, []);
	const getVendor = (0, import_react.useCallback)((id) => vendors.find((v) => v.id === id), [vendors]);
	const getVendorByPhone = (0, import_react.useCallback)((phone) => {
		const clean = phone.replace(/\D/g, "").slice(-10);
		return vendors.find((v) => v.phone.replace(/\D/g, "").slice(-10) === clean);
	}, [vendors]);
	const getVendorByEmail = (0, import_react.useCallback)((email) => {
		const clean = email.trim().toLowerCase();
		return vendors.find((v) => v.email.toLowerCase() === clean);
	}, [vendors]);
	const saveVendorDraft = (0, import_react.useCallback)((vendor) => {
		const existing = vendors.findIndex((v) => v.id === vendor.id);
		let updated;
		if (existing >= 0) updated = vendors.map((v) => v.id === vendor.id ? {
			...vendor,
			updatedAt: Date.now()
		} : v);
		else updated = [...vendors, {
			...vendor,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}];
		persistVendors(updated);
	}, [vendors, persistVendors]);
	const updateVendor = (0, import_react.useCallback)((id, updates) => {
		const updated = vendors.map((v) => v.id === id ? {
			...v,
			...updates,
			updatedAt: Date.now()
		} : v);
		persistVendors(updated);
	}, [vendors, persistVendors]);
	const updateOnboardingStep = (0, import_react.useCallback)((vendorId, step, stepData) => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			const currentCompleted = new Set(v.onboarding.completedSteps || []);
			currentCompleted.add(step);
			const nextStep = Math.min(6, Math.max(step + 1, v.onboarding.currentStep));
			const updatedOnboarding = {
				...v.onboarding,
				...stepData,
				currentStep: nextStep,
				completedSteps: Array.from(currentCompleted)
			};
			const rootUpdates = {};
			if (stepData.store?.storeName) {
				rootUpdates.storeName = stepData.store.storeName;
				rootUpdates.slug = stepData.store.slug;
			}
			if (stepData.shipping?.pickupAddress) {
				rootUpdates.lat = stepData.shipping.pickupAddress.lat;
				rootUpdates.lng = stepData.shipping.pickupAddress.lng;
				rootUpdates.area = stepData.shipping.pickupAddress.city;
			}
			if (stepData.shipping?.handlingTimeMins) rootUpdates.prepMins = stepData.shipping.handlingTimeMins;
			return {
				...v,
				...rootUpdates,
				onboarding: updatedOnboarding,
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
	}, [vendors, persistVendors]);
	const submitOnboarding = (0, import_react.useCallback)((vendorId) => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			const timeline = [...v.auditTimeline, {
				id: `evt_${Date.now()}`,
				timestamp: Date.now(),
				actor: v.onboarding.account.fullName || "Vendor",
				actorRole: "vendor",
				action: "Submitted onboarding verification application"
			}];
			return {
				...v,
				status: "submitted",
				auditTimeline: timeline,
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
		toast.success("Application submitted for admin verification!");
	}, [vendors, persistVendors]);
	const approveVendor = (0, import_react.useCallback)((vendorId, commissionRate = 10, tier = "Standard") => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			const timeline = [...v.auditTimeline, {
				id: `evt_${Date.now()}`,
				timestamp: Date.now(),
				actor: "Admin Operations",
				actorRole: "admin",
				action: `Approved KYC application. Commission: ${commissionRate}%, Tier: ${tier}`
			}];
			return {
				...v,
				status: "approved",
				commissionRate,
				tier,
				rejectionReason: void 0,
				changesRequestedSections: void 0,
				changesRequestedNotes: void 0,
				auditTimeline: timeline,
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
		const newNotif = {
			id: `notif_${Date.now()}`,
			vendorId,
			title: "KYC Approved 🎉",
			message: `Congratulations! Your seller account is approved at ${commissionRate}% commission. You can now add and manage catalog products.`,
			time: "Just now",
			read: false,
			type: "approval",
			link: "/vendor/dashboard/products"
		};
		persistNotifications([newNotif, ...notifications]);
		toast.success("Vendor approved successfully!");
	}, [
		vendors,
		notifications,
		persistVendors,
		persistNotifications
	]);
	const requestVendorChanges = (0, import_react.useCallback)((vendorId, sections, notes) => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			const timeline = [...v.auditTimeline, {
				id: `evt_${Date.now()}`,
				timestamp: Date.now(),
				actor: "Admin Compliance",
				actorRole: "admin",
				action: `Requested changes on sections: ${sections.join(", ")}`,
				notes
			}];
			return {
				...v,
				status: "changes_requested",
				changesRequestedSections: sections,
				changesRequestedNotes: notes,
				auditTimeline: timeline,
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
		const newNotif = {
			id: `notif_${Date.now()}`,
			vendorId,
			title: "Changes Requested on Onboarding",
			message: `Admin requested updates on: ${sections.join(", ")}. Note: ${notes}`,
			time: "Just now",
			read: false,
			type: "policy",
			link: "/vendor/pending"
		};
		persistNotifications([newNotif, ...notifications]);
		toast.info("Changes requested from vendor.");
	}, [
		vendors,
		notifications,
		persistVendors,
		persistNotifications
	]);
	const rejectVendor = (0, import_react.useCallback)((vendorId, reason) => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			const timeline = [...v.auditTimeline, {
				id: `evt_${Date.now()}`,
				timestamp: Date.now(),
				actor: "Admin Compliance",
				actorRole: "admin",
				action: `Rejected seller onboarding`,
				notes: reason
			}];
			return {
				...v,
				status: "rejected",
				rejectionReason: reason,
				auditTimeline: timeline,
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
		const newNotif = {
			id: `notif_${Date.now()}`,
			vendorId,
			title: "Application Rejected",
			message: `Your seller onboarding was rejected. Reason: ${reason}`,
			time: "Just now",
			read: false,
			type: "policy",
			link: "/vendor/pending"
		};
		persistNotifications([newNotif, ...notifications]);
		toast.error("Seller onboarding rejected.");
	}, [
		vendors,
		notifications,
		persistVendors,
		persistNotifications
	]);
	const suspendVendor = (0, import_react.useCallback)((vendorId, reason = "Suspended by admin") => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			return {
				...v,
				status: "suspended",
				rejectionReason: reason,
				auditTimeline: [...v.auditTimeline, {
					id: `evt_${Date.now()}`,
					timestamp: Date.now(),
					actor: "Admin Compliance",
					actorRole: "admin",
					action: `Suspended vendor account`,
					notes: reason
				}],
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
		toast.error("Vendor account suspended.");
	}, [vendors, persistVendors]);
	const reinstateVendor = (0, import_react.useCallback)((vendorId) => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			return {
				...v,
				status: "approved",
				rejectionReason: void 0,
				auditTimeline: [...v.auditTimeline, {
					id: `evt_${Date.now()}`,
					timestamp: Date.now(),
					actor: "Admin Compliance",
					actorRole: "admin",
					action: `Reinstated vendor account`
				}],
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
		toast.success("Vendor account reinstated to active status.");
	}, [vendors, persistVendors]);
	const toggleHolidayMode = (0, import_react.useCallback)((vendorId) => {
		const updated = vendors.map((v) => {
			if (v.id !== vendorId) return v;
			const nextMode = !v.holidayMode;
			toast.info(nextMode ? "Holiday mode enabled: listings paused" : "Holiday mode disabled: listings resumed");
			return {
				...v,
				holidayMode: nextMode,
				updatedAt: Date.now()
			};
		});
		persistVendors(updated);
	}, [vendors, persistVendors]);
	const addProduct = (0, import_react.useCallback)((productData) => {
		const vendor = vendors.find((v) => v.id === productData.vendorId);
		if (vendor && vendor.status !== "approved") {
			toast.error("Action blocked: Vendor must be KYC approved by admin before adding products.");
			throw new Error("KYC verification must be completed and approved by admin before adding products.");
		}
		const newProduct = {
			...productData,
			id: `vp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		persistProducts([newProduct, ...products]);
		toast.success(newProduct.status === "draft" ? "Draft saved" : "Product submitted for review!");
		return newProduct;
	}, [
		vendors,
		products,
		persistProducts
	]);
	const updateProduct = (0, import_react.useCallback)((id, updates, options) => {
		const targetProduct = products.find((p) => p.id === id);
		if (targetProduct && !options?.isStaffAction) {
			const vendor = vendors.find((v) => v.id === targetProduct.vendorId);
			if (vendor && vendor.status !== "approved") {
				toast.error("Action blocked: Vendor must be KYC approved by admin before modifying products.");
				return;
			}
		}
		const updated = products.map((p) => {
			if (p.id !== id) return p;
			return {
				...p,
				...updates,
				updatedAt: Date.now()
			};
		});
		persistProducts(updated);
		toast.success("Product updated successfully");
	}, [
		vendors,
		products,
		persistProducts
	]);
	const submitProductRevision = (0, import_react.useCallback)((id, revision) => {
		const targetProduct = products.find((p) => p.id === id);
		if (targetProduct) {
			const vendor = vendors.find((v) => v.id === targetProduct.vendorId);
			if (vendor && vendor.status !== "approved") {
				toast.error("Action blocked: Vendor must be KYC approved by admin before submitting revisions.");
				return;
			}
		}
		const updated = products.map((p) => {
			if (p.id !== id) return p;
			return {
				...p,
				pendingRevision: revision,
				updatedAt: Date.now()
			};
		});
		persistProducts(updated);
		toast.info("Product changes submitted for admin review.");
	}, [
		vendors,
		products,
		persistProducts
	]);
	const approveProduct = (0, import_react.useCallback)((id, adminEdits) => {
		const updated = products.map((p) => {
			if (p.id !== id) return p;
			let nextData = {
				...p,
				...adminEdits
			};
			if (p.pendingRevision) nextData = {
				...nextData,
				...p.pendingRevision,
				pendingRevision: void 0
			};
			return {
				...nextData,
				status: "live",
				rejectionReason: void 0,
				changesRequestedComments: void 0,
				updatedAt: Date.now()
			};
		});
		persistProducts(updated);
		toast.success("Product approved and is now LIVE!");
	}, [products, persistProducts]);
	const requestProductChanges = (0, import_react.useCallback)((id, comments) => {
		const updated = products.map((p) => {
			if (p.id !== id) return p;
			return {
				...p,
				status: "changes_requested",
				changesRequestedComments: comments,
				updatedAt: Date.now()
			};
		});
		persistProducts(updated);
		toast.info("Requested changes on product");
	}, [products, persistProducts]);
	const rejectProduct = (0, import_react.useCallback)((id, reason) => {
		const updated = products.map((p) => {
			if (p.id !== id) return p;
			return {
				...p,
				status: "rejected",
				rejectionReason: reason,
				updatedAt: Date.now()
			};
		});
		persistProducts(updated);
		toast.error("Product rejected from catalog");
	}, [products, persistProducts]);
	const deleteProduct = (0, import_react.useCallback)((id, options) => {
		const targetProduct = products.find((p) => p.id === id);
		if (targetProduct && !options?.isStaffAction) {
			const vendor = vendors.find((v) => v.id === targetProduct.vendorId);
			if (vendor && vendor.status !== "approved") {
				toast.error("Action blocked: Vendor must be KYC approved by admin before deleting products.");
				return;
			}
		}
		const updated = products.filter((p) => p.id !== id);
		persistProducts(updated);
		toast.info("Product removed");
	}, [
		vendors,
		products,
		persistProducts
	]);
	const addNotification = (0, import_react.useCallback)((notif) => {
		const item = {
			...notif,
			id: `notif_${Date.now()}`,
			time: "Just now",
			read: false
		};
		persistNotifications([item, ...notifications]);
	}, [notifications, persistNotifications]);
	const markNotificationRead = (0, import_react.useCallback)((id) => {
		const updated = notifications.map((n) => n.id === id ? {
			...n,
			read: true
		} : n);
		persistNotifications(updated);
	}, [notifications, persistNotifications]);
	const createTicket = (0, import_react.useCallback)((vendorId, subject, category, message) => {
		const newTicket = {
			id: `tkt_v_${Date.now()}`,
			vendorId,
			subject,
			category,
			status: "open",
			createdAt: Date.now(),
			replies: [{
				sender: "vendor",
				senderName: "Store Owner",
				text: message,
				time: Date.now()
			}]
		};
		persistTickets([newTicket, ...tickets]);
		toast.success("Support ticket created!");
	}, [tickets, persistTickets]);
	const replyTicket = (0, import_react.useCallback)((ticketId, text, sender, senderName) => {
		const updated = tickets.map((t) => {
			if (t.id !== ticketId) return t;
			return {
				...t,
				replies: [...t.replies, {
					sender,
					senderName,
					text,
					time: Date.now()
				}]
			};
		});
		persistTickets(updated);
		toast.success("Reply submitted");
	}, [tickets, persistTickets]);
	const value = (0, import_react.useMemo)(() => ({
		vendors,
		products,
		notifications,
		tickets,
		getVendor,
		getVendorByPhone,
		getVendorByEmail,
		saveVendorDraft,
		updateVendor,
		updateOnboardingStep,
		submitOnboarding,
		approveVendor,
		requestVendorChanges,
		rejectVendor,
		suspendVendor,
		reinstateVendor,
		addProduct,
		updateProduct,
		submitProductRevision,
		approveProduct,
		requestProductChanges,
		rejectProduct,
		deleteProduct,
		toggleHolidayMode,
		addNotification,
		markNotificationRead,
		createTicket,
		replyTicket
	}), [
		vendors,
		products,
		notifications,
		tickets,
		getVendor,
		getVendorByPhone,
		getVendorByEmail,
		saveVendorDraft,
		updateVendor,
		updateOnboardingStep,
		submitOnboarding,
		approveVendor,
		requestVendorChanges,
		rejectVendor,
		suspendVendor,
		reinstateVendor,
		addProduct,
		updateProduct,
		submitProductRevision,
		approveProduct,
		requestProductChanges,
		rejectProduct,
		deleteProduct,
		toggleHolidayMode,
		addNotification,
		markNotificationRead,
		createTicket,
		replyTicket
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorStoreContext.Provider, {
		value,
		children
	});
}
function useVendorStore() {
	const context = (0, import_react.useContext)(VendorStoreContext);
	if (!context) throw new Error("useVendorStore must be used within VendorStoreProvider");
	return context;
}
//#endregion
export { useVendorStore as n, VendorStoreProvider as t };

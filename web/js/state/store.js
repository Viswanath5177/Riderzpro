/* ==========================================================================
   VoltFit Central Reactive State Store (Riverpod-style Notifier Architecture)
   ========================================================================== */

import {
  MOCK_BIKE_MODELS,
  MOCK_BATTERIES,
  MOCK_SERVICE_CENTERS,
  MOCK_PRICING_RULES,
  MOCK_TECHNICIANS,
  MOCK_SAVED_BIKES,
  MOCK_ORDERS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYOUTS
} from "./mock_data.js";

class VoltFitStore {
  constructor() {
    this.listeners = new Set();

    // App State
    this.currentRole = "customer"; // 'customer' | 'vendor' | 'technician'
    this.currentTab = "find"; // role-specific tab
    this.previewMode = "desktop"; // 'desktop' | 'tablet' | 'mobile'

    // Bypass User Profile
    this.users = {
      customer: {
        id: "usr_customer_demo",
        name: "Rahul Verma",
        phone: "+91 98860 99887",
        email: "rahul.v@voltfit.demo",
        avatar: "RV",
        address: "Apartment 4B, Palm Meadows, Whitefield, Bengaluru"
      },
      vendor: {
        id: "vnd_nexgen_ev",
        name: "NexGen Power Systems",
        contactPerson: "Arjun Reddy",
        phone: "+91 98450 99112",
        rating: 4.9,
        serviceRadius: 25
      },
      technician: {
        id: "tech_ramesh",
        name: "Ramesh Kumar",
        phone: "+91 98450 12345",
        rating: 4.9,
        isOnline: true,
        certification: "Master High-Voltage EV Certified (Level 4)"
      }
    };

    // Data Stores
    this.bikeModels = [...MOCK_BIKE_MODELS];
    this.savedBikes = [...MOCK_SAVED_BIKES];
    this.selectedBikeId = this.savedBikes.find(b => b.is_active)?.id || this.savedBikes[0]?.id;
    this.batteries = [...MOCK_BATTERIES];
    this.serviceCenters = [...MOCK_SERVICE_CENTERS];
    this.pricingRules = { ...MOCK_PRICING_RULES };
    this.technicians = [...MOCK_TECHNICIANS];
    this.orders = [...MOCK_ORDERS];
    this.notifications = [...MOCK_NOTIFICATIONS];
    this.payouts = [...MOCK_PAYOUTS];

    // Initialize 7-Day Slot Matrix
    this.slotsMatrix = this.generateWeeklySlots();

    // Active Booking Draft State
    this.bookingDraft = {
      batteryId: null,
      installType: "home_visit", // 'home_visit' | 'service_center'
      serviceCenterId: "sc_indiranagar",
      selectedDate: this.slotsMatrix[0]?.dateString || "",
      selectedSlotId: null,
      hasExchange: true,
      deliveryAddress: this.users.customer.address,
      notes: ""
    };

    // Active Selected Order for Detail View
    this.selectedOrderId = this.orders[0]?.id || null;
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  // Navigation & Role Switching
  setRole(role) {
    this.currentRole = role;
    if (role === "customer") this.currentTab = "find";
    else if (role === "vendor") this.currentTab = "overview";
    else if (role === "technician") this.currentTab = "jobs";
    this.notify();
  }

  setTab(tab) {
    this.currentTab = tab;
    this.notify();
  }

  setPreviewMode(mode) {
    this.previewMode = mode;
    this.notify();
  }

  // Customer Bike Management & Compatibility Logic
  getActiveBike() {
    const saved = this.savedBikes.find(b => b.id === this.selectedBikeId);
    if (!saved) return null;
    const model = this.bikeModels.find(m => m.id === saved.bike_model_id);
    return { ...saved, modelDetails: model };
  }

  setSelectedBike(bikeId) {
    this.selectedBikeId = bikeId;
    this.savedBikes.forEach(b => {
      b.is_active = (b.id === bikeId);
    });
    this.notify();
  }

  addSavedBike(bikeData) {
    const newBike = {
      id: "bike_saved_" + Date.now(),
      user_id: this.users.customer.id,
      bike_model_id: bikeData.bike_model_id,
      nickname: bikeData.nickname || "My EV",
      registration_number: bikeData.registration_number,
      year: bikeData.year || 2023,
      is_active: true
    };
    this.savedBikes.forEach(b => b.is_active = false);
    this.savedBikes.unshift(newBike);
    this.selectedBikeId = newBike.id;
    this.notify();
  }

  deleteSavedBike(bikeId) {
    this.savedBikes = this.savedBikes.filter(b => b.id !== bikeId);
    if (this.selectedBikeId === bikeId && this.savedBikes.length > 0) {
      this.selectedBikeId = this.savedBikes[0].id;
      this.savedBikes[0].is_active = true;
    }
    this.notify();
  }

  // Strict Guaranteed Compatibility Query
  getCompatibleBatteries() {
    const activeBike = this.getActiveBike();
    if (!activeBike || !activeBike.bike_model_id) return [];
    return this.batteries.filter(battery => 
      battery.is_active !== false &&
      battery.compatible_bike_model_ids.includes(activeBike.bike_model_id)
    );
  }

  // Cost Breakdown Formulation
  calculateCostBreakdown(batteryId, installType, hasExchange) {
    const battery = this.batteries.find(b => b.id === batteryId);
    if (!battery) return null;

    const batteryPrice = Number(battery.price);
    const installFee = installType === "home_visit" ? this.pricingRules.install_home : this.pricingRules.install_center;
    const travelFee = installType === "home_visit" ? 45 : 0; // standard travel within radius
    const exchangeCredit = hasExchange ? this.pricingRules.exchange_credit : 0;
    const taxableSubtotal = Math.max(0, batteryPrice + installFee + travelFee - exchangeCredit);
    const taxAmount = Number((taxableSubtotal * this.pricingRules.tax_rate).toFixed(2));
    const totalAmount = Number((taxableSubtotal + taxAmount).toFixed(2));

    return {
      batteryPrice,
      installFee,
      travelFee,
      exchangeCredit,
      taxAmount,
      totalAmount
    };
  }

  // 7-Day Slot Generation
  generateWeeklySlots() {
    const days = [];
    const times = [
      { start: "09:00 AM", end: "10:30 AM", ready: "10:30 AM" },
      { start: "10:30 AM", end: "12:00 PM", ready: "12:00 PM" },
      { start: "12:30 PM", end: "02:00 PM", ready: "02:00 PM" },
      { start: "02:00 PM", end: "03:30 PM", ready: "03:30 PM" },
      { start: "04:00 PM", end: "05:30 PM", ready: "05:30 PM" },
      { start: "05:30 PM", end: "07:00 PM", ready: "07:00 PM" }
    ];

    const today = new Date(2026, 9, 9); // Oct 9, 2026
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;
      const dateString = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

      const daySlots = times.map((t, idx) => {
        const slotId = `slot_${i}_${idx}`;
        const isBooked = (i === 0 && (idx === 0 || idx === 1)) || (i === 1 && idx === 0);
        return {
          id: slotId,
          dayIndex: i,
          dateLabel: dayLabel,
          dateString: dateString,
          timeLabel: `${t.start} - ${t.end}`,
          readyBy: t.ready,
          capacity: 3,
          bookedCount: isBooked ? 3 : 0,
          isOpen: true
        };
      });

      days.push({
        dayIndex: i,
        dayLabel: dayLabel,
        dayNumber: d.getDate(),
        dayName: dayNames[d.getDay()],
        dateString: dateString,
        slots: daySlots
      });
    }
    return days;
  }

  // Atomic Slot Toggle by Vendor (reflected instantly to customers)
  toggleSlotStatus(slotId) {
    for (const day of this.slotsMatrix) {
      const slot = day.slots.find(s => s.id === slotId);
      if (slot) {
        slot.isOpen = !slot.isOpen;
        this.notify();
        return slot;
      }
    }
  }

  // Atomic Slot Booking Engine
  confirmBooking() {
    const draft = this.bookingDraft;
    if (!draft.batteryId || !draft.selectedSlotId) {
      throw new Error("Please select a battery and an available appointment slot.");
    }

    // Locate slot
    let targetSlot = null;
    for (const day of this.slotsMatrix) {
      const found = day.slots.find(s => s.id === draft.selectedSlotId);
      if (found) {
        targetSlot = found;
        break;
      }
    }

    if (!targetSlot || !targetSlot.isOpen || targetSlot.bookedCount >= targetSlot.capacity) {
      throw new Error("This slot is no longer available. Please select another slot.");
    }

    // Atomic increment
    targetSlot.bookedCount += 1;

    const battery = this.batteries.find(b => b.id === draft.batteryId);
    const activeBike = this.getActiveBike();
    const costs = this.calculateCostBreakdown(draft.batteryId, draft.installType, draft.hasExchange);

    const orderNumber = "VF-2026-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: "ord_" + Date.now(),
      order_number: orderNumber,
      customer_id: this.users.customer.id,
      customer_name: this.users.customer.name,
      customer_phone: this.users.customer.phone,
      vendor_id: battery.vendor_id,
      vendor_name: battery.vendor_name,
      technician_id: null,
      bike: {
        brand: activeBike.modelDetails.brand,
        model: activeBike.modelDetails.model,
        year: activeBike.year,
        registration_number: activeBike.registration_number,
        nickname: activeBike.nickname
      },
      battery: {
        id: battery.id,
        name: battery.name,
        chemistry: battery.chemistry,
        voltage: battery.voltage,
        capacity_ah: battery.capacity_ah,
        price: battery.price,
        warranty_months: battery.warranty_months
      },
      install_type: draft.installType,
      delivery_address: draft.installType === "home_visit" ? draft.deliveryAddress : null,
      service_center: draft.installType === "service_center" 
        ? this.serviceCenters.find(sc => sc.id === draft.serviceCenterId) 
        : null,
      slot: {
        date: targetSlot.dateLabel,
        time: targetSlot.timeLabel,
        ready_by: targetSlot.readyBy
      },
      costs: costs,
      has_exchange: draft.hasExchange,
      status: "placed",
      created_at: new Date().toISOString()
    };

    // Decrement battery stock
    if (battery.stock > 0) {
      battery.stock -= 1;
    }

    this.orders.unshift(newOrder);
    this.selectedOrderId = newOrder.id;

    // Add Notification
    this.notifications.unshift({
      id: "notif_" + Date.now(),
      title: "Order Placed Successfully",
      message: `Order #${orderNumber} for ${battery.name} has been placed. Waiting for vendor confirmation.`,
      time: "Just now",
      is_read: false,
      type: "order"
    });

    // Reset draft
    this.bookingDraft.selectedSlotId = null;

    this.notify();
    return newOrder;
  }

  // Order State Machine Transitions
  updateOrderStatus(orderId, newStatus, extraData = {}) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    if (extraData.technician_id) {
      order.technician_id = extraData.technician_id;
      const tech = this.technicians.find(t => t.id === extraData.technician_id);
      if (tech) {
        order.technician = {
          id: tech.id,
          name: tech.name,
          phone: tech.phone,
          rating: tech.rating,
          certification: tech.certification,
          photo: tech.photo,
          eta_mins: 15,
          distance_km: 4.2
        };
        tech.current_job_id = order.id;
      }
    }

    if (newStatus === "completed") {
      order.warranty_certificate_id = "WTY-VF-" + Math.floor(100000 + Math.random() * 900000);
      order.invoice_number = "INV-2026-" + Math.floor(10000 + Math.random() * 90000);
      if (order.technician) {
        const tech = this.technicians.find(t => t.id === order.technician.id);
        if (tech) tech.current_job_id = null;
      }
    }

    // Add state change notification
    this.notifications.unshift({
      id: "notif_" + Date.now(),
      title: `Order Status: ${newStatus.replace(/_/g, " ").toUpperCase()}`,
      message: `Order #${order.order_number} is now ${newStatus.replace(/_/g, " ")}.`,
      time: "Just now",
      is_read: false,
      type: "status"
    });

    this.notify();
  }

  // Technician Checklist Updates
  updateTechnicianChecklist(orderId, checklistKey, value) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    if (!order.checklist) {
      order.checklist = {
        battery_collected: false,
        vin_verified: false,
        old_removed: false,
        new_installed: false,
        diagnostics_passed: false,
        customer_signoff: false
      };
    }
    order.checklist[checklistKey] = value;
    this.notify();
  }

  // Stock Counter Management by Vendor
  updateBatteryStock(batteryId, delta) {
    const battery = this.batteries.find(b => b.id === batteryId);
    if (battery) {
      battery.stock = Math.max(0, battery.stock + delta);
      this.notify();
    }
  }

  toggleBatteryActive(batteryId) {
    const battery = this.batteries.find(b => b.id === batteryId);
    if (battery) {
      battery.is_active = battery.is_active === false ? true : false;
      this.notify();
    }
  }
}

export const store = new VoltFitStore();

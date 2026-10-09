/* ==========================================================================
   VoltFit Main Application Controller & Router (go_router style)
   ========================================================================== */

import { store } from "./state/store.js";
import { renderCustomerView } from "./views/customer_view.js";
import { renderVendorView } from "./views/vendor_view.js";
import { renderTechnicianView } from "./views/technician_view.js";
import { showToast, openModal, closeModal, formatCurrency } from "./components/glass_ui.js";
import { LiveMapCanvas } from "./components/map_view.js";
import { DigitalSignaturePad } from "./components/signature.js";

// Expose globals for inline event helpers
window.voltfitStore = window.riderzproStore = store;
window.voltfitShowToast = window.riderzproShowToast = showToast;
window.voltfitOpenModal = window.riderzproOpenModal = openModal;
window.voltfitCloseModal = window.riderzproCloseModal = closeModal;

class VoltFitApp {
  constructor() {
    this.appRoot = document.getElementById("app");
    this.currentMapInstance = null;
    this.currentSigPadInstance = null;

    window.voltfitRouter = {
      navigate: (tab) => store.setTab(tab)
    };

    store.subscribe(() => this.render());
    this.bindGlobalEvents();
    this.render();
  }

  render() {
    // Cleanup previous instances
    if (this.currentMapInstance) {
      this.currentMapInstance.destroy();
      this.currentMapInstance = null;
    }

    const role = store.currentRole;
    const tab = store.currentTab;

    // 1. Dev Bypass Toolbar
    const devToolbarHtml = `
      <div class="dev-bypass-bar">
        <span class="dev-label">DEV BYPASS</span>
        <div class="dev-role-group">
          <button class="dev-role-btn ${role === 'customer' ? 'active' : ''}" data-role="customer">Customer</button>
          <button class="dev-role-btn ${role === 'vendor' ? 'active' : ''}" data-role="vendor">Vendor</button>
          <button class="dev-role-btn ${role === 'technician' ? 'active' : ''}" data-role="technician">Technician</button>
        </div>
        <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2);"></div>
        <div class="dev-viewport-group">
          <button class="dev-viewport-btn ${store.previewMode === 'desktop' ? 'active' : ''}" data-mode="desktop">1440px</button>
          <button class="dev-viewport-btn ${store.previewMode === 'tablet' ? 'active' : ''}" data-mode="tablet">768px</button>
          <button class="dev-viewport-btn ${store.previewMode === 'mobile' ? 'active' : ''}" data-mode="mobile">390px</button>
        </div>
      </div>
    `;

    // 2. Navigation Sidebar (Desktop)
    const sidebarHtml = this.renderSidebar(role, tab);

    // 3. Floating Bottom Tab Bar (Mobile)
    const tabbarHtml = this.renderTabBar(role, tab);

    // 4. Viewport Content
    let contentHtml = "";
    if (role === "customer") {
      contentHtml = renderCustomerView();
    } else if (role === "vendor") {
      contentHtml = renderVendorView();
    } else if (role === "technician") {
      contentHtml = renderTechnicianView();
    }

    // Render Full Layout with Viewport Simulator Wrapper
    this.appRoot.innerHTML = `
      ${devToolbarHtml}
      <div class="viewport-simulator-wrapper mode-${store.previewMode}">
        <div class="app-layout">
          ${sidebarHtml}
          <main class="main-viewport">
            ${contentHtml}
          </main>
          ${tabbarHtml}
        </div>
      </div>
    `;

    // Post-render lifecycle hooks (Map & Signature initializations)
    this.afterRender();
  }

  renderSidebar(role, tab) {
    let navItems = [];

    if (role === "customer") {
      navItems = [
        { id: "find", label: "Find Battery", icon: "⚡" },
        { id: "book", label: "Book Installation", icon: "📅" },
        { id: "orders", label: "My Orders", icon: "📦", count: store.orders.length },
        { id: "bikes", label: "My Garage", icon: "🛵", count: store.savedBikes.length },
        { id: "notifications", label: "Notifications", icon: "🔔", count: store.notifications.filter(n => !n.is_read).length }
      ];
    } else if (role === "vendor") {
      navItems = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "orders", label: "Orders & Dispatch", icon: "📦", count: store.orders.filter(o => o.status === 'placed').length },
        { id: "batteries", label: "Battery Catalog", icon: "⚡", count: store.batteries.length },
        { id: "slots", label: "Weekly Slots", icon: "📅" },
        { id: "technicians", label: "Technicians", icon: "👨‍🔧", count: store.technicians.length },
        { id: "payouts", label: "Payouts & Ledger", icon: "💰" }
      ];
    } else if (role === "technician") {
      navItems = [
        { id: "jobs", label: "Assigned Jobs", icon: "🛵", count: store.orders.filter(o => o.status === 'technician_assigned').length },
        { id: "active", label: "Active Checklist", icon: "📋" },
        { id: "earnings", label: "Earnings", icon: "💵" }
      ];
    }

    const currentUser = store.users[role];

    return `
      <aside class="glass-sidebar">
        <div class="brand-header">
          <div class="brand-icon">⚡</div>
          <div class="brand-title">
            Riderzpro
            <span class="brand-badge">${role}</span>
          </div>
        </div>

        <nav class="nav-section">
          ${navItems.map(item => `
            <a class="nav-item ${tab === item.id ? 'active' : ''}" data-tab="${item.id}">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
              ${item.count ? `<span class="nav-counter">${item.count}</span>` : ''}
            </a>
          `).join("")}
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">${currentUser?.avatar || currentUser?.name?.charAt(0) || "U"}</div>
          <div style="flex: 1; overflow: hidden;">
            <div style="font-weight: 600; font-size: 13.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${currentUser?.name}</div>
            <div style="font-size: 11px; color: var(--text-secondary); text-transform: capitalize;">${role} Mode</div>
          </div>
        </div>
      </aside>
    `;
  }

  renderTabBar(role, tab) {
    let tabs = [];
    if (role === "customer") {
      tabs = [
        { id: "find", label: "Find", icon: "⚡" },
        { id: "book", label: "Book", icon: "📅" },
        { id: "orders", label: "Orders", icon: "📦" },
        { id: "bikes", label: "Garage", icon: "🛵" }
      ];
    } else if (role === "vendor") {
      tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "orders", label: "Orders", icon: "📦" },
        { id: "batteries", label: "Catalog", icon: "⚡" },
        { id: "slots", label: "Slots", icon: "📅" }
      ];
    } else if (role === "technician") {
      tabs = [
        { id: "jobs", label: "Jobs", icon: "🛵" },
        { id: "active", label: "Checklist", icon: "📋" },
        { id: "earnings", label: "Earnings", icon: "💵" }
      ];
    }

    return `
      <nav class="glass-tabbar">
        ${tabs.map(t => `
          <button class="tab-btn ${tab === t.id ? 'active' : ''}" data-tab="${t.id}">
            <span class="icon">${t.icon}</span>
            <span>${t.label}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  afterRender() {
    // 1. Initialize Live Map if container exists
    const mapContainer = document.getElementById("customer-live-map");
    if (mapContainer) {
      this.currentMapInstance = new LiveMapCanvas("customer-live-map", { eta: 14, distanceKm: 3.8 });
    }

    // 2. Initialize Signature Canvas if present
    const sigCanvas = document.getElementById("tech-signature-pad");
    if (sigCanvas) {
      this.currentSigPadInstance = new DigitalSignaturePad(sigCanvas);
      const clearBtn = document.getElementById("btn-clear-sig");
      if (clearBtn) {
        clearBtn.onclick = () => this.currentSigPadInstance.clear();
      }
    }
  }

  bindGlobalEvents() {
    this.appRoot.addEventListener("click", (e) => {
      const target = e.target;

      // Dev Bypass Bar - Role Switcher
      const roleBtn = target.closest(".dev-role-btn");
      if (roleBtn) {
        const role = roleBtn.dataset.role;
        store.setRole(role);
        showToast("Switched Role", `Now viewing as ${role.toUpperCase()} with demo account`, "🔄");
        return;
      }

      // Dev Bypass Bar - Viewport Simulator
      const modeBtn = target.closest(".dev-viewport-btn");
      if (modeBtn) {
        const mode = modeBtn.dataset.mode;
        store.setPreviewMode(mode);
        return;
      }

      // Sidebar & TabBar Navigation
      const navItem = target.closest(".nav-item") || target.closest(".tab-btn");
      if (navItem && navItem.dataset.tab) {
        store.setTab(navItem.dataset.tab);
        return;
      }

      // Customer: Choose Battery -> Open Book
      const chooseBtn = target.closest(".btn-choose-battery");
      if (chooseBtn) {
        const batteryId = chooseBtn.dataset.batteryId;
        store.bookingDraft.batteryId = batteryId;
        store.setTab("book");
        return;
      }

      // Customer: View Specs Modal
      const specsBtn = target.closest(".btn-view-specs");
      if (specsBtn) {
        const batteryId = specsBtn.dataset.batteryId;
        const bat = store.batteries.find(b => b.id === batteryId);
        if (bat) {
          const compatibleModels = store.bikeModels.filter(m => bat.compatible_bike_model_ids.includes(m.id));
          openModal(`${bat.name} — Full Technical Specifications`, `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="font-size: 14px; color: var(--text-secondary);">${bat.brand} • Supplier: <strong>${bat.vendor_name}</strong></div>
              
              <div class="battery-specs-pills" style="margin: 0;">
                <div class="spec-item"><span class="spec-label">Chemistry</span><span class="spec-val">${bat.chemistry}</span></div>
                <div class="spec-item"><span class="spec-label">Capacity</span><span class="spec-val">${bat.capacity_ah}Ah (${bat.kwh} kWh)</span></div>
                <div class="spec-item"><span class="spec-label">Nominal Voltage</span><span class="spec-val">${bat.voltage}V</span></div>
                <div class="spec-item"><span class="spec-label">Weight</span><span class="spec-val">${bat.weight_kg} kg</span></div>
                <div class="spec-item"><span class="spec-label">Water/Dust Protection</span><span class="spec-val">${bat.ip_rating}</span></div>
                <div class="spec-item"><span class="spec-label">Warranty</span><span class="spec-val">${bat.warranty_months} Months Replacement</span></div>
              </div>

              <div>
                <h4 style="font-size: 13.5px; font-weight: 600; margin-bottom: 4px;">Smart BMS & Electrical Protection</h4>
                <p style="font-size: 13px; color: var(--text-secondary);">${bat.bms_features}</p>
              </div>

              <div>
                <h4 style="font-size: 13.5px; font-weight: 600; margin-bottom: 4px;">Connector Type</h4>
                <p style="font-size: 13px; color: var(--text-secondary);">${bat.connector_type}</p>
              </div>

              <div>
                <h4 style="font-size: 13.5px; font-weight: 600; margin-bottom: 4px;">Verified Compatible Electric Bikes</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${compatibleModels.map(m => `<span class="fit-badge">✓ ${m.brand} ${m.model} (${m.year_from}-${m.year_to})</span>`).join("")}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--hairline);">
                <div class="battery-price tabular-nums">${formatCurrency(bat.price)}</div>
                <button class="btn btn-primary" onclick="window.voltfitCloseModal(); window.voltfitStore.bookingDraft.batteryId = '${bat.id}'; window.voltfitStore.setTab('book');">
                  Select & Book Installation
                </button>
              </div>
            </div>
          `);
        }
        return;
      }

      // Customer: Installation Type Segmented Control
      if (target.id === "seg-home-visit") {
        store.bookingDraft.installType = "home_visit";
        store.notify();
        return;
      }
      if (target.id === "seg-service-center") {
        store.bookingDraft.installType = "service_center";
        store.notify();
        return;
      }

      // Customer: Select Service Center
      const scCard = target.closest(".service-center-card");
      if (scCard) {
        store.bookingDraft.serviceCenterId = scCard.dataset.centerId;
        store.notify();
        return;
      }

      // Customer: Select Date Strip
      const dateChip = target.closest(".date-chip");
      if (dateChip) {
        store.bookingDraft.selectedDate = dateChip.dataset.dateStr;
        store.bookingDraft.selectedSlotId = null;
        store.notify();
        return;
      }

      // Customer: Select Slot Pill
      const slotPill = target.closest(".slot-pill");
      if (slotPill && !slotPill.classList.contains("disabled")) {
        store.bookingDraft.selectedSlotId = slotPill.dataset.slotId;
        store.notify();
        return;
      }

      // Customer: Exchange Credit Toggle
      if (target.id === "toggle-exchange-credit") {
        store.bookingDraft.hasExchange = target.checked;
        store.notify();
        return;
      }

      // Customer: Confirm Booking Button
      if (target.id === "btn-confirm-booking") {
        try {
          const newOrder = store.confirmBooking();
          showToast("Booking Confirmed!", `Order #${newOrder.order_number} created with guaranteed slot.`, "🎉");
          store.setTab("orders");
        } catch (err) {
          showToast("Booking Error", err.message, "⚠️");
        }
        return;
      }

      // Customer: Download Tax Invoice Modal
      const invoiceBtn = target.closest("#btn-download-invoice");
      if (invoiceBtn) {
        const orderId = invoiceBtn.dataset.orderId;
        const o = store.orders.find(ord => ord.id === orderId);
        if (o) {
          openModal(`Official GST Tax Invoice — #${o.invoice_number || 'INV-2026-10492'}`, `
            <div style="font-size: 13.5px; line-height: 1.6;">
              <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--hairline); padding-bottom: 12px; margin-bottom: 14px;">
                <div>
                  <strong style="font-size: 16px;">Riderzpro Mobility Technologies Pvt Ltd</strong><br>
                  GSTIN: 29AAACV9841K1Z2<br>
                  Indiranagar, Bengaluru, KA - 560038
                </div>
                <div style="text-align: right;">
                  <strong style="color: var(--accent-blue);">TAX INVOICE</strong><br>
                  Date: ${new Date().toLocaleDateString()}<br>
                  Order: #${o.order_number}
                </div>
              </div>

              <div style="margin-bottom: 14px;">
                <strong>Billed To:</strong> ${o.customer_name} (${o.customer_phone})<br>
                Vehicle: ${o.bike.brand} ${o.bike.model} (${o.bike.registration_number})<br>
                Service: ${o.install_type === 'home_visit' ? 'Doorstep Installation' : 'Service Center Fitting'}
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
                <tr style="border-bottom: 1px solid var(--hairline-strong); text-align: left;">
                  <th style="padding: 6px 0;">Item Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
                <tr>
                  <td style="padding: 6px 0;">${o.battery.name}</td>
                  <td style="text-align: right;" class="tabular-nums">${formatCurrency(o.costs.battery_price)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;">Certified Installation & Diagnostics</td>
                  <td style="text-align: right;" class="tabular-nums">${formatCurrency(o.costs.install_fee)}</td>
                </tr>
                ${o.has_exchange ? `
                  <tr style="color: var(--success-green);">
                    <td style="padding: 6px 0;">Old Battery Exchange Credit</td>
                    <td style="text-align: right;" class="tabular-nums">- ${formatCurrency(o.costs.exchange_credit)}</td>
                  </tr>
                ` : ""}
                <tr>
                  <td style="padding: 6px 0;">GST (18%)</td>
                  <td style="text-align: right;" class="tabular-nums">${formatCurrency(o.costs.tax_amount)}</td>
                </tr>
                <tr style="border-top: 2px solid var(--hairline-strong); font-weight: 700; font-size: 15px;">
                  <td style="padding: 8px 0;">Total Paid (UPI/Card)</td>
                  <td style="text-align: right;" class="tabular-nums">${formatCurrency(o.costs.total_amount)}</td>
                </tr>
              </table>

              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
                <button class="btn btn-secondary btn-sm" onclick="window.print();">🖨️ Print</button>
                <button class="btn btn-primary btn-sm" onclick="window.voltfitCloseModal(); window.voltfitShowToast('PDF Download', 'Invoice PDF saved to downloads.', '📄');">📥 Download PDF</button>
              </div>
            </div>
          `);
        }
        return;
      }

      // Customer: Digital Warranty Certificate
      const wtyBtn = target.closest("#btn-view-warranty");
      if (wtyBtn) {
        const orderId = wtyBtn.dataset.orderId;
        const o = store.orders.find(ord => ord.id === orderId);
        if (o) {
          openModal(`Official Digital Warranty Certificate`, `
            <div style="text-align: center; padding: 10px 0;">
              <div style="font-size: 40px; margin-bottom: 8px;">🛡️</div>
              <h3 style="font-size: 18px; font-weight: 700; color: var(--success-green);">Riderzpro Guaranteed Fitment & Battery Warranty</h3>
              <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Certificate #${o.warranty_certificate_id || 'WTY-RZ-98412'}</div>
              
              <div class="glass-card" style="margin: 18px 0; text-align: left; background: rgba(255, 255, 255, 0.7);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                  <div><strong>Vehicle:</strong> ${o.bike.brand} ${o.bike.model}</div>
                  <div><strong>Plate No:</strong> ${o.bike.registration_number}</div>
                  <div><strong>Battery Model:</strong> ${o.battery.name}</div>
                  <div><strong>Coverage:</strong> ${o.battery.warranty_months} Months 100% Replacement</div>
                  <div><strong>Installed By:</strong> ${o.technician?.name || 'Riderzpro Certified Master Tech'}</div>
                  <div><strong>BMS Diagnostics:</strong> Passed (100% Health)</div>
                </div>
              </div>

              <p style="font-size: 12px; color: var(--text-secondary);">This warranty covers cell degradation > 20%, BMS faults, and thermal safety. Instant claims via the Riderzpro app.</p>
              
              <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="window.voltfitCloseModal();">Close Certificate</button>
            </div>
          `);
        }
        return;
      }

      // Customer: Add Bike 3-Step Modal
      if (target.id === "btn-add-bike-quick" || target.id === "btn-add-bike-garage") {
        openModal("Add Electric Bike to Garage", `
          <form id="form-add-bike" style="display: flex; flex-direction: column; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Select Bike Brand & Model</label>
              <select id="new-bike-model" class="form-control" required>
                ${store.bikeModels.map(m => `<option value="${m.id}">${m.brand} ${m.model} (${m.year_from}-${m.year_to}) - ${m.voltage}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Manufacturing Year</label>
              <input type="number" id="new-bike-year" class="form-control" value="2023" min="2018" max="2026" required>
            </div>
            <div class="form-group">
              <label class="form-label">Nickname (Optional)</label>
              <input type="text" id="new-bike-nickname" class="form-control" placeholder="e.g. Daily Commute">
            </div>
            <div class="form-group">
              <label class="form-label">Registration Number</label>
              <input type="text" id="new-bike-reg" class="form-control" placeholder="e.g. KA 01 AB 1234" required>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Save Vehicle & Check Batteries</button>
          </form>
        `);

        document.getElementById("form-add-bike").onsubmit = (ev) => {
          ev.preventDefault();
          const modelId = document.getElementById("new-bike-model").value;
          const year = parseInt(document.getElementById("new-bike-year").value);
          const nickname = document.getElementById("new-bike-nickname").value;
          const reg = document.getElementById("new-bike-reg").value.toUpperCase();

          store.addSavedBike({
            bike_model_id: modelId,
            year: year,
            nickname: nickname,
            registration_number: reg
          });

          closeModal();
          showToast("Bike Added!", `${reg} added to your garage.`, "🛵");
          store.setTab("find");
        };
        return;
      }

      // Customer: Set Active Bike
      const setActiveBtn = target.closest(".btn-set-active-bike");
      if (setActiveBtn) {
        store.setSelectedBike(setActiveBtn.dataset.bikeId);
        showToast("Active Bike Updated", "Battery recommendations updated.", "🛵");
        return;
      }

      // Customer: Delete Bike
      const deleteBikeBtn = target.closest(".btn-delete-bike");
      if (deleteBikeBtn) {
        store.deleteSavedBike(deleteBikeBtn.dataset.bikeId);
        showToast("Bike Removed", "Vehicle removed from garage.", "🗑️");
        return;
      }

      // Vendor: Accept Order
      const acceptBtn = target.closest(".btn-vendor-accept");
      if (acceptBtn) {
        const orderId = acceptBtn.dataset.orderId;
        store.updateOrderStatus(orderId, "confirmed");
        showToast("Order Confirmed", `Order marked confirmed. Ready for technician assignment.`, "✓");
        return;
      }

      // Vendor: Decline Order
      const declineBtn = target.closest(".btn-vendor-decline");
      if (declineBtn) {
        const orderId = declineBtn.dataset.orderId;
        openModal("Decline Order", `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 13.5px; color: var(--text-secondary);">Please select a reason for declining this installation order:</p>
            <select id="decline-reason" class="form-control">
              <option>Battery pack temporarily out of stock</option>
              <option>Location outside serviceable radius</option>
              <option>Requested slot unavailable</option>
            </select>
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
              <button class="btn btn-glass btn-sm" onclick="window.voltfitCloseModal()">Cancel</button>
              <button class="btn btn-danger btn-sm" id="btn-confirm-decline">Confirm Decline</button>
            </div>
          </div>
        `);
        document.getElementById("btn-confirm-decline").onclick = () => {
          store.updateOrderStatus(orderId, "declined");
          closeModal();
          showToast("Order Declined", "Customer has been notified.", "⚠️");
        };
        return;
      }

      // Vendor: Assign Technician Modal
      const assignTechBtn = target.closest(".btn-vendor-assign-tech");
      if (assignTechBtn) {
        const orderId = assignTechBtn.dataset.orderId;
        openModal("Assign Certified Technician", `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <p style="font-size: 13.5px; color: var(--text-secondary);">Select an available certified technician to dispatch:</p>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${store.technicians.map(t => `
                <div class="glass-card interactive" style="padding: 12px; display: flex; align-items: center; justify-content: space-between;" onclick="window.voltfitAssignTechnician('${orderId}', '${t.id}')">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${t.photo}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                    <div>
                      <div style="font-weight: 700; font-size: 14px;">${t.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">${t.certification}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <span class="status-chip ${t.is_online ? 'completed' : 'cancelled'}" style="font-size: 10.5px;">${t.is_online ? 'Online' : 'Offline'}</span>
                    <div style="font-size: 12px; font-weight: 600; color: var(--accent-blue); margin-top: 2px;">★ ${t.rating}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `);
        window.voltfitAssignTechnician = (oId, tId) => {
          store.updateOrderStatus(oId, "technician_assigned", { technician_id: tId });
          closeModal();
          showToast("Technician Dispatched", "Customer can now track technician details.", "👨‍🔧");
        };
        return;
      }

      // Vendor: Slot Interactive Toggle Cell
      const vendorSlotCell = target.closest(".vendor-slot-cell");
      if (vendorSlotCell) {
        const slotId = vendorSlotCell.dataset.slotId;
        const updated = store.toggleSlotStatus(slotId);
        showToast("Slot Updated", `Slot is now ${updated.isOpen ? 'OPEN' : 'CLOSED'} for customers.`, "📅");
        return;
      }

      // Vendor: Battery Stock Increments
      const stockIncBtn = target.closest(".btn-stock-inc");
      if (stockIncBtn) {
        store.updateBatteryStock(stockIncBtn.dataset.batteryId, 1);
        return;
      }
      const stockDecBtn = target.closest(".btn-stock-dec");
      if (stockDecBtn) {
        store.updateBatteryStock(stockDecBtn.dataset.batteryId, -1);
        return;
      }

      // Technician: Online/Offline Switch
      if (target.id === "toggle-tech-online") {
        store.users.technician.isOnline = target.checked;
        store.technicians.find(t => t.id === store.users.technician.id).is_online = target.checked;
        store.notify();
        showToast("Technician Status", `You are now ${target.checked ? 'ONLINE for jobs' : 'OFFLINE'}`, target.checked ? "🟢" : "⚪");
        return;
      }

      // Technician: Start Job & En Route
      const startJobBtn = target.closest(".btn-tech-start-job");
      if (startJobBtn) {
        const orderId = startJobBtn.dataset.orderId;
        store.updateOrderStatus(orderId, "technician_on_the_way");
        store.setTab("active");
        showToast("En Route", "GPS location broadcasting to customer.", "🛵");
        return;
      }

      // Technician: Open Active Checklist
      const openActiveBtn = target.closest(".btn-tech-open-active");
      if (openActiveBtn) {
        store.setTab("active");
        return;
      }

      // Technician: Checklist Step Item Toggle
      const checklistStep = target.closest(".checklist-step");
      if (checklistStep) {
        const stepKey = checklistStep.dataset.stepKey;
        const activeOrder = store.orders.find(o => o.status === "technician_on_the_way" || o.status === "installing") || store.orders[0];
        if (activeOrder) {
          const currentVal = activeOrder.checklist ? activeOrder.checklist[stepKey] : false;
          store.updateTechnicianChecklist(activeOrder.id, stepKey, !currentVal);
          
          // Auto transition to installing on step 3/4
          if (stepKey === "old_removed" || stepKey === "new_installed") {
            if (activeOrder.status === "technician_on_the_way") {
              store.updateOrderStatus(activeOrder.id, "installing");
            }
          }
        }
        return;
      }

      // Technician: Final Complete Job Button
      if (target.id === "btn-complete-job-final") {
        const activeOrder = store.orders.find(o => o.status === "technician_on_the_way" || o.status === "installing") || store.orders[0];
        if (activeOrder) {
          store.updateOrderStatus(activeOrder.id, "completed");
          showToast("Job Completed & Certified!", `Order #${activeOrder.order_number} finished. Warranty activated.`, "🎉");
          store.setTab("jobs");
        }
        return;
      }
    });

    // Handle Quick Dropdown Bike Select
    this.appRoot.addEventListener("change", (e) => {
      if (e.target.id === "select-quick-bike") {
        store.setSelectedBike(e.target.value);
        showToast("Vehicle Switched", "Showing strictly compatible batteries.", "🛵");
      }
    });
  }
}

// Bootstrap on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  new VoltFitApp();
});

/* ==========================================================================
   VoltFit Vendor Screen View Module (Overview, Orders, Catalog, Slots, Payouts)
   ========================================================================== */

import { store } from "../state/store.js";
import { formatCurrency, renderStatusChip, showToast, openModal, closeModal } from "../components/glass_ui.js";

export function renderVendorView() {
  const tab = store.currentTab;

  switch (tab) {
    case "overview":
      return renderVendorOverview();
    case "orders":
      return renderVendorOrders();
    case "batteries":
      return renderVendorBatteries();
    case "slots":
      return renderVendorSlots();
    case "technicians":
      return renderVendorTechnicians();
    case "payouts":
      return renderVendorPayouts();
    default:
      return renderVendorOverview();
  }
}

// --------------------------------------------------------------------------
// 1. VENDOR OVERVIEW
// --------------------------------------------------------------------------
function renderVendorOverview() {
  const pendingOrders = store.orders.filter(o => o.status === "placed" || o.status === "confirmed");
  const installsToday = store.orders.filter(o => o.status === "technician_assigned" || o.status === "technician_on_the_way" || o.status === "installing");
  const totalRevenue = store.orders.reduce((acc, o) => acc + (o.costs.battery_price + o.costs.install_fee), 0);

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Vendor Command Center</h1>
        <p class="text-secondary">${store.users.vendor.name} • Battery Supply & Installation Management</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" onclick="window.voltfitStore.setTab('slots')">📅 Manage Slots</button>
      </div>
    </div>

    <!-- Real-time KPI Stat Cards -->
    <div class="vendor-kpi-grid">
      <div class="glass-card stat-card">
        <span class="stat-label">Action Required</span>
        <div class="stat-value tabular-nums">${pendingOrders.length}</div>
        <div class="stat-trend warning">⚡ ${pendingOrders.filter(o => o.status === 'placed').length} Pending Confirmation</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Active Installations Today</span>
        <div class="stat-value tabular-nums">${installsToday.length}</div>
        <div class="stat-trend positive">🛵 Technicians Dispatched</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Monthly Gross Revenue</span>
        <div class="stat-value tabular-nums">${formatCurrency(totalRevenue)}</div>
        <div class="stat-trend positive">↑ 18.4% vs last month</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Vendor Service Rating</span>
        <div class="stat-value tabular-nums">4.9 ★</div>
        <div class="stat-trend positive">100% On-Time SLA</div>
      </div>
    </div>

    <!-- Urgent Appointments Triage Queue -->
    <div class="glass-card" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 class="text-title-medium">Upcoming Appointments & Dispatch Queue</h2>
        <button class="btn btn-glass btn-sm" onclick="window.voltfitStore.setTab('orders')">View All Orders →</button>
      </div>

      <div class="triage-list">
        ${store.orders.slice(0, 4).map(o => `
          <div class="triage-item">
            <div class="triage-info">
              <div style="font-size: 24px;">${o.install_type === 'home_visit' ? '🏠' : '🏢'}</div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <strong style="font-size: 14.5px;">#${o.order_number}</strong>
                  ${renderStatusChip(o.status)}
                </div>
                <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                  ${o.customer_name} • ${o.bike.brand} ${o.bike.model} • ${o.battery.name}
                </div>
                <div style="font-size: 12px; color: var(--accent-blue); font-weight: 500; margin-top: 2px;">
                  📅 ${o.slot.date} (${o.slot.time}) • Ready by ${o.slot.ready_by}
                </div>
              </div>
            </div>

            <div class="triage-actions">
              ${o.status === 'placed' ? `
                <button class="btn btn-success btn-sm btn-vendor-accept" data-order-id="${o.id}">Accept</button>
                <button class="btn btn-danger btn-sm btn-vendor-decline" data-order-id="${o.id}">Decline</button>
              ` : o.status === 'confirmed' ? `
                <button class="btn btn-primary btn-sm btn-vendor-assign-tech" data-order-id="${o.id}">Assign Technician</button>
              ` : `
                <span class="text-caption">Tech: <strong>${o.technician?.name || 'Assigned'}</strong></span>
              `}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. VENDOR ORDERS
// --------------------------------------------------------------------------
function renderVendorOrders() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Order Management & Dispatch</h1>
        <p class="text-secondary">Accept orders, assign certified technicians, and track SLA delivery</p>
      </div>
    </div>

    <div class="glass-card" style="padding: 0; overflow: hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer & Bike</th>
            <th>Battery Pack</th>
            <th>Install Type & Slot</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${store.orders.map(o => `
            <tr>
              <td>
                <strong style="font-size: 13.5px;">${o.order_number}</strong>
                <div style="font-size: 11px; color: var(--text-secondary);">${new Date(o.created_at).toLocaleDateString()}</div>
              </td>
              <td>
                <div style="font-weight: 600;">${o.customer_name}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${o.bike.brand} ${o.bike.model} (${o.bike.registration_number})</div>
              </td>
              <td>
                <div style="font-weight: 600; font-size: 13px;">${o.battery.name}</div>
                <div style="font-size: 11.5px; color: var(--text-secondary);">${o.battery.voltage}V • ${o.battery.warranty_months}m Wty</div>
              </td>
              <td>
                <div style="font-size: 12.5px; font-weight: 600;">${o.install_type === 'home_visit' ? '🏠 Home Visit' : '🏢 Service Center'}</div>
                <div style="font-size: 11.5px; color: var(--text-secondary);">${o.slot.date} (${o.slot.time})</div>
              </td>
              <td class="tabular-nums" style="font-weight: 700;">
                ${formatCurrency(o.costs.total_amount)}
              </td>
              <td>
                ${renderStatusChip(o.status)}
              </td>
              <td>
                ${o.status === 'placed' ? `
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-success btn-sm btn-vendor-accept" data-order-id="${o.id}">Accept</button>
                    <button class="btn btn-danger btn-sm btn-vendor-decline" data-order-id="${o.id}">Decline</button>
                  </div>
                ` : o.status === 'confirmed' ? `
                  <button class="btn btn-primary btn-sm btn-vendor-assign-tech" data-order-id="${o.id}">Assign Tech</button>
                ` : `
                  <span style="font-size: 12px; color: var(--text-secondary);">${o.technician?.name || 'In Progress'}</span>
                `}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. BATTERIES CATALOG & STOCK EDITOR
// --------------------------------------------------------------------------
function renderVendorBatteries() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Battery Catalog & Fitment Matrix</h1>
        <p class="text-secondary">Manage inventory levels, compatibility rules, pricing, and specs</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="btn-bulk-import-csv">📤 Bulk CSV Import</button>
        <button class="btn btn-primary btn-sm" id="btn-add-battery-modal">+ Add New Battery</button>
      </div>
    </div>

    <div class="glass-card" style="padding: 0; overflow: hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Battery Model</th>
            <th>Specs (V / Ah / Range)</th>
            <th>Compatible Bike Models</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${store.batteries.map(bat => {
            const compatibleBikes = store.bikeModels.filter(m => bat.compatible_bike_model_ids.includes(m.id));
            const isLowStock = bat.stock <= 5;
            return `
              <tr>
                <td>
                  <div style="font-weight: 700; font-size: 14px;">${bat.name}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${bat.chemistry} • ${bat.warranty_months}m Warranty</div>
                </td>
                <td>
                  <div style="font-size: 13px; font-weight: 600;">${bat.voltage}V • ${bat.capacity_ah}Ah (${bat.kwh} kWh)</div>
                  <div style="font-size: 12px; color: var(--accent-blue);">${bat.range_km} km range • ${bat.charge_time_hours}h charge</div>
                </td>
                <td>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 260px;">
                    ${compatibleBikes.map(cb => `
                      <span class="brand-badge" style="font-size: 10px;">${cb.brand} ${cb.model}</span>
                    `).join("")}
                  </div>
                </td>
                <td class="tabular-nums" style="font-weight: 700; font-size: 15px;">
                  ${formatCurrency(bat.price)}
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="stock-stepper">
                      <button class="stepper-btn btn-stock-dec" data-battery-id="${bat.id}">-</button>
                      <span style="font-weight: 700; font-size: 13.5px; min-width: 20px; text-align: center;">${bat.stock}</span>
                      <button class="stepper-btn btn-stock-inc" data-battery-id="${bat.id}">+</button>
                    </div>
                    ${isLowStock ? '<span class="low-stock-pill">Low Stock</span>' : ''}
                  </div>
                </td>
                <td>
                  <span class="status-chip ${bat.is_active !== false ? 'completed' : 'cancelled'}" style="font-size: 11px;">
                    ${bat.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button class="btn btn-glass btn-sm btn-edit-fitment" data-battery-id="${bat.id}">Fitments</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 4. WEEKLY SLOTS & CAPACITY MANAGEMENT
// --------------------------------------------------------------------------
function renderVendorSlots() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Interactive Slots Matrix</h1>
        <p class="text-secondary">Tap any slot cell to instantly open/close customer booking availability</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" id="btn-slot-settings">⚙️ Capacity Rules</button>
      </div>
    </div>

    <!-- Quick Rules Ribbon -->
    <div class="glass-card" style="padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; font-size: 13px;">
      <div>
        Slot Length: <strong>90 mins</strong> • Max Tech Concurrency: <strong>3 technicians / slot</strong> • Working Hours: <strong>09:00 AM - 07:00 PM</strong>
      </div>
      <div style="display: flex; gap: 14px; align-items: center;">
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; border-radius: 4px; background: rgba(52, 199, 89, 0.3);"></span> Open</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; border-radius: 4px; background: rgba(0, 122, 255, 0.3);"></span> Booked</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; border-radius: 4px; background: rgba(118, 118, 128, 0.2);"></span> Closed</span>
      </div>
    </div>

    <!-- Weekly Interactive Table -->
    <div class="slots-grid-table">
      <table class="slots-table">
        <thead>
          <tr>
            <th>Time Window</th>
            ${store.slotsMatrix.map(d => `
              <th>${d.dayName}<br><span style="font-size: 11px; color: var(--text-primary); font-weight: 700;">${d.dateString.split(",")[0]}</span></th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${[0, 1, 2, 3, 4, 5].map(timeIdx => {
            const timeLabel = store.slotsMatrix[0].slots[timeIdx].timeLabel;
            return `
              <tr>
                <td style="font-weight: 600; font-size: 12.5px; color: var(--text-secondary); text-align: left; padding: 6px 12px;">${timeLabel}</td>
                ${store.slotsMatrix.map(day => {
                  const slot = day.slots[timeIdx];
                  const isBooked = slot.bookedCount >= slot.capacity;
                  const isClosed = !slot.isOpen;
                  const stateClass = isBooked ? 'booked' : (isClosed ? 'closed' : 'open');
                  const label = isBooked ? `Booked (${slot.bookedCount}/${slot.capacity})` : (isClosed ? 'Closed' : `Open (${slot.capacity - slot.bookedCount} left)`);
                  return `
                    <td>
                      <div class="slot-toggle-cell ${stateClass} vendor-slot-cell" data-slot-id="${slot.id}">
                        ${label}
                      </div>
                    </td>
                  `;
                }).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 5. TECHNICIANS ROSTER
// --------------------------------------------------------------------------
function renderVendorTechnicians() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Field Technicians Roster</h1>
        <p class="text-secondary">Certified EV battery technicians, live dispatch status, and quality ratings</p>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-invite-tech">+ Invite Certified Technician</button>
    </div>

    <div class="battery-grid">
      ${store.technicians.map(t => `
        <div class="glass-card">
          <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px;">
            <img src="${t.photo}" alt="Tech" class="tech-photo">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 16px; font-weight: 700;">${t.name}</h3>
                <span class="status-chip ${t.is_online ? 'completed' : 'cancelled'}" style="font-size: 11px;">
                  ${t.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin: 2px 0;">${t.certification}</div>
              <div style="font-size: 12.5px; font-weight: 600; color: var(--accent-blue);">★ ${t.rating} (${t.reviews_count} jobs)</div>
            </div>
          </div>

          <div style="padding: 10px 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.45); border: 1px solid var(--hairline); font-size: 12.5px; margin-bottom: 14px;">
            Assigned Vehicle: <strong>${t.vehicle}</strong><br>
            Current Assignment: <strong>${t.current_job_id ? `Job #${store.orders.find(o => o.id === t.current_job_id)?.order_number || t.current_job_id}` : 'Available for Dispatch'}</strong>
          </div>

          <div style="display: flex; gap: 8px;">
            <a href="tel:${t.phone}" class="btn btn-glass btn-sm" style="flex: 1;">📞 Call</a>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.voltfitShowToast('Schedule', 'Opening schedule calendar for ${t.name}', '📅')">Schedule</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 6. PAYOUTS & FINANCIALS
// --------------------------------------------------------------------------
function renderVendorPayouts() {
  const totalPaid = store.payouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.net_payout, 0);
  const pendingPayout = store.payouts.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.net_payout, 0);

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Payouts & Commission Ledger</h1>
        <p class="text-secondary">Disbursement history, platform commissions, and bank settlements</p>
      </div>
      <button class="btn btn-glass btn-sm" onclick="window.voltfitShowToast('Export', 'Downloading settlement statement CSV...', '📊')">
        📊 Export Ledger
      </button>
    </div>

    <div class="payouts-stat-row">
      <div class="glass-card stat-card">
        <span class="stat-label">Pending Payout</span>
        <div class="stat-value tabular-nums">${formatCurrency(pendingPayout)}</div>
        <div class="stat-trend warning">Next settlement in 2 days</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Total Settled Payouts</span>
        <div class="stat-value tabular-nums">${formatCurrency(totalPaid)}</div>
        <div class="stat-trend positive">Direct Bank UPI Deposit</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Platform Take Rate</span>
        <div class="stat-value tabular-nums">5.0%</div>
        <div class="stat-trend positive">Includes Payment Gateway</div>
      </div>
    </div>

    <div class="glass-card" style="padding: 0; overflow: hidden;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Order Ref</th>
            <th>Gross Value</th>
            <th>Platform Fee (5%)</th>
            <th>Net Disbursement</th>
            <th>Status</th>
            <th>Bank Ref</th>
          </tr>
        </thead>
        <tbody>
          ${store.payouts.map(p => `
            <tr>
              <td style="font-weight: 600;">${p.date}</td>
              <td><strong style="color: var(--accent-blue);">${p.order_number}</strong></td>
              <td class="tabular-nums">${formatCurrency(p.gross_amount)}</td>
              <td class="tabular-nums" style="color: var(--danger-red);">- ${formatCurrency(p.platform_fee)}</td>
              <td class="tabular-nums" style="font-weight: 700; color: var(--success-green);">${formatCurrency(p.net_payout)}</td>
              <td>
                <span class="status-chip ${p.status === 'paid' ? 'completed' : 'assigned'}" style="font-size: 11px;">
                  ${p.status.toUpperCase()}
                </span>
              </td>
              <td style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);">${p.reference}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

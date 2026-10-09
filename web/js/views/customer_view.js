/* ==========================================================================
   VoltFit Customer View Module (Refined Layout Alignment & Extended Catalog)
   ========================================================================== */

import { store } from "../state/store.js";
import { formatCurrency, renderStatusChip, showToast, openModal, closeModal } from "../components/glass_ui.js";
import { LiveMapCanvas } from "../components/map_view.js";

export function renderCustomerView() {
  const tab = store.currentTab;

  switch (tab) {
    case "find":
      return renderFindTab();
    case "book":
      return renderBookTab();
    case "orders":
      return renderOrdersTab();
    case "bikes":
      return renderBikesTab();
    case "notifications":
      return renderNotificationsTab();
    default:
      return renderFindTab();
  }
}

// --------------------------------------------------------------------------
// 1. FIND & DISCOVERY TAB
// --------------------------------------------------------------------------
function renderFindTab() {
  const activeBike = store.getActiveBike();
  const compatibleBatteries = store.getCompatibleBatteries();

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Find EV Battery</h1>
        <p class="text-secondary">Guaranteed compatibility with your electric two-wheeler</p>
      </div>
      <div class="page-actions">
        <button id="btn-switch-bike-modal" class="btn btn-glass btn-sm">
          <span>🛵</span> Switch Vehicle
        </button>
      </div>
    </div>

    <!-- Active Vehicle Selector Bar -->
    <div class="bike-selector-hero">
      <div class="bike-selector-left">
        <div class="bike-icon-circle">${activeBike?.modelDetails?.image || "🛵"}</div>
        <div style="min-width: 0;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--accent-blue); letter-spacing: 0.04em;">Selected Vehicle</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${activeBike ? `${activeBike.modelDetails.brand} ${activeBike.modelDetails.model} (${activeBike.year})` : "Select a Bike"}
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary);">
            ${activeBike?.nickname ? `“${activeBike.nickname}” • ` : ""}${activeBike?.registration_number || ""}
          </div>
        </div>
      </div>
      <div class="bike-selector-dropdowns">
        <select id="select-quick-bike" class="form-control" style="width: auto; min-width: 220px;">
          ${store.savedBikes.map(b => {
            const m = store.bikeModels.find(m => m.id === b.bike_model_id);
            return `<option value="${b.id}" ${b.id === store.selectedBikeId ? 'selected' : ''}>${m?.brand} ${m?.model} (${b.registration_number})</option>`;
          }).join("")}
        </select>
        <button id="btn-add-bike-quick" class="btn btn-secondary btn-sm">+ Add New</button>
      </div>
    </div>

    <!-- Section Heading -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h2 class="text-title-medium">Compatible Batteries</h2>
        <p class="text-caption">Showing only batteries strictly verified to fit ${activeBike?.modelDetails?.model || "your bike"}</p>
      </div>
      <span class="status-chip confirmed" style="font-size: 12px;">
        ${compatibleBatteries.length} Verified Options
      </span>
    </div>

    <!-- Battery Grid -->
    ${compatibleBatteries.length === 0 ? `
      <div class="glass-card empty-state">
        <div class="empty-state-icon">⚡</div>
        <h3 class="text-section-title">No Compatible Batteries Found</h3>
        <p class="text-secondary" style="max-width: 400px;">We couldn't find in-stock batteries matching this model. Try choosing another bike or contact support.</p>
      </div>
    ` : `
      <div class="battery-grid">
        ${compatibleBatteries.map(bat => `
          <div class="glass-card battery-card interactive" data-battery-id="${bat.id}">
            <div class="battery-card-header">
              <div style="min-width: 0; flex: 1;">
                <span class="fit-badge">✓ Fits ${activeBike?.modelDetails?.model}</span>
                <h3 class="battery-name" style="margin-top: 6px;">${bat.name}</h3>
                <div class="battery-supplier">by ${bat.vendor_name} • ★ ${bat.rating} (${bat.review_count})</div>
              </div>
              <span class="brand-badge" style="flex-shrink: 0;">${bat.badge || bat.chemistry.split(" ")[0]}</span>
            </div>

            <!-- Quick Specs Pills Grid -->
            <div class="battery-specs-pills">
              <div class="spec-item">
                <span class="spec-label">Range</span>
                <span class="spec-val">${bat.range_km} km / charge</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Voltage & Capacity</span>
                <span class="spec-val">${bat.voltage}V • ${bat.capacity_ah}Ah</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Charge Time</span>
                <span class="spec-val">${bat.charge_time_hours} hrs</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Warranty</span>
                <span class="spec-val">${bat.warranty_months} Months</span>
              </div>
            </div>

            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              ${bat.bms_features}
            </div>

            <div class="battery-footer">
              <div>
                <div style="font-size: 10.5px; color: var(--text-secondary); font-weight: 500;">TOTAL PRICE</div>
                <div class="battery-price tabular-nums">${formatCurrency(bat.price)}</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-glass btn-sm btn-view-specs" data-battery-id="${bat.id}">Specs</button>
                <button class="btn btn-primary btn-sm btn-choose-battery" data-battery-id="${bat.id}">Choose & Book</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}
  `;
}

// --------------------------------------------------------------------------
// 2. 4-STEP BOOKING TAB
// --------------------------------------------------------------------------
function renderBookTab() {
  const draft = store.bookingDraft;
  const activeBike = store.getActiveBike();
  const battery = store.batteries.find(b => b.id === draft.batteryId) || store.getCompatibleBatteries()[0];

  if (!battery) {
    return `
      <div class="glass-card empty-state" style="margin-top: 40px;">
        <div class="empty-state-icon">🔋</div>
        <h2 class="text-title-medium">No Battery Selected</h2>
        <p class="text-secondary">Please select a compatible battery for your bike first.</p>
        <button class="btn btn-primary" onclick="window.voltfitRouter.navigate('find')">Browse Compatible Batteries</button>
      </div>
    `;
  }

  // Ensure draft has selected battery
  draft.batteryId = battery.id;

  const costBreakdown = store.calculateCostBreakdown(battery.id, draft.installType, draft.hasExchange);
  const selectedDayObj = store.slotsMatrix.find(d => d.dateString === draft.selectedDate) || store.slotsMatrix[0];
  const isSlotSelected = !!draft.selectedSlotId;

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Book Installation</h1>
        <p class="text-secondary">Complete purchase and schedule certified technician fitting</p>
      </div>
      <button class="btn btn-glass btn-sm" onclick="window.voltfitRouter.navigate('find')">← Back to Batteries</button>
    </div>

    <!-- Selected Battery Strip -->
    <div class="glass-card" style="margin-bottom: 20px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: rgba(255, 255, 255, 0.75);">
      <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
        <div style="font-size: 26px; flex-shrink: 0;">⚡</div>
        <div style="min-width: 0;">
          <span class="fit-badge" style="font-size: 11px;">Fits ${activeBike?.modelDetails?.model}</span>
          <div style="font-size: 15.5px; font-weight: 700; color: var(--text-primary); margin-top: 2px;">${battery.name}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">${battery.voltage}V ${battery.capacity_ah}Ah (${battery.kwh} kWh) • ${battery.warranty_months}m Warranty</div>
        </div>
      </div>
      <div style="text-align: right; flex-shrink: 0;">
        <div style="font-size: 10.5px; color: var(--text-secondary);">BATTERY PRICE</div>
        <div class="tabular-nums" style="font-size: 19px; font-weight: 700; color: var(--text-primary);">${formatCurrency(battery.price)}</div>
      </div>
    </div>

    <div class="book-container">
      <!-- 4 Unified Steps -->
      <div class="book-steps">
        
        <!-- STEP 1: Installation Type -->
        <div class="glass-card book-step-card">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span class="step-num-badge">1</span>
            <h3 class="text-section-title">Installation Type</h3>
          </div>

          <div class="segmented-control" style="width: 100%; display: flex; margin-bottom: 12px;">
            <button class="segmented-option ${draft.installType === 'home_visit' ? 'active' : ''}" id="seg-home-visit" style="flex: 1; justify-content: center;">
              🏠 Doorstep Home Visit (+${formatCurrency(store.pricingRules.install_home)})
            </button>
            <button class="segmented-option ${draft.installType === 'service_center' ? 'active' : ''}" id="seg-service-center" style="flex: 1; justify-content: center;">
              🏢 Service Center (+${formatCurrency(store.pricingRules.install_center)})
            </button>
          </div>

          ${draft.installType === 'home_visit' ? `
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Doorstep Service Address</label>
              <input type="text" id="input-delivery-address" class="form-control" value="${draft.deliveryAddress}" placeholder="Enter full residential or office address">
              <span class="text-caption" style="margin-top: 4px;">Certified technician visits with fully charged battery and diagnostics toolkit.</span>
            </div>
          ` : `
            <div>
              <label class="form-label">Select Service Center</label>
              <div class="service-center-grid">
                ${store.serviceCenters.map(sc => `
                  <div class="service-center-card ${draft.serviceCenterId === sc.id ? 'selected' : ''}" data-center-id="${sc.id}">
                    <div style="font-weight: 600; font-size: 13.5px; color: var(--text-primary);">${sc.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin: 4px 0;">${sc.address}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 600; color: var(--accent-blue);">
                      <span>📍 ${sc.distance_km} km away</span>
                      <span>★ ${sc.rating} (${sc.reviews_count})</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `}
        </div>

        <!-- STEP 2: Date & Time Slot Grid -->
        <div class="glass-card book-step-card">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span class="step-num-badge">2</span>
            <h3 class="text-section-title">Date & Available Time Slot</h3>
          </div>

          <!-- 7-Day Date Strip -->
          <div class="date-strip">
            ${store.slotsMatrix.map(day => `
              <div class="date-chip ${day.dateString === selectedDayObj.dateString ? 'selected' : ''}" data-date-str="${day.dateString}">
                <span class="date-day-name">${day.dayName}</span>
                <span class="date-day">${day.dayNumber}</span>
              </div>
            `).join("")}
          </div>

          <!-- Slots Grid -->
          <div style="font-size: 12.5px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
            Available Slots for ${selectedDayObj.dayLabel} (${selectedDayObj.dateString}):
          </div>
          <div class="slot-grid">
            ${selectedDayObj.slots.map(s => {
              const isBooked = s.bookedCount >= s.capacity;
              const isClosed = !s.isOpen;
              const isDisabled = isBooked || isClosed;
              const isSelected = draft.selectedSlotId === s.id;
              return `
                <div class="slot-pill ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
                     data-slot-id="${s.id}" 
                     ${isDisabled ? 'title="This slot is fully booked or closed by vendor"' : ''}>
                  <div>${s.timeLabel}</div>
                  <div class="slot-capacity">${isDisabled ? (isClosed ? 'Closed' : 'Booked') : `${s.capacity - s.bookedCount} slots left`}</div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Estimated Duration Badge -->
          <div class="booking-duration-notice">
            <span>⏱️</span>
            <span>Installation takes about <strong>90 min</strong>. Ready by <strong>${selectedDayObj.slots.find(s => s.id === draft.selectedSlotId)?.readyBy || "selected window finish"}</strong>.</span>
          </div>
        </div>

        <!-- STEP 3: Old Battery Exchange -->
        <div class="glass-card book-step-card">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              <span class="step-num-badge">3</span>
              <div>
                <h3 class="text-section-title">Old Battery Exchange</h3>
                <p class="text-caption">Exchange existing old battery for instant credit of <strong>${formatCurrency(store.pricingRules.exchange_credit)}</strong></p>
              </div>
            </div>
            <label class="switch">
              <input type="checkbox" id="toggle-exchange-credit" ${draft.hasExchange ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>

      </div>

      <!-- STEP 4: Cost Summary & Sticky Confirmation Card -->
      <div class="glass-card order-summary-card">
        <div style="display: flex; align-items: center; margin-bottom: 14px;">
          <span class="step-num-badge">4</span>
          <h3 class="text-section-title">Cost Summary</h3>
        </div>

        <div class="summary-line-item">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${battery.name}</span>
          <span class="tabular-nums">${formatCurrency(costBreakdown.batteryPrice)}</span>
        </div>

        <div class="summary-line-item">
          <span>Installation (${draft.installType === 'home_visit' ? 'Home' : 'Center'})</span>
          <span class="tabular-nums">${formatCurrency(costBreakdown.installFee)}</span>
        </div>

        ${costBreakdown.travelFee > 0 ? `
          <div class="summary-line-item">
            <span>Travel Charge</span>
            <span class="tabular-nums">${formatCurrency(costBreakdown.travelFee)}</span>
          </div>
        ` : ""}

        ${draft.hasExchange ? `
          <div class="summary-line-item credit">
            <span>Exchange Credit</span>
            <span class="tabular-nums">- ${formatCurrency(costBreakdown.exchangeCredit)}</span>
          </div>
        ` : ""}

        <div class="summary-line-item">
          <span>GST Taxes (18%)</span>
          <span class="tabular-nums">${formatCurrency(costBreakdown.taxAmount)}</span>
        </div>

        <div class="summary-line-item total">
          <span>Total Amount</span>
          <span class="tabular-nums">${formatCurrency(costBreakdown.totalAmount)}</span>
        </div>

        <button id="btn-confirm-booking" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 18px;" ${!isSlotSelected ? 'disabled' : ''}>
          ${isSlotSelected ? 'Confirm Order & Appointment' : 'Select a Slot to Continue'}
        </button>

        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11.5px; color: var(--text-secondary); margin-top: 10px;">
          <span>🔒</span> Certified Technician Guarantee • Free Cancel
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. ORDERS & REAL-TIME TRACKING TAB
// --------------------------------------------------------------------------
function renderOrdersTab() {
  const selectedOrder = store.orders.find(o => o.id === store.selectedOrderId) || store.orders[0];

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">My Orders & Installations</h1>
        <p class="text-secondary">Track appointment progress, technician updates, and warranty certificates</p>
      </div>
    </div>

    ${store.orders.length === 0 ? `
      <div class="glass-card empty-state">
        <div class="empty-state-icon">📦</div>
        <h2 class="text-title-medium">No Orders Yet</h2>
        <p class="text-secondary">Place an order for a compatible EV battery with installation to track here.</p>
        <button class="btn btn-primary" onclick="window.voltfitRouter.navigate('find')">Browse Batteries</button>
      </div>
    ` : `
      <div class="order-detail-layout">
        <!-- Left: Active Order Details & Status Timeline -->
        <div style="display: flex; flex-direction: column; gap: 18px; min-width: 0;">
          
          <!-- Orders Horizontal Switcher Strip (Clean & Perfectly Aligned) -->
          <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px;">
            ${store.orders.map(o => `
              <div class="glass-card interactive ${o.id === selectedOrder.id ? 'selected' : ''}" 
                   style="padding: 12px 14px; min-width: 210px; max-width: 230px; flex-shrink: 0; cursor: pointer; display: flex; flex-direction: column;" 
                   onclick="window.voltfitStore.selectedOrderId = '${o.id}'; window.voltfitStore.notify();">
                <div style="font-weight: 700; font-size: 13.5px; font-family: var(--font-mono); color: var(--text-primary); white-space: nowrap;">
                  #${o.order_number}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin: 3px 0 8px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${o.bike.brand} ${o.bike.model}
                </div>
                <div style="margin-top: auto;">
                  ${renderStatusChip(o.status)}
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Main Order Card -->
          <div class="glass-card">
            <div class="order-detail-header">
              <div>
                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--accent-blue); letter-spacing: 0.04em;">Order Reference</div>
                <h2 class="text-title-medium" style="margin-top: 2px;">#${selectedOrder.order_number}</h2>
                <div style="font-size: 13px; color: var(--text-secondary);">${selectedOrder.bike.brand} ${selectedOrder.bike.model} (${selectedOrder.bike.registration_number})</div>
              </div>
              <div>
                ${renderStatusChip(selectedOrder.status)}
              </div>
            </div>

            <!-- Milestone Timeline -->
            <div style="margin: 18px 0;">
              <h3 class="text-section-title" style="margin-bottom: 12px;">Installation Milestone Timeline</h3>
              <div class="timeline">
                ${renderTimelineStep(selectedOrder.status, "placed", "Order Placed", "Your order has been recorded and transmitted to the vendor.")}
                ${renderTimelineStep(selectedOrder.status, "confirmed", "Confirmed by Vendor", "Vendor confirmed stock & prepared the battery pack.")}
                ${renderTimelineStep(selectedOrder.status, "technician_assigned", "Technician Assigned", "Certified EV technician assigned to your installation.")}
                ${renderTimelineStep(selectedOrder.status, "technician_on_the_way", "Technician on the Way", "Technician dispatched with battery & diagnostic kit.")}
                ${renderTimelineStep(selectedOrder.status, "installing", "Installing & Diagnostics", "Old battery disconnected, new battery installed, BMS tested.")}
                ${renderTimelineStep(selectedOrder.status, "completed", "Completed & Certified", "Customer sign-off complete. Warranty registered.")}
              </div>
            </div>

            <!-- Live Map (Home Visits when technician is on the way) -->
            ${(selectedOrder.status === 'technician_on_the_way' && selectedOrder.install_type === 'home_visit') ? `
              <div style="margin-top: 18px;">
                <h3 class="text-section-title" style="margin-bottom: 6px;">Live Technician GPS Tracking</h3>
                <div id="customer-live-map" class="live-map-container"></div>
              </div>
            ` : ""}

            <!-- Completion & Warranty Certificate Download -->
            ${selectedOrder.status === 'completed' ? `
              <div class="glass-card" style="margin-top: 18px; background: rgba(52, 199, 89, 0.08); border-color: rgba(52, 199, 89, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                  <div>
                    <div style="font-size: 15px; font-weight: 700; color: var(--success-green);">✓ Installation Verified & Certified</div>
                    <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">Digital Warranty ID: <strong>${selectedOrder.warranty_certificate_id || 'WTY-VF-98412'}</strong></div>
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" id="btn-download-invoice" data-order-id="${selectedOrder.id}">📄 Tax Invoice</button>
                    <button class="btn btn-success btn-sm" id="btn-view-warranty" data-order-id="${selectedOrder.id}">🛡️ Warranty Card</button>
                  </div>
                </div>
              </div>
            ` : ""}

          </div>
        </div>

        <!-- Right Column: Appointment & Dynamic Technician Card -->
        <div style="display: flex; flex-direction: column; gap: 16px; min-width: 0;">
          
          <!-- Appointment Info Card -->
          <div class="glass-card">
            <h3 class="text-section-title" style="margin-bottom: 10px;">Appointment Details</h3>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <div>
                <span class="text-secondary">Type:</span> <strong>${selectedOrder.install_type === 'home_visit' ? '🏠 Doorstep Home Visit' : '🏢 Service Center'}</strong>
              </div>
              <div>
                <span class="text-secondary">Scheduled Date:</span> <strong>${selectedOrder.slot.date}</strong>
              </div>
              <div>
                <span class="text-secondary">Time Window:</span> <strong>${selectedOrder.slot.time}</strong>
              </div>
              <div>
                <span class="text-secondary">Est. Completion:</span> <strong>Ready by ${selectedOrder.slot.ready_by}</strong>
              </div>
              ${selectedOrder.delivery_address ? `
                <div>
                  <span class="text-secondary">Address:</span> <div style="font-size: 12px; margin-top: 2px; line-height: 1.35;">${selectedOrder.delivery_address}</div>
                </div>
              ` : `
                <div>
                  <span class="text-secondary">Location:</span> <div style="font-size: 12px; margin-top: 2px; line-height: 1.35;">${selectedOrder.service_center?.name || 'VoltFit Service Hub'}</div>
                </div>
              `}
            </div>

            ${selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' ? `
              <div style="display: flex; gap: 8px; margin-top: 14px;">
                <button class="btn btn-glass btn-sm" style="flex: 1;" id="btn-reschedule-order" data-order-id="${selectedOrder.id}">Reschedule</button>
                <button class="btn btn-danger btn-sm" style="flex: 1;" id="btn-cancel-order" data-order-id="${selectedOrder.id}">Cancel</button>
              </div>
            ` : ""}
          </div>

          <!-- Dynamic Technician Card (Revealed only when assigned) -->
          <div class="glass-card ${selectedOrder.technician ? 'technician-card-assigned' : ''}">
            <h3 class="text-section-title" style="margin-bottom: 10px;">Assigned Technician</h3>
            
            ${selectedOrder.technician ? `
              <div class="technician-profile-header">
                <img src="${selectedOrder.technician.photo}" alt="Tech" class="tech-photo">
                <div style="min-width: 0; flex: 1;">
                  <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${selectedOrder.technician.name}</div>
                  <div style="font-size: 11.5px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${selectedOrder.technician.certification}</div>
                  <div style="font-size: 12px; font-weight: 600; color: var(--accent-blue); margin-top: 2px;">★ ${selectedOrder.technician.rating} Certified Rating</div>
                </div>
              </div>
              <div style="display: flex; gap: 8px; margin-top: 10px;">
                <a href="tel:${selectedOrder.technician.phone}" class="btn btn-primary btn-sm" style="flex: 1; min-width: 0;">📞 Call</a>
                <button class="btn btn-secondary btn-sm" style="flex: 1; min-width: 0;" onclick="window.voltfitShowToast('Direct Chat', 'Connecting secure technician chat channel...', '💬')">💬 Chat</button>
              </div>
            ` : `
              <div class="tech-placeholder-box">
                <div style="font-size: 22px; margin-bottom: 4px;">👨‍🔧</div>
                <div>Technician details will appear once assigned by the vendor</div>
              </div>
            `}
          </div>

          <!-- Cost Breakdown Card -->
          <div class="glass-card">
            <h3 class="text-section-title" style="margin-bottom: 8px;">Order Amount</h3>
            <div class="summary-line-item">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Battery</span>
              <span class="tabular-nums">${formatCurrency(selectedOrder.costs.battery_price)}</span>
            </div>
            <div class="summary-line-item">
              <span>Installation</span>
              <span class="tabular-nums">${formatCurrency(selectedOrder.costs.install_fee)}</span>
            </div>
            ${selectedOrder.costs.travel_fee > 0 ? `
              <div class="summary-line-item">
                <span>Travel Charge</span>
                <span class="tabular-nums">${formatCurrency(selectedOrder.costs.travel_fee)}</span>
              </div>
            ` : ""}
            ${selectedOrder.has_exchange ? `
              <div class="summary-line-item credit">
                <span>Exchange Credit</span>
                <span class="tabular-nums">- ${formatCurrency(selectedOrder.costs.exchange_credit)}</span>
              </div>
            ` : ""}
            <div class="summary-line-item total">
              <span>Total Paid</span>
              <span class="tabular-nums">${formatCurrency(selectedOrder.costs.total_amount)}</span>
            </div>
          </div>

        </div>
      </div>
    `}
  `;
}

function renderTimelineStep(currentStatus, stepKey, title, desc) {
  const order = ["placed", "confirmed", "technician_assigned", "technician_on_the_way", "installing", "completed"];
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepKey);

  let stateClass = "";
  let icon = "○";

  if (stepIdx < currentIdx || currentStatus === "completed") {
    stateClass = "completed";
    icon = "✓";
  } else if (stepIdx === currentIdx) {
    stateClass = "current";
    icon = "●";
  }

  return `
    <div class="timeline-item ${stateClass}">
      <div class="timeline-node">${icon}</div>
      <div class="timeline-title">${title}</div>
      <div class="timeline-desc">${desc}</div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 4. MY BIKES / GARAGE TAB
// --------------------------------------------------------------------------
function renderBikesTab() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">My EV Garage</h1>
        <p class="text-secondary">Manage saved electric two-wheelers and fitment configurations</p>
      </div>
      <button id="btn-add-bike-garage" class="btn btn-primary btn-sm">+ Add Electric Bike</button>
    </div>

    <div class="bikes-grid">
      ${store.savedBikes.map(b => {
        const model = store.bikeModels.find(m => m.id === b.bike_model_id);
        return `
          <div class="glass-card bike-garage-card ${b.is_active ? 'active-bike' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div style="font-size: 32px;">${model?.image || "🛵"}</div>
              ${b.is_active ? `
                <span class="status-chip completed" style="font-size: 11px;">Active Bike</span>
              ` : `
                <button class="btn btn-glass btn-sm btn-set-active-bike" data-bike-id="${b.id}">Set Active</button>
              `}
            </div>

            <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary);">${model?.brand} ${model?.model}</h3>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
              “${b.nickname}” • Year ${b.year}
            </div>

            <div style="padding: 8px 12px; border-radius: 10px; background: rgba(255, 255, 255, 0.45); border: 1px solid var(--hairline); font-family: var(--font-mono); font-weight: 600; font-size: 13px; margin-bottom: 14px;">
              ${b.registration_number}
            </div>

            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
              Voltage Architecture: <strong>${model?.voltage || '72V'}</strong><br>
              Connector: <strong>${model?.connector || 'Standard'}</strong>
            </div>

            <div style="margin-top: auto; display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.voltfitStore.setSelectedBike('${b.id}'); window.voltfitRouter.navigate('find');">
                Find Batteries
              </button>
              <button class="btn btn-glass btn-sm btn-delete-bike" data-bike-id="${b.id}">🗑️</button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 5. NOTIFICATIONS TAB
// --------------------------------------------------------------------------
function renderNotificationsTab() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Notifications</h1>
        <p class="text-secondary">Updates on orders, technician dispatch, and service reminders</p>
      </div>
      <button class="btn btn-glass btn-sm" onclick="window.voltfitStore.notifications.forEach(n => n.is_read = true); window.voltfitStore.notify();">
        Mark All Read
      </button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 720px;">
      ${store.notifications.map(n => `
        <div class="glass-card" style="padding: 16px 20px; display: flex; align-items: flex-start; gap: 14px; background: ${n.is_read ? 'var(--glass-bg)' : 'var(--glass-bg-selected)'};">
          <div style="font-size: 24px;">${n.type === 'tracking' ? '🛵' : n.type === 'order' ? '⚡' : '🔔'}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 700; font-size: 14.5px; color: var(--text-primary);">${n.title}</div>
              <span style="font-size: 11.5px; color: var(--text-tertiary);">${n.time}</span>
            </div>
            <div style="font-size: 13.5px; color: var(--text-secondary); margin-top: 3px;">${n.message}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

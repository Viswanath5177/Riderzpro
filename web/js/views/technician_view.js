/* ==========================================================================
   VoltFit Technician / Field Rider View Module
   ========================================================================== */

import { store } from "../state/store.js";
import { formatCurrency, renderStatusChip, showToast, openModal, closeModal } from "../components/glass_ui.js";
import { DigitalSignaturePad } from "../components/signature.js";

export function renderTechnicianView() {
  const tab = store.currentTab;

  switch (tab) {
    case "jobs":
      return renderTechJobs();
    case "active":
      return renderTechActiveJob();
    case "earnings":
      return renderTechEarnings();
    default:
      return renderTechJobs();
  }
}

// --------------------------------------------------------------------------
// 1. TECHNICIAN JOBS QUEUE
// --------------------------------------------------------------------------
function renderTechJobs() {
  const assignedJobs = store.getAssignedTechnicianJobs();
  const isOnline = store.users.technician.isOnline;

  return `
    <!-- Online/Offline Banner -->
    <div class="tech-status-banner">
      <div class="tech-status-left">
        <div class="${isOnline ? 'online-pulse-indicator' : 'offline-indicator'}"></div>
        <div>
          <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">${store.users.technician.name}</div>
          <div style="font-size: 12.5px; color: var(--text-secondary);">
            Status: <strong style="color: ${isOnline ? 'var(--success-green)' : 'var(--text-tertiary)'};">${isOnline ? 'Online & Available for Dispatch' : 'Offline'}</strong>
          </div>
        </div>
      </div>
      <label class="switch">
        <input type="checkbox" id="toggle-tech-online" ${isOnline ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>

    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Assigned Installations</h1>
        <p class="text-secondary">Your scheduled battery fitting and diagnostic jobs</p>
      </div>
    </div>

    <div class="jobs-list">
      ${assignedJobs.length === 0 ? `
        <div class="glass-card empty-state">
          <div class="empty-state-icon">🛵</div>
          <h2 class="text-title-medium">No Active Jobs Assigned</h2>
          <p class="text-secondary">You will receive notifications here as vendors dispatch new orders.</p>
        </div>
      ` : assignedJobs.map(job => `
        <div class="glass-card job-card">
          <div class="job-card-header">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <strong style="font-size: 16px;">#${job.order_number}</strong>
                ${renderStatusChip(job.status)}
              </div>
              <div style="font-size: 13.5px; font-weight: 600; color: var(--text-primary); margin-top: 4px;">
                ${job.bike.brand} ${job.bike.model} (${job.bike.registration_number})
              </div>
              <div style="font-size: 12.5px; color: var(--text-secondary);">
                ${job.battery.name} • ${job.battery.voltage}V ${job.battery.capacity_ah}Ah
              </div>
            </div>
            <div style="text-align: right;">
              <span class="brand-badge">${job.install_type === 'home_visit' ? '🏠 Home Visit' : '🏢 Center'}</span>
            </div>
          </div>

          <div class="job-meta-row">
            <div class="job-meta-item">
              <span>📅</span> <strong>${job.slot.date} (${job.slot.time})</strong>
            </div>
            <div class="job-meta-item">
              <span>📍</span> <span>${job.delivery_address || [job.service_center?.name, job.service_center?.address].filter(Boolean).join(' — ') || 'Location details unavailable'}</span>
            </div>
            <div class="job-meta-item">
              <span>⏱️</span> <span>Est. 90 mins</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 6px;">
            ${job.status === 'technician_assigned' ? `
              <button class="btn btn-primary btn-sm btn-tech-start-job" data-order-id="${job.id}" style="flex: 1;">
                🛵 Start Job & En Route
              </button>
            ` : (job.status === 'technician_on_the_way' || job.status === 'installing') ? `
              <button class="btn btn-primary btn-sm btn-tech-open-active" data-order-id="${job.id}" style="flex: 1;">
                📋 Open Active Diagnostic Checklist
              </button>
            ` : `
              <button class="btn btn-glass btn-sm" disabled style="flex: 1;">Job Completed</button>
            `}
            <a href="tel:${job.customer_phone}" class="btn btn-glass btn-sm">📞 Call Customer</a>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. ACTIVE JOB & DIAGNOSTIC CHECKLIST
// --------------------------------------------------------------------------
function renderTechActiveJob() {
  const activeOrder = store.getActiveTechnicianJob();

  if (!activeOrder) {
    return `
      <div class="glass-card empty-state" style="margin-top: 40px;">
        <div class="empty-state-icon">📋</div>
        <h2 class="text-title-medium">No Active Installation in Progress</h2>
        <p class="text-secondary">Select a job from your assigned queue to begin.</p>
        <button class="btn btn-primary" onclick="window.voltfitStore.setTab('jobs')">Go to Job Queue</button>
      </div>
    `;
  }

  const cl = activeOrder.checklist || {
    battery_collected: false,
    vin_verified: false,
    old_removed: false,
    new_installed: false,
    diagnostics_passed: false,
    customer_signoff: false
  };

  const stepsDone = Object.values(cl).filter(Boolean).length;
  const progressPercent = Math.round((stepsDone / 6) * 100);
  const isAllDone = stepsDone === 6;

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Active Installation Checklist</h1>
        <p class="text-secondary">Order #${activeOrder.order_number} • ${activeOrder.customer_name} (${activeOrder.customer_phone})</p>
      </div>
      <button class="btn btn-danger btn-sm" id="btn-report-issue">⚠️ Report Issue</button>
    </div>

    <!-- Active Vehicle & Navigation Header Card -->
    <div class="glass-card" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
      <div>
        <div style="font-size: 11.5px; font-weight: 600; text-transform: uppercase; color: var(--accent-blue);">Target Bike & Battery</div>
        <div style="font-size: 16px; font-weight: 700;">${activeOrder.bike.brand} ${activeOrder.bike.model} (${activeOrder.bike.registration_number})</div>
        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
          Fitting: <strong>${activeOrder.battery.name}</strong> (${activeOrder.battery.voltage}V ${activeOrder.battery.capacity_ah}Ah)
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <a href="https://maps.google.com/?q=${encodeURIComponent(activeOrder.delivery_address || 'Bengaluru')}" target="_blank" class="btn btn-glass btn-sm">
          📍 Open Navigation
        </a>
        <a href="tel:${activeOrder.customer_phone}" class="btn btn-secondary btn-sm">📞 Call Customer</a>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="glass-card" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">Installation Verification Progress</span>
        <span style="font-weight: 700; color: var(--accent-blue);">${progressPercent}% (${stepsDone}/6 Steps)</span>
      </div>
      <div style="width: 100%; height: 8px; border-radius: 999px; background: rgba(120, 120, 128, 0.15); overflow: hidden;">
        <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #007aff, #34c759); transition: width 0.3s ease;"></div>
      </div>
    </div>

    <!-- 6-Step Checklist -->
    <div class="checklist-container">
      
      <!-- Step 1 -->
      <div class="checklist-step ${cl.battery_collected ? 'done' : ''}" data-step-key="battery_collected">
        <div class="step-checkbox">${cl.battery_collected ? '✓' : ''}</div>
        <div class="step-content">
          <div class="step-title">1. Collect Battery from Vendor Warehouse</div>
          <div class="step-subtitle">Verify packaging seal, serial number, and voltage state-of-charge.</div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="checklist-step ${cl.vin_verified ? 'done' : ''}" data-step-key="vin_verified">
        <div class="step-checkbox">${cl.vin_verified ? '✓' : ''}</div>
        <div class="step-content">
          <div class="step-title">2. Verify Bike Model & VIN Registration</div>
          <div class="step-subtitle">Confirm ${activeOrder.bike.brand} ${activeOrder.bike.model} match and registration: ${activeOrder.bike.registration_number}.</div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="checklist-step ${cl.old_removed ? 'done' : ''}" data-step-key="old_removed">
        <div class="step-checkbox">${cl.old_removed ? '✓' : ''}</div>
        <div class="step-content">
          <div class="step-title">3. Disconnect & Remove Old Battery Pack</div>
          <div class="step-subtitle">Isolate high-voltage breaker, unplug BMS signal harness safely.</div>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="checklist-step ${cl.new_installed ? 'done' : ''}" data-step-key="new_installed">
        <div class="step-checkbox">${cl.new_installed ? '✓' : ''}</div>
        <div class="step-content">
          <div class="step-title">4. Install New Battery & Secure Harness</div>
          <div class="step-subtitle">Mount bracket clamps, torque to spec, connect anti-spark connector.</div>
        </div>
      </div>

      <!-- Step 5 -->
      <div class="checklist-step ${cl.diagnostics_passed ? 'done' : ''}" data-step-key="diagnostics_passed">
        <div class="step-checkbox">${cl.diagnostics_passed ? '✓' : ''}</div>
        <div class="step-content">
          <div class="step-title">5. Run Electrical & Smart BMS Diagnostics</div>
          <div class="step-subtitle">Verify cluster communication, speed controller handshake, test ride.</div>
        </div>
      </div>

      <!-- Step 6 -->
      <div class="checklist-step ${cl.customer_signoff ? 'done' : ''}" data-step-key="customer_signoff">
        <div class="step-checkbox">${cl.customer_signoff ? '✓' : ''}</div>
        <div class="step-content">
          <div class="step-title">6. Customer Digital Signature Sign-Off</div>
          <div class="step-subtitle">Customer verification and warranty certificate activation.</div>
        </div>
      </div>

    </div>

    <!-- Mandatory Verification Photos -->
    <div class="glass-card" style="margin-bottom: 20px;">
      <h3 class="text-section-title" style="margin-bottom: 6px;">Mandatory Verification Photos</h3>
      <p class="text-caption" style="margin-bottom: 12px;">Capture quality photos for warranty claims & audit logs.</p>
      
      <div class="photo-upload-grid">
        <div class="photo-box uploaded" id="box-photo-old">
          <div class="photo-box-icon">📸</div>
          <div style="font-weight: 600; font-size: 12.5px;">Old Battery Removed</div>
          <span style="font-size: 11px; color: var(--success-green);">✓ Captured</span>
        </div>
        <div class="photo-box uploaded" id="box-photo-new">
          <div class="photo-box-icon">⚡</div>
          <div style="font-weight: 600; font-size: 12.5px;">New Battery Installed</div>
          <span style="font-size: 11px; color: var(--success-green);">✓ Captured</span>
        </div>
        <div class="photo-box uploaded" id="box-photo-diag">
          <div class="photo-box-icon">📱</div>
          <div style="font-weight: 600; font-size: 12.5px;">Diagnostics Pass Screen</div>
          <span style="font-size: 11px; color: var(--success-green);">✓ Captured</span>
        </div>
      </div>
    </div>

    <!-- Customer Signature Pad -->
    <div class="glass-card" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 class="text-section-title">Customer Digital Signature</h3>
        <button id="btn-clear-sig" class="btn btn-glass btn-sm">Clear</button>
      </div>
      <p class="text-caption">Customer signs below to confirm battery installation & inspection approval.</p>
      
      <div class="signature-box-container">
        <canvas id="tech-signature-pad" class="signature-canvas"></canvas>
      </div>
    </div>

    <!-- Complete Job Button -->
    <button id="btn-complete-job-final" class="btn btn-success btn-lg" style="width: 100%;" ${!isAllDone ? 'disabled' : ''}>
      ${isAllDone ? '✓ Complete Job & Activate Warranty' : `Complete Remaining Steps (${stepsDone}/6 done)`}
    </button>
  `;
}

// --------------------------------------------------------------------------
// 3. TECHNICIAN EARNINGS
// --------------------------------------------------------------------------
function renderTechEarnings() {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Technician Earnings</h1>
        <p class="text-secondary">Installation payouts, completed job incentives, and ratings</p>
      </div>
    </div>

    <div class="vendor-kpi-grid">
      <div class="glass-card stat-card">
        <span class="stat-label">Today's Earnings</span>
        <div class="stat-value tabular-nums">${formatCurrency(1850)}</div>
        <div class="stat-trend positive">3 Jobs Completed</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">This Week</span>
        <div class="stat-value tabular-nums">${formatCurrency(12400)}</div>
        <div class="stat-trend positive">18 Total Jobs</div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-label">Customer Rating</span>
        <div class="stat-value tabular-nums">4.9 ★</div>
        <div class="stat-trend positive">Top 5% Performer</div>
      </div>
    </div>

    <div class="glass-card">
      <h3 class="text-section-title" style="margin-bottom: 14px;">Recent Completed Installations</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.45); border-radius: 12px;">
          <div>
            <div style="font-weight: 600;">#VF-2026-5510 • Revolt RV400</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Service Center Fitting • 5.0 ★ Rating</div>
          </div>
          <div class="tabular-nums" style="font-weight: 700; color: var(--success-green);">${formatCurrency(450)}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.45); border-radius: 12px;">
          <div>
            <div style="font-weight: 600;">#VF-2026-4419 • Ather 450X</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Doorstep Home Visit • 5.0 ★ Rating</div>
          </div>
          <div class="tabular-nums" style="font-weight: 700; color: var(--success-green);">${formatCurrency(700)}</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255, 255, 255, 0.45); border-radius: 12px;">
          <div>
            <div style="font-weight: 600;">#VF-2026-3301 • Ola S1 Pro</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Doorstep Home Visit • 4.8 ★ Rating</div>
          </div>
          <div class="tabular-nums" style="font-weight: 700; color: var(--success-green);">${formatCurrency(700)}</div>
        </div>
      </div>
    </div>
  `;
}

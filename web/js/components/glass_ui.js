/* ==========================================================================
   VoltFit Glass UI Component Renderers & Helpers
   ========================================================================== */

export const formatCurrency = (val) => {
  return "₹" + Number(val).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

export const renderStatusChip = (status) => {
  const map = {
    placed: { label: "Order Placed", class: "placed" },
    confirmed: { label: "Confirmed by Vendor", class: "confirmed" },
    technician_assigned: { label: "Technician Assigned", class: "assigned" },
    technician_on_the_way: { label: "Technician on the Way", class: "on-the-way" },
    installing: { label: "Installing & Diagnostics", class: "installing" },
    completed: { label: "Installation Completed", class: "completed" },
    cancelled: { label: "Cancelled", class: "cancelled" },
    declined: { label: "Declined", class: "declined" }
  };
  const item = map[status] || { label: status, class: "placed" };
  const isPulsing = status === "technician_on_the_way" || status === "installing";
  return `
    <span class="status-chip ${item.class}">
      <span class="status-dot ${isPulsing ? 'pulsing' : ''}"></span>
      ${item.label}
    </span>
  `;
};

export const showToast = (title, message, icon = "⚡") => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "glass-toast";
  toast.innerHTML = `
    <div style="font-size: 20px;">${icon}</div>
    <div style="flex: 1;">
      <div style="font-weight: 600; font-size: 13.5px; color: var(--text-primary);">${title}</div>
      <div style="font-size: 12.5px; color: var(--text-secondary);">${message}</div>
    </div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 250);
  }, 3800);
};

export const openModal = (title, contentHtml) => {
  let overlay = document.getElementById("global-modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "global-modal-overlay";
    overlay.className = "glass-modal-overlay";
    overlay.innerHTML = `
      <div class="glass-modal-sheet">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 id="modal-title" class="text-title-medium"></h2>
          <button id="modal-close-btn" class="btn btn-glass btn-sm" style="border-radius: 50%; width: 32px; height: 32px; padding: 0;">✕</button>
        </div>
        <div id="modal-body-content"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector("#modal-close-btn").onclick = () => closeModal();
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };
  }

  overlay.querySelector("#modal-title").innerText = title;
  overlay.querySelector("#modal-body-content").innerHTML = contentHtml;
  overlay.classList.add("active");
};

export const closeModal = () => {
  const overlay = document.getElementById("global-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
};

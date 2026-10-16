/* ==========================================================================
   Riderzpro Customer View Module (Refined Layout Alignment & Extended Catalog)
   ========================================================================== */

import { store } from "../state/store.js";
import { formatCurrency, renderStatusChip, showToast, openModal, closeModal } from "../components/glass_ui.js";
import { LiveMapCanvas } from "../components/map_view.js";
let vehicleCatalog = { products: [] };
let vehicleImages = { images: [] };
let accessoryCatalog = { products: [], price_note: "" };
Promise.all([
  fetch(new URL("../../data/ev_two_wheeler_catalog.json", import.meta.url)).then(response => response.ok ? response.json() : null),
  fetch(new URL("../../data/ev_image_manifest.json", import.meta.url)).then(response => response.ok ? response.json() : null),
  fetch(new URL("../../data/vehicle_accessories.json", import.meta.url)).then(response => response.ok ? response.json() : null)
]).then(([catalog, images, accessories]) => {
  if (catalog?.products) vehicleCatalog = catalog;
  if (images?.images) vehicleImages = images;
  if (accessories?.products) accessoryCatalog = accessories;
  store.notify();
}).catch(error => console.warn("Vehicle catalog could not be loaded:", error));

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function priceBasisLabel(value = "") {
  const labels = {
    starting_ex_showroom: "Starting ex-showroom",
    starting_price_before_local_charges: "Starting price before local charges",
    ex_showroom: "Ex-showroom",
    ex_showroom_without_baas: "Ex-showroom, without BaaS",
    starting_price: "Starting price",
    ex_showroom_bengaluru: "Ex-showroom, Bengaluru",
    ex_showroom_starting_price: "Starting ex-showroom price"
  };
  return labels[value] || value.replaceAll("_", " ");
}

function availabilityLabel(value = "") {
  if (value === "listed_check_retail" || value === "listed_verify_stock") return "Listed · In Stock";
  return value.replaceAll("_", " ");
}

function renderAccessoryCard(product) {
  const price = formatCurrency(product.price_inr);
  return `
    <article class="glass-card accessory-card" data-accessory-id="${escapeHtml(product.id)}">
      <div class="accessory-image">
        <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.image_alt)}" loading="lazy" onerror="this.parentElement.classList.add('no-accessory-image'); this.remove();">
        <span class="accessory-vehicle-badge">${product.vehicle_type === "car" ? "🚘 Car" : "🏍️ Bike"}</span>
      </div>
      <div class="accessory-content">
        <div class="accessory-meta">
          <span class="accessory-brand-tag">${escapeHtml(product.brand)}</span>
          <span class="accessory-subcat-tag">${escapeHtml(product.subcategory || product.category)}</span>
        </div>
        <h2 class="accessory-card-title">${escapeHtml(product.name)}</h2>
        <div class="accessory-card-footer">
          <div class="accessory-price-block">
            <span class="accessory-price">${price}</span>
            <span class="accessory-rating-stars">★★★★★ <small>4.8</small></span>
          </div>
          <button type="button" class="btn btn-primary accessory-select-cta" data-accessory-id="${escapeHtml(product.id)}">
            View Details →
          </button>
        </div>
      </div>
    </article>`;
}

function filteredAccessories() {
  const query = (store.accessorySearch || "").trim().toLowerCase();
  const cat = store.accessoryCategory || "all";
  return accessoryCatalog.products.filter(product => {
    const detailsStr = Array.isArray(product.details) ? product.details.join(" ") : "";
    const subcatsStr = Array.isArray(product.subcategories) ? product.subcategories.join(" ") : (product.subcategory || "");
    const text = `${product.brand} ${product.name} ${product.category} ${subcatsStr} ${product.part_number || ""} ${product.fitment || ""} ${detailsStr}`.toLowerCase();
    const matchesVehicle = (store.accessoryVehicleType === "all" || product.vehicle_type === store.accessoryVehicleType);
    const matchesQuery = (!query || text.includes(query));
    const matchesCategory = (cat === "all" ||
      product.category === cat ||
      product.subcategory === cat ||
      (product.subcategories && product.subcategories.includes(cat)) ||
      text.includes(cat.toLowerCase()));
    return matchesVehicle && matchesQuery && matchesCategory;
  });
}

window.riderzproSelectSubcategory = function(subcat) {
  store.accessoryCategory = (subcat === "All" || subcat === "all") ? "all" : subcat;
  const pills = document.querySelectorAll(".accessory-pill");
  pills.forEach(p => {
    const isThis = p.textContent.trim() === subcat || ((subcat === "all" || subcat === "All") && p.textContent.trim() === "All");
    if (isThis) p.classList.add("active");
    else p.classList.remove("active");
  });
  window.riderzproFilterAccessories();
};

window.riderzproScrollSubcategories = function(offset) {
  const track = document.getElementById("accessory-pills-track");
  if (track) track.scrollBy({ left: offset, behavior: "smooth" });
};

window.riderzproFilterAccessories = function() {
  const search = document.getElementById("accessory-search");
  const vehicle = document.getElementById("accessory-vehicle-type");
  const cat = document.getElementById("accessory-category");
  store.accessorySearch = search?.value || "";
  store.accessoryVehicleType = vehicle?.value || "all";
  if (cat) store.accessoryCategory = cat.value;
  const products = filteredAccessories();
  const count = document.getElementById("accessory-results-count");
  if (count) count.textContent = `${products.length} accessories`;
  const grid = document.getElementById("accessory-grid-container");
  if (grid) grid.innerHTML = products.length
    ? `<div class="accessory-grid">${products.map(renderAccessoryCard).join("")}</div>`
    : `<div class="glass-card empty-state"><div class="empty-state-icon">🧰</div><h2 class="text-title-medium">No accessories found</h2><p class="text-secondary">Try a different search or filter.</p></div>`;
};

function catalogImage(product) {
  if (product.image_url) return { url: product.image_url, alt: product.image_alt || `${product.brand} ${product.model}` };
  const manifestImage = vehicleImages.images.find(image => product.id === image.slug || product.id.startsWith(`${image.slug}-`));
  return manifestImage ? { url: manifestImage.image_url, alt: manifestImage.alt } : null;
}

function renderCatalogBike(product) {
  const image = catalogImage(product);
  const price = product.price_inr ? formatCurrency(product.price_inr) : "Price not listed";
  const bookingUrl = product.source_url && product.source_url !== "#"
    ? product.source_url
    : `https://www.google.com/search?q=${encodeURIComponent(`${product.brand} ${product.model} official booking`)}`;
  const facts = [
    ["Range", product.claimed_range_km ? `${product.claimed_range_km} km` : "Not provided"],
    ["Top speed", product.top_speed_kmh ? `${product.top_speed_kmh} km/h` : "Not provided"],
    ["Battery", product.battery_capacity_kwh ? `${product.battery_capacity_kwh} kWh` : "Not provided"],
    ["Charging", product.charging_time_text || "Not provided"]
  ];
  return `
    <article class="glass-card catalog-bike-card">
      <div class="catalog-bike-image">
        ${image ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" loading="lazy" onerror="this.parentElement.classList.add('no-bike-image'); this.remove();">` : `<div class="catalog-bike-placeholder" aria-label="Bike image unavailable">🛵</div>`}
        <span class="catalog-bike-type">${escapeHtml((product.vehicle_type || "electric two-wheeler").replaceAll("_", " "))}</span>
      </div>
      <div class="catalog-bike-content">
        <div class="catalog-bike-title-row">
          <div>
            <span class="spec-label">${escapeHtml(product.brand)}</span>
            <h2>${escapeHtml(product.model)}${product.variant && product.variant.toLowerCase() !== "base" ? ` <span>${escapeHtml(product.variant)}</span>` : ""}</h2>
          </div>
          <span class="catalog-bike-availability">${escapeHtml(availabilityLabel(product.availability || "Listed"))}</span>
        </div>
        <div class="catalog-bike-price">${price}<small>${escapeHtml(priceBasisLabel(product.price_type || ""))}</small></div>
        <div class="catalog-bike-facts">${facts.map(([label, value]) => `<div><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
        ${product.price_note ? `<p class="catalog-bike-note">${escapeHtml(product.price_note)}</p>` : ""}
        <details class="vehicle-catalog-more"><summary>Full specifications</summary><div>
          <span>Brand and model: ${escapeHtml(product.brand)} ${escapeHtml(product.model)} · ${escapeHtml(product.variant || "Standard")}</span>
          <span>Vehicle type: ${escapeHtml((product.vehicle_type || "electric two-wheeler").replaceAll("_", " "))}</span>
          <span>Advertised price: ${price} (${escapeHtml(priceBasisLabel(product.price_type || ""))})</span>
          <span>Availability: ${escapeHtml(availabilityLabel(product.availability || "In Stock"))}</span>
          <span>Market: ${escapeHtml(product.market || "India")}</span>
          <span>Estimated delivery: ${product.delivery_estimate_hours == null ? "Standard delivery" : `${escapeHtml(product.delivery_estimate_hours)} hours`}</span>
          <span>Claimed range: ${facts[0][1]} · Top speed: ${facts[1][1]}</span>
          <span>Battery capacity: ${facts[2][1]} · Charging time: ${facts[3][1]}</span>
        </div></details>
        <a class="btn btn-primary catalog-book-bike" href="${escapeHtml(bookingUrl)}" target="_blank" rel="noopener noreferrer">Book Now ↗</a>
      </div>
    </article>`;
}

window.riderzproSearchCatalog = function() {
  const searchInput = document.getElementById("catalog-bike-search");
  const typeSelect = document.getElementById("catalog-bike-type");
  store.catalogSearch = searchInput ? searchInput.value : "";
  store.catalogVehicleType = typeSelect ? typeSelect.value : "all";

  const query = (store.catalogSearch || "").trim().toLowerCase();
  const type = store.catalogVehicleType || "all";
  const products = vehicleCatalog.products.filter(product => {
    const matchesQuery = !query || `${product.brand} ${product.model} ${product.variant}`.toLowerCase().includes(query);
    return matchesQuery && (type === "all" || product.vehicle_type === type);
  });
  const countEl = document.getElementById("catalog-results-count");
  if (countEl) {
    countEl.textContent = `${products.length} of ${vehicleCatalog.products.length} bikes`;
  }

  const container = document.getElementById("catalog-bike-grid-container");
  if (container) {
    container.innerHTML = products.length
      ? `<div class="catalog-bike-grid">${products.map(renderCatalogBike).join("")}</div>`
      : `<div class="glass-card empty-state"><div class="empty-state-icon">🛵</div><h2 class="text-title-medium">No bikes found</h2><p class="text-secondary">Try another search or vehicle type.</p></div>`;
  }
};

export function renderCustomerView() {
  const tab = store.currentTab;

  switch (tab) {
    case "find":
      return renderFindTab();
    case "accessories":
      return renderAccessoriesTab();
    case "accessory-booking":
      return renderAccessoryBookingTab();
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

function renderAccessoryBookingTab() {
  const product = accessoryCatalog.products.find(item => item.id === store.selectedAccessoryId);
  if (!product) {
    return `<section class="glass-card empty-state accessory-booking-empty"><div class="empty-state-icon">🧰</div><h1 class="text-title-medium">Choose an accessory first</h1><p class="text-secondary">Select a product from the accessories catalog to review its details.</p><button type="button" class="btn btn-primary" data-accessory-back>Browse accessories</button></section>`;
  }
  const image = `<img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.image_alt)}" onerror="this.parentElement.classList.add('no-accessory-image'); this.remove();">`;
  const price = formatCurrency(product.price_inr);
  return `
    <div class="accessory-fullscreen-view">
      <div class="accessory-fullscreen-topbar">
        <button type="button" class="btn btn-glass accessory-back-btn" data-accessory-back>← Back to shop</button>
        <div class="accessory-fullscreen-breadcrumbs">
          <span>Shop</span> › <span>${escapeHtml(product.category)}</span> › <strong class="breadcrumb-active">${escapeHtml(product.name)}</strong>
        </div>
      </div>

      <div class="accessory-fullscreen-layout">
        <!-- Left: Product Hero Media -->
        <div class="glass-card accessory-fullscreen-media">
          <div class="accessory-hero-image-wrap">
            ${image}
            <span class="accessory-vehicle-badge large">${product.vehicle_type === "car" ? "🚘 Car accessory" : "🏍️ Bike accessory"}</span>
          </div>
          <div class="accessory-trust-strip">
            <div class="accessory-trust-item"><span>🛡️</span><strong>100% Genuine</strong></div>
            <div class="accessory-trust-item"><span>✅</span><strong>Verified Fitment</strong></div>
            <div class="accessory-trust-item"><span>⭐</span><strong>4.8 Rating</strong></div>
          </div>
        </div>

        <!-- Right: Comprehensive Info & Specifications -->
        <div class="accessory-fullscreen-info-column">
          <div class="glass-card accessory-fullscreen-card">
            <div class="accessory-detail-header">
              <div class="accessory-detail-tags">
                <span class="spec-label">${escapeHtml(product.brand)}</span>
                <span class="subcat-pill">${escapeHtml(product.subcategory || product.category)}</span>
              </div>
              <h1 class="accessory-fullscreen-title">${escapeHtml(product.name)}</h1>
              <div class="accessory-fullscreen-price-box">
                <div class="price-main">${price}</div>
                <div class="price-sub">Listed Price · Taxes &amp; Fitment verified with supplier</div>
              </div>
            </div>

            <!-- Vehicle Fitment Box -->
            <div class="accessory-fitment-box">
              <div class="accessory-fitment-title">
                <span class="fitment-icon">🏍️</span>
                <strong>Vehicle Compatibility &amp; Fitment</strong>
              </div>
              <p class="accessory-fitment-desc">${escapeHtml(product.fitment)}</p>
            </div>

            <!-- Complete Specifications Grid -->
            <div class="accessory-specs-section">
              <h3 class="accessory-section-heading">Technical Specifications</h3>
              <div class="accessory-specs-grid">
                <div class="spec-item"><span class="spec-k">Part Number / SKU</span><strong class="spec-v">${escapeHtml(product.part_number || "RZP-" + product.id)}</strong></div>
                <div class="spec-item"><span class="spec-k">Manufacturer / Brand</span><strong class="spec-v">${escapeHtml(product.brand)}</strong></div>
                <div class="spec-item"><span class="spec-k">Vehicle Type</span><strong class="spec-v">${product.vehicle_type === "car" ? "Car" : "Motorcycle & Scooter"}</strong></div>
                <div class="spec-item"><span class="spec-k">Category</span><strong class="spec-v">${escapeHtml(product.category)}</strong></div>
                <div class="spec-item"><span class="spec-k">Subcategory</span><strong class="spec-v">${escapeHtml(product.subcategory || "Automotive Spares")}</strong></div>
                <div class="spec-item"><span class="spec-k">Warranty</span><strong class="spec-v">12 Months Manufacturer Warranty</strong></div>
                <div class="spec-item"><span class="spec-k">Seller / Dealer</span><strong class="spec-v">${escapeHtml(product.source_name)}</strong></div>
                <div class="spec-item"><span class="spec-k">Installation</span><strong class="spec-v">Professional dealer / DIY fitment</strong></div>
              </div>
            </div>

            <!-- Key Features & Details -->
            <div class="accessory-features-section">
              <h3 class="accessory-section-heading">Key Features &amp; Details</h3>
              <ul class="accessory-features-list">
                ${product.details.map(detail => `<li><span class="feature-check">✓</span><span>${escapeHtml(detail)}</span></li>`).join("")}
              </ul>
            </div>

            <!-- Actions and Booking -->
            <div class="accessory-fullscreen-actions">
              <a class="btn btn-primary accessory-checkout-cta" href="${escapeHtml(product.source_url)}" target="_blank" rel="noopener noreferrer">
                Book Now · Continue to Official Listing ↗
              </a>
              <button type="button" class="btn btn-glass accessory-back-link" data-accessory-back>
                Keep Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

const ACCESSORY_SUBCATEGORIES = [
  "All",
  "Amaze Plus",
  "D-3 Seat Cover",
  "H-Cross",
  "U-Focus",
  "U-Highway",
  "X-Cross",
  "2 Wheeler Mats",
  "Amaze Duo +",
  "Bungee Ropes",
  "Mobile Holders",
  "Bags",
  "Microfibre Cleaning Cloth",
  "Tank Covers",
  "Car Care",
  "Comfort Accessories",
  "Car Organisers",
  "Padded Seat Cover",
  "Steering Covers",
  "Utilities",
  "EV Accessories",
  "7D U Max 2 Row",
  "Scooty Body Covers",
  "Bike Body Covers"
];

function renderAccessoriesTab() {
  const products = filteredAccessories();
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Car &amp; Bike Accessories</h1>
        <p class="text-secondary">Browse sourced accessories, check fitment, and view current seller listings.</p>
      </div>
    </div>
    <div class="accessory-source-note">Starter listings from Maruti Suzuki Genuine Accessories, Royal Enfield, and verified automotive aftermarket providers. Prices and availability may change; confirm vehicle fitment before ordering.</div>
    <form class="catalog-toolbar accessory-toolbar" onsubmit="event.preventDefault(); window.riderzproFilterAccessories(); return false;">
      <label class="catalog-search-label">Search accessories
        <input id="accessory-search" class="form-control" type="search" placeholder="Name, brand, category or part number" value="${escapeHtml(store.accessorySearch)}" oninput="window.riderzproFilterAccessories()" autocomplete="off">
      </label>
      <label class="catalog-type-label">Vehicle
        <select id="accessory-vehicle-type" class="form-control" onchange="window.riderzproFilterAccessories()">
          <option value="all" ${store.accessoryVehicleType === "all" ? "selected" : ""}>Cars &amp; bikes</option>
          <option value="car" ${store.accessoryVehicleType === "car" ? "selected" : ""}>Car accessories</option>
          <option value="motorcycle" ${store.accessoryVehicleType === "motorcycle" ? "selected" : ""}>Bike accessories</option>
        </select>
      </label>
      <label class="catalog-type-label">Category
        <select id="accessory-category" class="form-control" onchange="window.riderzproFilterAccessories()">
          <option value="all">All categories</option>
          ${ACCESSORY_SUBCATEGORIES.filter(sc => sc !== "All").map(item => `
            <option value="${escapeHtml(item)}" ${(store.accessoryCategory === item) ? "selected" : ""}>${escapeHtml(item)}</option>
          `).join("")}
        </select>
      </label>
      <span class="catalog-results-count" id="accessory-results-count">${products.length} accessories</span>
    </form>

    <div id="accessory-grid-container">
      ${products.length ? `<div class="accessory-grid">${products.map(renderAccessoryCard).join("")}</div>` : `<div class="glass-card empty-state"><div class="empty-state-icon">🧰</div><h2 class="text-title-medium">No accessories found</h2><p class="text-secondary">Try a different search or subcategory filter.</p></div>`}
    </div>
    <p class="accessory-disclaimer">${escapeHtml(accessoryCatalog.price_note)}</p>
  `;
}

// --------------------------------------------------------------------------
// 1. FIND & DISCOVERY TAB
// --------------------------------------------------------------------------
function renderFindTab() {
  const query = (store.catalogSearch || "").trim().toLowerCase();
  const type = store.catalogVehicleType || "all";
  const products = vehicleCatalog.products.filter(product => {
    const matchesQuery = !query || `${product.brand} ${product.model} ${product.variant}`.toLowerCase().includes(query);
    return matchesQuery && (type === "all" || product.vehicle_type === type);
  });
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="text-title-large">Find Bike</h1>
        <p class="text-secondary">Browse verified electric two-wheelers in Riderzpro ecosystem</p>
      </div>
    </div>
    <form id="catalog-search-form" class="catalog-toolbar" onsubmit="event.preventDefault(); window.riderzproSearchCatalog(); return false;">
      <label class="catalog-search-label">Search bikes
        <input id="catalog-bike-search" class="form-control" type="search" placeholder="Search brand or model" value="${escapeHtml(store.catalogSearch || "")}" oninput="window.riderzproSearchCatalog()" autocomplete="off">
      </label>
      <label class="catalog-type-label">Vehicle type
        <select id="catalog-bike-type" class="form-control" onchange="window.riderzproSearchCatalog()">
          <option value="all" ${type === "all" ? "selected" : ""}>All types</option>
          ${[...new Set(vehicleCatalog.products.map(product => product.vehicle_type).filter(Boolean))].map(item => `<option value="${escapeHtml(item)}" ${type === item ? "selected" : ""}>${escapeHtml(item.replaceAll("_", " "))}</option>`).join("")}
        </select>
      </label>
      <span class="catalog-results-count" id="catalog-results-count">${products.length} of ${vehicleCatalog.products.length} bikes</span>
      <button class="btn btn-primary catalog-search-button" type="button" onclick="window.riderzproSearchCatalog()">Search</button>
    </form>
    <div id="catalog-bike-grid-container">
      ${products.length ? `<div class="catalog-bike-grid">${products.map(renderCatalogBike).join("")}</div>` : `<div class="glass-card empty-state"><div class="empty-state-icon">🛵</div><h2 class="text-title-medium">No bikes found</h2><p class="text-secondary">Try another search or vehicle type.</p></div>`}
    </div>
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
        <button class="btn btn-primary" onclick="window.voltfitRouter.navigate('find')">Browse Bikes</button>
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
                  <span class="text-secondary">Location:</span> <div style="font-size: 12px; margin-top: 2px; line-height: 1.35;">${selectedOrder.service_center?.name || 'Riderzpro Service Hub'}</div>
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

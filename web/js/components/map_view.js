/* ==========================================================================
   VoltFit Interactive Live Map & Real-Time Technician Route Streamer
   ========================================================================== */

export class LiveMapCanvas {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.deliveryId = options.deliveryId || null;
    this.userId = options.userId || null;
    this.userRole = options.userRole || "customer";

    this.eta = options.eta || 14;
    this.distanceKm = options.distanceKm || 3.8;
    this.speedKmh = options.speedKmh || null;
    this.deliveryStatus = options.deliveryStatus || "in_transit";
    this.isStale = false;
    this.connectionState = "connecting"; // connecting, connected, reconnecting, fallback, closed

    this.riderCoords = null; // { lat, lng, heading }
    this.pickupCoords = null;
    this.dropoffCoords = null;
    this.waypoints = null;

    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    this.container.innerHTML = "";
    this.container.appendChild(this.canvas);

    // Add ETA & Real-Time Status Floating Pill
    this.etaBadge = document.createElement("div");
    this.etaBadge.className = "map-eta-overlay";
    this.container.appendChild(this.etaBadge);
    this.updateOverlay();

    this.ctx = this.canvas.getContext("2d");
    this.progress = 0.35;
    this.targetProgress = 0.35;
    this.animId = null;

    // WebSocket & Reconnect State
    this.ws = null;
    this.isDestroyed = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimer = null;
    this.fallbackPollTimer = null;

    this.initResize();
    this.startAnimation();

    if (this.deliveryId) {
      this.initWebSocket();
    }
  }

  updateOverlay() {
    if (!this.etaBadge) return;

    let statusText = "Technician En Route";
    let statusIcon = "🛵";

    if (this.deliveryStatus === "delivered") {
      statusText = "Delivery Completed";
      statusIcon = "✅";
    } else if (this.deliveryStatus === "cancelled" || this.deliveryStatus === "failed") {
      statusText = `Delivery ${this.deliveryStatus.toUpperCase()}`;
      statusIcon = "⚠️";
    } else if (this.deliveryStatus === "picked_up") {
      statusText = "Package Picked Up";
      statusIcon = "📦";
    }

    let speedBadge = this.speedKmh ? ` • ${Math.round(this.speedKmh)} km/h` : "";
    let staleBadge = this.isStale ? ` <span style="color: #ff9500; font-weight: 600;">(Stale Signal)</span>` : "";
    let liveDot = this.connectionState === "connected"
      ? `<span style="color: #34c759; margin-left: 6px; font-size: 11px;">● Live</span>`
      : this.connectionState === "reconnecting"
      ? `<span style="color: #ff9500; margin-left: 6px; font-size: 11px;">○ Reconnecting...</span>`
      : "";

    this.etaBadge.innerHTML = `
      <span style="font-size: 16px;">${statusIcon}</span>
      <span>${statusText} • ETA <strong id="map-eta-val">${this.eta} mins</strong> (${this.distanceKm} km${speedBadge})${staleBadge}${liveDot}</span>
    `;
  }

  initWebSocket() {
    if (this.isDestroyed || !this.deliveryId) return;

    // Prevent duplicate sockets
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host || "localhost:8000";
    let wsUrl = `${protocol}//${host}/ws/deliveries/${this.deliveryId}/tracking`;

    const params = [];
    if (this.userId) params.push(`user_id=${encodeURIComponent(this.userId)}`);
    if (this.userRole) params.push(`user_role=${encodeURIComponent(this.userRole)}`);
    if (params.length > 0) wsUrl += `?${params.join("&")}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connectionState = "connected";
        this.reconnectAttempts = 0;
        this.clearFallbackPoll();
        this.updateOverlay();
        console.log(`[LiveMapCanvas] Real-time tracking connected for ${this.deliveryId}`);
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleRealtimePayload(payload);
        } catch (err) {
          console.warn("[LiveMapCanvas] Malformed WebSocket message", err);
        }
      };

      this.ws.onerror = (err) => {
        console.warn("[LiveMapCanvas] WebSocket error", err);
      };

      this.ws.onclose = (event) => {
        if (this.isDestroyed) return;
        this.connectionState = "reconnecting";
        this.updateOverlay();

        if (event.code === 1000) {
          console.log("[LiveMapCanvas] Tracking completed cleanly.");
          return;
        }

        this.scheduleReconnect();
      };
    } catch (err) {
      console.warn("[LiveMapCanvas] WebSocket initialization failed", err);
      this.scheduleReconnect();
    }
  }

  handleRealtimePayload(payload) {
    if (!payload || !payload.event) return;

    if (payload.event === "INITIAL_TRACKING_SNAPSHOT") {
      if (payload.eta_minutes !== undefined && payload.eta_minutes !== null) this.eta = payload.eta_minutes;
      if (payload.distance_km !== undefined && payload.distance_km !== null) this.distanceKm = payload.distance_km;
      if (payload.status) this.deliveryStatus = payload.status;
      if (payload.route_waypoints) this.waypoints = payload.route_waypoints;

      if (payload.rider) {
        this.riderCoords = {
          lat: payload.rider.latitude,
          lng: payload.rider.longitude,
          heading: payload.rider.heading_degrees,
          speed: payload.rider.speed_kmh
        };
        this.isStale = Boolean(payload.rider.is_stale);
        this.speedKmh = payload.rider.speed_kmh;
      }
      this.updateOverlay();
    } else if (payload.event === "RIDER_LOCATION_UPDATED") {
      if (payload.eta_minutes !== undefined && payload.eta_minutes !== null) this.eta = payload.eta_minutes;
      if (payload.distance_km !== undefined && payload.distance_km !== null) this.distanceKm = payload.distance_km;

      if (payload.rider) {
        this.riderCoords = {
          lat: payload.rider.latitude,
          lng: payload.rider.longitude,
          heading: payload.rider.heading_degrees,
          speed: payload.rider.speed_kmh
        };
        this.speedKmh = payload.rider.speed_kmh;
        this.isStale = false;
      }
      this.targetProgress = Math.min(0.85, this.progress + 0.05);
      this.updateOverlay();
    } else if (payload.event === "DELIVERY_COMPLETED") {
      this.deliveryStatus = payload.status || "delivered";
      this.targetProgress = 0.88;
      this.updateOverlay();
    }
  }

  scheduleReconnect() {
    if (this.isDestroyed) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 12000);
      this.reconnectAttempts++;
      console.log(`[LiveMapCanvas] Reconnecting in ${Math.round(delay)}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.reconnectTimer = setTimeout(() => this.initWebSocket(), delay);
    } else {
      console.warn("[LiveMapCanvas] Reconnect attempts exhausted. Falling back to REST polling.");
      this.connectionState = "fallback";
      this.updateOverlay();
      this.startFallbackPoll();
    }
  }

  startFallbackPoll() {
    if (this.fallbackPollTimer || this.isDestroyed || !this.deliveryId) return;
    this.pollTrackingData();
    this.fallbackPollTimer = setInterval(() => this.pollTrackingData(), 8000);
  }

  clearFallbackPoll() {
    if (this.fallbackPollTimer) {
      clearInterval(this.fallbackPollTimer);
      this.fallbackPollTimer = null;
    }
  }

  async pollTrackingData() {
    if (this.isDestroyed || !this.deliveryId) return;
    try {
      const res = await fetch(`/api/deliveries/${this.deliveryId}/tracking`);
      if (res.ok) {
        const data = await res.json();
        this.handleRealtimePayload({ event: "INITIAL_TRACKING_SNAPSHOT", ...data });
      }
    } catch (e) {
      // quiet fail on network poll
    }
  }

  connectTracking(deliveryId, { userId, userRole } = {}) {
    this.deliveryId = deliveryId;
    if (userId) this.userId = userId;
    if (userRole) this.userRole = userRole;
    this.reconnectAttempts = 0;
    this.initWebSocket();
  }

  initResize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 400;
    this.height = rect.height || 240;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  startAnimation() {
    const render = () => {
      this.draw();
      // Smooth interpolation towards target progress or simulation
      if (this.targetProgress && Math.abs(this.targetProgress - this.progress) > 0.001) {
        this.progress += (this.targetProgress - this.progress) * 0.05;
      } else {
        this.progress += 0.0012;
        if (this.progress > 0.88) this.progress = 0.20;
      }
      this.animId = requestAnimationFrame(render);
    };
    render();
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.clearFallbackPoll();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  draw() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    // Apple Maps Soft Tone Background
    ctx.fillStyle = "#e5edf8";
    ctx.fillRect(0, 0, width, height);

    // Draw stylized city blocks
    ctx.fillStyle = "#d4e2f5";
    ctx.beginPath();
    ctx.roundRect(20, 20, width * 0.35, height * 0.35, 12);
    ctx.roundRect(width * 0.45, 20, width * 0.45, height * 0.3, 12);
    ctx.roundRect(30, height * 0.55, width * 0.4, height * 0.35, 12);
    ctx.roundRect(width * 0.5, height * 0.5, width * 0.42, height * 0.4, 12);
    ctx.fill();

    // Road Network (White clean arteries)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Primary route path
    const path = [
      { x: 50, y: height * 0.75 },
      { x: width * 0.28, y: height * 0.75 },
      { x: width * 0.38, y: height * 0.42 },
      { x: width * 0.65, y: height * 0.42 },
      { x: width * 0.82, y: height * 0.25 }
    ];

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    // Active Blue Route Glow
    ctx.strokeStyle = "#007aff";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    // Customer Location Marker (Destination Pin)
    const dest = path[path.length - 1];
    ctx.fillStyle = "#ff3b30";
    ctx.beginPath();
    ctx.arc(dest.x, dest.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Calculate moving technician position along path
    const techPos = this.getPositionAlongPath(path, this.progress);

    // Technician Pulse Ring
    ctx.fillStyle = this.isStale ? "rgba(255, 149, 0, 0.25)" : "rgba(0, 122, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(techPos.x, techPos.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Technician Moving Dot
    ctx.fillStyle = this.isStale ? "#ff9500" : "#007aff";
    ctx.beginPath();
    ctx.arc(techPos.x, techPos.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  getPositionAlongPath(path, t) {
    const numSegments = path.length - 1;
    const scaledT = Math.max(0, Math.min(1, t)) * numSegments;
    const index = Math.min(Math.floor(scaledT), numSegments - 1);
    const subT = scaledT - index;

    const p0 = path[index];
    const p1 = path[index + 1];

    return {
      x: p0.x + (p1.x - p0.x) * subT,
      y: p0.y + (p1.y - p0.y) * subT
    };
  }
}

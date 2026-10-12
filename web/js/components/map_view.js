/* ==========================================================================
   VoltFit Interactive Live Map & Technician Route Simulator
   ========================================================================== */

export class LiveMapCanvas {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.eta = options.eta || 14;
    this.distanceKm = options.distanceKm || 3.8;
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    this.container.innerHTML = "";
    this.container.appendChild(this.canvas);

    // Add ETA Floating Pill
    const etaBadge = document.createElement("div");
    etaBadge.className = "map-eta-overlay";
    etaBadge.innerHTML = `
      <span style="font-size: 16px;">🛵</span>
      <span>Technician En Route • ETA <strong id="map-eta-val">${this.eta} mins</strong> (${this.distanceKm} km)</span>
    `;
    this.container.appendChild(etaBadge);

    this.ctx = this.canvas.getContext("2d");
    this.progress = 0.35;
    this.animId = null;

    this.initResize();
    this.startAnimation();
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
      this.progress += 0.0015;
      if (this.progress > 0.88) this.progress = 0.15;
      this.animId = requestAnimationFrame(render);
    };
    render();
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
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
    ctx.fillStyle = "rgba(0, 122, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(techPos.x, techPos.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Technician Moving Dot
    ctx.fillStyle = "#007aff";
    ctx.beginPath();
    ctx.arc(techPos.x, techPos.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  getPositionAlongPath(path, t) {
    // simplified linear interpolator across segments
    const numSegments = path.length - 1;
    const scaledT = t * numSegments;
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

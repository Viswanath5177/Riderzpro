/* ==========================================================================
   VoltFit Digital Signature Pad Canvas
   ========================================================================== */

export class DigitalSignaturePad {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.isDrawing = false;
    this.hasSignature = false;

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 340;
    this.canvas.height = rect.height || 130;
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#1d1d1f";
    this.clear();
  }

  bindEvents() {
    const start = (e) => {
      this.isDrawing = true;
      this.hasSignature = true;
      const pos = this.getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      const pos = this.getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    };

    const stop = () => {
      this.isDrawing = false;
    };

    this.canvas.addEventListener("mousedown", start);
    this.canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stop);

    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      start(e.touches[0]);
    }, { passive: false });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      draw(e.touches[0]);
    }, { passive: false });
    this.canvas.addEventListener("touchend", stop);
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  clear() {
    this.ctx.fillStyle = "#fafafa";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw baseline
    this.ctx.strokeStyle = "rgba(60, 60, 67, 0.15)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(20, this.canvas.height - 25);
    this.ctx.lineTo(this.canvas.width - 20, this.canvas.height - 25);
    this.ctx.stroke();

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = "#1d1d1f";
    this.hasSignature = false;
  }

  toDataURL() {
    return this.canvas.toDataURL("image/png");
  }
}

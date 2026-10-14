import fs from 'node:fs';
import zlib from 'node:zlib';

// Create a 1600x900 RGBA image
const width = 1600;
const height = 900;
const buffer = Buffer.alloc(width * height * 4); // RGBA

function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = (y * width + x) * 4;
  const srcA = a / 255;
  const destA = buffer[idx + 3] / 255;
  const outA = srcA + destA * (1 - srcA);
  if (outA <= 0) return;
  
  buffer[idx] = Math.round((r * srcA + buffer[idx] * destA * (1 - srcA)) / outA);
  buffer[idx + 1] = Math.round((g * srcA + buffer[idx + 1] * destA * (1 - srcA)) / outA);
  buffer[idx + 2] = Math.round((b * srcA + buffer[idx + 2] * destA * (1 - srcA)) / outA);
  buffer[idx + 3] = Math.round(outA * 255);
}

function fillCircle(cx, cy, radius, r, g, b, a) {
  const r2 = radius * radius;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist2 = dx * dx + dy * dy;
      if (dist2 <= r2) {
        const edge = Math.sqrt(dist2);
        const alpha = edge > radius - 1 ? a * (radius - edge) : a;
        setPixel(Math.round(cx + dx), Math.round(cy + dy), r, g, b, Math.max(0, Math.min(255, alpha)));
      }
    }
  }
}

function fillPolygon(points, r, g, b, a) {
  let minY = height, maxY = 0;
  for (const p of points) {
    if (p.y < minY) minY = Math.floor(p.y);
    if (p.y > maxY) maxY = Math.ceil(p.y);
  }
  minY = Math.max(0, minY);
  maxY = Math.min(height - 1, maxY);

  for (let y = minY; y <= maxY; y++) {
    const nodes = [];
    let j = points.length - 1;
    for (let i = 0; i < points.length; i++) {
      if ((points[i].y < y && points[j].y >= y) || (points[j].y < y && points[i].y >= y)) {
        nodes.push(points[i].x + ((y - points[i].y) / (points[j].y - points[i].y)) * (points[j].x - points[i].x));
      }
      j = i;
    }
    nodes.sort((a, b) => a - b);
    for (let i = 0; i < nodes.length; i += 2) {
      if (nodes[i] >= width) break;
      if (nodes[i + 1] > 0) {
        const startX = Math.max(0, Math.round(nodes[i]));
        const endX = Math.min(width - 1, Math.round(nodes[i + 1]));
        for (let x = startX; x <= endX; x++) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }
}

// Draw Ground Contact Shadow (centered at x=800, y=770)
for (let y = 730; y <= 800; y++) {
  for (let x = 300; x <= 1300; x++) {
    const dx = (x - 800) / 460;
    const dy = (y - 765) / 22;
    const dist2 = dx * dx + dy * dy;
    if (dist2 <= 1) {
      const alpha = Math.round(90 * (1 - dist2));
      setPixel(x, y, 24, 24, 27, alpha);
    }
  }
}

// Rear Wheel (Center ~480, 640, Outer Radius ~110, Inner ~80)
fillCircle(480, 640, 110, 18, 18, 20, 255);
fillCircle(480, 640, 80, 212, 212, 216, 255);
fillCircle(480, 640, 60, 50, 50, 55, 255);

// Front Wheel (Center ~1130, 640, Outer Radius ~110, Inner ~80)
fillCircle(1130, 640, 110, 18, 18, 20, 255);
fillCircle(1130, 640, 80, 212, 212, 216, 255);
fillCircle(1130, 640, 60, 50, 50, 55, 255);

// Underbone Frame & Swingarm
fillPolygon([
  { x: 480, y: 630 },
  { x: 740, y: 650 },
  { x: 760, y: 680 },
  { x: 470, y: 655 }
], 39, 39, 42, 255);

// Flat Floorboard & Battery Zone
fillPolygon([
  { x: 680, y: 660 },
  { x: 920, y: 660 },
  { x: 930, y: 635 },
  { x: 670, y: 635 }
], 30, 41, 59, 255);

// Cyan Battery Glow Accent
fillPolygon([
  { x: 730, y: 642 },
  { x: 860, y: 642 },
  { x: 860, y: 648 },
  { x: 730, y: 648 }
], 0, 229, 255, 230);

// Front Telescopic Fork
fillPolygon([
  { x: 1120, y: 640 },
  { x: 1140, y: 640 },
  { x: 1040, y: 390 },
  { x: 1020, y: 390 }
], 115, 115, 120, 255);

// Pearl White Main Body Panels
fillPolygon([
  { x: 540, y: 550 },
  { x: 860, y: 560 },
  { x: 820, y: 470 },
  { x: 570, y: 460 }
], 241, 243, 245, 255);

// Aerodynamic Crease Accent (Graphite)
fillPolygon([
  { x: 560, y: 515 },
  { x: 840, y: 525 },
  { x: 835, y: 535 },
  { x: 565, y: 525 }
], 32, 36, 40, 255);

// Front Sharp Floating Fairing (Ather-inspired pointed cowl)
fillPolygon([
  { x: 900, y: 610 },
  { x: 1070, y: 500 },
  { x: 1030, y: 370 },
  { x: 930, y: 470 }
], 241, 243, 245, 255);

// Pointed LED Headlamp / DRL
fillPolygon([
  { x: 1055, y: 465 },
  { x: 1085, y: 495 },
  { x: 1065, y: 505 },
  { x: 1045, y: 475 }
], 255, 255, 255, 255);

// Rear Cowl & LED Tail
fillPolygon([
  { x: 430, y: 490 },
  { x: 590, y: 480 },
  { x: 570, y: 540 },
  { x: 440, y: 515 }
], 241, 243, 245, 255);

// Red Brand Taillight
fillPolygon([
  { x: 425, y: 495 },
  { x: 440, y: 492 },
  { x: 440, y: 510 },
  { x: 425, y: 512 }
], 225, 29, 42, 255);

// Slim Ergonomic Commuter Saddle (Seat with raised tail)
fillPolygon([
  { x: 450, y: 480 },
  { x: 830, y: 465 },
  { x: 810, y: 435 },
  { x: 470, y: 445 }
], 28, 28, 32, 255);

// Handlebars & TFT Console
fillPolygon([
  { x: 1010, y: 380 },
  { x: 1045, y: 380 },
  { x: 1035, y: 320 },
  { x: 1015, y: 320 }
], 200, 200, 205, 255);
// Digital Display Dashboard
fillPolygon([
  { x: 990, y: 330 },
  { x: 1040, y: 310 },
  { x: 1045, y: 335 },
  { x: 995, y: 350 }
], 15, 23, 42, 255);

// Write PNG buffer
function createPng(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let srcOffset = 0;
  let dstOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0; // Filter None
    rgbaBuffer.copy(scanlines, dstOffset, srcOffset, srcOffset + width * 4);
    srcOffset += width * 4;
    dstOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

const pngBuffer = createPng(width, height, buffer);
fs.writeFileSync('public/images/scooter-fallback.png', pngBuffer);
console.log('Successfully wrote 1600x900 fallback PNG:', pngBuffer.length, 'bytes');

import * as THREE from "three";

// Procedural canvas textures, so the studio needs no image downloads.

export const makeCanvas = (w, h) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return [canvas, canvas.getContext("2d")];
};

export const toTexture = (canvas, repeat = [1, 1]) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 8;
  return texture;
};

// Seeded random, so the grain looks the same on every load
export const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const drawGrain = (g, r, x, y, w, h, lines) => {
  for (let i = 0; i < lines; i++) {
    const gy = y + r() * h;
    const light = r() > 0.55;
    g.strokeStyle = light
      ? `rgba(255,226,180,${0.05 + r() * 0.08})`
      : `rgba(60,30,10,${0.06 + r() * 0.14})`;
    g.lineWidth = 0.6 + r() * 2.2;
    g.beginPath();
    g.moveTo(x, gy);
    const phase = r() * 10;
    for (let gx = x; gx <= x + w; gx += 48) {
      g.lineTo(gx, gy + Math.sin(gx / 170 + phase) * 2.5);
    }
    g.stroke();
  }
};

export function oakTexture() {
  const [canvas, g] = makeCanvas(1024, 512);
  const r = seeded(7);
  g.fillStyle = "#a9733f";
  g.fillRect(0, 0, 1024, 512);
  drawGrain(g, r, 0, 0, 1024, 512, 220);
  return toTexture(canvas);
}

export function floorTexture() {
  const [canvas, g] = makeCanvas(1024, 1024);
  const r = seeded(21);
  const rowH = 128;
  for (let row = 0; row < 8; row++) {
    let x = -r() * 600;
    while (x < 1024) {
      const len = 380 + r() * 500;
      const tone = 0.85 + r() * 0.25;
      g.fillStyle = `rgb(${Math.round(150 * tone)},${Math.round(104 * tone)},${Math.round(66 * tone)})`;
      g.fillRect(x, row * rowH, len, rowH);
      drawGrain(g, r, x, row * rowH, len, rowH, 26);
      // plank seams
      g.fillStyle = "rgba(40,22,10,0.55)";
      g.fillRect(x, row * rowH, 2, rowH);
      x += len;
    }
    g.fillStyle = "rgba(40,22,10,0.6)";
    g.fillRect(0, row * rowH, 1024, 2);
  }
  return toTexture(canvas, [3, 2]);
}

// What you see through the window: late-afternoon sky over soft trees
export function skyTexture() {
  const [canvas, g] = makeCanvas(1024, 768);
  const r = seeded(5);
  const sky = g.createLinearGradient(0, 0, 0, 768);
  sky.addColorStop(0, "#8fb4dc");
  sky.addColorStop(0.45, "#e9d6b8");
  sky.addColorStop(0.7, "#f6c98f");
  sky.addColorStop(1, "#b98b5c");
  g.fillStyle = sky;
  g.fillRect(0, 0, 1024, 768);
  g.filter = "blur(14px)";
  for (let i = 0; i < 26; i++) {
    const x = r() * 1024;
    const y = 430 + r() * 300;
    g.fillStyle = `rgba(${40 + r() * 40},${70 + r() * 40},${40 + r() * 20},${0.55 + r() * 0.3})`;
    g.beginPath();
    g.ellipse(x, y, 60 + r() * 110, 50 + r() * 90, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.filter = "none";
  return toTexture(canvas);
}

// Framed print on the back wall
export function printTexture() {
  const [canvas, g] = makeCanvas(512, 640);
  g.fillStyle = "#f1ebe1";
  g.fillRect(0, 0, 512, 640);
  const sun = g.createLinearGradient(0, 120, 0, 420);
  sun.addColorStop(0, "#f2a65a");
  sun.addColorStop(1, "#d9534f");
  g.fillStyle = sun;
  g.beginPath();
  g.arc(256, 270, 150, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f1ebe1";
  for (let i = 0; i < 6; i++) g.fillRect(90, 300 + i * 22, 332, 6 + i * 1.5);
  g.fillStyle = "#24303a";
  g.fillRect(70, 430, 372, 4);
  g.font = '600 40px "Segoe UI", system-ui, sans-serif';
  g.textAlign = "center";
  g.fillText("BUILD · VERIFY · SHIP", 256, 500);
  g.font = '400 22px "Segoe UI", system-ui, sans-serif';
  g.fillStyle = "#5b6670";
  g.fillText("ALEX — STUDIO 2026", 256, 545);
  return toTexture(canvas);
}

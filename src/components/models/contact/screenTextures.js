import { makeCanvas, toTexture } from "../hero_models/studio/surfaceTextures";

// 21:9 panels, drawn once (static, so they cost nothing per frame)
const W = 2048;
const H = 868;
const MONO = '"JetBrains Mono", Consolas, "Courier New", monospace';
const SANS = '"Mona Sans", "Segoe UI", Arial, sans-serif';

const C = {
  key: "#c678dd",
  fn: "#61afef",
  str: "#98c379",
  tag: "#e06c75",
  attr: "#d19a66",
  text: "#c9d1d9",
  dim: "#5c6370",
};

// Each line is a list of [text, color] runs
const CODE = [
  [["// contact.jsx", C.dim]],
  [["import ", C.key], ["{ useState } ", C.text], ["from ", C.key], ['"react"', C.str], [";", C.text]],
  [],
  [["export default function ", C.key], ["Contact", C.fn], ["() {", C.text]],
  [["  const ", C.key], ["[message, setMessage] = ", C.text], ["useState", C.fn], ['("")', C.str], [";", C.text]],
  [["  const ", C.key], ["send", C.fn], [" = () => ", C.text], ["emailjs", C.text], [".", C.text], ["send", C.fn], ["({ message });", C.text]],
  [],
  [["  return ", C.key], ["(", C.text]],
  [["    <", C.text], ["form ", C.tag], ["onSubmit", C.attr], ["={send}>", C.text]],
  [["      <", C.text], ["textarea ", C.tag], ["placeholder", C.attr], ["=", C.text], ['"Tell me about your project"', C.str], [" />", C.text]],
  [["      <", C.text], ["button", C.tag], [">Let's talk →</", C.text], ["button", C.tag], [">", C.text]],
  [["    </", C.text], ["form", C.tag], [">", C.text]],
  [["  );", C.text]],
  [["}", C.text]],
];

const roundRect = (g, x, y, w, h, r) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
};

// Dark editor: file tree on the left, one tab, syntax-colored code
export const codeScreen = () => {
  const [canvas, g] = makeCanvas(W, H);
  g.fillStyle = "#0d1117";
  g.fillRect(0, 0, W, H);

  g.fillStyle = "#010409";
  g.fillRect(0, 0, 340, H);
  g.font = `500 26px ${SANS}`;
  ["src", "  components", "  sections", "    Contact.jsx", "    Hero.jsx", "  App.jsx", "package.json"].forEach((name, i) => {
    if (i === 3) {
      g.fillStyle = "#1f2937";
      g.fillRect(0, 96 + i * 48 - 34, 340, 48);
    }
    g.fillStyle = i === 3 ? "#e6edf3" : "#7d8590";
    g.fillText(name, 32, 96 + i * 48);
  });

  g.fillStyle = "#161b22";
  g.fillRect(340, 0, W - 340, 64);
  g.fillStyle = "#0d1117";
  g.fillRect(340, 0, 300, 64);
  g.fillStyle = "#3b82f6";
  g.fillRect(340, 0, 300, 4);
  g.fillStyle = "#e6edf3";
  g.fillText("Contact.jsx", 380, 42);

  g.font = `400 34px ${MONO}`;
  CODE.forEach((runs, i) => {
    const y = 140 + i * 50;
    g.fillStyle = C.dim;
    g.textAlign = "right";
    g.fillText(String(i + 1), 440, y);
    g.textAlign = "left";
    let x = 480;
    for (const [text, color] of runs) {
      g.fillStyle = color;
      g.fillText(text, x, y);
      x += g.measureText(text).width;
    }
  });
  // Caret at the end of the button line
  g.fillStyle = "#e6edf3";
  g.fillRect(480 + g.measureText("      <button>Let's talk →</button>").width + 4, 140 + 10 * 50 - 30, 3, 38);

  g.fillStyle = "#3b82f6";
  g.fillRect(0, H - 40, W, 40);
  g.fillStyle = "#ffffff";
  g.font = `500 22px ${SANS}`;
  g.fillText("main   ✓ 0 problems", 24, H - 13);
  return toTexture(canvas);
};

// Wallpaper with a headline and an "available" pill
export const welcomeScreen = () => {
  const [canvas, g] = makeCanvas(W, H);
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b1530");
  bg.addColorStop(0.55, "#1d4ed8");
  bg.addColorStop(1, "#7c3aed");
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  const glow = g.createRadialGradient(W * 0.72, H * 0.3, 0, W * 0.72, H * 0.3, 700);
  glow.addColorStop(0, "rgba(125, 211, 252, 0.45)");
  glow.addColorStop(1, "rgba(125, 211, 252, 0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  g.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(g, 180, 230, 430, 64, 32);
  g.fill();
  g.fillStyle = "#4ade80";
  g.beginPath();
  g.arc(222, 262, 11, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#ffffff";
  g.font = `500 30px ${SANS}`;
  g.fillText("Available for new projects", 248, 273);

  g.font = `700 120px ${SANS}`;
  g.fillText("Let's build", 176, 440);
  g.fillText("something great.", 176, 570);

  // Dock
  g.fillStyle = "rgba(255, 255, 255, 0.16)";
  roundRect(g, W / 2 - 300, H - 120, 600, 90, 28);
  g.fill();
  ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#ec4899", "#94a3b8"].forEach((color, i) => {
    g.fillStyle = color;
    roundRect(g, W / 2 - 260 + i * 88, H - 105, 60, 60, 16);
    g.fill();
  });
  return toTexture(canvas);
};

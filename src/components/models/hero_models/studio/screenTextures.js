import { makeCanvas, toTexture } from "./surfaceTextures";

// Both monitors show 1920x1080 canvases drawn in code.
const W = 1920;
const H = 1080;
const SANS = '"Segoe UI", system-ui, -apple-system, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const MONO = 'Consolas, Menlo, "Courier New", monospace';

const box = (g, x, y, w, h, r, fill) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fillStyle = fill;
  g.fill();
};

const text = (g, str, x, y, font, color, align = "left") => {
  g.font = font;
  g.fillStyle = color;
  g.textAlign = align;
  g.fillText(str, x, y);
  g.textAlign = "left";
};

// Word-wraps str into maxWidth, returns the y after the last line
const paragraph = (g, str, x, y, maxWidth, lineHeight, font, color) => {
  g.font = font;
  g.fillStyle = color;
  let line = "";
  for (const word of str.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > maxWidth && line) {
      g.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  g.fillText(line, x, y);
  return y + lineHeight;
};

// Minimal JSX highlighter with VS Code Dark+ colors
const RULES = [
  [/^\/\/.*/, "#6a9955"],
  [/^"[^"]*"/, "#ce9178"],
  [/^(import|from|export|default|return)\b/, "#c586c0"],
  [/^(const|let)\b/, "#569cd6"],
  [/^<\/?[A-Z]\w*/, "#4ec9b0"],
  [/^<\/?[a-z]\w*/, "#569cd6"],
  [/^\w+(?==)/, "#9cdcfe"],
  [/^-?\d+(\.\d+)?/, "#b5cea8"],
  [/^[A-Z]\w*/, "#4ec9b0"],
  [/^\w+/, "#9cdcfe"],
  [/^\s+/, null],
  [/^./, "#d4d4d4"],
];

const codeLine = (g, line, x, y) => {
  g.font = `400 27px ${MONO}`;
  let rest = line;
  while (rest.length) {
    for (const [re, color] of RULES) {
      const m = rest.match(re);
      if (!m) continue;
      if (color) {
        g.fillStyle = color;
        g.fillText(m[0], x, y);
      }
      x += g.measureText(m[0]).width;
      rest = rest.slice(m[0].length);
      break;
    }
  }
};

// The Claude logo: a small orange starburst
const starburst = (g, cx, cy, r) => {
  g.strokeStyle = "#d97757";
  g.lineCap = "round";
  g.lineWidth = r * 0.22;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = i % 2 ? r * 0.7 : r;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r * 0.18, cy + Math.sin(a) * r * 0.18);
    g.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
    g.stroke();
  }
};

export function claudeScreenTexture() {
  const [canvas, g] = makeCanvas(W, H);
  g.fillStyle = "#262624";
  g.fillRect(0, 0, W, H);

  // Sidebar
  g.fillStyle = "#1f1e1d";
  g.fillRect(0, 0, 420, H);
  text(g, "Claude", 48, 88, `400 46px ${SERIF}`, "#ecebe8");
  box(g, 36, 128, 348, 66, 14, "#2e2d2b");
  text(g, "+   New chat", 64, 172, `600 30px ${SANS}`, "#e0896a");
  text(g, "Recents", 48, 252, `600 24px ${SANS}`, "#8f8d88");
  const recents = [
    "Studio hero in three.js",
    "FanClash live chat fix",
    "Contact form with EmailJS",
    "Go API rate limiter",
    "Interview prep notes",
    "README diagram",
  ];
  recents.forEach((title, i) => {
    const y = 278 + i * 64;
    if (i === 0) box(g, 30, y, 360, 54, 10, "#363532");
    text(g, title, 52, y + 37, `400 27px ${SANS}`, i === 0 ? "#f4f2ee" : "#bfbdb8");
  });

  // Profile
  g.fillStyle = "#34332f";
  g.fillRect(24, H - 128, 372, 2);
  g.fillStyle = "#d97757";
  g.beginPath();
  g.arc(82, H - 64, 32, 0, Math.PI * 2);
  g.fill();
  text(g, "A", 82, H - 52, `700 32px ${SANS}`, "#1f1e1d", "center");
  text(g, "Alex", 132, H - 70, `600 32px ${SANS}`, "#f4f2ee");
  text(g, "Pro plan", 132, H - 36, `400 23px ${SANS}`, "#8f8d88");

  // Conversation
  const x0 = 640;
  const col = 1040;
  text(g, "Studio hero in three.js", 1170, 64, `500 27px ${SANS}`, "#bfbdb8", "center");

  g.font = `400 30px ${SANS}`;
  box(g, x0 + 260, 112, col - 260, 148, 22, "#393937");
  paragraph(
    g,
    "Build my developer studio in three.js. Real sizes, sun through the blinds. Self-verify until every object is 9/10.",
    x0 + 292, 166, col - 324, 42, `400 30px ${SANS}`, "#f4f2ee"
  );

  starburst(g, x0 + 20, 320, 22);
  let y = paragraph(
    g,
    "On it. Desk, two HP monitors and blinds that cast real shadows. Each round I render, score every object and fix the lowest one.",
    x0 + 64, 332, col - 64, 42, `400 30px ${SANS}`, "#e8e6e3"
  );

  // Code block
  y += 8;
  box(g, x0, y, col, 284, 16, "#1a1a18");
  text(g, "jsx", x0 + 28, y + 40, `500 22px ${SANS}`, "#8f8d88");
  [
    "<directionalLight castShadow",
    '  position={[4.8, 2.0, 1.8]} color="#ffb877" />',
    "<Blinds slats={48} tilt={-0.35} />",
    '<Monitors left="claude" right="vscode" />',
  ].forEach((line, i) => codeLine(g, line, x0 + 28, y + 96 + i * 44));
  y += 284 + 52;

  text(g, "Round 3   desk 9/10 · monitors 9/10 · blinds 8/10 → fixing blinds", x0, y,
    `500 26px ${SANS}`, "#a8a6a1");

  // Composer
  box(g, x0 - 20, H - 176, col + 40, 128, 28, "#30302e");
  text(g, "Reply to Claude…", x0 + 14, H - 116, `400 30px ${SANS}`, "#8f8d88");
  box(g, x0 + col - 58, H - 108, 54, 48, 12, "#d97757");
  text(g, "↑", x0 + col - 31, H - 72, `700 30px ${SANS}`, "#ffffff", "center");

  return toTexture(canvas);
}

const STUDIO_CODE = [
  'import Desk from "./Desk";',
  'import Monitors from "./Monitors";',
  'import Blinds from "./Blinds";',
  "",
  "// Real-world meters. Floor at y = 0.",
  "const Studio = () => (",
  "  <group>",
  "    <Floor size={[3, 2]} />",
  '    <Wall face="back" />',
  '    <Wall face="right" window />',
  "    <Blinds slats={48} tilt={-0.35} />",
  "    <Desk height={0.75} />",
  '    <Monitors left="claude" right="vscode" />',
  "    <Chair />",
  "    <Shelf />",
  "  </group>",
  ");",
  "",
  "export default Studio;",
];

export function codeScreenTexture() {
  const [canvas, g] = makeCanvas(W, H);
  g.fillStyle = "#1e1e1e";
  g.fillRect(0, 0, W, H);

  // Activity bar
  g.fillStyle = "#333333";
  g.fillRect(0, 0, 72, H);
  [40, 120, 200, 280].forEach((y, i) => {
    g.strokeStyle = i === 0 ? "#ffffff" : "#858585";
    g.lineWidth = 3;
    g.strokeRect(22, y - 14, 28, 30);
  });

  // Explorer
  g.fillStyle = "#252526";
  g.fillRect(72, 0, 380, H);
  text(g, "EXPLORER", 100, 44, `600 21px ${SANS}`, "#bbbbbb");
  const tree = [
    [0, "⌄ 3D_DEVELOPER_PORTFOLIO", "#cccccc"],
    [1, "⌄ src", "#cccccc"],
    [2, "⌄ components", "#cccccc"],
    [3, "⌄ hero_models", "#cccccc"],
    [4, "⌄ studio", "#cccccc"],
    [5, "Blinds.jsx", "#e5c07b"],
    [5, "Chair.jsx", "#e5c07b"],
    [5, "Desk.jsx", "#e5c07b"],
    [5, "FloorPlant.jsx", "#e5c07b"],
    [5, "Headphones.jsx", "#e5c07b"],
    [5, "LedStrip.jsx", "#e5c07b"],
    [5, "Microphone.jsx", "#e5c07b"],
    [5, "Monitors.jsx", "#e5c07b"],
    [5, "PcTower.jsx", "#e5c07b"],
    [5, "Peripherals.jsx", "#e5c07b"],
    [5, "Shelf.jsx", "#e5c07b"],
    [5, "Studio.jsx", "#e5c07b"],
    [5, "StudioLights.jsx", "#e5c07b"],
    [4, "HeroExperience.jsx", "#e5c07b"],
    [2, "› sections", "#cccccc"],
    [3, "Hero.jsx", "#e5c07b"],
    [3, "Contact.jsx", "#e5c07b"],
    [1, "package.json", "#cbcb41"],
  ];
  tree.forEach(([depth, name, color], i) => {
    const y = 92 + i * 40;
    if (name === "Studio.jsx") {
      g.fillStyle = "#37373d";
      g.fillRect(72, y - 28, 380, 40);
    }
    text(g, name, 96 + depth * 22, y, `400 23px ${SANS}`, color);
  });

  // Tabs + breadcrumb
  g.fillStyle = "#252526";
  g.fillRect(452, 0, W - 452, 60);
  g.fillStyle = "#1e1e1e";
  g.fillRect(452, 0, 230, 60);
  g.fillStyle = "#0078d4";
  g.fillRect(452, 0, 230, 3);
  text(g, "Studio.jsx", 500, 40, `400 24px ${SANS}`, "#ffffff");
  text(g, "Monitors.jsx", 712, 40, `400 24px ${SANS}`, "#969696");
  text(g, "Hero.jsx", 900, 40, `400 24px ${SANS}`, "#969696");
  text(g, "src › components › hero_models › studio › Studio.jsx", 486, 92, `400 21px ${SANS}`, "#a9a9a9");

  // Code
  STUDIO_CODE.forEach((line, i) => {
    const y = 142 + i * 36;
    text(g, String(i + 1), 540, y, `400 24px ${MONO}`, i === 12 ? "#c6c6c6" : "#6e7681", "right");
    if (i === 12) {
      g.fillStyle = "rgba(255,255,255,0.04)";
      g.fillRect(452, y - 27, W - 452, 36);
    }
    codeLine(g, line, 576, y);
  });

  // Terminal
  g.fillStyle = "#3c3c3c";
  g.fillRect(452, 838, W - 452, 1);
  text(g, "PROBLEMS     OUTPUT     TERMINAL", 486, 876, `500 20px ${SANS}`, "#969696");
  g.fillStyle = "#e7e7e7";
  g.fillRect(712, 884, 106, 2);
  [
    ["$ npm run dev", "#cccccc"],
    ["  VITE v6.3.4  ready in 412 ms", "#23d18b"],
    ["  ➜  Local:   http://localhost:5173/", "#cccccc"],
  ].forEach(([line, color], i) => text(g, line, 486, 924 + i * 36, `400 24px ${MONO}`, color));

  // Status bar
  g.fillStyle = "#007acc";
  g.fillRect(0, H - 40, W, 40);
  text(g, "⎇ main    ✓ 0 problems", 24, H - 12, `400 21px ${SANS}`, "#ffffff");
  text(g, "Ln 13, Col 42    Spaces: 2    UTF-8    JavaScript JSX", W - 24, H - 12, `400 21px ${SANS}`, "#ffffff", "right");

  return toTexture(canvas);
}

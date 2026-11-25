import { makeCanvas, toTexture } from "./surfaceTextures";

// Both monitors show canvases drawn in code, laid out in 1920x1080 units.
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

// "Alex Studio" theme for both screens' code, built from the site's palette: its charcoals,
// its #d9ecff text, and the blue -> purple -> pink gradient behind "real products."
const THEME = {
  bg: "#1c1c21",
  sidebar: "#16161a",
  activityBar: "#0e0e10",
  border: "#282732",
  text: "#d9ecff",
  muted: "#839cb5",
  dim: "#4b4b5c",
  lineHighlight: "rgba(123,97,255,0.10)",
  selection: "rgba(123,97,255,0.22)",
  pink: "#FF69B4",
  purple: "#9d8bff",
  blue: "#00BFFF",
  lavender: "#c3a6ff",
  amber: "#f2b56b",
  cyan: "#7fdbff",
  comment: "#6b6b80",
  green: "#6ee7b7",
};

// Minimal JSX highlighter
const RULES = [
  [/^\/\/.*/, THEME.comment],
  [/^"[^"]*"/, THEME.amber],
  [/^(import|from|export|default|return)\b/, THEME.pink],
  [/^(const|let)\b/, THEME.purple],
  [/^<\/?[A-Z]\w*/, THEME.blue],
  [/^<\/?[a-z]\w*/, "#6aa8f0"],
  [/^\w+(?==)/, THEME.lavender],
  [/^-?\d+(\.\d+)?/, THEME.cyan],
  [/^[A-Z]\w*/, THEME.blue],
  [/^\w+/, THEME.text],
  [/^\s+/, null],
  [/^./, "#b9c6d8"],
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

// ---------------------------------------------------------------------------
// Animated screens. Each screen is a timeline: frame(t) says what is on screen at
// time t, and render(g, state) draws it. The canvas is redrawn only when the state
// changes, at most `fps` times a second, at 1280x720 (drawn in 1920x1080 units).

const SCALE = 2 / 3;
const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.floor(v)));

const createScreen = ({ frame, render }, fps) => {
  const [canvas, g] = makeCanvas(W * SCALE, H * SCALE);
  const texture = toTexture(canvas);
  let lastKey = "";
  let lastDraw = -Infinity;
  const update = (t) => {
    if (t - lastDraw < 1 / fps) return;
    const state = frame(t);
    const key = JSON.stringify(state);
    if (key === lastKey) return;
    lastKey = key;
    lastDraw = t;
    g.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    render(g, state);
    texture.needsUpdate = true;
  };
  return { texture, update };
};

// Word-wrap into lines (for text that needs a caret at its end)
const wrap = (g, str, maxWidth, font) => {
  g.font = font;
  const lines = [""];
  for (const word of str.split(" ")) {
    const last = lines[lines.length - 1];
    const next = last ? `${last} ${word}` : word;
    if (g.measureText(next).width > maxWidth && last) lines.push(word);
    else lines[lines.length - 1] = next;
  }
  return lines;
};

const caretAt = (g, x, y, h) => {
  g.fillStyle = "#e8e6e3";
  g.fillRect(x + 3, y - h + 6, 3, h);
};

// ---- Left screen: Claude ----------------------------------------------------

const PROMPT = "Build my developer studio in three.js. Real sizes, sun through the blinds. Self-verify until every object is 9/10.";
const REPLY = "On it. Desk, two curved HP monitors and blinds that cast real shadows. Each round I render, score every object and fix the lowest one.";
const CLAUDE_CODE = [
  "<directionalLight castShadow",
  '  position={[4.8, 2.0, 1.8]} color="#ffb877" />',
  "<Blinds slats={48} tilt={-0.35} />",
  '<Monitors left="claude" right="vscode" />',
];
const CLAUDE_CODE_CHARS = CLAUDE_CODE.join("").length;
const CLAUDE_LOOP = 28; // seconds
const RECENTS = ["Studio hero in three.js", "FanClash live chat fix", "Contact form with EmailJS", "Go API rate limiter", "Interview prep notes", "README diagram"];

const claudeSidebar = (g) => {
  g.fillStyle = "#1f1e1d";
  g.fillRect(0, 0, 420, H);
  text(g, "Claude", 48, 88, `400 46px ${SERIF}`, "#ecebe8");
  box(g, 36, 128, 348, 66, 14, "#2e2d2b");
  text(g, "+   New chat", 64, 172, `600 30px ${SANS}`, "#e0896a");
  text(g, "Recents", 48, 252, `600 24px ${SANS}`, "#8f8d88");
  RECENTS.forEach((title, i) => {
    const y = 278 + i * 64;
    if (i === 0) box(g, 30, y, 360, 54, 10, "#363532");
    text(g, title, 52, y + 37, `400 27px ${SANS}`, i === 0 ? "#f4f2ee" : "#bfbdb8");
  });
  g.fillStyle = "#34332f";
  g.fillRect(24, H - 128, 372, 2);
  g.fillStyle = "#d97757";
  g.beginPath();
  g.arc(82, H - 64, 32, 0, Math.PI * 2);
  g.fill();
  text(g, "A", 82, H - 52, `700 32px ${SANS}`, "#1f1e1d", "center");
  text(g, "Alex", 132, H - 70, `600 32px ${SANS}`, "#f4f2ee");
  text(g, "Pro plan", 132, H - 36, `400 23px ${SANS}`, "#8f8d88");
};

const claudeTimeline = {
  frame: (t) => {
    const s = t % CLAUDE_LOOP;
    const caret = Math.floor(t * 2) % 2 === 0;
    if (s < 6) return { view: "home", typed: clampInt((s - 1.5) * 28, 0, PROMPT.length), caret };
    const reply = clampInt((s - 6.5) * 55, 0, REPLY.length);
    const code = clampInt((s - 9.5) * 45, 0, CLAUDE_CODE_CHARS);
    const busy = reply < REPLY.length || code < CLAUDE_CODE_CHARS;
    return { view: "chat", reply, code, status: s > 14, caret: busy && caret };
  },
  render: (g, state) => {
    g.fillStyle = "#262624";
    g.fillRect(0, 0, W, H);
    claudeSidebar(g);
    const x0 = 640;
    const col = 1040;

    if (state.view === "home") {
      // Greeting, then the prompt being typed into the composer
      starburst(g, 830, 360, 34);
      text(g, "Welcome back, Alex", 1200, 384, `400 68px ${SERIF}`, "#ecebe8", "center");
      box(g, x0 - 20, 450, col + 40, 210, 28, "#30302e");
      const font = `400 32px ${SANS}`;
      if (state.typed === 0) {
        text(g, "How can I help you today?", x0 + 14, 510, font, "#8f8d88");
        if (state.caret) caretAt(g, x0 + 8, 510, 36);
      } else {
        const lines = wrap(g, PROMPT.slice(0, state.typed), col - 40, font);
        lines.forEach((line, i) => text(g, line, x0 + 14, 510 + i * 44, font, "#f4f2ee"));
        g.font = font;
        if (state.caret) caretAt(g, x0 + 14 + g.measureText(lines[lines.length - 1]).width, 510 + (lines.length - 1) * 44, 36);
      }
      box(g, x0 + col - 58, 598, 54, 48, 12, state.typed ? "#d97757" : "#5a4a42");
      text(g, "↑", x0 + col - 31, 634, `700 30px ${SANS}`, "#ffffff", "center");
      ["</>  Code", "✎  Write", "◎  Learn", "☕  Life stuff"].forEach((chip, i) => {
        box(g, x0 + 120 + i * 205, 700, 185, 56, 14, "#2e2d2b");
        text(g, chip, x0 + 212 + i * 205, 737, `500 25px ${SANS}`, "#bfbdb8", "center");
      });
      return;
    }

    // The conversation: prompt, streamed reply, code block filling in line by line
    text(g, "Studio hero in three.js", 1170, 64, `500 27px ${SANS}`, "#bfbdb8", "center");
    box(g, x0 + 260, 112, col - 260, 148, 22, "#393937");
    paragraph(g, PROMPT, x0 + 292, 166, col - 324, 42, `400 30px ${SANS}`, "#f4f2ee");

    starburst(g, x0 + 20, 320, 22);
    const font = `400 30px ${SANS}`;
    const lines = wrap(g, REPLY.slice(0, state.reply), col - 64, font);
    lines.forEach((line, i) => text(g, line, x0 + 64, 332 + i * 42, font, "#e8e6e3"));
    let y = 332 + lines.length * 42;
    if (state.reply < REPLY.length) {
      g.font = font;
      if (state.caret) caretAt(g, x0 + 64 + g.measureText(lines[lines.length - 1]).width, 332 + (lines.length - 1) * 42, 34);
      return;
    }

    y += 8;
    box(g, x0, y, col, 284, 16, "#1a1a18");
    text(g, "jsx", x0 + 28, y + 40, `500 22px ${SANS}`, "#8f8d88");
    let left = state.code;
    CLAUDE_CODE.forEach((line, i) => {
      if (left <= 0) return;
      codeLine(g, line.slice(0, left), x0 + 28, y + 96 + i * 44);
      left -= line.length;
    });
    y += 284 + 52;
    if (state.status) text(g, "Round 3   desk 9/10 · monitors 9/10 · blinds 8/10 → fixing blinds", x0, y, `500 26px ${SANS}`, "#a8a6a1");

    box(g, x0 - 20, H - 176, col + 40, 128, 28, "#30302e");
    text(g, "Reply to Claude…", x0 + 14, H - 116, `400 30px ${SANS}`, "#8f8d88");
    box(g, x0 + col - 58, H - 108, 54, 48, 12, "#d97757");
    text(g, "↑", x0 + col - 31, H - 72, `700 30px ${SANS}`, "#ffffff", "center");
  },
};

// ---- Right screen: VS Code --------------------------------------------------

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
const STUDIO_CHARS = STUDIO_CODE.reduce((n, line) => n + line.length + 1, 0); // +1: the newline
const TYPE_RATE = 34; // characters per second
const TYPED_AT = STUDIO_CHARS / TYPE_RATE;
const COMMAND = "$ npm run dev";
const CODE_LOOP = TYPED_AT + 9;

const TREE = [
  [0, "⌄ 3D_DEVELOPER_PORTFOLIO", "FOLDER"],
  [1, "⌄ src", "FOLDER"],
  [2, "⌄ components", "FOLDER"],
  [3, "⌄ hero_models", "FOLDER"],
  [4, "⌄ studio", "FOLDER"],
  [5, "Blinds.jsx", "FILE"],
  [5, "Chair.jsx", "FILE"],
  [5, "Desk.jsx", "FILE"],
  [5, "FloorPlant.jsx", "FILE"],
  [5, "Headphones.jsx", "FILE"],
  [5, "LedStrip.jsx", "FILE"],
  [5, "Microphone.jsx", "FILE"],
  [5, "Monitors.jsx", "FILE"],
  [5, "PcTower.jsx", "FILE"],
  [5, "Peripherals.jsx", "FILE"],
  [5, "Shelf.jsx", "FILE"],
  [5, "Studio.jsx", "FILE"],
  [5, "StudioLights.jsx", "FILE"],
  [4, "HeroExperience.jsx", "FILE"],
  [2, "› sections", "FOLDER"],
  [3, "Hero.jsx", "FILE"],
  [3, "Contact.jsx", "FILE"],
  [1, "package.json", "PKG"],
];

// VS Code's activity bar: line icons drawn around each icon's center (cx, cy)
const path = (g, points, close = false) => {
  g.beginPath();
  points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  if (close) g.closePath();
  g.stroke();
};
const circle = (g, x, y, r) => {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.stroke();
};

const ICONS = {
  explorer: (g, x, y) => {
    path(g, [[x - 14, y - 6], [x - 2, y - 6], [x + 4, y], [x + 4, y + 18], [x - 14, y + 18]], true);
    path(g, [[x - 2, y - 6], [x - 2, y], [x + 4, y]]);
    path(g, [[x - 8, y - 6], [x - 8, y - 14], [x + 6, y - 14], [x + 12, y - 8], [x + 12, y + 10], [x + 4, y + 10]]);
  },
  search: (g, x, y) => {
    circle(g, x - 3, y - 3, 10);
    path(g, [[x + 4, y + 4], [x + 13, y + 13]]);
  },
  sourceControl: (g, x, y) => {
    circle(g, x - 8, y - 12, 4.5);
    circle(g, x - 8, y + 13, 4.5);
    circle(g, x + 9, y - 5, 4.5);
    path(g, [[x - 8, y - 7.5], [x - 8, y + 8.5]]);
    g.beginPath();
    g.moveTo(x + 9, y - 0.5);
    g.quadraticCurveTo(x + 9, y + 7, x - 8, y + 8);
    g.stroke();
  },
  runDebug: (g, x, y) => {
    path(g, [[x - 12, y - 13], [x - 12, y + 11], [x + 6, y - 1]], true);
    circle(g, x + 9, y + 10, 5);
    path(g, [[x + 3, y + 7], [x + 1, y + 5]]);
    path(g, [[x + 15, y + 7], [x + 17, y + 5]]);
  },
  extensions: (g, x, y) => {
    g.strokeRect(x - 14, y - 2, 10, 10);
    g.strokeRect(x - 4, y - 2, 10, 10);
    g.strokeRect(x - 14, y + 8, 10, 10);
    g.save();
    g.translate(x + 8, y - 9);
    g.rotate(Math.PI / 4);
    g.strokeRect(-5, -5, 10, 10);
    g.restore();
  },
  testing: (g, x, y) => {
    path(g, [[x - 5, y - 14], [x - 5, y - 2], [x - 13, y + 14], [x + 13, y + 14], [x + 5, y - 2], [x + 5, y - 14]]);
    path(g, [[x - 9, y - 14], [x + 9, y - 14]]);
    path(g, [[x - 8, y + 6], [x + 8, y + 6]]);
  },
  remote: (g, x, y) => {
    g.strokeRect(x - 14, y - 12, 28, 20);
    path(g, [[x, y + 8], [x, y + 13]]);
    path(g, [[x - 8, y + 14], [x + 8, y + 14]]);
  },
  accounts: (g, x, y) => {
    circle(g, x, y - 6, 7);
    g.beginPath();
    g.arc(x, y + 17, 14, Math.PI * 1.15, Math.PI * 1.85);
    g.stroke();
  },
  manage: (g, x, y) => {
    circle(g, x, y, 6);
    circle(g, x, y, 11);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      path(g, [[x + Math.cos(a) * 11, y + Math.sin(a) * 11], [x + Math.cos(a) * 15, y + Math.sin(a) * 15]]);
    }
  },
};
const TOP_ICONS = ["explorer", "search", "sourceControl", "runDebug", "extensions", "testing", "remote"];

const activityBar = (g) => {
  g.fillStyle = THEME.activityBar;
  g.fillRect(0, 0, 72, H);
  g.lineWidth = 3;
  g.lineCap = "round";
  g.lineJoin = "round";
  TOP_ICONS.forEach((name, i) => {
    const y = 44 + i * 76;
    g.strokeStyle = i === 0 ? THEME.text : "#6c7486";
    ICONS[name](g, 36, y);
  });
  // Explorer is the open view; Source Control has three changed files
  g.fillStyle = THEME.pink;
  g.fillRect(0, 44 - 26, 4, 52);
  g.fillStyle = "#7B61FF";
  g.beginPath();
  g.arc(48, 44 + 2 * 76 + 12, 10, 0, Math.PI * 2);
  g.fill();
  text(g, "3", 48, 44 + 2 * 76 + 17, `700 14px ${SANS}`, "#ffffff", "center");
  g.strokeStyle = "#6c7486";
  ICONS.accounts(g, 36, H - 136);
  ICONS.manage(g, 36, H - 82);
};

const codeTimeline = {
  frame: (t) => {
    const s = t % CODE_LOOP;
    return {
      typed: clampInt(s * TYPE_RATE, 0, STUDIO_CHARS),
      saved: s > TYPED_AT + 0.6,
      command: clampInt((s - TYPED_AT - 1.2) * 14, 0, COMMAND.length),
      ready: s > TYPED_AT + 3,
      caret: Math.floor(t * 2) % 2 === 0,
    };
  },
  render: (g, state) => {
    g.fillStyle = THEME.bg;
    g.fillRect(0, 0, W, H);

    // Activity bar and explorer
    activityBar(g);
    g.fillStyle = THEME.sidebar;
    g.fillRect(72, 0, 380, H);
    text(g, "EXPLORER", 100, 44, `600 21px ${SANS}`, THEME.muted);
    TREE.forEach(([depth, name, color], i) => {
      const y = 92 + i * 40;
      if (name === "Studio.jsx") {
        g.fillStyle = THEME.selection;
        g.fillRect(72, y - 28, 380, 40);
      }
      const tint = { FOLDER: THEME.muted, FILE: THEME.text, PKG: THEME.amber }[color];
      text(g, name, 96 + depth * 22, y, `400 23px ${SANS}`, tint);
    });

    // Tabs: a dot on Studio.jsx until it's saved
    g.fillStyle = THEME.sidebar;
    g.fillRect(452, 0, W - 452, 60);
    g.fillStyle = THEME.bg;
    g.fillRect(452, 0, 230, 60);
    g.fillStyle = THEME.pink;
    g.fillRect(452, 0, 230, 3);
    text(g, state.saved ? "Studio.jsx" : "Studio.jsx  ●", 500, 40, `400 24px ${SANS}`, THEME.text);
    text(g, "Monitors.jsx", 712, 40, `400 24px ${SANS}`, THEME.muted);
    text(g, "Hero.jsx", 900, 40, `400 24px ${SANS}`, THEME.muted);
    text(g, "src › components › hero_models › studio › Studio.jsx", 486, 92, `400 21px ${SANS}`, THEME.muted);

    // The code typed so far, with the cursor at the end
    let left = state.typed;
    let caret = null;
    STUDIO_CODE.forEach((line, i) => {
      if (left < 0) return;
      const y = 142 + i * 36;
      const shown = line.slice(0, left);
      const current = left <= line.length;
      if (current) {
        g.fillStyle = THEME.lineHighlight;
        g.fillRect(452, y - 27, W - 452, 36);
      }
      text(g, String(i + 1), 540, y, `400 24px ${MONO}`, current ? THEME.muted : THEME.dim, "right");
      codeLine(g, shown, 576, y);
      if (current) {
        g.font = `400 27px ${MONO}`;
        caret = [576 + g.measureText(shown).width, y];
      }
      left -= line.length + 1;
    });
    if (caret && state.caret && !state.saved) {
      g.fillStyle = THEME.pink;
      g.fillRect(caret[0] + 1, caret[1] - 26, 3, 32);
    }

    // Terminal: the dev server starts once the file is saved
    g.fillStyle = THEME.border;
    g.fillRect(452, 838, W - 452, 1);
    text(g, "PROBLEMS     OUTPUT     TERMINAL", 486, 876, `500 20px ${SANS}`, THEME.muted);
    g.fillStyle = THEME.pink;
    g.fillRect(712, 884, 106, 2);
    const terminal = [[COMMAND.slice(0, Math.max(2, state.command)), THEME.text]];
    if (state.ready) terminal.push(["  VITE v6.3.4  ready in 412 ms", THEME.green], ["  ➜  Local:   http://localhost:5173/", THEME.blue]);
    terminal.forEach(([line, color], i) => text(g, line, 486, 924 + i * 36, `400 24px ${MONO}`, color));

    // Status bar
    // Status bar in the site's purple -> pink gradient
    const bar = g.createLinearGradient(0, 0, W, 0);
    bar.addColorStop(0, "#7B61FF");
    bar.addColorStop(1, THEME.pink);
    g.fillStyle = bar;
    g.fillRect(0, H - 40, W, 40);
    text(g, "⎇ main    ✓ 0 problems", 24, H - 12, `400 21px ${SANS}`, "#ffffff");
    text(g, "Spaces: 2    UTF-8    JavaScript JSX", W - 24, H - 12, `400 21px ${SANS}`, "#ffffff", "right");
  },
};

export const createClaudeScreen = (fps) => createScreen(claudeTimeline, fps);
export const createCodeScreen = (fps) => createScreen(codeTimeline, fps);

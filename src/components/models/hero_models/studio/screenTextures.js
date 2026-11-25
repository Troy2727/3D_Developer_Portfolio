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
    g.fillStyle = "#1e1e1e";
    g.fillRect(0, 0, W, H);

    // Activity bar and explorer
    g.fillStyle = "#333333";
    g.fillRect(0, 0, 72, H);
    [40, 120, 200, 280].forEach((y, i) => {
      g.strokeStyle = i === 0 ? "#ffffff" : "#858585";
      g.lineWidth = 3;
      g.strokeRect(22, y - 14, 28, 30);
    });
    g.fillStyle = "#252526";
    g.fillRect(72, 0, 380, H);
    text(g, "EXPLORER", 100, 44, `600 21px ${SANS}`, "#bbbbbb");
    TREE.forEach(([depth, name, color], i) => {
      const y = 92 + i * 40;
      if (name === "Studio.jsx") {
        g.fillStyle = "#37373d";
        g.fillRect(72, y - 28, 380, 40);
      }
      text(g, name, 96 + depth * 22, y, `400 23px ${SANS}`, color);
    });

    // Tabs: a dot on Studio.jsx until it's saved
    g.fillStyle = "#252526";
    g.fillRect(452, 0, W - 452, 60);
    g.fillStyle = "#1e1e1e";
    g.fillRect(452, 0, 230, 60);
    g.fillStyle = "#0078d4";
    g.fillRect(452, 0, 230, 3);
    text(g, state.saved ? "Studio.jsx" : "Studio.jsx  ●", 500, 40, `400 24px ${SANS}`, "#ffffff");
    text(g, "Monitors.jsx", 712, 40, `400 24px ${SANS}`, "#969696");
    text(g, "Hero.jsx", 900, 40, `400 24px ${SANS}`, "#969696");
    text(g, "src › components › hero_models › studio › Studio.jsx", 486, 92, `400 21px ${SANS}`, "#a9a9a9");

    // The code typed so far, with the cursor at the end
    let left = state.typed;
    let caret = null;
    STUDIO_CODE.forEach((line, i) => {
      if (left < 0) return;
      const y = 142 + i * 36;
      const shown = line.slice(0, left);
      const current = left <= line.length;
      if (current) {
        g.fillStyle = "rgba(255,255,255,0.04)";
        g.fillRect(452, y - 27, W - 452, 36);
      }
      text(g, String(i + 1), 540, y, `400 24px ${MONO}`, current ? "#c6c6c6" : "#6e7681", "right");
      codeLine(g, shown, 576, y);
      if (current) {
        g.font = `400 27px ${MONO}`;
        caret = [576 + g.measureText(shown).width, y];
      }
      left -= line.length + 1;
    });
    if (caret && state.caret && !state.saved) {
      g.fillStyle = "#aeafad";
      g.fillRect(caret[0] + 1, caret[1] - 26, 3, 32);
    }

    // Terminal: the dev server starts once the file is saved
    g.fillStyle = "#3c3c3c";
    g.fillRect(452, 838, W - 452, 1);
    text(g, "PROBLEMS     OUTPUT     TERMINAL", 486, 876, `500 20px ${SANS}`, "#969696");
    g.fillStyle = "#e7e7e7";
    g.fillRect(712, 884, 106, 2);
    const terminal = [[COMMAND.slice(0, Math.max(2, state.command)), "#cccccc"]];
    if (state.ready) terminal.push(["  VITE v6.3.4  ready in 412 ms", "#23d18b"], ["  ➜  Local:   http://localhost:5173/", "#cccccc"]);
    terminal.forEach(([line, color], i) => text(g, line, 486, 924 + i * 36, `400 24px ${MONO}`, color));

    // Status bar
    g.fillStyle = "#007acc";
    g.fillRect(0, H - 40, W, 40);
    text(g, "⎇ main    ✓ 0 problems", 24, H - 12, `400 21px ${SANS}`, "#ffffff");
    text(g, "Spaces: 2    UTF-8    JavaScript JSX", W - 24, H - 12, `400 21px ${SANS}`, "#ffffff", "right");
  },
};

export const createClaudeScreen = (fps) => createScreen(claudeTimeline, fps);
export const createCodeScreen = (fps) => createScreen(codeTimeline, fps);

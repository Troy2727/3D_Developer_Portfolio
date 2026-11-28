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

export const text = (g, str, x, y, font, color, align = "left") => {
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
export const THEME = {
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

export const codeLine = (g, line, x, y) => {
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

// w x h: the layout size; the Contact setup's 21:9 screens pass their own
export const createScreen = (timeline, fps, w = W, h = H) => {
  const { frame, render } = timeline;
  const [canvas, g] = makeCanvas(w * SCALE, h * SCALE);
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
  return { texture, update, finished: timeline.finished };
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
  g.fillStyle = THEME.pink;
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
const FOLLOW_UP = "Love it. Now add a neon sign that says hello, world.";
const REPLY_2 = "Done. Pink script neon on a clear acrylic panel, hung above the sun stripes so it stays readable, with a soft glow on the wall behind it.";
// Seconds into the loop when each step happens
const AT = { followUp: 15.5, send: 19.2, reply2: 19.9, end: 34 };
const CLAUDE_LOOP = AT.end;
const RECENTS = ["Studio hero in three.js", "FanClash live chat fix", "Contact form with EmailJS", "Go API rate limiter", "Interview prep notes", "README diagram"];

// Line-drawing helpers for the screens' icons
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

// The site's purple -> pink, for buttons and the avatar
const accent = (g, x0, x1) => {
  const gradient = g.createLinearGradient(x0, 0, x1, 0);
  gradient.addColorStop(0, "#7B61FF");
  gradient.addColorStop(1, THEME.pink);
  return gradient;
};

// Small sidebar icons, drawn around (x, y)
const SIDEBAR_ICONS = {
  chats: (g, x, y) => {
    g.beginPath();
    g.roundRect(x - 13, y - 11, 26, 18, 6);
    g.stroke();
    path(g, [[x - 6, y + 7], [x - 9, y + 13], [x + 1, y + 7]]);
  },
  projects: (g, x, y) => {
    path(g, [[x - 13, y + 10], [x - 13, y - 10], [x - 4, y - 10], [x - 1, y - 6], [x + 13, y - 6], [x + 13, y + 10]], true);
  },
  artifacts: (g, x, y) => {
    for (const [dx, dy] of [[-12, -11], [2, -11], [-12, 2], [2, 2]]) g.strokeRect(x + dx, y + dy, 10, 10);
  },
};

const claudeSidebar = (g) => {
  g.fillStyle = THEME.sidebar;
  g.fillRect(0, 0, 420, H);
  g.fillStyle = THEME.border;
  g.fillRect(419, 0, 1, H);
  text(g, "Claude", 48, 88, `400 46px ${SERIF}`, THEME.text);

  box(g, 36, 128, 348, 66, 14, "#211f2b");
  g.fillStyle = accent(g, 52, 92);
  g.beginPath();
  g.arc(72, 161, 18, 0, Math.PI * 2);
  g.fill();
  text(g, "+", 72, 171, `700 30px ${SANS}`, "#ffffff", "center");
  text(g, "New chat", 104, 172, `600 30px ${SANS}`, THEME.pink);

  g.strokeStyle = THEME.muted;
  g.lineWidth = 2.5;
  g.lineCap = "round";
  g.lineJoin = "round";
  ["Chats", "Projects", "Artifacts"].forEach((label, i) => {
    const y = 236 + i * 52;
    SIDEBAR_ICONS[label.toLowerCase()](g, 64, y - 9);
    text(g, label, 96, y, `500 27px ${SANS}`, THEME.muted);
  });

  text(g, "Recents", 48, 420, `600 24px ${SANS}`, THEME.dim);
  RECENTS.forEach((title, i) => {
    const y = 440 + i * 60;
    if (i === 0) box(g, 30, y, 360, 52, 10, THEME.selection);
    text(g, title, 52, y + 36, `400 26px ${SANS}`, i === 0 ? THEME.text : THEME.muted);
  });

  g.fillStyle = THEME.border;
  g.fillRect(24, H - 128, 372, 2);
  g.fillStyle = accent(g, 50, 114);
  g.beginPath();
  g.arc(82, H - 64, 32, 0, Math.PI * 2);
  g.fill();
  text(g, "A", 82, H - 52, `700 32px ${SANS}`, "#ffffff", "center");
  text(g, "Alex", 132, H - 70, `600 32px ${SANS}`, THEME.text);
  text(g, "Pro plan", 132, H - 36, `400 23px ${SANS}`, THEME.muted);
};

// The empty message box ("What can I do for you, Alex Mieses?") stays up this long before
// the prompt starts typing; everything after it shifts by the extra time
const HOME_HOLD = 4;
const SHIFT = HOME_HOLD - 1.5;

const claudeTimeline = {
  finished: AT.end + SHIFT - 1, // what reduced motion shows: the whole conversation
  frame: (t) => {
    const loop = t % (CLAUDE_LOOP + SHIFT);
    const caret = Math.floor(t * 2) % 2 === 0;
    if (loop < 6 + SHIFT) return { view: "home", typed: clampInt((loop - HOME_HOLD) * 28, 0, PROMPT.length), caret };
    const s = loop - SHIFT;
    const reply = clampInt((s - 6.5) * 55, 0, REPLY.length);
    const code = clampInt((s - 9.5) * 45, 0, CLAUDE_CODE_CHARS);
    const followUp = s < AT.send ? clampInt((s - AT.followUp) * 18, 0, FOLLOW_UP.length) : 0;
    const sent = s >= AT.send;
    const reply2 = clampInt((s - AT.reply2) * 55, 0, REPLY_2.length);
    // Scroll eases in over half a second once the follow-up is sent
    const scroll = sent ? Math.round(Math.min(1, (s - AT.send) / 0.5) * 20) / 20 : 0;
    const streaming = reply < REPLY.length || code < CLAUDE_CODE_CHARS || (sent && reply2 < REPLY_2.length);
    const typing = !sent && followUp > 0;
    return { view: "chat", reply, code, status: s > 14, followUp, sent, reply2, scroll, caret: (streaming || typing) && caret, typing };
  },
  render: (g, state) => {
    g.fillStyle = THEME.bg;
    g.fillRect(0, 0, W, H);
    claudeSidebar(g);
    const x0 = 640;
    const col = 1040;

    if (state.view === "home") {
      // Greeting, then the prompt being typed into the composer
      starburst(g, 830, 360, 34);
      text(g, "Welcome back, Alex", 1200, 384, `400 68px ${SERIF}`, THEME.text, "center");
      box(g, x0 - 20, 450, col + 40, 210, 28, "#24232b");
      const font = `400 32px ${SANS}`;
      if (state.typed === 0) {
        text(g, "What can I do for you, Alex Mieses?", x0 + 14, 510, font, THEME.muted);
        if (state.caret) caretAt(g, x0 + 8, 510, 36);
      } else {
        const lines = wrap(g, PROMPT.slice(0, state.typed), col - 40, font);
        lines.forEach((line, i) => text(g, line, x0 + 14, 510 + i * 44, font, THEME.text));
        g.font = font;
        if (state.caret) caretAt(g, x0 + 14 + g.measureText(lines[lines.length - 1]).width, 510 + (lines.length - 1) * 44, 36);
      }
      box(g, x0 + col - 58, 598, 54, 48, 12, state.typed ? accent(g, x0 + col - 58, x0 + col - 4) : "#2f2d3a");
      text(g, "↑", x0 + col - 31, 634, `700 30px ${SANS}`, "#ffffff", "center");
      ["</>  Code", "✎  Write", "◎  Learn", "☕  Life stuff"].forEach((chip, i) => {
        box(g, x0 + 120 + i * 205, 700, 185, 56, 14, "#24232b");
        text(g, chip, x0 + 212 + i * 205, 737, `500 25px ${SANS}`, THEME.muted, "center");
      });
      return;
    }

    // The conversation: prompt, streamed reply, code block filling in line by line,
    // then a follow-up from Alex and a second streamed reply. The thread scrolls
    // inside the area above the composer.
    text(g, "Studio hero in three.js", 1170, 64, `500 27px ${SANS}`, THEME.muted, "center");
    const font = `400 30px ${SANS}`;
    const composerTop = H - 176;

    // Lay the thread out first, so the scroll can bring its end into view
    const replyLines = wrap(g, REPLY.slice(0, state.reply), col - 64, font);
    const codeTop = 332 + replyLines.length * 42 + 8;
    const statusY = codeTop + 284 + 52;
    g.font = font;
    const bubbleW = Math.min(col - 260, g.measureText(FOLLOW_UP).width + 64);
    const bubble2Top = statusY + 44;
    const reply2Lines = wrap(g, REPLY_2.slice(0, state.reply2), col - 64, font);
    const reply2Top = bubble2Top + 72 + 56;
    const fullEnd = reply2Top + wrap(g, REPLY_2, col - 64, font).length * 42;
    const scroll = Math.max(0, fullEnd - (composerTop - 30)) * state.scroll;

    g.save();
    g.beginPath();
    g.rect(420, 90, W - 420, composerTop - 100);
    g.clip();
    g.translate(0, -scroll);

    box(g, x0 + 260, 112, col - 260, 148, 22, "#2a2740");
    paragraph(g, PROMPT, x0 + 292, 166, col - 324, 42, font, THEME.text);
    starburst(g, x0 + 20, 320, 22);
    replyLines.forEach((line, i) => text(g, line, x0 + 64, 332 + i * 42, font, "#c9d6e8"));
    if (state.reply < REPLY.length) {
      g.font = font;
      if (state.caret) caretAt(g, x0 + 64 + g.measureText(replyLines[replyLines.length - 1]).width, 332 + (replyLines.length - 1) * 42, 34);
    } else {
      box(g, x0, codeTop, col, 284, 16, THEME.sidebar);
      text(g, "jsx", x0 + 28, codeTop + 40, `500 22px ${SANS}`, THEME.muted);
      let left = state.code;
      CLAUDE_CODE.forEach((line, i) => {
        if (left <= 0) return;
        codeLine(g, line.slice(0, left), x0 + 28, codeTop + 96 + i * 44);
        left -= line.length;
      });
      if (state.status) text(g, "Round 3   desk 9/10 · monitors 9/10 · blinds 8/10 → fixing blinds", x0, statusY, `500 26px ${SANS}`, THEME.muted);
    }

    if (state.sent) {
      box(g, x0 + col - bubbleW, bubble2Top, bubbleW, 72, 22, "#2a2740");
      text(g, FOLLOW_UP, x0 + col - bubbleW + 32, bubble2Top + 47, font, THEME.text);
      if (state.reply2 > 0) {
        starburst(g, x0 + 20, reply2Top - 12, 22);
        reply2Lines.forEach((line, i) => text(g, line, x0 + 64, reply2Top + i * 42, font, "#c9d6e8"));
        g.font = font;
        if (state.reply2 < REPLY_2.length && state.caret) {
          caretAt(g, x0 + 64 + g.measureText(reply2Lines[reply2Lines.length - 1]).width, reply2Top + (reply2Lines.length - 1) * 42, 34);
        }
      }
    }
    g.restore();

    // Composer: the follow-up is typed here before it's sent
    box(g, x0 - 20, composerTop, col + 40, 128, 28, "#24232b");
    if (state.followUp > 0) {
      const typed = FOLLOW_UP.slice(0, state.followUp);
      text(g, typed, x0 + 14, H - 116, font, THEME.text);
      g.font = font;
      if (state.caret) caretAt(g, x0 + 14 + g.measureText(typed).width, H - 116, 36);
    } else {
      text(g, "What can I do for you, Alex Mieses?", x0 + 14, H - 116, font, THEME.muted);
    }
    box(g, x0 + col - 58, H - 108, 54, 48, 12, state.followUp > 0 || !state.sent ? accent(g, x0 + col - 58, x0 + col - 4) : "#2f2d3a");
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

export const activityBar = (g) => {
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

// Explorer rows: a chevron for folders, then a folder or file icon, then the name
const FOLDER_COLORS = { src: THEME.blue, components: THEME.purple, hero_models: THEME.lavender, studio: THEME.pink, sections: THEME.amber };

const folderIcon = (g, x, y, color, open) => {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y + 16);
  g.lineTo(x, y);
  g.lineTo(x + 9, y);
  g.lineTo(x + 12, y + 3);
  g.lineTo(x + 24, y + 3);
  g.lineTo(x + 24, y + 16);
  g.closePath();
  g.fill();
  if (open) {
    g.fillStyle = "rgba(255,255,255,0.25)";
    g.beginPath();
    g.moveTo(x + 3, y + 7);
    g.lineTo(x + 27, y + 7);
    g.lineTo(x + 24, y + 16);
    g.lineTo(x, y + 16);
    g.closePath();
    g.fill();
  }
};

const reactIcon = (g, x, y) => {
  g.strokeStyle = THEME.blue;
  g.lineWidth = 1.8;
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.ellipse(x, y, 11, 4.5, (i * Math.PI) / 3, 0, Math.PI * 2);
    g.stroke();
  }
  g.fillStyle = THEME.blue;
  g.beginPath();
  g.arc(x, y, 2.4, 0, Math.PI * 2);
  g.fill();
};

// folderColor overrides FOLDER_COLORS, for folders this tree doesn't know
export const treeRow = (g, depth, name, kind, y, folderColor) => {
  const x = 96 + depth * 22;
  const iconX = x + 20;
  let label = name;
  if (kind === "FOLDER") {
    const open = name.startsWith("⌄");
    label = name.slice(2);
    g.strokeStyle = THEME.muted;
    g.lineWidth = 2.5;
    g.lineCap = "round";
    g.lineJoin = "round";
    if (open) path(g, [[x, y - 12], [x + 5, y - 7], [x + 10, y - 12]]);
    else path(g, [[x + 3, y - 15], [x + 8, y - 10], [x + 3, y - 5]]);
    folderIcon(g, iconX, y - 19, folderColor ?? FOLDER_COLORS[label] ?? THEME.muted, open);
  } else if (kind === "PKG") {
    text(g, "{ }", iconX + 12, y - 1, `700 19px ${MONO}`, THEME.amber, "center");
  } else {
    reactIcon(g, iconX + 12, y - 9);
  }
  const font = depth === 0 ? `600 20px ${SANS}` : `400 23px ${SANS}`;
  text(g, label, iconX + 34, y, font, kind === "FOLDER" ? THEME.muted : kind === "PKG" ? THEME.amber : THEME.text);
};

const codeTimeline = {
  finished: TYPED_AT + 5, // code typed, saved, dev server ready
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
      treeRow(g, depth, name, color, y);
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

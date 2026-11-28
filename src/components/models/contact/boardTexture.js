import { makeCanvas, toTexture } from "../hero_models/studio/surfaceTextures";

// "How I build": six small system diagrams with packets flowing along the arrows, in the
// style of an animated architecture infographic. Laid out in 2100 x 900 units (21:9),
// drawn at 80%. update(t) redraws at most `fps` times a second. Animations run at 60% speed
// so the board stays calm in the background.
const PACE = 0.6;
const W = 2100;
const H = 900;
const SCALE = 0.8;
const SANS = '"Mona Sans", "Segoe UI", Arial, sans-serif';
const MONO = '"JetBrains Mono", Consolas, monospace';

const C = {
  bg: "#070a12",
  tile: "#0d1220",
  text: "#e6edf7",
  muted: "#8b98ad",
  line: "rgba(217,236,255,0.22)",
  blue: "#3b82f6",
  cyan: "#22d3ee",
  green: "#4ade80",
  pink: "#f472b6",
  purple: "#a78bfa",
  amber: "#fbbf24",
  red: "#f87171",
};

const rr = (g, x, y, w, h, r) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
};

const label = (g, str, x, y, size, color, weight = 600, align = "center", font = SANS) => {
  g.font = `${weight} ${size}px ${font}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.fillText(str, x, y);
  g.textAlign = "left";
};

const node = (g, x, y, w, h, name, color, sub) => {
  rr(g, x, y, w, h, 14);
  g.fillStyle = `${color}26`;
  g.fill();
  g.strokeStyle = color;
  g.lineWidth = 3;
  g.stroke();
  label(g, name, x + w / 2, y + h / 2 + (sub ? -2 : 9), 24, C.text);
  if (sub) label(g, sub, x + w / 2, y + h / 2 + 24, 17, C.muted, 400);
};

const arrow = (g, points) => {
  g.strokeStyle = C.line;
  g.lineWidth = 3;
  g.beginPath();
  points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
  const [x1, y1] = points[points.length - 1];
  const [x0, y0] = points[points.length - 2];
  const a = Math.atan2(y1 - y0, x1 - x0);
  g.fillStyle = C.line;
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x1 - 14 * Math.cos(a - 0.45), y1 - 14 * Math.sin(a - 0.45));
  g.lineTo(x1 - 14 * Math.cos(a + 0.45), y1 - 14 * Math.sin(a + 0.45));
  g.closePath();
  g.fill();
};

// Point at fraction f (0..1) along a polyline
const along = (points, f) => {
  const lengths = points.slice(1).map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]));
  let d = Math.max(0, Math.min(1, f)) * lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lengths.length; i++) {
    if (d <= lengths[i] || i === lengths.length - 1) {
      const k = lengths[i] ? d / lengths[i] : 0;
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k];
    }
    d -= lengths[i];
  }
  return points[0];
};

const packet = (g, [x, y], color, r = 8) => {
  g.fillStyle = `${color}40`;
  g.beginPath();
  g.arc(x, y, r * 2, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
};

// A stream of packets along a path: `count` evenly spaced, moving at `speed` laps a second
const stream = (g, points, t, color, count = 3, speed = 0.45) => {
  for (let i = 0; i < count; i++) packet(g, along(points, (t * speed + i / count) % 1), color);
};

// ---- The six tiles. Each draws in its own 664 x 388 box with the origin at its corner.

const restApi = (g, t) => {
  node(g, 30, 140, 140, 80, "Client", C.blue, "React");
  node(g, 262, 140, 140, 80, "Go API", C.cyan, "net/http");
  node(g, 494, 140, 140, 80, "Postgres", C.purple, "SQL");
  arrow(g, [[170, 165], [262, 165]]);
  arrow(g, [[402, 165], [494, 165]]);
  arrow(g, [[494, 198], [402, 198]]);
  arrow(g, [[262, 198], [170, 198]]);
  stream(g, [[170, 165], [262, 165]], t, C.blue, 2, 0.8);
  stream(g, [[402, 165], [494, 165]], t + 0.2, C.cyan, 2, 0.8);
  stream(g, [[494, 198], [402, 198]], t + 0.4, C.green, 2, 0.8);
  stream(g, [[262, 198], [170, 198]], t + 0.6, C.green, 2, 0.8);
  return "Typed handlers in front of a SQL database";
};

const fanOut = (g, t) => {
  node(g, 30, 150, 130, 70, "Sender", C.pink);
  node(g, 232, 140, 170, 90, "WS hub", C.cyan, "1 msg");
  const viewers = [70, 155, 240];
  viewers.forEach((y) => node(g, 494, y, 140, 56, "Viewer", C.blue));
  arrow(g, [[160, 185], [232, 185]]);
  viewers.forEach((y) => arrow(g, [[402, 185], [450, y + 28], [494, y + 28]]));
  const f = (t * 0.5) % 1;
  if (f < 0.45) packet(g, along([[160, 185], [232, 185]], f / 0.45), C.pink);
  else viewers.forEach((y) => packet(g, along([[402, 185], [450, y + 28], [494, y + 28]], (f - 0.45) / 0.55), C.pink));
  return "One message in, every viewer gets it";
};

const rateLimiter = (g, t) => {
  node(g, 30, 145, 120, 70, "Clients", C.blue);
  node(g, 262, 125, 150, 110, "Limiter", C.amber, "token bucket");
  node(g, 514, 145, 120, 70, "API", C.green);
  arrow(g, [[150, 180], [262, 180]]);
  arrow(g, [[412, 180], [514, 180]]);
  // Tokens left in the bucket
  const tokens = 5 - (Math.floor(t * 3) % 6);
  for (let i = 0; i < 5; i++) {
    g.fillStyle = i < tokens ? C.amber : "rgba(251,191,36,0.15)";
    g.fillRect(280 + i * 24, 248, 18, 18);
  }
  // Every fourth request is over the limit: it stops at the gate and gets a 429
  for (let i = 0; i < 4; i++) {
    const f = (t * 0.55 + i / 4) % 1;
    const blocked = i === 3;
    if (f < 0.4) packet(g, along([[150, 180], [262, 180]], f / 0.4), C.blue);
    else if (blocked) {
      packet(g, [262, 180], C.red);
      label(g, "429", 262, 150, 22, C.red, 700, "center", MONO);
    } else packet(g, along([[412, 180], [514, 180]], (f - 0.4) / 0.6), C.green);
  }
  return "Over the limit? The request gets a 429";
};

const eventStream = (g, t) => {
  node(g, 30, 95, 130, 60, "Orders", C.pink);
  node(g, 30, 215, 130, 60, "Clicks", C.blue);
  // Append-only log: cells fill left to right
  const filled = Math.floor(t * 2) % 9;
  for (let i = 0; i < 8; i++) {
    rr(g, 222 + i * 28, 160, 24, 50, 5);
    g.fillStyle = i < filled ? (i % 2 ? C.blue : C.pink) : "rgba(217,236,255,0.08)";
    g.fill();
  }
  label(g, "topic: events", 334, 240, 18, C.muted, 400, "center", MONO);
  node(g, 504, 95, 130, 60, "Search", C.purple);
  node(g, 504, 215, 130, 60, "Billing", C.green);
  [[[160, 125], [210, 185]], [[160, 245], [210, 185]]].forEach((p) => arrow(g, p));
  [[[458, 185], [504, 125]], [[458, 185], [504, 245]]].forEach((p) => arrow(g, p));
  stream(g, [[160, 125], [210, 185]], t, C.pink, 1, 0.9);
  stream(g, [[160, 245], [210, 185]], t + 0.5, C.blue, 1, 0.9);
  stream(g, [[458, 185], [504, 125]], t + 0.25, C.purple, 1, 0.9);
  stream(g, [[458, 185], [504, 245]], t + 0.75, C.green, 1, 0.9);
  return "Producers and consumers never wait on each other";
};

const STAGES = ["Commit", "Test", "Build", "Deploy"];
const ciCd = (g, t) => {
  const step = Math.floor(t / 1.1) % (STAGES.length + 2); // two beats on "live"
  STAGES.forEach((name, i) => {
    const x = 24 + i * 158;
    const done = i < step;
    const running = i === step;
    const color = done ? C.green : running ? C.amber : "#4b5568";
    node(g, x, 140, 128, 80, name, color, done ? "✓ passed" : running ? "running" : "queued");
    if (i < STAGES.length - 1) arrow(g, [[x + 128, 180], [x + 158, 180]]);
  });
  if (step < STAGES.length) {
    const f = (t / 1.1) % 1;
    const x = 24 + step * 158 + 64;
    g.strokeStyle = C.amber;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(x, 260, 14, f * Math.PI * 2, f * Math.PI * 2 + 4.5);
    g.stroke();
  } else {
    label(g, "● live", 332, 280, 26, C.green, 700);
  }
  return "Every push tested, built and deployed";
};

const metrics = (g, t) => {
  const bars = 16;
  const limit = 150; // bars stay under 208 tall, clear of the tile title
  let last = 0;
  for (let i = 0; i < bars; i++) {
    const k = i + Math.floor(t * 3);
    const v = 0.8 * (70 + 60 * Math.sin(k * 0.7) + 40 * Math.sin(k * 1.9) + (k % 11 === 0 ? 90 : 0));
    last = v;
    g.fillStyle = v > limit ? C.pink : C.cyan;
    g.fillRect(36 + i * 30, 300 - v, 20, v);
  }
  g.strokeStyle = C.red;
  g.setLineDash([10, 8]);
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(30, 300 - limit);
  g.lineTo(520, 300 - limit);
  g.stroke();
  g.setLineDash([]);
  const alert = last > limit;
  rr(g, 534, 120, 110, 60, 12);
  g.fillStyle = alert ? "rgba(248,113,113,0.2)" : "rgba(74,222,128,0.15)";
  g.fill();
  label(g, alert ? "ALERT" : "OK", 589, 160, 24, alert ? C.red : C.green, 700);
  label(g, "latency", 589, 215, 20, C.muted, 400);
  return "Dashboards that alert before users notice";
};

const TILES = [
  ["Go REST API", C.cyan, restApi],
  ["Live chat fan-out", C.pink, fanOut],
  ["Rate limiter", C.amber, rateLimiter],
  ["Event stream", C.purple, eventStream],
  ["CI/CD", C.green, ciCd],
  ["Live metrics", C.blue, metrics],
];
const TILE = { w: 664, h: 388, x0: 30, y0: 92, gap: 24 };

const draw = (g, t) => {
  g.fillStyle = C.bg;
  g.fillRect(0, 0, W, H);
  label(g, "How I build", 36, 60, 40, C.text, 700, "left");
  label(g, "patterns behind the systems I ship", 290, 60, 26, C.muted, 400, "left");

  TILES.forEach(([title, accent, tile], i) => {
    const x = TILE.x0 + (i % 3) * (TILE.w + TILE.gap);
    const y = TILE.y0 + Math.floor(i / 3) * (TILE.h + TILE.gap);
    rr(g, x, y, TILE.w, TILE.h, 20);
    g.fillStyle = C.tile;
    g.fill();
    g.strokeStyle = `${accent}80`;
    g.lineWidth = 2;
    g.stroke();
    label(g, `${i + 1}. ${title}`, x + 28, y + 46, 28, C.text, 700, "left");
    g.save();
    g.translate(x, y);
    const caption = tile(g, t + i * 0.37);
    g.restore();
    label(g, caption, x + TILE.w / 2, y + TILE.h - 26, 21, C.muted, 400);
  });
};

// still: visitors who prefer reduced motion get one frame
export const createBoardScreen = (fps, still = false) => {
  const [canvas, g] = makeCanvas(W * SCALE, H * SCALE);
  const texture = toTexture(canvas);
  let shown = null;
  return {
    texture,
    update(t) {
      const frame = still ? 0 : Math.floor(t * fps);
      if (frame === shown) return;
      shown = frame;
      g.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      draw(g, still ? 3 : (frame / fps) * PACE);
      texture.needsUpdate = true;
    },
  };
};

import { makeCanvas, toTexture } from "./surfaceTextures";

// The three prints on the gallery wall, drawn in code: full-stack developer themes.
const SANS = '"Segoe UI", system-ui, -apple-system, sans-serif';
const MONO = 'Consolas, Menlo, "Courier New", monospace';

// "FULL STACK": the layers of an app as an isometric stack, top to bottom
export function stackPrintTexture() {
  const [canvas, g] = makeCanvas(512, 640);
  g.fillStyle = "#f1ebe1";
  g.fillRect(0, 0, 512, 640);

  g.fillStyle = "#24303a";
  g.textAlign = "center";
  g.font = `700 54px ${SANS}`;
  g.fillText("FULL STACK", 256, 86);
  g.font = `400 20px ${SANS}`;
  g.fillStyle = "#6b7480";
  g.fillText("from the pixel to the database", 256, 118);

  const layers = [
    ["UI", "React · TypeScript", "#4fb3bf"],
    ["API", "Go · Node", "#5f7a61"],
    ["DATA", "Postgres · Redis", "#e8a33d"],
    ["CLOUD", "Docker · Vercel", "#d0623f"],
  ];
  // Each layer is an isometric slab: top face, front face, side face
  const cx = 180;
  const slab = { w: 120, d: 60, h: 34 };
  layers.forEach(([name, tech, color], i) => {
    const y = 190 + i * 96;
    const top = [[cx, y - slab.d / 2], [cx + slab.w, y], [cx, y + slab.d / 2], [cx - slab.w, y]];
    g.fillStyle = color;
    g.beginPath();
    top.forEach(([px, py], k) => (k ? g.lineTo(px, py) : g.moveTo(px, py)));
    g.fill();
    // Side faces: the layer's color, shaded darker
    const side = (pts, shade) => {
      for (const fill of [color, `rgba(0,0,0,${shade})`]) {
        g.fillStyle = fill;
        g.beginPath();
        pts.forEach(([px, py], k) => (k ? g.lineTo(px, py) : g.moveTo(px, py)));
        g.fill();
      }
    };
    side([[cx - slab.w, y], [cx, y + slab.d / 2], [cx, y + slab.d / 2 + slab.h], [cx - slab.w, y + slab.h]], 0.2);
    side([[cx, y + slab.d / 2], [cx + slab.w, y], [cx + slab.w, y + slab.h], [cx, y + slab.d / 2 + slab.h]], 0.36);

    // Label with a leader line
    g.strokeStyle = "#9aa1a9";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(cx + slab.w + 8, y + 6);
    g.lineTo(cx + slab.w + 34, y + 6);
    g.stroke();
    g.textAlign = "left";
    g.fillStyle = "#24303a";
    g.font = `700 26px ${SANS}`;
    g.fillText(name, cx + slab.w + 42, y + 4);
    g.fillStyle = "#6b7480";
    g.font = `400 18px ${SANS}`;
    g.fillText(tech, cx + slab.w + 42, y + 28);
  });

  g.textAlign = "center";
  g.fillStyle = "#24303a";
  g.fillRect(70, 572, 372, 3);
  g.font = `600 20px ${SANS}`;
  g.fillText("ALEX · FRONT TO BACK", 256, 608);
  return toTexture(canvas);
}

// `git log --graph`: a main line with a feature branch and a fix merging back
export function gitGraphPrintTexture() {
  const [canvas, g] = makeCanvas(512, 400);
  g.fillStyle = "#1d2127";
  g.fillRect(0, 0, 512, 400);
  g.fillStyle = "#7d8590";
  g.font = `400 18px ${MONO}`;
  g.fillText("$ git log --graph --oneline", 28, 40);

  const lanes = { main: 150, feature: 230, fix: 310 };
  const colors = { main: "#58a6ff", feature: "#3fb950", fix: "#f0883e" };
  const x0 = 50;
  const x1 = 470;
  g.lineWidth = 6;
  g.lineCap = "round";
  const line = (color, pts) => {
    g.strokeStyle = color;
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  };
  line(colors.main, [[x0, lanes.main], [x1, lanes.main]]);
  line(colors.feature, [[110, lanes.main], [150, lanes.feature], [330, lanes.feature], [370, lanes.main]]);
  line(colors.fix, [[200, lanes.feature], [240, lanes.fix], [280, lanes.fix], [320, lanes.feature]]);

  const commit = (x, y, color) => {
    g.fillStyle = "#1d2127";
    g.beginPath();
    g.arc(x, y, 11, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = color;
    g.lineWidth = 5;
    g.stroke();
  };
  [x0, 110, 240, 370, 430].forEach((x) => commit(x, lanes.main, colors.main));
  [170, 270, 330].forEach((x) => commit(x, lanes.feature, colors.feature));
  commit(260, lanes.fix, colors.fix);
  // The merge commit is filled
  g.fillStyle = colors.main;
  g.beginPath();
  g.arc(370, lanes.main, 11, 0, Math.PI * 2);
  g.fill();

  g.font = `600 18px ${MONO}`;
  [["main", "main"], ["feature/studio", "feature"], ["fix/contact-form", "fix"]].forEach(([label, lane]) => {
    g.fillStyle = colors[lane];
    g.fillText(label, 28, lanes[lane] + (lane === "main" ? -26 : 40));
  });
  g.fillStyle = "#c9d1d9";
  g.font = `400 16px ${MONO}`;
  g.fillText("Merge feature/studio → main  ✓ deployed", 28, 388);
  return toTexture(canvas);
}

// A bold code tag
export function codeTagPrintTexture() {
  const [canvas, g] = makeCanvas(400, 400);
  g.fillStyle = "#24303a";
  g.fillRect(0, 0, 400, 400);
  g.textAlign = "center";
  g.fillStyle = "#e8a33d";
  g.font = `700 150px ${MONO}`;
  g.fillText("</>", 200, 230);
  g.fillStyle = "#f1ebe1";
  g.font = `700 34px ${SANS}`;
  g.fillText("SHIP IT", 200, 320);
  g.fillStyle = "#7d8590";
  g.font = `400 16px ${MONO}`;
  g.fillText("build · test · deploy", 200, 352);
  return toTexture(canvas);
}

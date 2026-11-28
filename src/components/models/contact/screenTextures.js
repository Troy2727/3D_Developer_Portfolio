import { activityBar, codeLine, createScreen, text, THEME, treeRow } from "../hero_models/studio/screenTextures";
import { makeCanvas, seeded, toTexture } from "../hero_models/studio/surfaceTextures";

// Animated 21:9 screens. Screen 1 types out the component that runs the game on screen 2.
// update(t) takes the clock time in seconds and redraws at most `fps` times a second.
const MONO = '"JetBrains Mono", Consolas, "Courier New", monospace';
const SANS = '"Mona Sans", "Segoe UI", Arial, sans-serif';

// ---------------------------------------------------------------- Screen 1: editor
// VS Code in the hero room's theme (same activity bar, folder and file icons, colors),
// laid out in 2520 x 1080 units for the 21:9 panel.
const EW = 2520;
const EH = 1080;

const GAME_CODE = [
  'import { useEffect, useRef } from "react";',
  'import { spawnWave, collide, explode, startLoop } from "./engine";',
  "",
  "// Screen 2: a neon shooter that plays itself",
  "export default function NeonShooter() {",
  "  const canvas = useRef();",
  "",
  "  useEffect(() => {",
  "    const ship = { x: 640, speed: 520 };",
  "    let enemies = spawnWave(1);",
  "",
  "    return startLoop(canvas.current, (dt) => {",
  "      const goal = enemies.at(-1) ?? ship;",
  "      ship.x += Math.sign(goal.x - ship.x) * ship.speed * dt;",
  "      enemies = enemies.filter((e) => !collide(e, ship) || explode(e));",
  "    });",
  "  }, []);",
  "",
  "  return <canvas ref={canvas} width={1280} height={548} />;",
  "}",
];
const CHARS = GAME_CODE.reduce((n, line) => n + line.length + 1, 0); // +1: the newline
const TYPE_RATE = 34; // characters per second
const TYPED_AT = CHARS / TYPE_RATE;
const COMMAND = "$ npm run dev";
const LOOP = TYPED_AT + 9;
const FINISHED = TYPED_AT + 5; // typed, saved, dev server ready

// [depth, name, kind, folder color]
const TREE = [
  [0, "⌄ 3D_DEVELOPER_PORTFOLIO", "FOLDER"],
  [1, "⌄ src", "FOLDER"],
  [2, "⌄ components", "FOLDER"],
  [3, "⌄ models", "FOLDER", THEME.cyan],
  [4, "⌄ contact", "FOLDER", THEME.pink],
  [5, "ContactExperience.jsx", "FILE"],
  [5, "DeskSetup.jsx", "FILE"],
  [5, "GamingChair.jsx", "FILE"],
  [5, "NeonShooter.jsx", "FILE"],
  [5, "UltrawideMonitor.jsx", "FILE"],
  [5, "Webcam.jsx", "FILE"],
  [4, "› hero_models", "FOLDER"],
  [2, "› sections", "FOLDER"],
  [1, "package.json", "PKG"],
];

const editorTimeline = {
  frame: (t) => {
    const s = t % LOOP;
    return {
      typed: Math.max(0, Math.min(CHARS, Math.floor(s * TYPE_RATE))),
      saved: s > TYPED_AT + 0.6,
      command: Math.max(0, Math.min(COMMAND.length, Math.floor((s - TYPED_AT - 1.2) * 14))),
      ready: s > TYPED_AT + 3,
      caret: Math.floor(t * 2) % 2 === 0,
    };
  },
  render: (g, state) => {
    g.fillStyle = THEME.bg;
    g.fillRect(0, 0, EW, EH);

    // Activity bar and explorer
    activityBar(g);
    g.fillStyle = THEME.sidebar;
    g.fillRect(72, 0, 380, EH);
    text(g, "EXPLORER", 100, 44, `600 21px ${SANS}`, THEME.muted);
    TREE.forEach(([depth, name, kind, color], i) => {
      const y = 92 + i * 40;
      if (name === "NeonShooter.jsx") {
        g.fillStyle = THEME.selection;
        g.fillRect(72, y - 28, 380, 40);
      }
      treeRow(g, depth, name, kind, y, color);
    });

    // Tabs: a dot on NeonShooter.jsx until it's saved
    g.fillStyle = THEME.sidebar;
    g.fillRect(452, 0, EW - 452, 60);
    g.fillStyle = THEME.bg;
    g.fillRect(452, 0, 280, 60);
    g.fillStyle = THEME.pink;
    g.fillRect(452, 0, 280, 3);
    text(g, state.saved ? "NeonShooter.jsx" : "NeonShooter.jsx  ●", 490, 40, `400 24px ${SANS}`, THEME.text);
    text(g, "engine.js", 762, 40, `400 24px ${SANS}`, THEME.muted);
    text(g, "DeskSetup.jsx", 912, 40, `400 24px ${SANS}`, THEME.muted);
    text(g, "src › components › models › contact › NeonShooter.jsx", 486, 92, `400 21px ${SANS}`, THEME.muted);

    // The code typed so far, with the cursor at the end
    let left = state.typed;
    let caret = null;
    GAME_CODE.forEach((line, i) => {
      if (left < 0) return;
      const y = 142 + i * 34;
      const shown = line.slice(0, left);
      const current = left <= line.length;
      if (current) {
        g.fillStyle = THEME.lineHighlight;
        g.fillRect(452, y - 26, EW - 452, 34);
      }
      text(g, String(i + 1), 540, y, `400 24px ${MONO}`, current ? THEME.muted : THEME.dim, "right");
      codeLine(g, shown, 576, y);
      if (current) caret = [576 + g.measureText(shown).width, y];
      // Minimap: a sliver per typed line on the right edge
      g.fillStyle = "rgba(195,166,255,0.35)";
      g.fillRect(EW - 170, 120 + i * 9, Math.min(140, shown.length * 2), 4);
      left -= line.length + 1;
    });
    g.fillStyle = "rgba(217,236,255,0.05)";
    g.fillRect(EW - 180, 110, 160, GAME_CODE.length * 9 + 20);
    if (caret && state.caret && !state.saved) {
      g.fillStyle = THEME.pink;
      g.fillRect(caret[0] + 1, caret[1] - 26, 3, 32);
    }

    // Terminal: the dev server starts once the file is saved
    g.fillStyle = THEME.border;
    g.fillRect(452, 838, EW - 452, 1);
    text(g, "PROBLEMS     OUTPUT     TERMINAL", 486, 876, `500 20px ${SANS}`, THEME.muted);
    g.fillStyle = THEME.pink;
    g.fillRect(712, 884, 106, 2);
    const terminal = [[COMMAND.slice(0, Math.max(2, state.command)), THEME.text]];
    if (state.ready) terminal.push(["  VITE v6.3.4  ready in 412 ms", THEME.green], ["  ➜  NeonShooter running on screen 2", THEME.blue]);
    terminal.forEach(([line, color], i) => text(g, line, 486, 924 + i * 36, `400 24px ${MONO}`, color));

    // Status bar in the site's purple -> pink gradient
    const bar = g.createLinearGradient(0, 0, EW, 0);
    bar.addColorStop(0, "#7B61FF");
    bar.addColorStop(1, THEME.pink);
    g.fillStyle = bar;
    g.fillRect(0, EH - 40, EW, 40);
    text(g, "⎇ main    ✓ 0 problems", 24, EH - 12, `400 21px ${SANS}`, "#ffffff");
    text(g, "Spaces: 2    UTF-8    JavaScript JSX", EW - 24, EH - 12, `400 21px ${SANS}`, "#ffffff", "right");
  },
};

// still: visitors who prefer reduced motion see the finished frame
export const createCodeScreen = (fps, still = false) => {
  const screen = createScreen(editorTimeline, fps, EW, EH);
  return { texture: screen.texture, update: (t) => screen.update(still ? FINISHED : t) };
};

// ---------------------------------------------------------------- Screen 2: game

const GW = 1280;
const GH = 548;
const COLS = 8;
const ROWS = 3;
const ENEMY_COLORS = ["#f472b6", "#fb923c", "#a78bfa"];

// 8 x 6 pixel invader, drawn from a bit mask
const INVADER = ["00100100", "00111100", "01111110", "11011011", "11111111", "10100101"];

const newWave = (level) => {
  const enemies = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) enemies.push({ c, r, alive: true });
  }
  return { enemies, level, y: -60, banner: 1.6 };
};

const enemyPos = (wave, e, t) => [GW / 2 + (e.c - (COLS - 1) / 2) * 92 + Math.sin(t * 0.9) * 150, wave.y + 90 + e.r * 62];

export const createGameScreen = (fps, still = false) => {
  const [canvas, g] = makeCanvas(GW, GH);
  const texture = toTexture(canvas);
  const rand = seeded(42);
  const stars = Array.from({ length: 90 }, () => ({ x: rand() * GW, y: rand() * GH, s: 0.3 + rand() * 1.2 }));
  const s = { t: 0, last: null, drawn: -1, player: GW / 2, cooldown: 0, bullets: [], sparks: [], score: 0, wave: newWave(1) };

  const step = (dt) => {
    s.t += dt;
    const { wave } = s;
    wave.y = Math.min(0, wave.y + 60 * dt);
    wave.banner = Math.max(0, wave.banner - dt);
    for (const star of stars) star.y = (star.y + star.s * 60 * dt) % GH;

    // Autopilot: slide under the lowest enemy and keep firing
    const alive = wave.enemies.filter((e) => e.alive);
    const goal = alive.reduce((best, e) => (!best || e.r > best.r || (e.r === best.r && Math.abs(enemyPos(wave, e, s.t)[0] - s.player) < Math.abs(enemyPos(wave, best, s.t)[0] - s.player)) ? e : best), null);
    if (goal) {
      const gx = enemyPos(wave, goal, s.t)[0];
      s.player += Math.max(-520 * dt, Math.min(520 * dt, gx - s.player));
    }
    s.cooldown -= dt;
    if (s.cooldown <= 0 && wave.banner < 0.8) {
      s.bullets.push({ x: s.player, y: GH - 80 });
      s.cooldown = 0.22;
    }

    for (const b of s.bullets) {
      b.y -= 900 * dt;
      for (const e of alive) {
        if (!e.alive || b.dead) continue;
        const [ex, ey] = enemyPos(wave, e, s.t);
        if (Math.abs(b.x - ex) < 28 && Math.abs(b.y - ey) < 22) {
          e.alive = false;
          b.dead = true;
          s.score += 150;
          for (let i = 0; i < 14; i++) {
            const a = rand() * Math.PI * 2;
            const v = 80 + rand() * 220;
            s.sparks.push({ x: ex, y: ey, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5, color: ENEMY_COLORS[e.r] });
          }
        }
      }
    }
    s.bullets = s.bullets.filter((b) => !b.dead && b.y > -20);
    for (const p of s.sparks) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    s.sparks = s.sparks.filter((p) => p.life > 0);
    if (!wave.enemies.some((e) => e.alive)) s.wave = newWave(wave.level + 1);
  };

  const draw = () => {
    const sky = g.createLinearGradient(0, 0, 0, GH);
    sky.addColorStop(0, "#07021a");
    sky.addColorStop(1, "#1e0b45");
    g.fillStyle = sky;
    g.fillRect(0, 0, GW, GH);
    // Neon grid floor scrolling toward the player
    g.strokeStyle = "rgba(168, 85, 247, 0.35)";
    g.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const y = GH - 150 + ((i + (s.t * 1.5) % 1) / 8) ** 2 * 150;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(GW, y);
      g.stroke();
    }
    for (const star of stars) {
      g.fillStyle = `rgba(255,255,255,${0.3 + star.s * 0.4})`;
      g.fillRect(star.x, star.y, star.s * 2, star.s * 2);
    }

    const { wave } = s;
    for (const e of wave.enemies) {
      if (!e.alive) continue;
      const [ex, ey] = enemyPos(wave, e, s.t);
      const frame = Math.floor(s.t * 2) % 2;
      g.fillStyle = ENEMY_COLORS[e.r];
      INVADER.forEach((row, ry) => {
        for (let rx = 0; rx < 8; rx++) {
          const on = row[rx] === "1" || (frame && ry === 5 && (rx === 0 || rx === 7));
          if (on) g.fillRect(ex - 24 + rx * 6, ey - 18 + ry * 6, 6, 6);
        }
      });
    }

    g.fillStyle = "#67e8f9";
    for (const b of s.bullets) g.fillRect(b.x - 2, b.y - 14, 4, 18);
    for (const p of s.sparks) {
      g.globalAlpha = p.life / 0.5;
      g.fillStyle = p.color;
      g.fillRect(p.x - 3, p.y - 3, 6, 6);
    }
    g.globalAlpha = 1;

    // Player ship with a soft glow and engine flame
    const px = s.player;
    const py = GH - 60;
    g.fillStyle = "rgba(34, 211, 238, 0.18)";
    g.beginPath();
    g.arc(px, py, 46, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#22d3ee";
    g.beginPath();
    g.moveTo(px, py - 30);
    g.lineTo(px + 26, py + 18);
    g.lineTo(px, py + 8);
    g.lineTo(px - 26, py + 18);
    g.closePath();
    g.fill();
    g.fillStyle = "#fb923c";
    g.fillRect(px - 4, py + 12, 8, 8 + (Math.floor(s.t * 20) % 3) * 4);

    g.font = `700 26px ${MONO}`;
    g.fillStyle = "#ffffff";
    g.textAlign = "left";
    g.fillText(`SCORE ${String(s.score).padStart(6, "0")}`, 28, 42);
    g.textAlign = "center";
    g.fillText("HI 120000", GW / 2, 42);
    g.textAlign = "right";
    g.fillText(`WAVE ${wave.level}`, GW - 28, 42);
    if (wave.banner > 0) {
      g.font = `800 64px ${SANS}`;
      g.fillStyle = "#f0abfc";
      g.textAlign = "center";
      g.fillText(`WAVE ${wave.level}`, GW / 2, GH / 2 + 20);
    }
    g.textAlign = "left";
    texture.needsUpdate = true;
  };

  return {
    texture,
    update(t) {
      if (s.last === null) {
        // Start mid-fight so the first frame already looks like a game in progress
        for (let i = 0; i < 60; i++) step(1 / 30);
        s.last = t;
        draw();
        return;
      }
      if (still) return;
      const frame = Math.floor(t * fps);
      if (frame === s.drawn) return;
      s.drawn = frame;
      step(Math.min(t - s.last, 0.1));
      s.last = t;
      draw();
    },
  };
};

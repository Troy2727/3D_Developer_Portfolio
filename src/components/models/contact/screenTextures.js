import { makeCanvas, seeded, toTexture } from "../hero_models/studio/surfaceTextures";

// Animated 21:9 screens. Screen 1 types out the code of the game that screen 2 plays.
// update(t) takes the clock time in seconds and redraws at most `fps` times a second.
const MONO = '"JetBrains Mono", Consolas, "Courier New", monospace';
const SANS = '"Mona Sans", "Segoe UI", Arial, sans-serif';

// ---------------------------------------------------------------- Screen 1: editor

const CODE = `// game.js: the neon shooter running on screen 2
const player = { x: W / 2, y: H - 70, speed: 520 };
let enemies = spawnWave(1), score = 0, level = 1;

function update(dt) {
  const goal = lowestEnemy() ?? player;
  player.x += Math.sign(goal.x - player.x) * player.speed * dt;
  if (cooldown.ready(0.22)) bullets.push(shoot(player));

  for (const b of bullets) {
    b.y -= 900 * dt;
    const hit = enemies.find((e) => collide(b, e));
    if (hit) explode(hit), (score += 150);
  }
  if (!enemies.length) enemies = spawnWave(++level);
}

function loop() {
  update(clock.delta());
  draw(ctx, { player, enemies, bullets, score });
  requestAnimationFrame(loop);
}`;

const COLORS = { comment: "#5c6370", string: "#98c379", keyword: "#c678dd", number: "#d19a66", call: "#61afef", text: "#c9d1d9" };
const TOKEN = /(\/\/.*$)|("[^"]*")|\b(const|let|function|for|of|if|return)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*(?=\())|([^]+?)/g;

// Each line becomes a list of [text, color] runs
const LINES = CODE.split("\n").map((line) => {
  const runs = [];
  for (const m of line.matchAll(TOKEN)) {
    const color = m[1] ? COLORS.comment : m[2] ? COLORS.string : m[3] ? COLORS.keyword : m[4] ? COLORS.number : m[5] ? COLORS.call : COLORS.text;
    const last = runs[runs.length - 1];
    if (last && last[1] === color) last[0] += m[0];
    else runs.push([m[0], color]);
  }
  return runs;
});
const TOTAL = LINES.reduce((n, runs) => n + runs.reduce((k, [text]) => k + text.length, 0) + 1, 0);
const CPS = 34; // typed characters per second
const HOLD = 5; // seconds the finished file stays up before it types again
const CYCLE = TOTAL / CPS + HOLD;

const drawEditor = (g, W, H, typed, caretOn) => {
  g.fillStyle = "#0d1117";
  g.fillRect(0, 0, W, H);

  g.fillStyle = "#010409";
  g.fillRect(0, 0, 320, H);
  g.font = `500 24px ${SANS}`;
  ["src", "  game", "    game.js", "    draw.js", "    waves.js", "  main.js", "index.html", "package.json"].forEach((name, i) => {
    if (i === 2) {
      g.fillStyle = "#1f2937";
      g.fillRect(0, 92 + i * 44 - 31, 320, 44);
    }
    g.fillStyle = i === 2 ? "#e6edf3" : "#7d8590";
    g.fillText(name, 28, 92 + i * 44);
  });

  g.fillStyle = "#161b22";
  g.fillRect(320, 0, W - 320, 58);
  g.fillStyle = "#0d1117";
  g.fillRect(320, 0, 240, 58);
  g.fillStyle = "#3b82f6";
  g.fillRect(320, 0, 240, 4);
  g.fillStyle = "#e6edf3";
  g.fillText("game.js", 356, 38);

  g.font = `400 29px ${MONO}`;
  let left = typed;
  let caret = null;
  LINES.forEach((runs, i) => {
    if (left < 0) return;
    const y = 104 + i * 33;
    g.fillStyle = COLORS.comment;
    g.textAlign = "right";
    g.fillText(String(i + 1), 400, y);
    g.textAlign = "left";
    let x = 430;
    for (const [text, color] of runs) {
      const shown = text.slice(0, Math.max(0, left));
      left -= text.length;
      g.fillStyle = color;
      g.fillText(shown, x, y);
      x += g.measureText(shown).width;
      if (left < 0) break;
    }
    caret = [x, y];
    left -= 1; // newline
  });
  if (caret && caretOn) {
    g.fillStyle = "#e6edf3";
    g.fillRect(caret[0] + 2, caret[1] - 25, 3, 32);
  }

  g.fillStyle = "#3b82f6";
  g.fillRect(0, H - 36, W, 36);
  g.fillStyle = "#ffffff";
  g.font = `500 20px ${SANS}`;
  g.fillText(typed >= TOTAL ? "main   ✓ saved · running on screen 2" : "main   ● typing…", 22, H - 11);
};

export const createCodeScreen = (fps, still = false) => {
  const W = 2048;
  const H = 868;
  const [canvas, g] = makeCanvas(W, H);
  const texture = toTexture(canvas);
  let shown = null;
  return {
    texture,
    update(t) {
      t = Math.floor(t * fps) / fps;
      const cycleT = still ? CYCLE - 0.01 : t % CYCLE;
      const typed = Math.min(TOTAL, Math.floor(cycleT * CPS));
      const caretOn = typed < TOTAL || Math.floor(t * 2) % 2 === 0;
      const key = typed * 2 + (caretOn ? 1 : 0);
      if (key === shown) return;
      shown = key;
      drawEditor(g, W, H, typed, caretOn);
      texture.needsUpdate = true;
    },
  };
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

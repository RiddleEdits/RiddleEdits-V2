import * as THREE from 'three';

const MONO = '"Geist Mono Variable", ui-monospace, Menlo, monospace';

const hash = (n: number) => {
  const s = Math.sin(n * 91.7 + 17.3) * 24634.6345;
  return s - Math.floor(s);
};

/* ---------- drawn frames, used until (or instead of) real thumbnails ---------- */

const SCENES = [
  { sky: ['#5aa9ff', '#d8efff'], hill: '#4caf3f', dirt: '#86552f', shirt: '#2f6bff' }, // overworld day
  { sky: ['#0d1638', '#3b2a86'], hill: '#1e3263', dirt: '#0b1530', shirt: '#22d3ee' }, // night
  { sky: ['#ff8a5c', '#ffd7a8'], hill: '#7a56c4', dirt: '#3a2670', shirt: '#ff4f8b' }, // sunset
  { sky: ['#1b2333', '#2c3a55'], hill: '#3a4a66', dirt: '#141b29', shirt: '#7c9cff' }, // tech desk
];

export function drawFrameScene(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) {
  const s = SCENES[seed % SCENES.length];
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, s.sky[0]);
  g.addColorStop(1, s.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  if (seed % SCENES.length === 3) {
    // a PC on a desk with RGB
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(x + w * 0.55, y + h * 0.18, w * 0.26, h * 0.62);
    const rgb = ctx.createLinearGradient(x + w * 0.55, 0, x + w * 0.81, 0);
    rgb.addColorStop(0, '#ff3d8b');
    rgb.addColorStop(0.5, '#7c5cff');
    rgb.addColorStop(1, '#22d3ee');
    ctx.fillStyle = rgb;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + w * 0.68, y + h * (0.32 + i * 0.16), h * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#2a3550';
    ctx.fillRect(x, y + h * 0.8, w, h * 0.2);
    ctx.fillStyle = '#e8eefc';
    ctx.fillRect(x + w * 0.12, y + h * 0.3, w * 0.34, h * 0.36);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(x + w * (0.1 + hash(seed) * 0.5), y + h * 0.16, w * 0.2, h * 0.07);
    const gy = y + h * 0.66;
    ctx.fillStyle = s.hill;
    for (let i = 0; i < 6; i++) ctx.fillRect(x + (i * w) / 6, gy - hash(seed * 7 + i) * h * 0.2, w / 6 + 1, h);
    ctx.fillStyle = s.dirt;
    ctx.fillRect(x, gy + h * 0.1, w, h);
    const px = x + w * (0.3 + hash(seed + 3) * 0.4);
    ctx.fillStyle = '#2b3350';
    ctx.fillRect(px - 5, gy - 14, 4, 14);
    ctx.fillRect(px + 1, gy - 14, 4, 14);
    ctx.fillStyle = s.shirt;
    ctx.fillRect(px - 7, gy - 34, 14, 22);
    ctx.fillStyle = '#f0c9a0';
    ctx.fillRect(px - 6, gy - 48, 12, 13);
  }
  ctx.restore();
}

/* ---------- the film strip: sprockets, timecodes, frames and an optical soundtrack ---------- */

export const FILM_W = 1280;
export const FILM_H = 300;
const SLOTS = 4;

function frameRect(i: number) {
  const slot = FILM_W / SLOTS;
  return { x: i * slot + 14, y: 52, w: slot - 28, h: 164 };
}

export interface Film {
  texture: THREE.CanvasTexture;
  setThumb: (slot: number, img: HTMLImageElement) => void;
}

export function createFilm(seed = 0): Film {
  const canvas = document.createElement('canvas');
  canvas.width = FILM_W;
  canvas.height = FILM_H;
  const ctx = canvas.getContext('2d')!;

  const g = ctx.createLinearGradient(0, 0, 0, FILM_H);
  g.addColorStop(0, '#3a6dff');
  g.addColorStop(0.5, '#1d4ff0');
  g.addColorStop(1, '#3a6dff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, FILM_W, FILM_H);

  // sprocket holes are cut out so the page shows through
  ctx.globalCompositeOperation = 'destination-out';
  for (let x = 10; x < FILM_W; x += 32) {
    ctx.beginPath();
    ctx.roundRect(x, 10, 18, 15, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(x, FILM_H - 25, 18, 15, 4);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  for (let i = 0; i < SLOTS; i++) {
    const r = frameRect(i);
    // timecode above each frame
    const sec = (seed * 4 + i) * 7 + 12;
    const tc = `00:0${Math.floor(sec / 60) % 10}:${String(sec % 60).padStart(2, '0')}:${String((i * 7 + seed * 3) % 24).padStart(2, '0')}`;
    ctx.font = `500 15px ${MONO}`;
    ctx.fillStyle = 'rgba(225,235,255,0.85)';
    ctx.textBaseline = 'middle';
    ctx.fillText(tc, r.x + 2, 40);
    ctx.fillStyle = 'rgba(225,235,255,0.5)';
    ctx.fillText(`V1 · ${String(i + 1 + seed * 4).padStart(3, '0')}`, r.x + r.w - 82, 40);

    ctx.fillStyle = 'rgba(205,222,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(r.x - 2, r.y - 2, r.w + 4, r.h + 4, 8);
    ctx.fill();
    drawFrameScene(ctx, r.x, r.y, r.w, r.h, i + seed);
  }

  // optical soundtrack: a mirrored waveform running under the frames
  const cy = 244;
  ctx.fillStyle = 'rgba(220,232,255,0.75)';
  for (let x = 14; x < FILM_W - 14; x += 4) {
    const env = 0.35 + 0.65 * Math.abs(Math.sin(x * 0.011 + seed));
    const a = (0.25 + 0.75 * hash(x * 0.37 + seed)) * env * 15;
    ctx.fillRect(x, cy - a, 2, a * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;

  return {
    texture,
    setThumb(slot, img) {
      const r = frameRect(slot % SLOTS);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(r.x, r.y, r.w, r.h, 6);
      ctx.clip();
      const k = Math.max(r.w / img.naturalWidth, r.h / img.naturalHeight);
      const dw = img.naturalWidth * k;
      const dh = img.naturalHeight * k;
      ctx.drawImage(img, r.x + (r.w - dw) / 2, r.y + (r.h - dh) / 2, dw, dh);
      ctx.restore();
      texture.needsUpdate = true;
    },
  };
}

/** Load thumbnails for the strip. If the image host blocks CORS, the drawn frames stay. */
export function loadThumbs(urls: string[], onLoad: (slot: number, img: HTMLImageElement) => void) {
  urls.forEach((url, i) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (img.naturalWidth > 200) onLoad(i, img);
    };
    img.src = url;
  });
}

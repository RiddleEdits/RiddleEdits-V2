import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { CASE_STUDIES, caseStats, compact, creator } from '../data/content';
import { Link } from '../router';

/* ============================================================
   The milestones are the only numbers not pulled from content.ts.
   Only put in numbers you can prove (from the creator's YouTube Studio).
   ============================================================ */
const STUDY = CASE_STUDIES[0];
const STUDY_STATS = caseStats(STUDY);
const DOODLE = creator(STUDY.creatorId);
const CASE = {
  videoId: STUDY_STATS.vids[0].id,
  videoTitle: STUDY_STATS.vids[0].title,
  length: STUDY_STATS.vids[0].length,
  footage: STUDY.videoIds, // thumbnails floating on the top timeline
  creator: DOODLE.name,
  subs: `${DOODLE.subs} subscribers`,
  avatar: DOODLE.avatar,
  tag: 'GTA case study',
  headline: ['How I turned multi-hour', 'chaotic GTA gameplay into', 'a story people finish'], // last line is blue
  body: STUDY.summary,
  milestones: [
    { t: 'Month 1', s: '900K views', p: 'Hooks, faster pacing and cinematic SFX from the first edit.' },
    { t: 'Month 2', s: '2M views', p: 'Views more than doubled as the story-first edits landed.' },
    { t: 'Month 3', s: '1.1M views in 15 days', p: 'Already past 1M, halfway through the month.' },
  ],
  stats: [
    { icon: 'users', label: 'Subscribers', value: DOODLE.subs },
    { icon: 'bars', label: 'Videos on this site', value: String(STUDY.videoIds.length) },
    { icon: 'eye', label: 'Their views', value: compact(STUDY_STATS.views) },
  ],
};

/* ---------------- styles (all prefixed with gcs- so they never clash with your site) ---------------- */
const CSS = `
.gcs { --ink:#0b1020; --muted:#5b6478; --faint:#7d869a; --blue:#0066ff; --line:rgba(11,16,32,.07);
  position:relative; overflow:hidden; padding:96px 20px 112px; background:#f5f8ff; color:var(--ink);
  -webkit-font-smoothing:antialiased; }
.gcs *, .gcs *::before, .gcs *::after { box-sizing:border-box; margin:0; padding:0; }
.gcs a { color:inherit; text-decoration:none; }
.gcs button { font:inherit; border:0; background:none; cursor:pointer; color:inherit; }
.gcs::before { content:""; position:absolute; inset:0; pointer-events:none;
  background-image:linear-gradient(rgba(0,102,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,.06) 1px, transparent 1px);
  background-size:84px 84px; }
.gcs::after { content:""; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(22% 30% at 92% 6%, rgba(0,102,255,.20), transparent 70%),
             radial-gradient(18% 26% at 2% 74%, rgba(0,102,255,.16), transparent 70%),
             radial-gradient(18% 26% at 99% 72%, rgba(0,102,255,.12), transparent 70%); }

.gcs-case { position:relative; z-index:1; max-width:1120px; margin:0 auto;
  opacity:0; transform:translateY(20px); transition:opacity .9s cubic-bezier(.2,.8,.2,1), transform .9s cubic-bezier(.2,.8,.2,1); }
.gcs-case.in { opacity:1; transform:none; }
.gcs-card { position:relative; border-radius:28px; padding:24px 24px 22px 26px;
  background:linear-gradient(180deg, rgba(255,255,255,.96), rgba(244,248,255,.96));
  box-shadow:inset 0 1.5px 0 #fff, inset 0 0 0 1px rgba(255,255,255,.9), 0 2px 6px rgba(15,30,80,.04), 0 28px 56px -26px rgba(31,80,200,.26); }

.gcs-strip { position:absolute; left:4%; right:4%; top:-106px; height:118px; pointer-events:none; }
.gcs-strip svg { display:block; width:100%; height:100%; overflow:visible; }

/* Timeline (scaled up slightly) */
.gcs-miles { position:relative; height:168px; margin:0 -22px 0 -26px; }
.gcs-curve { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.gcs-mile { position:absolute; top:2px; width:20%; min-width:200px; display:flex; gap:12px; padding:13px 14px 15px; border-radius:16px;
  background:#fff; box-shadow:inset 0 0 0 1px var(--line), 0 13px 26px -18px rgba(31,80,200,.3);
  transition:transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .45s; }
.gcs-mile.on { transform:translateY(-4px); box-shadow:inset 0 0 0 1.5px rgba(0,102,255,.35), 0 18px 32px -16px rgba(0,102,255,.45); }
.gcs-mile .gcs-ic { display:grid; place-items:center; width:38px; height:38px; border-radius:10px; flex:none; color:#fff;
  background:#0066ff; box-shadow:0 6px 14px -6px rgba(0,102,255,.75); }
.gcs-mile .gcs-ic svg { width:18px; height:18px; }
.gcs-mile h4 { font-size:14px; font-weight:700; letter-spacing:-.2px; }
.gcs-mile em { display:block; font-style:normal; font-size:15.5px; font-weight:800; color:var(--blue); margin-top:1px; letter-spacing:-.3px; }
.gcs-mile p { margin-top:5px; font-size:11.8px; line-height:1.42; color:var(--muted); }
.gcs-m0 { left:8.2%; } .gcs-m1 { left:40.5%; } .gcs-m2 { left:72%; top:-4px; }

/* GTA Case (proportional slight increase) */
.gcs-body { display:grid; grid-template-columns:minmax(270px, 390px) 1fr; gap:26px; max-width:920px; margin:16px auto 0; width:100%; align-items:start; }
.gcs-col-left { width:100%; min-width:0; }
.gcs-player { position:relative; width:100%; padding-top:56.25%; border-radius:14px; overflow:hidden;
  background:#0b1020; box-shadow:0 18px 36px -18px rgba(20,40,120,.42);
  cursor:pointer; }
.gcs-player.is-playing { cursor:default; }
.gcs-player img, .gcs-player iframe { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; border:0; }
.gcs-player iframe { pointer-events:auto; }
.gcs-fb { position:absolute; inset:0; width:100%; height:100%; display:flex; align-items:flex-end; padding:14px 18px; background:linear-gradient(transparent, rgba(10,20,60,.75));
  color:#fff; font-weight:800; font-size:clamp(14px, 1.45vw, 19px); letter-spacing:-.5px; text-shadow:0 2px 14px rgba(0,0,0,.25); pointer-events:none; }
.gcs-play { position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%;
  background:rgba(255,255,255,.85); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.6); box-shadow:0 6px 16px rgba(10,20,60,.18);
  transition:transform .25s ease, background .25s ease; pointer-events:none; z-index:10; }
.gcs-player:hover .gcs-play { transform:translate(-50%, -50%) scale(1.08); background:#ffffff; }
.gcs-play svg { width:16px; height:16px; margin-left:2px; display:block; fill:#0066ff; stroke:#0066ff; }
.gcs-len { position:absolute; right:9px; bottom:9px; padding:3px 7px; border-radius:6px; background:rgba(10,12,18,.82); color:#fff; font-weight:700; font-size:12px; pointer-events:none; z-index:5; }
.gcs-who { display:flex; align-items:center; gap:10px; margin-top:12px; }
.gcs-av { width:42px; height:42px; border-radius:50%; object-fit:cover; flex:none; box-shadow:0 4px 10px -3px rgba(10,20,60,.28); }
.gcs-ini { display:grid; place-items:center; color:#fff; font-weight:800; font-size:16px; background:linear-gradient(160deg, #4ade80, #16a34a); }
.gcs-who b { display:flex; align-items:center; gap:5px; font-size:14.5px; font-weight:700; color:var(--ink); }
.gcs-who small { display:block; margin-top:1px; font-size:12px; color:var(--faint); }

.gcs-copy { display:flex; flex-direction:column; }
.gcs-tag { align-self:flex-start; display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; font-size:11.5px; font-weight:700;
  color:var(--blue); background:#eaf1ff; }
.gcs-tag::before { content:""; width:4px; height:4px; border-radius:50%; background:var(--blue); }
.gcs-copy h3 { margin-top:11px; font-size:clamp(17px, 1.5vw, 21.5px); line-height:1.22; letter-spacing:-.6px; font-weight:800; color:var(--ink); }
.gcs-copy h3 em { font-style:normal; color:var(--blue); }
.gcs-copy > p { margin-top:9px; font-size:13px; line-height:1.52; color:var(--muted); }
.gcs-stats { margin-top:13px; display:grid; grid-template-columns:repeat(3, 1fr); border-radius:13px; background:#fff;
  box-shadow:inset 0 0 0 1px var(--line), 0 7px 18px -14px rgba(31,80,200,.18); }
.gcs-stat { display:flex; gap:9px; padding:9px 9px; }
.gcs-stat + .gcs-stat { border-left:1px solid var(--line); }
.gcs-stat .gcs-sic { display:grid; place-items:center; width:28px; height:28px; border-radius:7px; background:#eef3ff; color:var(--blue); flex:none; }
.gcs-stat .gcs-sic svg { width:15px; height:15px; }
.gcs-stat small { display:block; font-size:11px; color:var(--faint); font-weight:500; }
.gcs-stat b { display:block; margin-top:2px; font-size:13.5px; letter-spacing:-.2px; color:var(--blue); font-weight:800; white-space:nowrap; }
.gcs-stat b i { font-style:normal; opacity:.85; font-weight:600; margin:0 2px; }
.gcs-cta { margin-top:auto; padding-top:13px; align-self:flex-end; }
.gcs-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 22px; border-radius:999px; font-size:14px; font-weight:700; color:#fff !important;
  background:#0066ff; box-shadow:0 6px 16px -6px rgba(0,102,255,.55);
  transition:transform .25s, box-shadow .25s; }
.gcs-btn:hover { background:#0052cc; }
.gcs-head { position:relative; z-index:1; max-width:1136px; margin:0 auto 150px; }

@media (max-width:1100px) {
  .gcs-miles { height:auto; margin:0; display:grid; gap:14px; }
  .gcs-curve { display:none; }
  .gcs-mile { position:static; width:auto; min-width:0; }
  .gcs-body { grid-template-columns:1fr; }
  .gcs-cta { align-self:flex-start; }
}
@media (max-width:620px) {
  .gcs { padding:80px 14px 80px; }
  .gcs-head { padding:0 6px; margin-bottom:140px; }
  .gcs-card { padding:22px 16px; border-radius:30px; }
  .gcs-strip { top:-104px; height:116px; left:0; right:0; }
  .gcs-stats { grid-template-columns:1fr; }
  .gcs-stat + .gcs-stat { border-left:0; border-top:1px solid var(--line); }
  .gcs-play { width:52px; height:52px; }
  .gcs-play svg { width:18px; height:18px; margin-left:2px; }
  .gcs-btn { padding:15px 26px; font-size:16px; }
}
@media (prefers-reduced-motion:reduce) { .gcs-case { opacity:1; transform:none; transition:none; } .gcs-mile { transition:none; } }
`;

/* ---------------- icons ---------------- */
const MILE_ICONS = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /><path d="M12 1v1M4 4l.7.7M20 4l-.7.7M1 11h1M22 11h1" /></svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="12" rx="1" /><rect x="16" y="4" width="4" height="16" rx="1" /></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5Z" /><path d="M5 21h14" /></svg>,
];
const STAT_ICONS: Record<string, ReactElement> = {
  eye: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5Z" /><circle cx="17" cy="8.5" r="2.8" opacity=".75" /><path d="M15.5 13.6c3.6-.4 6.5 2 6.5 5.9h-4.4c0-2.4-.8-4.4-2.1-5.9Z" opacity=".75" /></svg>,
  bars: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="12" rx="1" /><rect x="16" y="4" width="4" height="16" rx="1" /></svg>,
};

/* ---------------- helpers ---------------- */
const NS = 'http://www.w3.org/2000/svg';
function mk(tag: string, a: Record<string, string | number>, p?: Element) {
  const n = document.createElementNS(NS, tag);
  for (const k in a) n.setAttribute(k, String(a[k]));
  if (p) p.appendChild(n);
  return n as SVGElement;
}
const mod = (a: number, n: number) => ((a % n) + n) % n;

/* ---------------- component ---------------- */
export function GtaCaseStudy({ heading }: { heading?: ReactNode }) {
  const caseRef = useRef<HTMLElement>(null);
  const stripRef = useRef<SVGSVGElement>(null);
  const curveSvgRef = useRef<SVGSVGElement>(null);
  const curveRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const mileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shown, setShown] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState<'max' | 'hq' | 'none'>('max');
  const [avatarOk, setAvatarOk] = useState(true);
  const [milestoneTexts, setMilestoneTexts] = useState<string[]>([
    CASE.milestones[0].s,
    CASE.milestones[1].s,
    CASE.milestones[2].s
  ]);

  // Count up numbers from 0 when each card lights up (step === i)
  useEffect(() => {
    if (!shown) return;
    const duration = 850;
    const start = performance.now();
    let rafId = 0;

    const animate = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / duration);
      // easeOutCubic
      const progress = 1 - Math.pow(1 - raw, 3);

      let text = CASE.milestones[step]?.s || '';
      if (step === 0) {
        text = `${Math.round(progress * 900)}K views`;
      } else if (step === 1) {
        const v = progress * 2;
        text = `${v >= 1.95 ? '2M' : v.toFixed(1) + 'M'} views`;
      } else if (step === 2) {
        const v = progress * 1.1;
        text = `${v >= 1.05 ? '1.1M' : v.toFixed(1) + 'M'} views in 15 days`;
      }

      setMilestoneTexts((prev) => {
        const next = [...prev];
        next[step] = text;
        return next;
      });

      if (raw < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [step, shown]);

  // reveal on scroll
  useEffect(() => {
    const el = caseRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // dots on the curve, centred under each milestone
  useEffect(() => {
    const svg = curveSvgRef.current, curve = curveRef.current, dotsG = dotsRef.current;
    if (!svg || !curve || !dotsG) return;
    const place = () => {
      dotsG.innerHTML = '';
      const box = svg.getBoundingClientRect();
      if (!box.width) return;
      const L = curve.getTotalLength();
      const sx = box.width / 1450, sy = box.height / 200;
      mileRefs.current.forEach((m) => {
        if (!m) return;
        const r = m.getBoundingClientRect();
        const cx = ((r.left + r.width / 2) - box.left) / sx;
        let lo = 0, hi = L;
        for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (curve.getPointAtLength(mid).x < cx) lo = mid; else hi = mid; }
        const p = curve.getPointAtLength(lo);
        const g = mk('g', { transform: `translate(${p.x} ${p.y})` }, dotsG);
        mk('line', { x1: 0, y1: 0, x2: 0, y2: (r.bottom - box.top) / sy - p.y, stroke: '#0066ff', 'stroke-opacity': 0.25, 'stroke-width': 2, 'stroke-dasharray': '3 4', 'vector-effect': 'non-scaling-stroke' }, g);
        mk('ellipse', { rx: 13 / sx, ry: 13 / sy, fill: '#fff', stroke: '#0066ff', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, g);
        mk('ellipse', { rx: 5.5 / sx, ry: 5.5 / sy, fill: '#0066ff' }, g);
      });
    };
    const ro = new ResizeObserver(place);
    ro.observe(svg);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, []);

  // top timeline strip + milestone cycling (one loop, runs forever, pauses off-screen)
  useEffect(() => {
    const svg = stripRef.current;
    if (!svg) return;
    svg.innerHTML = '';
    const W = 1320;
    const defs = mk('defs', {}, svg);
    const grad = (id: string, a: string, b: string) => {
      const g = mk('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      mk('stop', { offset: 0, 'stop-color': a }, g);
      mk('stop', { offset: 1, 'stop-color': b }, g);
    };
    grad('gcs-c', '#6be6ff', '#20b9ee'); grad('gcs-p', '#ff7fae', '#f0306f'); grad('gcs-g', '#5ef08e', '#1fbe56');
    grad('gcs-o', '#ffcc6b', '#f7a13a'); grad('gcs-r', '#ff6b6b', '#ef3b3b');
    const glow = mk('filter', { id: 'gcs-glow', x: '-20%', y: '-60%', width: '140%', height: '220%' }, defs);
    mk('feDropShadow', { dx: 0, dy: 6, stdDeviation: 7, 'flood-color': '#0066ff', 'flood-opacity': 0.28 }, glow);
    const edge = mk('linearGradient', { id: 'gcs-edge', x1: 0, x2: 1 }, defs);
    ([[0, 0], [0.07, 1], [0.93, 1], [1, 0]] as const).forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': a }, edge));
    const mask = mk('mask', { id: 'gcs-mask', maskUnits: 'userSpaceOnUse', x: 0, y: -40, width: W, height: 220 }, defs);
    mk('rect', { x: 0, y: -40, width: W, height: 220, fill: 'url(#gcs-edge)' }, mask);
    const layer = mk('g', { mask: 'url(#gcs-mask)', filter: 'url(#gcs-glow)' }, svg);

    const CLIPS: [number, number, number, number, string][] = [
      [230, 64, 58, 22, 'c'], [222, 90, 104, 24, 'p'], [290, 118, 162, 32, 'c'], [458, 112, 190, 38, 'g'],
      [654, 112, 186, 38, 'g'], [850, 80, 58, 24, 'p'], [868, 122, 452, 34, 'o'], [1100, 116, 140, 18, 'r'],
      [40, 120, 160, 30, 'g'], [1250, 70, 60, 22, 'c'],
    ];
    const TILES: [number, number, number, number, number][] = [
      [10, 30, 196, 118, -4], [330, 44, 134, 78, 0], [516, 54, 90, 62, 0], [668, 46, 76, 56, 0], [752, 42, 90, 60, 0], [930, 54, 146, 86, 3], [1090, 64, 128, 64, 4],
    ];
    const items: { g: SVGElement; x: number; tile?: boolean; i?: number }[] = [];
    const build = (dx: number) => {
      CLIPS.forEach(([x, y, w, h, f], i) => {
        const g = mk('g', {}, layer);
        mk('rect', { x: 0, y, width: w, height: h, rx: Math.min(10, h / 2.2), fill: `url(#gcs-${f})`, opacity: 0.92 }, g);
        mk('rect', { x: 5, y: y + 2, width: Math.max(0, w - 10), height: 1.4, rx: 0.7, fill: '#fff', opacity: 0.6 }, g);
        for (let k = 8; k < w - 6; k += 4) {
          const a = Math.abs(Math.sin((k + i * 37) * 0.19) * Math.sin((k + i * 37) * 0.043)) * 0.85 + 0.15;
          const hh = Math.max(2, a * (h - 10));
          mk('rect', { x: k, y: y + h / 2 - hh / 2, width: 1.6, height: hh, rx: 0.8, fill: '#fff', opacity: 0.55 }, g);
        }
        items.push({ g, x: x + dx });
      });
      TILES.forEach(([x, y, w, h, rot], i) => {
        const g = mk('g', {}, layer);
        const inner = mk('g', { transform: `rotate(${rot} ${w / 2} ${y + h / 2})` }, g);
        const id = `gcs-t${dx}-${i}`;
        const cp = mk('clipPath', { id }, defs);
        mk('rect', { x: 0, y, width: w, height: h, rx: 10 }, cp);
        mk('rect', { x: -3, y: y - 3, width: w + 6, height: h + 6, rx: 12, fill: i === 0 ? '#0066ff' : '#fff' }, inner);
        mk('rect', { x: 0, y, width: w, height: h, rx: 10, fill: `url(#gcs-${'cgpo'[i % 4]})` }, inner);
        const vid = CASE.footage[i % CASE.footage.length];
        const im = mk('image', { href: `https://i.ytimg.com/vi/${vid}/mqdefault.jpg`, x: 0, y, width: w, height: h, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${id})` }, inner);
        im.addEventListener('error', () => im.remove());
        items.push({ g, x: x + dx, tile: true, i });
      });
    };
    build(0);
    build(W);
    const ph = mk('g', { transform: `translate(${W / 2 - 40} 0)` }, svg);
    mk('rect', { x: -2, y: 18, width: 4, height: 150, rx: 2, fill: '#0066ff' }, ph);
    mk('path', { d: 'M-14 0 h28 l-14 22Z', fill: '#0066ff' }, ph);

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (caseRef.current) io.observe(caseRef.current);
    const t0 = performance.now();
    let raf = 0, lastStep = -1;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const t = reduced ? 0 : (now - t0) / 1000;
      const off = t * 38;
      for (const it of items) {
        const x = mod(it.x - off + 220, 2 * W) - 220;
        const bob = it.tile ? Math.sin(t * 1.3 + (it.i ?? 0)) * 2.5 : 0;
        it.g.setAttribute('transform', `translate(${x.toFixed(1)} ${bob.toFixed(1)})`);
      }
      const s = Math.floor(t / 3) % CASE.milestones.length;
      if (s !== lastStep) { lastStep = s; setStep(s); }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const thumbSrc = `https://i.ytimg.com/vi/${CASE.videoId}/${thumb === 'max' ? 'maxresdefault' : 'hqdefault'}.jpg`;

  return (
    <section className="gcs">
      <style>{CSS}</style>
      {heading && <div className="gcs-head">{heading}</div>}
      <article ref={caseRef} className={`gcs-case ${shown ? 'in' : ''}`}>
        <div className="gcs-card">
          <div className="gcs-strip" aria-hidden="true">
            <svg ref={stripRef} viewBox="0 0 1320 160" preserveAspectRatio="xMidYMax meet" />
          </div>

          {/* milestones on a curved line */}
          <div className="gcs-miles">
            <svg ref={curveSvgRef} className="gcs-curve" viewBox="0 0 1450 200" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="gcs-cg" x1="0" x2="1">
                  <stop offset="0" stopColor="#0066ff" stopOpacity="0" />
                  <stop offset=".12" stopColor="#0066ff" stopOpacity=".75" />
                  <stop offset="1" stopColor="#0066ff" />
                </linearGradient>
              </defs>
              <path ref={curveRef} d="M40 188 C 220 186, 460 166, 730 150 S 1120 126, 1260 110 S 1360 80, 1396 62" fill="none" stroke="url(#gcs-cg)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d="M1370 68 L1398 60 L1392 88" fill="none" stroke="#0066ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <g ref={dotsRef} />
            </svg>
            {CASE.milestones.map((m, i) => (
              <div key={i} ref={(el) => { mileRefs.current[i] = el; }} className={`gcs-mile gcs-m${i} ${step === i ? 'on' : ''}`}>
                <span className="gcs-ic">{MILE_ICONS[i % MILE_ICONS.length]}</span>
                <div>
                  <h4>{m.t}</h4>
                  <em>{milestoneTexts[i] ?? m.s}</em>
                  <p>{m.p}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="gcs-body">
            <div className="gcs-col-left" style={{ width: '100%', minWidth: 0 }}>
              <div
                className={`gcs-player ${playing ? 'is-playing' : ''}`}
                role={playing ? undefined : 'button'}
                tabIndex={playing ? undefined : 0}
                aria-label={playing ? undefined : `Play ${CASE.videoTitle}`}
                onClick={() => !playing && setPlaying(true)}
                onKeyDown={(e) => { if (!playing && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setPlaying(true); } }}
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#0b1020',
                  boxShadow: '0 30px 60px -30px rgba(20,40,120,.55)'
                }}
              >
                {playing ? (
                  <iframe
                    title={CASE.videoTitle}
                    src={`https://www.youtube-nocookie.com/embed/${CASE.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                  />
                ) : (
                  <>
                    {thumb !== 'none' ? (
                      <img
                        src={thumbSrc}
                        alt={CASE.videoTitle}
                        referrerPolicy="no-referrer"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onLoad={(e) => { if (thumb === 'max' && e.currentTarget.naturalWidth < 200) setThumb('hq'); }}
                        onError={() => setThumb(thumb === 'max' ? 'hq' : 'none')}
                      />
                    ) : (
                      <span className="gcs-fb">{CASE.videoTitle}</span>
                    )}
                    <span className="gcs-play" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0066ff" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    </span>
                    {CASE.length && <span className="gcs-len">{CASE.length}</span>}
                  </>
                )}
              </div>
              <div className="gcs-who" style={{ marginTop: '18px' }}>
                {avatarOk ? (
                  <img className="gcs-av" src={CASE.avatar} alt="" onError={() => setAvatarOk(false)} />
                ) : (
                  <span className="gcs-av gcs-ini">{CASE.creator[0]}</span>
                )}
                <div>
                  <b>
                    {CASE.creator}
                  </b>
                  <small>{CASE.subs}</small>
                </div>
              </div>
            </div>

            <div className="gcs-copy">
              <span className="gcs-tag">{CASE.tag}</span>
              <h3>
                {CASE.headline.map((line, i) =>
                  i === CASE.headline.length - 1 ? <em key={i}>{line}</em> : <span key={i}>{line}<br /></span>,
                )}
              </h3>
              <p>{CASE.body}</p>
              <div className="gcs-stats">
                {CASE.stats.map((s) => {
                  const parts = s.value.split('→').map((x) => x.trim());
                  return (
                    <div key={s.label} className="gcs-stat">
                      <span className="gcs-sic">{STAT_ICONS[s.icon] ?? STAT_ICONS.bars}</span>
                      <div>
                        <small>{s.label}</small>
                        <b>{parts.length === 2 ? <>{parts[0]}<i>→</i>{parts[1]}</> : s.value}</b>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="gcs-cta">
                <Link href={`/case-studies#${STUDY.slug}`} className="gcs-btn">
                  View case study
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

import { useEffect, useRef } from 'react';

/**
 * Looping SVG editing timeline with hand-written notes.
 * Drop it in the empty right column of the hero:  <TimelineLayers className="w-full" />
 */

const CSS = `
.tl-svg { display: block; width: 100%; height: auto; overflow: visible; outline: none !important; }
.tl-svg * { outline: none !important; }
.tl-svg .eq { transform-box: fill-box; transform-origin: center; animation: tl-eq .9s ease-in-out infinite alternate; }
@keyframes tl-eq { from { transform: scaleY(.3); } to { transform: scaleY(1); } }
.tl-svg .pulse { transform-box: fill-box; transform-origin: center; animation: tl-pulse 1.8s ease-out infinite; }
@keyframes tl-pulse { 0% { transform: scale(.6); opacity: .55; } 100% { transform: scale(2.2); opacity: 0; } }

.tl-svg .note { font-family: "Caveat", "Segoe Print", cursive; font-weight: 700; fill: #0b1020; }
.tl-svg .ltr { opacity: 0; transform-box: fill-box; transform-origin: 50% 100%;
  animation: tl-ltr .55s cubic-bezier(.3,1.7,.5,1) forwards, tl-wave 2.6s ease-in-out infinite; }
@keyframes tl-ltr { 0% { opacity: 0; transform: translateY(12px) rotate(-14deg) scale(.5); } 100% { opacity: 1; transform: none; } }
@keyframes tl-wave { 0%, 100% { opacity: 1; transform: translateY(0) rotate(0); } 50% { opacity: 1; transform: translateY(-3px) rotate(-3deg); } }

.tl-svg .arrow { fill: none; stroke: #0b1020; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.tl-svg .arrow.armed { stroke-dashoffset: 1; }
.tl-svg .arrow.armed.go { animation: tl-draw .7s cubic-bezier(.6,.1,.3,1) forwards; }
.tl-svg .arrow.head.armed.go { animation-duration: .28s; animation-timing-function: ease-out; }
@keyframes tl-draw { to { stroke-dashoffset: 0; } }
.tl-svg .arrow-g { transform-box: fill-box; }
.tl-svg .arrow-g.go { animation: tl-nudge 1.5s ease-in-out infinite; }
@keyframes tl-nudge { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(var(--nx), var(--ny)); } }

@media (prefers-reduced-motion: reduce) {
  .tl-svg .eq, .tl-svg .pulse, .tl-svg .ltr, .tl-svg .arrow.armed, .tl-svg .arrow-g.go { animation: none; opacity: 1; stroke-dashoffset: 0; }
}
`;

/* ---------------- settings ---------------- */

const PH = 310; // playhead x (centre of the 620-wide view)
const SPEED = 64; // px per second
const LOOP = 900; // pattern length (one loop ≈ 14 s)
const LEAD = 260; // longer than any clip, so a clip only wraps once it is fully off-screen
const H = 44; // layer height

type Kind = 'unfold' | 'cut' | 'drop' | undefined;
const LAYERS: { id: string; color: string; y: number; clips: [number, number, Kind?][] }[] = [
  { id: 'fx', color: '#0aa5d6', y: 118, clips: [[0, 130, 'unfold'], [170, 90], [300, 160, 'unfold'], [520, 120], [690, 150, 'unfold']] },
  { id: 'shot', color: '#e8175f', y: 172, clips: [[0, 150], [156, 110], [272, 230, 'cut'], [508, 140], [654, 120], [780, 116]] },
  { id: 'audio', color: '#139a47', y: 226, clips: [[20, 250], [296, 180], [500, 260], [790, 100]] },
  { id: 'sfx', color: '#df7a06', y: 280, clips: [[60, 70, 'drop'], [210, 54, 'drop'], [330, 90, 'drop'], [480, 60, 'drop'], [600, 80, 'drop'], [760, 64, 'drop']] },
];

// each arrow starts at its own word and stops just short of its layer
const NOTES = [
  { text: 'Visuals', x: 150, y: 58, size: 36, anchor: 'end', rotate: -4, from: [158, 42], tip: [200, 104], bend: [[30, -12], [-2, -44]], nudge: [1, 3] },
  { text: 'Clean cuts', x: 430, y: 46, size: 32, anchor: 'start', rotate: 3, from: [424, 40], tip: [392, 104], bend: [[-30, -2], [4, -34]], nudge: [-1, 3] },
  { text: 'Sound Design', x: 414, y: 392, size: 34, anchor: 'start', rotate: -3, from: [406, 380], tip: [350, 338], bend: [[-36, 4], [0, 32]], nudge: [-1, -3] },
] as const;

/* ---------------- helpers ---------------- */

const NS = 'http://www.w3.org/2000/svg';
function make(tag: string, attrs: Record<string, string | number>, parent?: Element) {
  const n = document.createElementNS(NS, tag) as SVGElement;
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}
const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const mod = (a: number, n: number) => ((a % n) + n) % n;

/* ---------------- component ---------------- */

export function TimelineLayers({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  // load the handwriting font once
  useEffect(() => {
    if (document.querySelector('link[data-tl-font]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';
    l.dataset.tlFont = '1';
    document.head.appendChild(l);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const clipsG = svg.querySelector('#tl-clips')!;
    const ripG = svg.querySelector('#tl-ripples')!;
    const notesG = svg.querySelector('#tl-notes')!;
    const ruler = svg.querySelector('#tl-ruler')!;
    clipsG.innerHTML = ripG.innerHTML = notesG.innerHTML = '';

    /* ----- clips ----- */
    type Clip = {
      li: number;
      y: number;
      start: number;
      len: number;
      kind: Kind;
      cut: number;
      g: SVGElement;
      body: SVGElement;
      whole: SVGElement;
      left?: SVGElement;
      right?: SVGElement;
      wholeRing: SVGElement;
      leftRing?: SVGElement;
      rightRing?: SVGElement;
      lastX: number | null;
    };
    const clips: Clip[] = [];
    LAYERS.forEach((L, li) => {
      const row = make('g', { filter: `url(#tl-s-${L.id})` }, clipsG);
      L.clips.forEach(([start, len, kind], ci) => {
        const g = make('g', {}, row);
        const body = make('g', {}, g);
        const rect = (x: number, w: number) =>
          make('rect', { x, y: 0, width: w, height: H, rx: 12, fill: `url(#tl-g-${L.id})` }, body);
        const whole = rect(0, len);
        let left: SVGElement | undefined, right: SVGElement | undefined;
        let leftRing: SVGElement | undefined, rightRing: SVGElement | undefined;
        const cut = Math.round(len * 0.48);
        if (kind === 'cut') {
          left = rect(0, cut);
          right = rect(cut, len - cut);
          left.style.display = right.style.display = 'none';
          leftRing = make(
            'rect',
            { x: 0.5, y: 0.5, width: cut - 1, height: H - 1, rx: 12, fill: 'none', stroke: '#fff', 'stroke-width': 2, opacity: 0 },
            body
          );
          rightRing = make(
            'rect',
            { x: cut + 0.5, y: 0.5, width: len - cut - 1, height: H - 1, rx: 12, fill: 'none', stroke: '#fff', 'stroke-width': 2, opacity: 0 },
            body
          );
          leftRing.style.display = rightRing.style.display = 'none';
        }
        if (L.id === 'fx') make('rect', { x: 0, y: 0, width: len, height: H, rx: 12, fill: 'url(#tl-stripes)' }, body);
        if (L.id === 'shot') {
          for (let x = 26; x < len - 6; x += 26) {
            make('rect', { x, y: 7, width: 1.4, height: H - 14, rx: 0.7, fill: '#fff', opacity: 0.3 }, body);
          }
        }
        if (L.id === 'audio' || L.id === 'sfx') {
          for (let x = 8; x < len - 6; x += 4) {
            const a =
              L.id === 'sfx'
                ? Math.abs(Math.sin(x * 0.3 + ci)) * (1 - x / len) + 0.15
                : Math.abs(Math.sin(x * 0.07 + ci * 2) * Math.sin(x * 0.019 + ci)) * 0.8 + rnd(x + ci * 31) * 0.2;
            const bh = Math.max(3, a * (H - 12));
            const b = make(
              'rect',
              { x, y: H / 2 - bh / 2, width: 2, height: bh, rx: 1, fill: '#fff', opacity: 0.85, class: 'eq' },
              body
            );
            b.style.animationDelay = `${-rnd(x * 7 + ci) * 0.9}s`;
            b.style.animationDuration = `${0.6 + rnd(x + li) * 0.7}s`;
          }
        }
        make('rect', { x: 6, y: 2, width: Math.max(0, len - 12), height: 1.4, rx: 0.7, fill: '#fff', opacity: 0.55 }, body);

        // Put outline inside body so it scales properly with unfold and transforms without glitching
        const wholeRing = make(
          'rect',
          { x: 0.5, y: 0.5, width: len - 1, height: H - 1, rx: 12, fill: 'none', stroke: '#fff', 'stroke-width': 2, opacity: 0 },
          body
        );

        clips.push({
          li,
          y: L.y,
          start,
          len,
          kind,
          cut,
          g,
          body,
          whole,
          left,
          right,
          wholeRing,
          leftRing,
          rightRing,
          lastX: null,
        });
      });
    });
    const ripples = LAYERS.map((L) => ({
      c: make('circle', { cx: PH, cy: L.y + H / 2, r: 0, fill: 'none', stroke: L.color, 'stroke-width': 2, opacity: 0 }, ripG),
      at: -9,
    }));

    /* ----- hand-written notes + arrows ----- */
    const timers: number[] = [];
    let started = false;
    const startNotes = () => {
      if (started) return;
      started = true;
      let delay = 0.5;
      NOTES.forEach((n) => {
        const [sx, sy] = n.from,
          [tx, ty] = n.tip;
        const c1 = [sx + n.bend[0][0], sy + n.bend[0][1]];
        const c2 = [tx + n.bend[1][0], ty + n.bend[1][1]];
        const ang = Math.atan2(c2[1] - ty, c2[0] - tx);
        const arm = (a: number) => [tx + Math.cos(ang + a) * 12, ty + Math.sin(ang + a) * 12].map((v) => v.toFixed(1));
        const [ax, ay] = arm(0.5),
          [bx, by] = arm(-0.5);
        const ag = make('g', { class: 'arrow-g', style: `--nx:${n.nudge[0]}px;--ny:${n.nudge[1]}px` }, notesG);
        const line = make('path', { class: 'arrow armed', pathLength: 1, d: `M${sx} ${sy} C ${c1} ${c2} ${tx} ${ty}` }, ag);
        const head = make('path', { class: 'arrow head armed', pathLength: 1, d: `M${ax} ${ay} L ${tx} ${ty} L ${bx} ${by}` }, ag);

        const word = make(
          'text',
          { class: 'note', x: n.x, y: n.y, 'font-size': n.size, 'text-anchor': n.anchor, transform: `rotate(${n.rotate} ${n.x} ${n.y - 8})` },
          notesG
        ) as SVGTextElement;
        word.textContent = n.text;
        try {
          const pos = [...n.text].map((_, i) => word.getStartPositionOfChar(i));
          const holder = make('g', { class: 'note', transform: word.getAttribute('transform')! }, notesG);
          [...n.text].forEach((ch, i) => {
            if (ch === ' ') return;
            const t = make('text', { class: 'ltr', x: pos[i].x, y: pos[i].y, 'font-size': n.size }, holder);
            t.textContent = ch;
            const inAt = delay + i * 0.055;
            t.style.animationDelay = `${inAt}s, ${inAt + 0.6 + i * 0.09}s`;
          });
          word.style.display = 'none';
        } catch {
          /* keep the plain word */
        }
        delay += n.text.length * 0.055 + 0.15;
        line.style.animationDelay = `${delay}s`;
        head.style.animationDelay = `${delay + 0.62}s`;
        ag.style.animationDelay = `${delay + 1.1}s`;
        requestAnimationFrame(() => [line, head, ag].forEach((el) => el.classList.add('go')));
        delay += 0.55;
      });
    };
    const fontReady = document.fonts?.load ? document.fonts.load('700 36px Caveat').catch(() => undefined) : Promise.resolve();
    Promise.race([fontReady, new Promise((r) => timers.push(window.setTimeout(r, 1200)))]).then(startNotes, startNotes);
    timers.push(window.setTimeout(startNotes, 2000));

    /* ----- loop (infinite requestAnimationFrame driven by elapsed time) ----- */
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      const wasVisible = visible;
      visible = e.isIntersecting;
      if (!wasVisible && visible) {
        lastTimestamp = performance.now();
      }
    });
    io.observe(svg);

    let lastTimestamp = performance.now();
    let elapsed = 0;
    let raf = 0;

    const onVisibilityChange = () => {
      if (!document.hidden) {
        lastTimestamp = performance.now();
      }
    };
    const onWindowFocus = () => {
      lastTimestamp = performance.now();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onWindowFocus);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      // Pause when hidden or scrolled out of view, resume seamlessly from same spot
      if (!visible || document.hidden) {
        lastTimestamp = now;
        return;
      }

      const delta = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;
      elapsed += delta;

      const time = reduced ? 3 : elapsed;
      // Modulo wrap so motion repeats forever without stopping or precision drift
      const offset = (time * SPEED) % LOOP;
      const reveal = time > 2 ? 1 : easeOut(clamp(time / 1.1));

      ruler.setAttribute('x', String(-(offset % 50)));

      for (const c of clips) {
        const x = mod(c.start - offset + LEAD, LOOP) - LEAD;
        let dy = 0,
          sx = 1,
          op = reveal;
        const k = clamp((x - (PH + 60)) / 160); // 1 = far right, 0 = near the playhead
        if (c.kind === 'drop') {
          const e = easeOut(1 - k);
          dy = -50 * (1 - e);
          op *= e;
        }
        if (c.kind === 'unfold') {
          sx = Math.max(0.02, easeOut(1 - k));
        }
        dy += (1 - reveal) * 14;

        c.g.setAttribute('transform', `translate(${x.toFixed(2)} ${c.y + dy})`);
        c.body.setAttribute('transform', `scale(${sx} 1)`);
        c.g.setAttribute('opacity', op.toFixed(3));

        if (c.kind === 'cut' && c.left && c.right && c.leftRing && c.rightRing) {
          const past = PH - (x + c.cut);
          const split = past > 0;
          if (split) {
            const gap = 6 * easeOut(clamp(past / 30));
            c.whole.style.display = 'none';
            c.wholeRing.style.display = 'none';
            c.left.style.display = '';
            c.right.style.display = '';
            c.leftRing.style.display = '';
            c.rightRing.style.display = '';
            c.right.setAttribute('x', String(c.cut + gap));
            c.rightRing.setAttribute('x', String(c.cut + gap + 0.5));

            const isLeftActive = x <= PH && x + c.cut >= PH && reveal > 0.9;
            const isRightActive = x + c.cut + gap <= PH && x + c.len + gap >= PH && reveal > 0.9;
            c.leftRing.setAttribute('opacity', isLeftActive ? '0.95' : '0');
            c.rightRing.setAttribute('opacity', isRightActive ? '0.95' : '0');
          } else {
            c.whole.style.display = '';
            c.wholeRing.style.display = '';
            c.left.style.display = 'none';
            c.right.style.display = 'none';
            c.leftRing.style.display = 'none';
            c.rightRing.style.display = 'none';
            const isWholeActive = x <= PH && x + c.len >= PH && reveal > 0.9;
            c.wholeRing.setAttribute('opacity', isWholeActive ? '0.95' : '0');
          }
        } else {
          const isWholeActive = x <= PH && x + c.len >= PH && reveal > 0.9;
          c.wholeRing.setAttribute('opacity', isWholeActive ? '0.95' : '0');
        }

        if (c.lastX !== null && c.lastX > PH && x <= PH && reveal > 0.9) {
          ripples[c.li].at = elapsed;
        }
        c.lastX = x;
      }

      ripples.forEach((r) => {
        const p = clamp((elapsed - r.at) / 0.7);
        r.c.setAttribute('r', String(6 + p * 26));
        r.c.setAttribute('opacity', String(p < 1 ? (1 - p) * 0.7 : 0));
      });
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onWindowFocus);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={className}>
      <style>{CSS}</style>
      <svg
        ref={svgRef}
        className="tl-svg"
        viewBox="0 0 620 410"
        role="img"
        aria-label="Animated editing timeline: visuals on top, sound design at the bottom, moving under a playhead"
      >
        <defs>
          <linearGradient id="tl-g-fx" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5ee0ff" />
            <stop offset="1" stopColor="#0bb4e6" />
          </linearGradient>
          <linearGradient id="tl-g-shot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff6fa3" />
            <stop offset="1" stopColor="#f0216b" />
          </linearGradient>
          <linearGradient id="tl-g-audio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4ade80" />
            <stop offset="1" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="tl-g-sfx" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffc24b" />
            <stop offset="1" stopColor="#f08a0c" />
          </linearGradient>
          <filter id="tl-s-fx" x="-10%" y="-40%" width="120%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0bb4e6" floodOpacity=".35" />
          </filter>
          <filter id="tl-s-shot" x="-10%" y="-40%" width="120%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#f0216b" floodOpacity=".32" />
          </filter>
          <filter id="tl-s-audio" x="-10%" y="-40%" width="120%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#16a34a" floodOpacity=".3" />
          </filter>
          <filter id="tl-s-sfx" x="-10%" y="-40%" width="120%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#f08a0c" floodOpacity=".32" />
          </filter>
          <pattern id="tl-stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="4" height="10" fill="#fff" opacity=".22" />
          </pattern>
          <pattern id="tl-ticks" width="50" height="14" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1.4" height="14" fill="#0b1020" opacity=".28" />
            {[10, 20, 30, 40].map((x) => (
              <rect key={x} x={x} y="7" width="1" height="7" fill="#0b1020" opacity=".14" />
            ))}
          </pattern>
          <linearGradient id="tl-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".08" stopColor="#fff" />
            <stop offset=".92" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="tl-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="620" height="410">
            <rect x="0" y="0" width="620" height="410" fill="url(#tl-edge)" />
          </mask>
        </defs>

        <g mask="url(#tl-fade)">
          <rect id="tl-ruler" x="0" y="94" width="670" height="14" fill="url(#tl-ticks)" />
        </g>
        <g id="tl-clips" mask="url(#tl-fade)" />
        <g id="tl-ripples" />

        {/* playhead (centred) */}
        <g transform={`translate(${PH} 0)`}>
          <rect x="-6" y="94" width="12" height="244" rx="6" fill="#1f6bff" opacity=".1" />
          <rect x="-1.25" y="94" width="2.5" height="244" rx="1.25" fill="#1f6bff" />
          <circle cx="0" cy="84" r="10" fill="#1f6bff" className="pulse" />
          <path d="M-9 74 h18 a2 2 0 0 1 2 2 v8 l-11 10 l-11 -10 v-8 a2 2 0 0 1 2 -2Z" fill="#1f6bff" />
        </g>

        <g id="tl-notes" />
      </svg>
    </div>
  );
}

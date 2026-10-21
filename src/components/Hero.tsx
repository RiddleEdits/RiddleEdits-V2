import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS, SITE, thumb } from '../data/content';
import { Link } from '../router';
import { Selected, Thumb } from './Media';

const HeroScene = lazy(() => import('../hero/HeroScene'));

function canWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return r;
}

/** Without WebGL: three real frames laid out like a contact sheet. */
function StillFrames() {
  const ids = PROJECTS.filter((p) => p.featured).slice(0, 3).map((p) => p.youtubeId);
  return (
    <div className="relative mx-auto h-full max-w-[560px]">
      {ids.map((id, i) => (
        <div
          key={id}
          className="absolute w-[62%] overflow-hidden rounded-[6px] border-[6px] border-blue shadow-[0_30px_60px_-30px_rgba(11,22,48,0.5)]"
          style={{ left: `${6 + i * 16}%`, top: `${14 + i * 22}%`, transform: `rotate(${-6 + i * 5}deg)` }}
        >
          <Thumb id={id} className="aspect-video w-full" />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [gl, setGl] = useState<boolean | null>(null);
  const reduced = useReducedMotion();
  const thumbs = useMemo(
    () =>
      PROJECTS.filter((p) => p.format !== 'Shorts')
        .slice(0, 8)
        .map((p) => thumb(p.youtubeId, 'hqdefault')),
    [],
  );

  useEffect(() => setGl(canWebGL()), []);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden pt-16">
      <div className="wrap grid items-center gap-6 md:min-h-[min(820px,calc(100svh-64px))] lg:grid-cols-12">
        <div className="relative z-10 pt-14 lg:col-span-6 lg:pt-0">
          <p className="label flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff3b4a] [animation:blink_1.6s_steps(1)_infinite]" />
            Kyro Media <span className="text-line">—</span> Editing portfolio
          </p>
          <h1 className="mt-8 text-[44px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[58px] lg:text-[54px] xl:text-[68px]">
            Editor Behind
            <br />
            <span className="whitespace-nowrap">
            Tech and{' '}
            <Selected label="Minecraft.mp4">
              <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-blue">Minecraft</span>
            </Selected>
            </span>
            <br />
            Channels
          </h1>
          <p className="mt-7 max-w-[440px] text-[17px] leading-[1.6] text-ink-2 sm:text-[18px]">
            Long form, shorts and sponsor segments for YouTube creators, edited around one thing: keeping viewers watching to the end.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Book a call
            </a>
            <Link to="/work/" className="btn btn-quiet">
              See the work <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="relative -mx-5 h-[440px] [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_90%,transparent)] sm:h-[560px] md:-mx-10 lg:col-span-6 lg:-mr-10 lg:ml-0 lg:h-[min(760px,calc(100svh-80px))] lg:[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_94%,transparent)]">
          {gl === false ? (
            <StillFrames />
          ) : gl ? (
            <Suspense fallback={null}>
              <HeroScene active={visible} reduced={reduced} thumbs={thumbs} />
            </Suspense>
          ) : null}
        </div>
      </div>
    </section>
  );
}

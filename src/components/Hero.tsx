import { CREATORS } from '../data/content';
import { useModals } from '../router';
import { Avatar, Button, Container } from './ui';
import { TimelineLayers } from './TimelineLayers';

export function Hero() {
  const { openBookCall } = useModals();
  const marquee = [...CREATORS, ...CREATORS];

  return (
    <section className="relative overflow-hidden bg-white pb-8 pt-32 lg:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,102,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,.07) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 50% 60% at 25% 45%, #000 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 60% at 25% 45%, #000 20%, transparent 100%)'
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f8fafc]" />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="animate-fade-up">
            <h1 className="text-[clamp(40px,5.2vw,68px)] font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 text-balance">
              The editor behind <span className="text-[#0066ff]">GTA and Roblox</span> channels
            </h1>
            <p className="mt-6 max-w-[460px] text-[17px] leading-relaxed text-slate-600">
              I edit long-form videos that don’t bore people. Fast pacing, clean cuts and sound design that keeps retention high.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={openBookCall}>Book a call</Button>
              <Button variant="secondary" href="/#work">
                See the work
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {CREATORS.slice(0, 5).map((c) => (
                  <Avatar key={c.id} id={c.id} size={30} />
                ))}
              </div>
              <p className="text-[13.5px] font-medium text-slate-600">
                Trusted by creators with <span className="font-semibold text-slate-950">10M+ subscribers</span>
              </p>
            </div>
          </div>

          <TimelineLayers className="w-full" />
        </div>
      </Container>

      <Container className="relative mt-14">
        <div
          className="overflow-hidden"
          style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}
        >
          <ul className="flex w-max gap-3 animate-marquee">
            {marquee.map((c, i) => (
              <li key={`${c.id}-${i}`} aria-hidden={i >= CREATORS.length}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={i >= CREATORS.length ? -1 : 0}
                  className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
                >
                  <Avatar id={c.id} size={24} className="ring-0" />
                  {c.name}
                  <span className="text-slate-400">{c.subs}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

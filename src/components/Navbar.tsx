import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useModals } from '../router';
import { NICHES, thumb, videosFor, type Niche } from '../data/content';
import { Button } from './ui';

const LINK = 'rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors';

export function Logo() {
  return (
    <Link href="/" aria-label="RiddleEdits home" className="flex items-center gap-2.5">
      <img src="/riddle.jpg" alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-[9px] object-cover" />
      <span className="text-[16px] font-semibold tracking-tight text-slate-950">
        Riddle<span className="text-slate-500">Edits</span>
      </span>
    </Link>
  );
}

export function Navbar({ path }: { path: string }) {
  const { openBookCall } = useModals();
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setWorkOpen(false);
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (workRef.current && !workRef.current.contains(e.target as Node)) setWorkOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setWorkOpen(false), setMobileOpen(false));
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const active = (p: string) => path.startsWith(p);
  const linkCls = (p: string) => `${LINK} ${active(p) ? 'text-[#0066ff] bg-blue-50' : 'text-slate-700 hover:text-slate-950'}`;

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4">
      <div className="relative mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full border border-slate-200/80 bg-white/85 pl-4 pr-2 shadow-[0_10px_30px_-12px_rgba(15,40,100,0.25)] backdrop-blur-xl">
        <Logo />

        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          <div
            ref={workRef}
            className="relative"
            onMouseEnter={() => {
              window.clearTimeout(closeTimer.current);
              setWorkOpen(true);
            }}
            onMouseLeave={() => {
              closeTimer.current = window.setTimeout(() => setWorkOpen(false), 150);
            }}
          >
            <button
              type="button"
              aria-expanded={workOpen}
              aria-haspopup="true"
              onClick={() => setWorkOpen((o) => !o)}
              className={`${linkCls('/work')} inline-flex items-center gap-1`}
            >
              Work <ChevronDown className={`h-3.5 w-3.5 transition-transform ${workOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`absolute left-1/2 top-full w-[480px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                workOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
              }`}
            >
              <div className="grid grid-cols-2 gap-2 rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_24px_50px_-20px_rgba(15,40,100,0.35)]">
                {(Object.keys(NICHES) as Niche[]).map((key) => {
                  const n = NICHES[key];
                  return (
                    <Link key={key} href={n.path} className="group overflow-hidden rounded-2xl transition-colors hover:bg-slate-50">
                      <div className="aspect-video overflow-hidden rounded-xl bg-slate-200">
                        <img src={thumb(videosFor(key)[0].id)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                      </div>
                      <div className="px-2 pb-2 pt-2.5">
                        <div className="text-[14px] font-semibold text-slate-900 group-hover:text-[#0066ff]">{n.name}</div>
                        <div className="text-[12.5px] text-slate-500">{n.formats.join(', ')}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <Link href="/case-studies" className={linkCls('/case-studies')}>
            Case studies
          </Link>
          <Link href="/contact" className={linkCls('/contact')}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Button size="sm" onClick={openBookCall} className="hidden sm:inline-flex">
            Book a call
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute inset-x-0 top-[calc(100%+8px)] rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_24px_50px_-20px_rgba(15,40,100,0.35)] md:hidden">
            {[
              ['/work/gta', 'GTA work'],
              ['/work/roblox', 'Roblox work'],
              ['/case-studies', 'Case studies'],
              ['/contact', 'Contact']
            ].map(([href, label]) => (
              <Link key={href} href={href} className={`block rounded-2xl px-4 py-3 text-[15px] font-medium ${active(href) ? 'bg-blue-50 text-[#0066ff]' : 'text-slate-800 hover:bg-slate-50'}`}>
                {label}
              </Link>
            ))}
            <Button onClick={openBookCall} className="mt-2 w-full">
              Book a call
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { SITE } from '../data/content';
import { Link, useRouter } from '../router';

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <rect x="1" y="4" width="24" height="18" rx="3" fill="#0b1630" />
        <g fill="#ffffff">
          <rect x="3.5" y="6" width="2.2" height="2" rx=".5" />
          <rect x="3.5" y="18" width="2.2" height="2" rx=".5" />
          <rect x="20.3" y="6" width="2.2" height="2" rx=".5" />
          <rect x="20.3" y="18" width="2.2" height="2" rx=".5" />
        </g>
        <path d="M10.5 9.2v7.6l6.4-3.8z" fill="#2457ff" />
      </svg>
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
        Kyro <span className="font-normal text-ink-2">Media</span>
      </span>
    </span>
  );
}

const NAV = [
  { to: '/work/', label: 'Work' },
  { to: '/case-studies/', label: 'Case Studies' },
  { to: '/contact/', label: 'Contact' },
];

export function Navbar() {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_0_var(--color-line)]' : ''
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" aria-label="Kyro Media, home" className="rounded">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => {
            const active = path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? 'page' : undefined}
                className={`relative text-[14.5px] transition-colors ${active ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                {n.label}
                {active && <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-blue" />}
              </Link>
            );
          })}
          <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-4 !py-2 !text-[14px]">
            Book a call
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 grid h-11 w-11 place-items-center md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition ${open ? 'top-1/2 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition ${open ? 'top-1/2 -rotate-45' : 'bottom-0'}`} />
          </span>
        </button>
      </div>
      <div
        id="mobile-nav"
        className={`overflow-hidden border-line bg-white transition-all duration-500 md:hidden ${open ? 'max-h-80 border-t' : 'max-h-0'}`}
      >
        <ul className="wrap py-3">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="block py-3 text-[18px] font-medium text-ink">
                {n.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 pb-2">
            <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
              Book a call
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Wordmark />
          <span className="font-mono text-[12px] text-ink-3">© {new Date().getFullYear()}</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px] text-ink-2">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
          <a href={`mailto:${SITE.email}`} className="hover:text-ink">
            {SITE.email}
          </a>
          {SITE.socials.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              {s.label} ↗
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/** Section label in the editor's vernacular: "02 — RESULTS". */
export function Label({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <p className="label flex items-center gap-3">
      {n && <span className="text-blue">{n}</span>}
      {n && <span className="h-px w-6 bg-line" />}
      {children}
    </p>
  );
}

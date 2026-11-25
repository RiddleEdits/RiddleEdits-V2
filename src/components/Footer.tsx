import { NICHES, SITE, type Niche } from '../data/content';
import { Link, useModals } from '../router';
import { Container } from './ui';
import { Logo } from './Navbar';

const HEAD = 'text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400';
const ITEM = 'text-[14px] text-slate-600 transition-colors hover:text-slate-950';

export function Footer() {
  const { openBookCall } = useModals();
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-slate-500">Video editing for GTA and Roblox YouTube creators.</p>
          <div className="mt-5 flex gap-2">
            <a href={SITE.x} target="_blank" rel="noopener noreferrer" aria-label="RiddleEdits on X" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-950">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L6.4 3.9H4.4L17.7 20Z" />
              </svg>
            </a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="RiddleEdits on Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-950">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
        <nav aria-label="Work" className="flex flex-col gap-3">
          <p className={HEAD}>Work</p>
          {(Object.keys(NICHES) as Niche[]).map((k) => (
            <Link key={k} href={NICHES[k].path} className={ITEM}>
              {NICHES[k].name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Pages" className="flex flex-col gap-3">
          <p className={HEAD}>Pages</p>
          <Link href="/case-studies" className={ITEM}>
            Case studies
          </Link>
          <Link href="/contact" className={ITEM}>
            Contact
          </Link>
        </nav>
        <div className="flex flex-col items-start gap-3">
          <p className={HEAD}>Get in touch</p>
          <button type="button" onClick={openBookCall} className={`${ITEM} font-semibold text-[#0066ff] hover:text-[#0052cc]`}>
            Book a call
          </button>
          <a href={`mailto:${SITE.email}`} className={ITEM}>
            {SITE.email}
          </a>
        </div>
      </Container>
      <Container className="border-t border-slate-100 py-6 text-[13px] text-slate-400">© {new Date().getFullYear()} RiddleEdits</Container>
    </footer>
  );
}

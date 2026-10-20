import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/work' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const goHomeSection = (id: string) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      sessionStorage.setItem('riddle-scroll-to', id);
      navigate('/');
    }
  };

  return (
    <nav className={`fixed top-2 sm:top-3.5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none flex justify-center transition-all duration-300 ${scrolled ? 'mt-0' : ''}`}>
      <div className="w-full max-w-5xl mx-auto pointer-events-auto flex items-center justify-between glass-heavy rounded-full px-4 sm:px-6 py-3 sm:py-3.5 min-h-[52px] sm:min-h-[60px] gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 cursor-pointer ml-1" onClick={() => navigate('/')}>
          <img
            alt="RiddleEdits"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
            src={`${import.meta.env.BASE_URL}riddle-avatar.png`}
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-sm sm:text-base text-secondary hidden sm:block tracking-tight">
            Riddle<span className="text-accent">Edits</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center justify-center gap-1 flex-shrink-0">
          {LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[13px] font-medium no-underline transition-colors duration-200 ${
                  active ? 'text-secondary bg-white/[0.07]' : 'text-[#9AA8AD] hover:text-secondary hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
                {active && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2266ff]" />}
              </Link>
            );
          })}
        </div>

        {/* Right: CTA + mobile toggle */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => goHomeSection('testimonials')}
            className="md:hidden text-[#9AA8AD] hover:text-secondary text-xs font-medium px-2 py-1 bg-transparent border-0"
            aria-label="Testimonials"
          >
            Reviews
          </button>
          <a
            href="https://x.com/RiddlePlayZz"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center font-semibold uppercase tracking-wider text-white no-underline relative z-10 btn-nav px-5 py-2 text-[11px] rounded-full gap-2 whitespace-nowrap min-h-[36px]"
          >
            Let&apos;s cook now!
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] flex flex-col items-center justify-center gap-[5px]"
          >
            <span className={`block w-4 h-[1.5px] bg-white transition-transform duration-300 ${open ? 'rotate-45 translate-y-[3.25px]' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-white transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[3.25px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden absolute top-[64px] left-4 right-4 pointer-events-auto glass-heavy rounded-3xl p-3 flex flex-col gap-1 transition-all duration-300 origin-top ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {LINKS.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-3 rounded-2xl text-sm font-medium no-underline transition-colors ${
                active ? 'text-secondary bg-white/[0.07]' : 'text-[#9AA8AD] hover:text-secondary'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <a
          href="https://x.com/RiddlePlayZz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-[#2266ff]/80 hover:bg-[#2266ff] no-underline text-center mt-1"
        >
          Let&apos;s cook now! →
        </a>
      </div>
    </nav>
  );
}

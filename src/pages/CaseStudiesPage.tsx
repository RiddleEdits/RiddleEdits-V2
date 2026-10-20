import React from 'react';
import { Link } from 'react-router-dom';
import { CASE_STUDIES } from '../data';
import { Reveal } from '../lib/Reveal';

export default function CaseStudiesPage() {
  return (
    <div className="pt-32 pb-8 min-h-screen">
      <div className="site-container">
        <Reveal className="reveal visible max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2266ff] font-semibold mb-4">Case Studies</p>
          <h1 className="font-extrabold text-secondary tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
            The process behind <span className="text-accent cursor-highlight">the cut.</span>
          </h1>
          <p className="text-[#9AA8AD] text-sm md:text-base mt-5 leading-relaxed">
            Three breakdowns of real projects — what the channel needed, how the edit was built,
            and what the numbers said afterwards.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6 mt-14">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={cs.slug} className={`reveal ${i === 1 ? 'd2' : i === 2 ? 'd3' : 'd1'} visible`}>
              <Link
                to={`/case-studies/${cs.slug}`}
                className="case-card group block"
              >
                <div className="relative overflow-hidden rounded-[var(--radius)] aspect-[16/9] sm:aspect-auto sm:h-full min-h-[240px]">
                  <img
                    src={`https://i.ytimg.com/vi/${cs.youtubeId}/maxresdefault.jpg`}
                    alt={cs.tagline}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${cs.youtubeId}/hqdefault.jpg`;
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={cs.avatar} alt={cs.creator} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold">{cs.creator}</span>
                    </div>
                    <h3 className="font-bold text-white leading-snug" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)' }}>
                      {cs.title}
                    </h3>
                  </div>
                  <span
                    className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full backdrop-blur-md"
                    style={{ background: `${cs.accent}26`, color: '#fff', border: `1px solid ${cs.accent}55` }}
                  >
                    {cs.discipline.split(' · ')[0]}
                  </span>
                  <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <div className="hidden lg:flex flex-col justify-center gap-4 p-8">
                  <p className="text-[#9AA8AD] text-sm leading-relaxed">{cs.challenge.slice(0, 150)}…</p>
                  <div className="grid grid-cols-3 gap-3">
                    {cs.results.map((r) => (
                      <div key={r.label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                        <div className="font-extrabold text-lg" style={{ color: cs.accent }}>{r.value}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[#9AA8AD] mt-1 leading-tight">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary group-hover:text-[#2266ff] transition-colors">
                    Read the breakdown →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary no-underline border border-white/12 rounded-full px-6 py-3 hover:border-[#2266ff]/60 hover:text-[#2266ff] transition-all duration-300"
          >
            Want results like these? Let&apos;s talk
          </Link>
        </div>
      </div>
    </div>
  );
}

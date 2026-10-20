import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CASE_STUDIES } from '../data';
import { Reveal } from '../lib/Reveal';
import { FireButtonLink } from '../components/FireButton';

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  const [playing, setPlaying] = useState(false);

  if (!cs) {
    return (
      <div className="pt-40 pb-24 min-h-screen text-center">
        <div className="site-container">
          <h1 className="font-extrabold text-secondary text-3xl mb-4">Case study not found</h1>
          <Link to="/case-studies" className="text-[#2266ff] font-semibold hover:text-white transition-colors">
            ← Back to all case studies
          </Link>
        </div>
      </div>
    );
  }

  const idx = CASE_STUDIES.indexOf(cs);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];

  return (
    <div className="pt-32 pb-8 min-h-screen">
      <div className="site-container max-w-[1200px]">
        {/* Breadcrumb */}
        <Reveal className="reveal visible">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#9AA8AD] hover:text-[#2266ff] transition-colors no-underline mb-6"
          >
            ← Case Studies
          </Link>
        </Reveal>

        {/* Header */}
        <Reveal className="reveal d1 visible">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full"
              style={{ background: `${cs.accent}22`, color: '#fff', border: `1px solid ${cs.accent}55` }}
            >
              {cs.creator}
            </span>
            <span className="text-xs text-[#9AA8AD] font-medium">{cs.duration}</span>
          </div>
          <h1
            className="font-extrabold text-secondary tracking-tight leading-[1.06] max-w-3xl"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
          >
            {cs.title.split(' ').slice(0, -3).join(' ')}{' '}
            <span style={{ color: cs.accent }}>{cs.title.split(' ').slice(-3).join(' ')}</span>
          </h1>
          <p className="text-[#9AA8AD] text-sm md:text-base mt-5 max-w-2xl leading-relaxed">{cs.discipline}</p>
        </Reveal>

        {/* Hero video — cinematic frame */}
        <Reveal className="reveal d2 visible mt-12" >
          <div className="video-frame group">
            <div className="relative aspect-video overflow-hidden rounded-[calc(var(--radius)+4px)] bg-black">
              {!playing ? (
                <>
                  <img
                    src={`https://i.ytimg.com/vi/${cs.youtubeId}/maxresdefault.jpg`}
                    alt={cs.tagline}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${cs.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                  <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-transparent border-0"
                    aria-label={`Play ${cs.tagline}`}
                  >
                    <motion.span
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: `${cs.accent}e6`, boxShadow: `0 0 50px ${cs.accent}66` }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5.14v13.72L19 12 8 5.14z" />
                      </svg>
                    </motion.span>
                  </button>
                  <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between pointer-events-none">
                    <p className="text-white/90 font-semibold text-sm md:text-base">{cs.tagline}</p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/50 font-bold">Watch the finished edit</span>
                  </div>
                </>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${cs.youtubeId}?autoplay=1&rel=0`}
                  title={cs.tagline}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </Reveal>

        {/* Body grid */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 mt-16">
          <div className="flex flex-col gap-14 min-w-0">
            <Reveal className="reveal">
              <h2 className="section-title text-secondary mb-4">The challenge</h2>
              <p className="text-[#c9c9c9] leading-relaxed text-[0.95rem]">{cs.challenge}</p>
            </Reveal>

            <Reveal className="reveal">
              <h2 className="section-title text-secondary mb-6">The approach</h2>
              <ol className="flex flex-col gap-5 list-none m-0 p-0">
                {cs.approach.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-extrabold tabular-nums"
                      style={{ borderColor: `${cs.accent}66`, color: cs.accent, background: `${cs.accent}10` }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[#c9c9c9] leading-relaxed text-[0.95rem] pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="reveal">
              <blockquote
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 md:p-9 relative overflow-hidden"
              >
                <span
                  className="absolute -top-6 left-5 text-[120px] font-black leading-none opacity-[0.12] select-none"
                  style={{ color: cs.accent }}
                >
                  &ldquo;
                </span>
                <p className="relative text-lg md:text-xl font-semibold text-secondary leading-snug">{cs.quote}</p>
                <footer className="relative flex items-center gap-3 mt-6">
                  <img src={cs.avatar} alt={cs.quoteAuthor} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold text-secondary">{cs.quoteAuthor}</div>
                    <div className="text-xs text-[#9AA8AD]">Channel owner</div>
                  </div>
                </footer>
              </blockquote>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <Reveal className="reveal d1">
              <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] p-6">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#9AA8AD] font-bold mb-5">Results</h3>
                <div className="flex flex-col gap-5">
                  {cs.results.map((r) => (
                    <div key={r.label}>
                      <div className="font-extrabold text-3xl tracking-tight" style={{ color: cs.accent }}>
                        {r.value}
                      </div>
                      <div className="text-xs text-[#9AA8AD] mt-1">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal className="reveal d2">
              <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] p-6">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#9AA8AD] font-bold mb-4">Project at a glance</h3>
                <dl className="flex flex-col gap-3 text-sm m-0">
                  <div className="flex justify-between gap-4"><dt className="text-[#9AA8AD]">Client</dt><dd className="text-secondary font-semibold text-right">{cs.creator}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#9AA8AD]">Scope</dt><dd className="text-secondary font-semibold text-right">Edit · Motion · Sound</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-[#9AA8AD]">Turnaround</dt><dd className="text-secondary font-semibold text-right">{cs.duration.replace('Delivered in ', '')}</dd></div>
                </dl>
              </div>
            </Reveal>
            <Reveal className="reveal d3">
              <FireButtonLink to="/contact" label="Book a similar edit" className="w-full" id={`cs-cta-${cs.slug}`} />
            </Reveal>
          </aside>
        </div>

        {/* Next case study */}
        <Reveal className="reveal mt-20">
          <Link
            to={`/case-studies/${next.slug}`}
            className="group block rounded-2xl border border-white/[0.08] hover:border-[#2266ff]/50 transition-all duration-300 p-7 md:p-9 no-underline flex items-center justify-between gap-6 bg-[var(--surface)]"
          >
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#9AA8AD] font-bold mb-2">Next case study</div>
              <div className="font-bold text-secondary text-lg md:text-xl leading-snug truncate group-hover:text-[#2266ff] transition-colors">
                {next.title}
              </div>
            </div>
            <span className="shrink-0 w-12 h-12 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-[#2266ff] group-hover:border-transparent transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary" />
              </svg>
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

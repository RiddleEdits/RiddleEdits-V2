import React, { useState } from 'react';
import { FireButtonLink } from './FireButton';
import { Link } from 'react-router-dom';
import { WORKS, WorkItem } from '../data';

/** Lazy YouTube thumbnail (maxres -> hq fallback) with click-to-play embed. */
export const WorkCard: React.FC<{ work: WorkItem; className?: string }> = ({ work, className = '' }) => {
  const [playing, setPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const thumb = `https://i.ytimg.com/vi/${work.youtubeId}/${thumbError ? 'hq' : 'maxresdefault'}.jpg`;
  const relatedStudy = work.id === 'work-1' ? 'infinite-stars' : work.id === 'work-2' ? '100-days-zombie' : work.id === 'work-4' ? 'rigged-tournament' : null;

  return (
    <article className={`work-card ${className}`}>
      <div className={`work-thumb ${playing ? 'is-playing' : ''}`}>
        {!playing && (
          <>
            <img
              src={thumb}
              alt={work.title}
              loading="lazy"
              onError={() => setThumbError(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div
              onClick={() => setPlaying(true)}
              className="absolute inset-0 z-[3] flex items-center justify-center"
              title={`Play ${work.title}`}
              aria-label={`Play ${work.title}`}
            >
              <span className="w-14 h-14 rounded-full bg-[#2266ff]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(34,102,255,0.45)] transition-transform duration-300 hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              </span>
            </div>
            <span className="absolute top-3 left-3 z-[2] text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-white/85">
              {work.category}
            </span>
            <span className="absolute bottom-3 right-3 z-[2] text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/65 text-white/90 tabular-nums">
              {work.length}
            </span>
          </>
        )}
        {playing && (
          <iframe
            src={`https://www.youtube.com/embed/${work.youtubeId}?autoplay=1&rel=0`}
            title={work.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
      <div className="work-body flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3>{work.title}</h3>
          <div className="work-meta">
            <span>{work.creator}</span>
            <span className="dot" />
            <span>{work.views}</span>
          </div>
        </div>
        {relatedStudy && (
          <Link
            to={`/case-studies/${relatedStudy}`}
            className="shrink-0 mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2266ff] hover:text-white transition-colors whitespace-nowrap"
          >
            Case study →
          </Link>
        )}
      </div>
    </article>
  );
};

/** Compact home-page preview grid (first N works). */
export const WorkSection: React.FC = () => {
  const preview = WORKS.slice(0, 4);

  return (
    <>
      <section className="section" id="work">
        <div className="site-container">
          <div className="section-header reveal visible">
            <h2 className="section-title section-title-lg" id="work-heading">
              Selected <span className="cursor-highlight inline-block text-accent text-glow">work</span>
            </h2>
            <p className="text-[#9AA8AD] text-sm mt-3 max-w-md mx-auto">
              Real edits for real channels — click any card to watch the finished video.
            </p>
          </div>

          <div className="work-grid" id="portfolio-work-grid">
            {preview.map((work, index) => (
              <WorkCard
                key={work.id}
                work={work}
                className={`${index % 2 === 1 ? 'reveal-right d2' : 'reveal-left d1'} visible group`}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary no-underline border border-white/12 rounded-full px-6 py-3 hover:border-[#2266ff]/60 hover:text-[#2266ff] transition-all duration-300"
            >
              View full portfolio
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="cta-mid" id="mid-cta-2">
        <div className="site-container">
          <FireButtonLink />
        </div>
      </div>
    </>
  );
};

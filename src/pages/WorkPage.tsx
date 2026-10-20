import React, { useState } from 'react';
import { WORKS } from '../data';
import { WorkCard } from '../components/WorkGrid';
import { Reveal } from '../lib/Reveal';
import { FireButtonLink } from '../components/FireButton';

const FILTERS = ['All', 'Gaming', 'Retention Edit', 'Cinematic'] as const;
type Filter = (typeof FILTERS)[number];

export default function WorkPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const filtered = filter === 'All' ? WORKS : WORKS.filter((w) => w.category === filter);

  return (
    <div className="pt-32 pb-8 min-h-screen">
      <div className="site-container">
        {/* Page header */}
        <Reveal className="reveal visible max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2266ff] font-semibold mb-4">Portfolio</p>
          <h1 className="font-extrabold text-secondary tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>
            Every cut earns <span className="text-accent cursor-highlight">its place.</span>
          </h1>
          <p className="text-[#9AA8AD] text-sm md:text-base mt-5 leading-relaxed">
            Long-form retention edits, cinematic storytelling and comedy timing for gaming creators —
            thumbnails below are the actual published videos. Click to watch.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal className="reveal d1 visible flex flex-wrap gap-2 mt-10 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] border transition-all duration-300 ${
                filter === f
                  ? 'bg-[#2266ff] border-transparent text-white shadow-[0_0_22px_rgba(34,102,255,0.4)]'
                  : 'bg-transparent border-white/12 text-[#9AA8AD] hover:border-white/30 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </Reveal>

        {/* Grid */}
        <div className="work-grid">
          {filtered.map((work, i) => (
            <WorkCard key={work.id} work={work} className={`${i % 2 === 1 ? 'reveal-right' : 'reveal-left'} visible group`} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#9AA8AD] py-16">Nothing in this category yet — more coming soon.</p>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <FireButtonLink to="/contact" label="Book your edit" />
        </div>
      </div>
    </div>
  );
}

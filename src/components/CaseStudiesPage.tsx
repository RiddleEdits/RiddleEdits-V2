import { useState } from 'react';
import { CASE_STUDIES, NICHES, caseStats, compact, compactLikes, creator, quoteFor, type Niche } from '../data/content';
import { useModals } from '../router';
import { Avatar, Container, Eyebrow, VideoCard } from './ui';

type Filter = 'all' | Niche;

export function CaseStudiesPage() {
  const { openVideo } = useModals();
  const [filter, setFilter] = useState<Filter>('all');
  const studies = CASE_STUDIES.filter((cs) => filter === 'all' || cs.niche === filter);
  const filters: [Filter, string][] = [['all', 'All'], ...(Object.keys(NICHES) as Niche[]).map((k) => [k, NICHES[k].name] as [Filter, string])];

  return (
    <>
      <section className="bg-white pb-14 pt-32 lg:pt-40">
        <Container>
          <Eyebrow>Case studies</Eyebrow>
          <h1 className="mt-3 max-w-[720px] text-[clamp(38px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 text-balance">
            Real creators, real numbers.
          </h1>
          <p className="mt-5 max-w-[520px] text-[16.5px] leading-relaxed text-slate-600">
            The channels I edit for and the videos I cut for them. View counts come straight from YouTube.
          </p>
          <div className="mt-8 inline-flex gap-1 rounded-full border border-slate-200 bg-white p-1" role="tablist" aria-label="Filter by niche">
            {filters.map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-colors ${filter === key ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <div className="flex flex-col gap-6 py-16 lg:py-20">
        {studies.map((cs) => {
          const c = creator(cs.creatorId);
          const { vids, views, likes } = caseStats(cs);
          const quote = quoteFor(cs.creatorId);
          return (
            <section key={cs.slug} id={cs.slug}>
              <Container>
                <article className="card p-6 sm:p-10 lg:p-12">
                  <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3">
                        <Avatar id={c.id} size={44} className="ring-0" />
                        <span>
                          <span className="block text-[15px] font-semibold text-slate-900">{c.name}</span>
                          <span className="block text-[13px] text-slate-500">
                            {c.subs} subscribers · {NICHES[cs.niche].name}
                          </span>
                        </span>
                      </a>
                      <h2 className="mt-6 max-w-[640px] text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-950 sm:text-[34px]">{cs.headline}</h2>
                      <p className="mt-4 max-w-[600px] text-[15.5px] leading-relaxed text-slate-600">{cs.summary}</p>
                    </div>
                    <dl className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/60">
                      {[
                        ['Videos', String(vids.length)],
                        ['Views', compact(views)],
                        ['Likes', compactLikes(likes)]
                      ].map(([k, v]) => (
                        <div key={k} className="flex flex-col-reverse px-5 py-4">
                          <dt className="text-[12px] text-slate-500">{k}</dt>
                          <dd className="text-[22px] font-semibold tabular-nums tracking-tight text-slate-950">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {quote && (
                    <blockquote className="mt-8 border-l-2 border-[#0066ff] pl-4 text-[16px] font-medium text-slate-800">
                      “{quote.quote}” <span className="font-normal text-slate-500">— {c.name}</span>
                    </blockquote>
                  )}

                  <div className={`mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 ${vids.length >= 4 ? 'lg:grid-cols-4' : vids.length === 3 ? 'lg:grid-cols-3' : ''}`}>
                    {vids.map((v) => (
                      <VideoCard key={v.id} video={v} onOpen={openVideo} />
                    ))}
                  </div>
                </article>
              </Container>
            </section>
          );
        })}
      </div>
    </>
  );
}

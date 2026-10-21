import type { ReactNode } from 'react';
import { CASE_STUDIES, caseStudyBySlug, projectById } from '../data/content';
import { Link } from '../router';
import { Label } from '../components/Chrome';
import { Thumb, VideoEmbed } from '../components/Media';
import { NotFound } from './NotFound';

export function CaseStudiesPage() {
  return (
    <div className="pb-28 pt-32 md:pt-44">
      <div className="wrap">
        <Label>Case studies</Label>
        <h1 className="mt-6 text-[54px] font-semibold leading-[0.98] tracking-[-0.05em] text-ink md:text-[104px]">Case Studies</h1>
        <p className="mt-6 max-w-[540px] text-[18px] leading-relaxed text-ink-2">
          The thinking behind the edits: what each channel needed, how the videos were cut, and what changed.
        </p>

        <ol className="mt-20 border-t border-line">
          {CASE_STUDIES.map((c, i) => (
            <li key={c.slug} className="border-b border-line">
              <Link to={`/case-studies/${c.slug}/`} className="group grid gap-8 py-12 md:grid-cols-12 md:items-center md:py-16">
                <div className="md:col-span-6">
                  <p className="label">
                    <span className="text-blue">0{i + 1}</span>
                    <span className="mx-2 text-line">/</span>
                    {c.creator} · {c.niche}
                  </p>
                  <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink transition-colors group-hover:text-blue md:text-[40px]">
                    {c.headline}
                  </h2>
                  <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-ink-2">{c.teaser}</p>
                  {c.outcome.length > 0 && (
                    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                      {c.outcome.map((o) => (
                        <div key={o.label}>
                          <dt className="label !text-[10.5px]">{o.label}</dt>
                          <dd className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink">{o.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
                <div className="md:col-span-6">
                  <div className="aspect-video overflow-hidden rounded-[6px] bg-mist">
                    <Thumb id={c.videos[0]} className="h-full w-full transition duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Row({ n, title, children, media }: { n: string; title: string; children: ReactNode; media?: ReactNode }) {
  return (
    <section className="grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="font-mono text-[12px] tracking-[0.12em] text-blue">{n}</p>
        <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-ink md:text-[34px]">{title}</h2>
        <div className="mt-5 max-w-[440px] text-[16.5px] leading-[1.7] text-ink-2">{children}</div>
      </div>
      {media && <div className="lg:col-span-7">{media}</div>}
    </section>
  );
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const c = caseStudyBySlug(slug);
  if (!c) return <NotFound />;
  const idx = CASE_STUDIES.indexOf(c);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];
  const main = projectById(c.videos[0]);
  const related = c.videos.slice(1).map((id) => projectById(id)).filter(Boolean);

  return (
    <article className="pb-20 pt-28 md:pt-36">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="label">
          <Link to="/case-studies/" className="hover:text-ink">
            Case studies
          </Link>
          <span className="mx-2 text-line">/</span>
          {c.creator}
        </nav>
        <h1 className="mt-6 max-w-[980px] text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink md:text-[72px]">{c.headline}</h1>

        {/* 1. Overview */}
        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 md:grid-cols-4">
          {c.overview.map((o) => (
            <div key={o.label}>
              <dt className="label !text-[10.5px]">{o.label}</dt>
              <dd className="mt-2 text-[16px] font-medium leading-snug text-ink">{o.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16">
          {/* 2. Challenge, beside the main video */}
          <Row
            n="01 — The challenge"
            title="What the channel needed"
            media={main && <VideoEmbed id={main.youtubeId} title={main.title} />}
          >
            <p>{c.challenge}</p>
          </Row>

          {/* 3. Approach + 4. visual breakdown */}
          <Row
            n="02 — Editing approach"
            title="How the videos were cut"
            media={
              <div>
                <p className="label">Frames from {main?.title ?? 'the edit'}</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {(['hq1', 'hq2', 'hq3'] as const).map((q) => (
                    <div key={q} className="aspect-video overflow-hidden rounded-[4px] bg-mist">
                      <Thumb id={c.videos[0]} quality={q} className="h-full w-full" />
                    </div>
                  ))}
                </div>
                {related.length > 0 && (
                  <>
                    <p className="label mt-12">From the same channel</p>
                    <ul className="mt-4 grid gap-6 sm:grid-cols-2">
                      {related.map((p) => (
                        <li key={p!.slug}>
                          <Link to={`/work/${p!.slug}/`} className="group block">
                            <div className="aspect-video overflow-hidden rounded-[4px] bg-mist">
                              <Thumb id={p!.youtubeId} className="h-full w-full transition duration-700 group-hover:scale-[1.03]" />
                            </div>
                            <p className="mt-3 text-[15px] font-medium leading-snug text-ink group-hover:text-blue">{p!.title}</p>
                            <p className="mt-1 font-mono text-[12px] text-ink-3">
                              {[p!.views && `${p!.views} views`, p!.length].filter(Boolean).join(' · ')}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            }
          >
            <div className="space-y-8">
              {c.approach.map((a) => (
                <div key={a.title}>
                  <h3 className="text-[17px] font-semibold text-ink">{a.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {a.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span className="mt-[11px] h-px w-3 shrink-0 bg-blue" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Row>

          {/* 5. Outcome */}
          <section className="border-t border-line py-14 md:py-20">
            <p className="font-mono text-[12px] tracking-[0.12em] text-blue">03 — Outcome</p>
            {c.outcome.length > 0 ? (
              <dl className="mt-8 grid gap-10 md:grid-cols-3">
                {c.outcome.map((o) => (
                  <div key={o.label}>
                    <dd className="text-[40px] font-semibold leading-none tracking-[-0.05em] text-ink md:text-[50px]">{o.value}</dd>
                    <dt className="mt-3 text-[15px] text-ink-2">{o.label}</dt>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-6 max-w-[520px] text-[16.5px] leading-relaxed text-ink-2">
                {c.outcomeNote ?? 'Performance numbers for this project haven’t been shared publicly, so this case study focuses on the process.'}
              </p>
            )}
            {c.quote && (
              <figure className="mt-16 max-w-[900px]">
                <blockquote className="font-serif text-[26px] italic leading-[1.3] text-ink md:text-[34px]">“{c.quote}”</blockquote>
                <figcaption className="mt-5 text-[15px] font-medium text-ink">{c.creator}</figcaption>
              </figure>
            )}
          </section>

          {/* 6. Next */}
          {next && next.slug !== c.slug && (
            <Link to={`/case-studies/${next.slug}/`} className="group block border-t border-line pt-12">
              <p className="label">Next case study</p>
              <p className="mt-4 flex items-baseline justify-between gap-6 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink transition-colors group-hover:text-blue md:text-[48px]">
                {next.creator}: {next.headline}
                <span aria-hidden className="shrink-0 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </p>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

import { useMemo, useState } from 'react';
import { CASE_STUDIES, CATEGORIES, PROJECTS, projectBySlug, type Category } from '../data/content';
import { Link } from '../router';
import { Label } from '../components/Chrome';
import { ProjectTile, ShortTile, WorkGrid } from '../components/Work';
import { VideoEmbed } from '../components/Media';
import { NotFound } from './NotFound';

type Filter = 'All' | Category;

export function WorkPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const filters: Filter[] = ['All', ...CATEGORIES.filter((c) => PROJECTS.some((p) => p.category === c))];
  const inFilter = (c: Category) => filter === 'All' || c === filter;
  const long = useMemo(() => PROJECTS.filter((p) => p.format !== 'Shorts' && inFilter(p.category)), [filter]); // eslint-disable-line react-hooks/exhaustive-deps
  const shorts = useMemo(() => PROJECTS.filter((p) => p.format === 'Shorts' && inFilter(p.category)), [filter]); // eslint-disable-line react-hooks/exhaustive-deps
  const count = (f: Filter) => PROJECTS.filter((p) => f === 'All' || p.category === f).length;

  return (
    <div className="pb-28 pt-32 md:pt-44">
      <div className="wrap">
        <Label>Work</Label>
        <h1 className="mt-6 text-[54px] font-semibold leading-[0.98] tracking-[-0.05em] text-ink md:text-[104px]">Selected Work</h1>
        <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-ink-2">
          Long form, recuts and shorts for tech and Minecraft channels. Every video here is a real upload you can watch.
        </p>

        <div role="tablist" aria-label="Filter by category" className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-line">
          {filters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => setFilter(f)}
                className={`relative -mb-px flex items-baseline gap-2 border-b-2 pb-4 text-[16px] transition-colors ${
                  on ? 'border-blue text-ink' : 'border-transparent text-ink-2 hover:text-ink'
                }`}
              >
                {f}
                <span className="font-mono text-[11px] text-ink-3">{String(count(f)).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

        <div key={filter} className="page-in mt-16">
          <WorkGrid projects={long} />
          {shorts.length > 0 && (
            <div className="mt-28 border-t border-line pt-12">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">Shorts</h2>
                <p className="label">Vertical · 9:16</p>
              </div>
              <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                {shorts.map((p) => (
                  <li key={p.slug}>
                    <ShortTile p={p} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectPage({ slug }: { slug: string }) {
  const p = projectBySlug(slug);
  if (!p) return <NotFound />;
  const study = CASE_STUDIES.find((c) => c.videos.includes(p.youtubeId));
  const more = PROJECTS.filter((x) => x.slug !== p.slug && x.category === p.category && x.format !== 'Shorts').slice(0, 3);
  const vertical = p.format === 'Shorts';
  const facts = [
    { k: 'Creator', v: p.creator },
    { k: 'Category', v: p.category },
    { k: 'Format', v: p.format },
    { k: 'Views', v: p.views },
    { k: 'Length', v: p.length },
    { k: 'Likes', v: p.likes },
    { k: 'Comments', v: p.comments },
  ].filter((f) => f.v);

  return (
    <div className="pb-28 pt-28 md:pt-36">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="label">
          <Link to="/work/" className="hover:text-ink">
            Work
          </Link>
          <span className="mx-2 text-line">/</span>
          {p.category}
        </nav>
        <h1 className="mt-6 max-w-[920px] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink md:text-[56px]">{p.title}</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <VideoEmbed id={p.youtubeId} title={p.title} vertical={vertical} />
          </div>
          <aside className="lg:col-span-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="label !text-[10.5px]">{f.k}</dt>
                  <dd className="mt-1.5 text-[17px] font-medium text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
            {p.summary && <p className="mt-8 border-t border-line pt-6 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>}
            {study && (
              <Link to={`/case-studies/${study.slug}/`} className="mt-8 flex items-center justify-between border-t border-line pt-6 text-[16px] font-medium text-blue">
                Read the {study.creator} case study <span aria-hidden>→</span>
              </Link>
            )}
          </aside>
        </div>

        {more.length > 0 && (
          <div className="mt-28 border-t border-line pt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">More {p.category.toLowerCase()} work</h2>
              <Link to="/work/" className="link-arrow">
                All work <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {more.map((x) => (
                <li key={x.slug}>
                  <ProjectTile p={x} sizes="md" showSummary={false} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

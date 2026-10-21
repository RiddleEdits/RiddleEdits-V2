import type { Project } from '../data/content';
import { Link } from '../router';
import { Thumb } from './Media';

function Meta({ p }: { p: Project }) {
  return (
    <p className="label !text-[11px] !tracking-[0.12em]">
      {p.creator} <span className="mx-1.5 text-line">/</span> {p.category} <span className="mx-1.5 text-line">/</span> {p.format}
    </p>
  );
}

/** A large landscape preview with an understated caption. */
export function ProjectTile({ p, showSummary = true, sizes = 'lg' }: { p: Project; showSummary?: boolean; sizes?: 'lg' | 'md' }) {
  return (
    <Link to={`/work/${p.slug}/`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-[6px] bg-mist">
        <Thumb id={p.youtubeId} className="h-full w-full transition duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]" />
        <span className="pointer-events-none absolute bottom-3 left-3 flex translate-y-1 items-center gap-2 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-ink opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-blue text-white">
            <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden>
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          {p.length ? <span className="font-mono">{p.length}</span> : 'Watch'}
        </span>
        {p.views && (
          <span className="absolute right-3 top-3 rounded-[3px] bg-ink/75 px-1.5 py-1 font-mono text-[11px] leading-none text-white backdrop-blur">
            {p.views} views
          </span>
        )}
      </div>
      <div className="mt-4">
        <Meta p={p} />
        <h3 className={`mt-2 font-medium leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-blue ${sizes === 'lg' ? 'text-[20px] md:text-[22px]' : 'text-[17px]'}`}>
          {p.title}
        </h3>
        {showSummary && p.summary && <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{p.summary}</p>}
      </div>
    </Link>
  );
}

/** Vertical tile for shorts. */
export function ShortTile({ p }: { p: Project }) {
  return (
    <Link to={`/work/${p.slug}/`} className="group block">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-mist">
        <Thumb id={p.youtubeId} quality="hqdefault" className="h-full w-full scale-[1.34] transition duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.4]" />
        {p.views && (
          <span className="absolute left-2.5 top-2.5 rounded-[3px] bg-ink/75 px-1.5 py-1 font-mono text-[11px] leading-none text-white">{p.views} views</span>
        )}
      </div>
      <p className="label mt-3 !text-[10.5px]">{p.creator}</p>
      <h3 className="mt-1 text-[15px] font-medium leading-snug text-ink group-hover:text-blue">{p.title}</h3>
    </Link>
  );
}

/**
 * Asymmetric editorial grid. Spans repeat every five items: a wide and a narrow tile (offset),
 * then three equal tiles, so the page never settles into a uniform card wall.
 */
const PATTERN = [
  'md:col-span-7',
  'md:col-span-5 md:mt-24',
  'md:col-span-4',
  'md:col-span-4 md:mt-12',
  'md:col-span-4',
];

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-12 md:gap-y-20">
      {projects.map((p, i) => (
        <li key={p.slug} className={PATTERN[i % PATTERN.length]}>
          <ProjectTile p={p} sizes={i % 5 < 2 ? 'lg' : 'md'} showSummary={i % 5 < 2} />
        </li>
      ))}
    </ul>
  );
}

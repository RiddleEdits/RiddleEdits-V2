import type { ReactNode } from 'react';
import { useState } from 'react';
import { projectById, thumb } from '../data/content';

const GRADS = [
  ['#2457ff', '#0b1630'],
  ['#3d7a4a', '#14301f'],
  ['#7a4cff', '#1a1240'],
  ['#ff6a3d', '#3a1a12'],
  ['#1b9fbf', '#0b2433'],
];

/** Stand-in when YouTube's image host can't be reached (some previews block it). */
function ThumbArt({ id, className }: { id: string; className: string }) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b] = GRADS[h % GRADS.length];
  const title = projectById(id)?.title ?? '';
  return (
    <span
      role="img"
      aria-label={title}
      className={`relative block overflow-hidden ${className}`}
      style={{ background: `linear-gradient(140deg, ${a}, ${b})` }}
    >
      <span className="absolute inset-x-[7%] bottom-[9%] line-clamp-2 font-sans text-[clamp(10px,1.5vw,20px)] font-semibold leading-tight text-white/90">
        {title}
      </span>
    </span>
  );
}

/**
 * YouTube thumbnail. maxres isn't generated for every video (YouTube then serves a tiny grey
 * placeholder), so it steps down to hqdefault, and finally to a drawn stand-in.
 */
export function Thumb({
  id,
  className = '',
  quality = 'maxresdefault',
  eager = false,
}: {
  id: string;
  className?: string;
  quality?: 'maxresdefault' | 'hqdefault' | 'hq1' | 'hq2' | 'hq3';
  eager?: boolean;
}) {
  const [src, setSrc] = useState(thumb(id, quality));
  const [failed, setFailed] = useState(false);
  if (failed) return <ThumbArt id={id} className={className} />;
  return (
    <img
      src={src}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={`object-cover ${className}`}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= 200 && src.includes('maxres')) setSrc(thumb(id, 'hqdefault'));
      }}
      onError={() => {
        if (src.includes('maxres')) setSrc(thumb(id, 'hqdefault'));
        else setFailed(true);
      }}
    />
  );
}

/**
 * A lightweight video facade: just the thumbnail until someone presses play,
 * then the real YouTube player loads in place.
 */
export function VideoEmbed({ id, title, vertical = false }: { id: string; title: string; vertical?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const box = vertical ? 'mx-auto aspect-[9/16] w-full max-w-[380px]' : 'aspect-video w-full';
  return (
    <div>
      <div className={`relative overflow-hidden rounded-[6px] bg-ink ${box}`}>
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`} className="group absolute inset-0">
            <Thumb id={id} quality={vertical ? 'hqdefault' : 'maxresdefault'} eager className="h-full w-full" />
            <span className="absolute inset-0 bg-ink/10 transition group-hover:bg-ink/25" />
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-white py-2.5 pl-3 pr-5 text-[14px] font-medium text-ink shadow-[0_12px_30px_-12px_rgba(11,22,48,0.6)] transition group-hover:scale-[1.04]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              </span>
              Play
            </span>
          </button>
        )}
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3 transition hover:text-ink"
      >
        Watch on YouTube ↗
      </a>
    </div>
  );
}

/** A thin bounding box with corner handles, like a selected layer in an editor. */
export function Selected({ children, label }: { children: ReactNode; label?: string }) {
  const handle = 'absolute h-[9px] w-[9px] border border-blue bg-white';
  return (
    <span className="relative inline-block px-[0.12em]">
      <span aria-hidden className="pointer-events-none absolute inset-0 -bottom-[0.04em] -top-[0.02em] border border-blue">
        <span className={`${handle} -left-[5px] -top-[5px]`} />
        <span className={`${handle} -right-[5px] -top-[5px]`} />
        <span className={`${handle} -bottom-[5px] -left-[5px]`} />
        <span className={`${handle} -bottom-[5px] -right-[5px]`} />
        {label && (
          <span className="absolute left-[calc(100%+14px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-[3px] bg-blue px-1.5 py-[4px] font-mono text-[11px] font-medium not-italic leading-none tracking-[0.04em] text-white sm:block">
            {label}
          </span>
        )}
      </span>
      {children}
    </span>
  );
}

import React from 'react';
import { Play } from 'lucide-react';
import { creator, thumb, type Video, compact } from '../data/content';
import { Link } from '../router';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  arrow?: boolean;
};

export function Button({ variant = 'primary', size = 'md', href, onClick, className = '', children, arrow = true }: ButtonProps) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <svg className="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[13px] font-semibold text-[#0066ff] ${className}`}>{children}</p>;
}

export function SectionHeading({ eyebrow, title, intro, center = false }: { eyebrow?: string; title: React.ReactNode; intro?: string; center?: boolean }) {
  return (
    <div className={`max-w-[620px] ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[42px] text-balance">{title}</h2>
      {intro && <p className="mt-4 text-[16px] leading-relaxed text-slate-600 text-pretty">{intro}</p>}
    </div>
  );
}

export function Avatar({ id, size = 28, className = '' }: { id: string; size?: number; className?: string }) {
  const c = creator(id);
  return (
    <img
      src={c.avatar}
      alt={c.name}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/** Thumbnail with play button, length badge and optional view count. Opens the video modal. */
export function VideoThumb({
  video,
  onOpen,
  showViews = true,
  className = '',
  rounded = 'rounded-2xl'
}: {
  video: Video;
  onOpen: (id: string, title: string) => void;
  showViews?: boolean;
  className?: string;
  rounded?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(video.id, video.title)}
      aria-label={`Play “${video.title}”`}
      className={`group relative block w-full overflow-hidden bg-slate-200 aspect-video ${rounded} ${className}`}
    >
      <img src={thumb(video.id)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      <span className="absolute inset-0 bg-slate-950/0 transition-colors group-hover:bg-slate-950/15" />
      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
        <Play className="ml-0.5 h-5 w-5 fill-[#0066ff] text-[#0066ff]" />
      </span>
      {showViews && (
        <span className="absolute left-2.5 top-2.5 rounded-md bg-slate-950/75 px-1.5 py-0.5 text-[11.5px] font-semibold text-white">{compact(video.views)} views</span>
      )}
      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-950/75 px-1.5 py-0.5 text-[11.5px] font-semibold tabular-nums text-white">{video.length}</span>
    </button>
  );
}

/** Thumbnail + title + creator line, used in grids. */
export function VideoCard({ video, onOpen }: { video: Video; onOpen: (id: string, title: string) => void }) {
  const c = creator(video.creatorId);
  return (
    <div className="flex flex-col gap-3">
      <VideoThumb video={video} onOpen={onOpen} />
      <div className="flex items-start gap-3">
        <Avatar id={c.id} size={32} className="ring-0" />
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug text-slate-900">{video.title}</h3>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {c.name} · {compact(video.views)} views
          </p>
        </div>
      </div>
    </div>
  );
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

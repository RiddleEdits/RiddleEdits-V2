import { useState } from 'react';
import { NICHES, compact, compactLikes, creator, thumb, videosFor, type Niche } from '../data/content';
import { useModals } from '../router';
import { Avatar, Button, Container, SectionHeading, VideoThumb } from './ui';

function NicheCard({ niche, flip }: { niche: Niche; flip?: boolean }) {
  const { openVideo } = useModals();
  const n = NICHES[niche];
  const videos = videosFor(niche);
  const [index, setIndex] = useState(0);
  const video = videos[index];
  const c = creator(video.creatorId);
  const creatorIds = [...new Set(videos.map((v) => v.creatorId))];

  return (
    <article className="card grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
      <div className={flip ? 'lg:order-2' : ''}>
        <h3 className="text-[30px] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[36px]">{n.name}</h3>
        <p className="mt-3 max-w-[400px] text-[15.5px] leading-relaxed text-slate-600">{n.intro}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {n.formats.map((f) => (
            <li key={f} className="rounded-full border border-slate-200 px-3 py-1 text-[12.5px] font-medium text-slate-600">
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex -space-x-2">
            {creatorIds.map((id) => (
              <Avatar key={id} id={id} size={30} />
            ))}
          </div>
          <span className="text-[13px] text-slate-500">{creatorIds.map((id) => creator(id).name).join(', ')}</span>
        </div>
        <Button variant="secondary" href={n.path} className="mt-7">
          All {n.name} work
        </Button>
      </div>

      <div className={flip ? 'lg:order-1' : ''}>
        <VideoThumb video={video} onOpen={openVideo} showViews={false} rounded="rounded-[20px]" className="shadow-[0_30px_60px_-30px_rgba(15,40,100,0.45)]" />
        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar id={c.id} size={36} className="ring-0" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-slate-900">{video.title}</p>
              <p className="text-[12.5px] text-slate-500">{c.name}</p>
            </div>
          </div>
          <dl className="hidden shrink-0 grid-cols-3 gap-5 text-right sm:grid">
            {[
              ['Views', compact(video.views)],
              ['Length', video.length],
              ['Likes', compactLikes(video.likes)]
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] text-slate-400">{k}</dt>
                <dd className="text-[15px] font-semibold tabular-nums text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2" role="tablist" aria-label={`${n.name} videos`}>
          {videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={v.title}
              onClick={() => setIndex(i)}
              className={`aspect-video overflow-hidden rounded-lg ring-2 transition ${i === index ? 'ring-[#0066ff]' : 'opacity-60 ring-transparent hover:opacity-100'}`}
            >
              <img src={thumb(v.id)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Niches() {
  return (
    <section id="work" className="py-24 lg:py-32">
      <Container>
        <SectionHeading eyebrow="What I edit" title="Two niches. One editor who knows both." />
        <div className="mt-12 flex flex-col gap-6">
          <NicheCard niche="gta" />
          <NicheCard niche="roblox" flip />
        </div>
      </Container>
    </section>
  );
}

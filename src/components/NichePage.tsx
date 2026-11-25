import { NICHES, compact, creator, quoteFor, videosFor, type Niche } from '../data/content';
import { useModals } from '../router';
import { FaqList } from './Faqs';
import { Avatar, Button, Container, Eyebrow, SectionHeading, VideoCard, VideoThumb } from './ui';

export function NichePage({ niche }: { niche: Niche }) {
  const { openVideo, openBookCall } = useModals();
  const n = NICHES[niche];
  const videos = [...videosFor(niche)].sort((a, b) => b.views - a.views);
  const [featured, ...rest] = videos;
  const creatorIds = [...new Set(videos.map((v) => v.creatorId))];
  const total = videos.reduce((s, v) => s + v.views, 0);
  const quotes = creatorIds.map((id) => quoteFor(id)).filter(Boolean);

  return (
    <>
      <section className="bg-white pb-20 pt-32 lg:pb-28 lg:pt-40">
        <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="animate-fade-up">
            <Eyebrow>{n.name} editing</Eyebrow>
            <h1 className="mt-3 text-[clamp(38px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 text-balance">{n.headline}</h1>
            <p className="mt-5 max-w-[460px] text-[16.5px] leading-relaxed text-slate-600">{n.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={openBookCall}>Book a call</Button>
              <Button variant="secondary" href="/case-studies">
                Case studies
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-[13.5px] text-slate-600">
              <span className="flex -space-x-2">
                {creatorIds.map((id) => (
                  <Avatar key={id} id={id} size={30} />
                ))}
              </span>
              <span>
                <span className="font-semibold text-slate-950">{compact(total)} views</span> across these {videos.length} videos
              </span>
            </div>
          </div>
          <div>
            <VideoThumb video={featured} onOpen={openVideo} rounded="rounded-[24px]" className="shadow-[0_40px_80px_-40px_rgba(15,40,100,0.55)]" />
            <p className="mt-3 text-[13.5px] text-slate-500">
              <span className="font-medium text-slate-800">{featured.title}</span> · {creator(featured.creatorId).name}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading eyebrow="Work" title={`More ${n.name} videos I’ve edited`} />
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((v) => (
              <VideoCard key={v.id} video={v} onOpen={openVideo} />
            ))}
          </div>
        </Container>
      </section>

      {quotes.length > 0 && (
        <section className="pb-24">
          <Container className={`grid gap-4 ${quotes.length > 1 ? 'md:grid-cols-2' : 'max-w-[760px]'}`}>
            {quotes.map((t) => {
              const c = creator(t!.creatorId);
              return (
                <figure key={c.id} className="card flex items-center gap-5 p-6 sm:p-8">
                  <Avatar id={c.id} size={56} className="ring-0" />
                  <div>
                    <blockquote className="text-[18px] font-medium leading-snug tracking-[-0.01em] text-slate-900">“{t!.quote}”</blockquote>
                    <figcaption className="mt-2 text-[13px] text-slate-500">
                      {c.name} · {c.subs} subscribers
                    </figcaption>
                  </div>
                </figure>
              );
            })}
          </Container>
        </section>
      )}

      <section className="pb-24 lg:pb-32">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[38px]">{n.name} FAQs</h2>
            <p className="mt-3 text-[15.5px] text-slate-600">Questions {n.name} creators ask before we start.</p>
          </div>
          <FaqList items={n.faqs} />
        </Container>
      </section>
    </>
  );
}

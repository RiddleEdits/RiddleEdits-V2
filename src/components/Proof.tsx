import { STATS, TESTIMONIALS, creator } from '../data/content';
import { Avatar, Container, SectionHeading } from './ui';

export function Stats() {
  return (
    <section aria-label="Numbers" className="pb-24 lg:pb-32">
      <Container>
        <dl className="card grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-6 py-7 text-center sm:px-8 sm:py-10">
              <dt className="mx-auto mt-3 max-w-[220px] text-[14px] leading-snug text-slate-500">{s.label}</dt>
              <dd className="text-[44px] sm:text-[52px] font-semibold leading-none tracking-[-0.04em] text-slate-950 tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function Testimonials() {
  return (
    <section aria-label="Testimonials" className="py-24 lg:py-32">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Hear it from the creators." />
        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => {
            const c = creator(t.creatorId);
            return (
              <li key={t.creatorId} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <figure className="card flex h-full flex-col justify-between gap-6 p-6">
                  <blockquote className="text-[16px] font-medium leading-snug tracking-[-0.01em] text-slate-900">“{t.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3">
                    <Avatar id={c.id} size={36} className="ring-0" />
                    <span>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="block text-[14px] font-semibold text-slate-900 hover:text-[#0066ff]">
                        {c.name}
                      </a>
                      <span className="text-[12.5px] text-slate-500">{c.subs} subscribers</span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

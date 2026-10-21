import { CASE_STUDIES, CREATORS, PROCESS, RESULTS, SITE, featuredProjects } from '../data/content';
import { Link } from '../router';
import { Hero } from '../components/Hero';
import { Label } from '../components/Chrome';
import { ProjectTile } from '../components/Work';

function SelectedWork() {
  const items = featuredProjects();
  // wide / narrow, narrow / wide, then one centred: an asymmetric rhythm
  const spans = ['md:col-span-7', 'md:col-span-5 md:mt-28', 'md:col-span-5', 'md:col-span-7 md:mt-20', 'md:col-span-8 md:col-start-3'];
  return (
    <section className="py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label n="01">Selected work</Label>
            <h2 className="mt-5 max-w-[640px] text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink md:text-[52px]">
              Recent edits for <span className="serif-accent">tech</span> and <span className="serif-accent">Minecraft</span> creators.
            </h2>
          </div>
          <Link to="/work/" className="link-arrow">
            All work <span aria-hidden>→</span>
          </Link>
        </div>
        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24">
          {items.map((p, i) => (
            <li key={p.slug} className={spans[i % spans.length]}>
              <ProjectTile p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Results() {
  const vermax = CASE_STUDIES.find((c) => c.slug === 'vermax');
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="wrap">
        <Label n="02">Results</Label>
        <dl className="mt-12 grid gap-y-12 border-t border-line md:grid-cols-3">
          {RESULTS.map((r, i) => (
            <div key={r.value} className={`pt-10 md:pr-10 ${i ? 'md:border-l md:border-line md:pl-10' : ''}`}>
              <dt className="sr-only">{r.label}</dt>
              <dd>
                <span className="block text-[72px] font-semibold leading-none tracking-[-0.06em] text-ink md:text-[96px]">{r.value}</span>
                <span className="mt-5 block max-w-[260px] text-[16px] leading-relaxed text-ink-2">{r.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <p className="label md:col-span-3">Channels edited for</p>
          <p className="text-[24px] font-medium leading-[1.5] tracking-[-0.02em] text-ink md:col-span-9 md:text-[30px]">
            {CREATORS.map((c, i) => (
              <span key={c} className="whitespace-nowrap">
                {c}
                {i < CREATORS.length - 1 && <span className="mx-3 font-light text-ink-3">/</span>}{' '}
              </span>
            ))}
          </p>
        </div>

        {vermax?.quote && (
          <figure className="mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-12">
            <p className="label md:col-span-3">In their words</p>
            <div className="md:col-span-9">
              <blockquote className="font-serif text-[30px] italic leading-[1.25] tracking-[-0.01em] text-ink md:text-[40px]">
                “Having one unified team handle long form, shorts, and brand deals freed up 20+ hours of my week while our views surged 8x.”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <span className="text-[15px] font-medium text-ink">Vermax</span>
                <Link to="/case-studies/vermax/" className="link-arrow !text-[14px] text-blue">
                  Read the case study <span aria-hidden>→</span>
                </Link>
              </figcaption>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="py-24 md:py-36">
      <div className="wrap">
        <Label n="03">Process</Label>
        <h2 className="mt-5 max-w-[560px] text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink md:text-[52px]">
          Three passes, <span className="serif-accent">one</span> story.
        </h2>

        {/* a timeline track with markers and a playhead that crosses it */}
        <div className="relative mt-16 hidden h-10 md:block" aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border border-blue bg-white"
              style={{ left: `calc(${(i * 100) / 3}% )` }}
            />
          ))}
          <span className="absolute top-0 h-full w-px bg-blue [animation:scrub_9s_ease-in-out_infinite_alternate]">
            <span className="absolute -left-[5px] -top-1 h-0 w-0 border-x-[5.5px] border-t-[7px] border-x-transparent border-t-blue" />
          </span>
        </div>

        <ol className="mt-10 grid gap-12 md:mt-8 md:grid-cols-3 md:gap-10">
          {PROCESS.map((s, i) => (
            <li key={s.title} className="md:pr-6">
              <p className="font-mono text-[12px] tracking-[0.12em] text-blue">
                0{i + 1} <span className="text-ink-3">· 00:0{i * 2}:00:00</span>
              </p>
              <h3 className="mt-4 text-[24px] font-semibold tracking-[-0.025em] text-ink">
                {s.title}
                {i < 2 && <span className="ml-2 font-light text-ink-3 md:hidden">→</span>}
              </h3>
              <p className="mt-3 max-w-[340px] text-[16px] leading-relaxed text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="border-t border-line py-28 md:py-40">
      <div className="wrap text-center">
        <Label>Next upload</Label>
        <h2 className="mx-auto mt-6 max-w-[900px] text-[42px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink md:text-[76px]">
          Let’s make your next video the one people <span className="serif-accent">finish</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-[460px] text-[17px] leading-relaxed text-ink-2">
          Tell me about your channel and what you’re making next. A short call is enough to see if we’re a fit.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Book a call
          </a>
          <Link to="/contact/" className="btn btn-quiet">
            Send a brief <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Results />
      <Process />
      <ClosingCta />
    </>
  );
}

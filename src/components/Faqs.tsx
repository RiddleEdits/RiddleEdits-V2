import { useState } from 'react';
import { Plus } from 'lucide-react';
import { NICHES, videosFor, type Niche } from '../data/content';
import { useModals } from '../router';
import { Avatar, Button, Container } from './ui';

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className="card overflow-hidden rounded-2xl">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="w-6 shrink-0 text-[12px] font-medium tabular-nums text-slate-400">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-[15px] font-semibold text-slate-900">{item.q}</span>
              <Plus className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="pb-5 pl-[64px] pr-6 text-[14.5px] leading-relaxed text-slate-600 sm:pl-[70px]">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Faqs() {
  const { openBookCall } = useModals();
  const [niche, setNiche] = useState<Niche>('gta');

  return (
    <section id="faq" className="py-24 lg:py-32">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <div>
          <h2 className="text-[36px] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[42px]">FAQs</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-slate-600">Pick your niche. If your question isn’t here, ask me on a call.</p>
          <div className="mt-6 flex flex-col gap-2" role="tablist" aria-label="Niche">
            {(Object.keys(NICHES) as Niche[]).map((key) => {
              const ids = [...new Set(videosFor(key).map((v) => v.creatorId))];
              const on = niche === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setNiche(key)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    on ? 'border-[#0066ff]/40 bg-white shadow-[0_10px_30px_-18px_rgba(0,102,255,0.6)]' : 'border-transparent hover:bg-white/70'
                  }`}
                >
                  <span className="flex -space-x-2">
                    {ids.map((id) => (
                      <Avatar key={id} id={id} size={28} />
                    ))}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14px] font-semibold text-slate-900">{NICHES[key].name}</span>
                    <span className="block text-[12.5px] text-slate-500">{NICHES[key].formats.join(', ')}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <Button onClick={openBookCall} className="mt-6">
            Book a call
          </Button>
        </div>
        <FaqList key={niche} items={NICHES[niche].faqs} />
      </Container>
    </section>
  );
}

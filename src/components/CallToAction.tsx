import { VIDEOS, thumb } from '../data/content';
import { useModals } from '../router';
import { Button } from './ui';

// Where each floating thumbnail sits around the card (desktop only).
const SPOTS = [
  { top: '14%', left: '6%', rotate: -7, width: 210 },
  { top: '58%', left: '13%', rotate: 5, width: 200 },
  { top: '10%', left: '28%', rotate: 3, width: 160, faded: true },
  { top: '16%', right: '6%', rotate: 7, width: 210 },
  { top: '60%', right: '12%', rotate: -5, width: 200 },
  { top: '8%', right: '28%', rotate: -3, width: 160, faded: true },
  { bottom: '6%', left: '32%', rotate: -2, width: 150, faded: true },
  { bottom: '8%', right: '33%', rotate: 3, width: 150, faded: true }
];

export function CallToAction() {
  const { openBookCall } = useModals();
  return (
    <section aria-label="Work with me" className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-[#eaf2ff] py-28 lg:py-40">
      <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
        {SPOTS.map(({ faded, rotate, width, ...pos }, i) => (
          <img
            key={i}
            src={thumb(VIDEOS[i % VIDEOS.length].id)}
            alt=""
            loading="lazy"
            className={`absolute aspect-video rounded-xl object-cover shadow-[0_20px_40px_-18px_rgba(15,40,100,0.5)] ${faded ? 'opacity-50 blur-[1px]' : ''}`}
            style={{ ...pos, width, transform: `rotate(${rotate}deg)` }}
          />
        ))}
      </div>
      <div className="relative mx-5 max-w-[480px] rounded-[28px] border border-white bg-white/85 px-8 py-12 text-center shadow-[0_30px_80px_-30px_rgba(0,60,160,0.4)] backdrop-blur-xl sm:mx-auto">
        <img src="/riddle.jpg" alt="" width={56} height={56} className="mx-auto h-14 w-14 rounded-2xl object-cover" />
        <h2 className="mt-6 text-[36px] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[42px]">Work with me</h2>
        <p className="mx-auto mt-3 max-w-[340px] text-[15.5px] leading-relaxed text-slate-600">Book an intro call. Tell me about your channel and the video you’re planning next.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={openBookCall}>Book a call</Button>
          <Button variant="secondary" href="/case-studies">
            View case studies
          </Button>
        </div>
      </div>
    </section>
  );
}

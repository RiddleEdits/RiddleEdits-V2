import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ExternalLink } from 'lucide-react';
import { SITE } from '../data/content';

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
  }
}

const SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
const EMBED_URL = `${SITE.calendly}?hide_event_type_details=1&hide_gdpr_banner=1`;

export function CalendlyScheduler({ height = 680 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = () => {
      if (!ref.current || !window.Calendly) return;
      ref.current.innerHTML = '';
      window.Calendly.initInlineWidget({ url: EMBED_URL, parentElement: ref.current });
    };
    if (window.Calendly) {
      mount();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    }
    const onError = () => setFailed(true);
    script.addEventListener('load', mount);
    script.addEventListener('error', onError);
    return () => {
      script!.removeEventListener('load', mount);
      script!.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <img src="/riddle.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-xl object-cover" />
          <div>
            <p className="text-[14px] font-semibold text-slate-900">Intro call · 30 min</p>
            <p className="text-[12.5px] text-slate-500">Google Meet link sent when you book</p>
          </div>
        </div>
        <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          Open in Calendly <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      {failed ? (
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center" style={{ minHeight: height }}>
          <CalendarDays className="h-10 w-10 text-[#0066ff]" />
          <p className="mt-4 text-[17px] font-semibold text-slate-900">The calendar didn’t load here</p>
          <p className="mt-2 max-w-[320px] text-[14px] text-slate-600">You can still pick a time on Calendly directly.</p>
          <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
            Pick a time <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ) : (
        <div ref={ref} style={{ height, minWidth: 300 }} />
      )}
    </div>
  );
}

import { useEffect, type ReactNode } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { CalendlyScheduler } from './CalendlyScheduler';

function Modal({ onClose, label, children }: { onClose: () => void; label: string; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
      <div className="relative my-auto w-full max-w-4xl animate-fade-up">{children}</div>
    </div>
  );
}

export function VideoModal({ video, onClose }: { video: { id: string; title: string }; onClose: () => void }) {
  return (
    <Modal onClose={onClose} label={video.title}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
          <p className="truncate text-[14px] font-semibold text-slate-900">{video.title}</p>
          <div className="flex shrink-0 gap-1">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open on YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </Modal>
  );
}

export function BookCallModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} label="Book a call">
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
        >
          <X className="h-5 w-5" />
        </button>
        <CalendlyScheduler height={640} />
      </div>
    </Modal>
  );
}

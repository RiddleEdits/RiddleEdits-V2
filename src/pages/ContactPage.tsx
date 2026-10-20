import React, { useState } from 'react';
import { Reveal } from '../lib/Reveal';

const PROJECT_TYPES = ['Long-form retention edit', 'Cinematic / story edit', 'Short-form', 'Full channel package'];

interface FormState {
  name: string;
  contact: string;
  type: string;
  budget: string;
  deadline: string;
  message: string;
}

const initial: FormState = { name: '', contact: '', type: PROJECT_TYPES[0], budget: '', deadline: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) er.name = 'Tell me who you are.';
    if (!form.contact.trim()) er.contact = 'Need a way to reach you — email or @handle.';
    if (form.message.trim().length < 12) er.message = 'A sentence or two about the project helps.';
    return er;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    // Build a prefilled DM so the creator can hit send instantly.
    const text = encodeURIComponent(
      `Hi Riddle! I'm ${form.name} (${form.contact}).\nProject: ${form.type}${form.budget ? ` · Budget: ${form.budget}` : ''}${
        form.deadline ? ` · Deadline: ${form.deadline}` : ''
      }\n\n${form.message}`
    );
    window.open(`https://x.com/compose/post?text=${text}`, '_blank', 'noopener');
    setSent(true);
  };

  const inputCls =
    'w-full rounded-xl bg-white/[0.04] border border-white/12 px-4 py-3.5 text-sm text-secondary placeholder:text-[#9AA8AD]/60 outline-none transition-all duration-300 focus:border-[#2266ff]/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(34,102,255,0.15)]';

  return (
    <div className="pt-32 pb-8 min-h-screen">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-20 items-start">
          {/* Left — pitch */}
          <div>
            <Reveal className="reveal visible">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#2266ff] font-semibold mb-4">Contact</p>
              <h1
                className="font-extrabold text-secondary tracking-tight leading-[1.05]"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
              >
                Let&apos;s make your next upload <span className="text-accent cursor-highlight">your best one.</span>
              </h1>
              <p className="text-[#9AA8AD] text-sm md:text-base mt-6 leading-relaxed max-w-md">
                Send over your raw footage or a rough cut and I&apos;ll reply within 24 hours with availability,
                a plan for the edit, and a fixed quote. No call trees, no agencies — just the editor.
              </p>
            </Reveal>

            <Reveal className="reveal d2 visible mt-10 flex flex-col gap-4">
              <a
                href="https://x.com/RiddlePlayZz"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-row group"
              >
                <span className="contact-row-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.15h3.68l-8.05 9.19L24 22.85h-7.41l-5.8-7.58-6.63 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z"/></svg>
                </span>
                <span>
                  <span className="block text-sm font-bold text-secondary group-hover:text-[#2266ff] transition-colors">@RiddlePlayZz</span>
                  <span className="block text-xs text-[#9AA8AD] mt-0.5">Fastest replies — DMs open</span>
                </span>
              </a>
              <div className="contact-row">
                <span className="contact-row-icon">⚡</span>
                <span>
                  <span className="block text-sm font-bold text-secondary">24-hour response</span>
                  <span className="block text-xs text-[#9AA8AD] mt-0.5">First draft in 3–5 days on standard long-form</span>
                </span>
              </div>
              <div className="contact-row">
                <span className="contact-row-icon">🎬</span>
                <span>
                  <span className="block text-sm font-bold text-secondary">Unlimited-ish revisions</span>
                  <span className="block text-xs text-[#9AA8AD] mt-0.5">Two full revision rounds included, always</span>
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal className="reveal d1 visible">
            <div className="rounded-3xl border border-white/[0.08] bg-[var(--surface)] p-6 sm:p-9 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#2266ff]/10 blur-[80px] pointer-events-none" />
              {sent ? (
                <div className="relative py-16 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#2266ff]/15 border border-[#2266ff]/40 flex items-center justify-center mb-6">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2266ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="font-extrabold text-secondary text-2xl mb-3">Brief ready to send</h2>
                  <p className="text-[#9AA8AD] text-sm max-w-xs mx-auto leading-relaxed">
                    A prefilled DM just opened in X — hit send and I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm(initial); }}
                    className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-[#2266ff] bg-transparent border-0 hover:text-white transition-colors"
                  >
                    Write another brief
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative flex flex-col gap-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#9AA8AD]">Name / channel</span>
                      <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Doodle Arkey" />
                      {errors.name && <span className="text-[11px] text-red-400">{errors.name}</span>}
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#9AA8AD]">Email or @handle</span>
                      <input className={inputCls} value={form.contact} onChange={set('contact')} placeholder="@yourchannel" />
                      {errors.contact && <span className="text-[11px] text-red-400">{errors.contact}</span>}
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#9AA8AD]">Project type</span>
                    <select className={`${inputCls} appearance-none`} value={form.type} onChange={set('type')}>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t} className="bg-[#141414]">{t}</option>)}
                    </select>
                  </label>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#9AA8AD]">Budget (optional)</span>
                      <input className={inputCls} value={form.budget} onChange={set('budget')} placeholder="$300 / video" />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#9AA8AD]">Deadline (optional)</span>
                      <input className={inputCls} value={form.deadline} onChange={set('deadline')} placeholder="Upload Friday" />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#9AA8AD]">The project</span>
                    <textarea
                      className={`${inputCls} min-h-[130px] resize-y`}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="What's the video, how long is the raw footage, and what does success look like?"
                    />
                    {errors.message && <span className="text-[11px] text-red-400">{errors.message}</span>}
                  </label>

                  <button type="submit" className="btn btn-primary justify-center mt-1 w-full">
                    Send the brief →
                  </button>
                  <p className="text-[11px] text-center text-[#9AA8AD]/70 m-0">
                    Opens a prefilled DM on X — nothing is stored on this site.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

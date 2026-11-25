import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { NICHES, SITE, type Niche } from '../data/content';
import { CalendlyScheduler } from './CalendlyScheduler';
import { Container, Eyebrow } from './ui';

const FIELD = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14.5px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0066ff] focus:ring-4 focus:ring-[#0066ff]/10';
const LABEL = 'mb-1.5 block text-[13px] font-semibold text-slate-700';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', channel: '', niche: 'gta' as Niche | 'other', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  // No backend: the form opens the visitor's email app with everything filled in.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const niche = form.niche === 'other' ? 'Other' : NICHES[form.niche].name;
    const subject = `Editing enquiry from ${form.name} (${niche})`;
    const body = `Name: ${form.name}\nChannel: ${form.channel}\nNiche: ${niche}\n\n${form.message}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="pb-24 pt-32 lg:pt-40">
      <Container>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-3 text-[clamp(38px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950">Let’s talk about your channel.</h1>
        <p className="mt-5 max-w-[520px] text-[16.5px] leading-relaxed text-slate-600">Book a 30-minute call, or send me a message and I’ll get back to you by email.</p>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
          <div id="book">
            <CalendlyScheduler />
          </div>

          <div className="flex flex-col gap-4">
            <form onSubmit={submit} className="card flex flex-col gap-4 p-6 sm:p-7">
              <h2 className="text-[19px] font-semibold text-slate-900">Send a message</h2>
              <div>
                <label htmlFor="c-name" className={LABEL}>Your name</label>
                <input id="c-name" required value={form.name} onChange={set('name')} placeholder="e.g. Doodle" className={FIELD} />
              </div>
              <div>
                <label htmlFor="c-channel" className={LABEL}>YouTube channel</label>
                <input id="c-channel" required type="url" value={form.channel} onChange={set('channel')} placeholder="https://youtube.com/@yourchannel" className={FIELD} />
              </div>
              <div>
                <label htmlFor="c-niche" className={LABEL}>Niche</label>
                <select id="c-niche" value={form.niche} onChange={set('niche')} className={FIELD}>
                  {(Object.keys(NICHES) as Niche[]).map((k) => (
                    <option key={k} value={k}>{NICHES[k].name}</option>
                  ))}
                  <option value="other">Something else</option>
                </select>
              </div>
              <div>
                <label htmlFor="c-msg" className={LABEL}>What are you working on?</label>
                <textarea id="c-msg" rows={4} value={form.message} onChange={set('message')} placeholder="Video idea, upload schedule, deadline, style references…" className={`${FIELD} resize-y`} />
              </div>
              <button type="submit" className="btn btn-primary mt-1 w-full">
                Send <Send className="h-4 w-4" />
              </button>
              <p className="text-center text-[12.5px] text-slate-500">This opens your email app with the message ready to send.</p>
            </form>

            <a href={`mailto:${SITE.email}`} className="card flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-slate-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066ff]">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[13px] text-slate-500">Or email me directly</span>
                <span className="block text-[14.5px] font-semibold text-slate-900">{SITE.email}</span>
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

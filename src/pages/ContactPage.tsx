import type { ReactNode } from 'react';
import { useRef, useState, type FormEvent } from 'react';
import { SITE, VIDEO_TYPES } from '../data/content';
import { Label } from '../components/Chrome';

type Fields = { name: string; email: string; channel: string; type: string; brief: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: Fields = { name: '', email: '', channel: '', type: '', brief: '' };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Tell me your name.';
  if (!f.email.trim()) e.email = 'I need an email to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'That email doesn’t look right.';
  const ch = f.channel.trim();
  if (!ch) e.channel = 'Add your channel or a link to the project.';
  else if (!/^@[\w.-]{2,}$/.test(ch) && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/i.test(ch))
    e.channel = 'Use a link (youtube.com/@you) or a handle (@you).';
  if (!f.type) e.type = 'Pick the closest match.';
  if (f.brief.trim().length < 20) e.brief = 'A couple of sentences helps (20 characters or more).';
  return e;
}

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: keyof Fields;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[14px] font-medium text-ink">
        {label}
        {hint && <span className="font-mono text-[11px] font-normal text-ink-3">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-[#c62f2f]">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactPage() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [sentTo, setSentTo] = useState('');
  const honey = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(f));
  };
  const a11y = (k: keyof Fields) => ({
    id: k,
    name: k,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
    onBlur: blur(k),
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    setTouched({ name: true, email: true, channel: true, type: true, brief: true });
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    if (honey.current?.value) return; // a bot filled the hidden field
    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.trim(),
          channel: f.channel.trim(),
          'video type': f.type,
          brief: f.brief.trim(),
          _subject: `New project brief from ${f.name.trim()}`,
          _replyto: f.email.trim(),
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
      if (res.ok && String(data.success) === 'true') {
        setSentTo(f.email.trim());
        setStatus('sent');
        setF(EMPTY);
        setTouched({});
      } else {
        setServerMsg(data.message ?? `The form service answered with an error (${res.status}).`);
        setStatus('error');
      }
    } catch {
      setServerMsg('Couldn’t reach the form service. Check your connection and try again.');
      setStatus('error');
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* the address stays selectable */
    }
  };

  return (
    <div className="pb-28 pt-32 md:pt-44">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Label>Contact</Label>
          <h1 className="mt-6 text-[48px] font-semibold leading-[1] tracking-[-0.05em] text-ink md:text-[76px]">
            Have a video <span className="serif-accent">in mind?</span>
          </h1>
          <p className="mt-6 max-w-[420px] text-[18px] leading-relaxed text-ink-2">
            Send a short brief about the channel and the video. I read every message myself and reply with next steps.
          </p>

          <ul className="mt-12 border-t border-line">
            <li className="flex items-center justify-between gap-4 border-b border-line py-5">
              <div className="min-w-0">
                <p className="label !text-[10.5px]">Email</p>
                <a href={`mailto:${SITE.email}`} className="mt-1 block select-all truncate text-[17px] font-medium text-ink hover:text-blue">
                  {SITE.email}
                </a>
              </div>
              <button type="button" onClick={copyEmail} className="shrink-0 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3 hover:text-ink">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </li>
            <li className="border-b border-line py-5">
              <p className="label !text-[10.5px]">Call</p>
              <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[17px] font-medium text-ink hover:text-blue">
                Book a 30 minute call ↗
              </a>
            </li>
            {SITE.socials.map((s) => (
              <li key={s.url} className="border-b border-line py-5">
                <p className="label !text-[10.5px]">{s.label}</p>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[17px] font-medium text-ink hover:text-blue">
                  {s.handle} ↗
                </a>
              </li>
            ))}
            <li className="border-b border-line py-5">
              <p className="label !text-[10.5px]">Discord</p>
              <p className="mt-1 select-all text-[17px] font-medium text-ink">{SITE.discord}</p>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          {status === 'sent' ? (
            <div role="status" className="page-in rounded-[8px] bg-mist px-8 py-14 md:px-12">
              <p className="label text-blue">Brief received</p>
              <h2 className="mt-5 text-[34px] font-semibold tracking-[-0.035em] text-ink">Thanks, it’s on its way.</h2>
              <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-ink-2">
                I’ll reply to <span className="font-medium text-ink">{sentTo}</span>. If it’s urgent, book a call and we can talk it through.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Book a call
                </a>
                <button type="button" onClick={() => setStatus('idle')} className="btn btn-quiet">
                  Send another brief
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="grid gap-7" aria-describedby="form-note">
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="name" label="Name" error={touched.name ? errors.name : undefined}>
                  <input {...a11y('name')} className="field" autoComplete="name" value={f.name} onChange={set('name')} placeholder="Your name" />
                </Field>
                <Field id="email" label="Email" error={touched.email ? errors.email : undefined}>
                  <input
                    {...a11y('email')}
                    type="email"
                    className="field"
                    autoComplete="email"
                    value={f.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <Field id="channel" label="Channel or project link" error={touched.channel ? errors.channel : undefined}>
                <input
                  {...a11y('channel')}
                  className="field"
                  inputMode="url"
                  value={f.channel}
                  onChange={set('channel')}
                  placeholder="youtube.com/@yourchannel"
                />
              </Field>
              <Field id="type" label="Type of video" error={touched.type ? errors.type : undefined}>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="type">
                  {VIDEO_TYPES.map((t) => {
                    const on = f.type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          const next = { ...f, type: t };
                          setF(next);
                          setTouched((x) => ({ ...x, type: true }));
                          setErrors(validate(next));
                        }}
                        className={`rounded-full px-4 py-2 text-[14px] transition ${
                          on ? 'bg-ink text-white' : 'text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-ink hover:shadow-[inset_0_0_0_1px_var(--color-ink)]'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field id="brief" label="Project brief" hint={`${f.brief.trim().length} chars`} error={touched.brief ? errors.brief : undefined}>
                <textarea
                  {...a11y('brief')}
                  rows={6}
                  className="field resize-y leading-relaxed"
                  value={f.brief}
                  onChange={set('brief')}
                  placeholder="What’s the video, how long is the footage, and when does it need to go up?"
                />
              </Field>
              {/* hidden from people, tempting to bots */}
              <input ref={honey} type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              {status === 'error' && (
                <div role="alert" className="rounded-[6px] border border-[#f1c8c8] bg-[#fdf3f3] px-5 py-4 text-[14.5px] leading-relaxed text-[#8e2626]">
                  {serverMsg} You can also email me at{' '}
                  <a href={`mailto:${SITE.email}`} className="font-medium underline">
                    {SITE.email}
                  </a>
                  .
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
                <p id="form-note" className="max-w-[320px] text-[13px] leading-relaxed text-ink-3">
                  Sent straight to my inbox. No newsletter, no follow-up sequences.
                </p>
                <button type="submit" disabled={status === 'sending'} className="btn btn-primary min-w-[160px] disabled:opacity-70">
                  {status === 'sending' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    'Send brief'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

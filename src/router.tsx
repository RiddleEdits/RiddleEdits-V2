import React, { createContext, useContext, useEffect, useState } from 'react';

const EVENT = 'app:navigate';

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState(null, '', to);
  window.dispatchEvent(new Event(EVENT));
}

function scrollForLocation() {
  const hash = window.location.hash.slice(1);
  requestAnimationFrame(() => {
    const el = hash ? document.getElementById(hash) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0 });
  });
}

/** Current pathname, normalised without a trailing slash. */
export function usePath() {
  const read = () => window.location.pathname.replace(/\/+$/, '') || '/';
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onNav = () => {
      setPath(read());
      scrollForLocation();
    };
    const onPop = () => setPath(read());
    window.addEventListener(EVENT, onNav);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener(EVENT, onNav);
      window.removeEventListener('popstate', onPop);
    };
  }, []);
  return path;
}

/** <a> that navigates in-app for internal paths and opens a new tab for external ones. */
export function Link({ href, children, onClick, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const external = /^(https?:|mailto:)/.test(href);
  return (
    <a
      href={href}
      {...(external && !href.startsWith('mailto:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || external || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

interface Modals {
  openVideo: (id: string, title: string) => void;
  openBookCall: () => void;
}

export const ModalContext = createContext<Modals>({ openVideo: () => {}, openBookCall: () => {} });
export const useModals = () => useContext(ModalContext);

import { createContext, useCallback, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

/**
 * A small client-side router. Each URL also exists as a real index.html (see vite.config.ts),
 * so direct links and refreshes load the right page on GitHub Pages.
 */

const RAW_BASE = import.meta.env.BASE_URL;
/** "/RiddleEdits-V2/" in production, "/" in dev. A relative base (single-file preview) acts like "/". */
export const BASE = RAW_BASE.startsWith('/') ? RAW_BASE : '/';

const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/** Browser pathname → app path like "/work/some-slug/". */
function toAppPath(pathname: string) {
  if (!RAW_BASE.startsWith('/')) return '/';
  const p = pathname.replace(/index\.html$/, '');
  if (!p.toLowerCase().startsWith(BASE.toLowerCase())) return '/';
  return withSlash('/' + p.slice(BASE.length));
}

/** App path → real href including the base. */
export const href = (to: string) => {
  const [path, hash] = to.split('#');
  const clean = path === '/' ? '' : withSlash(path).replace(/^\//, '');
  return `${BASE}${clean}${hash ? `#${hash}` : ''}`;
};

interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}

const Ctx = createContext<RouterValue>({ path: '/', navigate: () => {} });

function scrollToHash(hash: string) {
  const el = hash ? document.getElementById(hash) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => toAppPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(toAppPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    if (window.location.hash) setTimeout(() => scrollToHash(window.location.hash.slice(1)), 250);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback(
    (to: string) => {
      const [p, hash = ''] = to.split('#');
      const next = withSlash(p || path);
      if (next !== path) {
        try {
          window.history.pushState(null, '', href(to));
        } catch {
          // sandboxed previews and file:// refuse URL changes; the page still switches
        }
        setPath(next);
        setTimeout(() => scrollToHash(hash), hash ? 150 : 0);
      } else {
        scrollToHash(hash);
      }
    },
    [path],
  );

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>;
}

export const useRouter = () => useContext(Ctx);

export function Link({ to, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter();
  return (
    <a
      href={href(to)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    />
  );
}

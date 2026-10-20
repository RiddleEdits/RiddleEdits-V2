import React, { useEffect, useRef } from 'react';

/**
 * Lightweight scroll-reveal wrapper. Adds the `visible` class when the
 * element enters the viewport, reusing the CSS reveal transitions defined
 * in index.css (reveal / reveal-left / reveal-right / reveal-scale + d1..d6).
 */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, className = 'reveal' }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/** Scrolls to the top of the page whenever the route changes. */
export function useScrollTopOnRouteChange(key: unknown) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [key]);
}

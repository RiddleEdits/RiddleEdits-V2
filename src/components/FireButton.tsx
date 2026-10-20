import React, { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface Wave {
  id: number;
  x: number;
  y: number;
}

const Flame: React.FC<{ active: boolean }> = ({ active }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        xDrift: (Math.random() - 0.5) * 14,
        delay: Math.random() * 0.6,
        size: 2.2 + Math.random() * 3.8,
        duration: 0.45 + Math.random() * 0.4,
        color: Math.random() > 0.4 ? '#FFB800' : Math.random() > 0.5 ? '#FF6B2C' : '#FF4500',
      })),
    []
  );

  return (
    <div className="relative w-5 h-6 z-10 flex-shrink-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            bottom: 2,
            left: '50%',
            marginLeft: -p.size / 2,
            background: `radial-gradient(circle, ${p.color}, ${p.color}88, transparent)`,
            boxShadow: active ? `0 0 ${p.size + 2}px ${p.color}aa` : 'none',
          }}
          animate={{
            y: [0, -18 - Math.random() * 12],
            x: [0, p.xDrift],
            opacity: [active ? 0.95 : 0.55, 0],
            scale: [active ? 1.3 : 0.75, 0],
          }}
          transition={{ duration: active ? p.duration * 0.7 : p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{
          width: 12,
          height: 18,
          marginLeft: -6,
          borderRadius: '50% 50% 30% 30%',
          background: 'radial-gradient(ellipse at 50% 70%, #FF6B2C 0%, #FF4500 40%, transparent 80%)',
          filter: active ? 'brightness(1.6) blur(1.5px)' : 'brightness(1) blur(1px)',
        }}
        animate={{ scaleX: [1, 1.25, 0.85, 1.15, 1], scaleY: [1, 0.9, 1.15, 0.95, 1], rotate: [0, -3, 3, -2, 0] }}
        transition={{ duration: active ? 0.3 : 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{
          width: 7,
          height: 12,
          marginLeft: -3.5,
          borderRadius: '50% 50% 30% 30%',
          background: 'radial-gradient(ellipse at 50% 80%, #FFFBE6 0%, #FFD700 30%, #FFB800 60%, transparent 90%)',
          filter: active ? 'brightness(1.8) blur(0.5px)' : 'brightness(1.2) blur(0.5px)',
        }}
        animate={{ scaleX: [1, 0.8, 1.2, 0.9, 1], scaleY: [1, 1.2, 0.85, 1.1, 1], y: [0, -1, 1, -0.5, 0] }}
        transition={{ duration: active ? 0.25 : 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1 left-1/2 pointer-events-none"
        style={{
          width: 16,
          height: 6,
          marginLeft: -8,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,107,44,0.4), transparent)',
          filter: 'blur(2px)',
        }}
        animate={{ opacity: active ? [0.6, 0.9, 0.6] : [0.2, 0.35, 0.2], scaleX: active ? [1, 1.2, 1] : [0.8, 1, 0.8] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

const ClickWaves: React.FC<{ waves: Wave[] }> = ({ waves }) => {
  if (waves.length === 0 || typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {waves.map((w) => (
        <div key={w.id} className="absolute" style={{ left: w.x, top: w.y }}>
          <motion.div
            className="absolute rounded-full"
            style={{
              translateX: '-50%',
              translateY: '-50%',
              border: '1px solid rgba(80, 140, 255, 0.6)',
              background: 'radial-gradient(circle, rgba(34, 102, 255, 0.1) 0%, transparent 70%)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.85 }}
            animate={{ width: 800, height: 800, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full bg-white/40"
            style={{ translateX: '-50%', translateY: '-50%' }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 14, height: 14, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export interface CookCTAProps {
  id?: string;
  className?: string;
  label?: string;
  to?: string; // internal route (uses Link)
  href?: string; // external link
}

/** "Let's cook now!" glowing flame CTA. Routes internally or externally. */
export const CookCTA: React.FC<CookCTAProps> = ({
  id,
  className = '',
  label = "Let's cook now!",
  to,
  href = 'https://x.com/RiddlePlayZz',
}) => {
  const [active, setActive] = useState(false);
  const [waves, setWaves] = useState<Wave[]>([]);

  const spawnWave = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById(id || 'cook-cta-anchor');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const wid = Date.now() + Math.random();
      setWaves((prev) => [...prev, { id: wid, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
      setTimeout(() => setWaves((prev) => prev.filter((w) => w.id !== wid)), 1000);
    });
  }, [id]);

  const inner = (
    <>
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <span className="relative z-10 flex items-center justify-center flex-shrink-0" style={{ width: 20, height: 20 }}>
        <span className="absolute" style={{ bottom: -2 }}>
          <Flame active={active} />
        </span>
      </span>
      <span className="relative z-10 leading-none">{label}</span>
      <svg className="relative z-10 flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  const cls = `w-[285px] h-[50px] inline-flex items-center justify-center font-semibold uppercase tracking-wider text-white cursor-pointer select-none no-underline relative z-10 btn-glow px-8 py-4 text-sm rounded-full gap-3 box-border ${className}`;
  const handlers = {
    onMouseEnter: () => setActive(true),
    onMouseLeave: () => setActive(false),
    onClick: spawnWave,
  };
  const anim = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.93 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  };

  return (
    <>
      <ClickWaves waves={waves} />
      <div className="relative inline-flex items-center justify-center">
        {to ? (
          <motion.div id={id || 'cook-cta-anchor'} className={cls} {...handlers} {...anim}>
            <Link to={to} className="absolute inset-0 no-underline" aria-label={label} />
            {inner}
          </motion.div>
        ) : (
          <motion.a
            id={id || 'cook-cta-anchor'}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={cls}
            tabIndex={0}
            {...handlers}
            {...anim}
          >
            {inner}
          </motion.a>
        )}
      </div>
    </>
  );
};

export const FireButton: React.FC<CookCTAProps> = CookCTA;
export const FireButtonLink: React.FC<CookCTAProps> = CookCTA;

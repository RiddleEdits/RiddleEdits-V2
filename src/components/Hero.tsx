import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { FireButton } from './FireButton';

export { FireButton };

/** Subtle 3D parallax tilt driven by pointer position. */
function useTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-1, 1], [-maxDeg, maxDeg]);
  const rotateX = useTransform(sy, [-1, 1], [maxDeg, -maxDeg]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, py]);

  return { ref, rotateX, rotateY };
}

const ScrambleText: React.FC<{ text: string; className?: string; startDelay?: number }> = ({
  text,
  className = '',
  startDelay = 350,
}) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ▚▞░▒█/\\<>—';
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    let raf: number;
    const total = 28;
    const timer = setTimeout(() => {
      const tick = () => {
        frame += 1;
        const progress = frame / total;
        const next = text
          .split('')
          .map((c, i) => {
            if (c === ' ') return ' ';
            if (i / text.length < progress) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        setDisplay(next);
        if (frame < total) raf = requestAnimationFrame(tick);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className}>{display}</span>;
};

export const Hero: React.FC = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const { ref: tiltRef, rotateX, rotateY } = useTilt(4);

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const words = useMemo(() => ['Editing', 'Intentionally.'], []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" id="top">
      {/* Background YouTube showcase video with bottom fade mask */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
          opacity: isVideoVisible ? 1 : 0,
        }}
      >
        <iframe
          className="absolute top-1/2 left-1/2 w-[100vw] min-w-[177.77vh] h-[56.25vw] min-h-[100vh] -translate-x-1/2 -translate-y-1/2 object-cover border-0 pointer-events-none"
          src="https://www.youtube.com/embed/5EAMyKkARdA?autoplay=1&mute=1&controls=0&loop=1&playlist=5EAMyKkARdA&playsinline=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1"
          title="Featured edit — autoplay preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setIsVideoVisible(true)}
        />
      </div>

      {/* Dark cinematic gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(21,21,21,0.88) 0%, rgba(21,21,21,0.6) 45%, rgba(15,15,15,0.75) 75%, rgba(10,10,10,0.95) 90%, #0a0a0a 100%)',
        }}
      />

      {/* Ambient electric-blue orbs */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-[500px] h-[500px] bg-[#2266ff]/8 rounded-full blur-[140px] pointer-events-none"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[10%] w-[300px] h-[300px] bg-[#2266ff]/5 rounded-full blur-[100px] pointer-events-none"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Central content — subtle interactive 3D tilt */}
      <div ref={tiltRef} className="relative z-10 text-center px-6 max-w-4xl" style={{ perspective: 1000 }}>
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
          <motion.p
            className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#2266ff] font-semibold mb-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            Video Editor · Retention-first storytelling
          </motion.p>

          <h1
            className="font-extrabold text-secondary leading-[1.0] tracking-tight mt-7 mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', perspective: 800 }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrambleText text={words[0]} />
            </motion.span>
            <motion.span
              className="cursor-highlight inline-block text-glow text-accent"
              style={{ color: 'rgb(34, 102, 255)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrambleText text={words[1]} startDelay={750} />
            </motion.span>
          </h1>

          <motion.p
            className="font-normal text-xs md:text-sm text-secondary/60 tracking-wide"
            style={{ marginTop: '24px', marginBottom: '32px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            hire someone with your vision.
          </motion.p>

          <motion.div
            className="mt-1"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
          >
            <FireButton to="/contact" label="Start a project" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#f3f3f3]/20 font-medium">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[#f3f3f3]/15 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-1 bg-[#2266ff] rounded-full"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

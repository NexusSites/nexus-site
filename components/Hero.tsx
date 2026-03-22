/**
 * Hero — scroll-driven sticky experience.
 *
 * Section is 600vh tall. The inner viewport is sticky so
 * everything stays on screen while the user scrolls.
 *
 * Phases:
 *   0.00 – 0.35  →  N assembles, "מי אנחנו?" + body text reveal
 *   0.35 – 0.50  →  Gate zoom, hero text fades out
 *   0.50 – 0.65  →  Diagonal slab straightens & fills screen (white)
 *   0.60 – 1.00  →  Services content appears on the white slab
 */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });
const MatrixRain = dynamic(() => import('./MatrixRain'), { ssr: false });

const EXPO = [0.19, 1, 0.22, 1] as const;

/* ── Typing text ── */
const HERO_TEXT = 'שלום, החיפוש שלך נגמר.\nברוך הבא לאתר החדש שלך.';

/* Human-like per-character delay in ms */
function typingDelay(ch: string) {
  if (ch === '\n') return 600;
  if (ch === ' ') return 60 + Math.random() * 40;
  if (ch === ',') return 200 + Math.random() * 100;
  if (ch === '.') return 300 + Math.random() * 100;
  return 55 + Math.random() * 45;
}

/* Body words to reveal one by one */
const WORDS = [
  'אנחנו', 'CODE', '—', 'צוות', 'של',
  'מעצבים', 'ומפתחים', 'שבונים', 'חוויות', 'דיגיטליות',
  'שמניעות', 'עסקים', 'קדימה.',
];

/* Services steps */
const STEPS = [
  { num: '01', title: 'ניתוח ואסטרטגיה', desc: 'מבינים את העסק, השוק, והמתחרים. מגדירים יעדים ובונים מפת דרכים ברורה.' },
  { num: '02', title: 'עיצוב וחווית משתמש', desc: 'ממשק שמוביל את המבקר בדיוק לאן שצריך. לוגיקת המרה, לא אסתטיקה בלבד.' },
  { num: '03', title: 'פיתוח והשקה', desc: 'קוד נקי, ביצועים מקסימליים. אתר חי ועובד — בדרך כלל מתחת לשבועיים.' },
  { num: '04', title: 'צמיחה מתמשכת', desc: 'SEO, ניתוח נתונים ושיפור שוטף. יום ההשקה הוא נקודת ההתחלה.' },
] as const;

function clamp01(t: number) { return Math.min(1, Math.max(0, t)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* Per-word blur+opacity based on scroll progress */
function wordStyle(wordIndex: number, total: number, progress: number, startOffset = 0.08, range = 0.7) {
  const band  = range / total;
  const start = startOffset + wordIndex * band;
  const end   = start + band * 1.4;
  const p     = clamp01((progress - start) / (end - start));
  return {
    opacity: p,
    filter:  `blur(${(1 - p) * 10}px)`,
    transition: 'opacity 0.1s, filter 0.1s',
  };
}

export default function Hero({ ready = false }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showText, setShowText]   = useState(false);
  const [tvOn, setTvOn]           = useState(false);
  const [tvContent, setTvContent] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
  const [viewSize, setViewSize] = useState({ w: 0, h: 0 });

  /* ── Track mouse inside sticky viewport ── */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!stickyRef.current) return;
    const rect = stickyRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  /* ── Track viewport size for canvas ── */
  useEffect(() => {
    const update = () => setViewSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ── TV turn-on → typing animation ── */
  useEffect(() => {
    if (!ready) return;
    // Phase 1: TV flickers on (scaleY expands)
    const t1 = setTimeout(() => setTvOn(true), 100);
    // Phase 2: content appears after TV is on
    const t2 = setTimeout(() => setTvContent(true), 550);
    // Phase 3: start typing after content is visible
    const timers: ReturnType<typeof setTimeout>[] = [t1, t2];
    let elapsed = 750;

    for (let i = 0; i < HERO_TEXT.length; i++) {
      elapsed += typingDelay(HERO_TEXT[i]);
      timers.push(setTimeout(() => setTypedChars(i + 1), elapsed));
    }

    return () => timers.forEach(clearTimeout);
  }, [ready]);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const scrolled   = -top;
      const scrollable = height - window.innerHeight;
      const p = clamp01(scrolled / scrollable);
      setProgress(p);
      setShowText(p > 0.04);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Hero intro text fades out before gate phase */
  const heroTextFade = 1 - clamp01((progress - 0.28) / 0.10);

  /* Heading — appears on the slab, starts diagonal, straightens */
  const SLASH_DEG = -68.75; // 90 - atan2(0.35, 0.9)*180/PI — matches slash from horizontal
  const headingOpacity = clamp01((progress - 0.42) / 0.06);
  const straightenT = clamp01((progress - 0.50) / 0.15);
  const headingRotation = SLASH_DEG * (1 - straightenT);
  /* Steps overlay — appears after heading settles */
  const stepsOpacity = clamp01((progress - 0.66) / 0.06);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-black"
      style={{ height: '600vh' }}
    >
      {/* ── Sticky viewport ── */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden" onMouseMove={onMouseMove}>

        {/* Full-screen N canvas */}
        <HeroCanvas progress={progress} />

        {/* ── Matrix rain — revealed only by flashlight ── */}
        <div
          className="absolute inset-0 z-[4]"
          style={{
            opacity: showText ? 0 : 1,
            transition: 'opacity 0.6s',
            pointerEvents: 'none',
            maskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
          }}
        >
          {viewSize.w > 0 && <MatrixRain width={viewSize.w} height={viewSize.h} />}
        </div>

        {/* ── Typing text inside terminal window ── */}
        <motion.div
          className="absolute inset-0 z-[5] flex items-center justify-center"
          animate={{ opacity: showText ? 0 : 0.85, y: showText ? -30 : 0 }}
          transition={{ duration: 0.6, ease: EXPO }}
          style={{ pointerEvents: 'none' }}
        >
          {/* Terminal frame — TV turn-on effect */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-2xl border border-white/10"
            initial={{ scaleY: 0.005, scaleX: 0.6, opacity: 0 }}
            animate={{
              scaleY: tvOn ? 1 : 0.005,
              scaleX: tvOn ? 1 : 0.6,
              opacity: tvOn ? 1 : 0.8,
            }}
            transition={{
              scaleY: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
              scaleX: { duration: 0.6, ease: EXPO },
              opacity: { duration: 0.15 },
            }}
            style={{
              width: 'clamp(320px, 42vw, 560px)',
              background: 'rgba(17, 17, 17, 0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Title bar */}
            <motion.div
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: tvContent ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="w-3 h-3 rounded-full bg-white/20" />
              <span className="w-3 h-3 rounded-full bg-white/20" />
              <span className="w-3 h-3 rounded-full bg-white/20" />
              <span className="flex-1 text-center text-[0.65rem] text-white/30 tracking-wider font-mono">code.tsx</span>
            </motion.div>
            {/* Text area */}
            <div
              className="p-5 text-center"
              dir="rtl"
              style={{ height: `${HERO_TEXT.split('\n').length * 2.4 + 1}em` }}
            >
              {HERO_TEXT.split('\n').map((line, li) => {
                const lineStart = HERO_TEXT.split('\n').slice(0, li).join('\n').length + (li > 0 ? 1 : 0);
                const lineEnd = lineStart + line.length;
                const visibleCount = Math.max(0, Math.min(line.length, typedChars - lineStart));
                if (visibleCount === 0 && typedChars <= lineStart) return <div key={li} className="h-[2.4em]" />;

                const cursorHere = typedChars > lineStart && typedChars <= lineEnd;

                return (
                  <div
                    key={li}
                    className="text-white font-light tracking-wide leading-[2.4]"
                    style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)' }}
                  >
                    {line.slice(0, visibleCount)}
                    {cursorHere && (
                      <motion.span
                        className="inline-block w-[2px] h-[1em] bg-white/80 ml-[2px] align-middle"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Hero intro text — fades out before gate ── */}
        <div style={{ opacity: heroTextFade, transition: 'opacity 0.15s' }}>
          {/* Top-right: title word-by-word blur reveal */}
          <div className="absolute top-24 right-10 md:right-14 z-10 text-right">
            <h2
              className="font-black text-white leading-[1.05] tracking-[-0.03em] flex gap-4 justify-end"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)' }}
            >
              {['מי', 'אנחנו?'].map((word, i) => (
                <span key={i} style={wordStyle(i, 2, progress, 0.02, 0.12)}>
                  {word}
                </span>
              ))}
            </h2>
          </div>

          {/* Below title: body text blur reveal */}
          <div className="absolute top-44 right-10 md:right-14 z-10 max-w-[320px] md:max-w-md">
            <p className="text-base md:text-lg font-light leading-[2.2] text-white flex flex-wrap gap-x-2 justify-end">
              {WORDS.map((word, i) => (
                <span key={i} style={wordStyle(i, WORDS.length, progress, 0.06, 0.18)}>
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* ── White background overlay — appears during slab phase ── */}
        <div
          className="absolute inset-0 z-10 bg-white"
          style={{
            opacity: clamp01((progress - 0.50) / 0.15),
            pointerEvents: 'none',
          }}
        />

        {/* ── Heading — starts centered on slab, moves up when steps appear ── */}
        <h2
          className="absolute z-20 font-black text-[#111] text-center tracking-[-0.04em] leading-[1.0] left-1/2"
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
            opacity: headingOpacity,
            top: `${lerp(50, 18, clamp01((progress - 0.64) / 0.06))}%`,
            transform: `translate(-50%, -50%) rotate(${headingRotation}deg) scale(${lerp(0.3, 1.3, clamp01((progress - 0.42) / 0.28))})`,
            pointerEvents: headingOpacity > 0.1 ? 'auto' : 'none',
          }}
        >
          מה אנחנו<br />עושים?
        </h2>

        {/* ── Steps — fade in after heading settles ── */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center px-6 md:px-12 pt-[22vh]"
          style={{
            opacity: stepsOpacity,
            pointerEvents: stepsOpacity > 0.1 ? 'auto' : 'none',
          }}
        >
          <div
            className="w-full max-w-2xl"
          >
            {STEPS.map((step, i) => {
              const stepOpacity = clamp01((progress - (0.70 + i * 0.03)) / 0.04);
              return (
                <div
                  key={step.num}
                  className="flex items-start gap-6 md:gap-10 py-3 md:py-4 border-b border-[#111]/10"
                  style={{
                    opacity: stepOpacity,
                    transform: `translateY(${(1 - stepOpacity) * 20}px)`,
                  }}
                >
                  <span
                    className="font-black text-[#111]/15 shrink-0 leading-none tabular-nums"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                    dir="ltr"
                  >
                    {step.num}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3
                      className="font-bold text-[#111] tracking-[-0.02em] leading-tight mb-1"
                      style={{ fontSize: 'clamp(1rem, 2.2vw, 1.5rem)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[#111]/45 font-light leading-relaxed text-xs md:text-sm max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint — follows cursor */}
        <motion.div
          className="absolute z-[6] pointer-events-none"
          animate={{
            opacity: showText ? 0 : 1,
          }}
          transition={{ duration: 0.4, ease: EXPO }}
          style={{
            left: mouse.x + 20,
            top: mouse.y + 20,
          }}
        >
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 flex items-center gap-2.5">
            <span className="text-xs tracking-[0.2em] uppercase text-white font-semibold whitespace-nowrap">
              Scroll down
            </span>
            <motion.span
              className="text-white/80 text-sm"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

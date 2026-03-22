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

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

const EXPO = [0.19, 1, 0.22, 1] as const;

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

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showText, setShowText]   = useState(false);

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
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Full-screen N canvas */}
        <HeroCanvas progress={progress} />

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

        {/* Scroll hint — fades out once scrolling starts */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
          animate={{ opacity: showText ? 0 : 1, y: showText ? -10 : 0 }}
          transition={{ duration: 0.5, ease: EXPO }}
        >
          <span className="text-[0.65rem] tracking-[0.25em] uppercase text-white/40 font-medium">
            Scroll to explore
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

      </div>
    </section>
  );
}

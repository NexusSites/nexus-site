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

/* ── Typing messages — cycle with delete effect ── */
const HERO_MESSAGES = [
  'שלום, החיפוש שלך נגמר.\nברוך הבא לאתר החדש שלך.',
  'עיצוב שמדבר.\nפיתוח שעובד.',
  'אנחנו CODE.\nהצוות שלך לדיגיטל.',
  'חוויה דיגיטלית\nשמניעה עסקים קדימה.',
];

/* Max lines across all messages for fixed height */
const MAX_MSG_LINES = Math.max(...HERO_MESSAGES.map(m => m.split('\n').length));

/* Human-like per-character delay in ms */
function typingDelay(ch: string) {
  if (ch === '\n') return 600;
  if (ch === ' ') return 60 + Math.random() * 40;
  if (ch === ',') return 200 + Math.random() * 100;
  if (ch === '.') return 300 + Math.random() * 100;
  return 55 + Math.random() * 45;
}

/* Faster delete speed */
const DELETE_DELAY = 25;

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

export default function Hero({ ready = false, onUnlock }: { ready?: boolean; onUnlock?: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showText, setShowText]   = useState(false);
  const [clicked, setClicked]     = useState(false);
  const [tvOn, setTvOn]           = useState(false);
  const [tvContent, setTvContent] = useState(false);
  const [msgIdx, setMsgIdx]       = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
  const [viewSize, setViewSize] = useState({ w: 0, h: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  /* ── Track mouse inside sticky viewport ── */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!stickyRef.current) return;
    const rect = stickyRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  /* ── Touch = flashlight follows finger ── */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!stickyRef.current) return;
    const rect = stickyRef.current.getBoundingClientRect();
    const t = e.touches[0];
    setMouse({ x: t.clientX - rect.left, y: t.clientY - rect.top });
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!stickyRef.current) return;
    const rect = stickyRef.current.getBoundingClientRect();
    const t = e.touches[0];
    setMouse({ x: t.clientX - rect.left, y: t.clientY - rect.top });
  }, []);
  const onTouchEnd = useCallback(() => {
    setMouse({ x: -9999, y: -9999 });
  }, []);

  /* ── Track viewport size for canvas ── */
  useEffect(() => {
    const update = () => setViewSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ── TV turn-on — triggered by click ── */
  useEffect(() => {
    if (!clicked) return;
    const t1 = setTimeout(() => setTvOn(true), 100);
    const t2 = setTimeout(() => setTvContent(true), 550);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [clicked]);

  /* ── Type → pause → delete → next message loop ── */
  useEffect(() => {
    if (!ready || !tvContent) return;
    const text = HERO_MESSAGES[msgIdx];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    // Phase 1: type in
    for (let i = 0; i < text.length; i++) {
      elapsed += typingDelay(text[i]);
      timers.push(setTimeout(() => setTypedChars(i + 1), elapsed));
    }

    // Phase 2: pause
    elapsed += 2000;

    // Phase 3: delete
    for (let i = text.length; i >= 0; i--) {
      elapsed += DELETE_DELAY;
      timers.push(setTimeout(() => setTypedChars(i), elapsed));
    }

    // Phase 4: move to next message
    elapsed += 400;
    timers.push(setTimeout(() => {
      setMsgIdx((msgIdx + 1) % HERO_MESSAGES.length);
    }, elapsed));

    return () => timers.forEach(clearTimeout);
  }, [ready, tvContent, msgIdx]);

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
  /* Steps overlay — starts appearing while heading is almost in place */
  const stepsOpacity = clamp01((progress - 0.66) / 0.06);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-black"
      style={{ height: '1400vh' }}
    >
      {/* ── Sticky viewport ── */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden" onMouseMove={onMouseMove} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

        {/* Full-screen N canvas */}
        <HeroCanvas progress={progress} />

        {/* ── Matrix rain — revealed by flashlight (mouse or touch) ── */}
        <div
          className="absolute inset-0 z-[4]"
          style={{
            opacity: !clicked || showText ? 0 : 1,
            transition: 'opacity 0.6s',
            pointerEvents: 'none',
            maskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
          }}
        >
          {viewSize.w > 0 && <MatrixRain width={viewSize.w} height={viewSize.h} />}
        </div>

        {/* ── Typing text inside terminal window — appears after click ── */}
        <motion.div
          className="absolute inset-0 z-[5] flex items-center justify-center"
          animate={{ opacity: !clicked ? 0 : showText ? 0 : 0.85, y: showText ? -30 : 0 }}
          transition={{ duration: 0.6, ease: EXPO }}
          style={{ pointerEvents: 'none' }}
        >
          {/* Terminal frame — app open effect */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-2xl border border-white/10"
            initial={{ scale: 0.15, opacity: 0, borderRadius: '22px', y: 20 }}
            animate={{
              scale: tvOn ? 1 : 0.15,
              opacity: tvOn ? 1 : 0,
              borderRadius: tvOn ? '12px' : '22px',
              y: tvOn ? 0 : 20,
            }}
            transition={{
              scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
              opacity: { duration: 0.2 },
              borderRadius: { duration: 0.4, ease: EXPO },
              y: { duration: 0.5, ease: EXPO },
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
              style={{ height: `${MAX_MSG_LINES * 2.4 + 1}em` }}
            >
              {HERO_MESSAGES[msgIdx].split('\n').map((line: string, li: number) => {
                const lines = HERO_MESSAGES[msgIdx].split('\n');
                const lineStart = lines.slice(0, li).join('\n').length + (li > 0 ? 1 : 0);
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
          className="absolute z-[21] font-black text-[#111] text-center tracking-[-0.04em] leading-[1.0] left-1/2"
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
            opacity: headingOpacity,
            top: `${lerp(50, 28, clamp01((progress - 0.64) / 0.06))}%`,
            transform: `translate(-50%, -50%) rotate(${headingRotation}deg) scale(${lerp(0.3, 1.3, clamp01((progress - 0.42) / 0.28))})`,
            pointerEvents: headingOpacity > 0.1 ? 'auto' : 'none',
          }}
        >
          מה אנחנו<br />עושים?
        </h2>

        {/* ── Steps — horizontal scroll with progress bar ── */}
        {(() => {
          // Steps phase: starts scrolling only after menu is fully visible
          const stepsStart = 0.72;
          const stepsEnd = 0.95;
          const stepsT = clamp01((progress - stepsStart) / (stepsEnd - stepsStart));
          // Smooth 0→3 for scroll-driven slide
          const smoothPos = stepsT * 3;

          return (
            <div
              className="absolute inset-0 z-20 flex flex-col overflow-hidden"
              style={{
                opacity: stepsOpacity,
                pointerEvents: stepsOpacity > 0.1 ? 'auto' : 'none',
              }}
            >

              {/* Steps cards — scroll-driven horizontal slide */}
              {STEPS.map((step, i) => {
                // Each card: position based on smooth scroll
                // offset = (i - smoothPos) means: current step at 0%, previous slides left, next slides right
                const offset = i - smoothPos;
                return (
                  <div
                    key={step.num}
                    className="absolute px-8 md:px-16"
                    style={{
                      top: '50%',
                      left: `calc(50% - ${offset * 40}%)`,
                      transform: 'translateX(-50%)',
                      width: 'min(500px, 85vw)',
                      opacity: Math.max(0, 1 - Math.abs(offset) * 1.2),
                    }}
                  >
                    <span
                      className="block font-black text-[#111]/30 leading-none tabular-nums mb-4"
                      style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}
                      dir="ltr"
                    >
                      {step.num}
                    </span>
                    <h3
                      className="font-bold text-[#111] tracking-[-0.02em] leading-tight mb-3"
                      style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[#111]/50 font-light leading-relaxed text-sm md:text-base max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ── App icon — click to open terminal ── */}
        <motion.div
          className="absolute inset-0 z-[25] flex flex-col items-center justify-center cursor-pointer"
          animate={{ opacity: clicked ? 0 : ready ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EXPO }}
          style={{ pointerEvents: clicked ? 'none' : 'auto' }}
          onClick={() => { setClicked(true); onUnlock?.(); }}
        >
          <motion.div
            ref={iconRef}
            className="flex flex-col items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: ready && !clicked ? 1 : 0.8, opacity: ready && !clicked ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
            style={{ perspective: 400 }}
          >
            {/* App icon container */}
            <motion.div
              className="rounded-[22px] flex items-center justify-center shadow-2xl border border-white/15"
              animate={(() => {
                if (!iconRef.current || mouse.x < 0) return { rotateX: 0, rotateY: 0, scale: 1 };
                const rect = iconRef.current.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const stickyRect = stickyRef.current?.getBoundingClientRect();
                const absX = (stickyRect?.left ?? 0) + mouse.x;
                const absY = (stickyRect?.top ?? 0) + mouse.y;
                const dx = absX - cx;
                const dy = absY - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 300;
                const strength = Math.max(0, 1 - dist / maxDist);
                return {
                  rotateY: (dx / maxDist) * 20 * strength,
                  rotateX: -(dy / maxDist) * 20 * strength,
                  scale: 1 + strength * 0.1,
                };
              })()}
              transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
              style={{
                width: 80,
                height: 80,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(40px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <svg width="44" height="44" viewBox="100 0 200 130" fill="none">
                <defs>
                  <mask id="hero-o-cut">
                    <rect width="100%" height="100%" fill="white" />
                    <path d="M 168,128 L 232,2" stroke="black" strokeWidth="28" />
                  </mask>
                </defs>
                <circle cx="145" cy="65" r="43" stroke="white" strokeWidth="7" fill="none" mask="url(#hero-o-cut)" />
                <line x1="200" y1="65" x2="168" y2="128" stroke="white" strokeWidth="7" strokeLinecap="round" />
                <line x1="200" y1="65" x2="232" y2="2" stroke="white" strokeWidth="7" strokeLinecap="round" />
                <path d="M 245,18 L 285,65 L 245,112" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="miter" fill="none" />
              </svg>
            </motion.div>
            {/* App label */}
            <span className="text-[0.65rem] tracking-[0.15em] text-white/50 font-medium uppercase">code.exe</span>
            {/* Click here hint */}
            <motion.span
              className="text-sm tracking-[0.2em] text-white/70 font-medium uppercase mt-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              click to open
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Scroll hint — follows cursor after terminal opens */}
        <motion.div
          className="absolute z-[6] pointer-events-none"
          animate={{
            opacity: !clicked || showText ? 0 : tvContent ? 1 : 0,
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

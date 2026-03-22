/**
 * Preloader — full-screen intro animation.
 *
 * Sequence:
 *  0.0s  → Diagonal slash line draws from center outward
 *  0.8s  → "CO" slides left, ">E" slides right (SVG strokes)
 *  1.8s  → "WEB SOLUTIONS • AGENCY" fades in
 *  2.5s  → Hebrew tagline fades in
 *  5.5s  → Screen slides up and disappears
 */
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPO = [0.19, 1, 0.22, 1] as const;

/* ── SVG "CO/>E" logo — matches brand identity ── */
function CodeLogo({ phase }: { phase: number }) {
  const sw = 5.5; // stroke weight matching the logo

  return (
    <svg
      viewBox="0 0 395 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'clamp(260px, 55vw, 520px)', height: 'auto' }}
    >
      <defs>
        {/* Mask: cuts the O where the slash passes through */}
        <mask id="o-cut">
          <rect width="100%" height="100%" fill="white" />
          <path d="M 168,128 L 232,2" stroke="black" strokeWidth="28" />
        </mask>
      </defs>

      {/* ── CO — slides in from the right ── */}
      <motion.g
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : 28 }}
        transition={{ duration: 2.0, ease: EXPO }}
      >
        {/* C — geometric circle, open ~75° on right */}
        <path
          d="M 88,24 A 46,46 0 1 0 88,106"
          stroke="white"
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
        {/* O — full circle, masked where slash crosses */}
        <circle
          cx="145"
          cy="65"
          r="43"
          stroke="white"
          strokeWidth={sw}
          fill="none"
          mask="url(#o-cut)"
        />
      </motion.g>

      {/* ── / slash — draws from center outward ── */}
      <motion.path
        d="M 200,65 L 168,128"
        stroke="white"
        strokeWidth={sw}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: EXPO }}
      />
      <motion.path
        d="M 200,65 L 232,2"
        stroke="white"
        strokeWidth={sw}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: EXPO }}
      />

      {/* ── >E — slides in from the left ── */}
      <motion.g
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -28 }}
        transition={{ duration: 1.8, ease: EXPO }}
      >
        {/* > chevron — sharp miter join */}
        <path
          d="M 245,18 L 285,65 L 245,112"
          stroke="white"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
        />
        {/* E — vertical + three horizontals */}
        <line x1="315" y1="18" x2="315" y2="112" stroke="white" strokeWidth={sw} strokeLinecap="round" />
        <line x1="315" y1="18" x2="370" y2="18" stroke="white" strokeWidth={sw} strokeLinecap="round" />
        <line x1="315" y1="65" x2="360" y2="65" stroke="white" strokeWidth={sw} strokeLinecap="round" />
        <line x1="315" y1="112" x2="370" y2="112" stroke="white" strokeWidth={sw} strokeLinecap="round" />
      </motion.g>

      {/* ® — small circle with R inside, top-right of E */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.8 : 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EXPO }}
      >
        <circle cx="382" cy="14" r="7" stroke="white" strokeWidth="1" fill="none" />
        <text
          x="382"
          y="14"
          fill="white"
          fontSize="10"
          fontWeight="400"
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >
          R
        </text>
      </motion.g>
    </svg>
  );
}

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const t4 = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 1100);
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#111111] flex items-center justify-center"
          exit={{ y: '-100%', transition: { duration: 2.2, ease: EXPO } }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* SVG Logo */}
            <CodeLogo phase={phase} />

            {/* Hebrew tagline */}
            <p className="text-white/40 text-lg tracking-[0.18em] font-light flex gap-3">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase >= 2 ? 1 : 0,
                  y: phase >= 2 ? 0 : 8,
                }}
                transition={{ duration: 1.6, ease: EXPO }}
              >
                החזון שלך,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase >= 2 ? 1 : 0,
                  y: phase >= 2 ? 0 : 8,
                }}
                transition={{ duration: 1.6, delay: 0.65, ease: EXPO }}
              >
                המומחיות שלנו.
              </motion.span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

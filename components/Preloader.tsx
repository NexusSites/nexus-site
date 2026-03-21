/**
 * Preloader — full-screen intro animation.
 *
 * Sequence:
 *  0.3s  → Logo slides in from left
 *  0.5s  → Each letter of "NEXUS" slides in one by one
 *  1.6s  → "." appears
 *  2.3s  → Logo floats up, Hebrew tagline fades in below
 *  5.8s  → Screen slides up and disappears
 */
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPO = [0.19, 1, 0.22, 1] as const;
const LETTERS = ['N', 'E', 'X', 'U', 'S'];

/* ── Stylised "A" logo as inline SVG ── */
function LogoMark() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="4,68 32,4 44,28 18,68" fill="white" />
      <polygon points="46,36 68,68 42,68 36,52" fill="white" />
    </svg>
  );
}

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible]       = useState(true);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    // Show tagline after dot appears
    const t1 = setTimeout(() => setShowTagline(true), 2300);
    // Exit after full sequence
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 2200);
    }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#111111] flex items-center justify-center"
          exit={{ y: '-100%', transition: { duration: 2.2, ease: EXPO } }}
        >
          <div className="flex flex-col items-center gap-1">

            {/* Row: logo + letters */}
            {/* Outer wrapper handles the shared float-up */}
            <motion.div
              className="flex items-stretch gap-4"
              dir="ltr"
              initial={{ y: 0 }}
              animate={{ y: showTagline ? -12 : 0 }}
              transition={{ duration: 1.0, ease: EXPO }}
            >
              {/* Logo — slides in from left */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.3, ease: EXPO }}
              >
                <LogoMark />
              </motion.div>

              {/* Letters one by one */}
              <div
                className="flex"
                style={{ fontSize: '3.6rem', lineHeight: 1, alignSelf: 'flex-end' }}
              >
                {LETTERS.map((letter, i) => (
                  <motion.span
                    key={letter}
                    className="text-white font-black"
                    style={{ letterSpacing: '0.04em' }}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: EXPO }}
                  >
                    {letter}
                  </motion.span>
                ))}

                {/* Dot — appears after last letter */}
                <motion.span
                  className="text-white font-black"
                  style={{ letterSpacing: '0.04em' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                >
                  .
                </motion.span>
              </div>
            </motion.div>

            {/* Tagline — fades in below after dot, two parts staggered */}
            <p className="text-white/50 text-2xl tracking-[0.18em] uppercase font-light flex gap-3">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 8 }}
                transition={{ duration: 1.1, ease: EXPO }}
              >
                החזון שלך,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 8 }}
                transition={{ duration: 1.1, delay: 0.65, ease: EXPO }}
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

/**
 * CustomCursor — replaces the native OS cursor with two layers:
 *
 *  · Dot   — snaps to mouse instantly (no lag)
 *  · Ring  — follows with spring physics for a fluid, weighty feel
 *
 * When hovering any <button>, <a>, or [data-cursor-hover] element:
 *  · Ring expands and switches to mix-blend-mode: difference
 *    (appears white-on-dark / dark-on-white, creating an inversion effect)
 *
 * Usage:  <CustomCursor />  at the very top of your page (z-[9999])
 */
'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

export default function CustomCursor() {
  /* Raw mouse position — updated synchronously */
  const rawX = useMotionValue(-120);
  const rawY = useMotionValue(-120);

  /* Spring-smoothed position for the ring (stiffness + damping tune the lag) */
  const springX = useSpring(rawX, { stiffness: 120, damping: 18, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.6 });

  /* Whether cursor is over an interactive element */
  const [hovering, setHovering] = useState(false);
  /* Whether cursor is inside the viewport */
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    /* Skip on touch devices — no mouse = no custom cursor */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    /* ── Mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    /* ── Hover detection on interactive elements ── */
    const SELECTORS = 'a, button, [data-cursor-hover], input, textarea, label';

    const handleEnter = () => setHovering(true);
    const handleLeave = () => setHovering(false);

    /* Initial bind */
    const bindAll = () => {
      document.querySelectorAll<HTMLElement>(SELECTORS).forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };
    bindAll();

    /* Re-bind when DOM changes (modals, dynamic content) */
    const observer = new MutationObserver(bindAll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
    };
  }, [rawX, rawY]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Dot: instant, no spring ── */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-white"
            style={{
              x: rawX,
              y: rawY,
              translateX: '-50%',
              translateY: '-50%',
              width:  6,
              height: 6,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* ── Ring: spring-lagged, expands + blend mode on hover ── */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
            style={{
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
              backgroundColor: '#ffffff',
              /* mix-blend-mode: difference inverts whatever is beneath the ring.
                 On a black background it shows white; on white it shows black. */
              mixBlendMode: 'difference',
            }}
            initial={{ opacity: 0, width: 0, height: 0 }}
            animate={{
              opacity: 1,
              width:  hovering ? 72 : 36,
              height: hovering ? 72 : 36,
            }}
            exit={{ opacity: 0, width: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

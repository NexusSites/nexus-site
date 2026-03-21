/**
 * MagneticButton — elastically pulls toward the cursor on hover.
 *
 * How it works:
 *  1. onMouseMove → compute delta (cursor − element center)
 *  2. Multiply delta by `strength` → set as useSpring targets
 *  3. Framer Motion spring physics animate toward target
 *  4. onMouseLeave → targets reset to 0 → elastic snap-back
 *
 * Supports `href` to render as an <a> tag, otherwise renders <button>.
 */
'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children:   ReactNode;
  className?: string;
  onClick?:   () => void;
  strength?:  number;
  href?:      string;
  type?:      'button' | 'submit' | 'reset';
  disabled?:  boolean;
  'aria-label'?: string;
}

const SPRING = { stiffness: 200, damping: 18, mass: 0.6 };

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.38,
  href,
  disabled,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [hov, setHov] = useState(false);

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width  / 2)) * strength);
    y.set((e.clientY - (r.top  + r.height / 2)) * strength);
  };

  const onLeave = () => { x.set(0); y.set(0); setHov(false); };

  const shared = {
    style:        { x, y },
    onMouseMove:  onMove,
    onMouseEnter: () => setHov(true),
    onMouseLeave: onLeave,
    className:    `relative inline-flex items-center justify-center select-none ${className}`,
    'data-cursor-hover': true,
    ...rest,
  };

  const inner = (
    <motion.span
      className="pointer-events-none"
      animate={{ scale: hov ? 1.04 : 1 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.span>
  );

  /* Render as <a> when href is provided, otherwise <button> */
  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...shared}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      disabled={disabled}
      {...shared}
    >
      {inner}
    </motion.button>
  );
}

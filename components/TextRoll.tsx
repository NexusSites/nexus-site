/**
 * TextRoll — hover-triggered vertical text roll.
 *
 * Two identical text copies stack inside an overflow:hidden container.
 * On hover (via Framer Motion whileHover variant propagation):
 *   · Copy A slides UP   (y: 0% → -100%)
 *   · Copy B slides UP   (y: 100% → 0%)  from below
 *
 * The `whileHover="hover"` on the wrapper propagates the variant name
 * down to all descendant motion elements — both spans animate in sync.
 *
 * Usage:
 *   <TextRoll>View Case Study</TextRoll>
 *   <TextRollLink href="#services">Explore Services</TextRollLink>
 */
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

const EXPO = [0.19, 1, 0.22, 1] as const;
const TX   = { duration: 0.5, ease: EXPO };

/* ── Shared text layers ─────────────────────────── */
function Layers({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Copy A: rests at 0, exits upward */}
      <motion.span
        className="block"
        variants={{ idle: { y: '0%' }, hover: { y: '-100%' } }}
        transition={TX}
      >
        {children}
      </motion.span>

      {/* Copy B: starts below, rises to 0 on hover */}
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        variants={{ idle: { y: '100%' }, hover: { y: '0%' } }}
        transition={TX}
      >
        {children}
      </motion.span>
    </>
  );
}

/* ── TextRoll: generic wrapper ──────────────────── */
interface TextRollProps {
  children:   ReactNode;
  className?: string;
}

export default function TextRoll({ children, className = '' }: TextRollProps) {
  return (
    <motion.span
      className={`relative inline-flex overflow-hidden leading-none ${className}`}
      style={{ height: '1.2em' }}
      initial="idle"
      whileHover="hover"
    >
      <Layers>{children}</Layers>
    </motion.span>
  );
}

/* ── TextRollLink: convenience <a> wrapper ──────── */
interface TextRollLinkProps {
  href:       string;
  children:   ReactNode;
  className?: string;
  target?:    string;
  rel?:       string;
}

export function TextRollLink({
  href,
  children,
  className = '',
  target,
  rel,
}: TextRollLinkProps) {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`relative inline-flex overflow-hidden leading-none ${className}`}
      style={{ height: '1.2em' }}
      initial="idle"
      whileHover="hover"
      data-cursor-hover
    >
      <Layers>{children}</Layers>
    </motion.a>
  );
}

/**
 * NavBar — sticky header that inverts its colors via mix-blend-mode: difference.
 *
 * Design decisions:
 *  · `mix-blend-mode: difference` means the nav is always "white" in CSS,
 *    but it VISUALLY appears white on dark sections and black on light sections
 *    — works automatically without scroll listeners.
 *  · The logo animates like the preloader: slash draws, then CO/>E slides in.
 *  · "נדבר" CTA uses MagneticButton for the pull effect.
 *  · On mobile the links collapse; only logo + CTA remain.
 */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { TextRollLink } from './TextRoll';

const EXPO = [0.19, 1, 0.22, 1] as const;

const NAV_LINKS = [
  { label: 'שירותים', href: '#services' },
  { label: 'עבודות',  href: '#work'     },
  { label: 'אודות',   href: '#about'    },
  { label: 'FAQ',     href: '#faq'      },
];

interface NavBarProps {
  onCtaClick: () => void;
  ready?: boolean;
}

function NavLogo({ ready }: { ready: boolean }) {
  const [phase, setPhase] = useState(0);
  const sw = 5.5;

  useEffect(() => {
    if (!ready) return;
    // Start animation after preloader is gone
    const t0 = setTimeout(() => setPhase(1), 200);  // slash draws
    const t1 = setTimeout(() => setPhase(2), 800);  // letters slide in
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [ready]);

  return (
    <svg width="100" height="28" viewBox="0 0 395 130" fill="none">
      <defs>
        <mask id="nav-o-cut">
          <rect width="100%" height="100%" fill="white" />
          <path d="M 168,128 L 232,2" stroke="black" strokeWidth="28" />
        </mask>
      </defs>

      {/* CO — slides in from right */}
      <motion.g
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 15 }}
        transition={{ duration: 1.4, ease: EXPO }}
      >
        <path d="M 88,24 A 46,46 0 1 0 88,106" stroke="white" strokeWidth={sw} strokeLinecap="round" fill="none" />
        <circle cx="145" cy="65" r="43" stroke="white" strokeWidth={sw} fill="none" mask="url(#nav-o-cut)" />
      </motion.g>

      {/* / slash — draws from center outward */}
      <motion.path
        d="M 200,65 L 168,128"
        stroke="white"
        strokeWidth={sw}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EXPO }}
      />
      <motion.path
        d="M 200,65 L 232,2"
        stroke="white"
        strokeWidth={sw}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EXPO }}
      />

      {/* >E — slides in from left */}
      <motion.g
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -15 }}
        transition={{ duration: 1.2, ease: EXPO }}
      >
        <path d="M 245,18 L 285,65 L 245,112" stroke="white" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="miter" fill="none" />
        <line x1="315" y1="18" x2="315" y2="112" stroke="white" strokeWidth={sw} strokeLinecap="round" />
        <line x1="315" y1="18" x2="370" y2="18" stroke="white" strokeWidth={sw} strokeLinecap="round" />
        <line x1="315" y1="65" x2="360" y2="65" stroke="white" strokeWidth={sw} strokeLinecap="round" />
        <line x1="315" y1="112" x2="370" y2="112" stroke="white" strokeWidth={sw} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

export default function NavBar({ onCtaClick, ready = false }: NavBarProps) {
  return (
    <motion.nav
      className="fixed top-0 inset-x-0 z-50 mix-blend-difference"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: EXPO }}
    >
      <div className="flex items-center justify-between px-6 md:px-16" style={{ paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>

        {/* ── CTA ── */}
        <MagneticButton
          onClick={onCtaClick}
          className="
            border border-white/40 text-white text-sm font-semibold
            px-5 py-2 rounded-sm tracking-wide
            hover:bg-white/10 hover:border-white/80
            transition-colors duration-200
          "
        >
          נדבר&ensp;→
        </MagneticButton>

        {/* ── Links — hidden on small screens ── */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <TextRollLink
                href={href}
                className="text-sm font-medium text-white/60 hover:text-white/100 transition-colors duration-200 tracking-wide"
              >
                {label}
              </TextRollLink>
            </li>
          ))}
        </ul>

        {/* ── Brand ── */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            const lenis = (window as unknown as Record<string, { scrollTo: (target: number) => void }>).__lenis;
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo(0, 0);
          }}
          className="flex items-center cursor-pointer" style={{ position: 'relative', left: '4rem' }}
          data-cursor-hover
        >
          <NavLogo ready={ready} />
        </a>
      </div>
    </motion.nav>
  );
}

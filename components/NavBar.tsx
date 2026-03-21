/**
 * NavBar — sticky header that inverts its colors via mix-blend-mode: difference.
 *
 * Design decisions:
 *  · `mix-blend-mode: difference` means the nav is always "white" in CSS,
 *    but it VISUALLY appears white on dark sections and black on light sections
 *    — works automatically without scroll listeners.
 *  · The logo and nav links use TextRollLink for the hover roll animation.
 *  · "נדבר" CTA uses MagneticButton for the pull effect.
 *  · On mobile the links collapse; only logo + CTA remain.
 */
'use client';

import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { TextRollLink } from './TextRoll';

const NAV_LINKS = [
  { label: 'שירותים', href: '#services' },
  { label: 'עבודות',  href: '#work'     },
  { label: 'אודות',   href: '#about'    },
  { label: 'FAQ',     href: '#faq'      },
];

interface NavBarProps {
  onCtaClick: () => void;
}

export default function NavBar({ onCtaClick }: NavBarProps) {
  return (
    <motion.nav
      className="fixed top-0 inset-x-0 z-50 mix-blend-difference"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-6">

        {/* ── Brand ── */}
        <a
          href="#hero"
          className="flex items-center gap-3 font-black text-sm uppercase tracking-[0.1em] text-white"
          data-cursor-hover
        >
          {/* Geometric N logo */}
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path
              d="M12 38 L12 10 L36 38 L36 10"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" fill="white" />
            <circle cx="12" cy="38" r="2.5" fill="white" />
            <circle cx="36" cy="10" r="2.5" fill="white" />
            <circle cx="36" cy="38" r="2.5" fill="white" />
          </svg>
          Nexus Sites
        </a>

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
      </div>
    </motion.nav>
  );
}

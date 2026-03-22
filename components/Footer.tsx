/**
 * Footer — minimal, three-column layout.
 *
 * Left:  Brand logo + name
 * Center: Navigation links with TextRoll hover effect
 * Right:  Contact links + legal copy
 *
 * The large marquee-style "Nexus Sites" text scrolls horizontally
 * to fill the full width — a premium agency touch.
 */
'use client';

import { motion } from 'framer-motion';
import { TextRollLink } from './TextRoll';
import MagneticButton from './MagneticButton';

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

interface FooterProps {
  onCtaClick: () => void;
}

export default function Footer({ onCtaClick }: FooterProps) {
  return (
    <footer className="border-t border-white/10 overflow-hidden">

      {/* ── CTA Strip ── */}
      <div className="px-6 md:px-16 py-20 border-b border-white/10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EXPO }}
        >
          <span className="block text-[0.7rem] tracking-[0.2em] uppercase text-white/35 mb-4 font-medium">
            הצעד הבא שלך
          </span>
          <h2
            className="font-black tracking-[-0.03em] leading-[1.02] text-white mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 7.5rem)' }}
          >
            המתחרים שלך<br />
            <span className="text-white/35">כבר שדרגו.</span>
          </h2>
          <p className="text-white/40 text-base mb-10">השאלה היא אם אתה הבא.</p>

          <MagneticButton
            onClick={onCtaClick}
            className="
              bg-white text-black font-bold text-sm
              px-9 py-4 rounded-sm tracking-wide
              hover:bg-white/90 transition-colors
            "
          >
            התחל עכשיו&ensp;↗
          </MagneticButton>
          <p className="mt-4 text-xs text-white/22 tracking-wide">
            שיחת אסטרטגיה ראשונה ללא עלות — הצעת מחיר תוך 24 שעות
          </p>
        </motion.div>
      </div>

      {/* ── Scrolling Marquee ── */}
      <div className="py-8 border-b border-white/10 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.02em] text-white/[0.06] mx-8 select-none"
            >
              Nexus Sites &mdash;&ensp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom row ── */}
      <div className="px-6 md:px-16 py-8">
        <div className="flex flex-wrap items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3 font-black text-sm uppercase tracking-[0.08em] text-white/70">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M12 38 L12 10 L36 38 L36 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" fill="currentColor" />
              <circle cx="12" cy="38" r="2.5" fill="currentColor" />
              <circle cx="36" cy="10" r="2.5" fill="currentColor" />
              <circle cx="36" cy="38" r="2.5" fill="currentColor" />
            </svg>
            Nexus Sites
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <TextRollLink href="tel:+972500000000"          className="text-xs text-white/35 tracking-widest hover:text-white/80 transition-colors">טלפון</TextRollLink>
            <TextRollLink href="mailto:office@nexussites.co.il" className="text-xs text-white/35 tracking-widest hover:text-white/80 transition-colors">אימייל</TextRollLink>
            <TextRollLink href="https://wa.me/972500000000"  className="text-xs text-white/35 tracking-widest hover:text-white/80 transition-colors">WhatsApp</TextRollLink>
          </div>

          {/* Legal */}
          <p className="text-xs text-white/20 tracking-wide">
            © {new Date().getFullYear()} Nexus Sites — כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
}

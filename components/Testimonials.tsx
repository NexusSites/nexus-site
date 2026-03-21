/**
 * Testimonials — three side-by-side client quotes.
 *
 * Layout: full-bleed 3-column grid (collapses to 1 column on mobile)
 * Each card:
 *  · Quote text (dim)
 *  · Metric stat (bold, large)
 *  · Client name + role
 *  · Subtle left border highlight on hover
 *
 * Scroll animation: staggered fade-up via Framer Motion whileInView
 */
'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote:  'האתר עלה תוך 3 שבועות. Google אוהב אותו. המכירות שלנו שיא ב-3 חודשים רצופים.',
    stat:   '+240%',
    meta:   'צמיחה במכירות',
    name:   'תומר לוי',
    role:   'בעלים, חנות אונליין',
    init:   'ת',
  },
  {
    quote:  'הם לא שאלו "מה אתה אוהב". הם שאלו "למה. כמה. כמה אתה רוצה לגדול". זה שינה הכל.',
    stat:   '+3',
    meta:   'לקוחות B2B חדשים',
    name:   'רחל מזרחי',
    role:   'מנהלת שיווק, סטארטאפ',
    init:   'ר',
  },
  {
    quote:  'שלוש שנים ניסיתי חברות שונות. ב-Nexus Sites — האנשים שהביאו לי לידים אמיתיים.',
    stat:   '+18',
    meta:   'לידים / חודש',
    name:   'ד"ר אבי כהן',
    role:   'מרפאה פרטית',
    init:   'ד',
  },
] as const;

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-b border-white/10">

      {/* Header */}
      <motion.div
        className="px-6 md:px-16 pt-20 pb-12 border-b border-white/10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: EXPO }}
      >
        <span className="block text-[0.7rem] tracking-[0.2em] uppercase text-white/35 mb-3 font-medium">
          מה אומרים הלקוחות
        </span>
        <h2 className="text-headline font-black tracking-[-0.02em] leading-[1.05]">
          לא אנחנו אומרים.{' '}
          <em className="font-light not-italic text-white/40">הם</em> אומרים.
        </h2>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            className="group relative px-8 md:px-10 py-12 border-b md:border-b-0 border-l border-white/10 first:border-l-0"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: EXPO }}
            data-cursor-hover
          >
            {/* Hover left-border accent */}
            <motion.div
              className="absolute right-0 top-0 w-px h-full bg-white/0 group-hover:bg-white/30 transition-colors duration-500"
              aria-hidden
            />

            {/* Quote */}
            <p className="text-sm leading-[1.85] text-white/60 font-light mb-8">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Metric */}
            <div
              className="font-black tracking-[-0.03em] text-white leading-none mb-1 tabular-nums"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}
              dir="ltr"
            >
              {t.stat}
            </div>
            <div className="text-xs text-white/35 tracking-wide mb-8 uppercase font-medium">
              {t.meta}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mt-auto">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
                {t.init}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-white/35 font-light">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

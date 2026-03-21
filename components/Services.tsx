/**
 * Services — "מה אנחנו עושים"
 *
 * Opens with a diagonal top edge.
 * The heading scales up from tiny → full size as it enters the viewport.
 * Four process steps stagger in below.
 */
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const STEPS = [
  {
    num:   '01',
    title: 'ניתוח ואסטרטגיה',
    desc:  'מבינים את העסק, השוק, והמתחרים. מגדירים יעדים ובונים מפת דרכים ברורה לפני שמגעים בקוד.',
  },
  {
    num:   '02',
    title: 'עיצוב וחווית משתמש',
    desc:  'ממשק שמוביל את המבקר בדיוק לאן שצריך. כל אלמנט מבוסס על לוגיקת המרה, לא אסתטיקה בלבד.',
  },
  {
    num:   '03',
    title: 'פיתוח והשקה',
    desc:  'קוד נקי, ביצועים מקסימליים. אתר חי ועובד במהירות שמפתיעה — בדרך כלל מתחת לשבועיים.',
  },
  {
    num:   '04',
    title: 'צמיחה מתמשכת',
    desc:  'SEO, ניתוח נתונים ושיפור שוטף. יום ההשקה הוא נקודת ההתחלה, לא נקודת הסיום.',
  },
] as const;

const EXPO = [0.19, 1, 0.22, 1] as const;

export default function Services() {
  const headingRef = useRef<HTMLDivElement>(null);

  /* ── Scale-up reveal for heading ── */
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ['start end', 'center 0.55'],
  });

  const scale       = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const opacity     = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const blurFilter  = useTransform(
    scrollYProgress,
    [0, 0.65],
    ['blur(24px)', 'blur(0px)']
  );

  return (
    <section
      id="services"
      className="relative bg-[#111111] overflow-hidden"
      style={{ clipPath: 'polygon(0 100px, 100% 0, 100% 100%, 0 100%)' }}
    >
      {/* Spacer for diagonal clip */}
      <div className="h-28" />

      {/* ── Heading — scales up from tiny ── */}
      <div
        ref={headingRef}
        className="flex items-center justify-center py-28 md:py-36 overflow-hidden px-6"
      >
        <motion.h2
          style={{
            scale,
            opacity,
            filter: blurFilter,
            fontSize: 'clamp(3.2rem, 11vw, 9.5rem)',
          }}
          className="font-black text-white text-center tracking-[-0.04em] leading-[1.0]"
        >
          מה אנחנו<br />עושים?
        </motion.h2>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-white/10 mx-6 md:mx-16" />

      {/* ── Process steps 1–4 ── */}
      <div>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex items-start gap-8 md:gap-16 px-6 md:px-16 py-10 md:py-12 border-b border-white/10 group"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EXPO }}
          >
            {/* Number */}
            <span
              className="font-black text-white/15 shrink-0 leading-none tabular-nums"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              dir="ltr"
            >
              {step.num}
            </span>

            {/* Content */}
            <div className="flex-1 pt-2">
              <h3
                className="font-bold text-white tracking-[-0.02em] leading-tight mb-3"
                style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2rem)' }}
              >
                {step.title}
              </h3>
              <p className="text-white/45 font-light leading-relaxed text-sm md:text-base max-w-lg">
                {step.desc}
              </p>
            </div>

            {/* Step indicator line */}
            <motion.div
              className="hidden md:block h-px bg-white/20 self-center shrink-0"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: EXPO }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div className="h-20" />
    </section>
  );
}

/**
 * FAQ — two-column layout: section heading left, accordion right.
 *
 * Accordion behaviour:
 *  · Click a question → answer panel expands via Framer Motion height animation
 *  · Clicking the open question collapses it (toggle)
 *  · `+` icon rotates 45° to become `×` when open
 *
 * Scroll animation: heading + items fade up on whileInView.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'כמה עולה בניית אתר?',
    a: 'כל פרויקט שונה — תלוי בהיקף, בפונקציונליות ובמורכבות הטכנית. לכן אנחנו מציעים הצעת מחיר מפורטת תוך 24 שעות, בחינם, ללא כל התחייבות. אין מחירי מדף כי אין פתרונות מדף.',
  },
  {
    q: 'כמה זמן לוקח לבנות אתר?',
    a: 'פרויקט ממוצע עומד על 3–6 שבועות מרגע אישור הקונספט. לוח הזמנים מוסכם מראש ומכובד בכל מקרה.',
  },
  {
    q: 'האם אתם עובדים עם עסקים קטנים?',
    a: 'כן. חלק גדול מהלקוחות שלנו הם עסקים קטנים ובינוניים שמחפשים לזנק קדימה. גודל העסק לא קובע — הרצינות שלך כן.',
  },
  {
    q: 'מה ההבדל בינכם לבין פרילנסר?',
    a: 'פרילנסר בונה מה שאתה מבקש. אנחנו שואלים שאלות עסקיות, מבינים את המטרות, ובונים ארכיטקטורה שמשרתת אותן — לא אתר שנראה טוב בפורטפוליו שלנו.',
  },
  {
    q: 'האם יש תמיכה לאחר השקה?',
    a: 'כן. אנחנו מציעים חבילות תחזוקה ואופטימיזציה שוטפת. האתר לא נגמר ביום ההשקה — הוא מתחיל אז.',
  },
  {
    q: 'האם אתם עושים גם SEO?',
    a: 'SEO הוא חלק בלתי נפרד מהאופן שבו אנחנו בונים — לא תוספת. ארכיטקטורת מידע, Core Web Vitals, וסכמות הם ברירת מחדל אצלנו.',
  },
] as const;

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-b border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr]">

        {/* Left: Heading */}
        <motion.div
          className="px-6 md:px-16 pt-20 pb-12 md:border-l border-white/10 md:border-b-0 border-b"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EXPO }}
        >
          <span className="block text-[0.7rem] tracking-[0.2em] uppercase text-white/35 mb-4 font-medium">
            שאלות נפוצות
          </span>
          <h2
            className="font-black tracking-[-0.025em] leading-[1.05] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            יש לך שאלות.<br />יש לנו תשובות.
          </h2>
        </motion.div>

        {/* Right: Accordion */}
        <motion.div
          className="px-6 md:px-14 py-12 flex flex-col"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {FAQS.map((item, i) => (
            <div key={i} className="border-b border-white/10">
              {/* Question button */}
              <button
                className="w-full flex items-center justify-between gap-4 py-5 text-right"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                data-cursor-hover
              >
                <span className="font-medium text-sm text-white/80 leading-snug">
                  {item.q}
                </span>
                <motion.span
                  className="shrink-0 w-6 h-6 rounded-full border border-white/25 flex items-center justify-center text-white/50 text-sm"
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: EXPO }}
                  aria-hidden
                >
                  +
                </motion.span>
              </button>

              {/* Answer — height animates from 0 */}
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EXPO }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-[1.85] text-white/45 font-light">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

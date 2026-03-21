/**
 * About — two-column editorial layout.
 *
 * Left: oversized headline with section label
 * Right: body copy + four numbered capability rows (each animates on scroll)
 *
 * Scroll animation:
 *  · Left column slides in from the right (RTL start side)
 *  · Right column slides in from left, with a slight delay
 */
'use client';

import { motion } from 'framer-motion';

const CAPABILITIES = [
  { n: '01', title: 'ארכיטקטורת קוד חסינה'    },
  { n: '02', title: 'UX מבוסס מחקר ודאטה'      },
  { n: '03', title: 'ביצועים ברמת Enterprise'   },
  { n: '04', title: 'מדידה ואופטימיזציה מתמדת' },
] as const;

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

export default function About() {
  return (
    <section id="about" className="border-b border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* ── Left: Headline ── */}
        <motion.div
          className="px-6 md:px-16 pt-20 pb-16 md:border-l border-white/10"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EXPO }}
        >
          <span className="block text-[0.7rem] tracking-[0.2em] uppercase text-white/35 mb-4 font-medium">
            הגישה שלנו
          </span>
          <h2
            className="font-black tracking-[-0.025em] leading-[1.05] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)' }}
          >
            מתודולוגיה.<br />לא אינטואיציה.
          </h2>
        </motion.div>

        {/* ── Right: Body + capabilities ── */}
        <motion.div
          className="px-6 md:px-16 pt-20 pb-16"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.15, ease: EXPO }}
        >
          <p className="text-[1.05rem] leading-[1.8] text-white/55 font-light mb-10 max-w-lg">
            כל אתר שאנחנו בונים נשען על ארכיטקטורה לוגית, קוד ללא פשרות,
            ומסלולי משתמש שתוכננו בדייקנות כירורגית.
            אנחנו לא מעצבים לפי טעם — אנחנו מהנדסים לפי נתונים.
          </p>

          {/* Capability rows */}
          <div className="flex flex-col">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.n}
                className="flex items-center gap-5 py-4 border-b border-white/10 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: EXPO }}
              >
                <span className="text-[0.62rem] font-bold tracking-[0.12em] text-white/25 shrink-0 tabular-nums" dir="ltr">
                  {cap.n}
                </span>
                <span className="font-semibold text-sm tracking-wide text-white/80">
                  {cap.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Stats — full-width horizontal band of four oversized metrics.
 *
 * Animation:
 *  · Each stat fades up with a staggered delay via Framer Motion whileInView.
 *  · The `once: true` option ensures the animation only fires on first scroll.
 */
'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '3×',     label: 'יחס המרה ממוצע'       },
  { value: '99.8%',  label: 'זמן פעילות'            },
  { value: '<0.5s',  label: 'זמן טעינה ממוצע'       },
  { value: '18+',    label: 'לידים חדשים / חודש'    },
] as const;

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

export default function Stats() {
  return (
    <section className="border-y border-white/10">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex flex-col px-8 md:px-12 py-14 border-b md:border-b-0 border-l border-white/10 first:border-l-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EXPO }}
          >
            <span
              className="font-black tracking-[-0.04em] leading-none text-white tabular-nums mb-2"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
              dir="ltr"
            >
              {s.value}
            </span>
            <span className="text-xs tracking-[0.1em] uppercase text-white/38 font-medium leading-snug">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/**
 * CaseStudies — project showcase grid, hugeinc-style.
 *
 * Each card:
 *  · Has a unique dark brand color for visual identity
 *  · Displays project type, name, and a bold metric result
 *  · On hover: brightness lifts, "צפה בפרויקט ↗" CTA fades + slides up
 *  · The entire card is a MagneticButton for the pull effect
 *
 * Scroll animation:
 *  · Cards stagger in from y:60, opacity:0 with whileInView
 *  · Custom cubic-bezier easing for that "heavy weight" feeling
 */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import MagneticButton from './MagneticButton';

const MatrixRain = dynamic(() => import('./MatrixRain'), { ssr: false });

const PROJECTS = [
  {
    name:   'פרמיום קומרס',
    type:   'eCommerce Platform',
    metric: '+240%',
    metricLabel: 'צמיחה במכירות',
    year:   '2024',
    bg:     '#0a1628',
    accent: '#1a3a6e',
  },
  {
    name:   'מרפאת אלפא',
    type:   'Healthcare Digital',
    metric: '+18',
    metricLabel: 'לידים חדשים / חודש',
    year:   '2024',
    bg:     '#0d1a0d',
    accent: '#1a3a1a',
  },
  {
    name:   'גנרייט B2B',
    type:   'SaaS Marketing Site',
    metric: '×3',
    metricLabel: 'לקוחות חדשים',
    year:   '2023',
    bg:     '#1a0d2e',
    accent: '#3a1a5e',
  },
  {
    name:   'מנהל לוקאל',
    type:   'Local Business',
    metric: '<0.5s',
    metricLabel: 'זמן טעינה',
    year:   '2023',
    bg:     '#1a1000',
    accent: '#3a2800',
  },
] as const;

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  show:   { opacity: 1, y: 0, transition: { duration: 1, ease: EXPO } },
};

interface CardProps {
  project: typeof PROJECTS[number];
  onCtaClick: () => void;
}

function ProjectCard({ project: p, onCtaClick }: CardProps) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="relative overflow-hidden border-b border-white/[0.07] border-l border-l-white/[0.07] min-h-[340px] flex flex-col"
      style={{ background: p.bg }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-cursor-hover
    >
      {/* Subtle accent gradient on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 80% 20%, ${p.accent}66 0%, transparent 65%)` }}
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative flex flex-col h-full p-8 md:p-10">

        {/* Top row: type + year */}
        <div className="flex items-center justify-between mb-auto">
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-white/35 font-medium">
            {p.type}
          </span>
          <span className="text-[0.65rem] tracking-widest text-white/25 tabular-nums" dir="ltr">
            {p.year}
          </span>
        </div>

        {/* Project name */}
        <h3
          className="font-black tracking-[-0.025em] text-white leading-none mt-12 mb-4"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
        >
          {p.name}
        </h3>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-5" />

        {/* Metric */}
        <div className="flex items-end justify-between">
          <div>
            <div
              className="font-black text-white leading-none tracking-[-0.03em] tabular-nums"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
              dir="ltr"
            >
              {p.metric}
            </div>
            <div className="text-xs text-white/40 mt-1 font-light">{p.metricLabel}</div>
          </div>

          {/* CTA — fades up on hover */}
          <motion.div
            animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 12 }}
            transition={{ duration: 0.4, ease: EXPO }}
          >
            <MagneticButton
              onClick={onCtaClick}
              className="
                border border-white/25 text-white text-xs font-semibold
                px-4 py-2 rounded-sm tracking-wide
                hover:bg-white/10 hover:border-white/60 transition-colors
              "
            >
              צור קשר&ensp;↗
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface CaseStudiesProps {
  onCtaClick: () => void;
}

export default function CaseStudies({ onCtaClick }: CaseStudiesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
  const [viewSize, setViewSize] = useState({ w: 0, h: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const update = () => setViewSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative border-b border-white/10" onMouseMove={onMouseMove}>

      {/* ── Matrix rain — revealed by flashlight ── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          pointerEvents: 'none',
          maskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 260px at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`,
        }}
      >
        {viewSize.w > 0 && <MatrixRain width={viewSize.w} height={2000} />}
      </div>

      {/* Header */}
      <motion.div
        className="relative z-[1] px-6 md:px-16 pt-20 pb-12 border-b border-white/10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: EXPO }}
      >
        <span className="block text-[0.7rem] tracking-[0.2em] uppercase text-white/35 mb-3 font-medium">
          עבודות נבחרות
        </span>
        <h2 className="text-headline font-black tracking-[-0.02em] leading-[1.05]">
          תוצאות אמיתיות.
        </h2>
      </motion.div>

      {/* 2×2 Grid */}
      <motion.div
        className="relative z-[1] grid grid-cols-1 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {PROJECTS.map(p => (
          <ProjectCard key={p.name} project={p} onCtaClick={onCtaClick} />
        ))}
      </motion.div>
    </section>
  );
}

/**
 * page.tsx — root page, composes all section components.
 *
 * Component map:
 *  CustomCursor   → global cursor layer (z-[9999-10000])
 *  NavBar         → sticky, mix-blend-mode: difference
 *  Hero           → full-screen rotating slides + fluid shader bg
 *  Services       → numbered service rows with hover expand
 *  CaseStudies    → colored project cards with metrics
 *  Stats          → four oversized metric numbers
 *  About          → two-column editorial layout
 *  Testimonials   → three client quote cards
 *  FAQ            → two-column accordion
 *  Footer         → CTA strip + marquee + links
 *  ContactModal   → full-screen overlay form
 *
 * Lenis smooth scroll is initialised here so it covers the entire page.
 */
'use client';

import { useState, useEffect } from 'react';
import Lenis from 'lenis';

import Preloader       from '@/components/Preloader';
import NavBar          from '@/components/NavBar';
import Hero            from '@/components/Hero';
import CaseStudies     from '@/components/CaseStudies';
import Stats           from '@/components/Stats';
import About           from '@/components/About';
import Testimonials    from '@/components/Testimonials';
import FAQ             from '@/components/FAQ';
import Footer          from '@/components/Footer';
import ContactModal    from '@/components/ContactModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  /* ── Scroll to top on load ── */
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  /* ── Lock scroll during preloader, init Lenis after ── */
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden';
      return;
    }
    if (!unlocked) {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.25,
      easing:   (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose lenis globally so components can use it
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [loaded, unlocked]);

  const openModal  = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="overflow-x-clip">
      {/* ── Preloader ── */}
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* ── Page sections ── */}
      <NavBar         onCtaClick={openModal} ready={loaded} />
      <Hero ready={loaded} onUnlock={() => setUnlocked(true)} />
      <CaseStudies    onCtaClick={openModal} />
      <Stats />
      <About />
      <Testimonials />
      <FAQ />
      <Footer         onCtaClick={openModal} />

      {/* ── Modal ── */}
      <ContactModal isOpen={modalOpen} onClose={closeModal} />
    </div>
  );
}

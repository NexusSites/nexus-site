"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import InteractiveCanvas from "@/components/InteractiveCanvas";
import CustomCursor from "@/components/CustomCursor";
import ContactModal from "@/components/ContactModal";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────
   SVG Logo Component — Minimalist Geometric Nexus Mark
   ───────────────────────────────────────────────────── */
function NexusLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`nexus-logo ${className}`}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="logo-stroke"
        d="M14 36 L14 12 L34 36 L34 12"
      />
      <line className="logo-stroke" x1="14" y1="24" x2="34" y2="24" opacity="0.25" />
      <circle className="logo-node" cx="14" cy="12" r="2" />
      <circle className="logo-node" cx="34" cy="12" r="2" />
      <circle className="logo-node" cx="24" cy="24" r="1.8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   Service Card Icons (inline SVG components)
   ───────────────────────────────────────────────────── */
function IconUX() {
  return (
    <svg className="service-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12h40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="8" cy="9" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="9" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="16" cy="9" r="1" fill="currentColor" opacity="0.4" />
      <rect x="10" y="18" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
      <rect x="10" y="24" width="20" height="2" rx="1" fill="currentColor" opacity="0.12" />
      <rect x="10" y="28" width="16" height="2" rx="1" fill="currentColor" opacity="0.12" />
      <path d="M32 18l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <line x1="14" y1="40" x2="34" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function IconSEO() {
  return (
    <svg className="service-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 30l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M14 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M14 24h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.2" />
      <path d="M20 14v1m0 10v1m-6-6h1m10 0h1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

function IconPerformance() {
  return (
    <svg className="service-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 40L14 28l8 6 10-14 12-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 40L14 28l8 6 10-14 12-8" stroke="url(#perf-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <circle cx="14" cy="28" r="2.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="22" cy="34" r="2.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="20" r="2.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="44" cy="12" r="2.5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
      <path d="M38 12h6v0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M44 12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <defs>
        <linearGradient id="perf-grad" x1="4" y1="40" x2="44" y2="12">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   Services Data
   ───────────────────────────────────────────────────── */
const services = [
  {
    index: "01",
    title: "הנדסת UI/UX ממירה",
    desc: "ממשקים שמובילים את המבקר בדיוק לאן שאתה צריך. כל אלמנט מבוסס על לוגיקת המרה, לא על טעם אישי.",
    Icon: IconUX,
  },
  {
    index: "02",
    title: "ארכיטקטורת SEO מבוססת נתונים",
    desc: 'לא "קידום אתרים". תשתית טכנית שמובנית מהיסוד לדומיננטיות במנועי חיפוש — מבנה, סכמות, Core Web Vitals.',
    Icon: IconSEO,
  },
  {
    index: "03",
    title: "אופטימיזציית ביצועים",
    desc: "0.5 שניות טעינה. אפס פשרות. קוד נקי, תשתית CDN גלובלית, וכל פיקסל מותאם לביצועי שיא.",
    Icon: IconPerformance,
  },
];

/* ─────────────────────────────────────────────────────
   Process Steps Data
   ───────────────────────────────────────────────────── */
const processSteps = [
  {
    num: "01",
    title: "אפיון ואסטרטגיה",
    desc: "מחקר שוק, ניתוח מתחרים, הגדרת יעדי המרה ומיפוי מסלולי משתמש.",
  },
  {
    num: "02",
    title: "עיצוב ו-UX",
    desc: "Wireframes, עיצוב UI מדויק, ובדיקות שמישות — לפני שכותבים שורת קוד.",
  },
  {
    num: "03",
    title: "פיתוח והנדסה",
    desc: "קוד נקי, ארכיטקטורה מודרנית, ביצועים ואבטחה ברמת Enterprise.",
  },
  {
    num: "04",
    title: "השקה ואופטימיזציה",
    desc: "השקה מבוקרת, מעקב אנליטיקס, ואופטימיזציה מתמדת מבוססת נתונים.",
  },
];

/* ─────────────────────────────────────────────────────
   About Features Data
   ───────────────────────────────────────────────────── */
const features = [
  { num: "01", name: "ארכיטקטורת קוד חסינה" },
  { num: "02", name: "UX מבוסס מחקר ודאטה" },
  { num: "03", name: "ביצועים ברמת Enterprise" },
  { num: "04", name: "מדידה ואופטימיזציה מתמדת" },
];

/* ═════════════════════════════════════════════════════
   PAGE COMPONENT
   ═════════════════════════════════════════════════════ */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  /* ── GSAP + Lenis Initialization ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* ── Set initial states ── */
    gsap.set(".hero-label", { opacity: 0, y: 12 });
    gsap.set(".line-inner", { yPercent: 110 });
    gsap.set(".hero-sub", { opacity: 0, y: 20 });
    gsap.set(".hero-cta > *", { opacity: 0, y: 16 });
    gsap.set(".stat-block", { opacity: 0, y: 24 });
    gsap.set(".hero-visual", { opacity: 0, scale: 0.9 });

    /* ── Hero Reveal Timeline ── */
    const heroTL = gsap.timeline({ delay: 0.3 });

    heroTL
      .to(".hero-label", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
      .to(".line-inner", {
        yPercent: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
      }, "-=0.3")
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .to(".hero-cta > *", {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
      }, "-=0.3")
      .to(".hero-visual", { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .to(".stat-block", {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
      }, "-=0.6");

    /* ── Service Cards — ScrollTrigger ── */
    gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
        opacity: 0, y: 50, duration: 0.9, delay: i * 0.1, ease: "power3.out",
      });
    });

    /* ── Process Steps — ScrollTrigger ── */
    gsap.utils.toArray<HTMLElement>(".process-step").forEach((step, i) => {
      gsap.from(step, {
        scrollTrigger: { trigger: step, start: "top 88%", toggleActions: "play none none none" },
        opacity: 0, y: 40, duration: 0.8, delay: i * 0.1, ease: "power3.out",
      });
    });

    /* ── About Section ── */
    gsap.from(".about-title", {
      scrollTrigger: { trigger: ".about-section", start: "top 72%" },
      opacity: 0, y: 60, duration: 1, ease: "power3.out",
    });

    gsap.from(".about-body-text", {
      scrollTrigger: { trigger: ".about-body-cell", start: "top 80%" },
      opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
    });

    gsap.utils.toArray<HTMLElement>(".feature-item").forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 90%" },
        opacity: 0, y: 24, duration: 0.6, delay: i * 0.06, ease: "power3.out",
      });
    });

    /* ── CTA Section ── */
    gsap.from(".cta-section", {
      scrollTrigger: { trigger: ".cta-section", start: "top 80%" },
      opacity: 0, y: 40, duration: 1, ease: "power3.out",
    });

    /* ── Cleanup ── */
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <>
      <InteractiveCanvas />
      <div className="mesh-gradient" />
      <CustomCursor />

      <div className="page-content" ref={mainRef}>

        {/* ── Navbar ── */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="nav-brand magnetic">
              <NexusLogo />
              <span className="nav-brand-text">Nexus Sites</span>
            </div>
            <button
              className="nav-cta magnetic"
              onClick={() => setModalOpen(true)}
              id="navbar-cta"
            >
              תאם שיחת אסטרטגיה
            </button>
          </div>
        </nav>

        {/* ══════════════════════════════
           HERO
           ══════════════════════════════ */}
        <section className="hero" id="hero">
          <div className="hero-content">
            <div className="hero-text-col">
              <div className="hero-label">
                ✦&ensp;ארכיטקטורה דיגיטלית פרמיום&ensp;✦
              </div>

              <h1 className="hero-title">
                <div className="line-mask">
                  <div className="line-inner">אנחנו לא בונים אתרים.</div>
                </div>
                <div className="line-mask">
                  <div className="line-inner">אנחנו מהנדסים</div>
                </div>
                <div className="line-mask">
                  <div className="line-inner">
                    מכונות <span className="accent">צמיחה</span> דיגיטליות.
                  </div>
                </div>
              </h1>

              <p className="hero-sub">
                האתר שלך הוא לא חלון ראווה — הוא הנכס העסקי הכי קריטי שלך.
                אנחנו בונים אותו בהתאם.
              </p>

              <div className="hero-cta">
                <button
                  className="btn-primary magnetic"
                  onClick={() => setModalOpen(true)}
                  id="hero-cta"
                >
                  <span>תאם שיחת אסטרטגיה</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </button>
                <a className="btn-ghost magnetic" href="#about">
                  גלה את המתודולוגיה
                </a>
              </div>
            </div>

            {/* ── Hero Visual — Abstract Architecture Graphic ── */}
            <div className="hero-visual">
              <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-graphic">
                {/* Outer ring */}
                <circle cx="200" cy="200" r="160" stroke="var(--accent)" strokeWidth="0.5" opacity="0.15" />
                <circle cx="200" cy="200" r="120" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
                <circle cx="200" cy="200" r="80" stroke="var(--accent)" strokeWidth="0.5" opacity="0.2" />

                {/* Grid lines */}
                <line x1="40" y1="200" x2="360" y2="200" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
                <line x1="200" y1="40" x2="200" y2="360" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
                <line x1="87" y1="87" x2="313" y2="313" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
                <line x1="313" y1="87" x2="87" y2="313" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />

                {/* Floating nodes */}
                <circle cx="200" cy="200" r="6" fill="var(--accent)" opacity="0.6" className="node-pulse" />
                <circle cx="200" cy="80" r="4" fill="var(--accent)" opacity="0.3" />
                <circle cx="200" cy="320" r="4" fill="var(--accent)" opacity="0.3" />
                <circle cx="80" cy="200" r="4" fill="var(--accent)" opacity="0.3" />
                <circle cx="320" cy="200" r="4" fill="var(--accent)" opacity="0.3" />

                {/* Diagonal nodes */}
                <circle cx="120" cy="120" r="3" fill="var(--accent)" opacity="0.2" />
                <circle cx="280" cy="120" r="3" fill="var(--accent)" opacity="0.2" />
                <circle cx="120" cy="280" r="3" fill="var(--accent)" opacity="0.2" />
                <circle cx="280" cy="280" r="3" fill="var(--accent)" opacity="0.2" />

                {/* Connecting arcs */}
                <path d="M200 80 A120 120 0 0 1 320 200" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" strokeDasharray="6 8" />
                <path d="M80 200 A120 120 0 0 1 200 320" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" strokeDasharray="6 8" />

                {/* Center icon — abstract "N" */}
                <path d="M185 220 L185 180 L215 220 L215 180" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />

                {/* Orbiting glow */}
                <circle cx="200" cy="40" r="3" fill="var(--accent)" opacity="0.15" />
                <circle cx="360" cy="200" r="2" fill="var(--accent)" opacity="0.1" />
              </svg>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-block">
              <div className="stat-value">3x</div>
              <div className="stat-label">יחס המרה ממוצע</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <div className="stat-value">99.8%</div>
              <div className="stat-label">זמן פעילות</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-block">
              <div className="stat-value">&lt;0.5s</div>
              <div className="stat-label">זמן טעינה</div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           SERVICES
           ══════════════════════════════ */}
        <section className="services-section" id="services">
          <div className="services-wrap">
            <div className="services-header">
              <span className="section-label">מה אנחנו בונים</span>
              <h2>
                פתרונות.<br />
                לא<br />
                שירותים.
              </h2>
            </div>

            <div className="services-list">
              {services.map((s) => (
                <div key={s.index} className="service-card">
                  <div className="service-card-header">
                    <div className="service-icon-wrap">
                      <s.Icon />
                    </div>
                    <span className="service-index">{s.index}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           PROCESS
           ══════════════════════════════ */}
        <section className="process-section" id="process">
          <div className="process-inner">
            <div className="process-header">
              <span className="section-label">איך אנחנו עובדים</span>
              <h2 className="process-title">תהליך. לא אלתור.</h2>
              <p className="process-subtitle">
                ארבעה שלבים מובנים שמבטיחים תוצאה מדויקת, בזמן, ובתקציב.
              </p>
            </div>

            <div className="process-grid">
              {processSteps.map((step, i) => (
                <div key={step.num} className="process-step">
                  <div className="process-step-num">{step.num}</div>
                  <div className="process-step-line" />
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           ABOUT
           ══════════════════════════════ */}
        <section className="about-section" id="about">
          <div className="about-grid">
            <div className="about-label-cell">
              <div className="section-label">הגישה שלנו</div>
              <h2 className="about-title">
                מתודולוגיה.<br />לא אינטואיציה.
              </h2>
            </div>

            <div className="about-body-cell">
              <p className="about-body-text">
                כל אתר שאנחנו בונים נשען על ארכיטקטורה לוגית,
                קוד ללא פשרות, ומסלולי משתמש שתוכננו בדייקנות
                כירורגית. אנחנו לא מעצבים לפי טעם —
                אנחנו מהנדסים לפי נתונים.
              </p>
            </div>

            <div className="about-features-cell">
              <div className="features-grid">
                {features.map((f) => (
                  <div key={f.num} className="feature-item magnetic">
                    <span className="feature-num">{f.num}</span>
                    <span className="feature-name">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           CTA
           ══════════════════════════════ */}
        <section className="cta-section">
          <div className="cta-glow" />
          <h2>המתחרים שלך כבר שדרגו.</h2>
          <p>
            כל יום שהאתר שלך לא עובד בשבילך — הוא עובד נגדך.
            השאר פרטים — נחזור עם ניתוח ראשוני תוך 24 שעות.
          </p>
          <button
            className="btn-primary btn-primary--large magnetic"
            onClick={() => setModalOpen(true)}
            id="cta-banner-btn"
          >
            <span>הגש בקשה לפרויקט</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </button>
        </section>

        {/* ══════════════════════════════
           FOOTER
           ══════════════════════════════ */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <NexusLogo />
              <span className="footer-brand-name">Nexus Sites</span>
            </div>

            <div className="footer-contact">
              <a href="tel:+972500000000" className="footer-link magnetic" aria-label="Phone">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </a>
              <a href="mailto:office@nexussites.co.il" className="footer-link magnetic" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </a>
              <a href="https://wa.me/972500000000" target="_blank" rel="noreferrer" className="footer-link magnetic" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>

            <div className="footer-legal">
              <span className="footer-copy">
                © {new Date().getFullYear()} Nexus Sites — כל הזכויות שמורות
              </span>
            </div>
          </div>
        </footer>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

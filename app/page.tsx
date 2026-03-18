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
   SVG Logo Component — Geometric Nexus "N"
   ───────────────────────────────────────────────────── */
function NexusLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`nexus-logo ${className}`}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* N shape — left vertical + diagonal + right vertical */}
      <path
        className="logo-stroke"
        d="M12 38 L12 10 L36 38 L36 10"
      />
      {/* Nexus connecting lines to center node */}
      <line className="logo-stroke" x1="12" y1="10" x2="24" y2="24" opacity="0.3" />
      <line className="logo-stroke" x1="36" y1="38" x2="24" y2="24" opacity="0.3" />
      {/* Nodes at vertices */}
      <circle className="logo-node" cx="12" cy="10" r="2.5" />
      <circle className="logo-node" cx="12" cy="38" r="2.5" />
      <circle className="logo-node" cx="36" cy="10" r="2.5" />
      <circle className="logo-node" cx="36" cy="38" r="2.5" />
      {/* Center nexus node */}
      <circle className="logo-node" cx="24" cy="24" r="2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   Services Data
   ───────────────────────────────────────────────────── */
const services = [
  {
    index: "01",
    title: "בניית אתרים",
    desc: "אנחנו בונים אתרים מהירים, מעוצבים ומותאמים לכל מכשיר — ממשקי משתמש מנצחים שמשאירים רושם.",
  },
  {
    index: "02",
    title: "עיצוב מודרני",
    desc: "עיצוב UI/UX ברמה גבוהה שמשלב אסתטיקה מרהיבה עם חוויית משתמש אינטואיטיבית.",
  },
  {
    index: "03",
    title: "קידום SEO",
    desc: "אסטרטגיית SEO מבוססת נתונים שמניחה את האתר שלך בראש תוצאות החיפוש ומביאה תנועה אורגנית.",
  },
];

/* ─────────────────────────────────────────────────────
   About Features Data
   ───────────────────────────────────────────────────── */
const features = [
  { num: "01", name: "עיצוב מותאם אישית" },
  { num: "02", name: "מהירות טעינה ו-Core Web Vitals" },
  { num: "03", name: "אופטימיזציה למנועי חיפוש" },
  { num: "04", name: "תמיכה ותחזוקה" },
];

/* ═════════════════════════════════════════════════════
   PAGE COMPONENT
   ═════════════════════════════════════════════════════ */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  /* ── GSAP + Lenis Initialization ── */
  useEffect(() => {
    /* Lenis smooth scroll */
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* ── Set initial states BEFORE timeline ── */
    gsap.set(".hero-label", { opacity: 0 });
    gsap.set(".line-inner", { yPercent: 110 });
    gsap.set(".hero-sub", { opacity: 0, y: 30 });
    gsap.set(".hero-cta > *", { opacity: 0, y: 20 });
    gsap.set(".stat-block", { opacity: 0, y: 30 });

    /* ── Hero Reveal Timeline ── */
    const heroTL = gsap.timeline({ delay: 0.5 });

    heroTL
      .to(".hero-label", { opacity: 1, duration: 0.8, ease: "power2.out" })
      .to(".line-inner", {
        yPercent: 0,
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.13,
      }, "-=0.3")
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.6")
      .to(".hero-cta > *", {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
      }, "-=0.4")
      .to(".stat-block", {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
      }, "-=0.3");

    /* ── Service Cards — ScrollTrigger Reveal ── */
    gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 60,
        duration: 0.9,
        delay: i * 0.08,
        ease: "power3.out",
      });
    });

    /* ── About Section Reveals ── */
    gsap.from(".about-title", {
      scrollTrigger: { trigger: ".about-section", start: "top 72%" },
      opacity: 0,
      y: 80,
      duration: 1.1,
      ease: "power3.out",
    });

    gsap.from(".about-body-text", {
      scrollTrigger: { trigger: ".about-body-cell", start: "top 80%" },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
    });

    gsap.utils.toArray<HTMLElement>(".feature-item").forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 90%" },
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: i * 0.08,
        ease: "power3.out",
      });
    });

    /* ── CTA Section Reveal ── */
    gsap.from(".cta-section h2", {
      scrollTrigger: { trigger: ".cta-section", start: "top 75%" },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".cta-section p", {
      scrollTrigger: { trigger: ".cta-section", start: "top 72%" },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.15,
      ease: "power3.out",
    });

    /* ── Service Card 3D Tilt ── */
    const cards = document.querySelectorAll<HTMLElement>(".service-card");
    const tiltHandlers = new Map<HTMLElement, { move: (e: MouseEvent) => void; leave: () => void }>();

    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 800,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const leave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      tiltHandlers.set(card, { move, leave });
    });

    /* ── Cleanup ── */
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(() => {});
      tiltHandlers.forEach(({ move, leave }, card) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      {/* ── Fixed Background Layers ── */}
      <InteractiveCanvas />
      <div className="mesh-gradient" />
      <CustomCursor />

      {/* ── Page Content ── */}
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
              קבל הצעת מחיר
            </button>
          </div>
        </nav>

        {/* ══════════════════════════════
           HERO
           ══════════════════════════════ */}
        <section className="hero" id="hero">
          <div className="hero-label">
            ✦&ensp;סוכנות ווב פרמיום&ensp;✦
          </div>

          <h1 className="hero-title">
            <div className="line-mask">
              <div className="line-inner">אנחנו Nexus Sites</div>
            </div>
            <div className="line-mask">
              <div className="line-inner">בונים אתרי אינטרנט</div>
            </div>
            <div className="line-mask">
              <div className="line-inner">
                שמביאים <span className="gold">לקוחות</span>
              </div>
            </div>
          </h1>

          <p className="hero-sub">
            מסוכנות איקומרס מודרנית ועד חנויות לעסקים שרוצים לגדול.
            מהרעיון ועד ההשקה — אנחנו לצידך.
          </p>

          <div className="hero-cta">
            <button
              className="btn-gold magnetic"
              onClick={() => setModalOpen(true)}
              id="hero-cta"
            >
              קבל הצעת מחיר
            </button>
            <a className="btn-ghost magnetic" href="#services">
              הכירו אותנו
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-block">
              <div className="stat-value">3x</div>
              <div className="stat-label">יחס המרה</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">98%</div>
              <div className="stat-label">שביעות רצון</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">+50</div>
              <div className="stat-label">פרויקטים שהושלמו</div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           SERVICES — Sticky Scroll
           ══════════════════════════════ */}
        <section className="services-section" id="services">
          <div className="services-wrap">
            <div className="services-header">
              <span className="services-label">מה אנחנו מציעים</span>
              <h2>
                פתרון<br />
                דיגיטלי<br />
                מקיף
              </h2>
            </div>

            <div className="services-list">
              {services.map((s) => (
                <div key={s.index} className="service-card">
                  <span className="service-index">{s.index}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           ABOUT — Editorial
           ══════════════════════════════ */}
        <section className="about-section" id="about">
          <div className="about-grid">
            <div className="about-label-cell">
              <div className="about-label-text">קצת עלינו</div>
              <h2 className="about-title">
                מי<br />אנחנו?
              </h2>
            </div>

            <div className="about-body-cell">
              <p className="about-body-text">
                Nexus Sites היא סוכנות לבניית אתרים המתמקדת ביצירת אתרים
                מודרניים, מהירים וממירים שמביאים לעסקים יותר לקוחות.
                אנחנו מאמינים שכל עסק, קטן כגדול, ראוי לנוכחות דיגיטלית
                שמייצגת אותו בצורה הטובה ביותר.
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
          <h2>מוכן לאתר שיגדיל את העסק שלך?</h2>
          <p>השאר פרטים עכשיו — ניצור איתך קשר תוך 24 שעות.</p>
          <button
            className="btn-gold magnetic"
            onClick={() => setModalOpen(true)}
            id="cta-banner-btn"
          >
            קבל הצעת מחיר חינם
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
            <span className="footer-copy">
              © {new Date().getFullYear()} Nexus Sites — כל הזכויות שמורות
            </span>
          </div>
        </footer>
      </div>

      {/* ── Modal ── */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

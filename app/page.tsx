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
    title: "הנדסת UI/UX ממירה",
    desc: "ממשקים שמובילים את המבקר בדיוק לאן שאתה צריך. כל אלמנט מבוסס על לוגיקת המרה, לא על טעם אישי.",
  },
  {
    index: "02",
    title: "ארכיטקטורת SEO מבוססת נתונים",
    desc: "לא \"קידום אתרים\". תשתית טכנית שמובנית מהיסוד לדומיננטיות במנועי חיפוש — מבנה, סכמות, Core Web Vitals.",
  },
  {
    index: "03",
    title: "אופטימיזציית ביצועים",
    desc: "0.5 שניות טעינה. אפס פשרות. קוד נקי, תשתית CDN גלובלית, וכל פיקסל מותאם לביצועי שיא.",
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
      gsap.ticker.remove(() => { });
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
              תאם שיחת אסטרטגיה
            </button>
          </div>
        </nav>

        {/* ══════════════════════════════
           HERO
           ══════════════════════════════ */}
        <section className="hero" id="hero">
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
                מכונות <span className="gold">צמיחה</span> דיגיטליות.
              </div>
            </div>
          </h1>

          <p className="hero-sub">
            האתר שלך הוא לא חלון ראווה — הוא הנכס העסקי הכי קריטי שלך.
            אנחנו בונים אותו בהתאם.
          </p>

          <div className="hero-cta">
            <button
              className="btn-gold magnetic"
              onClick={() => setModalOpen(true)}
              id="hero-cta"
            >
              תאם שיחת אסטרטגיה
            </button>
            <a className="btn-ghost magnetic" href="#about">
              גלה את המתודולוגיה
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-block">
              <div className="stat-value">3x</div>
              <div className="stat-label">יחס המרה ממוצע</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">99.8%</div>
              <div className="stat-label">זמן פעילות</div>
            </div>
            <div className="stat-block">
              <div className="stat-value">&lt;0.5s</div>
              <div className="stat-label">זמן טעינה</div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
           SERVICES — Sticky Scroll
           ══════════════════════════════ */}
        <section className="services-section" id="services">
          <div className="services-wrap">
            <div className="services-header">
              <span className="services-label">מה אנחנו בונים</span>
              <h2>
                פתרונות.<br />
                לא<br />
                שירותים.
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
              <div className="about-label-text">הגישה שלנו</div>
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
          <h2>המתחרים שלך כבר שדרגו.</h2>
          <p>
            כל יום שהאתר שלך לא עובד בשבילך — הוא עובד נגדך.
            השאר פרטים — נחזור עם ניתוח ראשוני תוך 24 שעות.
          </p>
          <button
            className="btn-gold magnetic"
            onClick={() => setModalOpen(true)}
            id="cta-banner-btn"
          >
            הגש בקשה לפרויקט
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </a>
              <a href="mailto:office@nexussites.co.il" className="footer-link magnetic" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </a>
              <a href="https://wa.me/972500000000" target="_blank" rel="noreferrer" className="footer-link magnetic" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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

      {/* ── Modal ── */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

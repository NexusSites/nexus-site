"use client";

import { useState } from "react";
import ContactModal from "@/components/ContactModal";

const services = [
  {
    icon: "🌐",
    title: "בניית אתרים",
    desc: "אנחנו בונים אתרים מהירים, מעוצבים ומותאמים לכל מכשיר — ממשקי משתמש מנצחים שמשאירים רושם.",
    delay: "0.1s",
  },
  {
    icon: "🎨",
    title: "עיצוב מודרני",
    desc: "עיצוב UI/UX ברמה גבוהה שמשלב אסתטיקה מרהיבה עם חוויית משתמש אינטואיטיבית.",
    delay: "0.2s",
  },
  {
    icon: "🚀",
    title: "קידום SEO",
    desc: "אסטרטגיית SEO מבוססת נתונים שמניחה את האתר שלך בראש תוצאות החיפוש ומביאה תנועה אורגנית.",
    delay: "0.3s",
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* ─── Navbar ─── */}
      <nav className="navbar">
        <div className="container">
          <span className="navbar-logo">Nexus Sites</span>
          <button
            className="btn-primary"
            onClick={() => setModalOpen(true)}
            id="navbar-cta"
          >
            קבל הצעת מחיר
          </button>
        </div>
      </nav>

      <main>
        {/* ─── Hero ─── */}
        <section className="hero" id="hero">
          <div className="hero-bg-orb hero-bg-orb-1" />
          <div className="hero-bg-orb hero-bg-orb-2" />

          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <span>✦</span>
                <span>סוכנות ווב פרמיום</span>
              </div>

              <h1 className="hero-headline">
                בונים אתרי אינטרנט<br />
                שמביאים{" "}
                <span className="highlight">לקוחות</span>
              </h1>

              <p className="hero-subtext">
                אנחנו ב-Nexus Sites מתמחים בבניית אתרים מודרניים לעסקים
                שרוצים לגדול. מהרעיון ועד ההשקה — אנחנו לצידך.
              </p>

              <div className="hero-actions">
                <button
                  className="btn-primary"
                  onClick={() => setModalOpen(true)}
                  id="hero-cta"
                >
                  🚀 השאר פרטים
                </button>
                <a className="btn-outline" href="#services">
                  הכירו אותנו
                </a>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">פרויקטים שהושלמו</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">לקוחות מרוצים</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">3x</div>
                  <div className="stat-label">יותר המרות</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Services ─── */}
        <section className="section services" id="services">
          <div className="container">
            <div className="text-center">
              <span className="section-label">השירותים שלנו</span>
              <h2 className="section-title">מה אנחנו מציעים</h2>
              <p className="section-subtitle">
                פתרון דיגיטלי מקיף — מעיצוב ופיתוח ועד קידום אורגני
              </p>
            </div>

            <div className="services-grid">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="service-card"
                  style={{ animationDelay: s.delay }}
                >
                  <div className="service-icon">{s.icon}</div>
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About ─── */}
        <section className="section about" id="about">
          <div className="container">
            <div className="about-inner">
              <div className="about-visual">💻</div>

              <div className="about-text">
                <span className="section-label">קצת עלינו</span>
                <h2 className="section-title">מי אנחנו?</h2>
                <p>
                  Nexus Sites היא סוכנות לבניית אתרים המתמקדת ביצירת אתרים
                  מודרניים, מהירים וממירים שמביאים לעסקים יותר לקוחות.
                </p>
                <p>
                  אנחנו מאמינים שכל עסק, קטן כגדול, ראוי לנוכחות דיגיטלית
                  שמייצגת אותו בצורה הטובה ביותר.
                </p>
                <ul className="about-features">
                  <li>עיצוב מותאם אישית לכל לקוח</li>
                  <li>מהירות טעינה מעולה ו-Core Web Vitals</li>
                  <li>אופטימיזציה למנועי חיפוש מובנית</li>
                  <li>תמיכה ותחזוקה שוטפת</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="cta-banner">
          <div className="container">
            <h2 className="section-title">
              מוכן לאתר שיגדיל את העסק שלך?
            </h2>
            <p>השאר פרטים עכשיו — ניצור איתך קשר תוך 24 שעות</p>
            <button
              className="btn-primary"
              onClick={() => setModalOpen(true)}
              id="cta-banner-btn"
            >
              🎯 קבל הצעת מחיר חינם
            </button>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="container">
          <span className="footer-logo">Nexus Sites</span>
          <span className="footer-copy">
            © {new Date().getFullYear()} Nexus Sites — כל הזכויות שמורות
          </span>
        </div>
      </footer>

      {/* ─── Modal ─── */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

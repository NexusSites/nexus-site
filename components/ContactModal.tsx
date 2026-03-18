"use client";

import { useRef, useState, useTransition } from "react";
import { submitLead } from "@/app/actions/submitLead";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | null
    | { success: true }
    | { success: false; error: string }
  >(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleClose() {
    setResult(null);
    formRef.current?.reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitLead(formData);
      setResult(res);
      if (res.success) formRef.current?.reset();
    });
  }

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      aria-modal="true"
      role="dialog"
      aria-label="טופס יצירת קשר"
    >
      <div className="modal-card">
        {/* Close button */}
        <button
          className="modal-close"
          onClick={handleClose}
          aria-label="סגור"
        >
          ✕
        </button>

        {result?.success ? (
          /* ─── Success state ─── */
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h2>תודה רבה!</h2>
            <p>קיבלנו את פרטיך — ניצור איתך קשר בהקדם.</p>
            <button className="btn-submit" onClick={handleClose}>
              סגור
            </button>
          </div>
        ) : (
          /* ─── Form state ─── */
          <>
            <div className="modal-header">
              <h2>קבל הצעת מחיר</h2>
              <p>מלא את הפרטים ונחזור אליך תוך 24 שעות</p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="modal-form"
              noValidate
            >
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: "none" }}
              />

              <div className="form-group">
                <label htmlFor="lead-name">שם מלא *</label>
                <input
                  id="lead-name"
                  type="text"
                  name="name"
                  placeholder="ישראל ישראלי"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead-phone">טלפון *</label>
                <input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  placeholder="050-0000000"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead-email">אימייל *</label>
                <input
                  id="lead-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  disabled={isPending}
                />
              </div>

              {result && !result.success && (
                <p className="form-error" role="alert">
                  {result.error}
                </p>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="spinner" />
                ) : (
                  "שלח פרטים"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

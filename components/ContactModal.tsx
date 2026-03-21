/**
 * ContactModal — full-screen overlay with lead capture form.
 *
 * Animation:
 *  · Backdrop: fade in opacity 0→1
 *  · Card: slides up from y:60 + fade in
 *  · AnimatePresence handles the mount/unmount lifecycle
 *
 * Accessibility:
 *  · aria-modal, role="dialog", aria-label
 *  · Click on backdrop (outside card) closes modal
 *  · Honeypot field for basic bot protection
 */
'use client';

import { useRef, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '@/app/actions/submitLead';
import MagneticButton from './MagneticButton';

interface ContactModalProps {
  isOpen:   boolean;
  onClose:  () => void;
}

const EXPO = [0.19, 1, 0.22, 1] as [number, number, number, number];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<null | { success: true } | { success: false; error: string }>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    setResult(null);
    formRef.current?.reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitLead(data);
      setResult(res);
      if (res.success) formRef.current?.reset();
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* Backdrop */
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={e => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          aria-label="טופס יצירת קשר"
        >
          <motion.div
            className="relative w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-sm p-8 md:p-10"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,    y: 40, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EXPO }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 text-white/30 hover:text-white text-sm transition-colors"
              aria-label="סגור"
            >
              ✕
            </button>

            {result?.success ? (
              /* ── Success ── */
              <div className="text-center py-6">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="text-xl font-black mb-2">תודה רבה!</h2>
                <p className="text-white/45 text-sm mb-8">קיבלנו את פרטיך — ניצור איתך קשר בהקדם.</p>
                <MagneticButton
                  onClick={handleClose}
                  className="bg-white text-black font-bold text-sm px-6 py-3 rounded-sm"
                >
                  סגור
                </MagneticButton>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <div className="mb-7">
                  <h2 className="text-xl font-black mb-1">קבל הצעת מחיר</h2>
                  <p className="text-white/40 text-sm">מלא את הפרטים ונחזור אליך תוך 24 שעות</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  {/* Honeypot */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

                  {[
                    { id: 'lead-name',  name: 'name',  type: 'text',  label: 'שם מלא *',  ph: 'ישראל ישראלי' },
                    { id: 'lead-phone', name: 'phone', type: 'tel',   label: 'טלפון *',   ph: '050-0000000'  },
                    { id: 'lead-email', name: 'email', type: 'email', label: 'אימייל *',  ph: 'you@example.com' },
                  ].map(field => (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <label htmlFor={field.id} className="text-xs text-white/45 font-medium tracking-wide">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        name={field.name}
                        placeholder={field.ph}
                        required
                        disabled={isPending}
                        className="
                          bg-white/[0.04] border border-white/10 rounded-sm
                          text-white text-sm font-light px-4 py-3
                          placeholder:text-white/18
                          focus:outline-none focus:border-white/40
                          disabled:opacity-50
                          transition-colors
                        "
                      />
                    </div>
                  ))}

                  {result && !result.success && (
                    <p className="text-red-400 text-xs" role="alert">{result.error}</p>
                  )}

                  <MagneticButton
                    onClick={() => {}}   /* form submit handled by onSubmit */
                    className="
                      w-full bg-white text-black font-bold text-sm py-3.5
                      rounded-sm tracking-wide mt-1
                      hover:bg-white/90 transition-colors
                      disabled:opacity-50
                    "
                  >
                    {isPending
                      ? <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      : 'שלח פרטים'
                    }
                  </MagneticButton>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

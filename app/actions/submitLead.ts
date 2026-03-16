"use server";

import { createClient } from "@supabase/supabase-js";

// ── Simple in-memory rate limiter (per-process, resets on cold start) ──
const submissionTracker = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 submissions per IP per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionTracker.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  submissionTracker.set(ip, timestamps);
  return false;
}

// ── Validation helpers ──
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  // Accept Israeli mobile/landline: 7–15 digits, optional leading +
  return /^\+?[\d\s\-]{7,15}$/.test(phone);
}

export type SubmitLeadResult =
  | { success: true }
  | { success: false; error: string };

export async function submitLead(
  formData: FormData
): Promise<SubmitLeadResult> {
  // ── Honeypot anti-spam ──
  const honeypot = formData.get("website") as string;
  if (honeypot && honeypot.trim() !== "") {
    // Bot filled in the hidden field — silently succeed
    return { success: true };
  }

  // ── Extract & trim ──
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  // ── Validate ──
  if (!name || name.length < 2) {
    return { success: false, error: "נא להזין שם מלא (לפחות 2 תווים)." };
  }
  if (!isValidPhone(phone)) {
    return { success: false, error: "נא להזין מספר טלפון תקין." };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "נא להזין כתובת אימייל תקינה." };
  }

  // ── Rate limit (placeholder IP — in production read from headers) ──
  // Next.js server actions don't expose req directly; use a stable key per session
  const rateLimitKey = `${name}:${email}`;
  if (isRateLimited(rateLimitKey)) {
    return {
      success: false,
      error: "שלחת יותר מדי בקשות. אנא נסה שוב בעוד מספר דקות.",
    };
  }

  // ── Create Supabase client (lazy — only when action is called) ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[submitLead] Missing Supabase env vars");
    return {
      success: false,
      error: "שגיאת הגדרות שרת. אנא פנה אלינו ישירות.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── Insert into Supabase ──
  const { error } = await supabase
    .from("leads")
    .insert({ name, phone, email });

  if (error) {
    console.error("[submitLead] Supabase error:", error.message);
    return {
      success: false,
      error: "אירעה שגיאה בשמירת הפרטים. נסה שוב מאוחר יותר.",
    };
  }

  return { success: true };
}

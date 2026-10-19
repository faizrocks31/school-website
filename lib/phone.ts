import { z } from "zod";

/**
 * Indian mobile numbers: exactly 10 digits, starting 6-9.
 * The +91 prefix is shown as a fixed, non-editable prefix in the UI, so the
 * value that travels here is expected to be the bare 10-digit national number.
 * We still strip a leading country code defensively, in case a client posts one.
 */
export const MOBILE_REGEX = /^[6-9]\d{9}$/;
export const MOBILE_LENGTH = 10;
export const MOBILE_PREFIX = "+91";

const MOBILE_ERROR = "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.";

/** Strip formatting and an optional +91 / 91 / 0 prefix, leaving bare digits. */
export function toNationalNumber(raw: string): string {
  let s = (raw ?? "").replace(/\D/g, "");
  if (s.length === 12 && s.startsWith("91")) s = s.slice(2);
  else if (s.length === 11 && s.startsWith("0")) s = s.slice(1);
  return s;
}

/** Digits only, capped at 10 — for live input filtering (handles a pasted +91). */
export function sanitizeMobileInput(raw: string): string {
  let s = (raw ?? "").replace(/\D/g, "");
  // Only strip a country/trunk prefix when more than 10 digits arrived at once
  // (i.e. a paste). Typing digit-by-digit never exceeds 10 and is left alone.
  if (s.length > MOBILE_LENGTH) {
    if (s.length === 12 && s.startsWith("91")) s = s.slice(2);
    else if (s.length === 11 && s.startsWith("0")) s = s.slice(1);
  }
  return s.slice(0, MOBILE_LENGTH);
}

/** Zod field: accepts optional formatting, normalizes, enforces a valid Indian mobile. */
export const mobileNumberField = z
  .string()
  .trim()
  .min(1, "Please enter your mobile number.")
  .transform(toNationalNumber)
  .refine((v) => MOBILE_REGEX.test(v), MOBILE_ERROR);

/** Display helper: "+91 98765 43210" */
export function formatMobile(national: string): string {
  const n = toNationalNumber(national);
  if (!MOBILE_REGEX.test(n)) return national;
  return `${MOBILE_PREFIX} ${n.slice(0, 5)} ${n.slice(5)}`;
}

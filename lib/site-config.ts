/**
 * Fallback content used only when the database is unreachable or not yet
 * migrated. The database is the real source of truth — the school name,
 * tagline, contact details and theme are all managed in Admin → Site Settings.
 *
 * Keep these values obviously generic: if this fallback ever reaches a visitor,
 * it must not look like real school information.
 */
export const siteConfig = {
  name: "Your School Name",
  tagline: "Empowering Young Minds for a Brighter Tomorrow",
  description: "A modern school website — placeholder content until real school information is supplied.",
  logoUrl: "",
  mapEmbedUrl: "",
  contact: {
    address: "School address — set this in Admin → Site Settings",
    phone: "+91 00000 00000",
    email: "info@example.com",
    hours: "Office hours — set this in Admin → Site Settings",
  },
  social: { facebook: "", instagram: "", youtube: "" },
};

export const ADMISSION_CLASSES = [
  "Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5",
  "Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12",
] as const;

export const AGE_RANGE = { min: 3, max: 18 } as const;

/**
 * Maximum enquiries allowed per contact — configurable.
 * Change `maxPerPhone` / `maxPerEmail` and rebuild (npm run build).
 * Set to e.g. 3 means the 4th enquiry with the same phone/email is rejected with 409.
 */
export const ENQUIRY_LIMITS = {
  maxPerPhone: 3,
  maxPerEmail: 3,
} as const;

/**
 * Maximum "Leave a Message" submissions allowed per mobile number.
 * Set to 2 means the 3rd message from the same number is rejected with 409.
 */
export const MESSAGE_LIMITS = {
  maxPerPhone: 2,
} as const;

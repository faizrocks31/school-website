export const siteConfig = {
  name: "Sunrise Public School",
  tagline: "Empowering Young Minds for a Brighter Tomorrow",
  description: "A modern school website — placeholder content until real school information is supplied.",
  logoUrl: "",
  contact: {
    address: "123 Education Lane, Knowledge City, State — PIN 110001",
    phone: "+91 98765 43210",
    email: "info@sunrisepublicschool.example.com",
    hours: "Mon – Sat: 8:00 AM – 2:00 PM",
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

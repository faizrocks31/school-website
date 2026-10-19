import { z } from "zod";
import { ADMISSION_CLASSES, AGE_RANGE } from "@/lib/site-config";
import { mobileNumberField } from "@/lib/phone";

const nameRegex = new RegExp("^[\\p{L}\\p{M} .'\\-]+$", "u");

export const admissionEnquirySchema = z.object({
  studentName: z.string().trim().min(2, "Please enter the student's name.").max(120)
    .regex(nameRegex, "Name may contain letters, spaces, apostrophes and hyphens only."),
  fatherName: z.string().trim().min(2, "Please enter the father's name.").max(120)
    .regex(nameRegex, "Name may contain letters, spaces, apostrophes and hyphens only."),
  studentAge: z.coerce.number().int("Please enter a valid age.").min(AGE_RANGE.min, `Age must be at least ${AGE_RANGE.min}.`).max(AGE_RANGE.max, `Age must be at most ${AGE_RANGE.max}.`),
  contactNumber: mobileNumberField,
  address: z.string().trim().min(10, "Please enter the complete address.").max(1000),
  admissionClass: z.enum(ADMISSION_CLASSES as unknown as [string, ...string[]], { errorMap: () => ({ message: "Please select a class." }) }),
  parentEmail: z.string().trim().email("Please enter a valid email address.").max(254).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Please acknowledge the privacy notice." }) }),
});

export type AdmissionEnquiryInput = z.infer<typeof admissionEnquirySchema>;

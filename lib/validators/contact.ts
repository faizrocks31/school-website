import { z } from "zod";
import { mobileNumberField } from "@/lib/phone";

const nameRegex = new RegExp("^[\\p{L}\\p{M} .'\\-]+$", "u");

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80)
    .regex(nameRegex, "Name may contain letters, spaces, apostrophes and hyphens only."),
  contactNumber: mobileNumberField,
  message: z.string().trim().min(10, "Please write a message of at least 10 characters.").max(2000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

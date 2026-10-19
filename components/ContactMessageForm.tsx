"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validators/contact";
import { Label, Input, Textarea, FieldError } from "@/components/ui/Field";
import { MobileInput, mobileRegisterProps } from "@/components/ui/MobileInput";
import { ModernIcon } from "@/components/ui/ModernIcon";
import { Button } from "@/components/ui/Button";

export function ContactMessageForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
  });

  async function onSubmit(data: ContactMessageInput) {
    setServerError("");
    try {
      const res = await fetch("/api/v1/contact-messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors) {
          const msgs = Object.values(json.errors as Record<string,string>).join(" ");
          setServerError(msgs || json.message || "We could not send your message. Please try again.");
        } else setServerError(json.message || "We could not send your message. Please try again.");
        return;
      }
      setSent(true);
      reset();
    } catch {
      setServerError("We could not send your message. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="flex justify-center">
          <ModernIcon name="circleCheck" color="green" variant="solid" size="lg" shape="circle" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-green-900">Thank you for contacting us</h3>
        <p className="mt-2 text-sm text-green-800">Your message has been received. Our school team will get back to you soon.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/" className="text-sm font-semibold text-primary underline">Back to Home</Link>
          <button onClick={()=>setSent(false)} className="text-sm font-semibold text-primary underline">Send another message</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-primary">Leave a Message</h2>
      <p className="text-sm text-text-muted mt-1">Please don&apos;t hesitate to contact us for more information.</p>
      {serverError && <div role="alert" className="mt-4 bg-red-50 border border-red-200 text-error text-sm rounded-xl px-4 py-3">{serverError}</div>}
      <div className="mt-6 grid gap-5">
        <div>
          <Label required htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label required htmlFor="contactNumber">Mobile Number</Label>
          <MobileInput
            id="contactNumber"
            placeholder="10-digit mobile number"
            error={errors.contactNumber?.message}
            {...mobileRegisterProps(register("contactNumber"))}
          />
          <p id="contactNumber-hint" className="text-xs text-text-muted mt-1">Enter the 10-digit number without +91.</p>
          <FieldError>{errors.contactNumber?.message}</FieldError>
        </div>
        <div>
          <Label required htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Please write your message" rows={4} error={errors.message?.message} {...register("message")} />
          <FieldError>{errors.message?.message}</FieldError>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-text-muted flex items-start gap-3">
        <ModernIcon name="shield" color="green" size="sm" shape="rounded" />
        <span>We use the details above only to respond to your message. Messages are visible to authorized school staff only.</span>
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full sm:w-auto sm:px-10">
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

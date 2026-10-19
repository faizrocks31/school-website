"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { admissionEnquirySchema, type AdmissionEnquiryInput } from "@/lib/validators/admission";
import { ADMISSION_CLASSES } from "@/lib/site-config";
import { Label, Input, Textarea, Select, FieldError } from "@/components/ui/Field";
import { MobileInput, mobileRegisterProps } from "@/components/ui/MobileInput";
import { ModernIcon } from "@/components/ui/ModernIcon";
import { Button } from "@/components/ui/Button";

export function AdmissionEnquiryForm() {
  const [success, setSuccess] = useState<{ enquiryNumber: string } | null>(null);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdmissionEnquiryInput>({
    resolver: zodResolver(admissionEnquirySchema),
    defaultValues: { parentEmail: "" },
  });

  async function onSubmit(data: AdmissionEnquiryInput) {
    setServerError("");
    try {
      const res = await fetch("/api/v1/admission-enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          const msgs = Object.values(json.errors as Record<string,string>).join(" ");
          setServerError(msgs || json.message || "We could not submit your application. Please try again.");
        } else setServerError(json.message || "We could not submit your application. Please try again.");
        return;
      }
      setSuccess({ enquiryNumber: json.enquiryNumber });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError("We could not submit your application. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="flex justify-center">
          <ModernIcon name="circleCheck" color="green" variant="solid" size="lg" shape="circle" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-green-900">Thank you for applying to our school!</h3>
        <p className="mt-2 text-sm text-green-800">Your application has been submitted successfully. Please keep your reference number for future communication. Our school team will contact you soon.</p>
        <p className="mt-4 inline-block bg-white border border-green-200 rounded-xl px-6 py-3 font-mono font-bold text-primary text-lg">{success.enquiryNumber}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link href="/" className="text-sm font-semibold text-primary underline">Back to Home</Link>
          <button onClick={()=>setSuccess(null)} className="text-sm font-semibold text-primary underline">Submit another application</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      {serverError && <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-error text-sm rounded-xl px-4 py-3">{serverError}</div>}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label required htmlFor="studentName">Student Name</Label>
          <Input id="studentName" placeholder="Enter student's full name" autoComplete="name" error={errors.studentName?.message} {...register("studentName")} />
          <FieldError>{errors.studentName?.message}</FieldError>
        </div>
        <div>
          <Label required htmlFor="fatherName">Father&apos;s Name</Label>
          <Input id="fatherName" placeholder="Enter father's full name" error={errors.fatherName?.message} {...register("fatherName")} />
          <FieldError>{errors.fatherName?.message}</FieldError>
        </div>
        <div>
          <Label required htmlFor="studentAge">Student Age</Label>
          <Input id="studentAge" type="number" placeholder="Enter age in years" min={3} max={18} error={errors.studentAge?.message} {...register("studentAge")} />
          <FieldError>{errors.studentAge?.message}</FieldError>
        </div>
        <div>
          <Label required htmlFor="admissionClass">Class Seeking Admission</Label>
          <Select id="admissionClass" defaultValue="" error={errors.admissionClass?.message} {...register("admissionClass")}>
            <option value="" disabled>Select class</option>
            {ADMISSION_CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
          </Select>
          <FieldError>{errors.admissionClass?.message}</FieldError>
        </div>
        <div>
          <Label required htmlFor="contactNumber">Parent/Guardian Contact Number</Label>
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
          <Label htmlFor="parentEmail">Parent/Guardian Email <span className="text-text-muted font-normal">(optional)</span></Label>
          <Input id="parentEmail" type="email" placeholder="Enter email address" autoComplete="email" error={errors.parentEmail?.message} {...register("parentEmail")} />
          <FieldError>{errors.parentEmail?.message}</FieldError>
        </div>
        <div className="md:col-span-2">
          <Label required htmlFor="address">Residential Address</Label>
          <Textarea id="address" placeholder="Enter house number, locality, village or city, district, and state" error={errors.address?.message} {...register("address")} />
          <FieldError>{errors.address?.message}</FieldError>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-text-muted flex items-start gap-3">
        <ModernIcon name="shield" color="green" size="sm" shape="rounded" />
        <span>We collect only the information needed for your admission application and use it solely to contact you about admission. Application data is accessible only to authorized school staff. <Link href="/contact" className="text-secondary underline">Contact us</Link> for any privacy questions.</span>
      </div>
      <label className="mt-3 flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>I acknowledge that the school will use the information above to contact me about admission. <span className="text-error">*</span></span>
      </label>
      <FieldError>{(errors.consent as {message?:string})?.message}</FieldError>

      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ required, children, htmlFor }: { required?: boolean; children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="text-sm font-medium text-text-main">{children}{required && <span className="text-error ml-1">*</span>}</label>;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  ({ error, className, ...rest }, ref) => (
    <input ref={ref} className={cn("w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30", error ? "border-error" : "border-slate-200", className)} {...rest} />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  ({ error, className, ...rest }, ref) => (
    <textarea ref={ref} className={cn("w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 min-h-[96px]", error ? "border-error" : "border-slate-200", className)} {...rest} />
  )
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  ({ error, className, children, ...rest }, ref) => (
    <select ref={ref} className={cn("w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 bg-white", error ? "border-error" : "border-slate-200", className)} {...rest}>{children}</select>
  )
);
Select.displayName = "Select";

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs text-error mt-1" role="alert">{children}</p>;
}

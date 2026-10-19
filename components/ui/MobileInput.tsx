"use client";
import * as React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { MOBILE_PREFIX, sanitizeMobileInput, MOBILE_LENGTH } from "@/lib/phone";

/**
 * Mobile input with a fixed, non-editable +91 prefix.
 * Only digits can be typed and at most 10 of them, so an invalid
 * length or a stray letter is impossible to submit from the UI.
 * The value handed to react-hook-form is the bare 10-digit number.
 */
export const MobileInput = React.forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & { error?: string }>(
  ({ error, className, ...rest }, ref) => {
    const inputId = rest.id;
    return (
      <div
        className={cn(
          "flex items-stretch w-full rounded-xl border overflow-hidden bg-white focus-within:ring-2 focus-within:ring-secondary/30",
          error ? "border-error" : "border-slate-200"
        )}
      >
        <span
          className="flex items-center px-3 text-sm font-medium text-text-muted bg-slate-50 border-r border-slate-200 select-none"
          aria-hidden="true"
        >
          {MOBILE_PREFIX}
        </span>
        <input
          ref={ref}
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={MOBILE_LENGTH}
          aria-describedby={inputId ? `${inputId}-hint` : undefined}
          className={cn("flex-1 min-w-0 px-3 py-2.5 text-sm outline-none tracking-wide placeholder:tracking-normal", className)}
          {...rest}
        />
      </div>
    );
  }
);
MobileInput.displayName = "MobileInput";

/** Registration helper: filters the value to at most 10 digits as the user types. */
export function mobileRegisterProps(field: UseFormRegisterReturn) {
  return {
    name: field.name,
    ref: field.ref,
    onBlur: field.onBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      // Strip non-digits and cap at 10 before react-hook-form sees the value.
      e.target.value = sanitizeMobileInput(e.target.value);
      void field.onChange(e);
    },
  };
}

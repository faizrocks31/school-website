import { cn } from "@/lib/utils";
import React from "react";
export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex items-center justify-center rounded-xl bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-[#143555] disabled:opacity-50 disabled:cursor-not-allowed transition", className)} {...props} />;
}

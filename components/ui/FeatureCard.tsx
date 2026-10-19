import * as React from "react";
import { cn } from "@/lib/utils";
import { ModernIcon, type ModernIconName, type ModernIconColor } from "@/components/ui/ModernIcon";

/**
 * Feature card: a pastel icon badge above a title and short description.
 * Used for homepage features, about mission/vision, and admin dashboard tiles.
 *
 *   <FeatureCard icon="graduation" color="blue" title="Admissions" text="..." />
 */
export function FeatureCard({
  icon,
  color = "blue",
  size = "lg",
  title,
  text,
  className,
}: {
  icon: ModernIconName;
  color?: ModernIconColor;
  size?: "sm" | "md" | "lg" | "xl";
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200 p-6 shadow-sm", className)}>
      <ModernIcon name={icon} color={color} size={size} />
      <h3 className="font-semibold text-primary mt-4">{title}</h3>
      {text ? <p className="text-sm text-text-muted mt-2 leading-relaxed">{text}</p> : null}
    </div>
  );
}

/**
 * Compact labelled row: small icon badge + label + value.
 * Used for contact details, office hours, and metadata lines.
 */
export function IconRow({
  icon,
  color = "blue",
  children,
  className,
}: {
  icon: ModernIconName;
  color?: ModernIconColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ModernIcon name={icon} color={color} size="sm" shape="rounded" />
      <div className="min-w-0 text-sm text-text-muted">{children}</div>
    </div>
  );
}

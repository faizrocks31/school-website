"use client";
import { useState } from "react";
import { imageSrc } from "@/lib/image-url";

/**
 * Renders the school logo. If the image is missing (e.g. a locally-uploaded file
 * that was never deployed, or a bad pasted URL) it renders nothing instead of a
 * broken-image icon, so the header/footer still look right.
 *
 * The stored value goes through `imageSrc` so an `/uploads/…` path resolves to
 * whichever copy this environment has — see `lib/image-url.ts`.
 */
export function LogoImage({
  src,
  alt,
  className,
  fallback = null,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = imageSrc(src);
  if (!resolved || failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolved} alt={alt} onError={()=>setFailed(true)} className={className} />
  );
}

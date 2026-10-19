/**
 * Social link helpers.
 *
 * The URLs come from the Site Settings form and are rendered straight into an
 * `href`, so they must be vetted on the way in. The admin validator only checks
 * length, so without this a value like `javascript:alert(1)` would become a
 * live link in the footer.
 *
 * Two things are handled:
 *   1. Reject any scheme other than http(s) — no `javascript:`, `data:`, etc.
 *   2. Repair the common input slip of a bare `facebook.com/school` (no scheme),
 *      which the browser would otherwise treat as a relative path on this site.
 */

export type SocialNetwork = "facebook" | "instagram" | "youtube";

/**
 * Returns a safe absolute URL, or null when the value must not be linked.
 * A null result means the footer omits that icon rather than showing a dead link.
 */
export function safeSocialUrl(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;

  // A bare domain is the most common slip — assume https for it.
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  // Require a host with a dot, so "https://foo" or a lone path is rejected.
  if (!url.hostname.includes(".")) return null;

  return url.toString();
}

/**
 * Every social link the admin has actually filled in — empty ones are dropped so
 * the footer shows only real destinations.
 */
export function socialLinks(social: {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}): { network: SocialNetwork; label: string; url: string }[] {
  const entries: { network: SocialNetwork; label: string; raw?: string }[] = [
    { network: "facebook", label: "Facebook", raw: social.facebook },
    { network: "instagram", label: "Instagram", raw: social.instagram },
    { network: "youtube", label: "YouTube", raw: social.youtube },
  ];

  return entries.flatMap(({ network, label, raw }) => {
    const url = safeSocialUrl(raw);
    return url ? [{ network, label, url }] : [];
  });
}

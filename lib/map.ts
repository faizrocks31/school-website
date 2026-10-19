/**
 * Accepts either a Google Maps embed URL or a full <iframe> snippet (what
 * Google Maps' "Share → Embed a map" gives you) and returns a safe embed URL.
 * Returns "" when the input is empty or not an http(s) URL, so a pasted
 * `javascript:` URL can never reach an iframe src.
 */
export function normalizeMapEmbed(raw: string): string {
  if (!raw) return "";
  let value = raw.trim();
  const iframeMatch = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeMatch) value = iframeMatch[1].trim();
  if (!/^https?:\/\//i.test(value)) return "";
  return value;
}

/** A "view on Google Maps" link for an address (used as a fallback / extra link). */
export function googleMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * The best link to open the school's location on Google Maps.
 *
 * Prefers the exact place saved in Site Settings. The admin pastes what Google's
 * "Embed a map" dialog gives them: a `/maps/embed?pb=...` URL whose `pb` payload
 * carries the coordinates. Reading those gives a precise pin, which is better
 * than a text search because it still lands correctly when the postal address is
 * incomplete, oddly formatted, or ambiguous.
 *
 * Two payload shapes occur in the wild, and the pair is stored in opposite
 * orders, so both are tried:
 *   !2d<lng>!3d<lat>   the `/maps/embed?pb=` "view" form (what this site stores)
 *   !3d<lat>!4d<lng>   the `/maps/place/.../@lat,lng` form
 * Getting the order wrong would put the pin in the wrong hemisphere, so each
 * pattern keeps its own axis order and they are not interchangeable.
 *
 * Falls back to searching the address, so the link still works when no map was
 * ever configured, or when the value is a short link, an iframe wrapper, or
 * anything else with no coordinates to read.
 */
export function googleMapsLocationUrl(address: string, mapEmbedUrl?: string | null): string {
  const embed = normalizeMapEmbed(mapEmbedUrl ?? "");
  if (embed) {
    const viewForm = /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/.exec(embed);
    const placeForm = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(embed);
    // [lat, lng] — note the view form is stored lng-first.
    const coords = viewForm
      ? [viewForm[2], viewForm[1]]
      : placeForm
        ? [placeForm[1], placeForm[2]]
        : null;
    if (coords) {
      // A bare "lat,lng" search opens Maps with a pin on that exact point.
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords.join(","))}`;
    }
  }
  return googleMapsSearchUrl(address);
}

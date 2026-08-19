/**
 * Rough reading-time estimate from HTML content — strips tags, counts
 * words, assumes ~200 words/minute (a standard blog-reading pace).
 */
export function estimateReadingTime(html: string | null): string {
  if (!html) return "1 min read";
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
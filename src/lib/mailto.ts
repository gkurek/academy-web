/** Build a mailto: href with an encoded subject line (brief §7). */
export function buildMailtoHref(email: string, subject: string): string {
  const params = new URLSearchParams({ subject });
  return `mailto:${email}?${params.toString()}`;
}

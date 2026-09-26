/**
 * Polish noun plural after a number: [1, 2–4 (except 12–14), other].
 * Example: pluralize(5, ["strona", "strony", "stron"]) → "stron".
 */
export function pluralize(count: number, forms: [string, string, string]): string {
  const absolute = Math.abs(count);

  if (absolute === 1) {
    return forms[0];
  }

  const lastDigit = absolute % 10;
  const lastTwoDigits = absolute % 100;

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return forms[1];
  }

  return forms[2];
}

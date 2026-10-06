const PLACEHOLDER_RE = /\{[a-zA-Z]+\}/;

/** Replaces every `{key}` in `template` with its value. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

/** Like `fillTemplate`, but fails the build when a placeholder has no value (facts missing in `content/`). */
export function fillRequiredTemplate(
  template: string,
  values: Record<string, string | number | undefined>,
  context: string,
): string {
  const defined = Object.fromEntries(
    Object.entries(values).filter((entry): entry is [string, string | number] => entry[1] !== undefined),
  );
  const result = fillTemplate(template, defined);
  const missing = result.match(PLACEHOLDER_RE);

  if (missing) {
    throw new Error(`${context}: no value for ${missing[0]} in "${template}"`);
  }

  return result;
}

import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const NBSP = String.fromCharCode(0xa0);

// Single-letter Polish words (a, i, o, u, w, z) followed by spaces, standing alone: start of text, whitespace or an opening quote / bracket before them.
// A trailing space (word at the end of a text node, next one inline element) is glued too.
const SHORT_WORD_RE = /(?<=^|[\s(„"«“‘'])([aiouwzAIOUWZ])[ \t]+/g;

// Keys whose values end up in attributes, URLs or mail subjects — never touched.
const SKIPPED_KEY_RE = /^(href|src|alt|slug|id|url|email|phone|.*aria.*|.*subject.*)$/i;

/** Glues single-letter words (a, i, o, u, w, z) to the next word with a non-breaking space. Idempotent. */
function nbsp(text: string): string {
  return text.replace(SHORT_WORD_RE, `$1${NBSP}`);
}

/** Back to plain spaces — for `<title>` and other places where a non-breaking space does not belong. */
export function plainText(text: string): string {
  return text.replaceAll(NBSP, " ");
}

/** Applies `nbsp` to every string in plain data (JSON, MDX exports); keys that feed attributes or URLs are left alone. */
export function nbspDeep<T>(value: T): T {
  if (typeof value === "string") {
    return nbsp(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => nbspDeep(item)) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, SKIPPED_KEY_RE.test(key) ? item : nbspDeep(item)]),
    ) as T;
  }

  return value;
}

/** Applies `nbsp` to the text nodes of rendered children (MDX body), descending into inline elements. */
export function nbspChildren(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return nbsp(child);
    }

    if (isValidElement<{ children?: ReactNode }>(child) && typeof child.type === "string" && child.props.children) {
      return cloneElement(child, undefined, nbspChildren(child.props.children));
    }

    return child;
  });
}

"use client";

import { useCallback, useState } from "react";

/** Open/closed state of a lightbox over `count` slides, with wrap-around prev/next. */
export function useLightboxIndex(count: number) {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((nextIndex: number) => setIndex(nextIndex), []);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((current) =>
        current === null || count === 0 ? null : (current + delta + count) % count,
      ),
    [count],
  );
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  return { index, open, close, prev, next };
}

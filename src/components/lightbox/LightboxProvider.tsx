"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Lightbox } from "@/components/lightbox/Lightbox";
import { useLightboxIndex } from "@/components/lightbox/useLightboxIndex";
import type { Image as ContentImage } from "@/content/types";

type LightboxContextValue = {
  /** Opens one dialog for any photo list on the page — cover and gallery share the sequence. */
  openPhoto: (photos: ContentImage[], index: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<ContentImage[]>([]);
  const { index, open, close, prev, next } = useLightboxIndex(photos.length);

  const openPhoto = useCallback(
    (nextPhotos: ContentImage[], nextIndex: number) => {
      setPhotos(nextPhotos);
      open(nextIndex);
    },
    [open],
  );

  const value = useMemo(() => ({ openPhoto }), [openPhoto]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox photos={photos} index={index} onPrev={prev} onNext={next} onClose={close} />
    </LightboxContext.Provider>
  );
}

export function useLightbox(): LightboxContextValue {
  const context = useContext(LightboxContext);

  if (!context) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }

  return context;
}

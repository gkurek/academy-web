"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { WorkshopLightbox } from "@/components/text/WorkshopLightbox";
import type { Image as ContentImage } from "@/content/types";

type LightboxState = {
  photos: ContentImage[];
  index: number;
};

type ExhibitionLightboxContextValue = {
  openPhoto: (photos: ContentImage[], index: number) => void;
};

const ExhibitionLightboxContext = createContext<ExhibitionLightboxContextValue | null>(null);

export function ExhibitionLightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null);

  const openPhoto = useCallback((photos: ContentImage[], index: number) => {
    setState({ photos, index });
  }, []);

  const handleClose = useCallback(() => {
    setState(null);
  }, []);

  const handlePrev = useCallback(() => {
    setState((current) => {
      if (!current) {
        return null;
      }

      return {
        ...current,
        index: (current.index - 1 + current.photos.length) % current.photos.length,
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    setState((current) => {
      if (!current) {
        return null;
      }

      return {
        ...current,
        index: (current.index + 1) % current.photos.length,
      };
    });
  }, []);

  const value = useMemo(() => ({ openPhoto }), [openPhoto]);

  return (
    <ExhibitionLightboxContext.Provider value={value}>
      {children}
      <WorkshopLightbox
        photos={state?.photos ?? []}
        index={state?.index ?? null}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
      />
    </ExhibitionLightboxContext.Provider>
  );
}

export function useExhibitionLightbox(): ExhibitionLightboxContextValue {
  const context = useContext(ExhibitionLightboxContext);

  if (!context) {
    throw new Error("useExhibitionLightbox must be used within ExhibitionLightboxProvider");
  }

  return context;
}

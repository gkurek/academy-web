"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type GalleryLayoutMode = "shelf" | "justified";

interface GalleryLayoutContextValue {
  layoutMode: GalleryLayoutMode;
  setLayoutMode: (mode: GalleryLayoutMode) => void;
}

const GalleryLayoutContext = createContext<GalleryLayoutContextValue | null>(null);

export interface GalleryLayoutProviderProps {
  children: ReactNode;
}

export function GalleryLayoutProvider({ children }: GalleryLayoutProviderProps) {
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>("shelf");

  return (
    <GalleryLayoutContext.Provider value={{ layoutMode, setLayoutMode }}>
      {children}
    </GalleryLayoutContext.Provider>
  );
}

export function useGalleryLayoutMode(): GalleryLayoutContextValue {
  const value = useContext(GalleryLayoutContext);
  if (!value) {
    throw new Error("useGalleryLayoutMode must be used within GalleryLayoutProvider");
  }
  return value;
}

"use client";

import { createContext, useContext } from "react";

export type SemesterItem = {
  title: string;
  body: string;
};

export type StepItem = {
  title: string;
  body?: string;
};

export type OfferContentContextValue = {
  semesters: SemesterItem[];
  steps: StepItem[];
};

const OfferContentContext = createContext<OfferContentContextValue | null>(null);

export interface OfferContentProviderProps {
  semesters?: SemesterItem[];
  steps?: StepItem[];
  children: React.ReactNode;
}

export function OfferContentProvider({
  semesters = [],
  steps = [],
  children,
}: OfferContentProviderProps) {
  return (
    <OfferContentContext.Provider value={{ semesters, steps }}>{children}</OfferContentContext.Provider>
  );
}

export function useOfferContent(): OfferContentContextValue {
  const value = useContext(OfferContentContext);
  if (!value) {
    return { semesters: [], steps: [] };
  }
  return value;
}

"use client";

import { useId } from "react";

export type SegmentOption<T> = { value: T; label: string };

type SegmentedControlProps<T extends string | number> = {
  label: string;
  /** Label kept for screen readers only (the metric switch in the visits card). */
  labelHidden?: boolean;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Mockup segment row (PanelAnalityka): joined buttons with 1px borders, the chosen one on `sel` with an
// `act` border. Chosen text is `h`, not gold — gold on `sel` is 4.39:1 (README-panel §2).
// Full width on phones (a long label wraps inside its segment), natural width from 700px.
export function SegmentedControl<T extends string | number>({
  label,
  labelHidden = false,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const labelId = useId();

  return (
    <div role="group" aria-labelledby={labelId} className="grid min-w-0 grow basis-full gap-2 panel:grow-0 panel:basis-auto">
      <span id={labelId} className={labelHidden ? "sr-only" : "text-small text-tertiary"}>
        {label}
      </span>
      <div className="grid auto-cols-fr grid-flow-col panel:auto-cols-auto">
        {options.map((option) => {
          const pressed = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(option.value)}
              className={`relative -ml-px min-h-tap cursor-pointer border px-seg-x py-1 text-ui panel:whitespace-nowrap focus-visible:z-2 ${
                pressed
                  ? "z-1 border-active bg-sel font-medium text-heading"
                  : "border-btn-border text-body hover:text-gold"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";

import { LIGHTBOX_DESKTOP_QUERY, LIGHTBOX_SWIPE_THRESHOLD_PX } from "@/components/lightbox/lightboxUtils";

export function useLightboxDialog({
  isOpen,
  onClose,
  onPrev,
  onNext,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onPrev, onNext]);

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget) {
      onClose();
      return;
    }
    if (target.hasAttribute("data-lightbox-dismiss") && window.matchMedia(LIGHTBOX_DESKTOP_QUERY).matches) {
      onClose();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current =
      event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) {
      return;
    }
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (
      Math.abs(deltaX) >= LIGHTBOX_SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrev();
      }
    }
  };

  const handlePointerCancel = () => {
    swipeStartRef.current = null;
  };

  return {
    dialogRef,
    handleDialogClick,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
}

"use client";

import Image from "next/image";
import { useState } from "react";

import {
  getLightboxImageDisplayStyle,
  getLightboxImageSizes,
  type LightboxImageDimensions,
} from "@/components/lightbox/lightboxUtils";

export interface LightboxImageProps extends LightboxImageDimensions {
  src: string;
  alt: string;
}

const servesOriginalFromPublicMedia = (src: string) => src.startsWith("/media/");

export function LightboxImage({ src, alt, width, height }: LightboxImageProps) {
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [displayDimensions, setDisplayDimensions] = useState<LightboxImageDimensions>({
    width,
    height,
  });
  const isVisible = readySrc === src;

  const useOriginalFile = servesOriginalFromPublicMedia(src);

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={useOriginalFile}
      sizes={useOriginalFile ? undefined : getLightboxImageSizes(displayDimensions)}
      fetchPriority="high"
      onLoad={(event) => {
        const img = event.currentTarget;
        if (useOriginalFile && img.naturalWidth > 0 && img.naturalHeight > 0) {
          setDisplayDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
        setReadySrc(src);
      }}
      style={{
        ...getLightboxImageDisplayStyle(displayDimensions),
        visibility: isVisible ? "visible" : "hidden",
      }}
      className="block h-auto max-w-full lg:shadow-lightbox"
    />
  );
}

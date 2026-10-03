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

export function LightboxImage({ src, alt, width, height }: LightboxImageProps) {
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const isVisible = readySrc === src;

  const dimensions = { width, height };

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={getLightboxImageSizes(dimensions)}
      fetchPriority="high"
      onLoadingComplete={() => {
        setReadySrc(src);
      }}
      style={{
        ...getLightboxImageDisplayStyle(dimensions),
        visibility: isVisible ? "visible" : "hidden",
      }}
      className="block h-auto max-w-full lg:shadow-lightbox"
    />
  );
}

import Image from "next/image";

import {
  getLightboxImageRatio,
  getLightboxImageSizes,
  type LightboxImageDimensions,
} from "@/components/lightbox/lightboxUtils";

export interface LightboxImageProps extends LightboxImageDimensions {
  src: string;
  alt: string;
}

export function LightboxImage({ src, alt, width, height }: LightboxImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={getLightboxImageSizes({ width, height })}
      fetchPriority="high"
      style={{
        width: `calc(var(--lightbox-image-h) * ${getLightboxImageRatio({ width, height })})`,
        aspectRatio: `${width} / ${height}`,
      }}
      className="block h-auto max-w-full lg:shadow-lightbox"
    />
  );
}

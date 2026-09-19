/** One tile after layout — index into the source items array plus pixel size. */
export interface JustifiedTile {
  index: number;
  width: number;
  height: number;
}

export interface JustifiedRow {
  height: number;
  tiles: JustifiedTile[];
}

export interface JustifyGalleryOptions {
  containerWidth: number;
  /** FooGallery default on akademiaikony.pl. */
  targetRowHeight: number;
  maxRowHeight: number;
  gap: number;
  /** FooGallery `lastRow: "smart"` — do not stretch a short last row to full width. */
  lastRowSmart: boolean;
  /** WP mobile: one tile per row at max height, centered. */
  singleColumn: boolean;
  /** Optional hard cap on tiles per row (e.g. fewer icons on wide desktop). */
  maxTilesPerRow?: number;
}

function sumAspectRatios(aspectRatios: number[], indices: number[]): number {
  return indices.reduce((total, index) => total + aspectRatios[index], 0);
}

function rowHeightFor(
  aspectRatios: number[],
  indices: number[],
  containerWidth: number,
  gap: number,
): number {
  const gaps = (indices.length - 1) * gap;
  return (containerWidth - gaps) / sumAspectRatios(aspectRatios, indices);
}

function buildRow(
  aspectRatios: number[],
  indices: number[],
  height: number,
): JustifiedRow {
  return {
    height,
    tiles: indices.map((index) => ({
      index,
      width: height * aspectRatios[index],
      height,
    })),
  };
}

/**
 * Flickr-style justified rows — matches FooGallery on akademiaikony.pl
 * (`rowHeight` 240, `maxRowHeight` 350, `margins` 10, `lastRow` smart).
 */
export function justifyGalleryRows(
  aspectRatios: number[],
  {
    containerWidth,
    targetRowHeight,
    maxRowHeight,
    gap,
    lastRowSmart,
    singleColumn,
    maxTilesPerRow,
  }: JustifyGalleryOptions,
): JustifiedRow[] {
  if (aspectRatios.length === 0 || containerWidth <= 0) {
    return [];
  }

  if (singleColumn) {
    return aspectRatios.map((ratio, index) => {
      const height = maxRowHeight;
      const width = Math.min(containerWidth, height * ratio);

      return {
        height,
        tiles: [{ index, width, height }],
      };
    });
  }

  const rows: JustifiedRow[] = [];
  let currentIndices: number[] = [];

  const flushRow = (indices: number[], isLast: boolean) => {
    if (indices.length === 0) {
      return;
    }

    let height = rowHeightFor(aspectRatios, indices, containerWidth, gap);

    if (isLast && lastRowSmart) {
      // Smart last row: do not stretch to fill — cap at target height (FooGallery `lastRow: smart`).
      height = Math.min(maxRowHeight, targetRowHeight, height);
    } else {
      height = Math.min(maxRowHeight, height);
    }

    rows.push(buildRow(aspectRatios, indices, height));
  };

  aspectRatios.forEach((_, index) => {
    const isLast = index === aspectRatios.length - 1;

    if (maxTilesPerRow != null && currentIndices.length >= maxTilesPerRow) {
      flushRow(currentIndices, false);
      currentIndices = [index];
    } else {
      const candidate = [...currentIndices, index];
      const candidateHeight = rowHeightFor(aspectRatios, candidate, containerWidth, gap);

      // Flickr-style break: once the row would drop below target height, finalize without the new tile.
      if (candidateHeight < targetRowHeight && currentIndices.length > 0) {
        flushRow(currentIndices, false);
        currentIndices = [index];
      } else {
        currentIndices = candidate;
      }
    }

    if (isLast) {
      flushRow(currentIndices, true);
    }
  });

  return rows;
}

import { useState } from "react";

import type { Box, Point } from "../api/types";
import BoxOverlay from "./BoxOverlay";

interface Props {
  src: string | null;
  boxes: Box[];
  points: Point[];
  scanning?: boolean;
}

/** Allow only a relative path, blob:, or http(s) URL into the <img src> sink. */
function safeImageSrc(src: string | null): string | null {
  if (!src) return null;
  return /^(https?:|blob:)/i.test(src) || src.startsWith("/") ? src : null;
}

export default function Scope({ src, boxes, points, scanning }: Props) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const safeSrc = safeImageSrc(src);

  if (!safeSrc) {
    return (
      <div className="ticks panel flex aspect-[4/3] w-full items-center justify-center">
        <div className="text-center">
          <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto text-edge">
            <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="32" y1="4" x2="32" y2="18" stroke="currentColor" strokeWidth="1.5" />
            <line x1="32" y1="46" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="32" x2="18" y2="32" stroke="currentColor" strokeWidth="1.5" />
            <line x1="46" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="2.5" fill="currentColor" />
          </svg>
          <p className="label-kicker mt-4">awaiting target</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticks relative w-full overflow-hidden rounded-lg border border-edge bg-black/40"
      style={{ aspectRatio: dims ? `${dims.w} / ${dims.h}` : "4 / 3" }}
    >
      <img
        src={safeSrc}
        alt="analysis target"
        onLoad={(e) =>
          setDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
        }
        className="absolute inset-0 h-full w-full object-contain"
      />
      {dims && !scanning && (
        <BoxOverlay width={dims.w} height={dims.h} boxes={boxes} points={points} />
      )}
      {scanning && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 animate-sweep bg-gradient-to-b from-transparent via-lime/25 to-transparent" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-lime/50 shadow-glow" />
        </div>
      )}
    </div>
  );
}

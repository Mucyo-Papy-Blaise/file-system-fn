"use client";

import { SharedLevel } from "@/types/shared-space";
import {
  sharedLevelBadgeClass,
  sharedLevelLabels,
} from "@/lib/shared-level-utils";

interface SharedLevelBadgeProps {
  level: SharedLevel;
  className?: string;
}

export function SharedLevelBadge({ level, className = "" }: SharedLevelBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
        sharedLevelBadgeClass[level],
        className,
      ].join(" ")}
    >
      {sharedLevelLabels[level]}
    </span>
  );
}

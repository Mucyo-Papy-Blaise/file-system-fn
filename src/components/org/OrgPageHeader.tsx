"use client";

import type { ReactNode } from "react";

interface OrgPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function OrgPageHeader({ title, description, action }: OrgPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-secondary">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

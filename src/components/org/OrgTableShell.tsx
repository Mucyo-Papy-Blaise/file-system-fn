"use client";

import type { ReactNode } from "react";

interface OrgTableShellProps {
  children: ReactNode;
}

export function OrgTableShell({ children }: OrgTableShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-default bg-surface shadow-sm">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function OrgTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-default bg-[var(--color-bg-secondary)] text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
        {children}
      </tr>
    </thead>
  );
}

export function OrgTableTh({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={[
        "px-5 py-3.5 font-semibold",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

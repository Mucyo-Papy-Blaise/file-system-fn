import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <article className="rounded-2xl border border-default bg-surface p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-secondary">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            color,
            backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
          }}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

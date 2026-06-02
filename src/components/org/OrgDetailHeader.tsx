"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface OrgDetailHeaderProps {
  backHref: string;
  backLabel: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  stats?: Array<{ label: string; value: string | number }>;
}

export function OrgDetailHeader({
  backHref,
  backLabel,
  icon: Icon,
  title,
  subtitle,
  action,
  stats,
}: OrgDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-secondary">{subtitle}</p>
            ) : null}
            {stats && stats.length > 0 ? (
              <dl className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-1.5">
                    <dt className="text-muted">{stat.label}</dt>
                    <dd className="font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

interface OrgDetailSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
  className?: string;
}

export function OrgDetailSection({
  title,
  count,
  children,
  className,
}: OrgDetailSectionProps) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          {title}
          {count !== undefined ? (
            <span className="ml-1.5 font-normal text-muted">({count})</span>
          ) : null}
        </h2>
      </div>
      {children}
    </section>
  );
}

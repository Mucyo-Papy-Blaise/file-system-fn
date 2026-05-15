type BadgeVariant = "admin" | "member" | "category";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const badgeStyles: Record<BadgeVariant, string> = {
  admin: "bg-primary-subtle text-primary",
  member: "bg-[var(--color-bg-secondary)] text-secondary",
  category: "bg-[var(--color-bg-tertiary)] text-foreground",
};

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        badgeStyles[variant],
      ].join(" ")}
    >
      {label}
    </span>
  );
}

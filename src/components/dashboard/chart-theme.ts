/** Chart palette aligned with app primary (forest green) and accents */
export const CHART_COLORS = [
  "#14532d",
  "#22c55e",
  "#06b6d4",
  "#ca8a04",
  "#2563eb",
  "#8b5cf6",
] as const;

export const CHART_PRIMARY = CHART_COLORS[0];
export const CHART_ACCENT = CHART_COLORS[1];

export const CHART_GRID_STROKE = "var(--color-border)";
export const CHART_AXIS_TICK = "var(--color-text-muted)";

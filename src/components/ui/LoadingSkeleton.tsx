interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

export function LoadingSkeleton({
  width = "100%",
  height = 16,
  rounded = "0.75rem",
}: LoadingSkeletonProps) {
  return (
    <div
      className="animate-pulse bg-[var(--color-bg-tertiary)]"
      style={{
        width,
        height,
        borderRadius: rounded,
      }}
      aria-hidden
    />
  );
}

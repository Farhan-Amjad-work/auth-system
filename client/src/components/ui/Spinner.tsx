import { cn } from "@/utils/cn";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export const Spinner = ({
  size = "md",
  label = "Loading...",
  className,
  ...props
}: SpinnerProps) => (
  <div
    role="status"
    aria-live="polite"
    className={cn("inline-flex items-center justify-center", className)}
    {...props}
  >
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-brand-500",
        sizeClasses[size],
      )}
    />
    <span className="sr-only">{label}</span>
  </div>
);

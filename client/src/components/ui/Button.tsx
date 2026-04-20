import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
}

export const Button = ({
  variant = "primary",
  isLoading,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    disabled={isLoading || props.disabled}
    className={cn(
      "w-full rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
      variant === "primary" && "bg-brand-500 text-white hover:bg-brand-600",
      variant === "ghost" && "bg-transparent text-brand-600 hover:bg-brand-50",
      className,
    )}
    {...props}
  >
    {isLoading ? "Loading..." : children}
  </button>
);

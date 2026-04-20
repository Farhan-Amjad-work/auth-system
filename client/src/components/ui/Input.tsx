import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        ref={ref}
        className={cn(
          "rounded border border-surface-border px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          error &&
            "border-danger-500 focus:border-danger-500 focus:ring-danger-50",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger-500">{error}</span>}
    </div>
  ),
);
Input.displayName = "Input";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "relative px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ease-[var(--ease-board)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";

  const variants = {
    primary:
      "bg-amber text-navy hover:bg-amber-dim hover:shadow-[0_0_0_3px_rgba(240,165,55,0.25)]",
    secondary:
      "bg-transparent text-bone border border-slate/30 hover:border-slate/60 hover:bg-white/5",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      <span className={isLoading ? "opacity-0" : "opacity-100"}>{children}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
        </span>
      )}
    </button>
  );
}
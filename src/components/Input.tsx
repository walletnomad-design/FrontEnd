import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...rest }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-slate">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border bg-white/5 px-3.5 py-2.5 text-bone placeholder:text-slate/50 outline-none transition-all duration-200 ease-[var(--ease-board)] focus:bg-white/[0.07] focus:ring-2 ${
          error
            ? "border-red-400/60 focus:ring-red-400/25"
            : "border-slate/25 focus:border-amber/60 focus:ring-amber/20"
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-red-300 animate-rise">
          {error}
        </span>
      )}
    </div>
  );
}
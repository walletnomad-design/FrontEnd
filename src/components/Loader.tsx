interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 animate-rise" role="status">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate/25 border-t-amber" />
      <span className="font-mono text-sm text-slate">{label}</span>
    </div>
  );
}
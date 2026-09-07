interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 animate-rise" role="status">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4" role="status">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
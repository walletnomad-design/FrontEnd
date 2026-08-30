interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="animate-rise rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
    >
      {message}
    </div>
  );
}
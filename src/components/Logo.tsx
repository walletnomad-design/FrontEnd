interface NGlyphProps {
  size?: number;
  className?: string;
}

export function NGlyph({ size = 18, className = "" }: NGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6 18V6l12 12V6"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 32, withWordmark = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet shadow-[0_0_16px_-4px_rgba(99,102,241,0.6)]"
        style={{ width: size, height: size }}
      >
        <NGlyph size={size * 0.55} />
      </div>
      {withWordmark && (
        <span className="text-lg font-bold text-text">
          Nomad<span className="text-primary">Wallet</span>
        </span>
      )}
    </div>
  );
}
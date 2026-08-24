export function AtlasMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/atlas-mark.png"
      alt="Atlas Logo"
      className={className}
    />
  );
}

export function BrandLogo({
  className = "h-12 w-12",
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-3.5 min-w-0 text-white">
      <AtlasMark className={className} />
      {showName && (
        <span className="text-white font-semibold tracking-tight text-[22px] leading-none">
          AtlasAI
        </span>
      )}
    </span>
  );
}

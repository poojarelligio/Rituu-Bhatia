export default function IndexTab({ code, index, className = "" }: { code: string; index: number; className?: string }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <span className={`index-tab inline-flex items-center gap-1 text-[11px] text-gold border border-gold/40 rounded-full px-2.5 py-1 ${className}`}>
      {code}
      <span className="text-gold/50">·</span>
      {num}
    </span>
  );
}

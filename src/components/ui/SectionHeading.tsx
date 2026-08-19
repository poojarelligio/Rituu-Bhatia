export default function SectionHeading({
  eyebrow, title, description, align = "left",
}: { eyebrow?: string; title: string; description?: string; align?: "left" | "center" }) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""} mb-12`}>
      {eyebrow && <p className="index-tab text-xs text-gold mb-4">{eyebrow}</p>}
      <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-light leading-tight">{title}</h2>
      {description && <p className="mt-4 text-charcoal/65 leading-relaxed">{description}</p>}
    </div>
  );
}

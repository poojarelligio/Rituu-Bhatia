export default function PageHeader({
  eyebrow, title, description,
}: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="bg-ivory-deep border-b border-line py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
        {eyebrow && <p className="index-tab text-xs text-gold mb-4">{eyebrow}</p>}
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal font-light leading-tight">{title}</h1>
        {description && <p className="mt-4 text-charcoal/65 max-w-2xl mx-auto leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}

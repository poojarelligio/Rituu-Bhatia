import Image from "next/image";

export default function PageHeader({
  eyebrow, title, description,
}: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg/pageheader.jpg"
          alt="Page header background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-charcoal-soft/5" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        {eyebrow && <p className="index-tab text-xs text-ivory mb-4">{eyebrow}</p>}
        <h1 className="font-display text-4xl sm:text-5xl text-gold font-light leading-tight">{title}</h1>
        {description && <p className="mt-4 text-line/65 max-w-2xl mx-auto leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}

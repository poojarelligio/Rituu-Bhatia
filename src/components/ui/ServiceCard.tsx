import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import IndexTab from "./IndexTab";

interface ServiceCardProps {
  service: {
    slug: string;
    title: string;
    short_description: string | null;
    duration: string | null;
    price_display: string | null;
    image_url: string | null;
    code: string;
  };
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col justify-between bg-ivory border border-line rounded-sm overflow-hidden h-full transition-shadow hover:shadow-lg"
    >
      {service.image_url && (
        <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-7 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between mb-5">
            <IndexTab code={service.code || service.slug.slice(0, 2).toUpperCase()} index={index} />
            <ArrowUpRight size={18} className="text-charcoal/30 group-hover:text-burgundy transition-colors" />
          </div>
          <h3 className="font-display text-xl text-charcoal mb-2">{service.title}</h3>
          <p className="text-sm text-charcoal/65 leading-relaxed">{service.short_description}</p>
        </div>
        <div className="ledger-divider my-5" />
        <div className="flex items-center justify-between text-xs text-charcoal/50">
          <span>{service.duration}</span>
          <span className="text-burgundy font-medium">{service.price_display}</span>
        </div>
      </div>
    </Link>
  );
}

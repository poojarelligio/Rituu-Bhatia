import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Clock, Users, Award } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import CourseEnrollButton from "@/components/site/CourseEnrollButton";
import { getCourseBySlug } from "@/lib/publicQueries";
import { parseJsonField } from "@/lib/parseJsonField";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

interface CurriculumModule {
  module: string;
  lessons: string[];
}

const FORMAT_LABELS: Record<string, string> = {
  live_online: "Live Online",
  in_person: "In-Person",
  self_paced: "Self-Paced",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.meta_title || course.title,
    description: course.meta_description || course.subtitle || undefined,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const curriculum = parseJsonField<CurriculumModule[]>(course.curriculum, []);

  const priceDisplay = course.discount_price_display || course.price_display || "";
  const totalLessons = curriculum.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);
  const formatLabel = FORMAT_LABELS[course.format] || course.format;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle,
    provider: { "@type": "Person", name: course.instructor || "Rituu Bhatia" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-ivory-deep border-b border-line py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <IndexTab code={course.code} index={0} className="mb-6" />
            <h1 className="font-display text-4xl sm:text-5xl text-charcoal font-light leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-charcoal/65 max-w-xl leading-relaxed mb-8">{course.subtitle}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-charcoal/60 mb-8">
              <span className="flex items-center gap-1.5">
                <Users size={14} /> Taught by {course.instructor}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={14} /> {formatLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <span className="text-burgundy font-medium text-2xl font-display">
                {priceDisplay}
                {course.discount_price_display && (
                  <span className="ml-3 text-charcoal/40 line-through text-base font-normal">{course.price_display}</span>
                )}
              </span>
            </div>

            <CourseEnrollButton courseId={course.id} courseTitle={course.title} priceDisplay={priceDisplay} />
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] bg-charcoal-soft rounded-sm border border-line overflow-hidden">
              {course.image_url ? (
                <Image src={course.image_url} alt={course.title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <GraduationCap size={40} className="text-ivory/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-ivory py-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-2xl text-gold-soft">{curriculum.length || "—"}</p>
            <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">Modules</p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold-soft">{totalLessons || "—"}</p>
            <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">Lessons</p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold-soft flex items-center justify-center gap-1.5">
              <Award size={18} /> Certified
            </p>
            <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">On Completion</p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        <p className="index-tab text-xs text-gold mb-8">CURRICULUM</p>
        {curriculum.length === 0 ? (
          <p className="text-charcoal/50 text-sm">Curriculum details coming soon.</p>
        ) : (
          <div className="space-y-8">
            {curriculum.map((mod, i) => (
              <div key={i} className="border-l-2 border-burgundy/30 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="index-tab text-[11px] text-gold border border-gold/40 rounded-full px-2 py-0.5">
                    MODULE {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="font-display text-lg text-charcoal mb-3">{mod.module}</p>
                <ul className="space-y-2">
                  {(mod.lessons || []).map((lesson, j) => (
                    <li key={j} className="text-sm text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold mt-1.5 w-1 h-1 rounded-full bg-gold shrink-0" />
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-burgundy text-ivory py-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-light leading-tight mb-6">
            Ready to learn {course.title}?
          </h2>
          <CourseEnrollButton courseId={course.id} courseTitle={course.title} priceDisplay={priceDisplay} variant="onDark" />
        </div>
      </section>
    </>
  );
}
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Clock, Users, Award, ChevronDown, BookOpen, Layers } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import CourseEnrollButton from "@/components/site/CourseEnrollButton";
import { Sparkle, Sparkles, dly, idx, pill, pillDark } from "@/components/ui/Decor";
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

  const stats = [
    { icon: Layers, value: String(curriculum.length || "—"), label: "Modules" },
    { icon: BookOpen, value: String(totalLessons || "—"), label: "Lessons" },
    { icon: Award, value: "Certified", label: "On Completion" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ───────────── Hero ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-16 text-ivory lg:py-24">
        <div aria-hidden className="v-float pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
        <Sparkles />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
          <div className="v-blur lg:col-span-7">
            <div className={pillDark}>
              <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
              <IndexTab code={course.code} index={0} />
            </div>
            <h1 className="mb-5 font-display text-4xl font-light leading-[1.1] sm:text-5xl lg:text-6xl">
              <span className="v-grad-gold">{course.title}</span>
            </h1>
            <div className="v-draw mb-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-ivory/75">{course.subtitle}</p>

            <ul className="mb-8 flex flex-wrap gap-3 text-sm">
              {[
                { icon: Users, text: `Taught by ${course.instructor}` },
                { icon: Clock, text: course.duration },
                { icon: GraduationCap, text: formatLabel },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-ivory/85 backdrop-blur-md"
                >
                  <Icon size={14} className="text-gold" />
                  {text}
                </li>
              ))}
            </ul>

            <p className="mb-8 font-display text-3xl text-gold sm:text-4xl">
              {priceDisplay}
              {course.discount_price_display && (
                <span className="ml-3 text-lg font-normal text-ivory/40 line-through">{course.price_display}</span>
              )}
            </p>

            <CourseEnrollButton
              courseId={course.id}
              courseTitle={course.title}
              priceDisplay={priceDisplay}
              variant="onDark"
            />
          </div>

          <div className="v-right lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-gold/60 lg:translate-x-6 lg:translate-y-6"
              />
              <div className="relative isolate aspect-[4/5] overflow-hidden rounded-3xl bg-ink-mid shadow-[0_36px_80px_-30px_#000]">
                {course.image_url ? (
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="-z-10 object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-mid via-violet/60 to-ink">
                    <GraduationCap size={48} strokeWidth={1.25} className="text-gold/60" />
                  </div>
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                <div aria-hidden className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
              </div>
              <Sparkle className="v-twinkle absolute -right-3 -top-3 h-8 w-8 text-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Stats ───────────── */}
      <section className="relative isolate -mt-px overflow-hidden bg-ivory-deep py-14">
        <div aria-hidden className="v-drift pointer-events-none absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 sm:grid-cols-3 lg:px-10">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              style={idx(i)}
              className="v-pop group relative overflow-hidden rounded-2xl border border-line bg-white/80 p-6 text-center shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />
              <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-deep transition-all duration-500 group-hover:bg-gold group-hover:text-ink">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <p className="v-grad-text font-display text-3xl font-light leading-none">{value}</p>
              <p className="index-tab mt-3 text-[11px] uppercase text-charcoal/65">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Curriculum ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory to-ivory-deep py-20 lg:py-28">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
          <div className="lg:col-span-8">
            <div className="v-blur mb-10">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                CURRICULUM
              </p>
              <div className="v-draw h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
            </div>

            {curriculum.length === 0 ? (
              <div className="rounded-3xl border border-line bg-white/80 p-10 text-center backdrop-blur">
                <Sparkle className="v-twinkle mx-auto mb-4 h-6 w-6 text-gold" />
                <p className="text-sm text-charcoal/60">Curriculum details coming soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {curriculum.map((mod, i) => (
                  <details
                    key={i}
                    open={i === 0}
                    style={idx(i % 3)}
                    className="v-reveal group relative overflow-hidden rounded-2xl border border-line bg-white/80 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 open:border-gold/50 open:shadow-[0_28px_60px_-28px_var(--color-gold)] hover:border-gold/60"
                  >
                    <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-gold-soft to-gold opacity-0 transition-opacity duration-500 group-open:opacity-100" />
                    <summary className="flex cursor-pointer list-none items-center gap-5 p-6 marker:hidden [&::-webkit-details-marker]:hidden">
                      <span
                        aria-hidden
                        className="select-none font-display text-4xl font-light leading-none text-transparent"
                        style={{ WebkitTextStroke: "1.25px #BE8420" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="index-tab mb-1 block text-[11px] uppercase text-gold-deep">
                          MODULE {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="block font-display text-lg leading-snug text-charcoal sm:text-xl">
                          {mod.module}
                        </span>
                      </span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-charcoal/50 transition-all duration-500 group-open:rotate-180 group-open:border-gold group-open:bg-gold group-open:text-ink">
                        <ChevronDown size={18} />
                      </span>
                    </summary>

                    <ul className="space-y-3 border-t border-line px-6 pb-6 pt-5 sm:pl-[5.5rem]">
                      {(mod.lessons || []).map((lesson, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm leading-relaxed text-charcoal/70">
                          <Sparkle className="mt-1 h-3 w-3 shrink-0 text-gold" />
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            )}
          </div>

          {/* Sticky enrol card */}
          <aside className="v-right lg:col-span-4">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-8 text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] lg:sticky lg:top-24">
              <div aria-hidden className="v-float pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-violet/30 blur-3xl" />
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <p className="index-tab mb-3 text-[11px] uppercase text-gold-soft">{course.title}</p>
              <p className="mb-6 font-display text-3xl text-gold">
                {priceDisplay}
                {course.discount_price_display && (
                  <span className="ml-3 text-base font-normal text-ivory/40 line-through">{course.price_display}</span>
                )}
              </p>

              <ul className="mb-7 space-y-3 text-sm text-ivory/80">
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-gold" /> {course.duration}
                </li>
                <li className="flex items-center gap-3">
                  <GraduationCap size={16} className="text-gold" /> {formatLabel}
                </li>
                <li className="flex items-center gap-3">
                  <Award size={16} className="text-gold" /> Certified On Completion
                </li>
              </ul>

              <CourseEnrollButton
                courseId={course.id}
                courseTitle={course.title}
                priceDisplay={priceDisplay}
                variant="onDark"
              />
            </div>
          </aside>
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="relative isolate overflow-hidden border-y border-line bg-gradient-to-br from-ink via-ink-mid to-ink py-24 lg:py-28">
        <div aria-hidden className="v-float pointer-events-none absolute -left-20 top-0 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/35 blur-3xl" style={dly(2.5)} />
        <Sparkles />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

        <div className="v-blur relative z-10 mx-auto max-w-2xl px-6 text-center lg:px-10">
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Ready to learn <span className="v-grad-gold">{course.title}</span>?
          </h2>
          <CourseEnrollButton
            courseId={course.id}
            courseTitle={course.title}
            priceDisplay={priceDisplay}
            variant="onDark"
          />
        </div>
      </section>
    </>
  );
}
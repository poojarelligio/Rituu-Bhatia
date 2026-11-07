import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import IndexTab from "@/components/ui/IndexTab";
import { Marquee, Sparkle, Sparkles, dly, idx } from "@/components/ui/Decor";
import { getPublishedCourses } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses & Training",
  description: "Certified courses in Tarot Card, Vaastu, Reiki, and Crystal Healing, taught by Rituu Bhatia.",
};

/* Decorative strip: only the disciplines already named in the page description */
const MARQUEE_WORDS = ["Tarot Card", "Vaastu", "Reiki", "Crystal Healing"];

type Course = Awaited<ReturnType<typeof getPublishedCourses>>[number];

function CourseImage({ course, sizes }: { course: Course; sizes: string }) {
  return course.image_url ? (
    <Image
      src={course.image_url}
      alt={course.title}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-mid via-violet/60 to-ink">
      <GraduationCap size={36} strokeWidth={1.25} className="text-gold/60" />
    </div>
  );
}

function SaveBadge() {
  return (
    <span className="absolute right-4 top-4 rounded-full bg-gradient-to-br from-gold-soft to-gold px-3 py-1 text-[11px] font-semibold text-ink shadow-[0_6px_20px_-6px_var(--color-gold)] transition-transform duration-500 group-hover:scale-110">
      SAVE
    </span>
  );
}

function Price({ course, dark = false }: { course: Course; dark?: boolean }) {
  return (
    <span className={`text-sm font-semibold ${dark ? "text-gold" : "text-gold-deep"}`}>
      {course.discount_price_display || course.price_display}
      {course.discount_price_display && (
        <span className={`ml-2 font-normal line-through ${dark ? "text-ivory/40" : "text-charcoal/40"}`}>
          {course.price_display}
        </span>
      )}
    </span>
  );
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses();
  const featured = courses.length >= 3 ? courses[0] : null;
  const rest = featured ? courses.slice(1) : courses;

  return (
    <>
      <PageHeader
        eyebrow="LEARN THE PRACTICE"
        title="Courses"
        description="For people who want to go beyond a single session and learn to do this themselves."
      />

      <Marquee words={MARQUEE_WORDS} />

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-20 lg:py-28">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[10%] top-24 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[6%] top-[60%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {/* Featured: first course, wide dark card */}
          {featured && (
            <Link
              href={`/courses/${featured.slug}`}
              className="v-left group relative isolate mb-6 grid overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-30px_var(--color-violet)] lg:grid-cols-12"
            >
              <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
              <Sparkles />
              <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-6 lg:aspect-auto lg:min-h-[420px]">
                <CourseImage course={featured} sizes="(min-width: 1024px) 50vw, 100vw" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/70" />
                {featured.discount_price_display && <SaveBadge />}
              </div>

              <div className="relative flex flex-col p-8 lg:col-span-6 lg:p-12">
                <div className="mb-6 flex items-center justify-between">
                  <IndexTab code={featured.code} index={0} />
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-ivory/70 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="mb-3 font-display text-3xl font-light leading-tight sm:text-4xl">
                  <span className="v-grad-gold">{featured.title}</span>
                </h3>
                <p className="mb-8 flex-1 leading-relaxed text-ivory/75">{featured.subtitle}</p>
                <div className="mb-5 h-px bg-gradient-to-r from-gold/50 to-transparent" />
                <div className="flex items-center justify-between text-xs text-ivory/60">
                  <span>{featured.duration}</span>
                  <Price course={featured} dark />
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rest.map((course, i) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                style={idx(i % 2)}
                className="v-reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/80 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />

                <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                  <CourseImage course={course} sizes="(min-width: 640px) 50vw, 100vw" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                  {course.discount_price_display && <SaveBadge />}
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <IndexTab code={course.code} index={featured ? i + 1 : i} />
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-charcoal/40 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <ArrowUpRight size={17} strokeWidth={1.5} />
                    </span>
                  </div>
                  <h3 className="mb-1 font-display text-xl leading-snug text-charcoal transition-colors group-hover:text-gold-deep">
                    {course.title}
                  </h3>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-charcoal/65">{course.subtitle}</p>
                  <div className="ledger-divider mb-5" />
                  <div className="flex items-center justify-between text-xs text-charcoal/55">
                    <span>{course.duration}</span>
                    <Price course={course} />
                  </div>
                </div>
              </Link>
            ))}

            {courses.length === 0 && (
              <div className="col-span-full mx-auto max-w-md rounded-3xl border border-line bg-white/80 p-10 text-center backdrop-blur">
                <Sparkle className="v-twinkle mx-auto mb-4 h-6 w-6 text-gold" />
                <p className="text-charcoal/60 text-sm">No courses published yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
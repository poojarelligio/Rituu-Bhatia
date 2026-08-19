import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import IndexTab from "@/components/ui/IndexTab";
import { getPublishedCourses } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses & Training",
  description: "Certified courses in Tarot, Vaastu, Reiki, and Crystal Healing, taught by Rituu Bhatia.",
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <>
      <PageHeader
        eyebrow="LEARN THE PRACTICE"
        title="Courses"
        description="For people who want to go beyond a single session and learn to do this themselves."
      />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {courses.map((course, i) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group relative flex flex-col bg-ivory border border-line rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                {course.image_url ? (
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-charcoal-soft">
                    <GraduationCap size={32} className="text-ivory/20" />
                  </div>
                )}
                {course.discount_price_display && (
                  <span className="absolute top-4 right-4 text-[11px] font-medium text-ivory bg-burgundy rounded-full px-2.5 py-1">
                    SAVE
                  </span>
                )}
              </div>

              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <IndexTab code={course.code} index={i} />
                  <ArrowUpRight size={18} className="text-charcoal/30 group-hover:text-burgundy transition-colors" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-charcoal/65 leading-relaxed mb-5 flex-1">{course.subtitle}</p>
                <div className="ledger-divider mb-5" />
                <div className="flex items-center justify-between text-xs text-charcoal/50">
                  <span>{course.duration}</span>
                  <span className="text-burgundy font-medium text-sm">
                    {course.discount_price_display || course.price_display}
                    {course.discount_price_display && (
                      <span className="ml-2 text-charcoal/40 line-through font-normal">{course.price_display}</span>
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {courses.length === 0 && (
            <p className="text-charcoal/50 text-sm col-span-2">No courses published yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
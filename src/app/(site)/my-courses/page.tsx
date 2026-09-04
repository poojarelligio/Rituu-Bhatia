import Link from "next/link";
import Image from "next/image";
import { BookOpen, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/studentAuth";
import { query } from "@/lib/db";
import StudentLogoutButton from "@/components/student/StudentLogoutButton";

export const dynamic = "force-dynamic";

interface EnrolledCourse {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  instructor: string | null;
  duration: string | null;
  enrolled_at: string | null;
}

export default async function MyCoursesPage() {
  const student = await getStudentSession();

  if (!student) {
    redirect("/student/login?next=/my-courses");
  }

  const courses = await query<EnrolledCourse[]>(
    `SELECT
       c.id,
       c.slug,
       c.title,
       c.subtitle,
       c.image_url,
       c.instructor,
       c.duration,
       e.enrolled_at
     FROM course_enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.customer_email = ?
       AND e.status = 'ACTIVE'
     ORDER BY e.enrolled_at DESC`,
    [student.email]
  );

  return (
    <section className="min-h-[70vh] bg-ivory py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="index-tab text-xs text-gold mb-3">STUDENT AREA</p>
            <h1 className="font-display text-4xl text-charcoal">
              Welcome, {student.name}
            </h1>
            <p className="text-sm text-charcoal/60 mt-2">
              Your enrolled courses are ready whenever you are.
            </p>
          </div>

          <StudentLogoutButton />
        </div>

        {courses.length === 0 ? (
          <div className="border border-line rounded-sm bg-white p-10 text-center">
            <GraduationCap size={34} className="text-burgundy mx-auto mb-4" />
            <h2 className="font-display text-2xl text-charcoal mb-2">
              No active courses yet
            </h2>
            <p className="text-sm text-charcoal/60 mb-6">
              Once your course payment is confirmed, it will appear here.
            </p>
            <Link
              href="/courses"
              className="inline-flex bg-burgundy text-ivory rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors"
            >
              Explore courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/${course.slug}`}
                className="group bg-white border border-line rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/9] bg-charcoal-soft overflow-hidden">
                  {course.image_url ? (
                    <Image
                      src={course.image_url}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={32} className="text-ivory/30" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="index-tab text-xs text-gold mb-3">
                    {course.duration || "SELF-PACED"}
                  </p>
                  <h2 className="font-display text-2xl text-charcoal group-hover:text-burgundy transition-colors">
                    {course.title}
                  </h2>
                  {course.subtitle && (
                    <p className="text-sm text-charcoal/60 mt-2 line-clamp-2">
                      {course.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-6 text-sm font-medium text-burgundy">
                    <BookOpen size={16} />
                    Continue learning
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
import SetPasswordForm from "@/components/student/SetPasswordForm";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function StudentSetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <section className="min-h-[70vh] bg-ivory flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="index-tab text-xs text-gold mb-2 text-center">
          RITUU BHATIA COURSES
        </p>
        <h1 className="font-display text-2xl text-charcoal text-center mb-3">
          Set your password
        </h1>
        <p className="text-sm text-charcoal/60 text-center mb-8">
          Create a password to access your enrolled courses.
        </p>

        <SetPasswordForm token={token} />
      </div>
    </section>
  );
}
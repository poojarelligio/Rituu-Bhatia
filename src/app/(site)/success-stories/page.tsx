import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import IndexTab from "@/components/ui/IndexTab";
import { getSuccessStories } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Success Stories" };

export default async function SuccessStoriesPage() {
  const stories = await getSuccessStories();
  return (
    <>
      <PageHeader eyebrow="CASE FILES" title="Success Stories" description="Real questions clients brought to Rituu, and what came of them." />
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story, i) => (
          <Link key={story.id} href={`/success-stories/${story.slug}`} className="group bg-ivory border border-line rounded-sm p-7 flex flex-col">
            <IndexTab code="SS" index={i} className="self-start mb-5" />
            <p className="font-display text-lg text-charcoal leading-snug mb-3">{story.summary}</p>
            <span className="mt-auto text-xs text-burgundy group-hover:underline underline-offset-4">Read the full story →</span>
          </Link>
        ))}
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import VideoEmbed from "@/components/ui/VideoEmbed";
import { getSuccessStoryBySlug } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getSuccessStoryBySlug(slug);
  if (!story) return {};
  return { title: story.summary || "Success Story", description: story.outcome || undefined };
}

export default async function SuccessStoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getSuccessStoryBySlug(slug);
  if (!story) notFound();

  return (
    <section className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
      <h1 className="font-display text-3xl sm:text-4xl text-charcoal font-light leading-tight mb-10">{story.summary}</h1>
      {story.video_url && <div className="mb-10"><VideoEmbed url={story.video_url} title={story.summary || ""} /></div>}
      <div className="space-y-8">
        <div>
          <p className="index-tab text-xs text-charcoal/40 mb-2">CHALLENGE</p>
          <p className="text-charcoal/75 leading-relaxed">{story.challenge}</p>
        </div>
        <div>
          <p className="index-tab text-xs text-charcoal/40 mb-2">APPROACH</p>
          <p className="text-charcoal/75 leading-relaxed">{story.approach}</p>
        </div>
        <div>
          <p className="index-tab text-xs text-charcoal/40 mb-2">OUTCOME</p>
          <p className="text-charcoal/75 leading-relaxed">{story.outcome}</p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-line">
        <Button href="/services" variant="ghost">← Explore Services</Button>
      </div>
    </section>
  );
}

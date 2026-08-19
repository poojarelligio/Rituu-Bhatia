import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import ShareBlogPost from "@/components/site/ShareBlogPost";
import { getBlogPostBySlug } from "@/lib/publicQueries";
import { estimateReadingTime } from "@/lib/readingTime";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || undefined;
  const image = post.og_image_url || post.featured_image_url || undefined;

  return {
    title,
    description,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function KnowledgeDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.og_image_url || post.featured_image_url || undefined,
    author: { "@type": "Person", name: post.author || "Rituu Bhatia" },
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at,
  };

  const publishedDate = formatDate(post.published_at);
  const readingTime = estimateReadingTime(post.content);
  const postUrl = `${siteUrl}/knowledge/${post.slug}`;

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 lg:px-10 pt-16 pb-8">
        {post.category && (
          <Link
            href={`/knowledge?category=${encodeURIComponent(post.category)}`}
            className="index-tab text-xs text-gold mb-4 uppercase inline-block hover:text-burgundy transition-colors"
          >
            {post.category}
          </Link>
        )}
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal font-light leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <div className="flex items-center gap-4 text-sm text-charcoal/60">
            <span className="font-medium text-charcoal">{post.author || "Rituu Bhatia"}</span>
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {publishedDate}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {readingTime}
            </span>
          </div>
          <ShareBlogPost title={post.title} url={postUrl} />
        </div>
      </div>

      {post.featured_image_url && (
        <div className="max-w-3xl mx-auto px-6 lg:px-10 mb-12">
          <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden bg-ivory-deep shadow-lg">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <div
          className="prose-content text-charcoal/75 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-charcoal/50 border border-line rounded-full px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 mb-10 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <Button href="/knowledge" variant="ghost">← Back to Knowledge</Button>
          <ShareBlogPost title={post.title} url={postUrl} />
        </div>
      </div>
    </article>
  );
}
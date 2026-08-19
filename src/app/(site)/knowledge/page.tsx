import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { getPublishedBlogPosts } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge — Notes from the Practice",
  description: "Short, practical reads on Tarot, Vaastu, Astrology, Reiki, and spiritual growth.",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function KnowledgePage() {
  const posts = await getPublishedBlogPosts();
  return (
    <>
      <PageHeader eyebrow="KNOWLEDGE" title="Notes from the practice" description="Short, practical reads on Tarot, Vaastu, Astrology, and Reiki." />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const publishedDate = formatDate(post.published_at);
          return (
            <Link
              key={post.id}
              href={`/knowledge/${post.slug}`}
              className="group border border-line rounded-sm overflow-hidden bg-ivory hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-ivory-deep overflow-hidden">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/20 font-display">Rituu Bhatia</div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                {post.category && <p className="index-tab text-[11px] text-gold mb-2 uppercase">{post.category}</p>}
                <h2 className="font-display text-lg text-charcoal mb-2 group-hover:text-burgundy transition-colors">{post.title}</h2>
                <p className="text-sm text-charcoal/60 leading-relaxed flex-1">{post.excerpt}</p>

                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-line text-xs text-charcoal/50">
                  <span className="flex items-center gap-1.5">
                    <User size={12} /> {post.author || "Rituu Bhatia"}
                  </span>
                  {publishedDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {publishedDate}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        {posts.length === 0 && <p className="text-charcoal/50 text-sm">No articles published yet.</p>}
      </section>
    </>
  );
}
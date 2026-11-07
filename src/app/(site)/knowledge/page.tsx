import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Marquee, Sparkle, Sparkles, dly, idx } from "@/components/ui/Decor";
import { getPublishedBlogPosts } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge — Notes from the Practice",
  description: "Short, practical reads on Tarot Card, Vaastu, Astrology, Reiki, and spiritual growth.",
};

/* Decorative strip: only the disciplines already named in the page description */
const MARQUEE_WORDS = ["Tarot Card", "Vaastu", "Astrology", "Reiki"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

type Post = Awaited<ReturnType<typeof getPublishedBlogPosts>>[number];

function PostImage({ post, sizes }: { post: Post; sizes: string }) {
  return post.featured_image_url ? (
    <Image
      src={post.featured_image_url}
      alt=""
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-mid via-violet/60 to-ink">
      <span className="font-display text-xl font-light text-gold/70">Rituu Bhatia</span>
    </div>
  );
}

function Meta({ post, dark = false }: { post: Post; dark?: boolean }) {
  const publishedDate = formatDate(post.published_at);
  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs ${
        dark ? "border-t border-white/15 text-ivory/60" : "border-t border-line text-charcoal/55"
      } mt-5 pt-4`}
    >
      <span className="flex items-center gap-1.5">
        <User size={12} className={dark ? "text-gold" : "text-gold-deep"} /> {post.author || "Rituu Bhatia"}
      </span>
      {publishedDate && (
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className={dark ? "text-gold" : "text-gold-deep"} /> {publishedDate}
        </span>
      )}
    </div>
  );
}

export default async function KnowledgePage() {
  const posts = await getPublishedBlogPosts();
  const featured = posts.length >= 3 ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <>
      <PageHeader
        eyebrow="KNOWLEDGE"
        title="Notes from the practice"
        description="Short, practical reads on Tarot Card, Vaastu, Astrology, and Reiki."
      />

      <Marquee words={MARQUEE_WORDS} />

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-16 lg:py-24">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[10%] top-24 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[6%] top-[60%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {/* Featured: latest article, wide dark card */}
          {featured && (
            <Link
              href={`/knowledge/${featured.slug}`}
              className="v-left group relative isolate mb-6 grid overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-30px_var(--color-violet)] lg:grid-cols-12"
            >
              <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
              <Sparkles />
              <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[400px]">
                <PostImage post={featured} sizes="(min-width: 1024px) 58vw, 100vw" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/80" />
              </div>

              <div className="relative flex flex-col justify-center p-8 lg:col-span-5 lg:p-12">
                <div className="mb-5 flex items-center justify-between">
                  {featured.category ? (
                    <span className="index-tab rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase text-gold-soft backdrop-blur-md">
                      {featured.category}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-ivory/70 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </span>
                </div>
                <h2 className="mb-4 font-display text-3xl font-light leading-tight sm:text-4xl">
                  <span className="v-grad-gold">{featured.title}</span>
                </h2>
                <p className="leading-relaxed text-ivory/75">{featured.excerpt}</p>
                <Meta post={featured} dark />
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Link
                key={post.id}
                href={`/knowledge/${post.slug}`}
                style={idx(i % 3)}
                className="v-reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/80 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />

                <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                  <PostImage post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                  {post.category && (
                    <span className="index-tab absolute left-4 top-4 rounded-full border border-white/30 bg-ink/50 px-3 py-1 text-[10px] uppercase text-gold-soft backdrop-blur-md">
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 font-display text-lg leading-snug text-charcoal transition-colors group-hover:text-gold-deep">
                    {post.title}
                  </h2>
                  <p className="flex-1 text-sm leading-relaxed text-charcoal/65">{post.excerpt}</p>
                  <Meta post={post} />
                </div>
              </Link>
            ))}

            {posts.length === 0 && (
              <div className="col-span-full mx-auto max-w-md rounded-3xl border border-line bg-white/80 p-10 text-center backdrop-blur">
                <Sparkle className="v-twinkle mx-auto mb-4 h-6 w-6 text-gold" />
                <p className="text-sm text-charcoal/60">No articles published yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
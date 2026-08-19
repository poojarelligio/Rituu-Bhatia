import { MetadataRoute } from "next";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, courses, stories, posts] = await Promise.all([
    query<{ slug: string }[]>("SELECT slug FROM services WHERE status = 'published'"),
    query<{ slug: string }[]>("SELECT slug FROM courses WHERE status = 'published'"),
    query<{ slug: string }[]>("SELECT slug FROM success_stories WHERE status = 'published'"),
    query<{ slug: string; updated_at: string }[]>("SELECT slug, updated_at FROM blog_posts WHERE status = 'published'"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/about`, priority: 0.8 },
    { url: `${siteUrl}/services`, priority: 0.9 },
    { url: `${siteUrl}/courses`, priority: 0.9 },
    { url: `${siteUrl}/workshops-events`, priority: 0.7 },
    { url: `${siteUrl}/success-stories`, priority: 0.7 },
    { url: `${siteUrl}/resources`, priority: 0.6 },
    { url: `${siteUrl}/knowledge`, priority: 0.7 },
    { url: `${siteUrl}/assessment`, priority: 0.6 },
    { url: `${siteUrl}/community`, priority: 0.5 },
    { url: `${siteUrl}/book`, priority: 0.8 },
    { url: `${siteUrl}/contact`, priority: 0.6 },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [
    ...services.map((s) => ({ url: `${siteUrl}/services/${s.slug}`, priority: 0.8 })),
    ...courses.map((c) => ({ url: `${siteUrl}/courses/${c.slug}`, priority: 0.8 })),
    ...stories.map((s) => ({ url: `${siteUrl}/success-stories/${s.slug}`, priority: 0.5 })),
    ...posts.map((p) => ({
      url: `${siteUrl}/knowledge/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}

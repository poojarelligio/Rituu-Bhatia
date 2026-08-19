import { query } from "./db";
import { Service, Course, Testimonial, SuccessStory, EventRow, MediaFeature, BlogPost, Resource, Faq } from "./types";

export async function getPublishedServices(): Promise<Service[]> {
  return query<Service[]>("SELECT * FROM services WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const rows = await query<Service[]>("SELECT * FROM services WHERE slug = ? AND status = 'published' LIMIT 1", [slug]);
  return rows[0] || null;
}

export async function getPublishedCourses(): Promise<Course[]> {
  return query<Course[]>("SELECT * FROM courses WHERE status = 'published' ORDER BY sort_order ASC, id ASC");
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const rows = await query<Course[]>("SELECT * FROM courses WHERE slug = ? AND status = 'published' LIMIT 1", [slug]);
  return rows[0] || null;
}

export async function getFeaturedTestimonials(limit = 4): Promise<Testimonial[]> {
  return query<Testimonial[]>(
    "SELECT * FROM testimonials WHERE status = 'published' AND featured = 1 ORDER BY id DESC LIMIT ?",
    [limit]
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return query<Testimonial[]>("SELECT * FROM testimonials WHERE status = 'published' ORDER BY id DESC");
}

export async function getSuccessStories(relatedServiceId?: number): Promise<SuccessStory[]> {
  if (relatedServiceId) {
    return query<SuccessStory[]>(
      "SELECT *, CASE WHEN client_name_permitted = 1 THEN client_name ELSE NULL END AS client_name_display FROM success_stories WHERE status = 'published' AND related_service_id = ? ORDER BY story_date DESC",
      [relatedServiceId]
    );
  }
  return query<SuccessStory[]>(
    "SELECT *, CASE WHEN client_name_permitted = 1 THEN client_name ELSE NULL END AS client_name_display FROM success_stories WHERE status = 'published' ORDER BY story_date DESC"
  );
}

export async function getSuccessStoryBySlug(slug: string): Promise<SuccessStory | null> {
  const rows = await query<SuccessStory[]>(
    "SELECT *, CASE WHEN client_name_permitted = 1 THEN client_name ELSE NULL END AS client_name_display FROM success_stories WHERE slug = ? AND status = 'published' LIMIT 1",
    [slug]
  );
  return rows[0] || null;
}

export async function getUpcomingEvents(limit?: number): Promise<EventRow[]> {
  const sql = `SELECT * FROM events WHERE status = 'published' AND event_status = 'upcoming' ORDER BY event_date ASC${limit ? " LIMIT ?" : ""}`;
  return limit ? query<EventRow[]>(sql, [limit]) : query<EventRow[]>(sql);
}

export async function getPastEvents(): Promise<EventRow[]> {
  return query<EventRow[]>("SELECT * FROM events WHERE status = 'published' AND event_status = 'past' ORDER BY event_date DESC");
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const rows = await query<EventRow[]>("SELECT * FROM events WHERE slug = ? AND status = 'published' LIMIT 1", [slug]);
  return rows[0] || null;
}

export async function getPublishedResources(): Promise<Resource[]> {
  return query<Resource[]>("SELECT * FROM resources WHERE status = 'published' ORDER BY id DESC");
}

export async function getMediaFeatures(): Promise<MediaFeature[]> {
  return query<MediaFeature[]>("SELECT * FROM media_features WHERE status = 'published' ORDER BY feature_date DESC, id DESC");
}

export async function getBookingFaqs(): Promise<Faq[]> {
  return query<Faq[]>("SELECT * FROM faqs WHERE context = 'booking' ORDER BY sort_order ASC, id ASC");
}

export async function getFaqsForService(serviceId: number): Promise<Faq[]> {
  return query<Faq[]>("SELECT * FROM faqs WHERE related_service_id = ? ORDER BY sort_order ASC, id ASC", [serviceId]);
}

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const sql = `SELECT id, slug, title, excerpt, featured_image_url, category, tags, author, published_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC${limit ? " LIMIT ?" : ""}` as string;
  return (limit ? query<BlogPost[]>(sql, [limit]) : query<BlogPost[]>(sql));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await query<BlogPost[]>("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1", [slug]);
  return rows[0] || null;
}

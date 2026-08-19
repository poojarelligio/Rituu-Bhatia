import { CrudFieldConfig } from "./crud";

export const serviceConfig: CrudFieldConfig & { publicColumns: string } = {
  table: "services",
  writableFields: [
    "slug", "title", "code", "short_description", "full_description", "image_url",
    "duration", "price_display", "price_amount", "booking_cta_label", "benefits",
    "process_steps", "stats", "audience", "meta_title", "meta_description", "status", "sort_order",
  ],
  defaultOrderBy: "sort_order ASC, id ASC",
  // price_amount is deliberately excluded from public responses — it's only
  // ever read server-side when creating a Razorpay order, so a public API
  // consumer never sees the number used to charge someone.
  publicColumns:
    "id, slug, title, code, short_description, full_description, image_url, duration, price_display, booking_cta_label, benefits, process_steps, stats, audience, meta_title, meta_description",
};

export const courseConfig: CrudFieldConfig & { publicColumns: string } = {
  table: "courses",
  writableFields: [
    "slug", "title", "code", "subtitle", "instructor", "duration", "format",
    "price_display", "price_amount", "discount_price_display", "discount_price_amount",
    "schedule", "image_url", "curriculum", "meta_title", "meta_description", "status", "sort_order",
  ],
  defaultOrderBy: "sort_order ASC, id ASC",
  publicColumns:
    "id, slug, title, code, subtitle, instructor, duration, format, price_display, discount_price_display, schedule, image_url, curriculum, meta_title, meta_description",
};

export const successStoryConfig: CrudFieldConfig = {
  table: "success_stories",
  writableFields: [
    "slug", "summary", "client_name", "client_name_permitted", "challenge", "approach",
    "outcome", "full_story", "testimonial_quote", "video_url", "image_url",
    "related_service_id", "story_date", "status",
  ],
  defaultOrderBy: "story_date DESC, id DESC",
};

export const testimonialConfig: CrudFieldConfig = {
  table: "testimonials",
  writableFields: ["name", "quote", "rating", "featured", "video_url", "image_url", "related_service_id", "status"],
  defaultOrderBy: "id DESC",
};

export const faqConfig: CrudFieldConfig = {
  table: "faqs",
  writableFields: ["question", "answer", "context", "related_service_id", "related_course_id", "sort_order"],
  defaultOrderBy: "sort_order ASC, id ASC",
};

export const eventConfig: CrudFieldConfig & { publicColumns: string } = {
  table: "events",
  writableFields: [
    "slug", "title", "excerpt", "description", "event_date", "event_time", "location",
    "speaker", "fee_display", "fee_amount", "event_status", "registration_link",
    "image_url", "gallery", "status",
  ],
  defaultOrderBy: "event_date ASC",
  publicColumns:
    "id, slug, title, excerpt, description, event_date, event_time, location, speaker, fee_display, event_status, registration_link, image_url, gallery",
};

export const resourceConfig: CrudFieldConfig = {
  table: "resources",
  writableFields: ["slug", "title", "excerpt", "resource_type", "file_url", "image_url", "gated", "status"],
  defaultOrderBy: "id DESC",
};

export const mediaFeatureConfig: CrudFieldConfig = {
  table: "media_features",
  writableFields: ["title", "publication", "link", "feature_date", "feature_type", "status"],
  defaultOrderBy: "feature_date DESC, id DESC",
};

export const blogPostConfig: CrudFieldConfig = {
  table: "blog_posts",
  writableFields: [
    "slug", "title", "excerpt", "content", "featured_image_url", "category", "tags",
    "author", "meta_title", "meta_description", "og_image_url", "status", "published_at",
  ],
  defaultOrderBy: "published_at DESC, id DESC",
};

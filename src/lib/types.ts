export type Status = "draft" | "published";

export interface Service {
  id: number;
  slug: string;
  title: string;
  code: string;
  short_description: string | null;
  full_description: string | null;
  image_url: string | null;
  duration: string | null;
  price_display: string | null;
  price_amount: number;
  booking_cta_label: string | null;
  benefits: string[] | null;
  process_steps: { title: string; description: string }[] | null;
  stats: { value: string; label: string }[] | null;
  audience: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  status: Status;
  sort_order: number;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  code: string;
  subtitle: string | null;
  instructor: string | null;
  duration: string | null;
  format: "live_online" | "in_person" | "self_paced";
  price_display: string | null;
  price_amount: number;
  discount_price_display: string | null;
  discount_price_amount: number;
  schedule: string | null;
  image_url: string | null;
  curriculum: { module: string; lessons: string[] }[] | null;
  meta_title: string | null;
  meta_description: string | null;
  status: Status;
  sort_order: number;
}

export interface SuccessStory {
  id: number;
  slug: string;
  summary: string | null;
  client_name: string | null;
  client_name_permitted: 0 | 1;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  full_story: string | null;
  testimonial_quote: string | null;
  video_url: string | null;
  image_url: string | null;
  related_service_id: number | null;
  story_date: string | null;
  status: Status;
}

export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
  featured: 0 | 1;
  video_url: string | null;
  image_url: string | null;
  related_service_id: number | null;
  status: Status;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  context: "general" | "booking";
  related_service_id: number | null;
  related_course_id: number | null;
  sort_order: number;
}

export interface EventRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  speaker: string | null;
  fee_display: string | null;
  fee_amount: number;
  event_status: "upcoming" | "past";
  registration_link: string | null;
  image_url: string | null;
  gallery: string[] | null;
  status: Status;
}

export interface Resource {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  resource_type: "ebook" | "guide" | "checklist" | "report" | "webinar" | "video";
  file_url: string | null;
  image_url: string | null;
  gated: 0 | 1;
  status: Status;
}

export interface MediaFeature {
  id: number;
  title: string;
  publication: string | null;
  link: string | null;
  feature_date: string | null;
  feature_type: "interview" | "article" | "tv" | "podcast" | "award";
  status: Status;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  author: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  status: Status;
  published_at: string | null;
  updated_at: string;
}

export interface Booking {
  id: number;
  item_type: "service" | "free_intro" | "course";
  item_id: number;
  service_slug: string | null;
  booking_date: string | null;
  booking_time: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  amount_paise: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service_id: number | null;
  message: string | null;
  source: string | null;
  utm: Record<string, string> | null;
  status: "NEW" | "CONTACTED" | "INTERESTED" | "BOOKED" | "COMPLETED" | "LOST";
  created_at: string;
}

export interface SiteSettings {
  whatsapp_community_link: string | null;
  whatsapp_number: string | null;
  telegram_link: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  google_maps_embed_url: string | null;
  newsletter_embed_html: string | null;
}

export interface AvailabilitySettings {
  working_days: number[];
  start_time: string;
  end_time: string;
  slot_minutes: number;
  buffer_minutes: number;
  blocked_dates: string[];
  blocked_slots: string[];
}

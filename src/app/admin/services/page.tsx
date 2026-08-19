"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function ServicesAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/services"
      title="Services"
      listColumns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "price_display", label: "Price" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text", help: "e.g. tarot-reading" },
        { name: "code", label: "Code", type: "text", help: "e.g. TR — used on the ledger index tab" },
        { name: "short_description", label: "Short Description", type: "textarea" },
        { name: "full_description", label: "Full Description", type: "textarea" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "duration", label: "Duration", type: "text", help: 'e.g. "45 minutes"' },
        { name: "price_display", label: "Price (display)", type: "text", help: "e.g. ₹1,500" },
        { name: "price_amount", label: "Price (paise, for Razorpay)", type: "number", help: "150000 = ₹1,500.00" },
        { name: "booking_cta_label", label: "Booking CTA Label", type: "text" },
        { name: "benefits", label: "What You Get", type: "string-list", help: "one per line" },
        { name: "process_steps", label: "How It Works", type: "process-list" },
        { name: "stats", label: "Impact Stats", type: "stat-list" },
        { name: "audience", label: "Who This Is For", type: "string-list", help: "one per line" },
        { name: "meta_title", label: "SEO Title", type: "text" },
        { name: "meta_description", label: "SEO Description", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
        { name: "sort_order", label: "Sort Order", type: "number" },
      ]}
    />
  );
}

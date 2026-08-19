"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function TestimonialsAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/testimonials"
      title="Testimonials"
      listColumns={[
        { key: "name", label: "Name" },
        { key: "quote", label: "Quote" },
        { key: "featured", label: "Featured" },
      ]}
      fields={[
        { name: "name", label: "Client Name", type: "text" },
        { name: "quote", label: "Quote", type: "textarea" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "featured", label: "Featured on homepage", type: "checkbox" },
        { name: "video_url", label: "Video URL (optional)", type: "text" },
        { name: "image_url", label: "Photo", type: "image" },
        { name: "related_service_id", label: "Related Service ID", type: "number" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      ]}
    />
  );
}

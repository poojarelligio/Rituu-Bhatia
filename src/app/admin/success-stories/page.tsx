"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function SuccessStoriesAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/success-stories"
      title="Success Stories"
      listColumns={[
        { key: "summary", label: "Summary" },
        { key: "slug", label: "Slug" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "slug", label: "Slug", type: "text" },
        { name: "summary", label: "Summary (shown on index cards)", type: "textarea" },
        { name: "client_name", label: "Client Name", type: "text" },
        { name: "client_name_permitted", label: "Client gave permission to show their name", type: "checkbox" },
        { name: "challenge", label: "Challenge", type: "textarea" },
        { name: "approach", label: "Approach", type: "textarea" },
        { name: "outcome", label: "Outcome", type: "textarea" },
        { name: "full_story", label: "Full Story (optional)", type: "textarea" },
        { name: "testimonial_quote", label: "Testimonial Quote", type: "textarea" },
        { name: "video_url", label: "Video URL (YouTube/Vimeo)", type: "text" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "related_service_id", label: "Related Service ID", type: "number", help: "see the Services list for IDs" },
        { name: "story_date", label: "Story Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      ]}
    />
  );
}

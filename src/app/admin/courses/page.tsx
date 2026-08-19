"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function CoursesAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/courses"
      title="Courses"
      listColumns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "price_display", label: "Price" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "code", label: "Code", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "text" },
        { name: "instructor", label: "Instructor", type: "text" },
        { name: "duration", label: "Duration", type: "text" },
        { name: "format", label: "Format", type: "select", options: [
          { value: "live_online", label: "Live Online" },
          { value: "in_person", label: "In-Person" },
          { value: "self_paced", label: "Self-Paced" },
        ] },
        { name: "price_display", label: "Price (display)", type: "text" },
        { name: "price_amount", label: "Price (paise)", type: "number" },
        { name: "discount_price_display", label: "Discount Price (display)", type: "text" },
        { name: "discount_price_amount", label: "Discount Price (paise)", type: "number" },
        { name: "schedule", label: "Schedule Note", type: "text" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "curriculum", label: "Curriculum", type: "curriculum" },
        { name: "meta_title", label: "SEO Title", type: "text" },
        { name: "meta_description", label: "SEO Description", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
        { name: "sort_order", label: "Sort Order", type: "number" },
      ]}
    />
  );
}

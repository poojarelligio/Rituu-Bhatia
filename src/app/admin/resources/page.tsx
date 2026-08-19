"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function ResourcesAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/resources"
      title="Free Resources"
      listColumns={[
        { key: "title", label: "Title" },
        { key: "resource_type", label: "Type" },
        { key: "gated", label: "Gated" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "resource_type", label: "Type", type: "select", options: [
          { value: "ebook", label: "E-book" }, { value: "guide", label: "Guide" },
          { value: "checklist", label: "Checklist" }, { value: "report", label: "Report" },
          { value: "webinar", label: "Webinar" }, { value: "video", label: "Video" },
        ] },
        { name: "file_url", label: "File", type: "image", help: "PDF or image upload" },
        { name: "image_url", label: "Cover Image", type: "image" },
        { name: "gated", label: "Require email to download", type: "checkbox" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      ]}
    />
  );
}

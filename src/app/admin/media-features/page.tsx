"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function MediaFeaturesAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/media-features"
      title="Media & Recognition"
      listColumns={[
        { key: "title", label: "Title" },
        { key: "publication", label: "Publication" },
        { key: "feature_type", label: "Type" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "publication", label: "Publication / Channel", type: "text" },
        { name: "link", label: "Link", type: "text" },
        { name: "feature_date", label: "Date", type: "date" },
        { name: "feature_type", label: "Type", type: "select", options: [
          { value: "interview", label: "Interview" }, { value: "article", label: "Article" },
          { value: "tv", label: "TV Appearance" }, { value: "podcast", label: "Podcast" }, { value: "award", label: "Award" },
        ] },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
      ]}
    />
  );
}

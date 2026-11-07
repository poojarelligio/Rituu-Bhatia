"use client";
import EntityManager from "@/components/admin/EntityManager";

export default function BlogAdminPage() {
  return (
    <EntityManager
      apiBase="/api/admin/blog"
      title="Blog"
      listColumns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
        { key: "published_at", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text", help: "used in the URL: /knowledge/your-slug" },
        { name: "excerpt", label: "Excerpt", type: "textarea", help: "shown on the blog index and used as a fallback SEO description" },
        { name: "content", label: "Content (HTML)", type: "textarea", help: "supports basic HTML tags: <p> <h2> <h3> <ul> <li> <a> <img> <strong> <em>" },
        { name: "featured_image_url", label: "Featured Image", type: "image" },
        { name: "category", label: "Category", type: "select", options: [
          { value: "Astrology", label: "Astrology" }, { value: "Vaastu", label: "Vaastu" },
          { value: "Reiki", label: "Reiki" }, { value: "Tarot Card", label: "Tarot Card" },
          { value: "Spiritual Growth", label: "Spiritual Growth" }, { value: "Numerology", label: "Numerology" },
          { value: "Life Coaching", label: "Life Coaching" },
        ] },
        { name: "tags", label: "Tags", type: "string-list", help: "one per line" },
        { name: "author", label: "Author", type: "text" },
        { name: "meta_title", label: "SEO Title", type: "text", help: "shown in Google search results and browser tabs — falls back to Title if left blank" },
        { name: "meta_description", label: "SEO Description", type: "textarea", help: "shown in Google search results — falls back to Excerpt if left blank, aim for 150-160 characters" },
        { name: "og_image_url", label: "Social Share Image", type: "image", help: "shown when this post is shared on social media — falls back to Featured Image if left blank" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }] },
        { name: "published_at", label: "Publish Date", type: "date", help: "controls sort order and appears on the post — set this when publishing" },
      ]}
    />
  );
}

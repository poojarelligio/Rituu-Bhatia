import { publicList } from "@/lib/crud";
import { blogPostConfig } from "@/lib/entityConfigs";

export const { GET } = publicList({
  ...blogPostConfig,
  columns:
    "id, slug, title, excerpt, featured_image_url, category, tags, author, published_at",
});

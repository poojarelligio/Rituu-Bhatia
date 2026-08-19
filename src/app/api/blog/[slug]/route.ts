import { publicGetBySlug } from "@/lib/crud";
import { blogPostConfig } from "@/lib/entityConfigs";

// Full row here (including content + meta_title/meta_description/og_image_url)
// since this powers both the article body and the page's SEO metadata.
export const { GET } = publicGetBySlug(blogPostConfig);

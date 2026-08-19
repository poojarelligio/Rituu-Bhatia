import { adminGetUpdateDelete } from "@/lib/crud";
import { blogPostConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(blogPostConfig);

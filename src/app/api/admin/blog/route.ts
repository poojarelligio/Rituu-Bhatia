import { adminListAndCreate } from "@/lib/crud";
import { blogPostConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(blogPostConfig);

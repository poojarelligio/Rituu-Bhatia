import { adminListAndCreate } from "@/lib/crud";
import { successStoryConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(successStoryConfig);

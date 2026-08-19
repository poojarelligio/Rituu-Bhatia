import { adminGetUpdateDelete } from "@/lib/crud";
import { successStoryConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(successStoryConfig);

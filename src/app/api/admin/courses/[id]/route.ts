import { adminGetUpdateDelete } from "@/lib/crud";
import { courseConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(courseConfig);

import { adminGetUpdateDelete } from "@/lib/crud";
import { testimonialConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(testimonialConfig);

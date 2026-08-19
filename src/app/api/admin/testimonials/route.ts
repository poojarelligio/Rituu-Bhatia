import { adminListAndCreate } from "@/lib/crud";
import { testimonialConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(testimonialConfig);

import { publicGetBySlug } from "@/lib/crud";
import { courseConfig } from "@/lib/entityConfigs";

export const { GET } = publicGetBySlug({ ...courseConfig, columns: courseConfig.publicColumns });

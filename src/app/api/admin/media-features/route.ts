import { adminListAndCreate } from "@/lib/crud";
import { mediaFeatureConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(mediaFeatureConfig);

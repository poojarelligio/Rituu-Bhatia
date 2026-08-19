import { adminGetUpdateDelete } from "@/lib/crud";
import { mediaFeatureConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(mediaFeatureConfig);

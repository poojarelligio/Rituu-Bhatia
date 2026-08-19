import { publicList } from "@/lib/crud";
import { mediaFeatureConfig } from "@/lib/entityConfigs";

export const { GET } = publicList(mediaFeatureConfig);

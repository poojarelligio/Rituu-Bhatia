import { publicList } from "@/lib/crud";
import { courseConfig } from "@/lib/entityConfigs";

export const { GET } = publicList({ ...courseConfig, columns: courseConfig.publicColumns });

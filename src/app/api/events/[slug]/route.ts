import { publicGetBySlug } from "@/lib/crud";
import { eventConfig } from "@/lib/entityConfigs";

export const { GET } = publicGetBySlug({ ...eventConfig, columns: eventConfig.publicColumns });

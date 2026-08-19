import { publicGetBySlug } from "@/lib/crud";
import { serviceConfig } from "@/lib/entityConfigs";

export const { GET } = publicGetBySlug({ ...serviceConfig, columns: serviceConfig.publicColumns });

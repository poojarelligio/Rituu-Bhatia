import { adminListAndCreate } from "@/lib/crud";
import { serviceConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(serviceConfig);

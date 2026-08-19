import { adminListAndCreate } from "@/lib/crud";
import { resourceConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(resourceConfig);

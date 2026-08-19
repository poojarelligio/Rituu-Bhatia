import { adminListAndCreate } from "@/lib/crud";
import { eventConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(eventConfig);

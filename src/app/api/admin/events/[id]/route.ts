import { adminGetUpdateDelete } from "@/lib/crud";
import { eventConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(eventConfig);

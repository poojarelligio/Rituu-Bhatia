import { adminGetUpdateDelete } from "@/lib/crud";
import { serviceConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(serviceConfig);

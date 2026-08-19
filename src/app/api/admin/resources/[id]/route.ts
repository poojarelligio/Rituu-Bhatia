import { adminGetUpdateDelete } from "@/lib/crud";
import { resourceConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(resourceConfig);

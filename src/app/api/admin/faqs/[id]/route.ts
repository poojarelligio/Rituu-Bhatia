import { adminGetUpdateDelete } from "@/lib/crud";
import { faqConfig } from "@/lib/entityConfigs";

export const { GET, PUT, DELETE } = adminGetUpdateDelete(faqConfig);

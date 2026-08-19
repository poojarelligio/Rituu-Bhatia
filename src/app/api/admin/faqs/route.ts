import { adminListAndCreate } from "@/lib/crud";
import { faqConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(faqConfig);

import { publicList } from "@/lib/crud";
import { eventConfig } from "@/lib/entityConfigs";

export const { GET } = publicList({ ...eventConfig, columns: eventConfig.publicColumns });

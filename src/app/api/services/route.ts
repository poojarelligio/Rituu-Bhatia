import { publicList } from "@/lib/crud";
import { serviceConfig } from "@/lib/entityConfigs";

export const { GET } = publicList({ ...serviceConfig, columns: serviceConfig.publicColumns });

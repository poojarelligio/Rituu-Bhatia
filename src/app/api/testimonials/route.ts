import { publicList } from "@/lib/crud";
import { testimonialConfig } from "@/lib/entityConfigs";

export const { GET } = publicList(testimonialConfig);

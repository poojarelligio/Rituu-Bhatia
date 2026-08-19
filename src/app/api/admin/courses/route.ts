// src/app/api/admin/courses/route.ts
import { adminListAndCreate } from "@/lib/crud";
import { courseConfig } from "@/lib/entityConfigs";

export const { GET, POST } = adminListAndCreate(courseConfig);
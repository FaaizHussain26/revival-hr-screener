export interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillRequest {
  name: string;
  description?: string;
  category?: string;
}

export interface SkillsResponse {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
}

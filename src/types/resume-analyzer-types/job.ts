export interface Job {
  id: string;
  title: string;
  experience: string;
  skills: string[];
  summary: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  experience: string;
  skills: string[];
  summary: string;
  description: string;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

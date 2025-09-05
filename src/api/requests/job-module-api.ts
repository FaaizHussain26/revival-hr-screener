import axiosInstance from "../axiosInstance";

export interface QueryParams {
  search?: string;
  page?: number;
  limit?: number;
  isDeleted?: boolean;
  matchScoreMin?: number | null;
  matchScoreMax?: number | null;
  summaryMatched?: boolean | null;
  title?: string;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary: string;
  description: string;
  requirements: string;
  skills: string[];
  responsibilities: string;
  isActive: boolean;
  deletedAt: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  embedding: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
  pagination: {
    total?: number;
    current_page?: number;
    last_page?: number;
    per_page?: number;
  };
}

export interface Skill {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SkillsResponse {
  success: boolean;
  message: string;
  data: Skill[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const jobsApi = {
  // GET /api/v1/jobs
  getJobs: async (params: QueryParams): Promise<JobsResponse> => {
    const { data } = await axiosInstance.get("/jobs", { params });
    return data;
  },

  // GET /api/v1/jobs/{id}
  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (
    jobData: Omit<
      Job,
      | "_id"
      | "createdAt"
      | "updatedAt"
      | "__v"
      | "embedding"
      | "isActive"
      | "deletedAt"
    >
  ): Promise<ApiResponse<Job>> => {
    const response = await axiosInstance.post("/jobs", jobData);
    return response.data;
  },

  updateJob: async (
    id: string,
    jobData: Partial<Job>
  ): Promise<ApiResponse<Job>> => {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  },

  restoreJob: async (id: string): Promise<ApiResponse<Job>> => {
    const response = await axiosInstance.put(`/jobs/restore/${id}`);
    return response.data;
  },
};

// Skills API
export const skillsApi = {
  getSkills: async (search?: string): Promise<SkillsResponse> => {
    const response = await axiosInstance.get("/skills", {
      params: { search },
    });
    return response.data;
  },

  createSkill: async (name: string): Promise<ApiResponse<Skill>> => {
    const response = await axiosInstance.post("/skills", { name });
    return response.data;
  },
};

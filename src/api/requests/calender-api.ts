import { ShortListedCandidate } from "@/components/shortlisted-candidates-page";
import axiosInstance from "../axiosInstance";

export interface Interview {
  _id: string;
  candidate: ShortListedCandidate;
  scheduledAt: string;
  duration: number;
  type: "hr" | "clinical" | "administration/leadership";
  interviewer: string[];
  location: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateInterviewData {
  candidate: string;
  scheduledAt: string;
  duration: number;
  type: "hr" | "clinical" | "administration/leadership";
  interviewer: string[];
  location: string;
  status?: "cancelled" | "rescheduled";
  notes?: string;
}

export interface InterviewsResponse {
  success: boolean;
  message: string;
  data: Interview[];
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface InterviewQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  date?: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  experience?: string;
  skills?: string[];
  resume?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  position?: string;
  status?: string;
}

export interface UpdateInterviewData {
  scheduledAt?: string;
  duration?: number;
  type?: "hr" | "clinical" | "administration/leadership" | undefined;
  interviewer?: string[];
  location?: string;
  status?: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
}

export const interviewsApi = {
  // GET /api/v1/interviews
  getAllInterviews: async (
    params?: InterviewQueryParams
  ): Promise<InterviewsResponse> => {
    const { data } = await axiosInstance.get("/interviews/all", { params });
    return data;
  },

  getTodaysInterviews: async (
    params?: InterviewQueryParams
  ): Promise<InterviewsResponse> => {
    const { data } = await axiosInstance.get("/interviews/today", { params });
    return data;
  },

  // GET /api/v1/interviews/{id}
  getInterviewById: async (id: string): Promise<ApiResponse<Interview>> => {
    const response = await axiosInstance.get(`/interviews/${id}`);
    return response.data;
  },

  // POST /api/v1/interviews
  createInterview: async (
    interviewData: CreateInterviewData
  ): Promise<ApiResponse<Interview>> => {
    const response = await axiosInstance.post("/interviews", interviewData);
    return response.data;
  },

  // PUT /api/v1/interviews/{id}
  updateInterview: async (
    id: string,
    interviewData: UpdateInterviewData
  ): Promise<ApiResponse<Interview>> => {
    const response = await axiosInstance.put(
      `/interviews/${id}`,
      interviewData
    );
    return response.data;
  },

  // DELETE /api/v1/interviews/{id}
  deleteInterview: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/interviews/${id}`);
    return response.data;
  },

  // GET /api/v1/interviews/today
  getTodayInterviews: async (): Promise<InterviewsResponse> => {
    const response = await axiosInstance.get("/interviews/today");
    return response.data;
  },

  // GET /api/v1/interviews/upcoming
  getUpcomingInterviews: async (): Promise<InterviewsResponse> => {
    const response = await axiosInstance.get("/interviews/upcoming");
    return response.data;
  },

  // GET /api/v1/candidates
  getCandidates: async (
    params?: CandidateQueryParams
  ): Promise<ApiResponse<Candidate[]>> => {
    const response = await axiosInstance.get("/candidates", { params });
    return response.data;
  },

  // GET /api/v1/candidates/{id}
  getCandidateById: async (id: string): Promise<ApiResponse<Candidate>> => {
    const response = await axiosInstance.get(`/candidates/${id}`);
    return response.data;
  },
};

export const getAllInterviews = interviewsApi.getAllInterviews;
export const createInterview = interviewsApi.createInterview;
export const updateInterview = interviewsApi.updateInterview;
export const deleteInterview = interviewsApi.deleteInterview;
export const getTodaysInterviews = interviewsApi.getTodaysInterviews;
export const getCandidates = interviewsApi.getCandidates;
export const getCandidateById = interviewsApi.getCandidateById;

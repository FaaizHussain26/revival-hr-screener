import type { CandidateData } from "@/types/resume-analyzer-types/candidate";
import axiosInstance from "../axiosInstance";

export interface ResumeAnalysisRequest {
  file: File;
  job_id: string;
}

export interface ResumeAnalysisResponse {
  success: boolean;
  data: CandidateData;
  message?: string;
}

export const analyzeResume = async ({
  file,
  job_id,
}: ResumeAnalysisRequest): Promise<ResumeAnalysisResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_id", job_id);

  const response = await axiosInstance.post<ResumeAnalysisResponse>(
    "/resume-analyzer",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Optional: Add progress tracking
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      },
    }
  );

  return response.data;
};

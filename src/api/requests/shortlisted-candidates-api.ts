import axiosInstance from "../axiosInstance";

export interface QueryParams {
  search?: string;
  page?: number;
  applicant_name?: string;
  job_applied_for?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  isDeleted?: boolean;
  matchScoreMin?: number | null;
  matchScoreMax?: number | null;
  summaryMatched?: boolean | null;
  title?: string;
}

export const getShortListedCandidates = async (params: QueryParams) => {
  const response = await axiosInstance.get("/shortlisted-candidates", {
    params,
  });
  return response.data;
};

export const deleteShortListedCandidate = async (itemId: string) => {
  const response = await axiosInstance.delete(
    `/shortlisted-candidates/${itemId}`
  );
  return response.data;
};

export const getUserWithJobs = async () => {
  const response = await axiosInstance.get(
    "/shortlisted-candidates/users-with-jobs"
  );
  return response.data;
};

export const restoreUser = async (id: string) => {
  const response = await axiosInstance.put(
    `/shortlisted-candidates/restore/${id}`
  );
  return response.data;
};

import { Job, jobsApi } from "@/api/requests/job-module-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

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

// Fetch jobs
export const useJobs = (params: QueryParams) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => jobsApi.getJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Fetch single job
export const useJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(data.message || "Job created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create job"
      );
    },
  });
};

// Update job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      jobsApi.updateJob(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      toast.success(data.message || "Job updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update job"
      );
    },
  });
};

// Delete job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.deleteJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(data.message || "Job deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
    },
  });
};

// Restore job
export const useRestoreJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.restoreJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(data.message || "Job restored successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to restore job"
      );
    },
  });
};

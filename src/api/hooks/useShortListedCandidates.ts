import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteShortListedCandidate,
  getShortListedCandidates,
  QueryParams,
  restoreUser,
} from "../requests/shortlisted-candidates-api";
import { toast } from "sonner";

export const useShortListedCandidates = (params: QueryParams) => {
  return useQuery({
    queryKey: ["short-listed-candidates", params],
    queryFn: () => getShortListedCandidates(params),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId: string) =>
      deleteShortListedCandidate(candidateId),
    onSuccess: () => {
      // Invalidate to trigger re-fetch of candidates list
      queryClient.invalidateQueries({ queryKey: ["short-listed-candidates"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
    },
  });
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["short-listed-candidates"] });
      toast.success(data.message || "Candidate restored successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to restore job"
      );
    },
  });
};

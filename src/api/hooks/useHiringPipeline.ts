"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidatesWithStatus,
  PipelineStage,
  updateCandidateStatus,
} from "../requests/hiring-pipeline-api";

export function useHiringPipeline() {
  const queryClient = useQueryClient();

  const {
    data: stages = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["hiring-pipeline-candidates"],
    queryFn: async () => {
      const response = await getCandidatesWithStatus();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    staleTime: 0,
  });

  const moveCandidateMutation = useMutation({
    mutationFn: async ({
      candidateId,
      toStatus,
    }: {
      candidateId: string;
      toStatus: string;
    }) => {
      return await updateCandidateStatus(candidateId, toStatus);
    },
    onMutate: async ({
      candidateId,
      fromStatus,
      toStatus,
    }: {
      candidateId: string;
      fromStatus: string;
      toStatus: string;
    }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["hiring-pipeline-candidates"],
      });

      // Snapshot previous value
      const previousStages = queryClient.getQueryData<PipelineStage[]>([
        "hiring-pipeline-candidates",
      ]);

      // Optimistically update
      queryClient.setQueryData<PipelineStage[]>(
        ["hiring-pipeline-candidates"],
        (old) => {
          if (!old) return [];
          // Only copy stages if mutation is possible
          const newStages = old.map((stage) => ({
            ...stage,
            data: [...stage.data],
          }));
          const fromStageIndex = newStages.findIndex(
            (stage) => stage._id === fromStatus
          );
          const toStageIndex = newStages.findIndex(
            (stage) => stage._id === toStatus
          );
          if (fromStageIndex === -1 || toStageIndex === -1) return old;
          const candidateIndex = newStages[fromStageIndex].data.findIndex(
            (c) => c._id === candidateId
          );
          if (candidateIndex === -1) return old;
          // Remove candidate from source stage
          const candidate = newStages[fromStageIndex].data[candidateIndex];
          newStages[fromStageIndex].data.splice(candidateIndex, 1);
          newStages[fromStageIndex].count -= 1;
          // Add candidate to destination stage with updated status
          const updatedCandidate = { ...candidate, status: toStatus };
          newStages[toStageIndex].data.push(updatedCandidate);
          newStages[toStageIndex].count += 1;
          return newStages;
        }
      );

      return { previousStages };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousStages) {
        queryClient.setQueryData(
          ["hiring-pipeline-candidates"],
          context.previousStages
        );
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency
      queryClient.refetchQueries({ queryKey: ["short-listed-candidates"] });
      queryClient.refetchQueries({ queryKey: ["hiring-pipeline-candidates"] });
    },
  });

  const moveCandidateToStatus = async (
    candidateId: string,
    fromStatus: string,
    toStatus: string
  ) => {
    return moveCandidateMutation.mutateAsync({
      candidateId,
      fromStatus,
      toStatus,
    });
  };

  return {
    stages,
    loading,
    error: error?.message || null,
    refetch,
    moveCandidateToStatus,
    isMoving: moveCandidateMutation.isPending,
  };
}

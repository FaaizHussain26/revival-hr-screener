import {
  Skill,
  skillsApi,
  SkillsResponse,
} from "@/api/requests/job-module-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSkills = (search?: string) => {
  return useQuery<Skill[], Error>({
    queryKey: ["skills", search],
    queryFn: async () => {
      const response: SkillsResponse = await skillsApi.getSkills(search);
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
// Create skill
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillsApi.createSkill,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(data.message || "Skill created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create skill"
      );
    },
  });
};

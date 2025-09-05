import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShortListedCandidate } from "../requests/shortlisted-candidates-api";
import { toast } from "sonner";

export const useDeleteShortListedCandidates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteShortListedCandidate(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlisted-candidates"] });
      toast.success("Candidate deleted");
    },
    onError: (error) => {
      console.error("Error deleting candidate", error);
      toast.error("Error deleting candidate");
    },
  });
};

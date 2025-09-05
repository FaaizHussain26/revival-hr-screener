import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../requests/users-api";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

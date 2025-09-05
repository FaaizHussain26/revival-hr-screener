import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../requests/update-settings-api";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      updatePassword(data),
  });
};

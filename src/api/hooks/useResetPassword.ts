import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../requests/auth-api";
import { ResetPasswordFormData } from "@/utils/validations/reset-password-schema";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => resetPassword(data),
  });
};

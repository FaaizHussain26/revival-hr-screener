import { ForgotPasswordData } from "@/utils/validations/forget-password-schema";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../requests/auth-api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => forgotPassword(data),
  });
};

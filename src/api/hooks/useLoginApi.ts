import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../requests/login-api";
import { LoginFormData } from "@/utils/validations/login-schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginFormData) => {
      const data = await loginApi(payload);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.accessToken);
      return data;
    },
  });
};

import { LoginFormData } from "@/utils/validations/login-schema";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: number | string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export const loginApi = async (
  data: LoginFormData
): Promise<LoginApiResponse["data"]> => {
  const response = await axios.post<LoginApiResponse>(
    `${apiBaseUrl}/auth/login`,
    data
  );
  console.log("Login API response:", response.data);
  return response.data.data;
};

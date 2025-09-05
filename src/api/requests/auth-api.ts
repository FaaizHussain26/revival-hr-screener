/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from "../axiosInstance";
import { ForgotPasswordData } from "@/utils/validations/forget-password-schema";
import { ResetPasswordFormData } from "@/utils/validations/reset-password-schema";
import { RegisterFormData } from "@/utils/validations/register-schema";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      address: string;
      isActive: boolean;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}
export const registerUser = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordFormData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};

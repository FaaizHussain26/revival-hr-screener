import axiosInstance from "../axiosInstance";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export const getUsers = async (params: UsersQueryParams) => {
  const response = await axiosInstance.get("/users", { params });
  console.log(response.data.data);
  return response.data.data;
};

export const getUserById = async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.data;
};

export interface UserCreateData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
}

export const createUser = async (data: UserCreateData) => {
  const response = await axiosInstance.post("/users", data);
  return response.data.data;
};

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UserUpdateData;
}) => {
  const response = await axiosInstance.patch(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data.data;
};

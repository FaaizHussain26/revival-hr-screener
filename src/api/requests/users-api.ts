import axiosInstance from "../axiosInstance";

interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const getUsers = async (
  params: UsersQueryParams
): Promise<UsersResponse> => {
  const response = await axiosInstance.get("/users", { params });
  console.log(response, "response");
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
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

export const createUser = async (data: UserCreateData): Promise<User> => {
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
}): Promise<User> => {
  const response = await axiosInstance.patch(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data.data;
};

export const restoreUser = async (
  id: string
): Promise<{ message: string; user: User }> => {
  const response = await axiosInstance.put(`/users/restore/${id}`);
  return response.data.data;
};

export const permanentDeleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/users/permanent-delete/${id}`);
  return response.data.data;
};

export const toggleUserStatus = async (
  id: string,
  isActive: boolean
): Promise<User> => {
  return updateUser({ id, data: { isActive } });
};

export const changeUserRole = async (
  id: string,
  role: string
): Promise<User> => {
  return updateUser({ id, data: { role } });
};

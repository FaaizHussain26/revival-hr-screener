import { deleteUser, getUsers } from "@/api/requests/users-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  title?: string;
  jobExperience?: string;
  skills?: string[];
}

export interface UsersResponse {
  results: User[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

// Fetch users
export const useUsers = (params: UsersQueryParams = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    },
  });
};

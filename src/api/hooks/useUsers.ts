import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../requests/users-api";

import { UsersQueryParams } from "../requests/users-api";

export const useUsers = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000,
  });
};

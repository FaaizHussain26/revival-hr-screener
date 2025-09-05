import { useQuery } from "@tanstack/react-query";
import { getUserWithJobs } from "../requests/shortlisted-candidates-api";

export const useGetUserWithJobs = () => {
    return useQuery({
        queryKey: ["users-with-jobs"],
        queryFn: () => getUserWithJobs(),
        staleTime: 5 * 60 * 1000,
    });
};

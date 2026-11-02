import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import axiosInstance from "../util/axios";

// whether the signed-in user is an admin (controlAdmin on the backend user)
export function useIsAdmin() {
  const { isSignedIn } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => axiosInstance.get("/users/me").then((res) => res.data),
    enabled: !!isSignedIn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { isAdmin: !!data?.controlAdmin, isLoading: !!isSignedIn && isLoading };
}

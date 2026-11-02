import { useQuery } from "@tanstack/react-query";
import { getSessionRecordings, getAllRecordings, getMyRecordings } from "../api/sessions";

export const useSessionRecordings = (sessionId) => {
  return useQuery({
    queryKey: ["session-recordings", sessionId],
    queryFn: () => getSessionRecordings(sessionId),
    enabled: !!sessionId,
    refetchInterval: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMyRecordings = () => {
  return useQuery({
    queryKey: ["my-recordings"],
    queryFn: getMyRecordings,
    refetchInterval: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAllRecordings = () => {
  return useQuery({
    queryKey: ["all-recordings"],
    queryFn: getAllRecordings,
    refetchInterval: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

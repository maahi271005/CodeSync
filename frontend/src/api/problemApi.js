import axiosInstance from "../util/axios";

export const problemApi = {
  createProblem: (data) =>
    axiosInstance.post("/problems", data).then(res => res.data),

  getProblems: () =>
    axiosInstance.get("/problems").then(res => res.data),

  getProblemBySlug: (slug) =>
    axiosInstance.get(`/problems/${slug}`).then(res => res.data),

  // judged on the server against hidden test cases
  runProblem: ({ slug, code }) =>
    axiosInstance.post(`/problems/${slug}/run`, { code }).then(res => res.data),
};

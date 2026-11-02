import Problem from "../models/Problem.js";
import { gradeSubmission } from "../util/judge/gradeSubmission.js";

/* CREATE PROBLEM */
export async function createProblem(req, res) {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    console.error("Create problem error:", err);
    res.status(400).json({ message: err.message });
  }
}

/* GET ALL PROBLEMS (NO TEST CASES) */
export async function getAllProblems(req, res) {
  try {
    const problems = await Problem.find().select("-testCases");
    res.status(200).json(problems);
  } catch (err) {
    console.error("Fetch problems error:", err);
    res.status(500).json({ message: "Failed to fetch problems" });
  }
}

/* GET SINGLE PROBLEM (NO TEST CASES - they stay on the server for judging) */
export async function getProblemBySlug(req, res) {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch problem" });
  }
}

/* RUN CODE AGAINST HIDDEN TEST CASES */
export async function runProblem(req, res) {
  try {
    const { code } = req.body;
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }
    if (code.length > 50000) {
      return res.status(400).json({ message: "Code is too long" });
    }

    const problem = await Problem.findOne({ slug: req.params.slug }).select("+testCases");
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json(await gradeSubmission(problem, code));
  } catch (err) {
    console.error("Run problem error:", err);
    res.status(500).json({ message: "Failed to run code" });
  }
}

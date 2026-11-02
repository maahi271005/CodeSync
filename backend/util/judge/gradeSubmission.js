import { generateCppJudge } from "./judge.js";
import { runCpp } from "./codeRunner.js";

// Test case outputs are stored either pre-formatted exactly as the judge prints them
// (e.g. "[0,1]", "\"abc\"", "true") or as raw JSON values ([0,1], "abc", true).
// The judge prints with no spaces, matching JSON.stringify, so accept either form.
export function matchesExpected(actual, expected) {
  return actual === String(expected).trim() || actual === JSON.stringify(expected);
}

// Runs user code against the problem's hidden test cases.
// Never returns test inputs or expected outputs - only pass/fail per test.
// `run` is injectable so tests can compile locally instead of calling the executor.
export async function gradeSubmission(problem, userCode, run = runCpp) {
  const total = problem.testCases.length;

  let source;
  try {
    source = generateCppJudge(problem, userCode);
  } catch (error) {
    return { status: "error", passedCount: 0, total, results: [], error: `Judge setup failed: ${error.message}` };
  }

  const result = await run(source);

  if (!result.ok && result.kind !== "runtime_error" && result.kind !== "timeout") {
    return { status: result.kind, passedCount: 0, total, results: [], error: result.error };
  }

  const stdout = (result.stdout || "").trim();
  const lines = stdout ? stdout.split("\n").map((line) => line.trim()) : [];
  const passedFlags = problem.testCases.map(
    (tc, i) => i < lines.length && lines[i] !== "" && matchesExpected(lines[i], tc.output)
  );
  const firstFailedIndex = passedFlags.indexOf(false);
  const results = passedFlags.map((passed, i) => describeTest(problem, i, passed, firstFailedIndex, lines));
  const passedCount = passedFlags.filter(Boolean).length;

  // a crash/timeout part-way still reports which tests passed before it
  if (!result.ok) {
    return { status: result.kind, passedCount, total, results, firstFailedIndex, error: result.error };
  }

  // extra lines mean the user printed debug output, which shifts every result
  const allPassed = passedCount === total && lines.length === total;

  return {
    status: allPassed ? "accepted" : "wrong_answer",
    passedCount,
    total,
    results,
    firstFailedIndex,
    error: !allPassed && lines.length !== total
      ? `Expected ${total} result line(s) but got ${lines.length}. Remove any cout/printf debug output.`
      : undefined,
  };
}

// Like LeetCode: details (input, expected, actual) are revealed for passed tests - the user's code
// already produces those answers - and for the first failing test so it can be debugged.
// Later failing tests stay hidden so their expected answers can't be harvested.
function describeTest(problem, index, passed, firstFailedIndex, lines) {
  if (!passed && index !== firstFailedIndex) return { passed, hidden: true };

  const testCase = problem.testCases[index];

  return {
    passed,
    input: problem.parameters
      .map((param, i) => `${param.name} = ${JSON.stringify(testCase.input[i])}`)
      .join(", "),
    expected: typeof testCase.output === "string" ? testCase.output : JSON.stringify(testCase.output),
    // null when the program crashed or timed out before reaching this test
    actual: index < lines.length ? lines[index] : null,
  };
}

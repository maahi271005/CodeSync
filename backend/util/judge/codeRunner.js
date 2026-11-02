import { ENV } from "../../env.js";

// Runs a complete C++ program and returns a normalized result:
// { ok, stdout, error, kind } where kind is "compile_error" | "runtime_error" | "timeout" | "executor_error" on failure.
// Uses Piston when PISTON_API is set, otherwise Judge0 when JUDGE0_API_KEY (or JUDGE0_URL) is set.

const JUDGE0_DEFAULT_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_CPP_LANGUAGE_ID = 54; // C++ (GCC 9.2.0)

export function getExecutorName() {
  if (ENV.PISTON_API) return "piston";
  if (ENV.JUDGE0_API_KEY || ENV.JUDGE0_URL) return "judge0";
  return null;
}

export async function runCpp(source) {
  const executor = getExecutorName();

  if (!executor) {
    return {
      ok: false,
      kind: "executor_error",
      error: "Code execution is not configured. Set PISTON_API or JUDGE0_API_KEY in backend/.env.",
    };
  }

  try {
    return executor === "piston" ? await runWithPiston(source) : await runWithJudge0(source);
  } catch (error) {
    console.log(`Error running code with ${executor}:`, error.message);
    return { ok: false, kind: "executor_error", error: "Code execution service is unavailable. Try again." };
  }
}

async function runWithPiston(source) {
  const response = await fetch(`${ENV.PISTON_API.replace(/\/$/, "")}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "c++",
      version: "*",
      files: [{ name: "main.cpp", content: source }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Piston responded ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  if (data.compile && data.compile.code !== 0) {
    return { ok: false, kind: "compile_error", error: data.compile.stderr || data.compile.output };
  }

  const run = data.run || {};
  if (run.signal === "SIGKILL") {
    return { ok: false, kind: "timeout", stdout: run.stdout || "", error: "Time limit exceeded" };
  }
  if (run.code !== 0 || run.stderr) {
    return { ok: false, kind: "runtime_error", stdout: run.stdout || "", error: run.stderr || `Exited with code ${run.code}` };
  }

  return { ok: true, stdout: run.stdout || "" };
}

async function runWithJudge0(source) {
  const baseUrl = (ENV.JUDGE0_URL || JUDGE0_DEFAULT_URL).replace(/\/$/, "");
  const headers = { "Content-Type": "application/json" };

  // RapidAPI-hosted Judge0 needs its key headers; a self-hosted JUDGE0_URL usually doesn't
  if (ENV.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = ENV.JUDGE0_API_KEY;
    headers["X-RapidAPI-Host"] = new URL(baseUrl).host;
  }

  const response = await fetch(`${baseUrl}/submissions?base64_encoded=true&wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      language_id: JUDGE0_CPP_LANGUAGE_ID,
      source_code: toBase64(source),
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge0 responded ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const stdout = fromBase64(data.stdout);
  const statusId = data.status?.id;

  // https://ce.judge0.com/#statuses-and-languages-status-get
  if (statusId === 6) return { ok: false, kind: "compile_error", error: fromBase64(data.compile_output) };
  if (statusId === 5) return { ok: false, kind: "timeout", stdout, error: "Time limit exceeded" };
  if (statusId !== 3) {
    return {
      ok: false,
      kind: statusId >= 7 && statusId <= 12 ? "runtime_error" : "executor_error",
      stdout,
      error: fromBase64(data.stderr) || data.status?.description || "Execution failed",
    };
  }

  return { ok: true, stdout };
}

const toBase64 = (text) => Buffer.from(text, "utf8").toString("base64");
const fromBase64 = (text) => (text ? Buffer.from(text, "base64").toString("utf8") : "");

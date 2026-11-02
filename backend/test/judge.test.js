import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { SEED_PROBLEMS } from "../data/seedProblems.js";
import { gradeSubmission, matchesExpected } from "../util/judge/gradeSubmission.js";
import { REFERENCE_SOLUTIONS } from "./referenceSolutions.js";

describe("matchesExpected", () => {
  test("accepts pre-formatted outputs", () => {
    assert.ok(matchesExpected("[0,1]", "[0,1]"));
    assert.ok(matchesExpected('"olleh"', '"olleh"'));
    assert.ok(matchesExpected("true", "true"));
    assert.ok(matchesExpected("5", "5"));
  });

  test("accepts raw JSON outputs", () => {
    assert.ok(matchesExpected("[0,1]", [0, 1]));
    assert.ok(matchesExpected("[[1,6],[8,10]]", [[1, 6], [8, 10]]));
    assert.ok(matchesExpected('"abc"', "abc"));
    assert.ok(matchesExpected("true", true));
    assert.ok(matchesExpected("5", 5));
  });

  test("rejects wrong outputs", () => {
    assert.ok(!matchesExpected("[1,0]", [0, 1]));
    assert.ok(!matchesExpected("abc", "abd"));
    assert.ok(!matchesExpected("false", true));
  });
});

// compile and run locally with g++ in place of Piston/Judge0
const hasGpp = spawnSync("g++", ["--version"]).status === 0;

function makeLocalRunner(dir) {
  let n = 0;
  return async (source) => {
    const src = join(dir, `prog${n}.cpp`);
    const exe = join(dir, `prog${n++}.exe`);
    writeFileSync(src, source);

    const compile = spawnSync("g++", ["-O1", "-o", exe, src], { encoding: "utf8" });
    if (compile.status !== 0) return { ok: false, kind: "compile_error", error: compile.stderr };

    try {
      return { ok: true, stdout: execFileSync(exe, { encoding: "utf8", timeout: 10000 }) };
    } catch (error) {
      return { ok: false, kind: "runtime_error", stdout: error.stdout || "", error: error.message };
    }
  };
}

describe("seed problems", { skip: !hasGpp && "g++ not installed" }, () => {
  const dir = mkdtempSync(join(tmpdir(), "codesync-judge-"));
  const run = makeLocalRunner(dir);

  for (const problem of SEED_PROBLEMS) {
    test(`${problem.slug}: reference solution is accepted`, async () => {
      const result = await gradeSubmission(problem, REFERENCE_SOLUTIONS[problem.slug], run);
      assert.equal(result.status, "accepted", JSON.stringify(result));
      assert.equal(result.passedCount, problem.testCases.length);
      assert.equal(result.firstFailedIndex, -1);
      assert.ok(result.results.every((r) => r.input && r.expected && !r.hidden));
    });

    test(`${problem.slug}: starter code compiles but is not accepted`, async () => {
      const result = await gradeSubmission(problem, problem.starterCode.cpp, run);
      assert.equal(result.status, "wrong_answer", JSON.stringify(result));

      // passed tests and the first failing test are revealed, later failures stay hidden
      const firstFailed = result.results.findIndex((r) => !r.passed);
      assert.equal(result.firstFailedIndex, firstFailed);
      result.results.forEach((r, i) => {
        if (r.passed || i === firstFailed) {
          assert.ok(r.input.startsWith(`${problem.parameters[0].name} = `));
          assert.ok(!r.hidden);
        } else {
          assert.deepEqual(r, { passed: false, hidden: true });
        }
      });
    });
  }

  test("syntax errors are reported as compile errors", async () => {
    const result = await gradeSubmission(SEED_PROBLEMS[0], "string reverseString(string s) { return s", run);
    assert.equal(result.status, "compile_error");
  });

  test("debug output is reported instead of silently failing", async () => {
    const code = 'string reverseString(string s) { cout << "debug" << endl; reverse(s.begin(), s.end()); return s; }';
    const result = await gradeSubmission(SEED_PROBLEMS[0], code, run);
    assert.equal(result.status, "wrong_answer");
    assert.match(result.error, /debug output/);
  });

  test.after(() => rmSync(dir, { recursive: true, force: true }));
});

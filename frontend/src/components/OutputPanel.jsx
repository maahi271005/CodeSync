import { useState } from "react";
import { CheckCircle2Icon, LockIcon, XCircleIcon } from "lucide-react";

const STATUS_LABELS = {
  accepted: { text: "Accepted", className: "text-success" },
  wrong_answer: { text: "Wrong Answer", className: "text-error" },
  compile_error: { text: "Compilation Error", className: "text-error" },
  runtime_error: { text: "Runtime Error", className: "text-error" },
  timeout: { text: "Time Limit Exceeded", className: "text-warning" },
  executor_error: { text: "Execution Unavailable", className: "text-warning" },
  error: { text: "Error", className: "text-error" },
};

// output: null | { status, passedCount, total, firstFailedIndex, error,
//   results: [{ passed, hidden?, input?, expected?, actual? }] }
// passed tests and the first failing test come with details; later failures are hidden
function OutputPanel({ output }) {
  // remember the clicked test per result object, so a new run resets the selection
  const [selection, setSelection] = useState({ output: null, index: 0 });
  const label = output && (STATUS_LABELS[output.status] || STATUS_LABELS.error);

  const defaultIndex = output?.firstFailedIndex >= 0 ? output.firstFailedIndex : 0;
  const selectedIndex = selection.output === output ? selection.index : defaultIndex;
  const selected = output?.results?.[selectedIndex];

  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {output === null ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <span className={`text-lg font-bold ${label.className}`}>{label.text}</span>
              {output.total > 0 && (
                <span className="text-sm text-base-content/60">
                  {output.passedCount}/{output.total} tests passed
                </span>
              )}
            </div>

            {output.results?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {output.results.map((result, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelection({ output, index: idx })}
                    className={`btn btn-xs gap-1 ${
                      result.passed ? "btn-success" : "btn-error"
                    } ${idx === selectedIndex ? "" : "btn-outline"}`}
                  >
                    {result.hidden ? (
                      <LockIcon className="size-3" />
                    ) : result.passed ? (
                      <CheckCircle2Icon className="size-3" />
                    ) : (
                      <XCircleIcon className="size-3" />
                    )}
                    Test {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {selected &&
              (selected.hidden ? (
                <div className="rounded-lg border border-base-300 bg-base-200 p-3 text-sm text-base-content/70 flex items-center gap-2">
                  <LockIcon className="size-4 shrink-0" />
                  Hidden test - fix Test {output.firstFailedIndex + 1} first to see more.
                </div>
              ) : (
                <div
                  className={`rounded-lg border bg-base-200 p-3 space-y-2 font-mono text-sm ${
                    selected.passed ? "border-success/30" : "border-error/30"
                  }`}
                >
                  <p className={`font-sans font-semibold ${selected.passed ? "text-success" : "text-error"}`}>
                    Test {selectedIndex + 1} {selected.passed ? "passed" : "failed"}
                  </p>
                  <div>
                    <p className="font-sans text-xs text-base-content/60 mb-1">Input</p>
                    <pre className="whitespace-pre-wrap break-all">{selected.input}</pre>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-base-content/60 mb-1">Expected</p>
                    <pre className="whitespace-pre-wrap break-all text-success">{selected.expected}</pre>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-base-content/60 mb-1">Your output</p>
                    <pre className={`whitespace-pre-wrap break-all ${selected.passed ? "text-success" : "text-error"}`}>
                      {selected.actual ?? "(no output - the program stopped before this test)"}
                    </pre>
                  </div>
                </div>
              ))}

            {output.error && (
              <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;

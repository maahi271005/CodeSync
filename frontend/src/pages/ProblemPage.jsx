import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/navbar.jsx";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

import { useProblem, useRunProblem } from "../hooks/useProblems";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id: slug } = useParams();
  const navigate = useNavigate();

  const { data: currentProblem, isLoading } = useProblem(slug);

  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const runProblemMutation = useRunProblem();
  const isRunning = runProblemMutation.isPending;

  /* -----------------------------
     Load starter code from DB
  ----------------------------- */
  useEffect(() => {
    if (!currentProblem) return;

    setCode(currentProblem.starterCode?.[selectedLanguage] || "");
    setOutput(null);
  }, [currentProblem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(currentProblem.starterCode?.[lang] || "");
    setOutput(null);
  };

  const handleProblemChange = (newSlug) => {
    navigate(`/problem/${newSlug}`);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  /* -----------------------------
     ✅ RESTART BUTTON HANDLER
  ----------------------------- */
  const handleResetCode = () => {
    const starterCode = currentProblem?.starterCode?.[selectedLanguage] || "";
    setCode(starterCode);
    setOutput(null);
  };

  /* -----------------------------
     RUN CODE AGAINST HIDDEN TEST CASES (judged on the server)
  ----------------------------- */
  const handleRunCode = () => {
    if (!currentProblem) return;

    setOutput(null);
    runProblemMutation.mutate(
      { slug, code },
      {
        onSuccess: (result) => {
          setOutput(result);
          if (result.status === "accepted") {
            triggerConfetti();
            toast.success("All tests passed!");
          } else if (result.status === "wrong_answer") {
            toast.error("Tests failed. Check your output.");
          } else {
            toast.error("Code execution failed");
          }
        },
        onError: (error) => {
          setOutput({ status: "error", error: error.response?.data?.message || "Failed to run code" });
          toast.error("Code execution failed");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading problem...</p>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Problem not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={slug}
              onProblemChange={handleProblemChange}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize" />

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onResetCode={handleResetCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />

              <Panel defaultSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;

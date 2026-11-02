import { createElement, useState } from "react";
import { useCreateProblem } from "../hooks/useProblems";
import toast from "react-hot-toast";
import Navbar from "../components/navbar";
import { FiSave, FiLayers, FiCode, FiCpu, FiMessageSquare, FiInfo, FiChevronRight } from "react-icons/fi";

function CreateProblem() {
  const { mutate, isPending: isLoading } = useCreateProblem();

  const [problem, setProblem] = useState({
    slug: "",
    title: "",
    difficulty: "Easy",
    category: "",
    description: { text: "", notes: [], constraints: [] },
    examples: [],
    functionName: "",
    parameters: [],
    returnType: { kind: "primitive", name: "int" },
    starterCode: { cpp: "" },
    testCases: [],
  });

  // JSON fields: parse errors are shown under the field and block submitting
  const [jsonErrors, setJsonErrors] = useState({});
  const JSON_DEFAULTS = {
    parameters: [],
    returnType: { kind: "primitive", name: "int" },
    examples: [],
    testCases: [],
  };

  const handleJsonChange = (field, value) => {
    if (!value.trim()) {
      setProblem((prev) => ({ ...prev, [field]: JSON_DEFAULTS[field] }));
      setJsonErrors((prev) => ({ ...prev, [field]: null }));
      return;
    }
    try {
      const parsed = JSON.parse(value);
      setProblem((prev) => ({ ...prev, [field]: parsed }));
      setJsonErrors((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      setJsonErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const JsonError = ({ field }) =>
    jsonErrors[field] ? <p className="text-error text-xs mt-2 px-1">Invalid JSON: {jsonErrors[field]}</p> : null;

  const handleSubmit = () => {
    if (!problem.slug || !problem.title || !problem.functionName) {
      toast.error("Required fields: Slug, Title, Function Name");
      return;
    }
    const invalidFields = Object.keys(jsonErrors).filter((field) => jsonErrors[field]);
    if (invalidFields.length) {
      toast.error(`Fix the invalid JSON in: ${invalidFields.join(", ")}`);
      return;
    }
    mutate(problem, {
      onSuccess: () => toast.success("Problem Published Successfully"),
      onError: (err) => toast.error(err.response?.data?.message || "Error"),
    });
  };

  // Enhanced Visible Label Component
  const FieldLabel = ({ icon, title, sub }) => (
    <div className="flex items-center gap-2 mb-3 px-1">
      <div className="text-primary bg-primary/10 p-1.5 rounded-md">
        {createElement(icon, { size: 14 })}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-widest text-base-content">
          {title}
        </span>
        {sub && <span className="text-[10px] text-base-content/50 font-medium italic">{sub}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 text-base-content selection:bg-primary/30 pb-20">
      <Navbar />

      <div className="max-w-[1500px] mx-auto p-6 lg:p-10">
        
        {/* TOP BAR ACTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-base-100 p-8 rounded-3xl border border-base-300 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <FiInfo size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Make your own problem</span>
            </div>
            <h1 className="text-4xl font-black text-base-content tracking-tighter italic uppercase flex items-center gap-3">
              Create <span className="text-base-content/50 font-light not-italic">Problem</span>
            </h1>
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-content disabled:opacity-60 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? "Syncing Logic..." : <><FiSave size={18} /> Add Problem</>}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* COLUMN 1: METADATA */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <section className="bg-base-100 p-7 rounded-[2.5rem] border border-base-300 shadow-xl">
              <h3 className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> 01. Identity
              </h3>
              
              <div className="space-y-6">
                <div>
                  <FieldLabel icon={FiLayers} title="Unique Slug" sub="Permanent URL identifier" />
                  <input className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/60 text-base-content transition-all shadow-inner" placeholder="Slug (unique, e.g. two-sum-custom)" onChange={(e) => setProblem({ ...problem, slug: e.target.value })} />
                </div>
                <div>
                  <FieldLabel icon={FiLayers} title="Problem Title" sub="User-facing display name" />
                  <input className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/60 text-base-content shadow-inner" placeholder="Title" onChange={(e) => setProblem({ ...problem, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel icon={FiLayers} title="Category" />
                    <input className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/60 text-base-content" placeholder="e.g. Arrays" onChange={(e) => setProblem({ ...problem, category: e.target.value })} />
                  </div>
                  <div>
                    <FieldLabel icon={FiLayers} title="Difficulty" />
                    <select className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/60 text-base-content cursor-pointer" onChange={(e) => setProblem({ ...problem, difficulty: e.target.value })}>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-base-100 p-7 rounded-[2.5rem] border border-base-300 shadow-xl">
              <h3 className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> 02. Signature
              </h3>
              <div className="space-y-6">
                <div>
                  <FieldLabel icon={FiCode} title="Function Name" sub="Entry point identifier" />
                  <input className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/60 font-mono text-base-content shadow-inner" placeholder="Function name (e.g. twoSum)" onChange={(e) => setProblem({ ...problem, functionName: e.target.value })} />
                </div>
                <div>
                  <FieldLabel icon={FiCode} title="Parameters" sub="Input Schema (JSON)" />
                  <textarea className={`w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 h-56 focus:outline-none focus:border-primary/60 font-mono text-[11px] text-base-content/80 leading-relaxed ${jsonErrors.parameters ? "border-error!" : ""}`} 
                    placeholder={`Parameters (JSON)\n[\n  {\n    "name": "nums",\n    "type": { "kind": "array", "element": { "kind": "primitive", "name": "int" } }\n  },\n  {\n    "name": "target",\n    "type": { "kind": "primitive", "name": "int" }\n  }\n]`} 
                    onChange={(e) => handleJsonChange("parameters", e.target.value)}
                  />
                  <JsonError field="parameters" />
                </div>
                <div>
                  <FieldLabel icon={FiCode} title="Return Type" sub="Output Schema (JSON)" />
                  <textarea className={`w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 h-28 focus:outline-none focus:border-primary/60 font-mono text-[11px] text-base-content/80 ${jsonErrors.returnType ? "border-error!" : ""}`} 
                    placeholder={`Return type (JSON)\n{ "kind": "primitive", "name": "int" }`} 
                    onChange={(e) => handleJsonChange("returnType", e.target.value)}
                  />
                  <JsonError field="returnType" />
                </div>
              </div>
            </section>
          </div>

          {/* COLUMN 2: DESCRIPTION */}
          <div className="col-span-12 lg:col-span-5">
            <section className="bg-base-100 p-8 rounded-[3rem] border border-base-300 shadow-xl h-full flex flex-col relative">
              <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-[0.03]">
              </div>
              <h3 className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> 03. Content
              </h3>
              
              <div className="space-y-8 flex-grow">
                <div>
                  <FieldLabel icon={FiMessageSquare} title="Problem Description" sub="Explain the challenge clearly" />
                  <textarea className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-3xl px-6 py-6 h-80 focus:outline-none focus:border-primary/60 text-base-content text-sm leading-relaxed" placeholder="Problem description" onChange={(e) => setProblem({ ...problem, description: { ...problem.description, text: e.target.value } })} />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FieldLabel icon={FiMessageSquare} title="Notes" sub="Hints or extra info" />
                    <textarea className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 h-32 focus:outline-none focus:border-primary/60 text-base-content/70 text-xs font-medium" placeholder="Notes (one per line)" onChange={(e) => setProblem({ ...problem, description: { ...problem.description, notes: e.target.value.split("\n").filter(Boolean) } })} />
                  </div>
                  <div>
                    <FieldLabel icon={FiMessageSquare} title="Constraints" sub="Time & Space boundaries" />
                    <textarea className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-5 py-4 h-32 focus:outline-none focus:border-primary/60 text-base-content/70 text-xs font-medium" placeholder="Constraints (one per line)" onChange={(e) => setProblem({ ...problem, description: { ...problem.description, constraints: e.target.value.split("\n").filter(Boolean) } })} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* COLUMN 3: VALIDATION */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
            <section className="bg-base-100 p-7 rounded-[2.5rem] border border-base-300 shadow-xl h-full">
              <h3 className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> 04. Validation
              </h3>
              <div className="space-y-6">
                <div>
                  <FieldLabel icon={FiCpu} title="Starter Code" sub="C++ Base Template" />
                  <textarea className="w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-4 py-4 h-40 focus:outline-none focus:border-primary/60 font-mono text-[10px] text-base-content/80" placeholder="C++ starter code" onChange={(e) => setProblem({ ...problem, starterCode: { cpp: e.target.value } })} />
                </div>
                <div>
                  <FieldLabel icon={FiCpu} title="Visible Examples" sub="Problem explanation JSON" />
                  <textarea className={`w-full bg-base-200 border border-base-300 placeholder:text-base-content/40 rounded-2xl px-4 py-4 h-64 focus:outline-none focus:border-primary/60 font-mono text-[10px] text-base-content/80 leading-normal ${jsonErrors.examples ? "border-error!" : ""}`} 
                    placeholder={`Examples (JSON)\n[\n  {\n    "input": "nums = [2,7,11,15], target = 9",\n    "output": "[0,1]",\n    "explanation": "Because nums[0] + nums[1] = 9"\n  }\n]`} 
                    onChange={(e) => handleJsonChange("examples", e.target.value)}
                  />
                  <JsonError field="examples" />
                </div>
                <div>
                  <FieldLabel icon={FiCpu} title="Internal Test Cases" sub="Hidden Judge Schema" />
                  <textarea className={`w-full bg-base-200 border-2 border-dashed border-primary/30 focus:border-primary/60 placeholder:text-base-content/40 rounded-2xl px-4 py-4 h-48 focus:outline-none font-mono text-[10px] text-base-content/80 ${jsonErrors.testCases ? "border-error!" : ""}`} 
                    placeholder={`Test cases (JSON)\n[\n  { "input": [[2,7,11,15], 9], "output": [0,1] }\n]`} 
                    onChange={(e) => handleJsonChange("testCases", e.target.value)}
                  />
                  <JsonError field="testCases" />
                </div>
              </div>
            </section>
          </div>

        </div>

        <div className="mt-12 text-center">
            <span className="text-base-content/30 text-[9px] font-black uppercase tracking-[0.8em]"></span>
        </div>
      </div>
    </div>
  );
}

export default CreateProblem;
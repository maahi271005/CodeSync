import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions.js";
import { useProblem, useRunProblem } from "../hooks/useProblems";
import toast from "react-hot-toast";
import Navbar from "../components/navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass, hasParticipant } from "../util/utils.js";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, UsersIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import confetti from "canvas-confetti";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [output, setOutput] = useState(null);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();
  const runProblemMutation = useRunProblem();
  const isRunning = runProblemMutation.isPending;

  const session = sessionData?.session;
  const { data: problemData } = useProblem(session?.problem);
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = Array.isArray(session?.participant)
    ? session.participant.some((p) => p?.clerkId === user?.id || p === user?.id)
    : session?.participant?.clerkId === user?.id || session?.participant === user?.id;
  const isMember = isHost || isParticipant;

  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [isSessionFull, setIsSessionFull] = useState(false);

  const [socket, setSocket] = useState(null);
  // set once we receive the partner's code, so the starter code doesn't overwrite it
  const hasSharedCode = useRef(false);
  const problemRef = useRef(problemData);
  problemRef.current = problemData;
  const joinAttempted = useRef(false);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const socketUrl = baseUrl.endsWith("/api") ? baseUrl.slice(0, -4) : baseUrl;
    // the server only accepts signed-in users; the token is re-fetched on every (re)connect
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      auth: (cb) => getToken().then((token) => cb({ token })),
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [getToken]);

  // join the room once we're a member (participants only become one after the join request),
  // and again after any reconnect
  useEffect(() => {
    if (!socket || !id || !isMember) return;

    const joinRoom = () => socket.emit("join-session", id);
    if (socket.connected) joinRoom();
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [socket, id, isMember]);

  const handleResetCode = () => {
    const starterCode = problemData?.starterCode?.[selectedLanguage] || "";
    setCode(starterCode);
    setOutput(null);

    socket?.emit("code-change", {
      sessionId: id,
      code: starterCode,
    });
  };

  useEffect(() => {
    if (!socket) return;

    // current code/language when joining late or after a refresh
    socket.on("session-state", ({ code: sharedCode, language }) => {
      if (language) setSelectedLanguage(language);
      if (typeof sharedCode === "string") {
        hasSharedCode.current = true;
        setCode(sharedCode);
      }
    });

    // monaco doesn't fire onChange for programmatic value updates, so these never echo back
    socket.on("code-update", (sharedCode) => {
      hasSharedCode.current = true;
      setCode(sharedCode);
    });

    socket.on("language-update", (lang) => {
      setSelectedLanguage(lang);
      setCode(problemRef.current?.starterCode?.[lang] || "");
      setOutput(null);
    });

    return () => {
      socket.off("session-state");
      socket.off("code-update");
      socket.off("language-update");
    };
  }, [socket]);

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );
  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  // auto-join session if user is not already a participant and not the host - only once,
  // since the session is refetched every 5s and a full session shouldn't be retried
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isMember || joinAttempted.current) return;

    joinAttempted.current = true;
    joinSessionMutation.mutate(id, {
      onSuccess: refetch,
      onError: (error) => {
        if (error.response?.status === 409) setIsSessionFull(true);
      },
    });

    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isMember, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // load starter code when the problem loads, unless the partner's code already arrived
  useEffect(() => {
    if (!problemData || hasSharedCode.current) return;
    setCode(problemData.starterCode?.[selectedLanguage] || "");
    setOutput(null);
    // only on problem load - language changes set their own starter code
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemData]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
    socket?.emit("language-change", {
      sessionId: id,
      language: newLang,
    });
  };

  // judged on the server against hidden test cases
  const handleRunCode = () => {
    if (!problemData) return;

    setOutput(null);
    runProblemMutation.mutate(
      { slug: session.problem, code },
      {
        onSuccess: (result) => {
          setOutput(result);
          if (result.status === "accepted") {
            triggerConfetti();
            toast.success("All tests passed!");
          } else if (result.status === "wrong_answer") {
            toast.error("Tests failed");
          } else {
            toast.error("Code execution failed");
          }
        },
        onError: (error) => {
          setOutput({ status: "error", error: error.response?.data?.message || "Failed to run code" });
          toast.error("Execution error");
        },
      }
    );
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  if (isSessionFull) {
    return (
      <div className="h-screen bg-base-300 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card bg-base-100 border-2 border-primary/20 shadow-xl max-w-md">
            <div className="card-body items-center text-center">
              <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mb-2">
                <UsersIcon className="w-10 h-10 text-warning" />
              </div>
              <h2 className="card-title text-2xl">Session is full</h2>
              <p className="text-base-content/70">
                This session already has two people. Ask the host for a new invite, or start your own session.
              </p>
              <Link to="/dashboard" className="btn btn-primary mt-2">
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {problemData?.title || session?.problemTitle || session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {hasParticipant(session) ? 2 : 1}/2 participants
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-lg ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty.slice(0, 1).toUpperCase() +
                            session?.difficulty.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-lg">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[70px]">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[70px]">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.description?.constraints?.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.description?.constraints?.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => {
                        setCode(value);
                        socket?.emit("code-change", {
                          sessionId: id,
                          code: value,
                        });
                      }}
                      onRunCode={handleRunCode}
                      onResetCode={handleResetCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI
                        chatClient={chatClient}
                        channel={channel}
                        inviteLink={`${window.location.origin}/session/${id}`}
                        problemTitle={problemData?.title || session?.problemTitle || session?.problem}
                      />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;

import { useEffect, useRef, useState } from "react";
import { COMMANDS, DEMOS, HELP_LINES, JOKES, QUIZ_QUESTIONS, WELCOME_LINES } from "../data/terminalContent";
import MatrixRain from "./MatrixRain";

const LINE_STYLES = {
  input: "text-emerald-400",
  success: "text-emerald-300 font-semibold",
  error: "text-red-400",
  muted: "text-emerald-700",
  text: "text-emerald-300/80",
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Interactive fake terminal on the home page: demos, a DSA quiz, jokes and a few easter eggs
function HomeTerminal() {
  const [lines, setLines] = useState(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // { question, score, asked } while a quiz question is waiting for an answer
  const [quiz, setQuiz] = useState(null);
  const [showMatrix, setShowMatrix] = useState(false);

  const timeouts = useRef([]);
  const body = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  // keep the newest line in view - scrolls only the terminal box, never the page
  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [lines]);

  const print = (...newLines) => setLines((prev) => [...prev, ...newLines]);
  const text = (content, type = "text") => ({ type, content });

  // animated output prints line by line; input is paused while it plays
  const playLines = (playback, delay) => {
    setIsAnimating(true);
    playback.forEach((line, i) => {
      timeouts.current.push(
        setTimeout(() => {
          print(line);
          if (i === playback.length - 1) setIsAnimating(false);
        }, (i + 1) * delay)
      );
    });
  };

  const askQuestion = (score = 0, asked = 0) => {
    const question = pick(QUIZ_QUESTIONS);
    setQuiz({ question, score, asked });
    print(
      text(`Q${asked + 1}. ${question.question}`, "success"),
      ...question.options.map((option, i) => text(`  ${"abcd"[i]}) ${option}`)),
      text("Answer a/b/c/d - or 'q' to stop", "muted")
    );
  };

  const answerQuestion = (answer) => {
    const { question, score, asked } = quiz;

    if (answer === "q" || answer === "quit") {
      setQuiz(null);
      print(text(`Quiz over - you scored ${score}/${asked}. ${score === asked && asked > 0 ? "Flawless! 🏆" : "Keep practicing 💪"}`, "success"));
      return;
    }

    const choice = "abcd".indexOf(answer);
    if (choice === -1 || answer.length !== 1) {
      print(text("Type a, b, c or d (or 'q' to stop)", "error"));
      return;
    }

    const correct = choice === question.answer;
    print(
      correct
        ? text(`✓ Correct! ${question.explanation}`, "success")
        : text(`✗ It's ${"abcd"[question.answer]}) ${question.options[question.answer]}. ${question.explanation}`, "error"),
      text(`Score: ${score + (correct ? 1 : 0)}/${asked + 1}`, "muted")
    );
    askQuestion(score + (correct ? 1 : 0), asked + 1);
  };

  const runCommand = (raw) => {
    const cmd = raw.toLowerCase();

    if (cmd === "clear") return setLines([]);
    if (cmd === "help") return print(...HELP_LINES);
    if (DEMOS[cmd]) return playLines(DEMOS[cmd], cmd === "code" ? 250 : 600);
    if (cmd === "quiz") return askQuestion();
    if (cmd === "joke") return print(text(pick(JOKES)));
    if (cmd === "matrix") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return print(text("Wake up, Neo... the code has you. 🐇", "success"));
      }
      setIsAnimating(true);
      return setShowMatrix(true);
    }
    if (cmd === "whoami") return print(text("guest - sign in to get a real username and start coding."));
    if (cmd === "ls") return print(text("problems/   sessions/   recordings/   secrets.txt"));
    if (cmd === "cat secrets.txt") return print(text("The real secret: solve one problem every day. 🤫", "success"));
    if (cmd === "about") return print(text("CodeSync v1.0 - Real-time Collaborative Coding Platform by Maahi Ratanpara"));
    if (["hi", "hello", "hey"].includes(cmd)) return print(text("Hey! 👋 Try 'quiz' to warm up before your next interview."));

    // easter eggs
    if (cmd.startsWith("sudo")) return print(text("Nice try. Root access is only granted after solving 3 Hard problems. 😏", "error"));
    if (cmd.startsWith("rm -rf")) {
      return playLines(
        [text("Deleting everything...", "error"), text("████████████ 100%", "error"), text("Just kidding. 😅 Your code is safe with us.", "success")],
        500
      );
    }
    if (cmd === "exit" || cmd === "quit") return print(text("There is no escape. Try 'connect' instead. 🚪"));
    if (cmd === "vim") return print(text("You entered vim. Nobody has ever left. (Hint: it's :q!)"), text(":q!", "muted"), text("...you escaped. Impressive. 🎉", "success"));

    print(text(`Command not found: ${cmd}. Try 'help'`, "error"));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      const next =
        e.key === "ArrowUp"
          ? Math.min(historyIndex + 1, history.length - 1)
          : Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : history[history.length - 1 - next]);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.trim().toLowerCase()) && input.trim());
      if (match) setInput(match);
      return;
    }

    if (e.key !== "Enter" || !input.trim() || isAnimating) return;

    const raw = input.trim();
    setInput("");
    setHistoryIndex(-1);
    setHistory((prev) => [...prev, raw]);
    print(text(`$ ${raw}`, "input"));

    if (quiz) answerQuestion(raw.toLowerCase());
    else runCommand(raw);
  };

  const placeholder = isAnimating ? "running..." : quiz ? "a / b / c / d" : "try 'quiz', 'joke' or 'help'...";

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">
        {showMatrix && (
          <MatrixRain
            onDone={() => {
              setShowMatrix(false);
              setIsAnimating(false);
              print(text("Wake up, Neo... the code has you. 🐇", "success"), text("Follow the white rabbit → try 'quiz'", "muted"));
              inputRef.current?.focus();
            }}
          />
        )}
        {/* MAC TERMINAL HEADER */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-emerald-500/20 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-emerald-400/70 font-mono mr-18">
              codesync-terminal{quiz ? ` - quiz · ${quiz.score}/${quiz.asked}` : ""}
            </p>
          </div>
        </div>

        {/* TERMINAL CONTENT - click anywhere to type */}
        <div
          ref={body}
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-6 font-mono text-xs sm:text-sm h-72 sm:h-96 overflow-y-auto bg-slate-950/50 cursor-text"
        >
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className={`whitespace-pre-wrap break-words ${LINE_STYLES[line.type] || LINE_STYLES.text}`}>
                {line.content}
              </div>
            ))}
          </div>

          {/* INPUT LINE */}
          <div className="flex items-center gap-2 mt-4 text-emerald-400">
            <span>{quiz ? "?" : "$"}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label="Terminal input"
              className="bg-transparent outline-none flex-1 min-w-0 caret-emerald-400 placeholder-emerald-700/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeTerminal;

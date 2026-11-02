// Content for the interactive terminal on the home page (components/HomeTerminal.jsx)

export const WELCOME_LINES = [
  { type: "text", content: "$ Welcome to CodeSync Terminal" },
  { type: "text", content: "$ Live video & audio calling" },
  { type: "text", content: "$ Real-time collaborative editor" },
  { type: "text", content: "$ Type 'help' for commands - or try 'quiz' 🎯" },
];

export const HELP_LINES = [
  { type: "text", content: "Commands:" },
  { type: "text", content: "  connect   watch a pair-coding session start" },
  { type: "text", content: "  code      watch a solution get accepted" },
  { type: "text", content: "  quiz      test your DSA knowledge" },
  { type: "text", content: "  joke      programmer humour" },
  { type: "text", content: "  matrix    take the red pill" },
  { type: "text", content: "  whoami · ls · about · clear" },
  { type: "muted", content: "  (↑/↓ history · Tab to autocomplete · some secrets are hidden)" },
];

export const DEMOS = {
  connect: [
    { type: "text", content: "Creating session for \"Two Sum\"..." },
    { type: "text", content: "Invite link copied → codesync/session/a1b2c3" },
    { type: "text", content: "Waiting for partner..." },
    { type: "success", content: "✓ Partner joined · video & audio connected" },
    { type: "success", content: "✓ Editor synced - you're coding together" },
  ],
  code: [
    { type: "text", content: "vector<int> twoSum(vector<int>& nums, int target) {" },
    { type: "text", content: "    unordered_map<int, int> seen;" },
    { type: "text", content: "    for (int i = 0; i < nums.size(); i++) {" },
    { type: "text", content: "        if (seen.count(target - nums[i])) return {seen[target - nums[i]], i};" },
    { type: "text", content: "        seen[nums[i]] = i;" },
    { type: "text", content: "    }" },
    { type: "text", content: "}" },
    { type: "text", content: "▶ Running 6 hidden tests..." },
    { type: "success", content: "✓ Accepted · 6/6 tests passed" },
  ],
};

export const QUIZ_QUESTIONS = [
  {
    question: "Time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
    explanation: "Each step halves the search space.",
  },
  {
    question: "Which data structure gives O(1) average lookup by key?",
    options: ["Linked list", "Binary search tree", "Hash map", "Stack"],
    answer: 2,
    explanation: "Hashing jumps straight to the bucket - O(1) on average.",
  },
  {
    question: "BFS on an unweighted graph finds...",
    options: ["A topological order", "Shortest paths by edge count", "Strongly connected components", "A minimum spanning tree"],
    answer: 1,
    explanation: "BFS explores in layers, so the first time it reaches a node is via the fewest edges.",
  },
  {
    question: "Which problem is the classic monotonic-stack pattern?",
    options: ["Two Sum", "Largest Rectangle in Histogram", "Reverse String", "Binary Search"],
    answer: 1,
    explanation: "The stack keeps increasing heights so each bar finds its boundaries in O(n) total.",
  },
  {
    question: "Worst-case time of quicksort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    answer: 2,
    explanation: "Bad pivots (e.g. already-sorted input with first-element pivot) give O(n²).",
  },
  {
    question: "A stack is...",
    options: ["FIFO", "LIFO", "Sorted", "Random access only"],
    answer: 1,
    explanation: "Last In, First Out - like a stack of plates.",
  },
  {
    question: "Dijkstra's algorithm fails with...",
    options: ["Cycles", "Negative edge weights", "Undirected graphs", "More than 1000 nodes"],
    answer: 1,
    explanation: "It assumes a settled node's distance never improves - negative edges break that. Use Bellman-Ford.",
  },
  {
    question: "Coin Change (fewest coins) is best solved with...",
    options: ["Greedy", "Dynamic programming", "Binary search", "Two pointers"],
    answer: 1,
    explanation: "Greedy fails for coins like [1,3,4] with amount 6; DP tries every sub-amount.",
  },
  {
    question: "Height of a balanced binary tree with n nodes?",
    options: ["O(n)", "O(√n)", "O(log n)", "O(1)"],
    answer: 2,
    explanation: "Each level doubles the node count, so height grows logarithmically.",
  },
  {
    question: "Sliding Window Maximum in O(n) uses a...",
    options: ["Min-heap", "Monotonic deque", "Hash set", "Trie"],
    answer: 1,
    explanation: "The deque keeps candidates in decreasing order; each index is pushed and popped once.",
  },
];

export const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: \"Can I join you?\"",
  "I'd tell you a UDP joke, but you might not get it.",
  "Why did the developer go broke? Because he used up all his cache. 💸",
  "!false - it's funny because it's true.",
  "How many programmers does it take to change a light bulb? None - that's a hardware problem.",
  "Interviewer: \"Reverse a linked list.\" Me: *turns the monitor upside down*",
  "My code doesn't have bugs. It has random undocumented features.",
  "Recursion: see 'recursion'.",
];

export const COMMANDS = ["help", "connect", "code", "quiz", "joke", "matrix", "whoami", "ls", "about", "clear"];

// Seed problems for the C++ judge (frontend/src/util/judge.js).
// Test case outputs are strings in the exact format the judge prints:
//   int -> 5, bool -> true, string -> "abc" (with quotes), vector -> [1,2] / [[1,2],[3,4]]

const int = { kind: "primitive", name: "int" };
const string = { kind: "primitive", name: "string" };
const bool = { kind: "primitive", name: "bool" };
const arrayOf = (element) => ({ kind: "array", element });

export const SEED_PROBLEMS = [
  /* ==================== EASY ==================== */
  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Given a string s, return the string with its characters in reverse order.",
      notes: ["Try doing it with two pointers instead of a library call."],
      constraints: ["0 ≤ s.length ≤ 10⁵", "s consists of printable ASCII characters"],
    },
    examples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "CodeSync"', output: '"cnySedoC"' },
    ],
    functionName: "reverseString",
    parameters: [{ name: "s", type: string }],
    returnType: string,
    starterCode: {
      cpp: `string reverseString(string s) {
    // Write your solution here
    return "";
}`,
    },
    testCases: [
      { input: ["hello"], output: '"olleh"' },
      { input: ["CodeSync"], output: '"cnySedoC"' },
      { input: ["a"], output: '"a"' },
      { input: [""], output: '""' },
      { input: ["racecar"], output: '"racecar"' },
      { input: ["ab cd"], output: '"dc ba"' },
    ],
  },
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
      notes: ["An empty string (after cleanup) is a palindrome."],
      constraints: ["1 ≤ s.length ≤ 2 × 10⁵", "s consists of printable ASCII characters"],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      { input: 's = "race a car"', output: "false" },
    ],
    functionName: "isPalindrome",
    parameters: [{ name: "s", type: string }],
    returnType: bool,
    starterCode: {
      cpp: `bool isPalindrome(string s) {
    // Write your solution here
    return false;
}`,
    },
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], output: "true" },
      { input: ["race a car"], output: "false" },
      { input: [" "], output: "true" },
      { input: ["0P"], output: "false" },
      { input: ["No 'x' in Nixon"], output: "true" },
      { input: ["ab_a"], output: "true" },
    ],
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array • Greedy",
    description: {
      text: "You are given an array prices where prices[i] is the price of a stock on day i. Choose one day to buy and a later day to sell. Return the maximum profit you can achieve. If no profit is possible, return 0.",
      notes: [],
      constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
    },
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price 1) and sell on day 5 (price 6), profit = 6 - 1 = 5.",
      },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only go down, so no profit." },
    ],
    functionName: "maxProfit",
    parameters: [{ name: "prices", type: arrayOf(int) }],
    returnType: int,
    starterCode: {
      cpp: `int maxProfit(vector<int>& prices) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], output: "5" },
      { input: [[7, 6, 4, 3, 1]], output: "0" },
      { input: [[1]], output: "0" },
      { input: [[2, 4, 1]], output: "2" },
      { input: [[3, 2, 6, 5, 0, 3]], output: "4" },
      { input: [[1, 2, 3, 4, 5]], output: "4" },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String • Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if every open bracket is closed by the same type of bracket, and brackets are closed in the correct order.",
      notes: [],
      constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
    },
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
      { input: 's = "([])"', output: "true" },
    ],
    functionName: "isValid",
    parameters: [{ name: "s", type: string }],
    returnType: bool,
    starterCode: {
      cpp: `bool isValid(string s) {
    // Write your solution here
    return false;
}`,
    },
    testCases: [
      { input: ["()"], output: "true" },
      { input: ["()[]{}"], output: "true" },
      { input: ["(]"], output: "false" },
      { input: ["([])"], output: "true" },
      { input: ["([)]"], output: "false" },
      { input: ["("], output: "false" },
      { input: ["]"], output: "false" },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Array • Binary Search",
    description: {
      text: "Given a sorted (ascending) array of distinct integers nums and an integer target, return the index of target in nums, or -1 if it does not exist.",
      notes: ["Your algorithm must run in O(log n) time."],
      constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All values in nums are unique"],
    },
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    functionName: "search",
    parameters: [
      { name: "nums", type: arrayOf(int) },
      { name: "target", type: int },
    ],
    returnType: int,
    starterCode: {
      cpp: `int search(vector<int>& nums, int target) {
    // Write your solution here
    return -1;
}`,
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], output: "4" },
      { input: [[-1, 0, 3, 5, 9, 12], 2], output: "-1" },
      { input: [[5], 5], output: "0" },
      { input: [[5], -5], output: "-1" },
      { input: [[1, 3, 5, 7, 9, 11, 13], 1], output: "0" },
      { input: [[1, 3, 5, 7, 9, 11, 13], 13], output: "6" },
    ],
  },

  /* ==================== MEDIUM ==================== */
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String • Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring that contains no repeating characters.",
      notes: [],
      constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s consists of English letters, digits, symbols and spaces"],
    },
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: "1" },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with length 3.' },
    ],
    functionName: "lengthOfLongestSubstring",
    parameters: [{ name: "s", type: string }],
    returnType: int,
    starterCode: {
      cpp: `int lengthOfLongestSubstring(string s) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      { input: ["abcabcbb"], output: "3" },
      { input: ["bbbbb"], output: "1" },
      { input: ["pwwkew"], output: "3" },
      { input: [""], output: "0" },
      { input: [" "], output: "1" },
      { input: ["dvdf"], output: "3" },
      { input: ["abba"], output: "2" },
    ],
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array • Prefix Sum",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      notes: ["You must solve it in O(n) time without using the division operation."],
      constraints: ["2 ≤ nums.length ≤ 10⁵", "-30 ≤ nums[i] ≤ 30", "Every product fits in a 32-bit integer"],
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    functionName: "productExceptSelf",
    parameters: [{ name: "nums", type: arrayOf(int) }],
    returnType: arrayOf(int),
    starterCode: {
      cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    // Write your solution here
    return {};
}`,
    },
    testCases: [
      { input: [[1, 2, 3, 4]], output: "[24,12,8,6]" },
      { input: [[-1, 1, 0, -3, 3]], output: "[0,0,9,0,0]" },
      { input: [[2, 3]], output: "[3,2]" },
      { input: [[0, 0]], output: "[0,0]" },
      { input: [[5, 1, 1, 1]], output: "[1,5,5,5]" },
    ],
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Matrix • DFS / BFS",
    description: {
      text: "Given an m x n grid of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent land cells horizontally or vertically.",
      notes: ["You may assume all four edges of the grid are surrounded by water."],
      constraints: ["1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
    },
    examples: [
      {
        input: 'grid = [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]',
        output: "3",
      },
      { input: 'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]', output: "1" },
    ],
    functionName: "numIslands",
    parameters: [{ name: "grid", type: arrayOf(arrayOf({ kind: "primitive", name: "char" })) }],
    returnType: int,
    starterCode: {
      cpp: `int numIslands(vector<vector<char>>& grid) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      {
        input: [[["1", "1", "0", "0"], ["1", "1", "0", "0"], ["0", "0", "1", "0"], ["0", "0", "0", "1"]]],
        output: "3",
      },
      { input: [[["1", "1", "1"], ["0", "1", "0"], ["1", "1", "1"]]], output: "1" },
      { input: [[["0"]]], output: "0" },
      { input: [[["1"]]], output: "1" },
      { input: [[["1", "0", "1", "0", "1"]]], output: "3" },
      { input: [[["1", "0"], ["0", "1"]]], output: "2" },
    ],
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "You are given coins of different denominations and a total amount. Return the fewest number of coins needed to make up that amount. If the amount cannot be made up by any combination of the coins, return -1.",
      notes: ["You have an infinite number of each kind of coin."],
      constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹ - 1", "0 ≤ amount ≤ 10⁴"],
    },
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
    ],
    functionName: "coinChange",
    parameters: [
      { name: "coins", type: arrayOf(int) },
      { name: "amount", type: int },
    ],
    returnType: int,
    starterCode: {
      cpp: `int coinChange(vector<int>& coins, int amount) {
    // Write your solution here
    return -1;
}`,
    },
    testCases: [
      { input: [[1, 2, 5], 11], output: "3" },
      { input: [[2], 3], output: "-1" },
      { input: [[1], 0], output: "0" },
      { input: [[1, 3, 4], 6], output: "2" },
      { input: [[2, 5, 10, 1], 27], output: "4" },
      { input: [[186, 419, 83, 408], 6249], output: "20" },
    ],
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array • Sorting",
    description: {
      text: "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return the non-overlapping intervals that cover all the intervals in the input, sorted by start.",
      notes: ["Intervals that touch (e.g. [1,4] and [4,5]) are considered overlapping."],
      constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ start ≤ end ≤ 10⁴"],
    },
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "[1,3] and [2,6] overlap, so they merge into [1,6].",
      },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    functionName: "merge",
    parameters: [{ name: "intervals", type: arrayOf(arrayOf(int)) }],
    returnType: arrayOf(arrayOf(int)),
    starterCode: {
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Write your solution here
    return {};
}`,
    },
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], output: "[[1,6],[8,10],[15,18]]" },
      { input: [[[1, 4], [4, 5]]], output: "[[1,5]]" },
      { input: [[[1, 4], [0, 4]]], output: "[[0,4]]" },
      { input: [[[1, 4], [2, 3]]], output: "[[1,4]]" },
      { input: [[[5, 7]]], output: "[[5,7]]" },
      { input: [[[6, 8], [1, 9], [2, 4], [4, 7]]], output: "[[1,9]]" },
    ],
  },

  /* ==================== HARD ==================== */
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array • Two Pointers",
    description: {
      text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      notes: [],
      constraints: ["1 ≤ height.length ≤ 2 × 10⁴", "0 ≤ height[i] ≤ 10⁵"],
    },
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    functionName: "trap",
    parameters: [{ name: "height", type: arrayOf(int) }],
    returnType: int,
    starterCode: {
      cpp: `int trap(vector<int>& height) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], output: "6" },
      { input: [[4, 2, 0, 3, 2, 5]], output: "9" },
      { input: [[1]], output: "0" },
      { input: [[3, 0, 3]], output: "3" },
      { input: [[1, 2, 3, 4, 5]], output: "0" },
      { input: [[5, 4, 1, 2]], output: "1" },
    ],
  },
  {
    slug: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    category: "String • Stack • Dynamic Programming",
    description: {
      text: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
      notes: [],
      constraints: ["0 ≤ s.length ≤ 3 × 10⁴", "s[i] is '(' or ')'"],
    },
    examples: [
      { input: 's = "(()"', output: "2", explanation: 'The longest valid substring is "()".' },
      { input: 's = ")()())"', output: "4", explanation: 'The longest valid substring is "()()".' },
      { input: 's = ""', output: "0" },
    ],
    functionName: "longestValidParentheses",
    parameters: [{ name: "s", type: string }],
    returnType: int,
    starterCode: {
      cpp: `int longestValidParentheses(string s) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      { input: ["(()"], output: "2" },
      { input: [")()())"], output: "4" },
      { input: [""], output: "0" },
      { input: ["()(())"], output: "6" },
      { input: ["()(()"], output: "2" },
      { input: ["))(("], output: "0" },
    ],
  },
  {
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. Allowed operations: insert a character, delete a character, or replace a character.",
      notes: [],
      constraints: ["0 ≤ word1.length, word2.length ≤ 500", "Both strings consist of lowercase English letters"],
    },
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: "horse → rorse (replace 'h') → rose (delete 'r') → ros (delete 'e')",
      },
      { input: 'word1 = "intention", word2 = "execution"', output: "5" },
    ],
    functionName: "minDistance",
    parameters: [
      { name: "word1", type: string },
      { name: "word2", type: string },
    ],
    returnType: int,
    starterCode: {
      cpp: `int minDistance(string word1, string word2) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      { input: ["horse", "ros"], output: "3" },
      { input: ["intention", "execution"], output: "5" },
      { input: ["", "abc"], output: "3" },
      { input: ["abc", ""], output: "3" },
      { input: ["same", "same"], output: "0" },
      { input: ["kitten", "sitting"], output: "3" },
    ],
  },
  {
    slug: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Array • Monotonic Stack",
    description: {
      text: "Given an array of integers heights representing a histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      notes: [],
      constraints: ["1 ≤ heights.length ≤ 10⁵", "0 ≤ heights[i] ≤ 10⁴"],
    },
    examples: [
      {
        input: "heights = [2,1,5,6,2,3]",
        output: "10",
        explanation: "The largest rectangle spans the bars of height 5 and 6, area = 5 × 2 = 10.",
      },
      { input: "heights = [2,4]", output: "4" },
    ],
    functionName: "largestRectangleArea",
    parameters: [{ name: "heights", type: arrayOf(int) }],
    returnType: int,
    starterCode: {
      cpp: `int largestRectangleArea(vector<int>& heights) {
    // Write your solution here
    return 0;
}`,
    },
    testCases: [
      { input: [[2, 1, 5, 6, 2, 3]], output: "10" },
      { input: [[2, 4]], output: "4" },
      { input: [[1]], output: "1" },
      { input: [[2, 2, 2, 2]], output: "8" },
      { input: [[6, 2, 5, 4, 5, 1, 6]], output: "12" },
      { input: [[0, 0]], output: "0" },
    ],
  },
  {
    slug: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    category: "Array • Monotonic Deque",
    description: {
      text: "You are given an array of integers nums and a sliding window of size k that moves from the very left of the array to the very right one position at a time. Return an array of the maximum value in each window.",
      notes: ["Aim for O(n) time."],
      constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "1 ≤ k ≤ nums.length"],
    },
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    functionName: "maxSlidingWindow",
    parameters: [
      { name: "nums", type: arrayOf(int) },
      { name: "k", type: int },
    ],
    returnType: arrayOf(int),
    starterCode: {
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    // Write your solution here
    return {};
}`,
    },
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], output: "[3,3,5,5,6,7]" },
      { input: [[1], 1], output: "[1]" },
      { input: [[9, 8, 7, 6], 2], output: "[9,8,7]" },
      { input: [[1, -1], 1], output: "[1,-1]" },
      { input: [[4, 2, 12, 3], 4], output: "[12]" },
    ],
  },
];

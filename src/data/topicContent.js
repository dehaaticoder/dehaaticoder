export const topicContent = {
  backtracking: {
    intro: `Backtracking is a recursive technique where you explore all possibilities and abandon ("backtrack") a path as soon as you know it can't lead to a valid solution.`,
    whyItWorks: `At every step you make a choice. If that choice leads to a dead end, you undo it and try the next option. This "try and undo" pattern is the heart of backtracking.`,
    teachingFlow: [
      { step: 'Concept',        desc: 'Try every path. Prune the bad ones early.' },
      { step: 'Intuition',      desc: 'Pick → Recurse → Unpick. Three steps, always.' },
      { step: 'Analogy',        desc: 'Searching for your buffalo in the jungle.' },
      { step: 'Template',       desc: 'Four patterns — pick the right one for the problem.' },
      { step: 'Problems',       desc: 'Subsets → Combinations → Permutations → N-Queens.' },
    ],
    keyInsight: 'Pick → Recurse → Unpick. But only when you are sharing one object across all calls. If each call gets its own copy — no unpick needed.',
    patternsTitle: 'The 4 Backtracking Patterns',
    patterns: [
      {
        name: 'Pattern 1 — For Loop',
        when: 'Choosing from remaining elements. Order matters.',
        whyThisPattern: 'You loop from current index to end. At each step you pick one element, go deeper, then remove it — so the next iteration of the loop can try the next element fresh.',
        unpick: true,
        whyUnpick: 'You are using one shared list. If you add [1] and go deep, when you come back the list still has [1] in it. The next loop iteration would see [1, 2] instead of just [2]. So you must remove it — that is the unpick.',
        examples: 'Subsets, Combinations, Permutations',
        code: `void backtrack(int i, List<Integer> current) {
    result.add(new ArrayList<>(current)); // snapshot at every node

    for (int j = i; j < nums.length; j++) {
        current.add(nums[j]);              // PICK
        backtrack(j + 1, current);         // RECURSE
        current.remove(current.size() - 1); // UNPICK — why? see below
    }
}

// WHY UNPICK?
// current is ONE list shared by ALL recursive calls.
// After going deep with nums[j], we must remove it
// so the next j can start fresh — not carry over nums[j].`,
      },
      {
        name: 'Pattern 2 — Two Explicit Calls (Pick / Not Pick)',
        when: 'Binary choice at each element — include it or skip it.',
        whyThisPattern: 'No loop. Just two branches at every index: one where you pick the element, one where you skip. Cleaner when the choice is always just yes/no.',
        unpick: true,
        whyUnpick: 'Same reason as Pattern 1 — one shared list. You add element, recurse, then remove it so the "not pick" branch sees the list without it.',
        examples: 'Subset Sum, Combination Sum',
        code: `void backtrack(int i, List<Integer> current) {
    if (i == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }

    // PICK
    current.add(nums[i]);
    backtrack(i + 1, current);
    current.remove(current.size() - 1); // UNPICK

    // NOT PICK — list is clean again because we unpicked above
    backtrack(i + 1, current);
}`,
      },
      {
        name: 'Pattern 3 — Grid / Constraint',
        when: '2D board problems. Placement with validity checks.',
        whyThisPattern: 'You place something on a board (queen, digit, character), check if it is valid, recurse to the next row/cell, then remove it. The board is shared — so you must undo the placement.',
        unpick: true,
        whyUnpick: 'The board is ONE shared 2D array. If you place a queen at (row=0, col=2) and go deep, when you come back you must remove it — otherwise the next column will see a queen already placed and give wrong results.',
        examples: 'N-Queens, Sudoku, Word Search, Maze',
        code: `void backtrack(int row) {
    if (row == n) {
        result.add(buildBoard()); // all queens placed
        return;
    }
    for (int col = 0; col < n; col++) {
        if (isValid(row, col)) {
            place(row, col);    // PICK — put queen on board
            backtrack(row + 1); // RECURSE — next row
            remove(row, col);   // UNPICK — take queen off board
        }
    }
}`,
      },
      {
        name: 'Pattern 4 — String / Immutable (No Unpick)',
        when: 'Building a string character by character.',
        whyThisPattern: 'Strings in Java are immutable — meaning you cannot change a string in place. When you write current + "(", it creates a BRAND NEW string. The original current is untouched. So when the recursive call returns, current is already back to what it was — automatically.',
        unpick: false,
        whyUnpick: 'No unpick needed. Each recursive call gets its OWN COPY of the string — not the shared one. Think of it like photocopying a sheet before making notes — the original is always clean.',
        examples: 'Generate Parentheses, Binary Tree Paths, Letter Combinations',
        code: `void backtrack(String current, int open, int close) {
    if (current.length() == 2 * n) {
        result.add(current);
        return;
    }

    if (open < n)
        backtrack(current + "(", open + 1, close);
        // current + "(" creates a NEW string — current is unchanged

    if (close < open)
        backtrack(current + ")", open, close + 1);
        // again a NEW string — no unpick needed
}

// WHY NO UNPICK?
// String is immutable in Java.
// current + "(" does NOT modify current.
// It creates a fresh string and passes it down.
// When that call returns, current is still the same.
// The work is already undone — automatically.`,
      },
    ],
    sharedVsOwnCopy: {
      title: 'Shared Object vs Own Copy — The Real Reason Behind Unpick',
      explanation: `This is the most important concept to understand in backtracking. Once you get this, you will never forget when to unpick and when not to.

SHARED OBJECT means: all recursive calls are looking at and modifying the SAME thing in memory.

Imagine you have one whiteboard in a room. Every person who walks in reads from and writes on that same whiteboard. If person A writes "hello" and walks out without erasing it, person B will see "hello" already written — even though person B never wrote it.

That is what happens with a List in Java. All recursive calls share one list. If call A adds element 5 and goes deeper, when it returns, element 5 is still there. The next call will see it unless you remove it — that is the unpick.

OWN COPY means: each recursive call gets its own fresh version.

Imagine instead of a whiteboard, you give each person a photocopy of the current sheet. They write on their copy. When they are done, they throw it away. The original is untouched.

That is what happens with String in Java. Strings cannot be changed. current + "(" does not write on the original current — it makes a photocopy with the extra character added. When that call finishes, the photocopy is gone. The original current is clean.

SIMPLE RULE:
- Using List, array, or board → SHARED → must unpick
- Using String or passing value → OWN COPY → no unpick needed`,
    },
    commonMistakes: [
      'Forgetting to unpick after recursion when using a shared List — causes all results to be wrong or empty',
      'Not copying the list before adding to result — result.add(current) adds a reference, not a snapshot. When current changes later, your stored result changes too',
      'Trying to unpick a String — String is immutable, unpick is not needed and will not work anyway',
      'Not defining the base case clearly — recursion runs forever',
      'Confusing index i (reuse allowed, pick stays at i) vs i+1 (no reuse, pick moves forward)',
    ],
    animations: [
      { file: 'subsets.html',                   title: 'Subsets — Pick / Not Pick' },
      { file: 'permutation_backtracking.html',   title: 'Permutations — Swap & Recurse' },
      { file: 'generate_parentheses.html',       title: 'Generate Parentheses' },
    ],
    problems: [
      // Recursion foundation
      { slug: 'staircase-paths',        title: 'Print All Staircase Paths',            difficulty: 'Easy',   lcNum: null },
      { slug: 'kth-symbol',             title: 'K-th Symbol in Grammar',               difficulty: 'Medium', lcNum: 779  },
      // Pick / Not Pick
      { slug: 'subsets',                title: 'Subsets',                              difficulty: 'Medium', lcNum: 78   },
      { slug: 'subset-sum-k',           title: 'Subset Sum Equal to K',                difficulty: 'Medium', lcNum: null },
      { slug: 'combination-sum',        title: 'Combination Sum I',                    difficulty: 'Medium', lcNum: 39   },
      { slug: 'combination-sum-2',      title: 'Combination Sum II',                   difficulty: 'Medium', lcNum: 40   },
      // Permutations / Arrangements
      { slug: 'permutations',           title: 'Permutations',                         difficulty: 'Medium', lcNum: 46   },
      { slug: 'letter-combinations',    title: 'Letter Combinations of Phone Number',  difficulty: 'Medium', lcNum: 17   },
      // String backtracking
      { slug: 'generate-parentheses',   title: 'Generate Parentheses',                 difficulty: 'Medium', lcNum: 22   },
      // Grid backtracking
      { slug: 'maze-paths',             title: 'Print All Maze Paths',                 difficulty: 'Medium', lcNum: null },
      { slug: 'shortest-path-maze',     title: 'Shortest Path in Binary Maze',         difficulty: 'Medium', lcNum: 1091 },
      { slug: 'word-search',            title: 'Word Search',                          difficulty: 'Medium', lcNum: 79   },
      // Hard
      { slug: 'n-queens',               title: 'N-Queens',                             difficulty: 'Hard',   lcNum: 51   },
    ],
  },

  dp: {
    intro: `Dynamic Programming is a technique to avoid solving the same subproblem twice. You solve it once, store the answer, and reuse it whenever needed. DP = Recursion + Memory.`,
    whyItWorks: `Every DP problem has two properties: Optimal Substructure (big answer built from smaller answers) and Overlapping Subproblems (same smaller problem appears multiple times). Storing the answer the first time makes every repeat lookup instant.`,
    teachingFlow: [
      { step: 'Mental Model',    desc: 'Decision → Remaining → Minimize or Count?' },
      { step: 'Brute Force',     desc: 'Write the plain recursion first. Get the recurrence.' },
      { step: 'Top Down',        desc: 'Add a dp[] cache to the recursion. Memoization.' },
      { step: 'Bottom Up',       desc: 'Fill dp[] iteratively from base case to answer.' },
      { step: 'Space Optimize',  desc: 'Keep only the last 1-2 values instead of full array.' },
    ],
    keyInsight: 'Ask 3 questions: What is my decision? What remains after that decision? Am I minimizing/maximizing or counting? If counting → add all choices. If minimizing → pick the best.',
    patternsTitle: 'The 4 DP Patterns',
    patterns: [
      {
        name: 'Pattern 1 — Fixed Choices',
        when: 'A small fixed set of choices at each step. You know exactly what the options are (e.g., take 1 or 2 stairs).',
        whyThisPattern: 'When choices are fixed and small, the recurrence writes itself: dp[i] = sum/min/max of dp[i - each choice]. No loop needed — just add the fixed number of terms.',
        keyRule: 'Counting → add all branches. Minimizing → min() of all branches. Maximizing → max(). The number of terms in the recurrence = number of fixed choices.',
        initTo: 'base values (0 or 1)',
        examples: 'Climbing Stairs, Fibonacci, Tribonacci, Min Cost Climbing Stairs',
        code: `// Counting: ways(n) = ways(n-1) + ways(n-2)
int dp[n+1];
dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];

// Minimizing with 2 fixed choices:
// dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`,
      },
      {
        name: 'Pattern 2 — Try All Choices (Loop in Recurrence)',
        when: 'You don\'t know which choice is best — must try ALL valid options at each step and take min/max over results.',
        whyThisPattern: 'Greedy fails when the locally best choice isn\'t globally best (n=12, greedy picks 9 → 4 squares, but 4+4+4 → 3 squares). So try every valid choice, recurse on remainder, take the best outcome.',
        keyRule: 'Always initialize dp[] to n+1 (or MAX_VALUE) when minimizing — NOT 0. Starting at 0 breaks Math.min() since min(0, anything) = 0 always.',
        initTo: 'n+1 (minimizing)',
        examples: 'Perfect Squares, Coin Change, Word Break, Minimum Path Sum',
        code: `// psquare(n) = 1 + min(psquare(n - x²)) for all x where x²≤n
int dp[] = new int[n+1];
Arrays.fill(dp, n+1);   // infinity — NOT 0
dp[0] = 0;
for (int i = 1; i <= n; i++)
    for (int x = 1; x*x <= i; x++)
        dp[i] = Math.min(dp[i], 1 + dp[i - x*x]);`,
      },
      {
        name: 'Pattern 3 — Pick / Not Pick (Knapsack)',
        when: 'You have a list of items. At each item, binary choice: include it or skip it. Each item used at most once.',
        whyThisPattern: 'Two choices per item → two branches in recursion → 2D dp[i][w] where i = item index, w = remaining capacity. The "pick" branch reduces capacity; the "not pick" branch moves on. Take max/check feasibility over both.',
        keyRule: 'If items can be reused (unbounded knapsack) → stay at same index after picking. If each item used once (0/1 knapsack) → move to i+1 after picking.',
        initTo: '0 (maximizing) or false (feasibility)',
        examples: '0/1 Knapsack, Subset Sum, House Robber, Target Sum, Partition Equal Subset',
        code: `// 0/1 Knapsack: dp[i][w] = max value using items 0..i with capacity w
for (int i = 1; i <= n; i++)
    for (int w = 0; w <= W; w++) {
        dp[i][w] = dp[i-1][w];                           // not pick
        if (weight[i] <= w)
            dp[i][w] = Math.max(dp[i][w],
                dp[i-1][w - weight[i]] + value[i]);       // pick
    }`,
      },
      {
        name: 'Pattern 4 — Two Sequences',
        when: 'Comparing or aligning two strings/arrays. The decision at each step depends on characters/elements at position (i, j) in both sequences.',
        whyThisPattern: 'Single-index dp[i] can\'t capture state from two sequences simultaneously. You need dp[i][j] = answer for first i elements of s1 and first j elements of s2. Transitions look left (dp[i][j-1]), up (dp[i-1][j]), or diagonal (dp[i-1][j-1]).',
        keyRule: 'If s1[i] == s2[j] → diagonal (dp[i-1][j-1] + 1 or similar). If not equal → take best of left or up. This covers LCS, Edit Distance, Longest Common Substring.',
        initTo: '0 (both sequences)',
        examples: 'LCS, Edit Distance, Longest Common Substring, LIS, Interleaving Strings',
        code: `// LCS: dp[i][j] = length of LCS of s1[0..i-1] and s2[0..j-1]
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        if (s1[i-1] == s2[j-1])
            dp[i][j] = 1 + dp[i-1][j-1];          // match → diagonal
        else
            dp[i][j] = Math.max(dp[i-1][j],        // skip s1[i]
                                dp[i][j-1]);        // skip s2[j]`,
      },
    ],
    animations: [
      { file: 'dp-climbing-stairs-recursion.html', title: 'Climbing Stairs — Pure Recursion (Overlapping Subproblems)' },
      { file: 'dp-climbing-stairs-memo.html',      title: 'Climbing Stairs — Memoization (Cache Hits)' },
      { file: 'dp-fibonacci.html',                 title: 'Fibonacci — Recursion Tree with Memo' },
      { file: 'dp-climbing-stairs.html',           title: 'Climbing Stairs — Bottom Up DP Table' },
    ],
    commonMistakes: [
      'Forgetting the base case — dp[0] and dp[1] must be set before the loop.',
      'Wrong dp array size — use n+1 not n, otherwise dp[n] goes out of bounds.',
      'Using greedy when DP is needed — greedy picks locally best, DP finds globally best.',
      'Typo in recurrence — writing ways(n-1) + ways(n+1) instead of ways(n-1) + ways(n-2). The second term must go backward, not forward.',
      'Initializing dp to 0 when minimizing — minimum logic breaks instantly. Use n+1 or Integer.MAX_VALUE as the starting "infinity".',
      'Passing current-best res as a parameter — each recursive call needs its own local res starting at MAX. Sharing it across calls gives wrong answers.',
      'Guard check placed after dp array assignment — if(n<2) must come before dp[0]=... dp[1]=... otherwise array-index crash when n=0.',
      'TC of any recursion = total calls × work per call. Pure recursion climbing stairs: 2^N calls × O(1) = O(2^N). Memoization: N unique calls × O(1) = O(N). Perfect Squares memo: N calls × O(√N) loop per call = O(N√N). Count unique subproblems first, then multiply by work inside each call.',
      'TC of DP specifically = number of unique subproblems × work done per subproblem (excluding recursive calls). Exclude recursive calls because memoization ensures each subproblem is solved exactly once — counting them again would double-count. House Robber: N unique states × O(1) = O(N). Perfect Squares: N unique states × O(√N) loop = O(N√N).',
      'How to know if DP is 1D or 2D: ask "how many variables does my recursive function depend on?" If GetMax(index) always returns the same answer for the same index → one variable → 1D dp[index]. If the answer changes based on two things simultaneously (e.g. item index AND remaining capacity in Knapsack) → two variables → 2D dp[i][w]. Quick test: call solve(3) twice — if the answer is always identical, one dimension is enough. If the same index gives different answers depending on other state, you need more dimensions.',
      'TC of any DP solution = unique subproblems × work per subproblem. Unique subproblems = size of your dp array. Work per subproblem = what is inside the loop at each cell. Climbing Stairs: N states × O(1) = O(N). Perfect Squares: N states × O(√N) loop = O(N√N). 0/1 Knapsack: N×W states × O(1) = O(N×W). LCS: M×N states × O(1) = O(M×N).',
      'Thinking visited[] reset inside recursion affects the caller — Java passes array reference by value. Writing visited = new int[n] inside a recursive call only reassigns the local variable; the caller still holds the old array. Reset never happens. Rule: reassign (=) is local only. Mutate (visited[i]=1, list.add(), list.remove()) affects the caller because both share the same object. This is why backtracking unpick works — list.remove() mutates the shared list.',
      'Thinking start++ or end++ inside a recursive call affects the caller — primitives are passed by value in Java. Incrementing a parameter is local only. The caller\'s variable is unchanged, so start never actually moves forward.',
    ],
    problems: [
      { slug: 'climbing-stairs', title: 'Climbing Stairs',  difficulty: 'Easy',   lcNum: 70  },
      { slug: 'min-squares',     title: 'Perfect Squares',  difficulty: 'Medium', lcNum: 279 },
      { slug: 'house-robber',    title: 'House Robber',     difficulty: 'Medium', lcNum: 198 },
    ],
  },
}

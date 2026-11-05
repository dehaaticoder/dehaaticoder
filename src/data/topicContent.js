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
    conceptComparisons: [
      {
        title: 'Pure Recursion vs Backtracking',
        intro: 'Both use the same analysis formula — but they solve different problem shapes and the numbers come out differently.',
        headers: ['', 'Pure Recursion', 'Backtracking'],
        rows: [
          ['What it solves',   'Break into subproblems, combine results',          'Explore choices, undo a choice to try the next'],
          ['Core operation',   'Compute and return',                                'Pick → Recurse → Unpick'],
          ['Mutable state',    'None — each call is independent',                  'Yes — shared list / visited[] that gets mutated and restored'],
          ['TC formula',       'total calls × work per call',                      'total calls × work per call (same formula)'],
          ['SC formula',       'stack depth only',                                 'stack depth + mutable state size'],
          ['Branching factor', 'Depends on the problem',                           'Depends on the problem'],
          ['Examples',         'Fibonacci, Unique Paths, Merge Sort',              'Subsets, Permutations, N-Queens, Sudoku'],
          ['Can both exist?',  'Sometimes — Subsets can be written either way',    'Sometimes — but Fibonacci cannot be backtracking'],
        ],
        footer: 'Rule: ask "do I have a choice to undo?" No → pure recursion. Yes → backtracking. Same formula, different numbers.',
      },
      {
        title: 'TC and SC across all Recursion styles',
        intro: 'The formula is the same. The numbers differ based on branching factor and depth of that problem.',
        headers: ['Problem', 'Type', 'Branching', 'Depth', 'TC', 'SC'],
        rows: [
          ['Fibonacci',      'Pure recursion',  '2',       'N',   'O(2^N)',       'O(N)'],
          ['Unique Paths',   'Pure recursion',  '2',       'N+M', 'O(2^(N+M))',   'O(N+M)'],
          ['Subsets',        'Backtracking',    '2',       'N',   'O(2^N × N)',   'O(N) stack + O(N) path'],
          ['Permutations',   'Backtracking',    'N,N-1..', 'N',   'O(N! × N)',    'O(N) stack + O(N) path'],
          ['N-Queens',       'Backtracking',    'up to N', 'N',   'O(N!)',        'O(N) stack + O(N) board'],
          ['Combination Sum','Both possible',   'up to N', 'target/min', 'O(2^N)','O(depth)'],
        ],
        footer: 'SC for backtracking = stack depth + extra mutable state (path list, visited[]). Pure recursion has no extra state.',
      },
    ],
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

  arrays: {
    intro: `Arrays are the foundation of DSA. Every other data structure builds on top of them. Master the core patterns — prefix sum, sliding window, contribution technique — and most array problems become straightforward.`,
    whyItWorks: `Arrays store elements in contiguous memory. This gives O(1) access by index. Most optimizations come from precomputing something (prefix sum) or maintaining a window (sliding window) so you avoid repeated work.`,
    teachingFlow: [
      { step: 'Index & Access',      desc: 'O(1) access, O(N) search. The foundation.' },
      { step: 'Prefix Sum',          desc: 'Precompute to answer range queries in O(1).' },
      { step: 'Sliding Window',      desc: 'Fixed or variable window — avoid recomputing overlap.' },
      { step: 'Contribution',        desc: 'How many times does A[i] appear across all subarrays?' },
      { step: 'Two Pointer',         desc: 'Shrink and expand from both ends — O(N) instead of O(N²).' },
    ],
    keyInsight: 'Before writing a loop, ask: am I recomputing the same thing? If yes — precompute with prefix sum or slide a window. This single question eliminates 80% of brute force solutions.',
    patternsTitle: 'Core Array Patterns',
    patterns: [
      {
        name: 'Pattern 1 — Prefix Sum + Range Query',
        when: 'Multiple range queries [L, R] on the same array. Brute force is O(N×Q).',
        whyThisPattern: 'Build prefix array once in O(N). Each query becomes O(1) subtraction. Total: O(N+Q) instead of O(N×Q).',
        keyRule: 'Query [L, R]: if L==0 return prefix[R], else prefix[R] - prefix[L-1]. Handle L==0 separately to avoid index -1.',
        examples: 'Even Numbers in a Range, Special Index, Sum of Odd/Even Indexed Elements',
        code: `// Build prefix
int[] prefix = new int[n];
prefix[0] = A[0];
for (int i = 1; i < n; i++)
    prefix[i] = prefix[i-1] + A[i];

// Query [L, R]
int sum = (L == 0) ? prefix[R] : prefix[R] - prefix[L-1];`,
      },
      {
        name: 'Pattern 2 — Sliding Window (Fixed Size)',
        when: 'Find max/min/sum of every subarray of exactly size K.',
        whyThisPattern: 'Instead of recomputing sum from scratch each time (O(N×K)), slide the window: add the new element entering, remove the element leaving. O(N).',
        keyRule: 'Compute first window. Then slide: add A[right], subtract A[right - K]. Track max at each step.',
        examples: 'Maximum Subarray Sum of Fixed Length, Subarray with Given Sum and Length',
        code: `int sum = 0;
for (int i = 0; i < K; i++) sum += A[i];   // first window
int max = sum;
for (int i = K; i < n; i++) {
    sum += A[i] - A[i - K];                 // slide
    max = Math.max(max, sum);
}`,
      },
      {
        name: 'Pattern 3 — Sliding Window (Variable Size)',
        when: 'Find longest/shortest subarray satisfying a condition (sum ≤ B, all unique, etc.).',
        whyThisPattern: 'Two pointers s and e. Expand e to include more elements. Shrink s when condition is violated. Each element enters and leaves the window at most once — O(N).',
        keyRule: 'Use s <= e (not s < e) to allow the empty window (sum = 0). This handles the case where all elements exceed the limit.',
        examples: 'Maximum Subarray (sum ≤ B), Longest Substring Without Repeating Characters',
        code: `int s = 0, sum = 0, max = 0;
for (int e = 0; e < n; e++) {
    sum += A[e];
    while (sum > B && s <= e)   // s <= e allows empty window
        sum -= A[s++];
    max = Math.max(max, e - s + 1);
}`,
      },
      {
        name: 'Pattern 4 — Contribution Technique',
        when: 'Sum of all subarray sums. Avoid generating all subarrays — O(N³). Instead ask: how much does each element contribute?',
        whyThisPattern: 'A[i] appears in all subarrays that start at index 0..i and end at index i..n-1. Count = (i+1) × (n-i). Multiply and sum — O(N).',
        keyRule: 'Cast to long before multiplying: (long)(i+1)*(n-i). For n=10⁵, result can exceed int max (2.1×10⁹).',
        examples: 'Sum of All Subarrays',
        code: `long ans = 0;
for (int i = 0; i < n; i++)
    ans += (long)A[i] * (i + 1) * (n - i);   // long cast critical`,
      },
      {
        name: 'Pattern 5 — 3-Reverse Trick (Array Rotation)',
        when: 'Rotate array right by K positions in-place. O(N) time, O(1) space.',
        whyThisPattern: 'Rotating right by K = last K elements come to front. Three reverses achieve this without extra space.',
        keyRule: 'Always do K = K%N first (K can be > N). In the reverse helper: both start++ AND end-- must execute per iteration.',
        examples: 'Array Rotation (LC 189)',
        code: `K = K % n;
if (K == 0) return;
reverse(A, 0, n-1);    // full
reverse(A, 0, K-1);    // first part
reverse(A, K, n-1);    // second part

void reverse(int[] A, int s, int e) {
    while (s < e) {
        int tmp = A[s]; A[s] = A[e]; A[e] = tmp;
        s++; e--;   // BOTH must move — missing e-- is a classic bug
    }
}`,
      },
    ],
    animations: [],
    commonMistakes: [
      'Missing end-- in the reverse helper — only incrementing start++ means end never moves, giving garbage output. Both pointers must move every iteration.',
      'Array size n instead of n*(n+1)/2 when storing all subarrays — n*(n+1)/2 is the total count of subarrays, not n.',
      'Integer overflow in contribution technique — (i+1)*(n-i) for n=10⁵ exceeds int. Always cast: (long)(i+1)*(n-i).',
      'Using s < e instead of s <= e in variable sliding window — misses the empty window (sum=0) case, which is needed when all elements exceed the limit.',
      'Forgetting K = K%N before rotation — when K > N, rotating by K is the same as rotating by K%N. Skipping this causes wrong index access.',
      'Prefix sum query without handling L==0 separately — prefix[L-1] when L=0 accesses index -1 and crashes.',
      'Using i%2 vs A[i]%2 for Special Index — i%2 is index parity (what you want), A[i]%2 is element value parity (wrong).',
    ],
    problems: [
      { slug: 'generate-subarrays',          title: 'Generate All Subarrays',                           difficulty: 'VeryEasy', lcNum: null },
      { slug: 'count-factors',               title: 'Count Factors',                                    difficulty: 'VeryEasy', lcNum: null },
      { slug: 'array-rotation',              title: 'Array Rotation (Rotate Right by K)',               difficulty: 'VeryEasy', lcNum: 189  },
      { slug: 'max-fixed-window',            title: 'Maximum Subarray Sum of Fixed Length',             difficulty: 'VeryEasy', lcNum: null },
      { slug: 'sum-all-subarrays',           title: 'Sum of All Subarrays',                            difficulty: 'Easy',     lcNum: null },
      { slug: 'max-subarray-sum-le-b',       title: 'Maximum Subarray (sum ≤ B)',                      difficulty: 'Easy',     lcNum: null },
      { slug: 'special-subseq-ag',           title: 'Special Subsequences "AG"',                       difficulty: 'Easy',     lcNum: null },
      { slug: 'sort-colors',                 title: 'Sort Colors',                                      difficulty: 'Medium',   lcNum: 75   },
      { slug: 'max-vowels',                  title: 'Maximum Number of Vowels in a Substring',          difficulty: 'Medium',   lcNum: 1456 },
      { slug: 'container-with-most-water',   title: 'Container With Most Water',                        difficulty: 'Medium',   lcNum: 11   },
      { slug: 'longest-substring-no-repeat', title: 'Longest Substring Without Repeating Characters',   difficulty: 'Medium',   lcNum: 3    },
      { slug: 'find-minimum-rotated',        title: 'Find Minimum in Rotated Sorted Array',             difficulty: 'Medium',   lcNum: 153  },
      { slug: 'even-numbers-range',          title: 'Even Numbers in a Range',                          difficulty: 'Medium',   lcNum: null },
      { slug: 'special-index',               title: 'Special Index',                                    difficulty: 'Medium',   lcNum: null },
      { slug: 'closest-minmax',              title: 'Closest MinMax',                                   difficulty: 'Medium',   lcNum: null },
    ],
  },

  sql: {
    intro: `SQL is the language of data. Every query you write is a question you ask the database. Master the building blocks — SELECT, JOIN, WHERE, GROUP BY — and then layer on subqueries, aggregations, and window functions.`,
    whyItWorks: `SQL is declarative — you describe WHAT you want, not HOW to get it. The database engine figures out the most efficient execution plan. Your job is to express the question correctly.`,
    teachingFlow: [
      { step: 'SELECT & WHERE',    desc: 'Filter rows. The most basic query.' },
      { step: 'JOIN',              desc: 'Combine tables. INNER vs LEFT vs RIGHT.' },
      { step: 'GROUP BY',          desc: 'Aggregate data. COUNT, SUM, AVG, MAX, MIN.' },
      { step: 'Subqueries',        desc: 'Query inside a query. Scalar, IN, FROM, EXISTS.' },
      { step: 'Window Functions',  desc: 'ROW_NUMBER, RANK, LAG, LEAD — without collapsing rows.' },
    ],
    keyInsight: 'SQL clause order matters: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT. You must write them in this order. If you put WHERE after GROUP BY, it is a syntax error.',
    patternsTitle: 'Key SQL Patterns',
    patterns: [
      {
        name: 'Pattern 1 — Conditional COUNT',
        when: 'Count only rows matching a condition, alongside total count — in one query.',
        whyThisPattern: 'WHERE filters out rows entirely. CASE WHEN inside COUNT keeps all rows visible but only counts the matching ones. Both numbers come from one pass.',
        keyRule: 'COUNT(CASE WHEN condition THEN 1 END) — no ELSE needed. False condition returns NULL, and COUNT skips NULLs automatically.',
        examples: 'Immediate Food Delivery % (Q7), Pass rate calculations',
        code: `SELECT
    COUNT(*) AS total,
    COUNT(CASE WHEN condition THEN 1 END) AS matching,
    ROUND(COUNT(CASE WHEN condition THEN 1 END) * 100.0 / COUNT(*), 2) AS percentage
FROM table;

-- Alternative using SUM:
SUM(CASE WHEN condition THEN 1 ELSE 0 END)  -- same result`,
      },
      {
        name: 'Pattern 2 — NOT IN vs NOT EXISTS',
        when: 'Find rows in table A that have no match in table B.',
        whyThisPattern: 'Both work, but NOT IN has a NULL trap: if the subquery returns even one NULL, NOT IN returns no rows at all. NOT EXISTS is NULL-safe.',
        keyRule: 'Use NOT IN when the column is a primary/foreign key (never NULL). Use NOT EXISTS for safety when NULLs are possible. EXISTS always takes a subquery — SELECT 1 is convention.',
        examples: 'No Job History (Q2), Customers without Orders (Q5)',
        code: `-- NOT IN (simple, safe when no NULLs)
SELECT * FROM employees
WHERE employee_id NOT IN (SELECT employee_id FROM job_history);

-- NOT EXISTS (NULL-safe, short-circuits)
SELECT * FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.cust_id = c.id);`,
      },
      {
        name: 'Pattern 3 — Subquery Types',
        when: 'Choosing the right subquery form for the problem.',
        whyThisPattern: 'Different subquery placements serve different purposes. Using the wrong one either gives wrong results or errors.',
        keyRule: 'Subquery in FROM must ALWAYS have an alias. Correlated subquery runs once per outer row — O(N²). EXISTS short-circuits at first match.',
        examples: 'Nth Highest Salary (Q3), Department queries',
        code: `-- Scalar subquery (returns one value)
SELECT * FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);

-- IN subquery (returns a list)
SELECT * FROM employees WHERE dept_id IN (SELECT dept_id FROM departments WHERE name = 'HR');

-- FROM subquery (must alias)
SELECT * FROM (SELECT * FROM employees WHERE salary > 50000) AS temp;

-- Correlated subquery (runs per row — slow)
SELECT * FROM employees e1
WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id);`,
      },
      {
        name: 'Pattern 4 — Inline Arithmetic',
        when: 'Compute derived values (percentages, totals, ratios) directly in SELECT.',
        whyThisPattern: 'SQL can do math inline on column values — no need for application-side computation.',
        keyRule: 'Integer division truncates in SQL. 5/2 = 2 not 2.5. Use * 100.0 (not * 100) to force decimal result. ROUND(expression, decimal_places) — alias goes OUTSIDE ROUND.',
        examples: 'Immediate Food Delivery % (Q7), salary calculations',
        code: `-- Integer division trap
SELECT 5 / 2;          -- returns 2, not 2.5

-- Force decimal
SELECT 5 * 1.0 / 2;   -- returns 2.5
SELECT 5 / 2.0;        -- returns 2.5

-- ROUND syntax -- alias OUTSIDE
SELECT ROUND(count * 100.0 / total, 2) AS percentage   -- correct
FROM ...;`,
      },
      {
        name: 'Pattern 5 — Multi-Column IN',
        when: 'Match rows where two columns together equal a pair from a subquery. Common for "find the row with the earliest/latest value per group".',
        whyThisPattern: 'Single-column IN can only match one value. Multi-column IN matches an exact (col1, col2) pair — so you get the original row without arbitrary device_id selection.',
        keyRule: 'Do NOT include extra columns in the subquery that are not part of the match — subquery must return exactly the same number of columns as the IN tuple.',
        examples: 'Game Play Analysis II (Q9) — find device_id from first login date per player',
        code: `-- Find device_id for each player's first login
SELECT player_id, device_id
FROM activity
WHERE (player_id, event_date) IN (
    SELECT player_id, MIN(event_date)   -- exactly 2 columns to match (player_id, event_date)
    FROM activity
    GROUP BY player_id
)
ORDER BY player_id;

-- Why not GROUP BY alone?
-- GROUP BY player_id with device_id in SELECT = SQL picks device_id arbitrarily
-- Multi-column IN goes back to the original row = correct device_id guaranteed`,
      },
    ],
    commonMistakes: [
      'Using == instead of = in SQL — SQL uses single = for comparison, == does not exist.',
      'Wrong clause order — WHERE must come before GROUP BY. GROUP BY before WHERE is a syntax error.',
      'Missing table name in subquery FROM — "FROM WHERE salary > X" is invalid. Must be "FROM employees WHERE salary > X".',
      'Missing parentheses around subquery — "WHERE salary IN SELECT..." fails. Must be "WHERE salary IN (SELECT...)".',
      'Trailing comma in SELECT — "SELECT name, salary, FROM table" crashes. Remove comma after last column.',
      'ROUND alias inside parentheses — ROUND(expr, 2) AS alias not ROUND(expr AS alias, 2). Alias always goes outside.',
      'COUNT(condition) does not filter — COUNT(A = B) counts all non-NULL rows regardless of whether A=B is true. Use COUNT(CASE WHEN A = B THEN 1 END) instead.',
      'Subquery in FROM without alias — every derived table in FROM must have an alias: "SELECT * FROM (SELECT ...) AS temp". Without AS temp it errors.',
      'NOT IN returns nothing when subquery has NULLs — if subquery returns [1, 2, NULL], NOT IN (1, 2, NULL) is always false for every row.',
      'LEFT JOIN + WHERE condition converts to INNER JOIN — WHERE c.name = "RED" after a LEFT JOIN filters out NULL rows from the left side, making it behave like INNER JOIN.',
    ],
    problems: [
      { slug: 'department-employees',    title: 'Department Names (Q1)',                difficulty: 'Easy',   lcNum: null },
      { slug: 'no-job-history',          title: 'No Job History (Q2)',                 difficulty: 'Easy',   lcNum: null },
      { slug: 'third-highest-salary',    title: '3rd Highest Salary (Q3)',             difficulty: 'Medium', lcNum: null },
      { slug: 'managers-4-employees',    title: '4 or More Employees (Q4)',            difficulty: 'Medium', lcNum: null },
      { slug: 'customers-no-orders',     title: 'Customers without Orders (Q5)',       difficulty: 'Easy',   lcNum: null },
      { slug: 'sales-person-no-red',     title: 'Sales Person (Q6)',                   difficulty: 'Medium', lcNum: null },
      { slug: 'immediate-delivery',      title: 'Immediate Food Delivery % (Q7)',      difficulty: 'Medium', lcNum: null },
      { slug: 'biggest-single-number',   title: 'Biggest Single Number (Q8)',          difficulty: 'Easy',   lcNum: null },
      { slug: 'game-play-analysis',      title: 'Game Play Analysis II (Q9)',          difficulty: 'Medium', lcNum: null },
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
      { file: 'dp-house-robber-recursion.html',   title: 'House Robber — Pure Recursion (Overlapping Subproblems)' },
      { file: 'dp-house-robber-memo.html',        title: 'House Robber — Memoization (Cache Hit)' },
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
      { slug: 'climbing-stairs',  title: 'Climbing Stairs',                 difficulty: 'Easy',   lcNum: 70  },
      { slug: 'min-squares',      title: 'Perfect Squares',                 difficulty: 'Medium', lcNum: 279 },
      { slug: 'house-robber',     title: 'House Robber',                    difficulty: 'Medium', lcNum: 198 },
      { slug: 'n-digit-numbers',  title: 'N Digit Numbers with Digit Sum S', difficulty: 'Medium', lcNum: null },
    ],
  },

  machinecoding: {
    intro: `Machine coding and LLD interviews test whether you can go from a vague problem statement to a working, well-designed system — in under 2.5 hours. The key is not just knowing OOP concepts, but following a structured approach every single time.`,
    whyItWorks: `Most candidates jump straight to coding. Interviewers are judging your thought process — how you gather requirements, how you model the system, and whether your design is extensible. Structure separates a strong hire from an average one.`,
    teachingFlow: [
      { step: 'Step 0 — Align',      desc: 'Two lines confirming your understanding of the system. Always do this, even if you know the app.' },
      { step: 'Step 1 — Requirements', desc: 'Gather 5–8 requirements. Ask 3 clarifying questions. Lead the interview — propose features yourself.' },
      { step: 'Step 2 — Class Diagram', desc: 'Identify classes via nouns, visualization, or user journey. Define fields + method signatures.' },
      { step: 'Step 3 — Schema Design', desc: 'Convert classes to tables. Add foreign keys based on relationships. Skip if no DB needed.' },
      { step: 'Step 4 — Code',         desc: 'For machine coding: end-to-end working code. For LLD round: pseudo-code or key class implementations.' },
    ],
    keyInsight: 'Lead the interview. Propose the features yourself — do not let the interviewer dictate them. If you leave it to them, they might give you something you cannot implement.',

    patternsTitle: 'The 3 Clarifying Questions (always ask before designing)',
    patterns: [
      {
        name: 'Question 1 — Entity system or working software?',
        when: 'Always ask this first.',
        whyThisPattern: 'Entity system = just class diagram, no algorithm, no APIs. Working software = full implementation with flows and interactions. Your entire approach changes based on this answer.',
        unpick: false,
        examples: 'Design a Pen → entity system. Design BookMyShow → working software.',
        code: `// Entity system: just define classes + relationships
// No main(), no algorithms, no user flows

abstract class Pen {
    String name;
    String brand;
    double price;
    boolean isCapOpen;
    abstract void write();
    void open()  { isCapOpen = true; }
    void close() { isCapOpen = false; }
}

// Working software: full implementation
// Main class, object creation, method calls, test cases`,
      },
      {
        name: 'Question 2 — Do we persist data?',
        when: 'Ask after confirming entity vs working software.',
        whyThisPattern: 'If yes → you must do schema design (tables, foreign keys, relationships). If no → skip schema design entirely. For example, TicTacToe has no DB — game state lives in memory only.',
        unpick: false,
        examples: 'BookMyShow → yes, persist bookings. TicTacToe → no, in-memory only.',
        code: `// If persisting: schema design required
// User table, Post table, Connection table...

// If not persisting: no schema needed
// Just classes and in-memory state`,
      },
      {
        name: 'Question 3 — How does user interact?',
        when: 'Ask before coding.',
        whyThisPattern: 'Three options: APIs (REST endpoints), command line (command pattern), or hardcoded (main class with test cases). Each requires a different implementation approach.',
        unpick: false,
        examples: 'Atlassian interview → hardcoded. Flipkart → APIs. Some companies → command line.',
        code: `// Hardcoded: write a main/client class
public class Main {
    public static void main(String[] args) {
        Pen p = new GelPen("Parker", "Parker Co", 150.0);
        p.write();
    }
}`,
      },
    ],

    commonMistakes: [
      'Jumping to code without gathering requirements — interviewer is judging your thought process, not just the code.',
      'Letting the interviewer give you all the features — propose them yourself so you control the complexity.',
      'Talking about fancy side features (coupons, games in Zomato) instead of the central feature — interviewers will ask you to implement it.',
      'Putting refillPen() on the abstract Pen class — not all pens are refillable. Fountain pens have no refill. Use an interface instead.',
      'Using enum for types when different types need different attributes — enums cannot hold extra state. Use subclasses instead.',
      'Putting likes/comments as columns in the Post table — 1-to-many relationships store the FK on the many side, not the one side.',
      'Using a single Connection table with a status column — separating ConnectionRequest and Connection gives cleaner queries and single responsibility.',
    ],

    caseStudies: [
      {
        slug: 'pen-design',
        title: 'Design a Pen',
        type: 'Entity System',
        difficulty: 'Beginner',
        description: 'Classic Amazon interview problem. Design the class hierarchy for physical pens — ball pen, gel pen, fountain pen — with proper OOP relationships.',
        classes: [
          {
            name: 'Pen (abstract)',
            fields: ['String name', 'String brand', 'double price', 'boolean isCapOpen'],
            methods: ['abstract void write()', 'void open()', 'void close()'],
          },
          {
            name: 'Refillable (interface)',
            fields: [],
            methods: ['void refillPen(Refill refill)'],
          },
          {
            name: 'GelPen extends Pen implements Refillable',
            fields: ['Refill refill'],
            methods: ['void write()', 'void refillPen(Refill refill)'],
          },
          {
            name: 'BallPen extends Pen implements Refillable',
            fields: ['Refill refill'],
            methods: ['void write()', 'void refillPen(Refill refill)'],
          },
          {
            name: 'FountainPen extends Pen',
            fields: ['Ink ink'],
            methods: ['void write()'],
          },
          {
            name: 'Refill',
            fields: ['int length', 'Ink ink'],
            methods: [],
          },
          {
            name: 'Ink',
            fields: ['String color', 'double density', 'InkType type'],
            methods: [],
          },
        ],
        relationships: [
          'GelPen, BallPen, FountainPen → Pen : inheritance (is-a)',
          'GelPen, BallPen → Refillable : realization (implements)',
          'GelPen, BallPen → Refill : aggregation (weak has-a, hollow diamond on pen side)',
          'Refill → Ink : composition (strong has-a, filled diamond on refill side)',
          'FountainPen → Ink : composition (strong has-a, filled diamond on fountain pen side)',
        ],
        keyInsight: 'Refill is aggregation (weak) because you can remove and swap refills independently. Ink inside Refill is composition (strong) because ink cannot exist without the refill context.',
        mermaidDiagram: `classDiagram
  class Pen {
    <<abstract>>
    String name
    String brand
    double price
    boolean isCapOpen
    void open()
    void close()
    void write()*
  }
  class Refillable {
    <<interface>>
    void refillPen(Refill refill)
  }
  class GelPen {
    Refill refill
    void write()
    void refillPen(Refill refill)
  }
  class BallPen {
    Refill refill
    void write()
    void refillPen(Refill refill)
  }
  class FountainPen {
    Ink ink
    void write()
  }
  class Refill {
    int length
    Ink ink
  }
  class Ink {
    String color
    double density
    InkType type
  }
  class InkType {
    <<enumeration>>
    GEL
    BALL
    FOUNTAIN
  }

  Pen <|-- GelPen : extends
  Pen <|-- BallPen : extends
  Pen <|-- FountainPen : extends
  Refillable <|.. GelPen : implements
  Refillable <|.. BallPen : implements
  GelPen o-- Refill : aggregation
  BallPen o-- Refill : aggregation
  Refill *-- Ink : composition
  FountainPen *-- Ink : composition
  Ink --> InkType : uses`,
      },
      {
        slug: 'url-shortener',
        title: 'URL Shortener',
        type: 'Working Software',
        difficulty: 'Intermediate',
        description: 'Full LLD design of a URL shortening service (like bit.ly) — from requirements gathering to thread-safe implementation with expiry, analytics, and cleanup.',
        keyInsight: 'putIfAbsent is atomic check-and-insert. It eliminates the check-then-act race condition in one line — no synchronized block needed. That is senior-level concurrency thinking.',
        mermaidDiagram: `classDiagram
  class ShortUrl {
    -String shortCode
    -String originalUrl
    -String customAlias
    -LocalDateTime createdAt
    -LocalDateTime expiresAt
    -String createdBy
    -AtomicInteger clickCount
    +isExpired() boolean
    +incrementClicks()
    +getClickCount() int
  }
  class ClickEvent {
    -String id
    -String shortCode
    -String clickedBy
    -String source
    -LocalDateTime clickedAt
  }
  class CodeGenerationStrategy {
    <<interface>>
    +generate(String input) String
  }
  class HashBasedStrategy {
    +generate(String input) String
  }
  class CounterBasedStrategy {
    -AtomicInteger counter
    +generate(String input) String
  }
  class ShortUrlRepository {
    -ConcurrentHashMap shortUrlMap
    +saveIfAbsent(ShortUrl) boolean
    +findByShortCode(String) Optional
    +findAllExpired() List
    +delete(String)
  }
  class ClickEventRepository {
    -ConcurrentHashMap clickEventMap
    +save(ClickEvent)
    +findByShortCode(String) List
  }
  class UrlShortenerService {
    +shorten(longUrl, alias, ttl, createdBy) String
    +resolve(shortCode, userId, source) String
    +getStats(shortCode) UrlStats
  }
  class UrlStats {
    -int clickCount
    -LocalDateTime createdAt
    -LocalDateTime expiresAt
    -List recentEvents
    +getRecentEvents() List
  }
  class ExpiryCleanupJob {
    -ScheduledExecutorService scheduler
    -int cronInterval
    +start()
    -run()
  }

  CodeGenerationStrategy <|.. HashBasedStrategy
  CodeGenerationStrategy <|.. CounterBasedStrategy
  UrlShortenerService --> ShortUrlRepository
  UrlShortenerService --> ClickEventRepository
  UrlShortenerService --> CodeGenerationStrategy
  UrlShortenerService --> UrlStats
  ExpiryCleanupJob --> ShortUrlRepository
  ShortUrlRepository --> ShortUrl
  ClickEventRepository --> ClickEvent`,
        classes: [
          {
            name: 'ShortUrl',
            fields: ['final String shortCode', 'final String originalUrl', 'final String customAlias', 'final LocalDateTime createdAt', 'final LocalDateTime expiresAt', 'final String createdBy', 'AtomicInteger clickCount'],
            methods: ['boolean isExpired()', 'void incrementClicks()', 'int getClickCount()', 'all getters'],
          },
          {
            name: 'ClickEvent',
            fields: ['final String id  (UUID)', 'final String shortCode', 'final String clickedBy', 'final String source', 'final LocalDateTime clickedAt'],
            methods: ['all getters'],
          },
          {
            name: 'CodeGenerationStrategy (interface)',
            fields: [],
            methods: ['String generate(String input)'],
          },
          {
            name: 'HashBasedStrategy implements CodeGenerationStrategy',
            fields: [],
            methods: ['generate(longUrl + UUID.randomUUID())  — MD5, substring(0,6)'],
          },
          {
            name: 'CounterBasedStrategy implements CodeGenerationStrategy',
            fields: ['AtomicInteger counter'],
            methods: ['generate(input) → String.valueOf(counter.incrementAndGet())'],
          },
          {
            name: 'ShortUrlRepository',
            fields: ['ConcurrentHashMap<String, ShortUrl> shortUrlMap'],
            methods: ['boolean saveIfAbsent(ShortUrl)', 'Optional<ShortUrl> findByShortCode(String)', 'List<ShortUrl> findAllExpired()', 'void delete(String)'],
          },
          {
            name: 'ClickEventRepository',
            fields: ['ConcurrentHashMap<String, CopyOnWriteArrayList<ClickEvent>> clickEventMap'],
            methods: ['void save(ClickEvent)', 'List<ClickEvent> findByShortCode(String)'],
          },
          {
            name: 'UrlShortenerService',
            fields: ['ShortUrlRepository shortUrlRepo', 'ClickEventRepository clickEventRepo', 'CodeGenerationStrategy codeGenStrategy'],
            methods: ['String shorten(longUrl, customAlias, ttlSeconds, createdBy)', 'String resolve(shortCode, userId, source)', 'UrlStats getStats(shortCode)'],
          },
          {
            name: 'UrlStats  (immutable data class)',
            fields: ['final int clickCount', 'final LocalDateTime createdAt', 'final LocalDateTime expiresAt', 'final List<ClickEvent> recentEvents'],
            methods: ['List<ClickEvent> getRecentEvents()  — defensive copy: new ArrayList<>(recentEvents)'],
          },
          {
            name: 'ExpiryCleanupJob',
            fields: ['ShortUrlRepository shortUrlRepo', 'int cronInterval', 'ScheduledExecutorService scheduler'],
            methods: ['void start()  — scheduleAtFixedRate(this::run, 0, cronInterval, SECONDS)', 'void run()  — delete all expired; keep ClickEvents for analytics'],
          },
        ],
        relationships: [
          'HashBasedStrategy, CounterBasedStrategy → CodeGenerationStrategy : realization (implements)',
          'UrlShortenerService → ShortUrlRepository : association (uses)',
          'UrlShortenerService → ClickEventRepository : association (uses)',
          'UrlShortenerService → CodeGenerationStrategy : association (DIP — depends on abstraction)',
          'ExpiryCleanupJob → ShortUrlRepository : association (uses)',
          'ShortUrlRepository → ShortUrl : composition (owns)',
          'ClickEventRepository → ClickEvent : composition (owns)',
          'ShortUrl → ClickEvent : one-to-many (one shortCode → many click events)',
        ],
        fullCode: `// ════════════════════════════════════════════════════════
// ENTITIES
// ════════════════════════════════════════════════════════

class ShortUrl {
    private final String shortCode;
    private final String originalUrl;
    private final String customAlias;    // null if not provided
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt; // absolute timestamp
    private final String createdBy;
    private final AtomicInteger clickCount = new AtomicInteger(0);

    public ShortUrl(String originalUrl, String customAlias, LocalDateTime createdAt,
                    LocalDateTime expiresAt, String createdBy, String shortCode) {
        this.originalUrl = originalUrl;
        this.customAlias = (customAlias == null || customAlias.isEmpty()) ? null : customAlias;
        this.createdAt   = createdAt;
        this.expiresAt   = expiresAt;
        this.createdBy   = createdBy;
        this.shortCode   = shortCode;
    }

    boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    void incrementClicks()            { clickCount.incrementAndGet(); }
    public int getClickCount()        { return clickCount.get(); }
    public String getShortCode()      { return shortCode; }
    public String getOriginalUrl()    { return originalUrl; }
    public String getCustomAlias()    { return customAlias; }
    public String getCreatedBy()      { return createdBy; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getExpiresAt()  { return expiresAt; }
}

class ClickEvent {
    private final String id;           // UUID — globally unique
    private final String shortCode;    // FK to ShortUrl
    private final String clickedBy;    // nullable
    private final String source;       // nullable — mobile/web/api
    private final LocalDateTime clickedAt;

    public ClickEvent(String shortCode, String clickedBy, String source, LocalDateTime clickedAt) {
        this.id        = UUID.randomUUID().toString();
        this.shortCode = shortCode;
        this.clickedBy = clickedBy;
        this.source    = source;
        this.clickedAt = clickedAt;
    }
    public String getId()               { return id; }
    public String getShortCode()        { return shortCode; }
    public String getClickedBy()        { return clickedBy; }
    public String getSource()           { return source; }
    public LocalDateTime getClickedAt() { return clickedAt; }
}

class UrlStats {
    private final int clickCount;
    private final LocalDateTime createdAt;
    private final LocalDateTime expiresAt;
    private final List<ClickEvent> recentEvents;

    public UrlStats(int clickCount, LocalDateTime createdAt,
                    LocalDateTime expiresAt, List<ClickEvent> recentEvents) {
        this.clickCount   = clickCount;
        this.createdAt    = createdAt;
        this.expiresAt    = expiresAt;
        this.recentEvents = recentEvents;
    }
    public int getClickCount()              { return clickCount; }
    public LocalDateTime getCreatedAt()     { return createdAt; }
    public LocalDateTime getExpiresAt()     { return expiresAt; }
    public List<ClickEvent> getRecentEvents() {
        return new ArrayList<>(recentEvents); // defensive copy
    }
}

// ════════════════════════════════════════════════════════
// STRATEGY PATTERN — Code Generation
// ════════════════════════════════════════════════════════

interface CodeGenerationStrategy {
    String generate(String input);
}

class HashBasedStrategy implements CodeGenerationStrategy {
    public String generate(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(input.getBytes());
            return HexFormat.of().formatHex(hash).substring(0, 6);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 not available", e);
        }
    }
}

class CounterBasedStrategy implements CodeGenerationStrategy {
    private final AtomicInteger counter = new AtomicInteger(0);
    public String generate(String input) {
        return String.valueOf(counter.incrementAndGet());
    }
}

class RandomBasedStrategy implements CodeGenerationStrategy {
    public String generate(String input) {
        return UUID.randomUUID().toString().substring(0, 6);
    }
}

// ════════════════════════════════════════════════════════
// REPOSITORIES
// ════════════════════════════════════════════════════════

class ShortUrlRepository {
    private final ConcurrentHashMap<String, ShortUrl> shortUrlMap = new ConcurrentHashMap<>();

    public boolean saveIfAbsent(ShortUrl shortUrl) {
        // atomic check-and-insert — no race condition
        return shortUrlMap.putIfAbsent(shortUrl.getShortCode(), shortUrl) == null;
    }
    public Optional<ShortUrl> findByShortCode(String shortCode) {
        return Optional.ofNullable(shortUrlMap.get(shortCode));
    }
    public List<ShortUrl> findAllExpired() {
        return shortUrlMap.values().stream()
            .filter(ShortUrl::isExpired)
            .collect(Collectors.toList());
    }
    public void delete(String shortCode) { shortUrlMap.remove(shortCode); }
}

class ClickEventRepository {
    // CopyOnWriteArrayList — read-heavy, lock-free reads
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<ClickEvent>> clickEventMap
        = new ConcurrentHashMap<>();

    public void save(ClickEvent clickEvent) {
        // computeIfAbsent — atomic list creation on first click
        clickEventMap.computeIfAbsent(clickEvent.getShortCode(),
            k -> new CopyOnWriteArrayList<>()).add(clickEvent);
    }
    public List<ClickEvent> findByShortCode(String shortCode) {
        return clickEventMap.getOrDefault(shortCode, new CopyOnWriteArrayList<>());
    }
}

// ════════════════════════════════════════════════════════
// SERVICE
// ════════════════════════════════════════════════════════

class UrlShortenerService {
    private final ShortUrlRepository shortUrlRepo;
    private final ClickEventRepository clickEventRepo;
    private final CodeGenerationStrategy codeGenStrategy; // DIP

    public UrlShortenerService(ShortUrlRepository shortUrlRepo,
                                ClickEventRepository clickEventRepo,
                                CodeGenerationStrategy codeGenStrategy) {
        this.shortUrlRepo    = shortUrlRepo;
        this.clickEventRepo  = clickEventRepo;
        this.codeGenStrategy = codeGenStrategy;
    }

    public String shorten(String longUrl, String customAlias, Integer ttlSeconds, String createdBy) {
        LocalDateTime expiresAt = (ttlSeconds != null)
            ? LocalDateTime.now().plusSeconds(ttlSeconds) : null;

        if (customAlias != null && !customAlias.isEmpty()) {
            ShortUrl shortUrl = new ShortUrl(longUrl, customAlias, LocalDateTime.now(),
                                             expiresAt, createdBy, customAlias);
            if (shortUrlRepo.saveIfAbsent(shortUrl)) return customAlias;
            else throw new RuntimeException("Alias already taken");
        }

        // UUID salt — fresh random input every retry → genuine collision busting
        int retryCnt = 0;
        while (retryCnt < 3) {
            retryCnt++;
            String hashShortCode = codeGenStrategy.generate(longUrl + UUID.randomUUID());
            ShortUrl shortUrl = new ShortUrl(longUrl, customAlias, LocalDateTime.now(),
                                             expiresAt, createdBy, hashShortCode);
            if (shortUrlRepo.saveIfAbsent(shortUrl)) return hashShortCode;
        }
        throw new RuntimeException("Error while generating short url");
    }

    public String resolve(String shortCode, String userId, String source) {
        Optional<ShortUrl> shortUrl = shortUrlRepo.findByShortCode(shortCode);
        if (!shortUrl.isPresent()) throw new RuntimeException("URL not found");
        ShortUrl url = shortUrl.get();
        if (url.isExpired()) throw new RuntimeException("URL has expired");
        url.incrementClicks();
        clickEventRepo.save(new ClickEvent(shortCode, userId, source, LocalDateTime.now()));
        return url.getOriginalUrl();
    }

    public UrlStats getStats(String shortCode) {
        Optional<ShortUrl> shortUrl = shortUrlRepo.findByShortCode(shortCode);
        if (!shortUrl.isPresent()) throw new RuntimeException("URL not found");
        ShortUrl url = shortUrl.get();
        // No expiry check — analytics are historical
        List<ClickEvent> events = clickEventRepo.findByShortCode(shortCode);
        return new UrlStats(url.getClickCount(), url.getCreatedAt(), url.getExpiresAt(), events);
    }
}

// ════════════════════════════════════════════════════════
// BACKGROUND JOB
// ════════════════════════════════════════════════════════

class ExpiryCleanupJob {
    private final ShortUrlRepository shortUrlRepo;
    private final int cronInterval;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public ExpiryCleanupJob(ShortUrlRepository shortUrlRepo, int cronInterval) {
        this.shortUrlRepo = shortUrlRepo;
        this.cronInterval = cronInterval;
    }

    // Separate start() — not in constructor — unit tests can create without triggering scheduler
    public void start() {
        scheduler.scheduleAtFixedRate(this::run, 0, cronInterval, TimeUnit.SECONDS);
    }

    private void run() {
        List<ShortUrl> expired = shortUrlRepo.findAllExpired();
        for (ShortUrl url : expired) {
            shortUrlRepo.delete(url.getShortCode());
        }
        // ClickEvents NOT deleted — analytics are historical (ON DELETE SET NULL in real DB)
    }
}`,
        clientCode: `// ════════════════════════════════════════════════════════
// WIRING + CLIENT USAGE
// ════════════════════════════════════════════════════════

ShortUrlRepository   shortUrlRepo   = new ShortUrlRepository();
ClickEventRepository clickEventRepo = new ClickEventRepository();
CodeGenerationStrategy strategy     = new HashBasedStrategy(); // swap to Counter/Random — no service change
UrlShortenerService  service        = new UrlShortenerService(shortUrlRepo, clickEventRepo, strategy);
ExpiryCleanupJob     cleanupJob     = new ExpiryCleanupJob(shortUrlRepo, 60); // cleanup every 60 sec
cleanupJob.start();

// 1. Shorten with auto-generated code (TTL = 1 hour)
String shortCode = service.shorten("https://google.com/very/long/path", null, 3600, "alice");
System.out.println("Short code: " + shortCode); // e.g. "a3f9c1"

// 2. Shorten with custom alias
String alias = service.shorten("https://github.com/dhirajkumar", "dhiraj", 86400, "alice");
System.out.println("Alias: " + alias); // "dhiraj"

// 3. Resolve (redirect)
String original = service.resolve(shortCode, "bob", "mobile");
System.out.println("Original: " + original); // https://google.com/very/long/path

// 4. Analytics
UrlStats stats = service.getStats(shortCode);
System.out.println("Clicks: " + stats.getClickCount());
System.out.println("Events: " + stats.getRecentEvents().size());

// 5. Resolve expired URL — throws RuntimeException("URL has expired")
// 6. Resolve unknown code — throws RuntimeException("URL not found")
// 7. Duplicate alias — throws RuntimeException("Alias already taken")`,
        irisWalkthrough: [
          {
            phase: 'Step 0 — Align',
            score: null,
            scoreNote: null,
            questions: [
              {
                q: 'What did you say to align before diving in?',
                a: 'Two lines confirming understanding: "So we are building a URL shortening service — users give us a long URL, we return a 6-character code, and when someone hits that code we redirect them to the original. I will gather requirements, design entities, and implement the core flows. Should I proceed?"',
              },
              {
                q: 'Why always do Step 0 even if you know the system?',
                a: 'It signals structured thinking and gives the interviewer a chance to correct scope before you go deep. Missing this makes you look like you are jumping to code — which is exactly what interviewers penalise.',
              },
            ],
            mistakes: [
              'Skipping Step 0 entirely — always do two alignment lines before starting, even for well-known systems',
            ],
          },
          {
            phase: 'Step 1 — Requirements Gathering (70%)',
            score: 70,
            scoreNote: 'Missing quantified throughput NFRs and scalable storage discussion',
            questions: [
              {
                q: 'What is a URL shortener?',
                a: 'A system that takes a long URL and returns a short 6-character code. When you hit the short URL, it redirects you to the original.',
              },
              {
                q: 'What features should we support?',
                a: 'shorten(longUrl) → shortCode, resolve(shortCode) → longUrl, custom alias support, TTL-based expiry (absolute, not relative), click analytics with metadata.',
              },
              {
                q: 'What is absolute expiry vs relative expiry?',
                a: 'Absolute: URL expires at a fixed timestamp (expiresAt = createdAt + ttl). Relative would reset on every access. We use absolute — otherwise a heavily-clicked URL never expires.',
              },
              {
                q: 'What are the NFRs?',
                a: 'High read throughput (resolve >> shorten), eventual consistency for analytics is fine, in-memory storage for this problem. Missing: quantified numbers like 1000 req/sec, 10M URLs — always add these.',
              },
            ],
            mistakes: [
              'Did not quantify NFRs — "high throughput" is vague; say "1000 reads/sec, 10M total URLs"',
              'Did not mention storage strategy (in-memory vs Redis vs relational DB) — good to propose and confirm',
              'Did not propose scalable storage decision upfront — Iris had to prompt this',
            ],
          },
          {
            phase: 'Step 2 — Entity Design (Class Diagram)',
            score: 78,
            scoreNote: 'ClickEvent FK and 1:N relationship needed more discussion',
            questions: [
              {
                q: 'What are the main entities?',
                a: 'ShortUrl (the core entity — holds shortCode, originalUrl, alias, TTL, createdBy, clickCount) and ClickEvent (analytics record per redirect — shortCode FK, clickedBy, source, clickedAt).',
              },
              {
                q: 'Should clickCount be on ShortUrl or computed from ClickEvent?',
                a: 'Both make sense. We store it on ShortUrl as an AtomicInteger for O(1) reads. ClickEvent holds the full history for time-based analytics.',
              },
              {
                q: 'What is the relationship between ShortUrl and ClickEvent?',
                a: 'One-to-many. One shortCode → many ClickEvents. FK (shortCode) lives on the ClickEvent side — the many side always holds the FK.',
              },
              {
                q: 'If we delete a ShortUrl, what happens to its ClickEvents?',
                a: 'In a real DB we use ON DELETE SET NULL — shortCode column on ClickEvent becomes null, record is preserved for analytics. In our in-memory model we simply do not delete ClickEvents when cleaning up expired ShortUrls.',
              },
            ],
            mistakes: [
              'Initially unsure where FK lives — always: FK is on the many side (ClickEvent.shortCode)',
              'Did not immediately see that one originalUrl can map to multiple shortCodes (custom alias + generated code)',
              'Needed prompt to think about ON DELETE SET NULL reasoning',
            ],
          },
          {
            phase: 'Step 3 — Schema Design (Skipped — in-memory)',
            score: null,
            scoreNote: null,
            questions: [
              {
                q: 'Why was Schema Design skipped here?',
                a: 'The interviewer confirmed in-memory storage. Schema design is only needed when you persist data to a DB. For in-memory, ConcurrentHashMap is the "storage" — no tables, no FKs needed.',
              },
              {
                q: 'What would the schema look like if we had a real DB?',
                a: 'Two tables: short_urls (shortCode PK, originalUrl, customAlias, createdAt, expiresAt, createdBy, clickCount) and click_events (id PK, shortCode FK → short_urls ON DELETE SET NULL, clickedBy, source, clickedAt). Index on shortCode in both tables for O(1) lookup.',
              },
            ],
            mistakes: [],
          },
          {
            phase: 'Step 4 — Implementation (84% → 87%)',
            score: 87,
            scoreNote: 'putIfAbsent called out as senior-level thinking. Weak: salt logic, missing stubs, naming typos',
            questions: [
              {
                q: 'How do we prevent collision when two threads shorten the same URL simultaneously?',
                a: 'Use putIfAbsent on ConcurrentHashMap. It is atomic — it checks AND inserts in one operation. No race condition between check and insert. Returns null if inserted, existing value if key already exists.',
              },
              {
                q: 'What salt should we use in HashBasedStrategy to handle collisions?',
                a: 'generate(longUrl + UUID.randomUUID()) — not longUrl + retryCnt. If we use retryCnt, same URL always produces same first hash. UUID ensures a fresh random input every attempt.',
              },
              {
                q: 'Why CopyOnWriteArrayList for ClickEvents?',
                a: 'ClickEvents are read far more than written (every analytics query vs every redirect). CopyOnWriteArrayList gives lock-free reads — the write copies the entire array, but reads are always non-blocking.',
              },
              {
                q: 'Why is ExpiryCleanupJob.start() separate from the constructor?',
                a: 'Testability. If scheduler starts in the constructor, every test that instantiates the class starts background threads. With a separate start(), tests can create the object without triggering scheduling.',
              },
              {
                q: 'Should getStats() check expiry before returning?',
                a: 'No. Analytics is historical data. Even if a URL is expired, the click history should still be accessible. Only resolve() throws on expiry.',
              },
              {
                q: 'What return type should getStats() use — Map<String,Object> or UrlStats class?',
                a: 'UrlStats class. This is self-documenting code — the caller knows exactly what fields exist. Map<String,Object> loses type safety and forces callers to know string keys.',
              },
            ],
            mistakes: [
              'HashBasedStrategy salt: used longUrl + retryCnt — same URL always produces same first hash; must use UUID',
              'resolve() passed null for clickedBy and source — should accept optional metadata params',
              'Missing CounterBasedStrategy and RandomBasedStrategy stubs — if you mention them in design, implement them',
              'Naming typos: clicketAt → clickedAt, croneInterval → cronInterval',
              'Left scaffold dead code (URLEntry, CodeGenerator stubs) in submission — remove before submitting',
              'Used new Executors.newSingleThreadScheduledExecutor() — Executors is a static factory, no new keyword',
              'Used scheduler.scheduledAtFixedRate — extra d; correct: scheduleAtFixedRate',
              'Pasted full code without explaining reasoning mid-implementation — engage verbally first',
            ],
          },
        ],
      },
    ],

    animations: [],
    problems: [],
  },

  designpatterns: {
    intro: `Design patterns are reusable solutions to recurring object-oriented design problems. They are not code — they are blueprints. Each pattern captures a proven approach to a specific structural or behavioral challenge, so you can apply it without reinventing the solution.`,
    whyItWorks: `Patterns give you a shared vocabulary. When you say "use a Singleton here" or "wrap it in a Decorator", every engineer on the team instantly understands the structure and intent. Patterns also encode known pitfalls — the gotchas that would take you hours to debug on your own are already documented.`,
    teachingFlow: [
      { step: 'Creational', desc: 'Singleton, Builder, Factory, Abstract Factory, Prototype — how to create objects cleanly.' },
      { step: 'Structural', desc: 'Adapter, Facade, Decorator, Flyweight — how to compose objects and hide complexity.' },
      { step: 'Behavioral', desc: 'Strategy, Observer — how objects communicate and delegate behavior.' },
      { step: 'Real-world examples', desc: 'Every pattern paired with a production scenario: logger, payment gateway, AI provider, chess game.' },
      { step: 'Gotchas', desc: 'The bugs each pattern is designed to prevent — and the bugs you can still introduce if you apply it wrong.' },
    ],
    keyInsight: 'A pattern is only as good as your understanding of WHY it exists. Know the problem it solves — not just its structure — and you will never apply the wrong pattern.',
    patternsTitle: 'The 10 Design Patterns',
    patterns: [
      {
        name: 'Pattern 1 — Singleton',
        when: 'Exactly ONE instance should exist across the entire application.',
        whyThisPattern: 'Logger, DB connection pool, config manager — if two instances exist, you get split state, duplicate connections, or inconsistent config. Singleton ensures one instance, lazily created, thread-safe via DCL.',
        examples: 'Logger, Database Connection Pool, Configuration Manager, Thread Pool',
        gaonKiBaat: 'Gaon mein ek hi Pradhan hota hai. Agar naya Pradhan banana chaahe, toh wahi purana Pradhan milta hai.',
        code: `public class Logger {
    private static volatile Logger instance;
    private Logger() { }

    public static Logger getInstance() {
        if (instance == null) {
            synchronized (Logger.class) {
                if (instance == null) {
                    instance = new Logger();
                }
            }
        }
        return instance;
    }

    public void log(String message) {
        System.out.println(message);
    }
}`,
      },
      {
        name: 'Pattern 2 — Builder',
        when: 'Object has many fields — especially optional ones — and constructor args become confusing.',
        whyThisPattern: 'new DB("admin", "jdbc://...", "secret", true, 10, false) — which is url and which is username? Builder names each field explicitly, validates in build(), and prevents half-built objects.',
        examples: 'DatabaseConfiguration, HTTP Request, Email, SQL Query',
        gaonKiBaat: 'Gaon mein makaan banane wala pehle neev daalta hai, phir deewaar, phir chhat — ek ek step mein.',
        code: `public class DatabaseConfiguration {
    private final String url;
    private final String username;
    private final int maxConnections;

    private DatabaseConfiguration(Builder builder) {
        this.url = builder.url;
        this.username = builder.username;
        this.maxConnections = builder.maxConnections;
    }

    public static class Builder {
        private String url;
        private String username;
        private int maxConnections = 10;

        public Builder setUrl(String url)       { this.url = url; return this; }
        public Builder setUsername(String u)    { this.username = u; return this; }
        public Builder setMaxConnections(int n) { this.maxConnections = n; return this; }

        public DatabaseConfiguration build() {
            if (url == null) throw new RuntimeException("URL required");
            return new DatabaseConfiguration(this);
        }
    }
}

// Usage
DatabaseConfiguration config = new DatabaseConfiguration.Builder()
    .setUrl("jdbc://localhost:5432/mydb")
    .setUsername("admin")
    .setMaxConnections(20)
    .build();`,
      },
      {
        name: 'Pattern 3 — Simple Factory',
        when: 'Object creation logic should be in one place, not scattered across callers. BUT adding a new type requires editing the factory — violates OCP.',
        whyThisPattern: 'Every caller was doing if (type == "email") new EmailNotification() ... — creation logic duplicated everywhere. Factory centralises it. Limitation: adding "slack" means editing the if-else chain.',
        examples: 'Notification sender (SMS/Email/Push), Audio player (MP3/WAV/FLAC)',
        gaonKiBaat: 'Gaon mein jalebi banane wala ek hi hota hai — tu sirf bolta hai "jalebi do" aur woh bana ke deta hai.',
        code: `public class NotificationFactory {
    public static Notification create(String type, String recipient, String message) {
        if (type.equals("email")) return new EmailNotification(recipient, message);
        if (type.equals("sms"))   return new SmsNotification(recipient, message);
        if (type.equals("push"))  return new PushNotification(recipient, message);
        throw new IllegalArgumentException("Unknown type: " + type);
    }
}

// ❌ OCP Violation: adding "slack" → must edit this if-else`,
      },
      {
        name: 'Pattern 4 — Abstract Factory',
        when: 'You need a FAMILY of related objects from the same provider — consistency guaranteed.',
        whyThisPattern: 'Simple Factory returns one object. Abstract Factory returns a whole family. OpenAI chat + Anthropic vector = incompatible. Abstract Factory ensures both come from the same provider.',
        examples: 'AI provider (chat + vector from same provider), UI themes (button + dialog), Audio (decoder + player + processor)',
        gaonKiBaat: 'Ek hi dukan se chai bhi lo aur samosa bhi lo — dono Sharma ji ke hain, ek saath theek lagte hain.',
        code: `public interface AiClientFactory {
    AiChatClient   getAiChatClient();
    AiVectorClient getAiVectorClient();
}

public class OpenAiClientFactory implements AiClientFactory {
    @Override public AiChatClient   getAiChatClient()   { return new OpenAiChatClient(); }
    @Override public AiVectorClient getAiVectorClient() { return new OpenAiVectorClient(); }
}

public class ChatService {
    private final AiChatClient   chatClient;
    private final AiVectorClient vectorClient;

    public ChatService(AiClientFactory factory) {
        this.chatClient   = factory.getAiChatClient();   // same provider
        this.vectorClient = factory.getAiVectorClient(); // same provider — guaranteed
    }
}

ChatService openAiService = new ChatService(new OpenAiClientFactory());`,
      },
      {
        name: 'Pattern 5 — Factory + Registry (Open/Closed)',
        when: 'New providers must be addable WITHOUT editing existing factory code.',
        whyThisPattern: 'Fixes OCP violation of Simple Factory. New factory self-registers via static block on class load. Existing code never changes. Adding Gemini = zero edits to ClientFactoryProvider.',
        examples: 'AI provider plugins, Payment gateway plugins, Notification channel plugins',
        gaonKiBaat: 'Naya dukandaar aaya — usne apna naam khud register karwaya panchayat mein. Panchayat ko kuch badalna nahi pada.',
        code: `public class ClientFactoryProvider {
    private static final Map<String, AiClientFactory> registry = new HashMap<>();

    public static void register(String provider, AiClientFactory factory) {
        registry.put(provider, factory);
    }
    public static AiClientFactory getAiClientFactory(String provider) {
        AiClientFactory f = registry.get(provider);
        if (f == null) throw new IllegalArgumentException("Unknown: " + provider);
        return f;
    }
}

// Self-registration via static block — runs once when JVM loads this class
public class GeminiClientFactory implements AiClientFactory {
    static {
        ClientFactoryProvider.register("gemini", new GeminiClientFactory());
    }
    @Override public AiChatClient   getAiChatClient()   { return new GeminiChatClient(); }
    @Override public AiVectorClient getAiVectorClient() { return new GeminiVectorClient(); }
}

// Adding Gemini → ZERO changes to existing code`,
      },
      {
        name: 'Pattern 6 — Prototype + Registry',
        when: 'Creating an object is expensive and you need many similar copies — clone a template instead of building from scratch.',
        whyThisPattern: 'Fetching from DB for every user in a 10,000-email campaign = minutes. Clone a template once and customize per clone = milliseconds. Registry stores templates; always returns clones, never the template itself.',
        examples: 'Email/SMS campaigns, Invoice generation, VM provisioning, Game enemy spawning, Mock objects for tests',
        gaonKiBaat: 'Gaon mein ek baar achha beej mila — usse baar baar zameen se nahi nikaalte. Uski copy banao aur customize karo.',
        code: `public interface Prototype<T> { T clone(); }

public class VMInstance implements Prototype<VMInstance> {
    private String os;
    private List<String> installedPackages = new ArrayList<>();

    // Copy constructor — deep copy including collections
    public VMInstance(VMInstance other) {
        this.os = other.os;
        this.installedPackages = new ArrayList<>(other.installedPackages); // deep copy!
    }

    @Override public VMInstance clone() { return new VMInstance(this); }
}

public class VMInstanceRegistry {
    private HashMap<String, VMInstance> registry = new HashMap<>();

    public void addVMInstance(String key, VMInstance template) {
        registry.putIfAbsent(key, template);
    }
    public VMInstance getVMInstance(String key) {
        VMInstance template = registry.get(key);
        return template == null ? null : template.clone(); // ALWAYS clone
    }
}`,
      },
      {
        name: 'Pattern 7 — Adapter',
        when: 'External API or class cannot be modified, but its interface does not match what your system expects.',
        whyThisPattern: 'YesBank SDK has makePayment(), your system expects processPayment(). You cannot modify YesBank SDK. Adapter wraps it and translates — caller only sees your BankApi interface.',
        examples: 'Payment gateway integration, Social media posting (Twitter/Facebook), Translation APIs (Google/Microsoft)',
        gaonKiBaat: 'Ek banda Bhojpuri mein bolta hai, dusra English mein sunna chahta hai. Adapter woh translator hai.',
        code: `// Target interface — what YOUR system expects
public interface BankApi {
    void processPayment(String amount, String currency);
    String getTransactionStatus(String txnId);
}

// Adaptee — external SDK you CANNOT modify
public class YesBankSdk {
    public void makePayment(double amount, String curr) { }
    public String checkTxn(String ref) { return "TXN_SUCCESS"; }
}

// Adapter — written by YOU, holds the adaptee as a field (prefer composition)
public class YesBankAdapter implements BankApi {
    private YesBankSdk yesBankSdk;

    public YesBankAdapter(YesBankSdk sdk) { this.yesBankSdk = sdk; }

    @Override
    public void processPayment(String amount, String currency) {
        yesBankSdk.makePayment(Double.parseDouble(amount), currency); // translate
    }
    @Override
    public String getTransactionStatus(String txnId) {
        String raw = yesBankSdk.checkTxn(txnId);
        return raw.equals("TXN_SUCCESS") ? "SUCCESS" : "FAILED"; // normalize
    }
}

BankApi bank = new YesBankAdapter(new YesBankSdk());
bank.processPayment("500.00", "INR");`,
      },
      {
        name: 'Pattern 8 — Facade',
        when: 'Multiple subsystems need to be orchestrated in sequence, and you want to hide that complexity behind one simple entry point.',
        whyThisPattern: 'Client was calling InventoryService, InvoiceService, MailService in order — too much knowledge. Facade centralises the sequence. NO business logic in Facade — it only wires calls together.',
        examples: 'Amazon Place Order (Inventory + Invoice + Email), Image editing pipeline, Travel booking',
        gaonKiBaat: 'Amazon se order karo — ek hi button dabao. Peeche Inventory, Invoice, Email — teen alag karamchari. Facade wahi receptionist hai.',
        code: `public class InventoryService  { public void updateInventory(Order o)  { } }
public class InvoiceService    { public void generateInvoice(Order o)  { } }
public class MailService       { public void sendEmail(Order o)        { } }

// Facade — holds all services, orchestrates in sequence, ZERO business logic
public class PlaceOrderFacade {
    private InventoryService inventoryService = new InventoryService();
    private InvoiceService   invoiceService   = new InvoiceService();
    private MailService      mailService      = new MailService();

    public void placeOrder(Order order) {
        inventoryService.updateInventory(order); // step 1
        invoiceService.generateInvoice(order);   // step 2
        mailService.sendEmail(order);            // step 3
    }
}

// Manager — holds ONLY the Facade (not the services directly)
public class OrderManager {
    private PlaceOrderFacade facade = new PlaceOrderFacade();
    public void processOrder(Order order) { facade.placeOrder(order); }
}`,
      },
      {
        name: 'Pattern 9 — Decorator + Flyweight',
        when: 'Decorator: add behaviour at runtime without subclassing. Flyweight: share immutable objects to save memory when many identical copies exist.',
        whyThisPattern: 'Decorator avoids class explosion (EspressoWithMilkAndSugar subclass). Flyweight avoids object explosion (16 white pawns in chess = one shared object with position passed externally).',
        examples: 'Notification with logging + retry, Coffee condiments, Chess piece sharing, Game enemy spawning',
        gaonKiBaat: 'Decorator — chai pe adrak, phir elaichi — ek ke upar ek layer. Flyweight — gaon mein ek hi Ramleela costume, alag alag log pehnte hain.',
        code: `// DECORATOR
public interface Notification { void send(String message); }

public class EmailNotification implements Notification {
    @Override public void send(String message) { System.out.println("Email: " + message); }
}

public abstract class NotificationDecorator implements Notification {
    protected Notification wrapped;
    public NotificationDecorator(Notification w) { this.wrapped = w; }
}

public class RetryDecorator extends NotificationDecorator {
    private static final int MAX_COUNT = 5;
    public RetryDecorator(Notification wrapped) { super(wrapped); }

    @Override public void send(String message) {
        int cnt = 0;
        while (cnt < MAX_COUNT) { // MUST be while, not if
            try { wrapped.send(message); return; }
            catch (Exception e) { cnt++; }
        }
        throw new RuntimeException("Failed after " + MAX_COUNT + " retries");
    }
}

// FLYWEIGHT
public class ChessPiece {
    private final String colour; // intrinsic — shared, immutable
    private final String type;   // intrinsic — shared, immutable

    public void render(int x, int y) { // x,y = extrinsic — passed in per call
        System.out.println(colour + " " + type + " at (" + x + "," + y + ")");
    }
}`,
      },
      {
        name: 'Pattern 10 — Strategy + Observer',
        when: 'Strategy: swap one algorithm at runtime. Observer: notify many subscribers when state changes.',
        whyThisPattern: 'Strategy = pick ONE algorithm (pricing: distance vs time vs surge). Observer = notify ALL (stock price changes → email, SMS, app all fire simultaneously). Never confuse the two.',
        examples: 'PricingStrategy (Distance/Time/Surge), StockTradingManager (Email/SMS/App), WeatherMonitor',
        gaonKiBaat: 'Strategy — ek tarika choose karo. Observer — horn baja, sab ek saath sunta hai.',
        code: `// STRATEGY
public interface PricingStrategy {
    Double calculateFare(double distance, double time); // Double not double
}

public class SurgePricingStrategy implements PricingStrategy {
    @Override public Double calculateFare(double distance, double time) {
        return (distance * 10.0 + time * 2.0) * 1.5;
    }
}

public class CabBooking {
    private PricingStrategy strategy;
    public CabBooking(PricingStrategy s) { this.strategy = s; }
    public Double calculateFare(double d, double t) { return strategy.calculateFare(d, t); }
}

// OBSERVER
public interface Observer { void onStockPriceChange(String name, double price); }

public abstract class Publisher {
    protected List<Observer> observers = new ArrayList<>();
    public void addObserver(Observer o)    { observers.add(o); }
    public void removeObserver(Observer o) { observers.remove(o); }
    public void notifyObservers(String name, double price) {
        for (Observer o : observers) o.onStockPriceChange(name, price);
    }
}

public class StockTradingManager extends Publisher {
    private EmailService emailService = new EmailService();
    { addObserver(emailService); } // instance initializer — registers without changing constructor
    public void onStockPriceChange(String name, double price) {
        if (price > threshold) notifyObservers(name, price);
    }
}`,
      },
    ],
    commonMistakes: [
      'Singleton: missing volatile → partially constructed object visible to other threads',
      'Singleton: resetInstance() using DCL → unnecessary; single synchronized block is enough',
      'Builder: setters returning void → method chaining breaks; must return this',
      'Builder: build() returning Builder instead of the main object',
      'Simple Factory: editing if-else for every new type → OCP violation; use Registry instead',
      'Abstract Factory: mixing providers (OpenAI chat + Anthropic vector) → runtime incompatibility',
      'Registry: circular static initialization → Factory references Registry in static block AND Registry references Factory → StackOverflowError',
      'Prototype: this.list = other.list → shallow copy; must use new ArrayList<>(other.list)',
      'Prototype Registry: returning original template instead of clone → caller mutates shared template',
      'Adapter: extending Adaptee instead of holding it as a field → prefer composition over inheritance',
      'Facade: adding if-else / validation inside Facade → business logic belongs in services',
      'Facade: Manager holding services directly instead of only Facade → pattern breaks',
      'Decorator (RetryDecorator): using if instead of while → retry never actually retries',
      'Flyweight: storing extrinsic state (position) inside flyweight object → all users see mutation',
      'Strategy: interface declaring double (primitive) not Double (wrapper) → reflection-based tests fail',
      'Observer: Publisher extending Publisher in concrete class → instance initializer needed for auto-registration',
    ],
    animations: [],
    problems: [],
    caseStudies: [],
  },
}

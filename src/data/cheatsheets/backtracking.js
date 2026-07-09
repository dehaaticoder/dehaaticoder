export const backtrackingCheatsheet = {
  topic: 'backtracking',
  title: 'Backtracking',

  // ── PATTERNS ────────────────────────────────────────────────────────────────
  patterns: [
    {
      name: 'Pick / Not Pick',
      icon: '🔀',
      when: 'Decide YES or NO for each element. 2 explicit recursive calls per node.',
      problems: ['Subsets', 'Subset Sum K', 'K-th Symbol', 'Combination Sum II'],
      template: `void solve(int[] arr, int idx, List<Integer> curr) {
    if (idx == arr.length) {
        result.add(new ArrayList<>(curr)); // collect at leaf
        return;
    }
    // PICK arr[idx]
    curr.add(arr[idx]);
    solve(arr, idx + 1, curr);
    curr.remove(curr.size() - 1);  // backtrack

    // NOT PICK arr[idx]
    solve(arr, idx + 1, curr);
}`,
    },
    {
      name: 'Two Explicit Calls',
      icon: '↕️',
      when: 'Make exactly 2 choices at each step (e.g. 1 step or 2 steps, open or close paren).',
      problems: ['Staircase Paths', 'Generate Parentheses'],
      template: `void solve(int n, List<Integer> path) {
    if (n == 0) {
        result.add(new ArrayList<>(path)); // base: reached goal
        return;
    }
    if (n < 0) return; // pruned

    // Choice 1: take 1 step
    path.add(1);
    solve(n - 1, path);
    path.remove(path.size() - 1);

    // Choice 2: take 2 steps
    path.add(2);
    solve(n - 2, path);
    path.remove(path.size() - 1);
}`,
    },
    {
      name: 'For Loop (Multi-branch)',
      icon: '🔁',
      when: 'More than 2 choices at each level. Loop over all valid options and recurse.',
      problems: ['Permutations', 'Letter Combinations', 'Combination Sum I', 'N-Queens'],
      template: `void solve(int[] nums, boolean[] visited, List<Integer> curr) {
    if (curr.size() == nums.length) {
        result.add(new ArrayList<>(curr)); // collect at leaf
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (visited[i]) continue;   // skip used elements
        visited[i] = true;
        curr.add(nums[i]);          // ADD
        solve(nums, visited, curr); // RECURSE
        curr.remove(curr.size()-1); // REMOVE (backtrack)
        visited[i] = false;
    }
}`,
    },
    {
      name: 'Grid DFS',
      icon: '🗺️',
      when: 'Explore all 4 directions from a cell. Mark visited to avoid cycles, unmark on backtrack.',
      problems: ['Maze Paths', 'Word Search', 'Shortest Path in Maze'],
      template: `int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

void dfs(char[][] grid, int r, int c, String path) {
    if (reached destination) {
        result.add(path);
        return;
    }
    char orig = grid[r][c];
    grid[r][c] = '#';              // mark visited

    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (valid(nr, nc) && grid[nr][nc] != '#') {
            dfs(grid, nr, nc, path + direction);
        }
    }
    grid[r][c] = orig;             // unmark (backtrack)
}`,
    },
  ],

  // ── STANDARD TEMPLATE ───────────────────────────────────────────────────────
  standardTemplate: {
    title: 'The Universal Backtracking Template',
    mantra: 'ADD → RECURSE → REMOVE',
    code: `void backtrack(state, curr, result) {
    // 1. BASE CASE — goal reached
    if (done(state)) {
        result.add(new ArrayList<>(curr)); // ALWAYS copy, never add curr directly
        return;
    }

    // 2. PRUNING — invalid state, stop early
    if (invalid(state)) return;

    // 3. CHOICES — try each valid option
    for (choice : validChoices(state)) {
        curr.add(choice);              // ADD
        backtrack(next(state), curr);  // RECURSE
        curr.remove(last);             // REMOVE
    }
}`,
  },

  // ── BIG-O TABLE ─────────────────────────────────────────────────────────────
  complexity: [
    { problem: 'Subsets',              tc: 'O(2ⁿ × n)',   sc: 'O(n)',   note: '2 choices per element' },
    { problem: 'Permutations',         tc: 'O(n! × n)',   sc: 'O(n)',   note: 'n! orderings' },
    { problem: 'Combination Sum I',    tc: 'O(2^(t/min))', sc: 'O(t/min)', note: 't=target, min=smallest candidate' },
    { problem: 'Combination Sum II',   tc: 'O(2ⁿ × n)',   sc: 'O(n)',   note: 'with HashSet dedup' },
    { problem: 'Subset Sum K',         tc: 'O(2ⁿ)',        sc: 'O(n)',   note: 'pruned — stops at sum>k' },
    { problem: 'Letter Combinations',  tc: 'O(4ⁿ × n)',   sc: 'O(n)',   note: '4 letters max per digit' },
    { problem: 'Generate Parentheses', tc: 'O(4ⁿ / √n)',  sc: 'O(n)',   note: 'Catalan number' },
    { problem: 'Staircase Paths',      tc: 'O(2ⁿ)',        sc: 'O(n)',   note: 'Fibonacci count' },
    { problem: 'Word Search',          tc: 'O(m×n × 4^L)', sc: 'O(L)',  note: 'L=word length' },
    { problem: 'N-Queens',             tc: 'O(n!)',         sc: 'O(n²)', note: 'one queen per row, heavy pruning' },
  ],

  // ── KEY RULES ────────────────────────────────────────────────────────────────
  rules: [
    {
      rule: 'Always copy when collecting',
      detail: 'result.add(new ArrayList<>(curr)) — NOT result.add(curr). curr gets modified later; adding the reference gives you empty lists at the end.',
      tag: 'gotcha',
    },
    {
      rule: 'Sort before HashSet dedup',
      detail: 'List.equals() is order-sensitive. [1,2] ≠ [2,1] in a HashSet. Sort the input so identical combinations always appear in the same order.',
      tag: 'gotcha',
    },
    {
      rule: 'Reuse vs no-reuse: idx vs idx+1',
      detail: 'Combination Sum I (reuse allowed): recurse with same idx. Combination Sum II (no reuse): recurse with idx+1.',
      tag: 'key',
    },
    {
      rule: 'Prune early, prune hard',
      detail: 'If sum > target (all positives), return immediately. No need to explore deeper — adding more only makes it worse.',
      tag: 'key',
    },
    {
      rule: 'Mark → recurse → unmark (Grid DFS)',
      detail: 'Mark cell visited before recursing, unmark after. Same as ADD→RECURSE→REMOVE. Forgetting to unmark = paths block each other.',
      tag: 'gotcha',
    },
    {
      rule: 'Two calls vs for loop',
      detail: 'Exactly 2 choices → two explicit calls (cleaner). More than 2 choices → for loop. Both are backtracking, just different branching.',
      tag: 'key',
    },
  ],

  // ── QUIZ QUESTIONS ───────────────────────────────────────────────────────────
  quiz: [
    {
      q: 'What is the correct order in the standard backtracking template?',
      options: ['Add → Recurse → Remove', 'Remove → Add → Recurse', 'Recurse → Add → Remove', 'Add → Remove → Recurse'],
      answer: 0,
      explanation: 'ADD the choice, RECURSE deeper, REMOVE the choice (backtrack). This is the universal mantra.',
    },
    {
      q: 'Why do we write result.add(new ArrayList<>(curr)) instead of result.add(curr)?',
      options: [
        'Java requires it for ArrayList',
        'curr is final and cannot be added directly',
        'curr is a reference — adding it directly means all entries point to the same list, which gets modified later',
        'To improve time complexity',
      ],
      answer: 2,
      explanation: 'curr is a mutable reference. If you add curr directly, every entry in result points to the same object — which ends up empty or wrong after backtracking.',
    },
    {
      q: 'In Combination Sum II, why must we sort the array before using HashSet<List<Integer>>?',
      options: [
        'Sorting improves time complexity',
        'List.equals() is order-sensitive — [1,2] ≠ [2,1] in HashSet. Sorting ensures identical combinations have the same order',
        'The problem statement requires sorted output',
        'To avoid index out of bounds exceptions',
      ],
      answer: 1,
      explanation: 'HashSet uses List.equals() which compares element by element in order. Without sorting, [1,2] and [2,1] look different even though they are the same combination.',
    },
    {
      q: 'What is the key difference between Combination Sum I and Combination Sum II?',
      options: [
        'CS1 allows element reuse (recurses with same idx); CS2 does not (recurses with idx+1)',
        'CS2 allows element reuse; CS1 does not',
        'CS1 uses for-loop; CS2 uses pick/not-pick',
        'CS1 sorts the array; CS2 does not',
      ],
      answer: 0,
      explanation: 'In CS1, when you pick candidates[i], you recurse with startIdx=i (same — reuse allowed). In CS2, you recurse with startIdx=i+1 (move forward — no reuse).',
    },
    {
      q: 'How many subsets does an array of n unique elements have?',
      options: ['n', 'n²', '2ⁿ', 'n!'],
      answer: 2,
      explanation: 'For each element you have exactly 2 choices: include or exclude. So total = 2 × 2 × ... n times = 2ⁿ.',
    },
    {
      q: 'Which backtracking pattern uses more than 2 explicit recursive calls?',
      options: ['Pick / Not Pick', 'Two Explicit Calls', 'For Loop (Multi-branch)', 'Grid DFS'],
      answer: 2,
      explanation: 'For Loop pattern: at each level you loop over all valid choices (could be 3, 4, or more). Pick/Not-Pick and Two Explicit Calls always make exactly 2 calls.',
    },
    {
      q: 'In Subset Sum K, why do we prune when sum > target?',
      options: [
        'Because the array is sorted',
        'Since all numbers are positive, adding more can only increase sum — no valid combination possible deeper',
        'The problem requires it',
        'To handle duplicate elements',
      ],
      answer: 1,
      explanation: 'All candidates are positive (≥1). Once sum exceeds target, every subsequent addition makes it larger. Pruning here avoids pointless exploration.',
    },
    {
      q: 'In Permutations using visited[], what does setting visited[i]=true mean?',
      options: [
        'Element i is available for use',
        'Element i is already in the current permutation — skip it',
        'Element i should be permanently excluded',
        'Element i is the final answer',
      ],
      answer: 1,
      explanation: 'visited[i]=true means nums[i] is already placed in curr. After backtracking (removing from curr), we set visited[i]=false to make it available again.',
    },
    {
      q: 'In Grid DFS backtracking (Word Search, Maze), what do we do after all 4 recursive calls return?',
      options: [
        'Mark the cell visited permanently',
        'Skip the cell next time',
        'Unmark the cell (restore to original) — backtrack',
        'Add the cell to the result',
      ],
      answer: 2,
      explanation: 'Mark → Recurse → Unmark. Same as Add → Recurse → Remove. Forgetting to unmark means the cell stays blocked for other paths.',
    },
    {
      q: 'For Generate Parentheses with n pairs, when can we add a closing ")"?',
      options: [
        'Any time',
        'Only when open count equals n',
        'Only when close count is less than open count',
        'Only at even positions',
      ],
      answer: 2,
      explanation: 'We can add ")" only when close < open. This guarantees we never close a bracket that was never opened. We can add "(" when open < n.',
    },
    {
      q: 'In the K-th Symbol in Grammar problem, the left child of any node has what value?',
      options: [
        'Always 0',
        'Always 1',
        'Same value as its parent',
        'Flipped value of its parent',
      ],
      answer: 2,
      explanation: 'Rule: 0 → [0,1] and 1 → [1,0]. Left child = copy of parent, Right child = flip of parent. So left is always the same.',
    },
    {
      q: 'The number of valid staircase paths for n steps (1 or 2 at a time) follows which sequence?',
      options: ['Powers of 2 (2ⁿ)', 'Fibonacci sequence', 'Factorial (n!)', 'Triangular numbers'],
      answer: 1,
      explanation: 'Ways(n) = Ways(n-1) + Ways(n-2) — exactly the Fibonacci recurrence. Ways(1)=1, Ways(2)=2, Ways(3)=3, Ways(4)=5 ...',
    },
    {
      q: 'Letter Combinations of "23": digit 2→abc, digit 3→def. How many combinations are there?',
      options: ['6', '8', '9', '12'],
      answer: 2,
      explanation: '3 letters for digit 2 × 3 letters for digit 3 = 9 combinations. Pattern: product of letters per digit.',
    },
    {
      q: 'Which of these is NOT a valid reason to prune a backtracking branch?',
      options: [
        'Current sum exceeds the target',
        'Current index exceeds array length',
        'Current path length is less than required',
        'Character not matching in Word Search',
      ],
      answer: 2,
      explanation: 'Path length being less than required is NOT a reason to prune — we continue recursing to build it up. The other three are all valid pruning conditions.',
    },
  ],
}

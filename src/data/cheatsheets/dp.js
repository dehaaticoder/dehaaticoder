export const dpCheatsheet = {
  title: 'Dynamic Programming',
  icon: '🧮',
  tagline: 'Break it down, remember the past, never repeat yourself.',

  // ── PATTERNS ────────────────────────────────────────────────────────────────
  patterns: [
    {
      name: '1D DP — Fibonacci-style',
      icon: '📈',
      when: 'Answer at position n depends only on the previous 1 or 2 positions.',
      problems: ['Fibonacci', 'Climbing Stairs', 'House Robber', 'Perfect Squares'],
      template: `// Top-Down (Memoization)
int[] memo = new int[n + 1];
Arrays.fill(memo, -1);
int solve(int n) {
    if (n <= 1) return base;           // base case
    if (memo[n] != -1) return memo[n]; // cache hit
    memo[n] = solve(n - 1) + solve(n - 2); // recurrence
    return memo[n];
}

// Bottom-Up (Tabulation) — O(1) space with rolling vars
int prev2 = base0, prev1 = base1;
for (int i = 2; i <= n; i++) {
    int curr = prev1 + prev2;    // recurrence
    prev2 = prev1;
    prev1 = curr;
}
return prev1;`,
    },
    {
      name: '2D DP — Grid / Matrix',
      icon: '🗺️',
      when: 'State needs two variables (e.g. row+col, index+remaining sum). Choices move in two directions.',
      problems: ['Unique Paths', 'N-Digit Numbers', '0-1 Knapsack', 'Subset Sum'],
      template: `// Bottom-Up 2D — fill row by row
int[][] dp = new int[rows][cols];
// base cases: first row and first column
for (int j = 0; j < cols; j++) dp[0][j] = 1;
for (int i = 0; i < rows; i++) dp[i][0] = 1;

for (int i = 1; i < rows; i++) {
    for (int j = 1; j < cols; j++) {
        dp[i][j] = dp[i-1][j] + dp[i][j-1]; // Unique Paths
    }
}
return dp[rows-1][cols-1];

// Space-Optimized 2D → 1D rolling array O(cols) space
int[] dp = new int[cols];
Arrays.fill(dp, 1); // base: first row = all 1s
for (int i = 1; i < rows; i++) {
    for (int j = 1; j < cols; j++) {
        dp[j] += dp[j-1]; // dp[j] = dp[i-1][j] (above), dp[j-1] = dp[i][j-1] (left)
    }
}
return dp[cols-1];`,
    },
    {
      name: '0-1 Knapsack',
      icon: '🎒',
      when: 'Each item picked at most once (bounded). State = (items considered, capacity remaining). Decision: include or exclude.',
      problems: ['0-1 Knapsack', 'Subset Sum', 'Target Sum'],
      template: `// 0-1 Knapsack — 2D DP
// dp[i][j] = max profit using first i items with capacity j
int[][] dp = new int[n+1][W+1];
for (int i = 1; i <= n; i++) {
    for (int j = 0; j <= W; j++) {
        dp[i][j] = dp[i-1][j];                               // exclude
        if (j >= wt[i-1])
            dp[i][j] = Math.max(dp[i][j],
                        profit[i-1] + dp[i-1][j - wt[i-1]]); // include
    }
}
return dp[n][W];

// Space-Optimized: traverse j RIGHT→LEFT so i-1 row is still intact
int[] dp = new int[W+1];
for (int i = 0; i < n; i++) {
    for (int j = W; j >= wt[i]; j--) {   // ← RIGHT to LEFT (key!)
        dp[j] = Math.max(dp[j], profit[i] + dp[j - wt[i]]);
    }
}
return dp[W];`,
    },
    {
      name: 'Unbounded Knapsack',
      icon: '♾️',
      when: 'Each item can be picked unlimited times (unbounded). Decision: include (stay at same item) or exclude (move to next item).',
      problems: ['Coin Change I (Permutation)', 'Coin Change II (Combination)', 'Cutting the Rod', 'Unbounded Knapsack'],
      template: `// Unbounded Knapsack — pick same item multiple times
// KEY: dp[i-1][j-w] → dp[i][j-w]  (i doesn't decrement when picking)
int[] dp = new int[W+1];
for (int i = 0; i < n; i++) {
    for (int j = wt[i]; j <= W; j++) {  // ← LEFT to RIGHT (key!)
        dp[j] = Math.max(dp[j], profit[i] + dp[j - wt[i]]);
    }
}

// Coin Change II (Combination — order doesn't matter)
// outer = coins, inner = amount
for (int coin : coins) {
    for (int amt = coin; amt <= amount; amt++) {
        dp[amt] += dp[amt - coin];
    }
}

// Coin Change I (Permutation — order matters)
// outer = amount, inner = coins
for (int amt = 1; amt <= amount; amt++) {
    for (int coin : coins) {
        if (amt >= coin) dp[amt] += dp[amt - coin];
    }
}`,
    },
  ],

  // ── BIG-O TABLE ──────────────────────────────────────────────────────────────
  complexity: [
    { problem: 'Fibonacci (tabulation)',    tc: 'O(N)',       sc: 'O(1)',    note: 'two rolling vars' },
    { problem: 'Climbing Stairs',           tc: 'O(N)',       sc: 'O(1)',    note: 'same recurrence as Fibonacci' },
    { problem: 'Perfect Squares',           tc: 'O(N√N)',     sc: 'O(N)',    note: 'inner loop: all squares ≤ i' },
    { problem: 'House Robber',              tc: 'O(N)',       sc: 'O(1)',    note: 'rolling prev1/prev2' },
    { problem: 'Unique Paths',              tc: 'O(N×M)',     sc: 'O(M)',    note: 'space-opt: 1D rolling array' },
    { problem: 'Subset Sum / Target Sum',   tc: 'O(N×K)',     sc: 'O(N×K)', note: 'K = target sum' },
    { problem: '0-1 Knapsack',             tc: 'O(N×W)',     sc: 'O(W)',    note: 'space-opt: right→left inner loop' },
    { problem: 'Fractional Knapsack',       tc: 'O(N log N)', sc: 'O(N)',    note: 'Greedy — not DP!' },
    { problem: 'Cutting the Rod',           tc: 'O(N²)',      sc: 'O(N)',    note: 'unbounded KS on rod lengths' },
    { problem: 'Coin Change (either)',      tc: 'O(N×K)',     sc: 'O(K)',    note: 'N=coins, K=amount' },
    { problem: 'Extended 0-1 KS (huge W)', tc: 'O(N×P)',     sc: 'O(N×P)', note: 'P=maxProfit; flip W↔P axes' },
  ],

  // ── TC/SC GUIDE ──────────────────────────────────────────────────────────────
  complexityGuide: {
    title: 'How to Calculate TC & SC in DP',
    intro: 'Every DP TC follows one formula. SC depends on whether you space-optimize.',
    cases: [
      {
        name: 'TC Formula',
        formula: 'TC = (# unique subproblems) × (work per subproblem)',
        when: 'Count distinct dp states × cost to compute each state.',
        example: '0-1 Knapsack: N items × W capacity = N×W states, O(1) work each → TC = O(N×W)',
        problems: ['All DP problems'],
        color: 'blue',
      },
      {
        name: 'SC — Memoization (Top-Down)',
        formula: 'SC = dp array size + recursive stack depth',
        when: 'Top-down with recursion.',
        example: 'Unique Paths: dp[N][M] + stack O(N+M) → O(N×M + N+M) = O(N×M)',
        problems: ['Fibonacci', 'Unique Paths', 'Knapsack top-down'],
        color: 'green',
      },
      {
        name: 'SC — Tabulation (Bottom-Up)',
        formula: 'SC = dp array size only (no stack)',
        when: 'Bottom-up iterative — no recursive stack overhead.',
        example: '0-1 Knapsack space-opt: 1D dp[W+1] → SC = O(W)',
        problems: ['All tabulation solutions'],
        color: 'purple',
      },
    ],
    scRules: [
      { rule: '2D → 1D rolling array', detail: 'If dp[i][j] depends only on dp[i-1][j] and dp[i][j-1], reduce to 1D by processing row by row. Save O(N×M) → O(M).' },
      { rule: '0-1 KS: right→left inner loop', detail: 'To avoid using the same item twice, traverse capacity right to left. This reuses the i-1 row implicitly in a 1D array.' },
      { rule: 'Unbounded KS: left→right inner loop', detail: 'To allow reusing the same item, traverse capacity left to right. dp[j-w] already reflects the current item being picked again.' },
      { rule: 'Coin Change loop order is the KEY', detail: 'Combination (order doesn\'t matter): outer=coins, inner=amount. Permutation (order matters): outer=amount, inner=coins.' },
    ],
  },

  // ── KEY RULES ────────────────────────────────────────────────────────────────
  rules: [
    {
      rule: '0-1 KS inner loop: RIGHT → LEFT',
      detail: 'When reducing 0-1 Knapsack to 1D, the inner capacity loop must go W down to wt[i]. Going left-to-right would pick the same item twice (unbounded behavior).',
      tag: 'gotcha',
    },
    {
      rule: 'Unbounded KS inner loop: LEFT → RIGHT',
      detail: 'Unbounded KS (Coin Change, Cutting the Rod) goes left to right — dp[j-w] reflects the current item already being included again.',
      tag: 'key',
    },
    {
      rule: 'Coin Change: outer determines permutation vs combination',
      detail: 'outer=amount → Permutation (counts orderings). outer=coins → Combination (no duplicate orderings). This is the single most testable DP insight.',
      tag: 'gotcha',
    },
    {
      rule: 'Fractional Knapsack → Greedy, NOT DP',
      detail: 'If you can take a fraction of an item, sort by H/W ratio and take greedily. DP is not needed (and is slower). Only use DP when items are whole (0-1 or unbounded).',
      tag: 'key',
    },
    {
      rule: 'Extended 0-1 KS: flip axes when W is huge',
      detail: 'When W can be 10^9, dp[N][W] is too large. Flip: dp[i][j] = min weight to achieve exactly j profit. Answer = largest j such that dp[N][j] ≤ W.',
      tag: 'gotcha',
    },
    {
      rule: 'Base case: dp[0] = 1 for counting paths/coins',
      detail: 'For Unique Paths: dp[0][j]=1 and dp[i][0]=1 (one way to reach any cell on border). For Coin Change: dp[0]=1 (one way to make 0 — use no coins).',
      tag: 'key',
    },
    {
      rule: 'Memoization sentinel: -1, not 0',
      detail: 'Use -1 as the "unsolved" marker, not 0. Many DP answers can be 0 (e.g. isPossible=false). Using 0 as sentinel causes false cache hits.',
      tag: 'gotcha',
    },
    {
      rule: 'Always copy dp state before space-optimizing',
      detail: 'Verify correctness with 2D first. Only collapse to 1D after confirming dp[i][j] depends only on the previous row. Collapsing the wrong dimension gives wrong answers silently.',
      tag: 'key',
    },
  ],

  // ── GOTCHAS / COMMON MISTAKES ────────────────────────────────────────────────
  gotchas: [
    {
      title: '0-1 KS 1D: inner loop direction flipped',
      code: `// WRONG — picks item multiple times (unbounded behavior)
for (int j = wt[i]; j <= W; j++) dp[j] = Math.max(dp[j], profit[i] + dp[j-wt[i]]);

// RIGHT — 0-1: each item at most once
for (int j = W; j >= wt[i]; j--) dp[j] = Math.max(dp[j], profit[i] + dp[j-wt[i]]);`,
    },
    {
      title: 'Coin Change: wrong outer loop → wrong counting',
      code: `// WRONG for Combination — outer=amount counts orderings (permutation)
for (int amt = 1; amt <= amount; amt++)
    for (int coin : coins)
        if (amt >= coin) dp[amt] += dp[amt - coin]; // counts (1,2) and (2,1) separately

// RIGHT for Combination — outer=coins fixes the order
for (int coin : coins)
    for (int amt = coin; amt <= amount; amt++)
        dp[amt] += dp[amt - coin]; // (1,2) and (2,1) counted as ONE`,
    },
    {
      title: 'Unique Paths: stack depth is O(N+M), not O(N×M)',
      code: `// Recursion goes down (N-1) rows then right (M-1) cols max
// Max stack depth = (N-1) + (M-1) = N+M-2 = O(N+M)
// The dp array is O(N×M) but the STACK is only O(N+M)`,
    },
  ],

  // ── QUIZ ─────────────────────────────────────────────────────────────────────
  quiz: [
    {
      q: 'What is the TC of Unique Paths (bottom-up)?',
      options: ['O(N+M)', 'O(N×M)', 'O(2^(N+M))', 'O(N²)'],
      answer: 1,
      explanation: 'We fill an N×M table, one O(1) operation per cell → O(N×M). Space-optimized to O(M) with a 1D array.',
    },
    {
      q: 'You have a knapsack problem where each item can be taken at most once. Which approach do you use?',
      options: ['Greedy (sort by ratio)', '0-1 DP with right→left inner loop', 'Unbounded DP with left→right inner loop', 'BFS'],
      answer: 1,
      explanation: '0-1 Knapsack = each item once. Inner loop right→left in 1D ensures we look at the i-1 row (before current item) for the subtracted weight, so the same item is not picked twice.',
    },
    {
      q: 'Coin Change II asks: how many ways to make amount using coins (order doesn\'t matter). Which loop order?',
      options: ['outer=amount, inner=coins', 'outer=coins, inner=amount', 'Both are equivalent', 'Use backtracking, not DP'],
      answer: 1,
      explanation: 'outer=coins fixes coin order, preventing (1,2) and (2,1) from being counted separately. outer=amount would count permutations instead.',
    },
    {
      q: 'For Fibonacci with memoization, what is the SC?',
      options: ['O(1)', 'O(N)', 'O(2^N)', 'O(N²)'],
      answer: 1,
      explanation: 'SC = memo array O(N) + recursive stack O(N) = O(N). With bottom-up tabulation + rolling vars, SC = O(1).',
    },
    {
      q: 'In 0-1 Knapsack space-optimized to 1D, why must the inner loop go RIGHT to LEFT?',
      options: [
        'It\'s just a convention',
        'So dp[j-wt] still reflects the row before current item (i-1 row behavior)',
        'To allow the same item to be picked again',
        'Right-to-left is faster on cache',
      ],
      answer: 1,
      explanation: 'Left-to-right would overwrite dp[j-wt] with the current item\'s contribution before we use it, effectively picking the same item twice. Right-to-left guarantees dp[j-wt] still holds the value from the previous item\'s iteration.',
    },
    {
      q: 'When should you flip axes in Knapsack (use profit as column instead of weight)?',
      options: [
        'When profit values are very large',
        'When weight W can be up to 10^9 (dp[N][W] is too large)',
        'Always — it\'s more efficient',
        'When items have equal weights',
      ],
      answer: 1,
      explanation: 'Extended 0-1 KS: if W=10^9, dp[N][W] = 500×10^9 entries — too large. Flip to dp[i][j] = min weight to achieve j profit. Answer = largest j where dp[N][j] ≤ W.',
    },
    {
      q: 'House Robber: you can\'t rob adjacent houses. Which recurrence is correct?',
      options: [
        'dp[i] = dp[i-1] + nums[i]',
        'dp[i] = max(nums[i] + dp[i-2], dp[i-1])',
        'dp[i] = max(nums[i], dp[i-1])',
        'dp[i] = dp[i-2] + dp[i-3]',
      ],
      answer: 1,
      explanation: 'At house i: either rob it (nums[i] + dp[i-2], skipping adjacent) or skip it (dp[i-1]). Take the max.',
    },
    {
      q: 'What is the SC of the recursive (memoized) solution for Unique Paths on an N×M grid?',
      options: ['O(N×M)', 'O(N+M)', 'O(N×M + N+M) = O(N×M)', 'O(1)'],
      answer: 2,
      explanation: 'dp array = O(N×M). Recursive stack depth = at most (N-1)+(M-1) = O(N+M). Total = O(N×M + N+M) which simplifies to O(N×M) since N×M dominates.',
    },
  ],
}

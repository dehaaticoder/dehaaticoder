export const dpProblems = {
  'climbing-stairs': {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    lcNum: 70,
    lcLink: 'https://leetcode.com/problems/climbing-stairs/',
    difficulty: 'Easy',
    topic: 'dp',
    companies: ['Amazon', 'Google', 'Microsoft', 'Adobe'],
    patterns: ['1D DP', 'Memoization', 'Tabulation', 'Space Optimization'],
    description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      '1 <= n <= 45',
    ],
    examples: [
      { input: 'n = 3', output: '3  (ways: [1,1,1], [1,2], [2,1])' },
      { input: 'n = 4', output: '5  (ways: [1,1,1,1], [1,2,1], [1,1,2], [2,1,1], [2,2])' },
    ],
    gaonKiBaat: 'Soch tu apni chhat pe jaana chahta hai. Seedhi hai 10 kadam ki. Ek baar mein 1 ya 2 kadam chadh sakta hai. Kitne alag-alag tareekon se pahunch sakta hai? Har combination ek alag raasta hai.',
    hints: [
      'At each stair, ask: how did I get here? I either came from stair N-1 (took 1 step) or stair N-2 (took 2 steps).',
      'So the number of ways to reach N = ways to reach N-1 + ways to reach N-2. Sound familiar?',
      'Base cases: ways(1) = 1, ways(2) = 2. This recurrence is identical to Fibonacci.',
    ],
    intuition: `Mental model — 3 questions: (1) What is my decision? Take 1 step or 2 steps. (2) What remains after that decision? N-1 stairs or N-2 stairs. (3) Am I counting or minimizing? Counting → add both choices. So ways(N) = ways(N-1) + ways(N-2). Same recurrence as Fibonacci, only the base cases differ.`,
    approaches: [
      {
        label: 'Brute Force — Pure Recursion',
        idea: 'Recurse from N down to base case. No caching — recomputes same subproblems many times.',
        tc: 'O(2^N)',
        sc: 'O(N) call stack',
        code: `int climbStairs(int n) {
    if (n <= 1) return 1;
    return climbStairs(n - 1) + climbStairs(n - 2);
}`,
        pros: ['Simplest to write — direct translation of recurrence'],
        cons: ['O(2^N) — TLE for large N. G(3) computed again and again.'],
      },
      {
        label: 'Top Down — Memoization',
        idea: 'Same recursion but cache results in dp[]. Before computing, check if already solved. TC drops from O(2^N) to O(N).',
        tc: 'O(N)',
        sc: 'O(N) dp array + O(N) call stack',
        code: `int[] dp;

int climbStairs(int n) {
    dp = new int[n + 1];
    Arrays.fill(dp, -1);
    return solve(n);
}

int solve(int n) {
    if (n <= 1) return 1;
    if (dp[n] != -1) return dp[n];   // cache hit — already solved
    dp[n] = solve(n - 1) + solve(n - 2);
    return dp[n];
}`,
        pros: ['Natural — write recursion first, add cache second', 'Only computes subproblems you actually need'],
        cons: ['Recursive stack still O(N) — two O(N) spaces total'],
      },
      {
        label: 'Bottom Up — Tabulation',
        idea: 'Fill dp[] iteratively from small to big. No recursion. dp[i] = dp[i-1] + dp[i-2].',
        tc: 'O(N)',
        sc: 'O(N)',
        code: `int climbStairs(int n) {
    if (n <= 1) return 1;
    int[] dp = new int[n + 1];
    dp[0] = 1;   // 0 stairs — 1 way (do nothing)
    dp[1] = 1;   // 1 stair  — 1 way
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
        pros: ['No recursion — no stack overflow risk', 'Simpler than memoization for this problem'],
        cons: ['O(N) extra space for dp array'],
      },
      {
        label: 'Space Optimized — Two Variables',
        idea: 'You only ever need the last two values. Keep two variables a and b instead of full array.',
        tc: 'O(N)',
        sc: 'O(1)',
        code: `int climbStairs(int n) {
    if (n <= 1) return 1;
    int a = 1, b = 1, c;    // a = ways(i-2), b = ways(i-1)
    for (int i = 2; i <= n; i++) {
        c = a + b;           // ways(i) = ways(i-1) + ways(i-2)
        a = b;
        b = c;
    }
    return b;
}`,
        pros: ['O(1) space — best solution', 'Simple loop, no array needed'],
        cons: [],
      },
    ],
    dryRun: `n = 5

dp[0] = 1  (do nothing)
dp[1] = 1  (one way: [1])
dp[2] = dp[1] + dp[0] = 1 + 1 = 2   ([1,1] or [2])
dp[3] = dp[2] + dp[1] = 2 + 1 = 3   ([1,1,1] [1,2] [2,1])
dp[4] = dp[3] + dp[2] = 3 + 2 = 5
dp[5] = dp[4] + dp[3] = 5 + 3 = 8

Answer: 8`,
    mistakes: [
      { text: 'Setting dp[0] = 0 instead of 1 — 0 stairs has exactly 1 way (do nothing). Getting this wrong shifts all values.', quote: 'Ghar pe hi baithe raho — yeh bhi ek raasta hai. dp[0] = 1 hota hai, 0 nahi.' },
      { text: 'In memoization, writing dp[n] = solve(n-1) + solve(n-1) — same variable twice. One must be n-2.', quote: 'Ek hi haath se do kaam nahi hota — n-1 aur n-2 dono chahiye, ek nahi.' },
      { text: 'Using dp array of size n instead of n+1 — dp[n] goes out of bounds.', quote: 'Jagah chhoti rakh di toh saamaan bahar girta hai — n+1 size chahiye dp array mein.' },
      { text: 'Forgetting that this is just Fibonacci with different base cases — reimplementing unnecessarily complex logic.', quote: 'Naya khana socha, lekin dal chawal hi banta hai — yeh Fibonacci hi hai, bas alag shuruat.' },
    ],
    relatedProblems: ['min-squares'],
    revisionLevel: 1,
  },

  'min-squares': {
    slug: 'min-squares',
    title: 'Perfect Squares',
    lcNum: 279,
    lcLink: 'https://leetcode.com/problems/perfect-squares/',
    difficulty: 'Medium',
    topic: 'dp',
    companies: ['Google', 'Amazon', 'Microsoft'],
    patterns: ['1D DP', 'Memoization', 'Try All Choices'],
    description: `Given an integer n, return the least number of perfect square numbers that sum to n. A perfect square is an integer that is the square of an integer — 1, 4, 9, 16, ...`,
    constraints: [
      '1 <= n <= 10000',
    ],
    examples: [
      { input: 'n = 12', output: '3  (4+4+4)' },
      { input: 'n = 13', output: '2  (4+9)' },
      { input: 'n = 9',  output: '1  (9)' },
    ],
    gaonKiBaat: 'Tere paas 1², 2², 3²... ke sikke hain. Tu ek amount banana chahta hai sirf in sikkon se. Kam se kam kitne sikke lagenge? Greedy kaam nahi karta — kabhi kabhi bade sikke se chota amount nahi banta.',
    hints: [
      'At each number i, you can subtract any perfect square x² where x² <= i. After subtracting, the remaining problem is psquare(i - x²).',
      'Try all possible perfect squares and take the minimum. This gives the recurrence.',
      'Greedy fails for N=12: greedy picks 9 → leaves 3 → needs 1+1+1 = total 4. But 4+4+4 = 3 is better.',
    ],
    intuition: `Decision: which perfect square do I subtract from N? Remaining: N - x². I want minimum → pick min over all choices. Recurrence: psquare(N) = 1 + min(psquare(N - x²)) for all x where x² <= N. The +1 counts the square I just used. Try all choices, take the minimum — this is DP, not greedy.`,
    approaches: [
      {
        label: 'Brute Force — Recursion (TLE)',
        idea: 'Try every perfect square at each step. Recurse on the remainder. Take min over all choices. No caching — very slow.',
        tc: 'O(N^(N/2)) — exponential',
        sc: 'O(N) call stack',
        code: `int psquare(int n) {
    if (n == 0) return 0;
    int ans = Integer.MAX_VALUE;
    for (int x = 1; x * x <= n; x++)
        ans = Math.min(ans, psquare(n - x * x));
    return ans + 1;
}`,
        pros: ['Direct translation of recurrence — easy to understand'],
        cons: ['TLE — same subproblems solved exponentially many times'],
      },
      {
        label: 'Top Down — Memoization',
        idea: 'Add dp[] cache to the recursion. Check cache before computing. Each unique value of N computed only once.',
        tc: 'O(N × √N)',
        sc: 'O(N) dp array + O(N) call stack',
        code: `int[] dp;

int numSquares(int n) {
    dp = new int[n + 1];
    Arrays.fill(dp, -1);
    return psquare(n);
}

int psquare(int n) {
    if (n == 0) return 0;
    if (dp[n] != -1) return dp[n];   // cache hit

    int ans = Integer.MAX_VALUE;
    for (int x = 1; x * x <= n; x++)
        ans = Math.min(ans, psquare(n - x * x));

    dp[n] = ans + 1;
    return dp[n];
}`,
        pros: ['Natural extension of brute force', 'Easy to write in interview'],
        cons: ['Recursive stack still O(N)'],
      },
      {
        label: 'Bottom Up — Tabulation',
        idea: 'Fill dp[] from 0 to N. For each i, try all perfect squares <= i. dp[i] = 1 + min(dp[i - x²]).',
        tc: 'O(N × √N)',
        sc: 'O(N)',
        code: `int numSquares(int n) {
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;

    for (int i = 1; i <= n; i++) {
        for (int x = 1; x * x <= i; x++) {
            if (dp[i - x * x] != Integer.MAX_VALUE)
                dp[i] = Math.min(dp[i], dp[i - x * x] + 1);
        }
    }
    return dp[n];
}`,
        pros: ['No recursion — cleaner and faster in practice', 'Standard solution for this problem'],
        cons: [],
      },
    ],
    dryRun: `n = 6

dp[0] = 0
dp[1]: try 1² → dp[0]+1 = 1          → dp[1] = 1
dp[2]: try 1² → dp[1]+1 = 2          → dp[2] = 2
dp[3]: try 1² → dp[2]+1 = 3          → dp[3] = 3
dp[4]: try 1² → dp[3]+1 = 4
       try 2² → dp[0]+1 = 1 ← min    → dp[4] = 1
dp[5]: try 1² → dp[4]+1 = 2
       try 2² → dp[1]+1 = 2           → dp[5] = 2
dp[6]: try 1² → dp[5]+1 = 3
       try 2² → dp[2]+1 = 3           → dp[6] = 3

Answer: 3  (4+1+1 or 4+1+1)`,
    mistakes: [
      { text: 'Using greedy — always pick the largest perfect square. Fails for N=12: greedy gives 4, DP gives 3.', quote: 'Sabse bada sikka lena samajhdari nahi — kabhi chhote sikke zyada kaam aate hain.' },
      { text: 'Initialising dp[] with 0 instead of Integer.MAX_VALUE — minimum logic breaks, wrong answers everywhere.', quote: 'Khali register mein zero likhoge toh min dhundhna impossible ho jaata hai — MAX_VALUE se shuru karo.' },
      { text: 'Writing x <= n in loop instead of x*x <= n — tries values whose square exceeds n, causes array out of bounds.', quote: 'Haath itna lambaoge toh giroge — x*x <= n check karo, sirf x <= n nahi.' },
      { text: 'Forgetting +1 in the recurrence — you count the square you used but never add 1 for it.', quote: 'Ek sikka jeb mein daala par count nahi kiya — +1 bhoolna matlab ek kaam ka credit chhod dena.' },
    ],
    relatedProblems: ['climbing-stairs'],
    revisionLevel: 1,
  },
}

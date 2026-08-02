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
      { text: 'Typo in recurrence: writing ways(n-1) + ways(n+1) instead of ways(n-1) + ways(n-2). The second term goes backward — n+1 causes infinite recursion.', quote: 'Seedhiyan chadh rahe ho ya utar rahe ho? n+1 likhoge toh kabhi nahi pahunchoge — n-2 chahiye.' },
      { text: 'In memoization, writing dp[n] = solve(n-1) + solve(n-1) — same variable twice. One must be n-2.', quote: 'Ek hi haath se do kaam nahi hota — n-1 aur n-2 dono chahiye, ek nahi.' },
      { text: 'Using dp array of size n instead of n+1 — dp[n] goes out of bounds.', quote: 'Jagah chhoti rakh di toh saamaan bahar girta hai — n+1 size chahiye dp array mein.' },
      { text: 'Guard check if(n<2) placed after dp[0]=1, dp[1]=1 assignments — when n=0 the array has size 1 and dp[1]=1 crashes. Move the guard before all assignments.', quote: 'Darwaza band karne se pehle andar ghus gaye — pehle check karo, phir array bharo.' },
      { text: 'Forgetting that this is just Fibonacci with different base cases — reimplementing unnecessarily complex logic.', quote: 'Naya khana socha, lekin dal chawal hi banta hai — yeh Fibonacci hi hai, bas alag shuruat.' },
    ],
    realInterviews: [
      { company: 'Agoda', round: 'R1 Coding', date: 'Jun 2026', note: 'Variant: count ways to reach N with steps 1–5 instead of 1–2' },
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
      { text: 'Using greedy — always pick the largest perfect square. Fails for N=12: greedy gives 4, DP gives 3 (4+4+4).', quote: 'Sabse bada sikka lena samajhdari nahi — kabhi chhote sikke zyada kaam aate hain.' },
      { text: 'Initializing dp[] with 0 instead of n+1 or MAX_VALUE — minimum logic breaks instantly. dp[i] starts at 0 so Math.min(0, anything) always returns 0.', quote: 'Khali register mein zero likhoge toh min dhundhna impossible ho jaata hai — n+1 se shuru karo.' },
      { text: 'Using Integer.MAX_VALUE as infinity and then doing 1 + MAX_VALUE — integer overflow gives a negative number. Use n+1 as safe infinity instead.', quote: 'Infinity se ek aage jaoge toh ulta gir jaoge — n+1 hi kaafi hai, MAX_VALUE mat lo.' },
      { text: 'Passing res as a parameter to the recursive call — each call needs its own local res starting at MAX. Sharing it means earlier calls corrupt later ones.', quote: 'Apna thali doosre ko mat dena — har call ka apna res hona chahiye, parameter nahi.' },
      { text: 'Writing x <= n in loop instead of x*x <= n — tries values whose square exceeds n, causes array out of bounds.', quote: 'Haath itna lambaoge toh giroge — x*x <= n check karo, sirf x <= n nahi.' },
      { text: 'Forgetting +1 in the recurrence — you count the square you used but never add 1 for it.', quote: 'Ek sikka jeb mein daala par count nahi kiya — +1 bhoolna matlab ek kaam ka credit chhod dena.' },
    ],
    relatedProblems: ['climbing-stairs'],
    revisionLevel: 1,
  },

  'house-robber': {
    slug: 'house-robber',
    title: 'House Robber',
    lcNum: 198,
    lcLink: 'https://leetcode.com/problems/house-robber/',
    difficulty: 'Medium',
    topic: 'dp',
    companies: ['Amazon', 'Google', 'Microsoft', 'LinkedIn'],
    patterns: ['1D DP', 'Pick / Not Pick', 'Memoization', 'Tabulation'],
    description: `You are a professional robber planning to rob houses along a street. Each house has some money. Adjacent houses have security systems — if two adjacent houses are robbed on the same night, police are alerted. Return the maximum amount you can rob tonight without alerting the police.`,
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
    ],
    examples: [
      { input: 'nums = [2,7,9,3,1]', output: '12  (rob house 0,2,4 → 2+9+1=12)' },
      { input: 'nums = [1,2,3,1]',   output: '4   (rob house 0,2 → 1+3=4)' },
    ],
    gaonKiBaat: 'Do padosi ke ghar ek raat mein nahi loot sakte — ek chhodna padega. Lekin yeh nahi sochna ki kaunsa best hai — recursion khud explore kar lega. Bas seedha agli valid state pe ja.',
    hints: [
      'At each house, you have exactly two choices: rob it (skip the next one, jump to index+2) or skip it (move to index+1). Nothing else.',
      'Define: GetMax(index) = maximum money obtainable from index to end. Write this sentence before writing code.',
      'Base case: index >= nums.length → return 0. If you are past the last house, you get nothing.',
    ],
    intuition: `HOW DID WE ARRIVE AT THIS APPROACH?

Start from the last house (index = n-1) and ask: if I am standing at this house, do I rob it or skip it? That is the only decision. Nothing else matters at this moment.

If I PICK this house → I cannot touch the adjacent one, so my next valid call jumps to index-2. My gain: nums[index] + GetMax(index-2).
If I DON'T PICK → I move to index-1 with nothing added. My gain: GetMax(index-1).
Answer at this house = max(pick, notPick). Trust the recursion — it will explore all futures from there.

WHY IS THIS DP AND NOT JUST RECURSION?

Draw the recursion tree for [2,7,9,3,1]. GetMax(3) gets called from GetMax(5) via notPick AND from GetMax(4) via pick. Same subproblem, same answer. That is overlapping subproblems. The answer for GetMax(3) is always the same regardless of which path reached it — that is optimal substructure. Both properties present → DP applies. Cache dp[index] the first time, return instantly every repeat call.

IN ONE SENTENCE

GetMax(index) = best I can do from houses 0 to index, built by asking: what is the best from 0 to index-2 (if I pick this house) and what is the best from 0 to index-1 (if I skip this house)? Each call delegates to smaller subproblems. The root call GetMax(n-1) just combines two answers — it does not need to know anything else.

TIME AND SPACE COMPLEXITY

TC = unique calls × work per call = N unique indices × O(1) per call = O(N).
SC = O(N) for the dp[] array + O(N) for the call stack = O(N) total.
Space-optimized bottom-up reduces stack to O(1) by using two variables.`,
    approaches: [
      {
        label: 'Brute Force — Pure Recursion (TLE)',
        idea: 'Try both choices at every house. No caching — same subproblems recomputed many times.',
        tc: 'O(2^N)',
        sc: 'O(N) call stack',
        code: `int rob(int[] nums, int index) {
    if (index >= nums.length) return 0;
    int pick    = nums[index] + rob(nums, index + 2);
    int notPick = rob(nums, index + 1);
    return Math.max(pick, notPick);
}`,
        pros: ['Direct translation of the recurrence — easy to understand'],
        cons: ['O(2^N) — same subproblems computed exponentially many times'],
      },
      {
        label: 'Top Down — Memoization',
        idea: 'Cache results in dp[index]. Each unique index computed only once. TC drops to O(N).',
        tc: 'O(N)',
        sc: 'O(N) dp array + O(N) call stack',
        code: `int[] dp;

int rob(int[] nums) {
    dp = new int[nums.length];
    Arrays.fill(dp, -1);
    return solve(nums, 0);
}

int solve(int[] nums, int index) {
    if (index >= nums.length) return 0;
    if (dp[index] != -1) return dp[index];
    int pick    = nums[index] + solve(nums, index + 2);
    int notPick = solve(nums, index + 1);
    dp[index] = Math.max(pick, notPick);
    return dp[index];
}`,
        pros: ['Natural extension of brute force', 'Easy to write in interview'],
        cons: ['Recursive stack still O(N)'],
      },
      {
        label: 'Bottom Up — Tabulation',
        idea: 'Fill dp[] from right to left. dp[i] = max money from house i to end.',
        tc: 'O(N)',
        sc: 'O(N)',
        code: `int rob(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n + 2];  // +2 to avoid bounds check for index+2
    for (int i = n - 1; i >= 0; i--) {
        int pick    = nums[i] + dp[i + 2];
        int notPick = dp[i + 1];
        dp[i] = Math.max(pick, notPick);
    }
    return dp[0];
}`,
        pros: ['No recursion', 'Cleaner than memoization'],
        cons: ['O(N) extra space'],
      },
      {
        label: 'Space Optimized — Two Variables',
        idea: 'dp[i] only depends on dp[i+1] and dp[i+2]. Keep two variables instead of full array.',
        tc: 'O(N)',
        sc: 'O(1)',
        code: `int rob(int[] nums) {
    int next1 = 0, next2 = 0;  // dp[i+1] and dp[i+2]
    for (int i = nums.length - 1; i >= 0; i--) {
        int curr = Math.max(nums[i] + next2, next1);
        next2 = next1;
        next1 = curr;
    }
    return next1;
}`,
        pros: ['O(1) space — best solution'],
        cons: [],
      },
    ],
    dryRun: `nums = [2,7,9,3,1]

dp[5] = 0  (past end)
dp[4] = 0  (past end, used as dp[i+2])
dp[4] = max(1 + dp[6], dp[5]) = max(1,0) = 1
dp[3] = max(3 + dp[5], dp[4]) = max(3,1) = 3
dp[2] = max(9 + dp[4], dp[3]) = max(10,3) = 10
dp[1] = max(7 + dp[3], dp[2]) = max(10,10) = 10
dp[0] = max(2 + dp[2], dp[1]) = max(12,10) = 12

Answer: 12`,
    mistakes: [
      { text: 'Carrying `ans` as a parameter — breaks memoization. The same index can be reached via different paths with different ans values. dp[index] stores a different value each time → cache corrupted. Fix: function returns "max from index to end" with no accumulated state.', quote: 'Apna hisaab khud rakhna function ka kaam nahi — bas aage ka max batao, pichle ka bojh mat uthao.' },
      { text: 'Using visited[] to enforce the adjacency rule — unnecessary. Jumping to index+2 already enforces "no adjacent houses." visited[] adds complexity and is wrong: after unsetting visited[index], the notPick branch goes to index+1 (adjacent), which can still rob a neighbor.', quote: 'Taala laga diya darwaze pe, phir bhi chor andar gaya — index+2 hi asli taala hai, visited nahi.' },
      { text: 'Base case: index == nums.length - 1 — misses the last house. Use index >= nums.length → return 0.', quote: 'Aakhri ghar chhodna nahi chahiye — >= se check karo, == se nahi.' },
      { text: 'Thinking you need a loop inside the recursion — "explore every future house." Wrong. Two choices only: index+2 (rob) or index+1 (skip). The recursive call itself explores everything from there. Trust the recursion.', quote: 'Loop lagaoge toh recursion ka kaam chhin loge — do raaste hain bas, aage recursion sambhaal lega.' },
      { text: 'Starting with DP before recursion — designing dp[][] before writing the plain recursion. Always: brute force recursion → overlapping subproblems → memoization → tabulation.', quote: 'Bina kheti ke fasal ki soch? Pehle haal chalaao — recursion pehle, DP baad mein.' },
      { text: 'Not defining the recursive function before coding — always complete this sentence first: "GetMax(index) returns ___." If you cannot finish that sentence clearly, you are not ready to write code. For House Robber: "maximum money obtainable from houses 0 to index."', quote: 'Bina naqsha banaye ghar banate ho? Pehle likho function kya lauta raha hai — phir code likhna.' },
      { text: 'Wrong mental model for dp[index] — thinking "dp[index] = max money if I must include house[index]." Correct model: dp[index] = max money from houses 0..index, freely choosing to include or skip house[index]. The "must include" thinking causes wrong answers whenever skipping the last house gives a better result.', quote: 'Zabardasti ghar mein ghusna zaruri nahi — dp[index] ka matlab hai 0 se index tak ka best, chahe wo ghar looto ya chhod do.' },
      { text: 'Allocating dp[] of size n+1 instead of n — for House Robber, indices go from 0 to n-1, so dp[n-1] is the last slot needed. dp = new int[n] is correct. Writing n+1 is not a bug (the extra slot is just never used), but it shows confused thinking about array sizing. Unlike Climbing Stairs where dp[n] is accessed and n+1 is required, House Robber only needs n.', quote: 'Ek extra thali rakh di daawat mein — koi nahi aaya usmein. n kaafi tha, n+1 sirf aadat thi.' },
      { text: 'Thinking procedurally ("what should I do next?") instead of state-wise ("what does this call represent?"). Procedural thinking leads to extra loops, visited arrays, accumulated ans parameters. State-based thinking leads to clean recursion: one index, two choices, trust the recursion.', quote: 'Kadam kadam soch rahe ho — seedha manzil socho. State kya hai, wahi DP ka asli sawaal hai.' },
    ],
    spotCheck: [
      {
        approach: 'recursive',
        type: 'subjective',
        q: 'Complete this sentence before writing any code: "GetMax(index) returns ___"',
        answer: 'Maximum money obtainable by robbing houses from index to the end of the array.',
      },
      {
        approach: 'recursive',
        type: 'objective',
        q: 'Why is visited[] not needed in House Robber?',
        options: [
          'visited[] only works with ArrayList, not int[]',
          'Jumping to index+2 already enforces the no-adjacent constraint naturally',
          'visited[] causes a stack overflow',
          'Recursion does not support visited arrays',
        ],
        answer: 1,
      },
      {
        approach: 'recursive',
        type: 'objective',
        q: 'Base cases for your backward solution (GetMax starts at index = n-1, goes toward 0)?',
        options: [
          'index >= nums.length → return 0',
          'index == 0 → nums[0]; index == 1 → max(nums[0], nums[1])',
          'index == 0 → return 0',
          'index < 0 → return -1',
        ],
        answer: 1,
      },
      {
        approach: 'top-down',
        type: 'objective',
        q: 'What goes wrong when you carry `ans` as a parameter in the memoized function?',
        options: [
          'The base case breaks',
          'Memoization is corrupted — same index reached with different ans values writes different results to dp[index]',
          'The recursion goes into infinite loop',
          'Nothing, it works fine',
        ],
        answer: 1,
      },
      {
        approach: 'top-down',
        type: 'subjective',
        q: 'GetMax(3) is called twice — once when ans=5, once when ans=10. What goes wrong with dp[3]?',
        answer: 'dp[3] stores a different value depending on which path reached it. The cache is corrupted — the second call overwrites dp[3] with the wrong accumulated total. Fix: remove ans from the function signature entirely.',
      },
      {
        approach: 'top-down',
        type: 'objective',
        q: 'TC of House Robber memoization?',
        options: [
          'O(2^N) — two choices per house',
          'O(N²) — nested loops',
          'O(N) — N unique states × O(1) work per state',
          'O(N log N)',
        ],
        answer: 2,
      },
      {
        approach: 'bottom-up',
        type: 'objective',
        q: 'In bottom-up tabulation (filling left to right), what are dp[0] and dp[1] for nums=[2,7,9,3]?',
        options: [
          'dp[0]=0, dp[1]=0',
          'dp[0]=2, dp[1]=7',
          'dp[0]=2, dp[1]=max(2,7)=7',
          'dp[0]=0, dp[1]=max(2,7)=7',
        ],
        answer: 2,
      },
      {
        approach: 'bottom-up',
        type: 'subjective',
        q: 'Fill the DP table for nums=[2,7,9,3]. dp[0]=?, dp[1]=?, dp[2]=?, dp[3]=?',
        answer: 'dp[0]=2. dp[1]=max(2,7)=7. dp[2]=max(dp[0]+9, dp[1])=max(11,7)=11. dp[3]=max(dp[1]+3, dp[2])=max(10,11)=11. Answer=11.',
      },
    ],
    relatedProblems: ['climbing-stairs', 'min-squares'],
    revisionLevel: 1,
  },

  'n-digit-numbers': {
    slug: 'n-digit-numbers',
    title: 'N Digit Numbers with Digit Sum S',
    lcNum: null,
    lcLink: 'https://www.interviewbit.com/problems/n-digit-numbers-with-digit-sum-s/',
    difficulty: 'Medium',
    topic: 'dp',
    companies: ['Amazon', 'Google'],
    patterns: ['2D DP', 'Memoization', 'Count Ways', 'Digit DP'],
    description: `Given A digits and a digit sum B, count how many A-digit positive integers have digit sum exactly equal to B. A-digit numbers do not have leading zeros. Return the answer modulo 10^9 + 7.`,
    constraints: [
      '1 <= A <= 50',
      '1 <= B <= 500',
    ],
    examples: [
      { input: 'A = 1, B = 5',  output: '1  (only the number 5)' },
      { input: 'A = 2, B = 4',  output: '4  (13, 22, 31, 40)' },
      { input: 'A = 3, B = 2',  output: '3  (101, 110, 200)' },
    ],
    gaonKiBaat: 'A gharon ki colony hai. Har ghar mein 0-9 log reh sakte hain. Pehle ghar mein 0 nahi chal sakta (leading zero nahi). Kitne tarike hain total B log baithane ke — yehi count karna hai.',
    hints: [
      'Define GetCount(digit, sum) = number of valid "digit"-digit numbers with digit sum = sum.',
      'The recursion fills digits RIGHT TO LEFT — each call picks the current rightmost digit (0-9), and delegates the left part to a smaller subproblem.',
      'Base case: when digit == 1 (leftmost / most significant digit), it must be 1-9 to avoid leading zeros. Return 1 if sum is in [1..9], else 0.',
      'The recurrence: GetCount(digit, sum) = Σ GetCount(digit-1, sum-i) for i = 0..9.',
      'Two variables (digit, sum) change across calls → 2D memo: dp[digit][sum].',
    ],
    intuition: `WHY RIGHT TO LEFT?

Think of GetCount(digit, sum) as: "how many valid digit-digit numbers exist with this remaining sum?"

When we pick a value i (0-9) for the current position, we reduce the problem:
- digit shrinks by 1 (one fewer position to fill)
- sum reduces by i (i was consumed by this digit)

The remaining subproblem GetCount(digit-1, sum-i) handles the LEFT part of the number.

Eventually digit reaches 1 — that is the LEFTMOST (most significant) digit. This is where the no-leading-zero constraint lives: the leftmost digit must be 1-9.

WHY IS THE BASE CASE digit == 1, not digit == A?

Because the recursion counts DOWN from A to 1. The outermost call GetCount(A, B) picks the rightmost digit (free to be 0-9). Only when digit == 1 do we reach the leftmost digit, and restrict it to 1-9.

TWO BUGS THAT CANCEL OUT (if you think left-to-right):

If you mentally model the recursion as LEFT TO RIGHT (leftmost first):
- The outermost call tries d = 0..9 — leading zeros are allowed (BUG)
- The base case (digit == 1) restricts last digit to 1-9 — trailing zeros are forbidden (BUG)

These two bugs cancel by symmetry (reversing any sequence maps one set to the other). But the CORRECT mental model is RIGHT TO LEFT — then there are no bugs at all.

OVERLAPPING SUBPROBLEMS

GetCount(2, 5) might be reached via many paths:
- A=3, first digit=0 → GetCount(2, 5)
- A=3, first digit=... wait, in right-to-left model:
- A=4, rightmost digit=1 → GetCount(3, 4) → digit 2 → GetCount(2, 4-d) ...

Same (digit=2, sum=5) is computed many times for different choices earlier. Cache it.

TIME AND SPACE COMPLEXITY

Top-down: unique states = A × B. Work per state = O(10) loop = O(1).
TC = O(A × B). SC = O(A × B) memo + O(A) stack.`,
    approaches: [
      {
        label: 'Brute Force — Pure Recursion (TLE)',
        idea: 'Try all digit values (0-9) at each position. Recurse on remaining digits with reduced sum. No cache — exponential recomputation.',
        tc: 'O(10^A)',
        sc: 'O(A) call stack',
        code: `int GetCount(int digit, int sumDigit) {
    if (sumDigit <= 0) return 0;

    if (digit == 1) {
        // leftmost digit — must be 1-9 (no leading zero)
        return (sumDigit >= 1 && sumDigit <= 9) ? 1 : 0;
    }

    int cnt = 0;
    for (int d = 0; d <= 9; d++) {         // try all values for rightmost digit
        cnt += GetCount(digit - 1, sumDigit - d);
    }
    return cnt;
}`,
        pros: ['Direct translation of recurrence — easy to understand'],
        cons: ['O(10^A) — TLE for A > 10. Same (digit, sum) recomputed from different paths.'],
      },
      {
        label: 'Top Down — Memoization',
        idea: 'Add 2D dp[digit][sum] cache. Check before computing. Each unique (digit, sum) pair computed only once. Apply modulo during accumulation.',
        tc: 'O(A × B)',
        sc: 'O(A × B) dp array + O(A) call stack',
        code: `static final long MOD = 1_000_000_007L;
int[][] dp;

public int solve(int A, int B) {
    dp = new int[A + 1][B + 1];
    for (int[] row : dp) Arrays.fill(row, -1);
    return GetCount(A, B);
}

int GetCount(int digit, int sumDigit) {
    if (sumDigit <= 0) return 0;

    if (digit == 1) {
        return (sumDigit >= 1 && sumDigit <= 9) ? 1 : 0;
    }

    if (dp[digit][sumDigit] != -1) return dp[digit][sumDigit];

    long cnt = 0;
    for (int d = 0; d <= 9; d++) {
        cnt = (cnt + GetCount(digit - 1, sumDigit - d)) % MOD;
    }

    dp[digit][sumDigit] = (int) cnt;
    return dp[digit][sumDigit];
}`,
        pros: ['Natural extension of brute force', 'Easy to write in interview', 'Only computes states actually needed'],
        cons: ['Recursive stack O(A) on top of memo O(A×B)'],
      },
    ],
    dryRun: `A = 2, B = 4  →  expected answer: 4  (numbers: 13, 22, 31, 40)

GetCount(2, 4):  [rightmost digit choices]
  d=0 → GetCount(1, 4) = 1   (leftmost=4, number: "40") ✓
  d=1 → GetCount(1, 3) = 1   (leftmost=3, number: "31") ✓
  d=2 → GetCount(1, 2) = 1   (leftmost=2, number: "22") ✓
  d=3 → GetCount(1, 1) = 1   (leftmost=1, number: "13") ✓
  d=4 → GetCount(1, 0) = 0   (leftmost would be 0 — leading zero, rejected) ✗
  d=5..9 → GetCount(1, negative) = 0

Answer: 4 ✓

Key: GetCount(1, x) = 1 only when x ∈ [1..9] — this is the leftmost digit, blocking leading zeros.`,
    mistakes: [
      { text: 'Using -1 as memo sentinel but also returning 0 for sum==0 — the sumDigit<=0 check fires before memo lookup, so sum=0 is never cached. This is intentional and correct (0-index access would also crash the dp array).', quote: 'Sentinel -1 aur answer 0 — dono alag hain. Sentinel pehle check karo, answer baad mein.' },
      { text: 'Forgetting modulo during accumulation — cnt overflows for large A and B. Apply modulo at every addition, not just at the end.', quote: 'Paani bharne ke baad bucket overflow karta hai — har addition pe modulo lagao, ant mein nahi.' },
      { text: 'dp array sized [A+1][B+1] but calling GetCount with sumDigit that can go below 0 — the sumDigit<=0 guard handles this before any array access. Never index dp with a negative sumDigit.', quote: 'Negative index matlab khud gaddha khodna — sumDigit<=0 guard hamesha pehle aata hai.' },
      { text: 'Mentally modelling the recursion as LEFT TO RIGHT and thinking the base case (digit==1) restricts the rightmost digit — it actually restricts the LEFTMOST digit. The recursion fills right to left.', quote: 'Seedha sochne se ulta nikla — yeh right se left bharta hai, left se right nahi.' },
      { text: 'Not applying modulo to the return value stored in dp — cnt is long during accumulation. Cast to int only after mod: dp[digit][sumDigit] = (int)(cnt % MOD).', quote: 'Long ko int mein daalne se pehle kaat-chhant karo — (int)(cnt % MOD) sahi tarika hai.' },
    ],
    spotCheck: [
      {
        q: 'GetCount(digit, sum) = Σ GetCount(digit-1, sum-i) for i = 0..9. What does each term represent?',
        answer: 'Each term represents choosing digit value i for the current (rightmost) position. After placing i, the left part has (digit-1) positions remaining with sum reduced by i.',
      },
      {
        q: 'Why does digit == 1 restrict the digit to 1-9 and not 0-9?',
        answer: 'digit == 1 is the LAST call in the recursion — it fills the LEFTMOST (most significant) digit. The leftmost digit of an A-digit number cannot be 0 (no leading zeros). So sum must be 1-9.',
      },
      {
        q: 'For A=2, B=9: why does d=9 at the outer call return 0?',
        answer: 'd=9 means the rightmost digit is 9. Remaining sum = 9-9 = 0. GetCount(1, 0) → sumDigit <= 0 → returns 0. This means the leftmost digit would need to be 0 — a leading zero — correctly rejected. The valid number "90" IS counted via d=0 at outer call → GetCount(1, 9) = 1.',
      },
      {
        q: 'What are the two DP state variables and why do we need both?',
        answer: 'digit (how many positions left to fill) and sumDigit (remaining digit sum needed). Same digit count with different remaining sums gives different answers. Both variables together uniquely determine the subproblem.',
      },
      {
        q: 'TC and SC of the memoized solution?',
        answer: 'TC = O(A × B): unique states = A × B, work per state = O(10) loop = O(1). SC = O(A × B) for dp array + O(A) for recursive stack.',
      },
    ],
    relatedProblems: ['climbing-stairs', 'house-robber'],
    revisionLevel: 1,
  },

  'unique-paths': {
    slug: 'unique-paths',
    title: 'Unique Paths II (with Obstacles)',
    lcNum: 63,
    lcLink: 'https://leetcode.com/problems/unique-paths-ii/',
    difficulty: 'Medium',
    topic: 'dp',
    companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    patterns: ['2D DP', 'Grid DP', 'Memoization', 'Tabulation'],
    description: `You are given an m x n integer grid A. A robot starts at the top-left corner (0,0) and tries to reach the bottom-right corner (m-1,n-1). The robot can only move right or down. An obstacle is marked as 1 in the grid; empty cells are 0. Return the number of unique paths from start to end avoiding obstacles.`,
    constraints: [
      '1 <= m, n <= 100',
      'A[i][j] is 0 or 1',
    ],
    examples: [
      { input: 'A = [[0,0,0],[0,1,0],[0,0,0]]', output: '2' },
      { input: 'A = [[0,1],[0,0]]', output: '1' },
    ],
    gaonKiBaat: 'Robot ko gaon se sheher jaana hai — sirf seedha ya neeche ja sakta hai. Beech mein kuch raaste band hain (obstacles). Kitne alag raaste hain? Har junction pe do choice hain — upar se aao ya baaye se. Agar koi raasta band hai toh wahan se 0 ways.',
    hints: [
      'At each cell (i,j), the robot could have arrived from (i-1,j) — above, or (i,j-1) — left. So ways(i,j) = ways(i-1,j) + ways(i,j-1).',
      'If A[i][j] == 1, that cell is blocked — return 0 immediately.',
      'Base case: (0,0) with no obstacle = 1 way. Out of bounds = 0 ways.',
      'TRAP: Do NOT short-circuit the first row/column with return 1. An obstacle anywhere in the first row blocks all cells to its right.',
    ],
    intuition: `Decision: robot arrives at (i,j). It came from above (i-1,j) or from the left (i,j-1). Both paths are valid unless blocked. So ways(i,j) = ways(i-1,j) + ways(i,j-1).

Obstacle: if A[i][j]==1, no path can pass through — return 0.

Base case: (0,0) = 1 if not blocked. Out of bounds = 0.

Key trap — first row/column: if there is an obstacle at (0,2), then (0,3), (0,4)... are all unreachable even though they are in the first row. You CANNOT return 1 for the entire first row — let the recursion propagate through naturally. It will hit the obstacle and return 0, which correctly blocks all subsequent cells.

Use A[0].length for column bounds (not A.length) — the grid may not be square.`,
    approaches: [
      {
        label: 'Brute Force — Pure Recursion',
        idea: 'Recurse from (n-1, m-1) back to (0,0). At each cell: if obstacle return 0, if base return 1, else sum paths from above and left.',
        tc: 'O(2^(N+M))',
        sc: 'O(N+M) call stack',
        code: `int countPaths(int[][] A, int i, int j) {
    if (i < 0 || j < 0) return 0;
    if (i >= A.length || j >= A[0].length) return 0;
    if (A[i][j] == 1) return 0;
    if (i == 0 && j == 0) return 1;
    return countPaths(A, i-1, j) + countPaths(A, i, j-1);
}`,
        pros: ['Simple — direct translation of recurrence'],
        cons: ['Exponential TC — TLE for large grids'],
      },
      {
        label: 'Top Down — Memoization',
        idea: 'Same recursion + dp[][] cache. Check cache before computing. Each (i,j) computed only once.',
        tc: 'O(N×M)',
        sc: 'O(N×M) dp array + O(N+M) call stack',
        code: `int uniquePathsWithObstacles(int[][] A) {
    int[][] dp = new int[A.length][A[0].length];
    for (int[] row : dp) Arrays.fill(row, -1);
    return countPaths(A, dp, A.length-1, A[0].length-1);
}

int countPaths(int[][] A, int[][] dp, int i, int j) {
    if (i < 0 || j < 0) return 0;
    if (i >= A.length || j >= A[0].length) return 0;
    if (A[i][j] == 1) return 0;
    if (i == 0 && j == 0) return 1;
    if (dp[i][j] != -1) return dp[i][j];
    dp[i][j] = countPaths(A, dp, i-1, j) + countPaths(A, dp, i, j-1);
    return dp[i][j];
}`,
        pros: ['Natural — write recursion first, add cache second'],
        cons: ['Recursive stack O(N+M) on top of dp array'],
      },
      {
        label: 'Bottom Up — Tabulation',
        idea: 'Fill dp[][] row by row. dp[i][j] = dp[i-1][j] + dp[i][j-1]. Obstacle cells = 0.',
        tc: 'O(N×M)',
        sc: 'O(N×M)',
        code: `int uniquePathsWithObstacles(int[][] A) {
    int n = A.length, m = A[0].length;
    int[][] dp = new int[n][m];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (A[i][j] == 1) { dp[i][j] = 0; continue; }
            if (i == 0 && j == 0) { dp[i][j] = 1; continue; }
            int fromAbove = i > 0 ? dp[i-1][j] : 0;
            int fromLeft  = j > 0 ? dp[i][j-1] : 0;
            dp[i][j] = fromAbove + fromLeft;
        }
    }
    return dp[n-1][m-1];
}`,
        pros: ['No recursion — clean iterative solution', 'Handles first row/column obstacle correctly by default'],
        cons: ['O(N×M) space — can be optimised to O(M) with rolling row'],
      },
    ],
    dryRun: `A = [[0,0,0],
      [0,1,0],
      [0,0,0]]

dp[0][0]=1  dp[0][1]=1  dp[0][2]=1
dp[1][0]=1  dp[1][1]=0  dp[1][2]=1  (obstacle at [1][1])
dp[2][0]=1  dp[2][1]=1  dp[2][2]=2

Answer: 2`,
    mistakes: [
      { text: 'Short-circuiting first row with return 1 — if there is an obstacle at (0,2), cells (0,3)+ are unreachable but your code returns 1 for them.', quote: 'Pehli gali mein darwaza band hai — aage ki sab dukaanein band ho jaati hain. Return 1 mat karo blindly.' },
      { text: 'Using A.length for column bound instead of A[0].length — grids are not always square. This causes wrong answers on non-square inputs.', quote: 'Kheti lamba hai, chaudai alag hai — A.length sirf rows hai, columns ke liye A[0].length chahiye.' },
      { text: 'Checking dp[i][j] != -1 before checking the obstacle — a cached value of 0 is valid but -1 init makes it indistinguishable from unvisited. Always check obstacle first.', quote: 'Cache dekh ke khush ho gaye, par rasta band tha — pehle obstacle check karo.' },
    ],
    realInterviews: [
      { company: 'Scaler', round: 'DSA4 Assignment', date: 'Jul 2026', note: 'Solved with top-down memoization in ~15 mins' },
    ],
    relatedProblems: ['climbing-stairs', 'n-digit-numbers'],
    revisionLevel: 1,
  },
}

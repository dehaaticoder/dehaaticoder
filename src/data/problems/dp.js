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
}

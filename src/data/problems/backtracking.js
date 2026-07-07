export const backtrackingProblems = {
  subsets: {
    slug: 'subsets',
    title: 'Subsets',
    lcNum: 78,
    lcLink: 'https://leetcode.com/problems/subsets/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    patterns: ['Pick / Not Pick', 'Backtracking', 'Bit Manipulation'],
    description: `Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.`,
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'All the numbers of nums are unique',
    ],
    examples: [
      { input: 'nums = [1,2,3]', output: '[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]' },
      { input: 'nums = [0]',     output: '[[], [0]]' },
    ],
    gaonKiBaat: 'Think of it like packing a bag. For each item — either pack it or leave it. Every combination of packed/left items is one subset.',
    hints: [
      'For each element, you have exactly two choices — include it or exclude it.',
      'If you draw a binary tree — left = pick, right = not pick — every leaf is a valid subset.',
      'Use a recursive function with an index. At each index, branch into pick (go deeper with same index+1) and not pick (go deeper skipping this element).',
    ],
    intuition: `For n elements, there are 2^n subsets. Why? Because for each element you have 2 choices — pick or not pick. So total choices = 2 × 2 × 2 ... n times = 2^n. The trick is to explore both choices at every level using recursion.`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'For each element, generate all subsets with and without it. Use a nested loop for small inputs.',
        tc: 'O(2^n × n)',
        sc: 'O(2^n × n)',
        code: `// Iterative — start with empty set, add each element to all existing subsets
List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    result.add(new ArrayList<>()); // start with empty subset

    for (int num : nums) {
        int size = result.size();
        for (int i = 0; i < size; i++) {
            List<Integer> newSubset = new ArrayList<>(result.get(i));
            newSubset.add(num);
            result.add(newSubset);
        }
    }
    return result;
}`,
        pros: ['Simple to understand', 'No recursion needed'],
        cons: ['Hard to extend for duplicate handling', 'Creates many temporary lists'],
      },
      {
        label: 'Your Approach — Include / Exclude (Two Explicit Calls)',
        idea: 'At each index, make two explicit recursive calls — one including the element, one excluding it. Collect only at the leaf when index reaches the end of the array.',
        tc: 'O(2^n × n)',
        sc: 'O(n) recursion stack',
        code: `ArrayList<ArrayList<Integer>> ans = new ArrayList<>();

public ArrayList<ArrayList<Integer>> subsets(ArrayList<Integer> A) {
    GenerateSubsets(A, 0, new ArrayList<Integer>());
    return ans;
}

public void GenerateSubsets(ArrayList<Integer> A, int i, ArrayList<Integer> curr) {
    if (i == A.size()) {
        ans.add(new ArrayList<>(curr));  // leaf — all decisions made, collect
        return;
    }

    // pick — include A[i]
    curr.add(A.get(i));
    GenerateSubsets(A, i + 1, curr);

    // not pick — exclude A[i]
    curr.remove(curr.size() - 1);       // unpick before the exclude call
    GenerateSubsets(A, i + 1, curr);
}`,
        pros: ['Very clear structure — pick and not-pick are explicit', 'Easy to trace the recursion tree'],
        cons: ['Collects only at leaf — must reach index == n for every path (no early collection)'],
      },
      {
        label: 'Alternative — For Loop Backtracking',
        idea: 'Use a for loop starting from current index. Collect at every node (not just leaf). One loop handles all pick choices.',
        tc: 'O(2^n × n)',
        sc: 'O(n) recursion stack',
        code: `List<List<Integer>> result = new ArrayList<>();

void backtrack(int[] nums, int i, List<Integer> current) {
    result.add(new ArrayList<>(current)); // collect at every level

    for (int j = i; j < nums.length; j++) {
        current.add(nums[j]);
        backtrack(nums, j + 1, current);
        current.remove(current.size() - 1); // unpick
    }
}

List<List<Integer>> subsets(int[] nums) {
    backtrack(nums, 0, new ArrayList<>());
    return result;
}`,
        pros: ['Extends naturally to Combination Sum — just add a target check', 'Collects at every node so no need to reach a leaf'],
        cons: [],
      },
    ],
    dryRun: `nums = [1, 2, 3]

backtrack(i=0, current=[])  → add []
  pick 1 → backtrack(i=1, current=[1]) → add [1]
    pick 2 → backtrack(i=2, current=[1,2]) → add [1,2]
      pick 3 → backtrack(i=3, current=[1,2,3]) → add [1,2,3]
    pick 3 → backtrack(i=3, current=[1,3]) → add [1,3]
  pick 2 → backtrack(i=2, current=[2]) → add [2]
    pick 3 → backtrack(i=3, current=[2,3]) → add [2,3]
  pick 3 → backtrack(i=3, current=[3]) → add [3]

Output: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]`,
    mistakes: [
      'Adding current list directly — result.add(current) — instead of a copy. All subsets end up empty at the end.',
      'Collecting only at leaves — you miss intermediate subsets.',
      'Starting j from 0 instead of i — causes duplicates.',
    ],
    relatedProblems: ['combination-sum', 'combination-sum-2', 'permutations'],
    revisionLevel: 1,
  },

  'staircase-paths': {
    slug: 'staircase-paths',
    title: 'Print All Staircase Paths',
    lcNum: null,
    lcLink: null,
    difficulty: 'Easy',
    topic: 'backtracking',
    companies: ['Scaler', 'InterviewBit'],
    patterns: ['Two Explicit Calls', 'Backtracking'],
    description: `Given a staircase with A steps, print all ways to climb it by taking either 1 step or 2 steps at a time.`,
    constraints: [
      '1 <= A <= 15',
    ],
    examples: [
      { input: 'A = 3', output: '[[1,1,1],[1,2],[2,1]]' },
      { input: 'A = 2', output: '[[1,1],[2]]' },
    ],
    gaonKiBaat: 'You are climbing the stairs to your rooftop. You can take 1 step or 2 steps at a time. How many different ways can you reach the top? This problem asks you to print all those ways.',
    hints: [
      'At each step you have two choices — take 1 step or take 2 steps. This naturally leads to two recursive calls.',
      'Keep reducing A. Base case: A == 0 means you reached the top exactly — collect the path. A < 0 means you overshot — return.',
      'Use a shared list to track the current path. Since it is shared, you must unpick (remove last element) after each recursive call.',
    ],
    intuition: `At each point you decide: 1 step or 2 steps. Make one choice, recurse, then undo and try the other. This is the classic Two Explicit Calls pattern — you are not looping over choices, you are making exactly two branches. Collect only when A reaches exactly 0.`,
    approaches: [
      {
        label: 'Your Approach — Two Explicit Calls',
        idea: 'At each call try adding 1 or 2. Recurse with A reduced by that amount. Unpick after each call since the list is shared.',
        tc: 'O(2^n)',
        sc: 'O(n) recursion depth',
        code: `ArrayList<ArrayList<Integer>> ans = new ArrayList<>();

public ArrayList<ArrayList<Integer>> WaysToClimb(int A) {
    Generate(A, new ArrayList<Integer>());
    return ans;
}

void Generate(int A, ArrayList<Integer> subAns) {
    if (A == 0) {
        ans.add(new ArrayList<>(subAns));  // reached top exactly — collect
        return;
    }
    if (A < 0) return;  // overshot — prune

    subAns.add(1);
    Generate(A - 1, subAns);
    subAns.remove(subAns.size() - 1);  // unpick

    subAns.add(2);
    Generate(A - 2, subAns);
    subAns.remove(subAns.size() - 1);  // unpick
}`,
        pros: ['Clean two-branch pattern', 'Easy to extend to 3 steps'],
        cons: [],
      },
    ],
    dryRun: `A = 3

Generate(3, [])
  add 1 → Generate(2, [1])
    add 1 → Generate(1, [1,1])
      add 1 → Generate(0, [1,1,1]) → A==0 → add [1,1,1] ✅
      add 2 → Generate(-1, [1,1,2]) → A<0 → prune ✗
    add 2 → Generate(0, [1,2]) → A==0 → add [1,2] ✅
  add 2 → Generate(1, [2])
    add 1 → Generate(0, [2,1]) → add [2,1] ✅
    add 2 → Generate(-1) → prune ✗

Output: [[1,1,1],[1,2],[2,1]]`,
    mistakes: [
      'Checking A < 0 but not A == 0 separately — you will keep recursing forever.',
      'Not unpicking after each call — the list is shared, both branches will see wrong state.',
      'Collecting a reference instead of a copy — ans.add(subAns) — all stored results change when subAns changes.',
    ],
    relatedProblems: ['kth-symbol', 'subsets', 'maze-paths'],
    revisionLevel: 1,
  },

  'kth-symbol': {
    slug: 'kth-symbol',
    title: 'K-th Symbol in Grammar',
    lcNum: 779,
    lcLink: 'https://leetcode.com/problems/k-th-symbol-in-grammar/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Google', 'Amazon'],
    patterns: ['Recursion', 'Math Pattern'],
    description: `We build a table of n rows (1-indexed). In the first row, we write a 0. In each subsequent row, we look at the previous row and replace each occurrence of 0 with 01, and each occurrence of 1 with 10. Given two integer n and k, return the kth (1-indexed) symbol in the nth row.`,
    constraints: [
      '1 <= n <= 30',
      '1 <= k <= 2^(n-1)',
    ],
    examples: [
      { input: 'n = 1, k = 1', output: '0' },
      { input: 'n = 2, k = 1', output: '0' },
      { input: 'n = 2, k = 2', output: '1' },
      { input: 'n = 4, k = 5', output: '1' },
    ],
    gaonKiBaat: 'Think of a family tree. The first generation has one person (0). Each person in the next generation has two children — if parent is 0, children are 0 and 1. If parent is 1, children are 1 and 0. To find a person, trace back to their parent first.',
    hints: [
      'Try BFS — build the entire row. It works but is O(2^n) time and space — too slow for large n.',
      'Instead of building the whole row, think about which parent generated the kth element. The parent of element k in row n is element ceil(k/2) in row n-1.',
      'If k is even, the element is the OPPOSITE of its parent. If k is odd, the element is the SAME as its parent. Use this to recurse directly to row 1.',
    ],
    intuition: `Key insight: each element at position k in row n comes from the parent at position k/2 (rounded up) in row n-1. If k is odd, child = parent. If k is even, child = 1 - parent. So we recurse upward row by row until row 1 (which is always 0), then compute our way back down. No need to build the whole table.`,
    approaches: [
      {
        label: 'Brute Force — BFS (TLE for large n)',
        idea: 'Build each row from the previous one. Return element at index k in row n. Works but 2^n space and time.',
        tc: 'O(2^n)',
        sc: 'O(2^n)',
        code: `// BFS — builds entire rows (TLE for large n)
public int solve(int A, int B) {
    int row = 0;
    Queue<Integer> q = new LinkedList<>();
    q.offer(0);
    row++;
    while (!q.isEmpty()) {
        int qSize = q.size();
        for (int i = 0; i < qSize; i++) {
            int poll = q.poll();
            if (row == A) {
                if (i == B) return poll;
            }
            if (poll == 0) { q.offer(0); q.offer(1); }
            if (poll == 1) { q.offer(1); q.offer(0); }
        }
        row++;
    }
    return 0;
}`,
        pros: ['Easy to understand', 'Directly simulates the problem'],
        cons: ['O(2^n) time and space — fails for n=30'],
      },
      {
        label: 'Your Optimal — Recursive Math',
        idea: 'Go up to the parent recursively. If k is odd, same as parent. If k is even, opposite of parent. Base: row 1 is always 0.',
        tc: 'O(n)',
        sc: 'O(n) call stack',
        code: `public int solve(int A, int B) {
    if (B == 0) return 0;        // row 1 only has one element: 0
    // Note: B is 0-indexed in this version (B==0 means first element)

    if (B % 2 == 0)
        return solve(A - 1, B / 2);      // even index: same as parent

    return 1 - solve(A - 1, B / 2);     // odd index: opposite of parent
}`,
        pros: ['O(n) time and space', 'Clean and elegant — no table building needed'],
        cons: ['Requires realising the parent-child relationship'],
      },
    ],
    dryRun: `n=4, k=5 (0-indexed: B=4)

solve(4, 4)
  B=4 is even → same as parent → solve(3, 2)
    B=2 is even → same as parent → solve(2, 1)
      B=1 is odd → opposite of parent → 1 - solve(1, 0)
        B=0 → return 0
      → 1 - 0 = 1
    → 1
  → 1

Answer: 1`,
    mistakes: [
      'Confusing 0-indexed vs 1-indexed k — make sure your base case and parent formula match.',
      'Trying BFS for large n — 2^30 elements do not fit in memory.',
      'Forgetting that the child-parent relationship flips when k is odd — it is 1 - parent, not parent.',
    ],
    relatedProblems: ['staircase-paths', 'subsets'],
    revisionLevel: 1,
  },

  'subset-sum-k': {
    slug: 'subset-sum-k',
    title: 'Subset Sum Equal to K',
    lcNum: null,
    lcLink: null,
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Microsoft', 'Scaler'],
    patterns: ['Pick / Not Pick', 'Backtracking'],
    description: `Given an array A of integers and a target B, return 1 if there exists a subset of A whose sum equals B, else return 0.`,
    constraints: [
      '1 <= A.length <= 20',
      '0 <= A[i] <= 1000',
      '0 <= B <= 10000',
    ],
    examples: [
      { input: 'A = [3,1,4,2], B = 6', output: '1  (subset [3,1,2] or [4,2])' },
      { input: 'A = [3,1,4,2], B = 10', output: '0' },
    ],
    gaonKiBaat: 'You have a bunch of coins. Can you pick some of them (or none, or all) so that the total is exactly the amount you need? You do not need to find which coins — just answer yes or no.',
    hints: [
      'For each element, you have two choices — include it in the subset or exclude it.',
      'This is exactly the Pick / Not Pick pattern. At each index, branch into include (go to index+1 with this element added) and exclude (go to index+1 without).',
      'Collect at the leaf (when index == A.length). Check if the sum of collected elements equals B.',
    ],
    intuition: `Same as Subsets — include or exclude each element. The only difference is we check the sum at the end and set a flag if it matches B. A cleaner version passes the running sum as a parameter and prunes when sum > B.`,
    approaches: [
      {
        label: 'Your Approach — Include/Exclude, Check at Leaf',
        idea: 'At each index, try including or excluding the element. At the leaf (all elements decided), check if the sum equals B.',
        tc: 'O(2^n)',
        sc: 'O(n)',
        code: `boolean isExist = false;

public int SubsetSum(int[] A, int B) {
    GenerateSubset(A, B, 0, new ArrayList<>());
    return isExist ? 1 : 0;
}

void GenerateSubset(int[] A, int B, int index, ArrayList<Integer> subAns) {
    if (index == A.length) {
        int sum = 0;
        for (int x : subAns) sum += x;
        if (sum == B) isExist = true;
        return;
    }

    subAns.add(A[index]);          // include
    GenerateSubset(A, B, index + 1, subAns);
    subAns.remove(subAns.size() - 1);  // unpick

    GenerateSubset(A, B, index + 1, subAns);  // exclude
}`,
        pros: ['Clear and matches the Subsets pattern exactly'],
        cons: ['Sum computed at every leaf — extra O(n) per leaf'],
      },
      {
        label: 'Optimised — Pass Running Sum',
        idea: 'Pass the running sum as a parameter. At leaf check if sum == B. Prune early if sum > B (for positive numbers).',
        tc: 'O(2^n)',
        sc: 'O(n)',
        code: `boolean isExist = false;

void GenerateSubset(int[] A, int B, int index, int currentSum) {
    if (index == A.length) {
        if (currentSum == B) isExist = true;
        return;
    }
    if (currentSum > B) return;  // prune (only works if all elements positive)

    GenerateSubset(A, B, index + 1, currentSum + A[index]);  // include
    GenerateSubset(A, B, index + 1, currentSum);              // exclude
}`,
        pros: ['No list needed — just pass the sum', 'Early pruning when sum exceeds B'],
        cons: ['Pruning only works when all elements are non-negative'],
      },
    ],
    dryRun: `A = [3,1,2], B = 3

index=0, subAns=[]
  include 3 → index=1, subAns=[3]
    include 1 → index=2, subAns=[3,1]
      include 2 → index=3 → sum=6 ≠ 3
      exclude 2 → index=3 → sum=4 ≠ 3
    exclude 1 → index=2, subAns=[3]
      include 2 → index=3 → sum=5 ≠ 3
      exclude 2 → index=3 → sum=3 == 3 ✅ isExist=true
  (rest pruned after isExist=true in optimised version)`,
    mistakes: [
      'Computing sum by iterating the list at every leaf — passes but is O(n) extra per leaf. Better to pass running sum.',
      'Not returning early after isExist = true — continues exploring unnecessary branches.',
      'Forgetting to unpick — the shared list will carry stale elements into the exclude branch.',
    ],
    relatedProblems: ['subsets', 'combination-sum', 'staircase-paths'],
    revisionLevel: 1,
  },

  'letter-combinations': {
    slug: 'letter-combinations',
    title: 'Letter Combinations of Phone Number',
    lcNum: 17,
    lcLink: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Google', 'Facebook', 'Apple'],
    patterns: ['Backtracking', 'For Loop Pattern', 'String Building'],
    description: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.`,
    constraints: [
      '0 <= digits.length <= 4',
      'digits[i] is a digit in the range [2, 9]',
    ],
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""',   output: '[]' },
      { input: 'digits = "2"',  output: '["a","b","c"]' },
    ],
    gaonKiBaat: 'Remember old Nokia phones? When you typed a message, pressing 2 could give a, b, or c. This problem asks: if you press a sequence of digits, what are all the words you could have typed?',
    hints: [
      'Each digit maps to 2-4 letters. For each digit in the input, you need to try all its letters.',
      'This is a for-loop backtracking pattern. For each digit at position index, loop through all its letters, add one, recurse to the next digit, then remove it.',
      'Use a HashMap to store the digit→letters mapping. Collect when sb.length() == total digits count.',
    ],
    intuition: `At each digit position, you have a choice of 2-4 letters. Pick one letter, move to the next digit, pick one from there, and so on. When you have picked one letter for each digit, you have a valid combination. This is the For Loop backtracking pattern — at each level you loop over multiple choices (the letters for that digit).`,
    approaches: [
      {
        label: 'Your Approach — HashMap + StringBuilder + For Loop',
        idea: 'Use a HashMap for digit→letters mapping. Use StringBuilder (shared, needs unpick). For each digit, loop through its letters, append, recurse to next digit, then deleteCharAt.',
        tc: 'O(4^n × n) where n = number of digits',
        sc: 'O(n)',
        code: `ArrayList<String> ans = new ArrayList<>();

public String[] letterCombinations(String A) {
    HashMap<Character, String> hm = new HashMap<>();
    hm.put('2', "abc"); hm.put('3', "def"); hm.put('4', "ghi");
    hm.put('5', "jkl"); hm.put('6', "mno"); hm.put('7', "pqrs");
    hm.put('8', "tuv"); hm.put('9', "wxyz");
    hm.put('0', "0");   hm.put('1', "1");

    if (A == null || A.length() == 0) return new String[0];

    Generate(A, A.length(), new StringBuilder(), 0, hm);

    String[] finalAns = new String[ans.size()];
    for (int i = 0; i < finalAns.length; i++)
        finalAns[i] = ans.get(i);
    return finalAns;
}

void Generate(String A, int n, StringBuilder sb, int index,
              HashMap<Character, String> hm) {
    if (sb.length() == n) {
        ans.add(sb.toString());
        return;
    }
    if (index > A.length()) return;

    char ch = A.charAt(index);
    String letters = hm.get(ch);

    for (int i = 0; i < letters.length(); i++) {
        sb.append(letters.charAt(i));       // pick
        Generate(A, n, sb, index + 1, hm);
        sb.deleteCharAt(sb.length() - 1);   // unpick
    }
}`,
        pros: ['HashMap makes the digit mapping very clear', 'StringBuilder avoids creating many String objects'],
        cons: ['StringBuilder is shared — must remember to deleteCharAt (unpick)'],
      },
    ],
    dryRun: `A = "23"

Generate(index=0, sb="")
  digit '2' → letters="abc"
  loop i=0: sb="a"
    Generate(index=1, sb="a")
      digit '3' → letters="def"
      loop i=0: sb="ad"
        Generate(index=2) → length=2=n → add "ad" ✅
      deleteCharAt → sb="a"
      loop i=1: sb="ae" → add "ae" ✅
      loop i=2: sb="af" → add "af" ✅
  deleteCharAt → sb=""
  loop i=1: sb="b" → adds "bd","be","bf" ✅
  loop i=2: sb="c" → adds "cd","ce","cf" ✅

Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]`,
    mistakes: [
      'Forgetting deleteCharAt after recursion — StringBuilder is shared, the next loop iteration will see wrong state.',
      'Using String concatenation instead of StringBuilder — creates O(n) new strings per call (much slower).',
      'Not handling empty input — if digits is empty, return empty array immediately.',
      'Off-by-one in base case — check sb.length() == n (total digits), not index == n.',
    ],
    relatedProblems: ['generate-parentheses', 'permutations', 'subsets'],
    revisionLevel: 1,
  },

  'maze-paths': {
    slug: 'maze-paths',
    title: 'Print All Maze Paths',
    lcNum: null,
    lcLink: null,
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Scaler', 'InterviewBit', 'Amazon'],
    patterns: ['Grid Backtracking', 'Two Explicit Calls'],
    description: `Given an A×B maze (grid), print all paths from the top-left corner (0,0) to the bottom-right corner (A-1, B-1). You can only move Down (D) or Right (R) at each step.`,
    constraints: [
      '1 <= A, B <= 6',
    ],
    examples: [
      { input: 'A = 2, B = 2', output: '["DR","RD"]' },
      { input: 'A = 2, B = 3', output: '["DRR","RDR","RRD"]' },
    ],
    gaonKiBaat: 'You are in a village and need to reach the market. The market is to the south-east. You can only walk south (down) or east (right). How many different routes can you take?',
    hints: [
      'At each cell you have exactly two choices — move Down or move Right.',
      'Base case: when you reach (A-1, B-1) you have found a complete path — add to result.',
      'Prune when p > A-1 or q > B-1 — you have gone out of bounds.',
    ],
    intuition: `From any cell (p,q), you can go to (p+1,q) (Down) or (p,q+1) (Right). Make one move, record it in a StringBuilder, recurse, then undo (deleteCharAt). This is the Two Explicit Calls pattern applied to a grid. The StringBuilder is shared so you must unpick after each call.`,
    approaches: [
      {
        label: 'Your Approach — Two Explicit Calls, StringBuilder',
        idea: 'At each cell, try moving Down (append D, recurse with p+1,q) and Right (append R, recurse with p,q+1). Unpick after each. Collect when you reach destination.',
        tc: 'O(2^(A+B))',
        sc: 'O(A+B) recursion depth',
        code: `ArrayList<String> ans = new ArrayList<>();

public ArrayList<String> PrintAllPaths(int A, int B) {
    Generate(A, B, 0, 0, new StringBuilder());
    return ans;
}

void Generate(int A, int B, int p, int q, StringBuilder s) {
    if (p == A - 1 && q == B - 1) {
        ans.add(s.toString());  // reached destination
        return;
    }
    if (p > A - 1 || q > B - 1) return;  // out of bounds

    // move Down
    Generate(A, B, p + 1, q, s.append("D"));
    s.deleteCharAt(s.length() - 1);  // unpick

    // move Right
    Generate(A, B, p, q + 1, s.append("R"));
    s.deleteCharAt(s.length() - 1);  // unpick
}`,
        pros: ['Clean two-branch structure', 'StringBuilder efficiently builds path string'],
        cons: [],
      },
    ],
    dryRun: `A=2, B=2 → from (0,0) to (1,1)

Generate(p=0, q=0, s="")
  Down → Generate(p=1, q=0, s="D")
    Down → p=2 > A-1=1 → prune ✗
    Right → Generate(p=1, q=1, s="DR")
      reached (1,1) → add "DR" ✅
    deleteCharAt → s="D"
  deleteCharAt → s=""
  Right → Generate(p=0, q=1, s="R")
    Down → Generate(p=1, q=1, s="RD")
      reached (1,1) → add "RD" ✅
    Right → q=2 > B-1=1 → prune ✗
  deleteCharAt → s=""

Output: ["DR","RD"]`,
    mistakes: [
      'Forgetting deleteCharAt — the StringBuilder is shared, next call will see leftover characters.',
      'Wrong base condition — check p == A-1 AND q == B-1 (both must match). Checking either alone is wrong.',
      'Checking bounds after making the move but before appending — check after appending to avoid corrupting the string.',
    ],
    relatedProblems: ['shortest-path-maze', 'staircase-paths', 'word-search'],
    revisionLevel: 1,
  },

  'shortest-path-maze': {
    slug: 'shortest-path-maze',
    title: 'Shortest Path in Binary Maze',
    lcNum: 1091,
    lcLink: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Google', 'Microsoft'],
    patterns: ['Grid Backtracking', 'DFS with Visited', 'BFS (Optimal)'],
    description: `Given a binary matrix A, find the shortest path from cell (B,C) to cell (D,E). A cell with value 1 is passable, 0 is a wall. You can move in 4 directions. Return the minimum number of steps, or -1 if no path exists.`,
    constraints: [
      '1 <= A.length, A[0].length <= 50',
      'A[i][j] is 0 or 1',
    ],
    examples: [
      { input: 'A = [[1,0,0],[1,1,0],[1,1,1]], B=0,C=0,D=2,E=2', output: '4' },
      { input: 'A = [[1,1,1],[1,0,1],[1,1,1]], B=0,C=0,D=2,E=2', output: '4' },
    ],
    gaonKiBaat: 'You are in a field with some blocked plots. You need to reach from one corner to another in the fewest steps. You can go up, down, left, right — but not through blocked plots.',
    hints: [
      'This is grid backtracking — at each cell, try all 4 directions. Use a visited[][] array to avoid revisiting cells.',
      'Track the current path length as you recurse. At the destination, update the global minimum.',
      'Remember to mark visited[i][j] = 1 before recursing and reset to 0 after — this is the backtrack step.',
    ],
    intuition: `DFS explores all paths from source to destination. At each cell, try all 4 neighbours — if valid and unvisited and not a wall, mark visited, add 1 to path length, recurse. At destination update min. Then unmark (backtrack) so other paths can use this cell. Note: BFS is actually optimal for shortest path — DFS explores all paths which is slower.`,
    approaches: [
      {
        label: 'Your Approach — DFS Backtracking',
        idea: 'DFS from source. At each step try 4 directions. Mark visited before recursing, unmark after. Track current steps. Update global min at destination.',
        tc: 'O(4^(m×n)) worst case',
        sc: 'O(m×n) for visited array',
        code: `int ans = Integer.MAX_VALUE;

public int FindShortestPath(int[][] A, int B, int C, int D, int E) {
    int[][] visited = new int[A.length][A[0].length];
    int[] rowDir = {0, -1, 0, 1};
    int[] colDir = {-1, 0, 1, 0};
    Generate(A, visited, rowDir, colDir, B, C, D, E, 0);
    return ans == Integer.MAX_VALUE ? -1 : ans;
}

void Generate(int[][] A, int[][] visited, int[] rowDir, int[] colDir,
              int currI, int currJ, int D, int E, int currAns) {
    if (currI == D && currJ == E) {
        ans = Math.min(ans, currAns);
        return;
    }
    for (int i = 0; i < 4; i++) {
        int ni = currI + rowDir[i];
        int nj = currJ + colDir[i];
        if (ni >= 0 && nj >= 0 && ni < A.length && nj < A[0].length
                && A[ni][nj] != 0 && visited[ni][nj] != 1) {
            visited[ni][nj] = 1;    // mark
            Generate(A, visited, rowDir, colDir, ni, nj, D, E, currAns + 1);
            visited[ni][nj] = 0;    // unmark (backtrack)
        }
    }
}`,
        pros: ['Explores all paths, guaranteed to find the minimum', 'Classic backtracking pattern on grid'],
        cons: ['DFS explores all paths — much slower than BFS for shortest path'],
      },
      {
        label: 'Optimal — BFS',
        idea: 'BFS guarantees shortest path in unweighted graphs. Level by level, the first time you reach the destination is the shortest path.',
        tc: 'O(m × n)',
        sc: 'O(m × n)',
        code: `public int shortestPath(int[][] A, int sr, int sc, int dr, int dc) {
    if (A[sr][sc] == 0 || A[dr][dc] == 0) return -1;
    int[][] dir = {{0,1},{0,-1},{1,0},{-1,0}};
    boolean[][] visited = new boolean[A.length][A[0].length];
    Queue<int[]> q = new LinkedList<>();
    q.offer(new int[]{sr, sc, 1});
    visited[sr][sc] = true;
    while (!q.isEmpty()) {
        int[] curr = q.poll();
        int r = curr[0], c = curr[1], dist = curr[2];
        if (r == dr && c == dc) return dist;
        for (int[] d : dir) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nc >= 0 && nr < A.length && nc < A[0].length
                    && A[nr][nc] == 1 && !visited[nr][nc]) {
                visited[nr][nc] = true;
                q.offer(new int[]{nr, nc, dist + 1});
            }
        }
    }
    return -1;
}`,
        pros: ['O(m×n) — much faster', 'First reach = shortest path, no need to explore all paths'],
        cons: ['Slightly more code than DFS'],
      },
    ],
    dryRun: `A = [[1,1],[1,1]], from (0,0) to (1,1)

Generate(0,0, steps=0)
  try right (0,1) → valid
    visited[0][1]=1
    Generate(0,1, steps=1)
      try down (1,1) → destination! ans=min(MAX,2)=2 ✅
    visited[0][1]=0
  try down (1,0) → valid
    visited[1][0]=1
    Generate(1,0, steps=1)
      try right (1,1) → destination! ans=min(2,2)=2 ✅
    visited[1][0]=0`,
    mistakes: [
      'Not resetting visited[ni][nj] = 0 after recursion — other paths cannot use this cell.',
      'Not initialising ans to Integer.MAX_VALUE — wrong minimum if no path exists.',
      'Using DFS for shortest path in a large grid — use BFS instead for efficiency.',
      'Forgetting to check A[ni][nj] != 0 — you will walk through walls.',
    ],
    relatedProblems: ['maze-paths', 'word-search', 'n-queens'],
    revisionLevel: 1,
  },

  'combination-sum': {
    slug: 'combination-sum',
    title: 'Combination Sum I',
    lcNum: 39,
    lcLink: 'https://leetcode.com/problems/combination-sum/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Google', 'Apple'],
    patterns: ['Backtracking', 'Pick / Not Pick', 'Reuse Allowed'],
    description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may use the same number an unlimited number of times.`,
    constraints: [
      '1 <= candidates.length <= 30',
      '2 <= candidates[i] <= 40',
      'All elements of candidates are distinct',
      '1 <= target <= 40',
    ],
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8',   output: '[[2,2,2,2],[2,3,3],[3,5]]' },
    ],
    gaonKiBaat: 'You have coins of different values. You want to make exact change for a target amount. You can reuse the same coin as many times as you want. Find all ways to do it.',
    hints: [
      'Same element can be reused — so when you pick element at index i, you recurse with the same i (not i+1).',
      'When you skip (not pick), you move to i+1.',
      'If sum exceeds target, prune — stop recursing down that path.',
    ],
    intuition: `Key difference from Subsets: when you pick element at index i, stay at i (reuse allowed). When you don't pick, move to i+1. Prune when sum > target.`,
    approaches: [
      {
        label: 'Backtracking — Pick / Not Pick',
        idea: 'At each index: pick (recurse with same i, sum increases) or not pick (recurse with i+1). Collect when sum == target. Prune when sum > target.',
        tc: 'O(2^(t/m)) where t=target, m=min element',
        sc: 'O(t/m) recursion depth',
        code: `List<List<Integer>> result = new ArrayList<>();

void backtrack(int[] nums, int i, int target, List<Integer> current) {
    if (target == 0) {
        result.add(new ArrayList<>(current));
        return;
    }
    if (i >= nums.length || target < 0) return;

    // pick — stay at same index (reuse allowed)
    current.add(nums[i]);
    backtrack(nums, i, target - nums[i], current);
    current.remove(current.size() - 1);

    // not pick — move to next index
    backtrack(nums, i + 1, target, current);
}

List<List<Integer>> combinationSum(int[] candidates, int target) {
    backtrack(candidates, 0, target, new ArrayList<>());
    return result;
}`,
        pros: ['Clean pick/not-pick pattern', 'Easy to understand with recursion tree'],
        cons: [],
      },
    ],
    dryRun: `candidates=[2,3,6,7], target=7

backtrack(i=0, target=7, [])
  PICK 2 → backtrack(i=0, target=5, [2])
    PICK 2 → backtrack(i=0, target=3, [2,2])
      PICK 2 → backtrack(i=0, target=1, [2,2,2])
        PICK 2 → target=-1 → prune ✗
        SKIP → backtrack(i=1, target=1, [2,2,2])
          PICK 3 → target=-2 → prune ✗ ... → all prune
      SKIP → backtrack(i=1, target=3, [2,2])
        PICK 3 → target=0 → ✅ add [2,2,3]
        ...
  SKIP → backtrack(i=1, target=7, [])
    ...
    PICK 7 → target=0 → ✅ add [7]`,
    mistakes: [
      'Using i+1 when picking — this prevents reuse and gives wrong answer.',
      'Not pruning when target < 0 — causes unnecessary deep recursion.',
      'Forgetting to remove from current list after picking (backtrack step).',
    ],
    relatedProblems: ['subsets', 'combination-sum-2', 'permutations'],
    revisionLevel: 1,
  },

  permutations: {
    slug: 'permutations',
    title: 'Permutations',
    lcNum: 46,
    lcLink: 'https://leetcode.com/problems/permutations/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    patterns: ['Backtracking', 'Visited Array'],
    description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    constraints: [
      '1 <= nums.length <= 6',
      '-10 <= nums[i] <= 10',
      'All the integers of nums are unique',
    ],
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]',   output: '[[0,1],[1,0]]' },
      { input: 'nums = [1]',     output: '[[1]]' },
    ],
    gaonKiBaat: 'You have 3 people — A, B, C. How many ways can you make them stand in a line? Every arrangement is different. That is a permutation.',
    hints: [
      'Unlike Subsets, order matters here. [1,2,3] and [2,1,3] are different answers.',
      'You cannot use a start index because you need to go back and pick earlier elements too. Instead, track which elements are already used.',
      'Use a bt[] array — bt[i] = -1 means element A[i] is free, bt[i] = 0 means it is already in the current path. Always loop from i=0, skip used elements.',
    ],
    intuition: `In Subsets and Combinations, we used a start index to avoid going back. But in Permutations, [1,2,3] and [2,1,3] are different — so we need to go back and pick earlier elements too. The solution: always loop from 0, but skip elements already used. We track this with a bt[] array (bt[i] = -1 means free, bt[i] = 0 means in use).`,
    approaches: [
      {
        label: 'Your Approach — Visited Array (bt[])',
        idea: 'Use a bt[] array to track which indices are currently in use. Loop from 0 every time. Skip if bt[i] is not -1. Mark bt[i]=0 before recursing, restore to -1 after.',
        tc: 'O(n! × n)',
        sc: 'O(n) for bt[] and current list',
        code: `public int[][] permute(int[] A) {
    int len = A.length;
    int[] bt = new int[len];
    Arrays.fill(bt, -1);               // -1 = free, 0 = in use
    ArrayList<ArrayList<Integer>> ans = new ArrayList<>();
    Generate(A, bt, 0, len, new ArrayList<>(), ans);

    int[][] result = new int[ans.size()][len];
    for (int i = 0; i < ans.size(); i++)
        for (int j = 0; j < len; j++)
            result[i][j] = ans.get(i).get(j);
    return result;
}

void Generate(int[] A, int[] bt, int index, int len,
              ArrayList<Integer> al, ArrayList<ArrayList<Integer>> ans) {
    if (index == len) {
        ans.add(new ArrayList<>(al));  // all n elements placed — valid permutation
        return;
    }

    for (int i = 0; i < len; i++) {
        if (bt[i] == -1) {             // element is free — pick it
            al.add(A[i]);
            bt[i] = 0;                 // mark as in use
            Generate(A, bt, index + 1, len, al, ans);
            al.remove(al.size() - 1); // unpick
            bt[i] = -1;               // free again
        }
    }
}`,
        pros: ['Intuitive — bt[] clearly shows which elements are used', 'Easy to explain in interviews'],
        cons: ['Extra O(n) space for bt[] array'],
      },
      {
        label: 'Alternative — Boolean Visited Array',
        idea: 'Same idea, cleaner with boolean[] visited instead of int[] bt. visited[i]=true means in use.',
        tc: 'O(n! × n)',
        sc: 'O(n)',
        code: `List<List<Integer>> result = new ArrayList<>();

void backtrack(int[] nums, boolean[] visited, List<Integer> current) {
    if (current.size() == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (visited[i]) continue;      // skip used elements
        visited[i] = true;
        current.add(nums[i]);
        backtrack(nums, visited, current);
        current.remove(current.size() - 1);
        visited[i] = false;
    }
}

List<List<Integer>> permute(int[] nums) {
    backtrack(nums, new boolean[nums.length], new ArrayList<>());
    return result;
}`,
        pros: ['Slightly cleaner with boolean', 'Standard interview template'],
        cons: [],
      },
    ],
    dryRun: `A = [1, 2, 3]

Generate(index=0, al=[])
  i=0, bt[0]=-1 → pick 1, bt=[0,-1,-1], al=[1]
    Generate(index=1, al=[1])
      i=0, bt[0]=0 → skip
      i=1, bt[1]=-1 → pick 2, bt=[0,0,-1], al=[1,2]
        Generate(index=2, al=[1,2])
          i=0,1 → skip (in use)
          i=2 → pick 3, al=[1,2,3]
            Generate(index=3) → index==len → add [1,2,3] ✅
          unpick 3
        unpick 2, bt=[0,-1,-1]
      i=2 → pick 3, al=[1,3]
        → eventually adds [1,3,2] ✅
  unpick 1, bt=[-1,-1,-1]
  i=1 → pick 2, al=[2] → adds [2,1,3], [2,3,1] ✅
  i=2 → pick 3, al=[3] → adds [3,1,2], [3,2,1] ✅

Total: 3! = 6 permutations`,
    mistakes: [
      'Using start index like Subsets — gives only ordered combinations, not all permutations.',
      'Forgetting to reset bt[i] = -1 (or visited[i] = false) after backtracking — future calls see wrong state.',
      'Not copying the list — ans.add(al) stores a reference, not a snapshot. All results end up same.',
      'Confusing Permutations (order matters, loop from 0) with Combinations (order does not matter, loop from start index).',
    ],
    relatedProblems: ['subsets', 'combination-sum', 'generate-parentheses'],
    revisionLevel: 1,
  },

  'generate-parentheses': {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    lcNum: 22,
    lcLink: 'https://leetcode.com/problems/generate-parentheses/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Google', 'Amazon', 'Microsoft', 'Bloomberg'],
    patterns: ['String Backtracking', 'Two Explicit Calls', 'Constraint Pruning'],
    description: `Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
    constraints: [
      '1 <= n <= 8',
    ],
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n = 1', output: '["()"]' },
    ],
    gaonKiBaat: 'Imagine you are building a sentence with opening and closing quotes. You can open a new quote anytime, but you can only close a quote after you have opened one. And you must close all quotes by the end.',
    hints: [
      'At every step you have two choices — add "(" or add ")". But both choices have constraints.',
      'You can add "(" only if you have not used all n opening brackets yet (openCnt < n). You can add ")" only if there are more opening brackets than closing ones (closeCnt < openCnt).',
      'When openCnt + closeCnt == 2*n, you have placed all brackets — add to result.',
    ],
    intuition: `Key insight: a valid parentheses string is valid at every prefix too — never more closing than opening brackets at any point. So instead of generating all strings and checking validity at the end, we enforce the constraint while building. Two rules: open < n (can add "("), close < open (can add ")"). This prunes invalid paths before they happen.`,
    approaches: [
      {
        label: 'Your Approach — Two Explicit Calls with Constraint Check',
        idea: 'Use two recursive calls — one adding "(" and one adding ")". At the start of each call, prune if openCnt < closeCnt (invalid) or openCnt > n (too many opens). Collect when total length == 2*n.',
        tc: 'O(4^n / √n) — Catalan number',
        sc: 'O(n) recursion depth',
        code: `ArrayList<String> ans = new ArrayList<>();

public ArrayList<String> generateParenthesis(int A) {
    Generate(A, new ArrayList<Character>(), 0, 0);
    return ans;
}

public void Generate(int A, ArrayList<Character> subAns,
                     int openCnt, int closeCnt) {
    if (openCnt < closeCnt) return;  // invalid — more closing than opening
    if (openCnt > A) return;         // too many opening brackets

    if (openCnt + closeCnt == 2 * A) {
        StringBuilder sb = new StringBuilder();
        for (char c : subAns) sb.append(c);
        ans.add(sb.toString());
        return;
    }

    subAns.add('(');
    openCnt++;
    Generate(A, subAns, openCnt, closeCnt);
    subAns.remove(subAns.size() - 1);  // unpick
    openCnt--;

    subAns.add(')');
    closeCnt++;
    Generate(A, subAns, openCnt, closeCnt);
    subAns.remove(subAns.size() - 1);  // unpick
    closeCnt--;
}`,
        pros: ['Clear two-branch structure', 'Constraint check at top makes logic easy to follow'],
        cons: ['Uses ArrayList<Character> — needs unpick. A String approach avoids this'],
      },
      {
        label: 'Cleaner Alternative — Check Before Calling',
        idea: 'Check constraint BEFORE making the recursive call instead of at the start. Uses String (own copy) — no unpick needed.',
        tc: 'O(4^n / √n)',
        sc: 'O(n)',
        code: `List<String> result = new ArrayList<>();

void backtrack(String current, int open, int close, int n) {
    if (current.length() == 2 * n) {
        result.add(current);
        return;
    }
    if (open < n)
        backtrack(current + "(", open + 1, close, n);
    if (close < open)
        backtrack(current + ")", open, close + 1, n);
}

List<String> generateParenthesis(int n) {
    backtrack("", 0, 0, n);
    return result;
}`,
        pros: ['No unpick needed — String is immutable (own copy per call)', 'Cleaner and shorter'],
        cons: [],
      },
    ],
    dryRun: `n = 2 (for simplicity)

Generate(open=0, close=0, subAns=[])
  add '(' → Generate(open=1, close=0, subAns=['('])
    add '(' → Generate(open=2, close=0, subAns=['(','('])
      add '(' → open=3 > n=2 → prune ✗
      add ')' → Generate(open=2, close=1, subAns=['(','(',')'])
        add '(' → open=3 > n=2 → prune ✗
        add ')' → Generate(open=2, close=2) → length=4=2*2 → add "(())" ✅
    add ')' → Generate(open=1, close=1, subAns=['(', ')'])
      add '(' → Generate(open=2, close=1, subAns=['(',')',('('])
        add ')' → Generate(open=2, close=2) → add "()()" ✅

Output: ["(())", "()()"]`,
    mistakes: [
      'Checking openCnt > A instead of openCnt >= A — off by one, misses valid strings.',
      'Forgetting to unpick (remove last element) when using ArrayList — future calls see wrong state.',
      'Not understanding why String approach needs no unpick — String is immutable, each call gets its own copy.',
      'Adding ")" before "(" in every branch — order does not affect correctness but "()" first is more natural.',
    ],
    relatedProblems: ['permutations', 'letter-combinations', 'subsets'],
    revisionLevel: 1,
  },
}

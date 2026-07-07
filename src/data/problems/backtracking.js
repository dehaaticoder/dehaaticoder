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
        label: 'Optimal — Pick / Not Pick (Backtracking)',
        idea: 'At each index, either pick the element and recurse, or skip it and recurse. Collect the current state at every node (not just leaves).',
        tc: 'O(2^n × n)',
        sc: 'O(n) recursion stack',
        code: `List<List<Integer>> result = new ArrayList<>();

void backtrack(int[] nums, int i, List<Integer> current) {
    result.add(new ArrayList<>(current)); // add snapshot at every node

    for (int j = i; j < nums.length; j++) {
        current.add(nums[j]);       // pick
        backtrack(nums, j + 1, current);
        current.remove(current.size() - 1); // unpick
    }
}

List<List<Integer>> subsets(int[] nums) {
    backtrack(nums, 0, new ArrayList<>());
    return result;
}`,
        pros: ['Clean and extendable', 'Same pattern works for Combination Sum, Permutations', 'Easy to add pruning'],
        cons: ['Slightly harder to visualize at first'],
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

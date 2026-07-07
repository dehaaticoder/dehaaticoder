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
}

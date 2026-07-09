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
      { text: 'Adding current list directly — result.add(current) — instead of a copy. All subsets end up empty at the end.', quote: 'Ek hi thali mein sabka khana mat daalo — jab thali palat jaaye, sab ek jaise ho jaate hain.' },
      { text: 'Collecting only at leaves when using for-loop backtracking — you miss intermediate subsets.', quote: 'Bich raaste mein bhi phool hote hain — sirf manzil par nazar mat rakho.' },
      { text: 'Starting j from 0 instead of i in the for-loop — causes duplicate subsets.', quote: 'Peeche mudke jo chhod aaye the, use dobara mat uthao — duplicates wahan se hi aate hain.' },
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
      { text: 'Checking A < 0 but not A == 0 separately — you will keep recursing forever.', quote: 'Neenv ke bina mahal nahi tikta — base case ke bina recursion kabhi nahi rukti.' },
      { text: 'Not unpicking after each call — the list is shared, both branches will see wrong state.', quote: 'Ek haath se liya, doosre se chhoda nahi — toh bojh hi badta hai.' },
      { text: 'Collecting a reference instead of a copy — ans.add(subAns) — all stored results change when subAns changes.', quote: 'Ek hi kagaz par sab likho, baad mein sab mita diya — har jawab ka apna kagaz chahiye.' },
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
      { text: 'Confusing 0-indexed vs 1-indexed k — make sure your base case and parent formula match.', quote: 'Ek kadam ki gadbad se poori yatra bhatakti hai — indexing mein seedha raho.' },
      { text: 'Trying BFS for large n — 2^30 elements do not fit in memory.', quote: 'Jungle kaatne ke liye toofan nahi chahiye — sahi aujar se kaam karo. 2^30 rows memory mein nahi samti.' },
      { text: 'Forgetting that the child-parent relationship flips when k is even — it is 1 - parent, not parent.', quote: 'Ulta seedha mat milo — k even ho toh result palat jaata hai, seedha nahi.' },
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
      { text: 'Computing sum by iterating the list at every leaf — passes but is O(n) extra per leaf. Better to pass running sum.', quote: 'Baar baar girna mat — running sum saath rakho, baar baar mat gino.' },
      { text: 'Not returning early after isExist = true — continues exploring unnecessary branches.', quote: 'Jawab mil gaya toh ruko — aage dhundhna sirf waqt barbad hai.' },
      { text: 'Forgetting to unpick — the shared list will carry stale elements into the exclude branch.', quote: 'Haath mein jo liya, wapas rakhna bhi seekho — backtrack karna bhi ek kala hai.' },
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
      { text: 'Forgetting deleteCharAt after recursion — StringBuilder is shared, the next loop iteration will see wrong state.', quote: 'Purana likha nahi mita, naya kahan likha jaaye — StringBuilder share hoti hai, saaf karo.' },
      { text: 'Using String concatenation instead of StringBuilder — creates O(n) new strings per call (much slower).', quote: 'Har baar naya kagaz lena mahanga padta hai — StringBuilder ko baar baar use karo.' },
      { text: 'Not handling empty input — if digits is empty, return empty array immediately.', quote: 'Khali khet mein beej mat daalo — pehle digits check karo.' },
      { text: 'Off-by-one in base case — check sb.length() == n (total digits), not index == n.', quote: 'Ek kadam zyada bhi le liya — line se bahar ho gaye.' },
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
      { text: 'Forgetting deleteCharAt — the StringBuilder is shared, next call will see leftover characters.', quote: 'Raasta chhoda toh washake chalte raho — StringBuilder mein last step hatao, warna raasta galat dikhega.' },
      { text: 'Wrong base condition — check p == A-1 AND q == B-1 (both must match). Checking either alone is wrong.', quote: 'Sirf adha ghar pahunchna, ghar pahunchna nahi — dono row aur column match karne chahiye.' },
      { text: 'Checking bounds after making the move but before appending — check after appending to avoid corrupting the string.', quote: 'Darwaza dekho pehle, phir andar jao — bounds check pehle, append baad mein.' },
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
      { text: 'Not resetting visited[ni][nj] = 0 after recursion — other paths cannot use this cell.', quote: 'Apne peeche darwaza band rakhoge toh agle log kaise aayenge — visited reset karo.' },
      { text: 'Not initialising ans to Integer.MAX_VALUE — wrong minimum if no path exists.', quote: 'Sabse chota dhundhna ho toh pehle maan lo ki sab bade hain — Integer.MAX_VALUE se shuru karo.' },
      { text: 'Using DFS for shortest path in a large grid — use BFS instead for efficiency.', quote: 'Jungle mein seedha bhaagna shortest path nahi deta — BFS level by level chalta hai.' },
      { text: 'Forgetting to check A[ni][nj] != 0 — you will walk through walls.', quote: 'Band darwaza dekhke bhi andar ghusoge? — obstacles check karo pehle.' },
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
      { text: 'Using i+1 when picking — this prevents reuse and gives wrong answer.', quote: 'Ek baar use karke chhod diya — lekin yahan ek element baar baar aane ki permission hai.' },
      { text: 'Not pruning when target < 0 — causes unnecessary deep recursion.', quote: 'Ulte raaste par jaana bandh karo — target negative ho gaya toh wapas aao.' },
      { text: 'Forgetting to remove from current list after picking (backtrack step).', quote: 'Aage badhne ke baad peeche nahi aaye — isliye raasta khota gaya.' },
    ],
    relatedProblems: ['subsets', 'combination-sum-2', 'permutations'],
    revisionLevel: 1,
  },

  'combination-sum-2': {
    slug: 'combination-sum-2',
    title: 'Combination Sum II',
    lcNum: 40,
    lcLink: 'https://leetcode.com/problems/combination-sum-ii/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Microsoft', 'Google', 'Adobe'],
    patterns: ['Pick / Not Pick', 'Backtracking', 'HashSet Dedup'],
    description: `Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target. Each number in candidates may only be used once in the combination. The solution set must not contain duplicate combinations.`,
    constraints: [
      '1 <= candidates.length <= 100',
      '1 <= candidates[i] <= 50',
      '1 <= target <= 30',
    ],
    examples: [
      { input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[1,7],[2,6]]' },
      { input: 'candidates = [2,5,2,1,1], target = 5',       output: '[[1,1,3],[1,2,2],[5]]' },
    ],
    gaonKiBaat: 'Same as Combination Sum I, but now each number can be used only once. The twist — there are duplicates in the input. Sorting the array first ensures all combinations come out in the same order, so HashSet can catch the duplicates for you.',
    hints: [
      'For each element, make a pick or not-pick decision — same as Combination Sum I.',
      'Each element can be used only once, so after picking index i, recurse with index i+1 (not i).',
      'The input has duplicates. Without sorting, [2,1,2] and [2,2,1] look different to a HashSet even though they are the same combination.',
      'Sort the array first. Now all combinations are built in ascending order, so the same combination always looks the same — HashSet dedup works correctly.',
    ],
    intuition: `Pick/not-pick at each index. After picking, move to index+1 (each number used once). The tricky part is duplicates — [2,5,2,1,2] can produce [2,2,1] from one path and [2,1,2] from another — same elements, different order, HashSet treats them as different. Sorting the array first forces every path to build combinations in ascending order, so [1,2,2] always comes out as [1,2,2] regardless of which path found it. HashSet then correctly deduplicates.`,
    approaches: [
      {
        label: 'Your Approach — Pick / Not Pick with HashSet dedup',
        idea: 'At each index, pick (recurse with index+1, adding element) or not-pick (recurse with index+1, skipping). Collect valid combinations in a HashSet to remove duplicates. Sort candidates first so all combinations come out in ascending order.',
        tc: 'O(2^n × n)',
        sc: 'O(2^n) for HashSet + O(n) recursion stack',
        code: `class Solution {
    Set<List<Integer>> finalAns = new HashSet<>();

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);                          // sort first — critical for dedup
        Generate(candidates, target, new ArrayList<>(), 0, 0);
        return new ArrayList<>(finalAns);
    }

    void Generate(int[] A, int target, ArrayList<Integer> subAns, int sum, int index) {
        if (sum > target) return;
        if (sum == target) { finalAns.add(new ArrayList<>(subAns)); return; }
        if (index == A.length) return;

        // pick A[index]
        subAns.add(A[index]);
        Generate(A, target, subAns, sum + A[index], index + 1);
        subAns.remove(subAns.size() - 1);               // unpick (backtrack)

        // not pick A[index]
        Generate(A, target, subAns, sum, index + 1);
    }
}`,
        pros: [
          'Clean pick/not-pick structure — same template as all other backtracking problems',
          'Easy to understand: sort once, let HashSet handle the dedup',
        ],
        cons: [
          'Generates duplicate combinations internally — HashSet filters them at the end',
          'Slightly more memory than the for-loop approach which never generates duplicates',
        ],
      },
      {
        label: 'Optimised — For Loop with inline dedup (no HashSet needed)',
        idea: 'Use a for loop starting from index. After sorting, skip any element equal to the previous at the same recursion level. This prevents duplicate combinations from ever being generated.',
        tc: 'O(2^n × n)',
        sc: 'O(n) recursion stack only',
        code: `class Solution {
    List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        backtrack(candidates, target, new ArrayList<>(), 0, 0);
        return result;
    }

    void backtrack(int[] A, int target, List<Integer> curr, int sum, int start) {
        if (sum == target) { result.add(new ArrayList<>(curr)); return; }
        for (int i = start; i < A.length; i++) {
            if (sum + A[i] > target) break;               // sorted — prune early
            if (i > start && A[i] == A[i - 1]) continue; // skip duplicate at same level
            curr.add(A[i]);
            backtrack(A, target, curr, sum + A[i], i + 1);
            curr.remove(curr.size() - 1);
        }
    }
}`,
        pros: [
          'Never generates duplicates — the skip line handles it inline',
          'No HashSet needed — saves memory',
          'The "skip" line is the standard interview answer for this problem',
        ],
        cons: ['The skip condition (i > start) is easy to get wrong under pressure'],
      },
    ],
    dryRun: `candidates = [2,5,2,1,2], sorted = [1,2,2,2,5], target = 5

Generate(sum=0, index=0):
  pick 1 → Generate(sum=1, index=1):
    pick 2 → Generate(sum=3, index=2):
      pick 2 → Generate(sum=5, index=3): sum==target → add [1,2,2] ✅
      skip 2 → Generate(sum=3, index=3):
        pick 2 → Generate(sum=5, index=4): sum==target → add [1,2,2] ⚠ (HashSet blocks)
        skip 2 → Generate(sum=3, index=4):
          pick 5 → sum=8 > 5 → PRUNED
          skip 5 → index=5 = length → return
    skip 2 → ... (more paths, all produce [1,2,2] duplicates — HashSet blocks)
  skip 1 → Generate(sum=0, index=1):
    ... eventually ...
    pick 2,2,2 → sum=6 > 5 → PRUNED
    pick 5 alone → sum=5 → add [5] ✅

Final HashSet → [[1,2,2], [5]] ✓`,
    mistakes: [
      { text: 'Forgetting Arrays.sort(candidates) — HashSet dedup breaks without sorting because [1,2,2] and [2,1,2] look different to a List.equals() check.', quote: 'Bina tartib ke ghar mein dhundha — milega kaise? Sort karo pehle.' },
      { text: 'Using index instead of index+1 in the not-pick recursive call — causes infinite loop since the index never advances.', quote: 'Wahi jagah khade rahoge chakkar mein? — not-pick mein index+1 chahiye, aage badhna padega.' },
      { text: 'In the for-loop approach: writing i > 0 instead of i > start for the skip condition — this incorrectly skips valid combinations at deeper levels.', quote: 'Galat sawaal poochha toh galat jawab milega — start se compare karo, 0 se nahi.' },
      { text: 'Reusing the same number by passing i instead of i+1 to the recursive call — this is Combination Sum I behaviour, not II.', quote: 'Ek cheez ko baar baar mat lo jab baar baar lena mana ho — i+1 pass karo.' },
    ],
    relatedProblems: ['combination-sum', 'subsets', 'permutations'],
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
      { text: 'Using start index like Subsets — gives only ordered combinations, not all permutations.', quote: 'Combinations aur permutations alag hain — order matter karta hai, start index nahi.' },
      { text: 'Forgetting to reset bt[i] = -1 (or visited[i] = false) after backtracking — future calls see wrong state.', quote: 'Kaam khatam hua, jhanda utha lo — visited reset karo warna agle path ko lagega jagah bhari hai.' },
      { text: 'Not copying the list — ans.add(al) stores a reference, not a snapshot. All results end up same.', quote: 'Ek hi photo mein sab ka chehra edit karte raho — alag copy lo result mein.' },
      { text: 'Confusing Permutations (order matters, loop from 0) with Combinations (order does not matter, loop from start index).', quote: 'Khana alag hota hai, thali mein sजाne ka tarika alag hota hai — permutation mein order matter karta hai.' },
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
      { text: 'Checking openCnt > A instead of openCnt >= A — off by one, misses valid strings.', quote: 'Ek zyada bracket de diya — off by one ki galti badi mahengi padti hai.' },
      { text: 'Forgetting to unpick (remove last element) when using ArrayList — future calls see wrong state.', quote: 'ArrayList bhoolti nahi — remove nahi kiya toh next call mein bhi rahega.' },
      { text: 'Not understanding why String approach needs no unpick — String is immutable, each call gets its own copy.', quote: 'String apne aap nahi badlati — isliye backtrack ki zaroorat nahi String approach mein.' },
      { text: 'Adding ")" before "(" in every branch — order does not affect correctness but "(" first is more natural.', quote: 'Ghar banaate waqt darwaza pehle nahi lagate — pehle deewarein, phir darwaza.' },
    ],
    relatedProblems: ['permutations', 'letter-combinations', 'subsets'],
    revisionLevel: 1,
  },

  'word-search': {
    slug: 'word-search',
    title: 'Word Search',
    lcNum: 79,
    lcLink: 'https://leetcode.com/problems/word-search/',
    difficulty: 'Medium',
    topic: 'backtracking',
    companies: ['Amazon', 'Microsoft', 'Google', 'Bloomberg'],
    patterns: ['Grid DFS', 'Backtracking', 'Mark / Unmark'],
    description: `Given an m×n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    constraints: [
      'm == board.length',
      'n == board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
      'board and word consists of only lowercase and uppercase English letters',
    ],
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',    output: 'true' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',   output: 'false' },
    ],
    gaonKiBaat: 'Think of it like walking through a maze — you can go up, down, left, right. Once you step on a cell, mark it so you don\'t step on it again. If the path leads nowhere, step back and try a different direction.',
    hints: [
      'Every cell in the grid can be a starting point — try all of them.',
      'From any cell, you can move in 4 directions. Use recursion to explore each direction.',
      'Once you visit a cell in the current path, mark it as visited so you don\'t reuse it. Unmark it when you backtrack.',
      'You need to pass the current position (i, j) into the recursive call — otherwise the next call doesn\'t know where it is and scans the whole board.',
    ],
    intuition: `The word must be spelled by adjacent cells in order. So for each starting cell that matches word[0], do a DFS — try all 4 directions for the next character. The key constraint is: you can\'t reuse the same cell in one path. Use a visited array (or in-place marking) to enforce this. When a path fails, backtrack — unmark the cell and try other directions.`,
    approaches: [
      {
        label: 'Your Approach — Add / Recurse / Remove with visited[][]',
        idea: 'Try every cell as a starting point. From (i,j), check all 4 neighbors. Mark (i,j) visited before recursing into a neighbor, unmark after. Use a StringBuilder to build the matched string and compare at the end.',
        tc: 'O(m × n × 4^L) where L = word length',
        sc: 'O(m × n) for visited array + O(L) recursion stack',
        code: `class Solution {

    int[] row = new int[]{0, -1, 0, 1};
    int[] col = new int[]{-1, 0, 1, 0};
    boolean isExist = false;

    public boolean exist(char[][] board, String word) {
        int[][] visited = new int[board.length][board[0].length];
        StringBuilder ans = new StringBuilder();

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length; j++) {
                if (isExist) return true;
                Generate(board, word, i, j, visited, ans, 0);
            }
        }
        return isExist;
    }

    void Generate(char[][] board, String word, int i, int j,
                  int[][] visited, StringBuilder ans, int index) {
        if (isExist) return;

        // special case: single character word
        if (word.length() == 1) {
            if (board[i][j] == word.charAt(0)) { isExist = true; return; }
        }

        if (ans.length() == word.length()) {
            if (ans.toString().equals(word)) { isExist = true; return; }
        }

        for (int dir = 0; dir < 4; dir++) {
            if (visited[i][j] == 0 && board[i][j] == word.charAt(index)) {
                int currI = i + row[dir];
                int currJ = j + col[dir];
                if (currI >= 0 && currJ >= 0 &&
                    currI <= board.length - 1 && currJ <= board[0].length - 1) {
                    visited[i][j] = 1;           // add (mark)
                    ans.append(board[i][j]);
                    Generate(board, word, currI, currJ, visited, ans, index + 1);
                    ans.deleteCharAt(ans.length() - 1); // remove
                    visited[i][j] = 0;           // unmark
                }
            }
        }
    }
}`,
        pros: [
          'Follows the standard backtracking template: add → recurse → remove',
          'visited[][] makes it easy to debug — you can print it at any point',
          'StringBuilder approach mirrors how you think about building the word step by step',
        ],
        cons: [
          'Mark/unmark happens inside the dir loop — same cell gets processed once per direction (redundant but correct)',
          'Needs a special case for single-character words (no neighbors to check)',
          'Slightly more code than needed',
        ],
      },
      {
        label: 'Optimised — Index-based DFS (no StringBuilder)',
        idea: 'Instead of building the word in a StringBuilder, use index to track how many characters have been matched. When index == word.length(), the word is found. Mark and unmark once per cell, outside the direction loop.',
        tc: 'O(m × n × 4^L)',
        sc: 'O(L) recursion stack only — no visited array, marks cell in-place with \'#\'',
        code: `class Solution {

    int[] row = new int[]{0, -1, 0, 1};
    int[] col = new int[]{-1, 0, 1, 0};
    boolean isExist = false;

    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++) {
                if (isExist) return true;
                Generate(board, word, i, j, new int[board.length][board[0].length], 0);
            }
        return isExist;
    }

    void Generate(char[][] board, String word, int i, int j,
                  int[][] visited, int index) {
        if (isExist) return;
        if (index == word.length()) { isExist = true; return; }
        if (visited[i][j] == 1 || board[i][j] != word.charAt(index)) return;

        visited[i][j] = 1;                      // mark once
        for (int dir = 0; dir < 4; dir++) {
            int currI = i + row[dir];
            int currJ = j + col[dir];
            if (currI >= 0 && currJ >= 0 &&
                currI < board.length && currJ < board[0].length) {
                Generate(board, word, currI, currJ, visited, index + 1);
            }
        }
        visited[i][j] = 0;                      // unmark once
    }
}`,
        pros: [
          'No StringBuilder — index alone tells you progress',
          'No special case for single-character words — index == word.length() handles everything uniformly',
          'Mark once / unmark once — cleaner than per-direction mark',
        ],
        cons: ['Slightly harder to visualise without the actual string being built'],
      },
    ],
    dryRun: `board = [["A","B","C"],["S","F","E"]], word = "ABCE"

exist() tries all starting cells. Starts at (0,0) = 'A' = word[0] ✓

Generate(0,0, index=0):
  dir=right → currI=0,currJ=1 → in bounds
    mark (0,0), ans="A"
    Generate(0,1, index=1):  board[0][1]='B'=word[1] ✓
      dir=right → currI=0,currJ=2 → in bounds
        mark (0,1), ans="AB"
        Generate(0,2, index=2):  board[0][2]='C'=word[2] ✓
          dir=down → currI=1,currJ=2 → in bounds
            mark (0,2), ans="ABC"
            Generate(1,2, index=3):  board[1][2]='E'=word[3] ✓
              dir=left → currI=1,currJ=1 → in bounds
                mark (1,2), ans="ABCE"
                Generate(1,1, index=4):
                  ans.length()==word.length() → "ABCE".equals("ABCE") → isExist=true ✅`,
    mistakes: [
      { text: 'Removing i,j from Generate signature and adding a nested for-loop inside Generate — this breaks the adjacency constraint. Each recursive call then scans ALL cells for the next character instead of only neighbours of the current cell.', quote: 'Pata bhool gaye apna — toh neighbour ka ghar kaise dhundhoge? i,j signature mein raho.' },
      { text: "Not passing currI,currJ into the recursive call — even if you compute the neighbour, if you don't pass it, the next call doesn't know where it is.", quote: 'Bina address ke delivery nahi hoti — currI,currJ recursive call mein pass karo.' },
      { text: 'Using == instead of .equals() to compare Strings — == checks reference, .equals() checks content.', quote: 'Chehra dekh ke pehchaano, naam se nahi — == reference hai, .equals() content.' },
      { text: 'Checking ans.length() >= word.length() as the base case — the equality branch is never reached. Use > for early exit and == for the match check.', quote: 'Zyada mat lo, thoda zyada mat lo — == se milao, >= se galat milega.' },
      { text: 'Using word.charAt(0) instead of word.charAt(index) inside the dir loop — always checks first character no matter how deep in the recursion.', quote: 'Shuruaat se hi shuru karte raho kya? — index ke hisaab se character dekho.' },
      { text: 'Calling Generate only from (0,0) in exist() — the word can start from ANY cell, not just top-left.', quote: 'Safar sirf ek jagah se shuru nahi hota — word kisi bhi cell se start ho sakta hai.' },
    ],
    relatedProblems: ['maze-paths', 'shortest-path-maze', 'n-queens'],
    revisionLevel: 1,
  },

  'n-queens': {
    slug: 'n-queens',
    title: 'N-Queens',
    lcNum: 51,
    lcLink: 'https://leetcode.com/problems/n-queens/',
    difficulty: 'Hard',
    topic: 'backtracking',
    companies: ['Amazon', 'Google', 'Microsoft', 'Adobe'],
    patterns: ['Backtracking', 'For-Loop Pattern', 'Grid'],
    description: `The n-queens puzzle is the problem of placing n queens on an n × n chessboard such that no two queens attack each other. A queen attacks any piece in the same row, same column, or same diagonal. Given an integer n, return all distinct solutions to the n-queens puzzle. Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' indicates a queen and '.' indicates an empty space.`,
    constraints: [
      '1 <= n <= 9',
    ],
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: 'n = 1', output: '[["Q"]]' },
    ],
    gaonKiBaat: 'Soch gaon ki panchayat jaisi — ek hi row mein do pradhan nahi, ek hi gali mein do neta nahi, aur seedhi line mein bhi do log nahi ho sakte. Har ek ko alag jagah chahiye.',
    hints: [
      'Place exactly one queen per row. This means your recursion goes row by row — row 0, then row 1, then row 2, and so on.',
      'For each row, try placing the queen in every column (0 to n-1). Before placing, check if that cell is safe using isSafe().',
      'isSafe() only needs to check upward — same column above, left diagonal above, right diagonal above. Rows below are empty because we have not placed queens there yet.',
      'After placing a queen at (row, col), recurse with row+1. After the recursive call returns, reset board[row][col] = \'.\' — this is the backtrack step.',
      'Base case: when row == n, all n queens are placed. Convert the board to List<String> and add to answer.',
    ],
    intuition: `Place one queen per row — this alone eliminates all row conflicts. For each row, try each column. Before placing, check if any previously placed queen attacks this cell (column check + two diagonal checks, all upward only). If safe, place and recurse to next row. If you reach row == n, you found a valid arrangement. When you backtrack, reset the cell so the next column gets a clean board.`,
    approaches: [
      {
        label: 'Backtracking — Row by Row',
        idea: 'Place one queen per row using a for-loop over columns. Use isSafe() to check column and both diagonals upward. Recurse to next row. Backtrack by resetting board[row][col] = \'.\'.',
        tc: 'O(n!) — at each row we try at most n columns, pruned heavily by isSafe()',
        sc: 'O(n²) for the board',
        code: `class Solution {
    List<List<String>> ans = new ArrayList<>();

    public List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++)
                board[r][c] = '.';
        Generate(board, n, 0);
        return ans;
    }

    void Generate(char[][] board, int n, int row) {
        if (row == n) {
            List<String> subAns = new ArrayList<>();
            for (int r = 0; r < n; r++) {
                String s = "";
                for (int c = 0; c < n; c++) s += board[r][c];
                subAns.add(s);
            }
            ans.add(subAns);
            return;
        }

        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col)) {
                board[row][col] = 'Q';
                Generate(board, n, row + 1);
                board[row][col] = '.';   // backtrack
            }
        }
    }

    boolean isSafe(char[][] board, int i, int j) {
        // check same column upward
        for (int row = 0; row < i; row++)
            if (board[row][j] == 'Q') return false;

        // check left diagonal upward
        int p = i - 1, q = j - 1;
        while (p >= 0 && q >= 0) {
            if (board[p][q] == 'Q') return false;
            p--; q--;
        }

        // check right diagonal upward
        int r = i - 1, s = j + 1;
        while (r >= 0 && s < board[0].length) {
            if (board[r][s] == 'Q') return false;
            r--; s++;
        }

        return true;
    }
}`,
        pros: ['Clean separation between placement logic and safety check', 'isSafe() is O(n) — no extra space needed', 'Backtrack step is a single line'],
        cons: ['isSafe() runs for every cell tried — O(n) per call. Can be optimised to O(1) using 3 boolean arrays for column, left-diag, right-diag.'],
      },
    ],
    dryRun: `n = 4, board = 4x4 filled with '.'

Generate(row=0):
  col=0 → isSafe(0,0)=true → board[0][0]='Q'
    Generate(row=1):
      col=0 → same col as (0,0) → unsafe
      col=1 → left diagonal of (0,0) → unsafe
      col=2 → isSafe(1,2)=true → board[1][2]='Q'
        Generate(row=2):
          col=0 → col 0 has Q(0,0) → unsafe
          col=1 → right diag of (1,2) hits row 2 → unsafe
          col=2 → col 2 has Q(1,2) → unsafe
          col=3 → left diag of (1,2) hits row 2 → unsafe
          → all cols unsafe → dead end → return
        board[1][2]='.'  ← backtrack
      col=3 → isSafe(1,3)=true → board[1][3]='Q'
        Generate(row=2): all cols unsafe → dead end → return
        board[1][3]='.'  ← backtrack
    board[0][0]='.'  ← backtrack

  col=1 → isSafe(0,1)=true → board[0][1]='Q'
    Generate(row=1):
      col=3 → isSafe(1,3)=true → board[1][3]='Q'
        Generate(row=2):
          col=0 → isSafe(2,0)=true → board[2][0]='Q'
            Generate(row=3):
              col=2 → isSafe(3,2)=true → board[3][2]='Q'
                Generate(row=4): row==n → add [".Q..","...Q","Q...","..Q."] ✅
                board[3][2]='.'
            board[2][0]='.'
        board[1][3]='.'
    board[0][1]='.'

  col=2 → leads to second solution: ["..Q.","Q...","...Q",".Q.."] ✅
  col=3 → no valid arrangement found`,
    mistakes: [
      { text: 'Checking all 8 directions in isSafe() — you only need 3 upward directions since rows below current row have no queens yet.', quote: 'Jo abhi aaya hi nahi, usse darna kya — neeche ki rows khali hain, sirf upar dekho.' },
      { text: 'Forgetting board[row][col] = \'.\' after recursion — the next column tries a dirty board and isSafe() gives wrong results.', quote: 'Apne peeche safai karo — agli baar koi aur raaste se aayega, saaf jagah chahiye usse.' },
      { text: 'Placing queens in all 8 directions recursively instead of just marking — recursion goes row by row, not direction by direction.', quote: 'Aath dishaon mein bhaagne se ghar nahi milta — ek ek kadam, ek ek row.' },
      { text: 'Using row <= n in isSafe() column check instead of row < i — this checks the current row itself, which always has the queen you just placed.', quote: 'Apne aap se hi lad rahe ho — current row mat check karo, sirf upar dekho.' },
      { text: 'Converting board to strings inside the for-loop instead of at base case — you add incomplete boards to the answer.', quote: 'Adha kaam karke certificate mat maango — row==n pe hi harvest karo.' },
    ],
    relatedProblems: ['word-search', 'maze-paths', 'sudoku-solver'],
    revisionLevel: 1,
  },
}

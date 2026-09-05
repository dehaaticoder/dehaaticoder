export const arraysProblems = {
  'sort-colors': {
    slug: 'sort-colors',
    title: 'Sort Colors',
    lcNum: 75,
    lcLink: 'https://leetcode.com/problems/sort-colors/',
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Microsoft', 'Amazon', 'Google', 'Facebook'],
    patterns: ['Dutch National Flag', 'Two Pass Counting', 'Three Pointers'],
    description: `Given an array containing only 0s, 1s, and 2s, sort it in-place without using any built-in sort function.`,
    constraints: [
      'n == nums.length',
      '1 <= n <= 300',
      'nums[i] is either 0, 1, or 2',
    ],
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]' },
    ],
    gaonKiBaat: 'Gaon mein teen rang ki phool hain — laal, safed, neela. Sab bikhar gayi hain. Unhe rang ke hisaab se ek line mein lagana hai — bina poori line uthaye. Teen pointer rakhta hai ek maalin — ek laal ke liye, ek safed ke liye, ek neele ke liye.',
    hints: [
      'Brute force: count 0s, 1s, 2s then overwrite. Two passes, O(n) time.',
      'Optimal: Dutch National Flag — three pointers low, mid, high. Single pass.',
      'When nums[mid]==0 swap with low, move both. When 2 swap with high, move only high. When 1 just move mid.',
    ],
    intuition: `Three zones maintained at all times: [0..low-1] = all 0s, [low..mid-1] = all 1s, [high+1..n-1] = all 2s. mid explores the unknown zone [mid..high]. Stop when mid > high — entire array is partitioned.`,
    approaches: [
      {
        label: 'Brute Force — Counting Sort',
        idea: 'Count occurrences of 0, 1, 2. Then overwrite the array. Two passes.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `void sortColors(int[] nums) {
    int c0 = 0, c1 = 0, c2 = 0;
    for (int n : nums) {
        if (n == 0) c0++;
        else if (n == 1) c1++;
        else c2++;
    }
    int i = 0;
    while (c0-- > 0) nums[i++] = 0;
    while (c1-- > 0) nums[i++] = 1;
    while (c2-- > 0) nums[i++] = 2;
}`,
        pros: ['Simple to understand and implement'],
        cons: ['Two passes — interviewer will ask for single pass'],
      },
      {
        label: 'Optimal — Dutch National Flag (Single Pass)',
        idea: 'Three pointers: low=0, mid=0, high=n-1. mid explores. Swap 0s to left, 2s to right, skip 1s.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int temp = nums[low]; nums[low] = nums[mid]; nums[mid] = temp;
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int temp = nums[high]; nums[high] = nums[mid]; nums[mid] = temp;
            high--;
            // do NOT mid++ — swapped element from high not yet checked
        }
    }
}`,
        pros: ['Single pass', 'O(1) space', 'Classic interview answer'],
        cons: [],
      },
    ],
    dryRun: `nums = [2, 0, 1], low=0, mid=0, high=2

Step 1: nums[mid]=2 → swap with high → [1,0,2], high=1
Step 2: nums[mid]=1 → mid++ → mid=1
Step 3: nums[mid]=0 → swap with low → [0,1,2], low=1, mid=2
Stop: mid(2) > high(1)

Output: [0,1,2] ✅`,
    mistakes: [
      { text: 'Using while(mid < high) instead of while(mid <= high) — misses processing the element at mid==high position.', quote: 'Aakhri kadam mein ruk gaye — mid <= high likhna zaroori hai, warna ek element reh jaata hai.' },
      { text: 'Moving mid++ after swapping with high — the element swapped from high is unseen. Only high-- should move, not mid.', quote: 'Naya aadam aaya hai — pehle usse dekho. mid ko mat badlo jab tak nums[mid] check na ho.' },
      { text: 'Using if-if-if instead of if-else if-else — after swapping a 2 from high, the next if block runs again on same mid, causing wrong swaps.', quote: 'Ek kaam karke ruko — dono kaam ek saath mat karo. else if use karo.' },
    ],
    relatedProblems: ['sort-array-by-parity', 'move-zeroes'],
    revisionLevel: 1,
  },

  'max-vowels': {
    slug: 'max-vowels',
    title: 'Maximum Number of Vowels in a Substring of Given Length',
    lcNum: 1456,
    lcLink: 'https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/',
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Google', 'Amazon'],
    patterns: ['Fixed Size Sliding Window'],
    description: `Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k. Vowels: a, e, i, o, u.`,
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of lowercase English letters',
      '1 <= k <= s.length',
    ],
    examples: [
      { input: 's = "abciiidef", k = 3', output: '3  ("iii" has 3 vowels)' },
      { input: 's = "aeiou", k = 2', output: '2' },
    ],
    gaonKiBaat: 'Gaon mein ek khidki hai k size ki jo poori deewar pe slide karti hai. Har baar khidki move karti hai — ek naya character andar aata hai, ek purana bahar jaata hai. Ek hi baar poora count change karna hota hai — andar aaya toh +1, bahar gaya toh -1.',
    hints: [
      'Count vowels in first window of size k.',
      'Then slide: remove outgoing char (subtract if vowel), add incoming char (add if vowel).',
      'Track max across all windows.',
    ],
    intuition: `Fixed window of size k slides left to right. Instead of recounting from scratch each time, maintain a running count — subtract the character leaving on the left, add the character entering on the right. O(n) total.`,
    approaches: [
      {
        label: 'Fixed Size Sliding Window',
        idea: 'Count vowels in first window, then slide by updating count with outgoing and incoming characters.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int maxVowels(String s, int k) {
    int start = 0, end = k - 1, count = 0;
    String vowels = "aeiou";

    for (int i = 0; i <= end; i++)
        if (vowels.indexOf(s.charAt(i)) >= 0) count++;

    int maxAns = count;
    start++; end++;

    while (end < s.length()) {
        if (vowels.indexOf(s.charAt(start - 1)) >= 0) count--;
        if (vowels.indexOf(s.charAt(end)) >= 0) count++;
        maxAns = Math.max(maxAns, count);
        start++; end++;
    }
    return maxAns;
}`,
        pros: ['O(n) single pass', 'O(1) space'],
        cons: [],
      },
    ],
    dryRun: `s = "abciiidef", k = 3

Window 1: "abc" → count=1 (a), max=1
Window 2: "bci" → out=a(-1), in=i(+1) → count=1, max=1
Window 3: "cii" → out=b(0), in=i(+1) → count=2, max=2
Window 4: "iii" → out=c(0), in=i(+1) → count=3, max=3 ✅
Window 5: "iid" → out=i(-1), in=d(0) → count=2
...
Output: 3`,
    mistakes: [
      { text: 'Recounting vowels from scratch for every window — O(n*k) instead of O(n). Always maintain a running count.', quote: 'Har baar ginti mat karo — jo gaya usse hatao, jo aaya usse jodo. Ek baar ki mehnat, baar baar kaam aaye.' },
      { text: 'Checking outgoing char at wrong index — outgoing is at start-1 (before incrementing), not start.', quote: 'Jo darvaza se bahar gaya woh start-1 pe tha — galat jagah dekha toh count bigad jaata hai.' },
    ],
    relatedProblems: ['longest-substring-no-repeat', 'find-all-anagrams'],
    revisionLevel: 1,
  },

  'container-with-most-water': {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    lcNum: 11,
    lcLink: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Facebook'],
    patterns: ['Two Pointer'],
    description: `Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis forms a container that holds the most water.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' },
    ],
    gaonKiBaat: 'Gaon mein do khet ki deewarein hain, beech mein paani bharenge. Paani kitna bharega? Jo chhoti deewar hai uske barabar — zyada nahi. Ab sochna yeh hai ki kaun si do deewaarein chunen ki zyada se zyada paani bhare.',
    hints: [
      'Brute force: try every pair — O(n²).',
      'Optimal: two pointers at both ends. Area = (right-left) * min(height[left], height[right]).',
      'Move the pointer with the shorter height — only this can possibly increase area.',
    ],
    intuition: `Start with maximum width (left=0, right=n-1). To increase area, width decreases. Only hope is a taller height. The taller side can never help — it's already limited by the shorter side. Move the shorter pointer inward to find something taller.`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'Try every pair of lines. O(n²).',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `int maxArea(int[] height) {
    int max = 0;
    for (int i = 0; i < height.length; i++)
        for (int j = i + 1; j < height.length; j++)
            max = Math.max(max, (j - i) * Math.min(height[i], height[j]));
    return max;
}`,
        pros: ['Simple'],
        cons: ['O(n²) — TLE for large input'],
      },
      {
        label: 'Optimal — Two Pointer',
        idea: 'Start from both ends. Calculate area. Move the shorter height pointer inward. Stop when pointers meet.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    while (left < right) {
        int area = (right - left) * Math.min(height[left], height[right]);
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}`,
        pros: ['O(n) single pass', 'O(1) space'],
        cons: [],
      },
    ],
    dryRun: `height = [1,8,6,2,5,4,8,3,7], left=0, right=8

Step 1: area=(8-0)*min(1,7)=8, max=8. height[0]=1 < height[8]=7 → left++
Step 2: area=(8-1)*min(8,7)=49, max=49. height[1]=8 > height[8]=7 → right--
Step 3: area=(7-1)*min(8,3)=18, max=49. right--
...
Output: 49 ✅`,
    mistakes: [
      { text: 'Moving the taller pointer instead of shorter — moving taller can never increase area (already bottlenecked by shorter side). Always move shorter.', quote: 'Badi deewar hatane se kya faayda — paani toh chhoti deewar tak hi bharega. Chhoti wali hatao, nayi chhoti dhoondho.' },
      { text: 'Using Integer.MIN_VALUE for maxArea initial value — area is always >= 0, initialize to 0.', quote: 'Seedha 0 se shuru karo — paani ki maatra kabhi negative nahi hoti.' },
    ],
    relatedProblems: ['trapping-rain-water', 'two-sum'],
    revisionLevel: 1,
  },

  'longest-substring-no-repeat': {
    slug: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    lcNum: 3,
    lcLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook', 'Bloomberg'],
    patterns: ['Variable Size Sliding Window', 'HashSet'],
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces',
    ],
    examples: [
      { input: 's = "abcabcbb"', output: '3  ("abc")' },
      { input: 's = "bbbbb"', output: '1  ("b")' },
      { input: 's = ""', output: '0' },
    ],
    gaonKiBaat: 'Ek laathi hai jo string ke upar chalti hai. Jab tak naya character naya hai, laathi barhti rehti hai. Jab koi character dobaara aata hai — chhoti taraf se woh character nikalne tak shrink karo, phir baro.',
    hints: [
      'Use two pointers start and end both at 0. Use HashSet to track characters in current window.',
      'Before adding end char — if already in set, remove from start side one by one until removed.',
      'Add end char to set, update max length, move end forward.',
    ],
    intuition: `Variable window — expand end as long as no duplicate. When duplicate found at end, shrink from start until the duplicate is removed. HashSet gives O(1) lookup. Each character enters and exits the set at most once — O(n) total.`,
    approaches: [
      {
        label: 'Variable Sliding Window + HashSet',
        idea: 'Expand end pointer. When duplicate found, shrink from start until removed. Track max length.',
        tc: 'O(n)',
        sc: 'O(min(n, alphabet)) — HashSet size',
        code: `int lengthOfLongestSubstring(String s) {
    if (s.length() == 0) return 0;
    int start = 0, end = 0, ans = 0;
    HashSet<Character> hs = new HashSet<>();

    while (end < s.length()) {
        char ch = s.charAt(end);
        while (hs.contains(ch)) {   // shrink until duplicate removed
            hs.remove(s.charAt(start));
            start++;
        }
        hs.add(ch);
        ans = Math.max(ans, end - start + 1);
        end++;
    }
    return ans;
}`,
        pros: ['O(n) — each char enters/exits set once', 'Clean two pointer logic'],
        cons: ['Inner while loop looks O(n²) but is amortized O(n)'],
      },
    ],
    dryRun: `s = "abcabc", start=0, end=0

end=0: add 'a'. set={a}, len=1, max=1
end=1: add 'b'. set={a,b}, len=2, max=2
end=2: add 'c'. set={a,b,c}, len=3, max=3
end=3: 'a' in set → remove s[0]='a', start=1. add 'a'. set={b,c,a}, len=3, max=3
end=4: 'b' in set → remove s[1]='b', start=2. add 'b'. set={c,a,b}, len=3, max=3
end=5: 'c' in set → remove s[2]='c', start=3. add 'c'. len=3, max=3
Output: 3 ✅`,
    mistakes: [
      { text: 'Adding end char to set BEFORE checking for duplicates — hs.contains(ch) is always true since you just added it. Check first, then add.', quote: 'Pehle ghar mein ghusne do, tab dekhte hain kaun aaya — ulta mat karo.' },
      { text: 'Forgetting end++ — outer while loop runs forever if end never increments.', quote: 'Aage badhna bhool gaye — end++ nahi likha toh infinite loop mein ghoom te rahoge.' },
      { text: 'Not handling empty string — Integer.MIN_VALUE as initial ans breaks for empty input. Initialize ans=0.', quote: 'Khaali string mein koi substring nahi — answer 0 hai, MIN_VALUE nahi.' },
      { text: 'Inner while loop looks O(n²) but is actually O(n) amortized — start moves forward at most n times total across the entire run, not n times per iteration.', quote: 'Start kabhi peeche nahi jaata — poori string mein sirf n baar aage badhlega. Dono loop milake O(2n) = O(n).' },
    ],
    relatedProblems: ['max-vowels', 'minimum-window-substring'],
    revisionLevel: 1,
  },

  'find-minimum-rotated': {
    slug: 'find-minimum-rotated',
    title: 'Find Minimum in Rotated Sorted Array',
    lcNum: 153,
    lcLink: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    patterns: ['Binary Search'],
    description: `Given a sorted array that has been rotated between 1 and n times, find the minimum element. You must write an algorithm that runs in O(log n) time.`,
    constraints: [
      'n == nums.length',
      '1 <= n <= 5000',
      '-5000 <= nums[i] <= 5000',
      'All integers are unique',
    ],
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
      { input: 'nums = [11,13,15,17]', output: '11  (not rotated)' },
    ],
    gaonKiBaat: 'Ek line mein log khade hain height ke order mein — chhote se bade. Par kisi ne beech se kaatke aage laga diya. Ab sabse chhote ko dhoondho. Binary search se — aadha dekho, phir decide karo chhota kidhar hai.',
    hints: [
      'Compare nums[mid] with nums[end].',
      'If nums[mid] > nums[end] — minimum is to the right of mid → start = mid+1.',
      'If nums[mid] <= nums[end] — minimum is mid or to the left → end = mid.',
      'Stop when start == end — that is the minimum.',
    ],
    intuition: `Compare mid with end (not start — start=mid edge case). If mid > end, the rotation point (minimum) is somewhere to the right. If mid <= end, we're in the sorted right half — minimum is at mid or to its left. Never do end=mid-1 because mid itself could be the minimum.`,
    approaches: [
      {
        label: 'Binary Search on End',
        idea: 'Compare nums[mid] with nums[end]. Narrow to the half containing the minimum.',
        tc: 'O(log n)',
        sc: 'O(1)',
        code: `int findMin(int[] nums) {
    int start = 0, end = nums.length - 1;
    while (start < end) {
        int mid = start + (end - start) / 2;
        if (nums[mid] > nums[end])
            start = mid + 1;   // min is to the right
        else
            end = mid;         // min is mid or to the left
    }
    return nums[start];        // start == end == minimum
}`,
        pros: ['O(log n)', 'O(1) space', 'Clean and minimal'],
        cons: [],
      },
    ],
    dryRun: `nums = [3,4,5,1,2], start=0, end=4

Step 1: mid=2, nums[2]=5, nums[4]=2. 5>2 → start=3
Step 2: mid=3, nums[3]=1, nums[4]=2. 1<2 → end=3
Stop: start==end==3 → nums[3]=1

Output: 1 ✅`,
    mistakes: [
      { text: 'Comparing nums[mid] with nums[start] instead of nums[end] — when start==mid (2-element array), start=mid+1 skips the minimum.', quote: 'Start se compare karna dhoka deta hai — end se compare karo, woh safe hai.' },
      { text: 'Using end=mid-1 — mid itself could be the minimum. Always use end=mid to keep mid in consideration.', quote: 'mid ko mat hatao — woh answer bhi ho sakta hai. end=mid likho, end=mid-1 nahi.' },
      { text: 'Using while(start <= end) — when start==end you do one extra unnecessary iteration. Use while(start < end).', quote: 'Ek hi banda bacha hai — wahi answer hai. Loop bandh karo jab start==end ho.' },
    ],
    relatedProblems: ['search-in-rotated-sorted-array', 'binary-search'],
    revisionLevel: 1,
  },

  'generate-subarrays': {
    slug: 'generate-subarrays',
    title: 'Generate All Subarrays',
    lcNum: null,
    lcLink: null,
    difficulty: 'VeryEasy',
    topic: 'arrays',
    companies: ['Scaler'],
    patterns: ['Nested Loops', 'Prefix Thinking'],
    description: `Given an array A of N integers, print all possible subarrays. A subarray is a contiguous part of the array.`,
    constraints: [
      '1 <= N <= 100',
      '-1000 <= A[i] <= 1000',
    ],
    examples: [
      { input: 'A = [1, 2, 3]', output: '[1] [1,2] [1,2,3] [2] [2,3] [3]' },
      { input: 'A = [4, 5]', output: '[4] [4,5] [5]' },
    ],
    gaonKiBaat: 'Array ek gully hai. Har possible stretch of houses ek subarray hai. Pehli house se shuru karo — ek akele, phir uske saath agle wale, phir uske agle. Phir doosri house se shuru karo. Yahi karo jab tak poori gully cover na ho jaye.',
    hints: [
      'Fix starting index i (outer loop).',
      'Fix ending index j starting from i (middle loop).',
      'Print or process elements from i to j (inner loop).',
      'Total subarrays of array of length n = n*(n+1)/2.',
    ],
    intuition: `Every subarray is defined by its start index i and end index j where i <= j. Outer loop fixes start, inner loop extends the end. For each (i,j) pair, iterate from i to j to access elements. Total work = O(n³) for printing, O(n²) for just index pairs.`,
    approaches: [
      {
        label: 'Brute Force — Three Nested Loops',
        idea: 'Fix start i, fix end j, print elements from i to j.',
        tc: 'O(n³)',
        sc: 'O(1)',
        code: `void generateSubarrays(int[] A) {
    int n = A.length;
    for (int i = 0; i < n; i++) {           // start
        for (int j = i; j < n; j++) {       // end
            for (int k = i; k <= j; k++) {  // print
                System.out.print(A[k] + " ");
            }
            System.out.println();
        }
    }
}`,
        pros: ['Simple to understand'],
        cons: ['O(n³) — only for small arrays'],
      },
      {
        label: 'Optimised — Build Subarray Incrementally',
        idea: 'Fix start i, extend end j and keep appending — avoids re-printing from i each time.',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `void generateSubarrays(int[] A) {
    int n = A.length;
    for (int i = 0; i < n; i++) {
        StringBuilder sb = new StringBuilder();
        for (int j = i; j < n; j++) {
            sb.append(A[j]).append(" ");
            System.out.println(sb.toString().trim());
        }
    }
}`,
        pros: ['O(n²) — each pair processed once'],
        cons: [],
      },
    ],
    dryRun: `A = [1, 2, 3]

i=0: j=0 → [1]
      j=1 → [1, 2]
      j=2 → [1, 2, 3]
i=1: j=1 → [2]
      j=2 → [2, 3]
i=2: j=2 → [3]

Total 6 subarrays = 3*(3+1)/2 = 6 ✅`,
    mistakes: [
      { text: 'Starting inner loop j from 0 instead of i — generates non-contiguous pairs and wrong subarrays.', quote: 'j ko i se shuru karo — warna woh subarrays banegi jo exist hi nahi karti.' },
      { text: 'Confusing subarray with subsequence — subarray must be contiguous. Subsequences can skip elements.', quote: 'Subarray mein koi gap nahi — ek hi stretch. Subsequence alag cheez hai.' },
    ],
    relatedProblems: ['sum-all-subarrays', 'max-fixed-window'],
    revisionLevel: 1,
  },

  'sum-all-subarrays': {
    slug: 'sum-all-subarrays',
    title: 'Sum of All Subarrays',
    lcNum: null,
    lcLink: null,
    difficulty: 'Easy',
    topic: 'arrays',
    companies: ['Scaler', 'Adobe'],
    patterns: ['Contribution Technique', 'Prefix Sum'],
    description: `Given an array A of N integers, find the sum of all elements across all possible subarrays.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^4 <= A[i] <= 10^4',
    ],
    examples: [
      { input: 'A = [1, 2, 3]', output: '20  (subarrays: [1]=1, [2]=2, [3]=3, [1,2]=3, [2,3]=5, [1,2,3]=6 → total=20)' },
      { input: 'A = [1, 1]', output: '4' },
    ],
    gaonKiBaat: 'Har element kitni baar alag-alag subarrays mein aata hai? A[i] ke liye — left side mein (i+1) choices hain ki subarray kahan se shuru ho, right side mein (n-i) choices hain ki kahan khatam ho. Toh A[i] total (i+1)*(n-i) subarrays mein aata hai. Bas yahi count karke multiply karo.',
    hints: [
      'Brute force: generate all subarrays, sum everything — O(n²) or O(n³).',
      'Optimal: for element A[i], it appears in (i+1)*(n-i) subarrays.',
      'Contribution = A[i] * (i+1) * (n-i). Sum all contributions.',
    ],
    intuition: `Instead of generating subarrays, think about how many times each element is counted. A[i] appears in every subarray that starts at or before i AND ends at or after i. Start can be 0..i → (i+1) choices. End can be i..n-1 → (n-i) choices. So A[i] contributes A[i]*(i+1)*(n-i) to the total.`,
    approaches: [
      {
        label: 'Brute Force — Generate All Subarrays',
        idea: 'Two nested loops for start/end, accumulate sum of each subarray.',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `long subarraySum(int[] A) {
    long total = 0;
    int n = A.length;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += A[j];
            total += sum;
        }
    }
    return total;
}`,
        pros: ['Easy to understand'],
        cons: ['O(n²) — TLE for large inputs'],
      },
      {
        label: 'Optimal — Contribution Technique',
        idea: 'Each A[i] contributes to (i+1)*(n-i) subarrays. Multiply and sum directly.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `long subarraySum(int[] A) {
    long total = 0;
    int n = A.length;
    for (int i = 0; i < n; i++)
        total += (long) A[i] * (i + 1) * (n - i);
    return total;
}`,
        pros: ['O(n) single pass', 'No nested loops'],
        cons: [],
      },
    ],
    dryRun: `A = [1, 2, 3], n=3

i=0: A[0]=1, contribution = 1*(0+1)*(3-0) = 1*1*3 = 3
i=1: A[1]=2, contribution = 2*(1+1)*(3-1) = 2*2*2 = 8
i=2: A[2]=3, contribution = 3*(2+1)*(3-2) = 3*3*1 = 9

Total = 3+8+9 = 20 ✅`,
    mistakes: [
      { text: 'Using int instead of long for total — (i+1)*(n-i) can be large, causes overflow.', quote: 'int mein nahi samayega — long use karo warna overflow se galat answer aayega.' },
      { text: 'Writing (i+1)*(n-i-1) — the right count is (n-i) not (n-i-1). Element at index i can end a subarray at index i itself.', quote: 'Apna ghar bhi count hota hai — n-i mein index i khud bhi shaamil hai.' },
    ],
    relatedProblems: ['generate-subarrays', 'special-index'],
    revisionLevel: 1,
  },

  'max-fixed-window': {
    slug: 'max-fixed-window',
    title: 'Maximum Subarray Sum of Fixed Length',
    lcNum: null,
    lcLink: null,
    difficulty: 'VeryEasy',
    topic: 'arrays',
    companies: ['Scaler', 'TCS', 'Wipro'],
    patterns: ['Fixed Size Sliding Window'],
    description: `Given an array A of N integers and an integer B, find the maximum sum of any contiguous subarray of length B.`,
    constraints: [
      '1 <= N <= 10^5',
      '1 <= B <= N',
      '-10^4 <= A[i] <= 10^4',
    ],
    examples: [
      { input: 'A = [2, 3, -1, 4, 5], B = 3', output: '8  (subarray [4, 5] wait… [3,-1,4]=6, [-1,4,5]=8)' },
      { input: 'A = [1, 2, 3, 4, 5], B = 2', output: '9  ([4,5])' },
    ],
    gaonKiBaat: 'B size ki ek khidki rakho array par. Pehle B elements ka sum nikalo. Phir khidki ek step aage karo — baayein wala niklo, daayein wala jodo. Har baar maximum track karo. Ek hi baar poora array cover ho jaata hai.',
    hints: [
      'Compute sum of first B elements.',
      'Slide the window: subtract A[i-B], add A[i] for each step.',
      'Track maximum sum across all windows.',
    ],
    intuition: `Fixed window of size B slides across. Instead of recomputing sum from scratch each time (O(B) per step = O(n*B) total), maintain a running sum. When window moves right by 1: outgoing element leaves from left, new element enters from right. One subtraction and one addition per step → O(n) total.`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'For each starting index, sum B elements. Track max.',
        tc: 'O(n*B)',
        sc: 'O(1)',
        code: `int maxSumFixed(int[] A, int B) {
    int max = Integer.MIN_VALUE;
    for (int i = 0; i <= A.length - B; i++) {
        int sum = 0;
        for (int j = i; j < i + B; j++)
            sum += A[j];
        max = Math.max(max, sum);
    }
    return max;
}`,
        pros: ['Simple'],
        cons: ['O(n*B) — slow for large B'],
      },
      {
        label: 'Optimal — Fixed Sliding Window',
        idea: 'Compute first window sum, then slide by subtracting outgoing and adding incoming element.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int maxSumFixed(int[] A, int B) {
    int sum = 0;
    for (int i = 0; i < B; i++) sum += A[i];
    int max = sum;
    for (int i = B; i < A.length; i++) {
        sum += A[i] - A[i - B];
        max = Math.max(max, sum);
    }
    return max;
}`,
        pros: ['O(n) single pass', 'Constant space'],
        cons: [],
      },
    ],
    dryRun: `A = [2, 3, -1, 4, 5], B = 3

First window: 2+3+(-1) = 4, max=4
i=3: sum = 4 + 4 - 2 = 6, max=6   (add A[3]=4, remove A[0]=2)
i=4: sum = 6 + 5 - 3 = 8, max=8   (add A[4]=5, remove A[1]=3)

Output: 8 ✅`,
    mistakes: [
      { text: 'Loop condition i <= A.length-B in brute force — correct, but if B=0 this causes issues. Always validate B>=1.', quote: 'B ki jaanch karo — khidki ka size 0 nahi ho sakta.' },
      { text: 'Subtracting A[i] instead of A[i-B] — wrong element leaves the window.', quote: 'Baayein wala nikaalo — woh A[i-B] hai, A[i] nahi. Khidki shift hoti hai left se.' },
    ],
    relatedProblems: ['max-vowels', 'sum-all-subarrays'],
    revisionLevel: 1,
  },

  'even-numbers-range': {
    slug: 'even-numbers-range',
    title: 'Even Numbers in a Range',
    lcNum: null,
    lcLink: null,
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Scaler'],
    patterns: ['Math', 'Prefix Count'],
    description: `Given Q queries, each with a range [L, R], find the count of even numbers in that range for each query.`,
    constraints: [
      '1 <= Q <= 10^5',
      '1 <= L <= R <= 10^9',
    ],
    examples: [
      { input: 'L=2, R=6', output: '3  (2, 4, 6)' },
      { input: 'L=3, R=9', output: '3  (4, 6, 8)' },
      { input: 'L=1, R=1', output: '0' },
    ],
    gaonKiBaat: 'Gaon mein ghar numbered hain 1 se R tak. Evens ko dhoondhna hai L aur R ke beech. Seedha formula hai — R tak ke evens mein se L-1 tak ke evens ghata do. Even numbers up to N = N/2 (integer division).',
    hints: [
      'Count of even numbers from 1 to N = N/2 (integer division).',
      'Count from L to R = countUpTo(R) - countUpTo(L-1).',
      'countUpTo(N) = N/2.',
    ],
    intuition: `Even numbers up to N are 2, 4, 6, ..., floor(N/2)*2. Total count = floor(N/2). For range [L,R], use prefix counting: evens(L,R) = floor(R/2) - floor((L-1)/2). This runs in O(1) per query — no loop needed.`,
    approaches: [
      {
        label: 'Brute Force — Loop Through Range',
        idea: 'Iterate from L to R, count even numbers.',
        tc: 'O(R-L) per query',
        sc: 'O(1)',
        code: `int countEvens(int L, int R) {
    int count = 0;
    for (int i = L; i <= R; i++)
        if (i % 2 == 0) count++;
    return count;
}`,
        pros: ['Simple'],
        cons: ['O(R-L) per query — TLE when R-L is large'],
      },
      {
        label: 'Optimal — O(1) Math Formula',
        idea: 'Even numbers up to N = N/2. For range [L,R] = R/2 - (L-1)/2.',
        tc: 'O(1) per query',
        sc: 'O(1)',
        code: `int countEvens(int L, int R) {
    return R / 2 - (L - 1) / 2;
}`,
        pros: ['O(1) per query — handles 10^9 range instantly'],
        cons: [],
      },
    ],
    dryRun: `L=2, R=6

R/2 = 6/2 = 3   (evens up to 6: 2,4,6)
(L-1)/2 = 1/2 = 0   (evens up to 1: none)
Answer = 3 - 0 = 3 ✅

L=3, R=9
R/2 = 9/2 = 4   (evens up to 9: 2,4,6,8)
(L-1)/2 = 2/2 = 1   (evens up to 2: just 2)
Answer = 4 - 1 = 3 ✅`,
    mistakes: [
      { text: 'Using (L-1)/2.0 with float division — integer division is needed. In Java, int/int is already integer division, do not cast to double.', quote: 'Integer division se kaam chalega — float mein mat jaao, decimal parts ki zaroorat nahi.' },
      { text: 'Formula R/2 - L/2 — wrong when L is even, it excludes L itself. Correct formula is R/2 - (L-1)/2.', quote: 'L ko include karna hai agar wo even hai — (L-1)/2 likhna zaroori hai, L/2 nahi.' },
    ],
    relatedProblems: ['sum-all-subarrays', 'count-factors'],
    revisionLevel: 1,
  },

  'count-factors': {
    slug: 'count-factors',
    title: 'Count Factors',
    lcNum: null,
    lcLink: null,
    difficulty: 'VeryEasy',
    topic: 'arrays',
    companies: ['Scaler', 'Infosys', 'TCS'],
    patterns: ['Math', 'Square Root Trick'],
    description: `Given an integer A, count the number of its factors (divisors), including 1 and A itself.`,
    constraints: [
      '1 <= A <= 10^9',
    ],
    examples: [
      { input: 'A = 6', output: '4  (factors: 1, 2, 3, 6)' },
      { input: 'A = 5', output: '2  (factors: 1, 5)' },
      { input: 'A = 16', output: '5  (factors: 1, 2, 4, 8, 16)' },
    ],
    gaonKiBaat: 'Ek khet hai A bigha ka. Isko barabar tukdon mein kitne tarike se baant sakte ho? Har tukde ki count factors hai. Jab tak i*i <= A hai tab tak check karo — agar A%i==0 hai toh do factors milte hain: i aur A/i. Agar i*i==A ho toh sirf ek (khud wahi).',
    hints: [
      'Brute force: loop 1 to A, count i where A%i==0. O(A).',
      'Optimal: loop 1 to sqrt(A). For each i where A%i==0, count 2 factors (i and A/i).',
      'Special case: if i*i==A, count only 1 (not 2) — same factor twice.',
    ],
    intuition: `Factors come in pairs: if i divides A then A/i also divides A. So check only up to sqrt(A). For each divisor i found, add 2 to count (for i and A/i). But if i == A/i (i.e., i*i == A), add only 1 — it's a perfect square factor and should not be double-counted.`,
    approaches: [
      {
        label: 'Brute Force — Loop to A',
        idea: 'Check every number from 1 to A.',
        tc: 'O(A)',
        sc: 'O(1)',
        code: `int countFactors(int A) {
    int count = 0;
    for (int i = 1; i <= A; i++)
        if (A % i == 0) count++;
    return count;
}`,
        pros: ['Simple'],
        cons: ['O(A) — TLE for A=10^9'],
      },
      {
        label: 'Optimal — Loop to sqrt(A)',
        idea: 'Factors come in pairs. Check up to sqrt(A), count both i and A/i together.',
        tc: 'O(√A)',
        sc: 'O(1)',
        code: `int countFactors(int A) {
    int count = 0;
    for (int i = 1; (long) i * i <= A; i++) {
        if (A % i == 0) {
            count++;            // factor i
            if (i != A / i)
                count++;        // factor A/i (only if different)
        }
    }
    return count;
}`,
        pros: ['O(√A) — handles 10^9 in ~31623 iterations'],
        cons: [],
      },
    ],
    dryRun: `A = 16

i=1: 16%1==0, 1 != 16 → count=2  (factors 1, 16)
i=2: 16%2==0, 2 != 8  → count=4  (factors 2, 8)
i=3: 16%3!=0, skip
i=4: 16%4==0, 4 == 4  → count=5  (factor 4, perfect square — count only once)
i=5: 5*5=25 > 16, stop

Output: 5 ✅`,
    mistakes: [
      { text: 'Using i*i <= A with int — i*i overflows when A is near 10^9. Cast to long: (long)i*i <= A.', quote: 'int mein i*i overflow ho jaata hai bade numbers mein — (long)i*i likho.' },
      { text: 'Not handling the perfect square case — counting i and A/i both when i==A/i gives wrong count (off by 1).', quote: 'Ek hi cheez do baar count karna galat hai — check karo i != A/i tab hi dono count karo.' },
    ],
    relatedProblems: ['even-numbers-range', 'sum-all-subarrays'],
    revisionLevel: 1,
  },

  'array-rotation': {
    slug: 'array-rotation',
    title: 'Array Rotation (Rotate Right by K)',
    lcNum: 189,
    lcLink: 'https://leetcode.com/problems/rotate-array/',
    difficulty: 'VeryEasy',
    topic: 'arrays',
    companies: ['Microsoft', 'Amazon', 'Bloomberg', 'TCS'],
    patterns: ['Reversal Algorithm', 'Extra Space'],
    description: `Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1',
      '0 <= k <= 10^5',
    ],
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' },
    ],
    gaonKiBaat: 'Ek line mein log khade hain. Peeche ke k log seedha aage aane hain, baaki peeche chale jaate hain. Trick: teen baar palat do — pehle poori line, phir pehle k, phir baaki. Wahi pattern baar baar kaam aata hai.',
    hints: [
      'k = k % n — if k >= n, full rotation brings back to same position.',
      'Extra space: copy last k to front, first n-k to back. O(n) space.',
      'Optimal: reverse entire array, reverse first k, reverse rest. O(1) space.',
    ],
    intuition: `The reversal trick works because rotating right by k is the same as: (1) reverse the whole array — last k elements come to front in reversed order, (2) reverse first k — they are now in correct order, (3) reverse rest — they are now in correct order too. Total 3 reversals, O(n) time, O(1) space.`,
    approaches: [
      {
        label: 'Extra Space',
        idea: 'Copy to a temp array with shifted indices. nums[(i+k)%n] = nums[i].',
        tc: 'O(n)',
        sc: 'O(n)',
        code: `void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    int[] temp = new int[n];
    for (int i = 0; i < n; i++)
        temp[(i + k) % n] = nums[i];
    for (int i = 0; i < n; i++)
        nums[i] = temp[i];
}`,
        pros: ['Simple to understand'],
        cons: ['O(n) extra space'],
      },
      {
        label: 'Optimal — Reversal Algorithm',
        idea: 'Reverse full array, reverse first k elements, reverse remaining n-k elements.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `void rotate(int[] nums, int k) {
    int n = nums.length;
    k = k % n;
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

void reverse(int[] nums, int l, int r) {
    while (l < r) {
        int tmp = nums[l]; nums[l] = nums[r]; nums[r] = tmp;
        l++; r--;
    }
}`,
        pros: ['O(n) time', 'O(1) space', 'In-place — classic interview answer'],
        cons: [],
      },
    ],
    dryRun: `nums = [1,2,3,4,5,6,7], k=3

Step 1 — reverse all:    [7,6,5,4,3,2,1]
Step 2 — reverse [0,2]:  [5,6,7,4,3,2,1]
Step 3 — reverse [3,6]:  [5,6,7,1,2,3,4]

Output: [5,6,7,1,2,3,4] ✅`,
    mistakes: [
      { text: 'Not doing k = k%n — if k==n the array rotates back to original; without mod you do unnecessary work or index out of bounds.', quote: 'Poora chakkar laga ke wapas aana — k%n karo pehle, warna extra kaam hoga.' },
      { text: 'Reversing [0, k] instead of [0, k-1] — k is exclusive endpoint for first segment.', quote: 'k-1 tak reverse karo — k khud doosre group mein hai.' },
    ],
    relatedProblems: ['generate-subarrays', 'find-minimum-rotated'],
    revisionLevel: 1,
  },

  'special-index': {
    slug: 'special-index',
    title: 'Special Index',
    lcNum: null,
    lcLink: null,
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Scaler', 'Adobe', 'Paytm'],
    patterns: ['Prefix Sum', 'Running Total'],
    description: `Given an array A of N integers, find the count of indices i (0-indexed) where the sum of elements to the left of i equals the sum of elements to the right of i. Elements at index i itself are not included in either sum.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^4 <= A[i] <= 10^4',
    ],
    examples: [
      { input: 'A = [1, 2, 3, 4, 3, 2, 1]', output: '1  (index 3: left=1+2+3=6, right=3+2+1=6)' },
      { input: 'A = [0]', output: '1  (index 0: left sum=0, right sum=0)' },
      { input: 'A = [1, 2, 3]', output: '0' },
    ],
    gaonKiBaat: 'Ek taraazu hai — baayi taraf sab elements jo i se pehle hain, daayein taraf jo i ke baad hain. Agar dono side barabar hain, toh index i "special" hai. Har baar total sum mein se left aur A[i] ghata do — jo bacha woh right sum hai.',
    hints: [
      'Compute total sum of array first.',
      'Traverse left to right maintaining prefix sum (left sum).',
      'At each index i: right sum = total - prefix - A[i].',
      'If prefix == right sum → index is special.',
    ],
    intuition: `Instead of recomputing left and right sums for each index (O(n²)), maintain a running left sum (prefix). For index i, right sum = total - prefix - A[i]. Compare prefix and right sum in O(1). Single pass after computing total → O(n) overall.`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'For each index, compute left sum and right sum separately using loops.',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `int specialIndex(int[] A) {
    int count = 0, n = A.length;
    for (int i = 0; i < n; i++) {
        int left = 0, right = 0;
        for (int j = 0; j < i; j++) left += A[j];
        for (int j = i + 1; j < n; j++) right += A[j];
        if (left == right) count++;
    }
    return count;
}`,
        pros: ['Simple'],
        cons: ['O(n²) — TLE for large arrays'],
      },
      {
        label: 'Optimal — Prefix Sum',
        idea: 'Precompute total. Traverse once, track running left sum. Right = total - left - A[i].',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int specialIndex(int[] A) {
    int total = 0;
    for (int x : A) total += x;
    int prefix = 0, count = 0;
    for (int i = 0; i < A.length; i++) {
        int right = total - prefix - A[i];
        if (prefix == right) count++;
        prefix += A[i];
    }
    return count;
}`,
        pros: ['O(n) — single pass after total computation', 'O(1) space'],
        cons: [],
      },
    ],
    dryRun: `A = [1, 2, 3, 4, 3, 2, 1], total=16

i=0: right=16-0-1=15, prefix=0≠15. prefix→1
i=1: right=16-1-2=13, prefix=1≠13. prefix→3
i=2: right=16-3-3=10, prefix=3≠10. prefix→6
i=3: right=16-6-4=6,  prefix=6==6 ✅ count=1. prefix→10
i=4: right=16-10-3=3, prefix=10≠3. prefix→13
i=5: right=16-13-2=1, prefix=13≠1. prefix→15
i=6: right=16-15-1=0, prefix=15≠0.

Output: 1 ✅`,
    mistakes: [
      { text: 'Including A[i] in left or right sum — the problem excludes A[i] from both. Only elements strictly before/after count.', quote: 'A[i] dono taraf se bahar hai — na left mein, na right mein. Sirf neighbours count hote hain.' },
      { text: 'Updating prefix before the comparison — prefix must represent the sum of elements before i, not including i.', quote: 'Pehle compare karo, phir prefix update karo — warna current element bhi left mein chala jaata hai.' },
    ],
    relatedProblems: ['sum-all-subarrays', 'max-subarray-sum-le-b'],
    revisionLevel: 1,
  },

  'max-subarray-sum-le-b': {
    slug: 'max-subarray-sum-le-b',
    title: 'Maximum Subarray Sum ≤ B',
    lcNum: null,
    lcLink: null,
    difficulty: 'Easy',
    topic: 'arrays',
    companies: ['Scaler', 'Google'],
    patterns: ['Sliding Window', 'Prefix Sum'],
    description: `Given an array A of non-negative integers and an integer B, find the maximum sum of any contiguous subarray whose sum does not exceed B.`,
    constraints: [
      '1 <= N <= 10^5',
      '0 <= A[i] <= 10^4',
      '1 <= B <= 10^9',
    ],
    examples: [
      { input: 'A = [2, 3, 1, 4, 5], B = 7', output: '7  (subarray [3,1,4] or [2,5])' },
      { input: 'A = [1, 2, 3], B = 5', output: '5  ([2,3])' },
      { input: 'A = [5, 1, 2], B = 4', output: '3  ([1,2])' },
    ],
    gaonKiBaat: 'Budget B ka mela hai. Har subarray ek package deal hai. Sabse zyada kharcho — lekin B se zyada nahi. Non-negative elements hain toh sliding window kaam karti hai: agar sum zyada ho gayi toh baayein se hatao, warna aage baro.',
    hints: [
      'Since all elements are non-negative, use variable sliding window.',
      'Expand end pointer — add A[end] to sum.',
      'If sum > B, shrink from start — subtract A[start], start++.',
      'After shrinking, update max if sum <= B.',
    ],
    intuition: `With non-negative elements only, adding more elements only increases sum (or keeps same). So a sliding window works: expand until sum > B, then shrink from the left. This greedy shrink works because all elements are >= 0 — removing from left always decreases or maintains the sum.`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'Try every subarray, track maximum sum that is <= B.',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `int maxSumLeB(int[] A, int B) {
    int max = 0;
    for (int i = 0; i < A.length; i++) {
        int sum = 0;
        for (int j = i; j < A.length; j++) {
            sum += A[j];
            if (sum <= B) max = Math.max(max, sum);
            else break; // non-negative: further sum only grows
        }
    }
    return max;
}`,
        pros: ['Simple'],
        cons: ['O(n²)'],
      },
      {
        label: 'Optimal — Variable Sliding Window',
        idea: 'Expand end. If sum > B, shrink start. Track max valid sum.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int maxSumLeB(int[] A, int B) {
    int start = 0, sum = 0, max = 0;
    for (int end = 0; end < A.length; end++) {
        sum += A[end];
        while (sum > B) {
            sum -= A[start];
            start++;
        }
        max = Math.max(max, sum);
    }
    return max;
}`,
        pros: ['O(n)', 'O(1) space'],
        cons: ['Only works when all elements are non-negative'],
      },
    ],
    dryRun: `A = [2, 3, 1, 4, 5], B = 7

end=0: sum=2, max=2
end=1: sum=5, max=5
end=2: sum=6, max=6
end=3: sum=10 > 7 → shrink: sum=8(rem 2), sum=5(rem 3), start=2. max=6
end=4: sum=10 > 7 → shrink: sum=9(rem 1), sum=5(rem 4)... sum=5+5=10 hmm

Actually: after end=3 shrink: sum-=A[0]=2 → 8, sum-=A[1]=3 → 5, start=2. max=6
end=4: sum=5+5=10 > 7 → shrink: sum-=A[2]=1 → 9, sum-=A[3]=4 → 5... wait
sum = 5+5=10 > 7; shrink: sum-=A[2]=1→9, start=3; 9>7: sum-=A[3]=4→5, start=4. max=6
No wait: A[3]=4, A[4]=5. sum=4+5=9>7; shrink removes A[3]: sum=5, start=4. max=6... hmm

Simpler example trace — A=[1,2,3], B=5:
end=0: sum=1, max=1
end=1: sum=3, max=3
end=2: sum=6>5 → shrink: sum-=1→5, start=1. max=5

Output: 5 ✅`,
    mistakes: [
      { text: 'Using this approach with negative elements — sliding window fails when elements can be negative (shrinking may not reduce sum). Only valid for non-negative arrays.', quote: 'Negative elements hain toh yeh trick nahi chalti — sirf non-negative ke liye hai.' },
      { text: 'Updating max before shrinking — if sum > B, you must shrink first, then update max.', quote: 'Pehle budget ke andar aao, tab max update karo — B se zyada toh count hi nahi hoga.' },
    ],
    relatedProblems: ['max-fixed-window', 'longest-substring-no-repeat'],
    revisionLevel: 1,
  },

  'special-subseq-ag': {
    slug: 'special-subseq-ag',
    title: 'Special Subsequences "AG"',
    lcNum: null,
    lcLink: null,
    difficulty: 'Easy',
    topic: 'arrays',
    companies: ['Scaler', 'Amazon'],
    patterns: ['Running Count', 'Greedy Counting'],
    description: `Given a string A consisting of characters 'A' and 'G', count the number of subsequences of the form "AG" — every 'A' that appears before a 'G'. Return the count modulo 10^9+7.`,
    constraints: [
      '1 <= |A| <= 10^5',
      'A[i] is either A or G',
    ],
    examples: [
      { input: 'A = "ABCGAG"', output: '3  (pairs: A[0]G[3], A[0]G[5], A[4]G[5])' },
      { input: 'A = "AGG"', output: '2  (A[0]G[1], A[0]G[2])' },
      { input: 'A = "GGA"', output: '0  (no A before any G)' },
    ],
    gaonKiBaat: 'Gaon mein "A" wale bade bhai hain aur "G" wale chhote bhai. Har chhote bhai "G" ke liye ginno — usse pehle kitne bade bhai "A" the? Woh saari joriyan "AG" subsequences hain. Ek baar left se right chalte hain — "A" milne par count++ karo, "G" milne par answer mein count jodo.',
    hints: [
      'Traverse left to right keeping a count of "A"s seen so far.',
      'When you see "G", all previously seen "A"s can pair with it.',
      'Add count of "A"s seen so far to the answer for each "G".',
    ],
    intuition: `For each 'G' at position j, any 'A' at position i < j forms a valid "AG" subsequence. So the contribution of each 'G' = number of 'A's seen before it. Maintain a running counter of 'A's encountered and add it to the answer on every 'G'. Single pass, O(n).`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'For every G, count all A\'s before it using a nested loop.',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `int countAG(String A) {
    int MOD = 1_000_000_007, ans = 0;
    for (int j = 0; j < A.length(); j++) {
        if (A.charAt(j) == 'G') {
            for (int i = 0; i < j; i++)
                if (A.charAt(i) == 'A') ans = (ans + 1) % MOD;
        }
    }
    return ans;
}`,
        pros: ['Simple'],
        cons: ['O(n²) — TLE for long strings'],
      },
      {
        label: 'Optimal — Running Count of A\'s',
        idea: 'Single pass. Keep count of A\'s seen. On each G, add that count to answer.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int countAG(String A) {
    int MOD = 1_000_000_007, ans = 0, countA = 0;
    for (char c : A.toCharArray()) {
        if (c == 'A') countA++;
        else if (c == 'G') ans = (ans + countA) % MOD;
    }
    return ans;
}`,
        pros: ['O(n) single pass', 'O(1) space'],
        cons: [],
      },
    ],
    dryRun: `A = "AGG"

c='A': countA=1
c='G': ans=0+1=1
c='G': ans=1+1=2

Output: 2 ✅

A = "ABCGAG" (treating non-A/G as neither):
c='A': countA=1
c='G': ans=1
c='A': countA=2
c='G': ans=1+2=3

Output: 3 ✅`,
    mistakes: [
      { text: 'Processing A and G in wrong order — if you update ans before incrementing countA on a same-character, pairing is wrong. On A → increment countA; on G → add countA to ans.', quote: 'A dikhte hi count karo, G dikhte hi ans mein daalo — order mat badlo.' },
      { text: 'Forgetting modulo — answer can be very large. Apply % MOD at each addition.', quote: 'Bada number aa sakta hai — har step pe MOD lagao, ant mein nahi.' },
    ],
    relatedProblems: ['sum-all-subarrays', 'generate-subarrays'],
    revisionLevel: 1,
  },

  'closest-minmax': {
    slug: 'closest-minmax',
    title: 'Closest MinMax',
    lcNum: null,
    lcLink: null,
    difficulty: 'Medium',
    topic: 'arrays',
    companies: ['Scaler', 'Flipkart'],
    patterns: ['Two Pointer', 'Running Min/Max'],
    description: `Given an array A, find the length of the smallest subarray that contains both the global minimum and the global maximum element of the array.`,
    constraints: [
      '1 <= N <= 10^5',
      '-10^9 <= A[i] <= 10^9',
    ],
    examples: [
      { input: 'A = [2, 6, 3, 1, 5, 4]', output: '3  (subarray [6,3,1] — contains min=1 and max=6)' },
      { input: 'A = [1, 2]', output: '2' },
      { input: 'A = [5]', output: '1  (min == max, single element)' },
    ],
    gaonKiBaat: 'Gaon mein sabse amir (max) aur sabse garib (min) insaan hain. Unhe ek hi mela mein bulana hai — aur mela jitna chhota ho utna achha. Array mein inke positions track karo — jab dono mile hon toh distance note karo.',
    hints: [
      'Find global minimum and maximum first.',
      'Traverse array, track last seen position of min and max.',
      'When both have been seen (both positions != -1), compute distance = |lastMin - lastMax| + 1.',
      'Track the minimum such distance.',
    ],
    intuition: `We need the tightest window containing both min and max. After finding global min and max, traverse the array once. Track the most recent index where min was seen and where max was seen. Every time both have appeared at least once, we have a valid window — its length is |lastMinIdx - lastMaxIdx| + 1. Keep the minimum.`,
    approaches: [
      {
        label: 'Brute Force',
        idea: 'Check all subarrays, find ones containing both min and max, return shortest length.',
        tc: 'O(n²)',
        sc: 'O(1)',
        code: `int closestMinMax(int[] A) {
    int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
    for (int x : A) { min = Math.min(min, x); max = Math.max(max, x); }
    int ans = A.length;
    for (int i = 0; i < A.length; i++) {
        boolean foundMin = false, foundMax = false;
        for (int j = i; j < A.length; j++) {
            if (A[j] == min) foundMin = true;
            if (A[j] == max) foundMax = true;
            if (foundMin && foundMax) { ans = Math.min(ans, j - i + 1); break; }
        }
    }
    return ans;
}`,
        pros: ['Easy to understand'],
        cons: ['O(n²)'],
      },
      {
        label: 'Optimal — Single Pass Tracking',
        idea: 'Track last seen index of min and max. Each time both are seen, update answer.',
        tc: 'O(n)',
        sc: 'O(1)',
        code: `int closestMinMax(int[] A) {
    int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
    for (int x : A) { min = Math.min(min, x); max = Math.max(max, x); }

    if (min == max) return 1;   // all elements equal

    int lastMin = -1, lastMax = -1, ans = A.length;
    for (int i = 0; i < A.length; i++) {
        if (A[i] == min) lastMin = i;
        if (A[i] == max) lastMax = i;
        if (lastMin != -1 && lastMax != -1)
            ans = Math.min(ans, Math.abs(lastMin - lastMax) + 1);
    }
    return ans;
}`,
        pros: ['O(n)', 'O(1) space'],
        cons: [],
      },
    ],
    dryRun: `A = [2, 6, 3, 1, 5, 4], min=1, max=6

i=0: A[0]=2  → neither
i=1: A[1]=6  → lastMax=1
i=2: A[2]=3  → neither
i=3: A[3]=1  → lastMin=3. Both seen! |3-1|+1=3, ans=3
i=4: A[4]=5  → neither. ans still 3
i=5: A[5]=4  → neither. ans still 3

Output: 3 ✅`,
    mistakes: [
      { text: 'Not handling case when min==max — entire array has same element, answer is 1.', quote: 'Jab sab ek hi hain toh ek element hi kaafi hai — min==max check zaroori hai.' },
      { text: 'Using lastMin-lastMax without Math.abs — index order varies, difference can be negative.', quote: 'Seedha ghataoge toh negative aa sakta hai — Math.abs lagao hamesha.' },
    ],
    relatedProblems: ['container-with-most-water', 'special-index'],
    revisionLevel: 1,
  },
}

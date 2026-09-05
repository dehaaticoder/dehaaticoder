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
}

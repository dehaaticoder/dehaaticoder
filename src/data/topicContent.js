export const topicContent = {
  backtracking: {
    intro: `Backtracking is a recursive technique where you explore all possibilities and abandon ("backtrack") a path as soon as you know it can't lead to a valid solution.`,
    whyItWorks: `At every step you make a choice. If that choice leads to a dead end, you undo it and try the next option. This "try and undo" pattern is the heart of backtracking.`,
    teachingFlow: [
      { step: 'Concept',        desc: 'Try every path. Prune the bad ones early.' },
      { step: 'Intuition',      desc: 'Pick → Recurse → Unpick. Three steps, always.' },
      { step: 'Analogy',        desc: 'Searching for your buffalo in the jungle.' },
      { step: 'Template',       desc: 'Four patterns — pick the right one for the problem.' },
      { step: 'Problems',       desc: 'Subsets → Combinations → Permutations → N-Queens.' },
    ],
    keyInsight: 'Pick → Recurse → Unpick. But only when you are sharing one object across all calls. If each call gets its own copy — no unpick needed.',
    patterns: [
      {
        name: 'Pattern 1 — For Loop',
        when: 'Choosing from remaining elements. Order matters.',
        whyThisPattern: 'You loop from current index to end. At each step you pick one element, go deeper, then remove it — so the next iteration of the loop can try the next element fresh.',
        unpick: true,
        whyUnpick: 'You are using one shared list. If you add [1] and go deep, when you come back the list still has [1] in it. The next loop iteration would see [1, 2] instead of just [2]. So you must remove it — that is the unpick.',
        examples: 'Subsets, Combinations, Permutations',
        code: `void backtrack(int i, List<Integer> current) {
    result.add(new ArrayList<>(current)); // snapshot at every node

    for (int j = i; j < nums.length; j++) {
        current.add(nums[j]);              // PICK
        backtrack(j + 1, current);         // RECURSE
        current.remove(current.size() - 1); // UNPICK — why? see below
    }
}

// WHY UNPICK?
// current is ONE list shared by ALL recursive calls.
// After going deep with nums[j], we must remove it
// so the next j can start fresh — not carry over nums[j].`,
      },
      {
        name: 'Pattern 2 — Two Explicit Calls (Pick / Not Pick)',
        when: 'Binary choice at each element — include it or skip it.',
        whyThisPattern: 'No loop. Just two branches at every index: one where you pick the element, one where you skip. Cleaner when the choice is always just yes/no.',
        unpick: true,
        whyUnpick: 'Same reason as Pattern 1 — one shared list. You add element, recurse, then remove it so the "not pick" branch sees the list without it.',
        examples: 'Subset Sum, Combination Sum',
        code: `void backtrack(int i, List<Integer> current) {
    if (i == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }

    // PICK
    current.add(nums[i]);
    backtrack(i + 1, current);
    current.remove(current.size() - 1); // UNPICK

    // NOT PICK — list is clean again because we unpicked above
    backtrack(i + 1, current);
}`,
      },
      {
        name: 'Pattern 3 — Grid / Constraint',
        when: '2D board problems. Placement with validity checks.',
        whyThisPattern: 'You place something on a board (queen, digit, character), check if it is valid, recurse to the next row/cell, then remove it. The board is shared — so you must undo the placement.',
        unpick: true,
        whyUnpick: 'The board is ONE shared 2D array. If you place a queen at (row=0, col=2) and go deep, when you come back you must remove it — otherwise the next column will see a queen already placed and give wrong results.',
        examples: 'N-Queens, Sudoku, Word Search, Maze',
        code: `void backtrack(int row) {
    if (row == n) {
        result.add(buildBoard()); // all queens placed
        return;
    }
    for (int col = 0; col < n; col++) {
        if (isValid(row, col)) {
            place(row, col);    // PICK — put queen on board
            backtrack(row + 1); // RECURSE — next row
            remove(row, col);   // UNPICK — take queen off board
        }
    }
}`,
      },
      {
        name: 'Pattern 4 — String / Immutable (No Unpick)',
        when: 'Building a string character by character.',
        whyThisPattern: 'Strings in Java are immutable — meaning you cannot change a string in place. When you write current + "(", it creates a BRAND NEW string. The original current is untouched. So when the recursive call returns, current is already back to what it was — automatically.',
        unpick: false,
        whyUnpick: 'No unpick needed. Each recursive call gets its OWN COPY of the string — not the shared one. Think of it like photocopying a sheet before making notes — the original is always clean.',
        examples: 'Generate Parentheses, Binary Tree Paths, Letter Combinations',
        code: `void backtrack(String current, int open, int close) {
    if (current.length() == 2 * n) {
        result.add(current);
        return;
    }

    if (open < n)
        backtrack(current + "(", open + 1, close);
        // current + "(" creates a NEW string — current is unchanged

    if (close < open)
        backtrack(current + ")", open, close + 1);
        // again a NEW string — no unpick needed
}

// WHY NO UNPICK?
// String is immutable in Java.
// current + "(" does NOT modify current.
// It creates a fresh string and passes it down.
// When that call returns, current is still the same.
// The work is already undone — automatically.`,
      },
    ],
    sharedVsOwnCopy: {
      title: 'Shared Object vs Own Copy — The Real Reason Behind Unpick',
      explanation: `This is the most important concept to understand in backtracking. Once you get this, you will never forget when to unpick and when not to.

SHARED OBJECT means: all recursive calls are looking at and modifying the SAME thing in memory.

Imagine you have one whiteboard in a room. Every person who walks in reads from and writes on that same whiteboard. If person A writes "hello" and walks out without erasing it, person B will see "hello" already written — even though person B never wrote it.

That is what happens with a List in Java. All recursive calls share one list. If call A adds element 5 and goes deeper, when it returns, element 5 is still there. The next call will see it unless you remove it — that is the unpick.

OWN COPY means: each recursive call gets its own fresh version.

Imagine instead of a whiteboard, you give each person a photocopy of the current sheet. They write on their copy. When they are done, they throw it away. The original is untouched.

That is what happens with String in Java. Strings cannot be changed. current + "(" does not write on the original current — it makes a photocopy with the extra character added. When that call finishes, the photocopy is gone. The original current is clean.

SIMPLE RULE:
- Using List, array, or board → SHARED → must unpick
- Using String or passing value → OWN COPY → no unpick needed`,
    },
    commonMistakes: [
      'Forgetting to unpick after recursion when using a shared List — causes all results to be wrong or empty',
      'Not copying the list before adding to result — result.add(current) adds a reference, not a snapshot. When current changes later, your stored result changes too',
      'Trying to unpick a String — String is immutable, unpick is not needed and will not work anyway',
      'Not defining the base case clearly — recursion runs forever',
      'Confusing index i (reuse allowed, pick stays at i) vs i+1 (no reuse, pick moves forward)',
    ],
    animations: [
      { file: 'subsets.html',                   title: 'Subsets — Pick / Not Pick' },
      { file: 'permutation_backtracking.html',   title: 'Permutations — Swap & Recurse' },
      { file: 'generate_parentheses.html',       title: 'Generate Parentheses' },
    ],
    problems: [
      { slug: 'subsets',              title: 'Subsets',              difficulty: 'Medium', lcNum: 78  },
      { slug: 'combination-sum',      title: 'Combination Sum I',    difficulty: 'Medium', lcNum: 39  },
      { slug: 'combination-sum-2',    title: 'Combination Sum II',   difficulty: 'Medium', lcNum: 40  },
      { slug: 'permutations',         title: 'Permutations',         difficulty: 'Medium', lcNum: 46  },
      { slug: 'generate-parentheses', title: 'Generate Parentheses', difficulty: 'Medium', lcNum: 22  },
      { slug: 'n-queens',             title: 'N-Queens',             difficulty: 'Hard',   lcNum: 51  },
    ],
  },
}

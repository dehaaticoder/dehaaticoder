export const topicContent = {
  backtracking: {
    intro: `Backtracking is a recursive technique where you explore all possibilities and abandon ("backtrack") a path as soon as you know it can't lead to a valid solution.`,
    whyItWorks: `At every step you make a choice. If that choice leads to a dead end, you undo it and try the next option. This "try and undo" pattern is the heart of backtracking.`,
    teachingFlow: [
      { step: 'Concept',        desc: 'Try every path. Prune the bad ones early.' },
      { step: 'Intuition',      desc: 'Pick → Recurse → Unpick. Three steps, always.' },
      { step: 'Analogy',        desc: 'Searching for your buffalo in the jungle.' },
      { step: 'Template',       desc: 'One universal code pattern for all problems.' },
      { step: 'Problems',       desc: 'Subsets → Combinations → Permutations → N-Queens.' },
    ],
    template: `void backtrack(args) {
    if (base case) {
        // record result
        return;
    }
    for (choice : all choices) {
        make choice;           // pick
        backtrack(next state); // recurse
        undo choice;           // unpick
    }
}`,
    keyInsight: 'Pick → Recurse → Unpick. Every backtracking problem follows this exact pattern.',
    commonMistakes: [
      'Forgetting to undo the choice after recursion',
      'Not defining the base case clearly',
      'Using a global list without copying it at the leaf',
      'Confusing index i (reuse allowed) vs i+1 (no reuse)',
    ],
    animations: [
      { file: 'subsets.html',                   title: 'Subsets — Pick / Not Pick' },
      { file: 'permutation_backtracking.html',   title: 'Permutations — Swap & Recurse' },
      { file: 'generate_parentheses.html',       title: 'Generate Parentheses' },
    ],
    problems: [
      { slug: 'subsets',          title: 'Subsets',              difficulty: 'Medium', lcNum: 78  },
      { slug: 'combination-sum',  title: 'Combination Sum I',    difficulty: 'Medium', lcNum: 39  },
      { slug: 'combination-sum-2',title: 'Combination Sum II',   difficulty: 'Medium', lcNum: 40  },
      { slug: 'permutations',     title: 'Permutations',         difficulty: 'Medium', lcNum: 46  },
      { slug: 'generate-parentheses', title: 'Generate Parentheses', difficulty: 'Medium', lcNum: 22 },
      { slug: 'n-queens',         title: 'N-Queens',             difficulty: 'Hard',   lcNum: 51  },
    ],
  },
}

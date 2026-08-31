export const resources = [
  {
    category: 'LLD & Design Patterns',
    color: 'purple',
    links: [
      {
        title: 'SOLID Principles (Baeldung)',
        desc: 'Best explanation of SRP, OCP, LSP, ISP, DIP with Java examples. Must-read before any LLD interview.',
        url: 'https://www.baeldung.com/solid-principles',
        tag: 'Article',
      },
      {
        title: 'Scaler Instructor GitHub',
        desc: 'All class discussion code from Kunal Jindal — Singleton, Builder, and more LLD patterns.',
        url: 'https://github.com/kunaljindal-goku/LLD-Backend-July-26',
        tag: 'GitHub',
      },
    ],
  },
  {
    category: 'DSA Practice',
    color: 'green',
    links: [
      {
        title: 'AtCoder Educational DP Contest',
        desc: 'Best structured DP practice problems — from basic to advanced. Covers Knapsack, LCS, Trees, Bitmask.',
        url: 'https://atcoder.jp/contests/dp',
        tag: 'Practice',
      },
    ],
  },
  {
    category: 'Java Reference',
    color: 'blue',
    links: [
      {
        title: 'Java Concurrency in Practice (Baeldung)',
        desc: 'Comprehensive guide to Java multithreading — ExecutorService, locks, volatile, thread-safe patterns.',
        url: 'https://www.baeldung.com/java-concurrency',
        tag: 'Article',
      },
    ],
  },
]

export const tagColors = {
  Article: 'bg-amber-100 text-amber-700',
  GitHub: 'bg-stone-100 text-stone-700',
  Practice: 'bg-green-100 text-green-700',
  Video: 'bg-red-100 text-red-700',
  Tool: 'bg-blue-100 text-blue-700',
}

export const categoryColors = {
  purple: { border: 'border-purple-200', bg: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-700' },
  green:  { border: 'border-green-200',  bg: 'bg-green-50',  dot: 'bg-green-500',  text: 'text-green-700'  },
  blue:   { border: 'border-blue-200',   bg: 'bg-blue-50',   dot: 'bg-blue-500',   text: 'text-blue-700'   },
  amber:  { border: 'border-amber-200',  bg: 'bg-amber-50',  dot: 'bg-amber-500',  text: 'text-amber-700'  },
}

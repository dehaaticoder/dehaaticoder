# Dehaati Coder — Product Document

> "Gaon Ki Baat, DSA Ke Saath"
> Learn DSA the way your best friend would explain it.

---

## 1. Vision

Most DSA platforms teach WHAT to code. Nobody teaches WHY you think wrong and how to fix it.

Dehaati Coder is a DSA education platform built on 3 pillars:
1. **Dehaati tone** — simple language, village proverbs, real analogies. No jargon, no gatekeeping.
2. **Author-solved** — every problem is solved personally by the author. The mistakes, hints, and intuitions are real, not copy-pasted.
3. **Bidirectional** — YouTube channel + website feed each other. Video for intuition, website for deep practice.

Target learner: Indian software engineers preparing for product company interviews who are intimidated by DSA platforms that feel cold and academic.

---

## 2. Design Principles

| Principle | What it means |
|---|---|
| Brute → Optimal | Every problem shows brute force first, then optimal. Never jump to optimal. |
| Think First | "Spend 5 minutes before looking at hints. That struggle is where learning happens." |
| Gaon Ki Baat | Every mistake has a village-style quote. Warm, memorable, not formal. |
| Consistent structure | Every problem: Hints → Intuition → Approaches (code) → Dry Run → Mistakes → Related |
| No gatekeeping | Free. Always. No login required. |

**Brand filter for quotes:** "Would a village elder say this sitting under a tree?" If yes → Dehaati. If it sounds like a film dialogue or textbook → reject.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Visualizers | Custom SVG engine (`treeUtils.js`) |
| Data | Plain JS files (no backend, no database) |
| Hosting | GitHub Pages (planned) |
| Analytics | Google Analytics 4 (planned) |
| Code execution | Judge0 / Piston API (planned) |
| Editor | Monaco Editor (planned) |

**No backend. No database. Everything is static.**
This is intentional — zero infra cost, instant load, works offline.

---

## 4. Architecture

```
src/
├── App.jsx                          → Routes
├── pages/
│   ├── Home.jsx                     → Landing page
│   ├── Roadmap.jsx                  → Topic grid
│   ├── Topic.jsx                    → Problem list per topic
│   ├── Problem.jsx                  → Full problem page
│   ├── Cheatsheet.jsx               → Study tab + Quiz tab per topic
│   └── NotFound.jsx
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── QuizTreeDiagram.jsx          → SVG tree renderer for quiz questions
│   └── visualizers/
│       ├── treeUtils.js             → Core SVG engine (buildSVG, n(), layout)
│       ├── index.js                 → slug → component registry
│       └── [Problem]Visualizer.jsx  → One per problem (10 visualizers)
└── data/
    ├── topics.js                    → Topic metadata (slug, title, icon, color)
    ├── topicContent.js              → Topic page content (description, patterns)
    ├── problems/
    │   └── backtracking.js          → All 12 problem entries
    └── cheatsheets/
        └── backtracking.js          → Patterns, Big-O table, TC/SC guide, 25 quiz questions
```

### URL Structure
```
/dehaaticoder/                        → Home
/dehaaticoder/roadmap                 → All topics
/dehaaticoder/topic/:slug             → Topic page (e.g. /topic/backtracking)
/dehaaticoder/problem/:slug           → Problem page (e.g. /problem/n-queens)
/dehaaticoder/cheatsheet/:topic       → Cheatsheet + Quiz (e.g. /cheatsheet/backtracking)
```

### Data Flow
```
topics.js → Roadmap page → Topic page → Problem page
                                      ↘ Cheatsheet page
problems/backtracking.js → Problem.jsx → renders hints, approaches, dry run, mistakes
                                       → looks up visualizers/index.js → renders SVG
cheatsheets/backtracking.js → Cheatsheet.jsx → Study tab + Quiz tab
```

### Visualizer Registry Pattern
```js
// visualizers/index.js
{ 'n-queens': NQueensVisualizer, 'subsets': SubsetsVisualizer, ... }

// Problem.jsx
const VisualizerComponent = visualizers[problem.slug]
if (VisualizerComponent) <VisualizerComponent />
```
Zero changes to Problem.jsx when adding new visualizers — just register in index.js.

---

## 5. Current State — V0 (Done)

**Topic: Backtracking (complete)**

| Feature | Status |
|---|---|
| 12 problem pages | ✅ |
| 10 SVG tree/grid visualizers | ✅ |
| Backtracking cheatsheet (study tab) | ✅ |
| Patterns, Big-O table, TC/SC guide | ✅ |
| 25-question quiz with SVG tree diagrams | ✅ |
| Gaon Ki Baat quotes on every mistake | ✅ |
| Fullscreen visualizer modal | ✅ |
| SVG watermark protection | ✅ |
| Home page with How to Use section | ✅ |
| Roadmap, Topic, Problem, NotFound pages | ✅ |

---

## 6. MVP — V1 (Next)

Goal: Deploy publicly and link to YouTube channel.

| Feature | Priority |
|---|---|
| GitHub Pages deployment | 🔴 HIGH |
| Google Analytics 4 | 🔴 HIGH |
| Sudoku Solver problem page + visualizer | 🔴 HIGH |
| Progress tracking (localStorage) — solved/attempted/unsolved | 🔴 HIGH |
| Linked List topic (problem pages + visualizers) | 🟡 MEDIUM |
| SEO: title, meta description, Open Graph per page | 🟡 MEDIUM |
| Mobile responsiveness audit | 🟡 MEDIUM |
| YouTube video embed per problem | 🟡 MEDIUM |

**V1 definition of done:** Site is live on GitHub Pages, at least 2 topics complete, YouTube videos linked, Google Analytics tracking.

---

## 7. V2 — Growth

| Feature | Description |
|---|---|
| Coding Platform | Monaco editor + Judge0/Piston API for in-browser code execution |
| Trees topic | Full problem set + visualizers |
| DP topic | DP table visualizer (different from tree visualizer) |
| Multi-language quotes | Hindi (done) → English → Tamil → Kannada → Telugu |
| Dark mode | Toggle in Navbar |
| Quiz score persistence | Best score per topic saved to localStorage |

---

## 8. V3 — Adaptive Learning (North Star)

| Feature | Description |
|---|---|
| Code submission analysis | Submit code → detect which mistake pattern you made |
| Concept gap mapping | Mistake → concept gap → what to study next |
| Personalized journey | Based on history, recommend next problem/concept |
| Progress dashboard | Strengths, weaknesses, improvement over time |
| Community | User comments, quote submissions, contributor credits |

**Phase approach:** Start manually (collect real code submissions), then rule-based detection, then ML.

---

## 9. YouTube ↔ Website Flywheel

```
YouTube video (N-Queens explanation)
        ↓ description link
dehaaticoder N-Queens page (hints, visualizer, quiz)
        ↓ "Watch explanation" button
YouTube video
```

Every topic: one YouTube video + one complete problem page set + one cheatsheet.
Both platforms feed each other → bidirectional traffic → both grow together.

---

## 10. Content Standards

Every problem MUST have:
- [ ] `gaonKiBaat` — one-line village analogy for the problem
- [ ] 3-5 progressive hints (not solution giveaways)
- [ ] `intuition` — why this approach works, in plain language
- [ ] At least 2 approaches: brute force + optimal (with Java code)
- [ ] `dryRun` — step by step trace for small input
- [ ] `mistakes` — minimum 3, each with a Gaon Ki Baat quote
- [ ] `relatedProblems` — 2-3 connected problems

Every cheatsheet MUST have:
- [ ] Patterns section updated when new problem added
- [ ] Big-O table row added for new problem
- [ ] At least 1 new quiz question per new problem

---

## 11. What Makes This Different

| Feature | LeetCode | NeetCode | AlgoMonster | Dehaati Coder |
|---|---|---|---|---|
| Dehaati/village tone | ❌ | ❌ | ❌ | ✅ |
| Author solved every problem | ❌ | ✅ | ❌ | ✅ |
| SVG tree visualizers | ❌ | ❌ | ❌ | ✅ |
| TC/SC guide with visual trees | ❌ | ❌ | ❌ | ✅ |
| Quiz with SVG diagrams | ❌ | ❌ | ❌ | ✅ |
| Free, no login | ✅ | partial | ❌ | ✅ |
| YouTube ↔ website flywheel | ❌ | partial | ❌ | ✅ (planned) |
| Adaptive learning | ❌ | ❌ | ❌ | ✅ (V3) |

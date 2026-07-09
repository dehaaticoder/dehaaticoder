# Dehaati Coder — Product Backlog

## ✅ Done
- 12 backtracking problem pages (full content, hints, approaches, dry run)
- 9 recursion tree visualizers (all backtracking problems except maze/word-search/n-queens/sudoku)
- Pluggable visualizer registry (slug → component, zero changes to Problem.jsx)
- Full-screen modal for visualizers (ESC + backdrop close)
- SVG protection (watermark + pointer-events/user-select none)
- Shared treeUtils.js (computeWidth, assignX, assignY, buildSVG)
- Roadmap, Topic, Problem, Home, NotFound pages

---

## 🔴 HIGH — Core Feature Gaps

### 1. Problem Pages: N-Queens + Sudoku Solver
- [ ] User needs to solve both problems and paste Java code
- [ ] Add full entries in `backtracking.js` (hints, gaonKiBaat, intuition, approaches, dryRun, mistakes)
- [ ] Add visualizers once problem is solved (complex grid-based SVG, not tree)

### 2. Cheatsheet + Quiz (shared page per topic)
- Route: `/dehaaticoder/cheatsheet/:topic`
- [ ] `cheatsheetData.js` — patterns, code templates, Big-O table, common mistakes per topic
- [ ] `Cheatsheet.jsx` page with Study tab (reference card) + Quiz tab (MCQ/flashcard)
- [ ] Quiz state: score tracking, answer shuffling, attempt history via localStorage
- [ ] Wire up Navbar → "Cheatsheets" link
- [ ] Start with: backtracking (only topic with full content right now)

### 3. Progress Tracking (localStorage)
- [ ] Mark problems as "solved" / "attempted" / "unsolved" on Problem page
- [ ] Show completion badge on Topic and Roadmap pages
- [ ] Persist quiz scores per topic
- [ ] Overall progress % on Home page hero

---

## 🟡 MEDIUM — Quality & Experience

### 4. Visualizers: Hard Problems (deferred)
- [ ] Maze Paths visualizer (grid DFS, not tree — needs different SVG approach)
- [ ] Word Search visualizer (4-directional grid, backtracking path highlight)
- [ ] Shortest Path in Maze visualizer
- [ ] N-Queens visualizer (board state at each decision)
- [ ] Sudoku Solver visualizer (constraint propagation tree)

### 5. More Topics
- [ ] Dynamic Programming topic (problem pages + visualizers for DP table)
- [ ] Two Pointers topic
- [ ] Binary Search topic
- [ ] Graphs topic
- Each topic needs: `topicContent.js` entry + problem data file + cheatsheet data

### 6. Coding Platform
- [ ] Monaco editor embed (`@monaco-editor/react`)
- [ ] Code execution via Judge0 or Piston API (REST call, no backend needed)
- [ ] Add `testCases` + `starterCode` fields to problem data
- [ ] "Run Code" section on Problem page (below Dry Run)
- [ ] Support: Java first (user's primary language), Python/JS later

---

## 🟢 LOW — Polish & Infrastructure

### 7. GitHub Pages Deployment
- [ ] Configure `vite.config.js` base path (`/dehaaticoder/`)
- [ ] Add `gh-pages` deploy script to `package.json`
- [ ] Use `dehaaticoder` GitHub account PAT (stored in memory, not here)
- [ ] NEVER push from `dhirajintegrate` account (company account)
- [ ] Reset remote to plain HTTPS after every push

### 8. SEO & Meta
- [ ] `<title>` and `<meta description>` per problem page
- [ ] `robots.txt` and `sitemap.xml`
- [ ] Open Graph tags for social sharing

### 9. Accessibility & Mobile
- [ ] Test all pages on mobile (320px–768px)
- [ ] Keyboard navigation for hint reveal, visualizer fullscreen
- [ ] ARIA labels on interactive elements

### 10. Testing
- [ ] Unit tests for `treeUtils.js` (buildSVG output shape)
- [ ] Snapshot tests for visualizer components
- [ ] Integration test: problem slug → correct visualizer renders

---

## 🎯 RECENTLY DISCUSSED — Add to backlog

### Gaon Ki Baat Mistake Quotes ✅ DONE
- Each mistake in every problem now has a memorable Gaon Ki Baat style Hindi/English quote
- Format: `{ text: '...', quote: '...' }` in mistakes[] array
- Rendered in Problem.jsx with amber italic styling and 🌾 icon
- Pattern established — all new problems should follow same format

### Adaptive Learning — Code Submission & Gap Detection
- When learner submits code → judge it → identify which concept they're missing
- Show a personalized quote/message explaining the gap
- Recommend which problem to revisit before attempting this one
- Full vision documented in NORTH STAR VISION section below

### Coding Platform (prerequisite for above)
- Monaco editor embed → Judge0/Piston API for execution
- Add `testCases` + `starterCode` per problem in data files
- "Run Code" + "Submit" buttons on Problem page

### Traffic Analytics
- Add Google Analytics 4 tracking tag before first deploy
- One `<script>` tag in index.html — zero backend needed
- Will tell us: which problems get most hits, visualizer scroll depth, quiz completion rate

### How to Use Section ✅ DONE
- 4-step onboarding section on Home page: Pick Topic → Think First → Use Hints → Verify & Revise
- Color-coded cards with connecting line (desktop)
- Pro tip banner below

---

## 🌐 MULTI-LANGUAGE QUOTE LOCALIZATION

### The Idea
Gaon Ki Baat quotes are mostly Hindi — a Tamil Nadu or Kannada engineer won't feel the same
emotional connection. Show quotes in the learner's own language/accent so it truly feels personal.

### User Flow
1. First visit → detect browser language (navigator.language gives 'ta-IN', 'kn-IN', 'hi-IN' etc.)
2. Default to detected language, show language selector in navbar/settings
3. User can override → saved to localStorage as `dehaaticoder_lang`
4. All quotes render in chosen language

### Languages to support (priority order)
- Hindi (hi) — current, already written
- English (en) — neutral fallback
- Tamil (ta) — large engineering community
- Kannada (kn) — Bangalore engineers
- Telugu (te) — Hyderabad engineers
- Bengali (bn) — Kolkata + WB engineers
- Marathi (mr) — Pune engineers
- Punjabi (pa) — North India

### Data Structure Change Required
Current format (single string):
```js
quote: 'Ek hi thali mein sabka khana mat daalo...'
```
Target format (multilingual object):
```js
quote: {
  hi: 'Ek hi thali mein sabka khana mat daalo — jab thali palat jaaye, sab ek jaise ho jaate hain.',
  en: "Don't put everyone's food on one plate — when it tips, all looks the same.",
  ta: 'Oru plate-la ellaaraiyum saapida vaikkaadheenga — thirumbinaa ellaamae onnaagae therikum.',
  kn: 'Ondu plate-alli ellara food-nu haakbeda — ulitaagae ellaa onnaagae kaaṇisatte.',
}
```

### Implementation Plan
**Phase 1 — Language selector + English fallback (1 session)**
- Add language picker to Navbar (flag emoji + dropdown)
- Save preference to localStorage
- Problem.jsx reads preference, shows quote[lang] || quote.hi || quote (backward compat)
- Write English versions of all 50+ quotes

**Phase 2 — Tamil + Kannada (community help needed)**
- Reach out to Tamil/Kannada engineers in network
- "Help translate 5 quotes — your name in contributors list"
- Add CONTRIBUTORS.md to repo

**Phase 3 — Auto-detect + regional accents**
- navigator.language → default language on first load
- Regional flavours: Bihari Hindi, Hinglish, formal Tamil vs casual Tamil

### Key Insight
The engineering is simple (1 session). The CONTENT is the hard part — translations need
native speakers who understand cultural feel, not just Google Translate.
Community contributions = people feel ownership = loyal users = growth flywheel.

### Note on current quotes
All 50+ quotes written in Hindi. When implementing Phase 1, add `en` translations first
(you can write those). For other languages, seek native speaker contributions.

### Content Strategy — Use Local Cultural Memory (NOT just translation)
Don't translate our quotes into other languages. Instead, use quotes that already
live in the learner's memory — proverbs, film dialogues, ancient wisdom.

**Why this beats translation:**
- Translation = borrowed emotion. A village proverb from their region = instant trust + warmth.
- It stays true to the brand — Dehaati voice, just in their language.
- First platform to do this → goes viral in every regional engineering community in India.

**⚠️ BRAND FILTER — Apply this to every regional quote:**
> "Would a village elder say this while sitting under a tree?
>  Or does it belong in a cinema hall or a textbook?"

✅ Dehaati: Folk proverbs, grandmother sayings, farming/village analogies, everyday life wisdom
❌ NOT Dehaati: Film dialogues, classical literature, intellectual quotes, city references

**Sources per region (village-first filter applied):**

| Region | ✅ Right source | ❌ Wrong source |
|---|---|---|
| Tamil | Tamil folk proverbs (Pazhamozhi), rural village sayings | Thirukkural (too classical), Rajini dialogues (too filmy) |
| Kannada | Kannada rural kahawats, folk wisdom | Rajkumar dialogues (cinema) |
| Telugu | Simple Vemana verses (village-level), Telugu folk sayings | NTR/Balakrishna dialogues |
| Hindi | Kabir dohe ✅ (Kabir was a weaver, not a scholar — pure Dehaati), village kahawats | Bollywood dialogues, Premchand (too literary) |
| Bengali | Bengali gram-er kotha (village sayings), folk wisdom | Tagore (too urban/intellectual) |
| Marathi | Sant Tukaram abhangas (simple ones), rural Marathi proverbs | Shivaji quotes (too historical/formal) |
| Punjabi | Punjabi village kahawats, fields/farming proverbs | Fancy Punjabi film references |

**Why Kabir is the gold standard:**
Kabir was a weaver from a village — not a scholar, not a king, not a film star.
His dohe travel mouth-to-mouth in villages for 600 years. That energy is exactly
what every regional quote should have. Ask: "Is this the Kabir of that language?"

**Applied example — Mistake: Forgetting to backtrack:**
- Hindi: Kabir doha — "Galti maanna hi asli samajhdari hai, aage badhna toh baad mein"
- Tamil: Folk proverb — "Virundhu undu poidaal, kooda vandha vazhi marakkaadhey" (Don't forget the path you came with)
- Telugu: Vemana (simple) — "Cheppina pani chesthe, pani aagutundi" (Do what you said, the work stops)
- Kannada: Rural kahawat — "Hinde tirugi nodade mundhe hogabeda" (Don't go forward without looking back)

**How to source:**
- Phase 1: Research top 10 village-level proverbs per language (NOT Google's top results — those are usually classical/formal)
- Phase 2: Community contributors — "Know a village saying that fits this mistake? Submit it"
- Phase 3: Build a quote submission portal (GitHub PR or Google Form) with brand filter checklist

---

## 💡 FUTURE IDEAS (not planned, just captured)

- Dark mode toggle
- Difficulty filter on Roadmap
- Search bar across all problems
- "Streak" system (solve N problems in N days)
- Community notes / user comments per problem
- PDF export of cheatsheet
- YouTube video embed per problem (walkthrough link)
- Interview mode: timed problem + blank editor + hints locked

---

## 🚀 NORTH STAR VISION — Adaptive Learning Engine

### The Idea
Most DSA platforms tell you WHAT failed (test case). Nobody tells you WHY you think wrong
and what to do about it. This is that platform.

### The Flow
```
Learner submits their code
          ↓
System runs it against test cases (Judge0 API)
          ↓
Analyzes the failure — not just "wrong answer" but WHICH mistake pattern
          ↓
Maps mistake → concept gap
  e.g. "forgot curr.remove() after recursion" → "weak: backtracking mental model"
  e.g. "used index instead of index+1 in not-pick" → "weak: pick/not-pick recursion"
  e.g. "no sort before HashSet dedup" → "weak: why order matters for dedup"
          ↓
Creates a personalized learning journey
  "You need to strengthen these 2 concepts before moving to the next problem"
          ↓
Tracks improvement over time
  "You've fixed base case mistakes. Still missing backtrack step consistently."
```

### Why This Doesn't Exist Yet
- LeetCode: shows what failed, not why you're thinking wrong
- Pluralsight Skill IQ: quiz-based skill score, not code-analysis based
- Exercism.io: closest — human mentors review code, but not automated, doesn't scale
- DataCamp: adaptive curriculum, but not DSA, not code-analysis driven
- Nobody does: code submitted → concept gap identified → personalized DSA journey

### Our Unfair Advantage
- Already documented top mistakes per problem (hints, mistakes[] in problem data)
- Author solved every problem personally — knows exactly where learners go wrong
- Seed data doesn't need ML to start — rule-based matching on known mistake patterns

### How to Build It (phased)

**Phase 1 — Manual (do now, zero code)**
- Share your contact on the site: "paste your code here, I'll tell you what's wrong"
- Collect real submissions, identify repeating mistake patterns
- Document: mistake fingerprint → concept gap → recommended fix

**Phase 2 — Rule-based automation (after 50+ learner submissions)**
- For each problem: write 5-7 mistake detection rules (AST pattern match or output-based)
- Map each rule → concept gap → specific content to revisit
- Show learner: "You made mistake X — here's why — here's what to study"

**Phase 3 — Personalized journey (after 200+ learners)**
- Build concept dependency graph (recursion → backtracking → pruning → optimization)
- Based on accumulated gap history, recommend next problem/concept
- Dashboard: strengths, weaknesses, improvement over time

**Phase 4 — ML / community (long term)**
- Train on thousands of real submissions to find new mistake patterns automatically
- Community: learners share solutions, vote on explanations, help each other
- Leaderboard by concept mastery, not just problems solved

### Key Insight
> Start manually. When the same 5 mistakes appear across 50 learners,
> that's the signal to automate. Data first, automation second.

### Market Gap
This is a blue ocean for DSA education specifically. No platform combines:
✓ Automated code analysis
✓ Concept gap mapping  
✓ Personalized learning journey
✓ Progress tracking over time
...for DSA problem solving.

---

## 📋 Order of Work (recommended)
1. N-Queens + Sudoku problem pages (needs your Java solution first)
2. Cheatsheet + Quiz for backtracking
3. Progress tracking (localStorage)
4. More topics (DP first — highest interview value)
5. Coding platform
6. GitHub Pages deployment
7. SEO + mobile polish

import { Link } from 'react-router-dom'

const features = [
  { icon: '🧠', title: 'Brute → Better → Optimal', desc: 'Every problem walks you through the same journey an interviewer expects.' },
  { icon: '🌾', title: 'Gaon Ki Baat, DSA Ke Saath', desc: 'Real-life analogies before every concept. Finally explained like a friend.' },
  { icon: '🎥', title: 'Visual Animations', desc: 'See the algorithm move. Not just code — intuition.' },
  { icon: '💡', title: 'Hint-First Learning', desc: 'Think first. Hints guide you. Solution is the last resort.' },
  { icon: '📄', title: 'Cheatsheets + Quizzes', desc: 'Quick revision before interviews. Topic-wise, not a wall of text.' },
  { icon: '🆓', title: '100% Free. Always.', desc: 'No paywall. No login required. No gatekeeping.' },
]

const thought = 'Every optimal solution begins as a brute force solution.'

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <nav className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dehaaticoder/" className="flex items-center gap-2 font-bold text-xl text-stone-800">
            🌾 <span>Dehaati Coder</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-stone-500">
            <Link to="/dehaaticoder/roadmap" className="hover:text-green-600 transition">Roadmap</Link>
            <Link to="/dehaaticoder/topic/backtracking" className="hover:text-green-600 transition">Topics</Link>
            <Link to="/dehaaticoder/" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
              Start Learning
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-200">
          🌾 Gaon Ki Baat, DSA Ke Saath
        </div>
        <h1 className="text-5xl font-bold text-stone-900 leading-tight mb-6">
          Learn DSA the way your<br />
          <span className="text-green-600">best friend would explain it.</span>
        </h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          No jargon. No gatekeeping. Just intuition, real-life analogies, and a clear path from brute force to optimal.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/dehaaticoder/roadmap" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-lg transition text-lg">
            Start Learning →
          </Link>
          <Link to="/dehaaticoder/topic/backtracking" className="border border-stone-300 hover:border-green-500 text-stone-700 hover:text-green-600 font-semibold px-8 py-3.5 rounded-lg transition text-lg">
            Browse Topics
          </Link>
        </div>
      </section>

      {/* Today's Dehaati Thought */}
      <section className="bg-amber-50 border-y border-amber-100 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Today's Dehaati Thought</p>
          <p className="text-2xl font-semibold text-stone-800 italic">"{thought}"</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">Why Dehaati Coder?</h2>
        <p className="text-stone-500 text-center mb-14 text-lg">Built for learners who want to actually understand, not just memorize.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-stone-200 rounded-xl p-6 hover:border-green-300 hover:shadow-sm transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-stone-800 mb-2 text-lg">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap preview */}
      <section className="bg-stone-50 border-y border-stone-200 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Your Learning Path</h2>
          <p className="text-stone-500 mb-10 text-lg">Start from the basics. Go all the way to DP and Graphs.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Arrays', 'Strings', 'HashMap', 'Stack', 'Queue', 'Linked List', 'Trees', 'BST', 'Heap', 'Graph', 'Backtracking', 'Trie', 'Dynamic Programming'].map((t, i) => (
              <span key={t} className={`px-4 py-2 rounded-full text-sm font-medium border ${i < 3 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-stone-600 border-stone-300'}`}>
                {t}
              </span>
            ))}
          </div>
          <Link to="/dehaaticoder/roadmap" className="inline-block mt-10 text-green-600 font-semibold hover:underline">
            View Full Roadmap →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 text-center text-stone-400 text-sm">
        <p>🌾 Dehaati Coder — Made with ❤️ for every learner in India</p>
        <p className="mt-1">Free. Always.</p>
      </footer>

    </div>
  )
}

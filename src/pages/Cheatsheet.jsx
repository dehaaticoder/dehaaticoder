import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { backtrackingCheatsheet } from '../data/cheatsheets/backtracking'

const cheatsheets = {
  backtracking: backtrackingCheatsheet,
}

const tagColors = {
  gotcha: 'bg-red-100 text-red-700',
  key:    'bg-blue-100 text-blue-700',
}

export default function Cheatsheet() {
  const { topic } = useParams()
  const data = cheatsheets[topic]
  const [tab, setTab] = useState('study')

  // Quiz state
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [bestScore, setBestScore] = useState(null)

  const STORAGE_KEY = `dehaaticoder_quiz_${topic}`

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setBestScore(JSON.parse(saved).best)
  }, [topic])

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold text-stone-800 mb-3">Cheatsheet not found</h1>
      <Link to="/dehaaticoder/roadmap" className="text-green-600 hover:underline">← Back to Roadmap</Link>
    </div>
  )

  const score = submitted
    ? data.quiz.filter((q, i) => answers[i] === q.answer).length
    : 0

  function handleSubmit() {
    if (Object.keys(answers).length < data.quiz.length) return
    setSubmitted(true)
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const newBest = Math.max(score, saved.best || 0)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ best: newBest, last: score, attempts: (saved.attempts || 0) + 1 }))
    setBestScore(newBest)
  }

  function handleRetry() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8 text-sm text-stone-400">
        <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-700 font-medium capitalize">{data.title} Cheatsheet</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6 pb-24 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">{data.title} — Quick Reference</h1>
            <p className="text-stone-500 mt-1 text-sm">Study the patterns, then test yourself with the quiz.</p>
          </div>
          {bestScore !== null && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-800">
              🏆 Best score: <span className="font-bold">{bestScore}/{data.quiz.length}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-stone-200">
          {[
            { key: 'study', label: '📖 Study' },
            { key: 'quiz',  label: '🧠 Quiz' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
                tab === t.key
                  ? 'border-green-500 text-green-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── STUDY TAB ─────────────────────────────────────────────────── */}
        {tab === 'study' && (
          <div className="space-y-10">

            {/* Patterns */}
            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">Patterns</h2>
              <div className="space-y-6">
                {data.patterns.map(p => (
                  <div key={p.name} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <h3 className="font-bold text-stone-800">{p.name}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">{p.when}</p>
                      </div>
                    </div>
                    <div className="px-6 py-3 border-b border-stone-100 flex flex-wrap gap-2">
                      {p.problems.map(prob => (
                        <span key={prob} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">{prob}</span>
                      ))}
                    </div>
                    <pre className="bg-stone-900 text-green-300 px-6 py-4 text-xs leading-relaxed overflow-x-auto font-mono">{p.template}</pre>
                  </div>
                ))}
              </div>
            </section>

            {/* Universal Template */}
            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-1">{data.standardTemplate.title}</h2>
              <p className="text-stone-500 text-sm mb-4">
                Mantra: <span className="font-bold text-green-700">{data.standardTemplate.mantra}</span>
              </p>
              <pre className="bg-stone-900 text-green-300 px-6 py-5 rounded-xl text-sm leading-relaxed overflow-x-auto font-mono">
                {data.standardTemplate.code}
              </pre>
            </section>

            {/* Key Rules */}
            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">Key Rules & Gotchas</h2>
              <div className="space-y-3">
                {data.rules.map(r => (
                  <div key={r.rule} className="bg-white border border-stone-200 rounded-xl px-5 py-4 flex gap-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full h-fit shrink-0 ${tagColors[r.tag]}`}>
                      {r.tag}
                    </span>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm mb-1">{r.rule}</p>
                      <p className="text-stone-500 text-sm">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Big-O Table */}
            <section>
              <h2 className="text-xl font-bold text-stone-800 mb-4">Time & Space Complexity</h2>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold text-stone-700">Problem</th>
                      <th className="px-5 py-3 text-left font-semibold text-stone-700">Time</th>
                      <th className="px-5 py-3 text-left font-semibold text-stone-700">Space</th>
                      <th className="px-5 py-3 text-left font-semibold text-stone-500 text-xs">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.complexity.map((row, i) => (
                      <tr key={row.problem} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                        <td className="px-5 py-3 font-medium text-stone-800">{row.problem}</td>
                        <td className="px-5 py-3 font-mono text-green-700">{row.tc}</td>
                        <td className="px-5 py-3 font-mono text-blue-700">{row.sc}</td>
                        <td className="px-5 py-3 text-stone-400 text-xs">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-green-50 border border-green-300 rounded-xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-green-800">Are you ready to test yourself, Dehaati Coder?</p>
                <p className="text-green-700 text-sm mt-0.5">{data.quiz.length} questions covering all patterns above.</p>
              </div>
              <button
                onClick={() => setTab('quiz')}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                Start Quiz →
              </button>
            </div>

          </div>
        )}

        {/* ── QUIZ TAB ──────────────────────────────────────────────────── */}
        {tab === 'quiz' && (
          <div className="space-y-6">

            {/* Score banner */}
            {submitted && (
              <div className={`rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-4 ${
                score === data.quiz.length ? 'bg-green-50 border border-green-300' :
                score >= data.quiz.length * 0.7 ? 'bg-amber-50 border border-amber-300' :
                'bg-red-50 border border-red-200'
              }`}>
                <div>
                  <p className="font-bold text-stone-800 text-lg">
                    {score}/{data.quiz.length} correct
                    {score === data.quiz.length && ' 🎉 Perfect!'}
                    {score >= data.quiz.length * 0.7 && score < data.quiz.length && ' 👍 Good job!'}
                    {score < data.quiz.length * 0.7 && ' 📖 Review the study tab!'}
                  </p>
                  {bestScore !== null && <p className="text-stone-500 text-sm">Best: {bestScore}/{data.quiz.length}</p>}
                </div>
                <button
                  onClick={handleRetry}
                  className="border border-stone-300 hover:border-green-400 text-stone-600 hover:text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Retry Quiz
                </button>
              </div>
            )}

            {/* Questions */}
            {data.quiz.map((q, qi) => {
              const chosen = answers[qi]
              const correct = q.answer
              const isCorrect = chosen === correct
              return (
                <div key={qi} className={`bg-white border rounded-xl overflow-hidden ${
                  submitted ? (isCorrect ? 'border-green-300' : 'border-red-300') : 'border-stone-200'
                }`}>
                  <div className="px-6 py-4 border-b border-stone-100 flex items-start gap-3">
                    <span className="text-xs font-bold text-stone-400 shrink-0 mt-0.5">Q{qi + 1}</span>
                    <p className="font-semibold text-stone-800">{q.q}</p>
                  </div>
                  <div className="px-6 py-4 space-y-2">
                    {q.options.map((opt, oi) => {
                      let style = 'border-stone-200 text-stone-700 hover:border-green-400'
                      if (submitted) {
                        if (oi === correct) style = 'border-green-400 bg-green-50 text-green-800'
                        else if (oi === chosen && !isCorrect) style = 'border-red-300 bg-red-50 text-red-700'
                        else style = 'border-stone-100 text-stone-400'
                      } else if (chosen === oi) {
                        style = 'border-green-500 bg-green-50 text-green-800'
                      }
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                          className={`w-full text-left border rounded-lg px-4 py-2.5 text-sm transition ${style} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className="font-mono text-xs text-stone-400 mr-2">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {submitted && (
                    <div className="px-6 pb-4">
                      <div className={`rounded-lg px-4 py-3 text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                        <span className="font-semibold">{isCorrect ? '✓ Correct — ' : '✗ Incorrect — '}</span>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Submit */}
            {!submitted && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-400">{Object.keys(answers).length}/{data.quiz.length} answered</p>
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length < data.quiz.length}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-stone-200 disabled:text-stone-400 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  Submit Quiz
                </button>
              </div>
            )}

          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}

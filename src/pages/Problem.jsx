import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { backtrackingProblems } from '../data/problems/backtracking'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const allProblems = { ...backtrackingProblems }

const difficultyColors = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}

export default function Problem() {
  const { slug } = useParams()
  const problem = allProblems[slug]
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showIntuition, setShowIntuition] = useState(false)
  const [showApproaches, setShowApproaches] = useState(false)
  const [showDryRun, setShowDryRun] = useState(false)

  if (!problem) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold text-stone-800 mb-3">Problem not found</h1>
      <Link to="/dehaaticoder/roadmap" className="text-green-600 hover:underline">← Back to Roadmap</Link>
    </div>
  )

  return (
    <div className="min-h-screen">

      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8 text-sm text-stone-400">
        <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
        <span className="mx-2">›</span>
        <Link to={`/dehaaticoder/topic/${problem.topic}`} className="hover:text-green-600 capitalize">{problem.topic}</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-700 font-medium">{problem.title}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6 pb-24 space-y-10">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h1 className="text-3xl font-bold text-stone-900">{problem.title}</h1>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</span>
            <a href={problem.lcLink} target="_blank" rel="noreferrer"
              className="text-xs text-stone-400 hover:text-green-600 border border-stone-200 px-2 py-1 rounded-lg transition">
              LC #{problem.lcNum} ↗
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {problem.patterns.map(p => (
              <span key={p} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{p}</span>
            ))}
          </div>
        </div>

        {/* Gaon Ki Baat */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-2">🌾 Gaon Ki Baat</p>
          <p className="text-amber-900 italic leading-relaxed">"{problem.gaonKiBaat}"</p>
        </div>

        {/* Problem Statement */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-3">Problem Statement</h2>
          <p className="text-stone-600 leading-relaxed mb-5">{problem.description}</p>

          <div className="space-y-3 mb-5">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 font-mono text-sm">
                <p className="text-stone-500 mb-1">Input: <span className="text-stone-800">{ex.input}</span></p>
                <p className="text-stone-500">Output: <span className="text-green-700 font-semibold">{ex.output}</span></p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-500 mb-2">Constraints:</p>
            <ul className="space-y-1">
              {problem.constraints.map((c, i) => (
                <li key={i} className="text-sm text-stone-500 font-mono">• {c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Think Yourself */}
        <section className="bg-green-50 border border-green-200 rounded-xl px-6 py-5">
          <p className="font-bold text-green-800 text-lg mb-1">⏸ Think Yourself First</p>
          <p className="text-green-700 text-sm">Spend at least 5 minutes before looking at hints. That struggle is where learning happens.</p>
        </section>

        {/* Hints */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Hints</h2>
          <div className="space-y-3">
            {problem.hints.map((hint, i) => (
              <div key={i}>
                {i < hintsRevealed ? (
                  <div className="bg-white border border-stone-200 rounded-xl px-5 py-4">
                    <p className="text-xs font-semibold text-stone-400 mb-1">Hint {i + 1}</p>
                    <p className="text-stone-700">{hint}</p>
                  </div>
                ) : i === hintsRevealed ? (
                  <button
                    onClick={() => setHintsRevealed(i + 1)}
                    className="w-full bg-white border border-dashed border-stone-300 hover:border-green-400 rounded-xl px-5 py-4 text-stone-400 hover:text-green-600 transition text-sm font-medium text-left"
                  >
                    👁 Reveal Hint {i + 1}
                  </button>
                ) : (
                  <div className="bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-stone-300 text-sm">
                    Hint {i + 1} — unlock hint {i} first
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Intuition */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-stone-800">Intuition</h2>
            {!showIntuition && (
              <button onClick={() => setShowIntuition(true)}
                className="text-sm text-green-600 border border-green-300 px-4 py-1.5 rounded-lg hover:bg-green-50 transition">
                Show Intuition
              </button>
            )}
          </div>
          {showIntuition ? (
            <p className="text-stone-600 leading-relaxed text-lg">{problem.intuition}</p>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-200 rounded-xl px-6 py-5 text-stone-400 text-sm text-center">
              Try the hints first. Intuition reveals the core idea.
            </div>
          )}
        </section>

        {/* Approaches */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-stone-800">Approaches</h2>
            {!showApproaches && (
              <button onClick={() => setShowApproaches(true)}
                className="text-sm text-green-600 border border-green-300 px-4 py-1.5 rounded-lg hover:bg-green-50 transition">
                Show Solutions
              </button>
            )}
          </div>
          {showApproaches ? (
            <div className="space-y-8">
              {problem.approaches.map((approach, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <h3 className="font-bold text-stone-800">{approach.label}</h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="bg-stone-100 px-2 py-1 rounded">TC: {approach.tc}</span>
                      <span className="bg-stone-100 px-2 py-1 rounded">SC: {approach.sc}</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-b border-stone-100">
                    <p className="text-stone-600 text-sm leading-relaxed">{approach.idea}</p>
                  </div>
                  <pre className="bg-stone-900 text-green-300 px-6 py-5 text-sm leading-relaxed overflow-x-auto font-mono">
                    {approach.code}
                  </pre>
                  {(approach.pros.length > 0 || approach.cons.length > 0) && (
                    <div className="px-6 py-4 flex gap-8 text-sm">
                      {approach.pros.length > 0 && (
                        <div>
                          <p className="font-semibold text-green-700 mb-1">✓ Pros</p>
                          {approach.pros.map((p, j) => <p key={j} className="text-stone-500">• {p}</p>)}
                        </div>
                      )}
                      {approach.cons.length > 0 && (
                        <div>
                          <p className="font-semibold text-red-600 mb-1">✗ Cons</p>
                          {approach.cons.map((c, j) => <p key={j} className="text-stone-500">• {c}</p>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-200 rounded-xl px-6 py-5 text-stone-400 text-sm text-center">
              Work through hints and intuition first, then reveal solutions.
            </div>
          )}
        </section>

        {/* Dry Run */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-stone-800">Dry Run</h2>
            {!showDryRun && (
              <button onClick={() => setShowDryRun(true)}
                className="text-sm text-green-600 border border-green-300 px-4 py-1.5 rounded-lg hover:bg-green-50 transition">
                Show Dry Run
              </button>
            )}
          </div>
          {showDryRun ? (
            <pre className="bg-stone-50 border border-stone-200 rounded-xl px-6 py-5 text-sm text-stone-700 leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap">
              {problem.dryRun}
            </pre>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-200 rounded-xl px-6 py-5 text-stone-400 text-sm text-center">
              Try tracing through the code yourself first.
            </div>
          )}
        </section>

        {/* Common Mistakes */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Common Mistakes</h2>
          <div className="space-y-3">
            {problem.mistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <p className="text-stone-700 text-sm">{m}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Problems */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Related Problems</h2>
          <div className="flex flex-wrap gap-3">
            {problem.relatedProblems.map(slug => (
              <Link key={slug} to={`/dehaaticoder/problem/${slug}`}
                className="border border-stone-200 hover:border-green-400 text-stone-600 hover:text-green-600 px-4 py-2 rounded-lg text-sm transition capitalize">
                {slug.replace(/-/g, ' ')} →
              </Link>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
}

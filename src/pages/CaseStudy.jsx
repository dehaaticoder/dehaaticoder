import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { topicContent } from '../data/topicContent'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MermaidDiagram({ chart }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!chart || !ref.current) return

    const renderDiagram = () => {
      if (window.mermaid) {
        window.mermaid.initialize({ startOnLoad: false, theme: 'default' })
        ref.current.innerHTML = `<pre class="mermaid">${chart}</pre>`
        window.mermaid.run({ nodes: [ref.current.querySelector('.mermaid')] })
      }
    }

    if (window.mermaid) {
      renderDiagram()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js'
    script.onload = renderDiagram
    document.head.appendChild(script)
  }, [chart])

  return (
    <div
      ref={ref}
      className="bg-white border border-stone-200 rounded-xl p-6 overflow-x-auto"
    />
  )
}

const difficultyColors = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-red-100 text-red-700',
}

const typeColors = {
  'Entity System':    'bg-blue-100 text-blue-700',
  'Working Software': 'bg-purple-100 text-purple-700',
}

export default function CaseStudy() {
  const { slug, caseSlug } = useParams()
  const content = topicContent[slug]
  const caseStudy = content?.caseStudies?.find(c => c.slug === caseSlug)

  if (!content || !caseStudy) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold text-stone-800 mb-3">Case study not found</h1>
      <Link to={`/dehaaticoder/topic/${slug}`} className="mt-4 text-green-600 hover:underline">← Back</Link>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="text-sm text-stone-400">
          <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
          <span className="mx-2">›</span>
          <Link to={`/dehaaticoder/topic/${slug}`} className="hover:text-green-600">Machine Coding</Link>
          <span className="mx-2">›</span>
          <span className="text-stone-700 font-medium">{caseStudy.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-10">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[caseStudy.type] ?? 'bg-stone-100 text-stone-600'}`}>
            {caseStudy.type}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[caseStudy.difficulty] ?? 'bg-stone-100 text-stone-600'}`}>
            {caseStudy.difficulty}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-stone-900 mb-3">{caseStudy.title}</h1>
        <p className="text-stone-500 text-lg leading-relaxed">{caseStudy.description}</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 space-y-14">

        {/* Key Insight */}
        {caseStudy.keyInsight && (
          <section className="bg-green-50 border border-green-200 rounded-xl px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">💡 Key Insight</p>
            <p className="text-green-900 text-lg font-semibold">{caseStudy.keyInsight}</p>
          </section>
        )}

        {/* Iris Walkthrough — follows interview order: Requirements → Entity Design → Implementation */}
        {caseStudy.irisWalkthrough && caseStudy.irisWalkthrough.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Iris Walkthrough — Interview Replay</h2>
            <div className="space-y-10">
              {caseStudy.irisWalkthrough.map((phase, pi) => {
                const scoreColor = phase.score >= 85 ? 'text-green-700 bg-green-100' : phase.score >= 75 ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100'
                return (
                  <div key={pi} className="border border-stone-200 rounded-2xl overflow-hidden">
                    {/* Phase header */}
                    <div className="flex items-center justify-between gap-4 px-6 py-4 bg-stone-50 border-b border-stone-100">
                      <h3 className="font-bold text-stone-800 text-lg">{phase.phase}</h3>
                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${scoreColor}`}>{phase.score}%</span>
                        {phase.scoreNote && <span className="text-xs text-stone-400 max-w-xs text-right">{phase.scoreNote}</span>}
                      </div>
                    </div>

                    {/* Q&A */}
                    {phase.questions && phase.questions.length > 0 && (
                      <div className="px-6 py-5 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Q &amp; A Flow</p>
                        {phase.questions.map((item, qi) => (
                          <div key={qi} className="rounded-xl border border-stone-100 overflow-hidden">
                            <div className="flex gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100">
                              <span className="text-blue-500 font-bold shrink-0 text-sm mt-0.5">Q</span>
                              <p className="text-blue-800 text-sm font-medium">{item.q}</p>
                            </div>
                            <div className="flex gap-3 px-4 py-3 bg-white">
                              <span className="text-green-500 font-bold shrink-0 text-sm mt-0.5">A</span>
                              <p className="text-stone-700 text-sm leading-relaxed">{item.a}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mistakes */}
                    {phase.mistakes && phase.mistakes.length > 0 && (
                      <div className="px-6 pb-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">Mistakes to Fix Next Time</p>
                        <div className="space-y-2">
                          {phase.mistakes.map((m, mi) => (
                            <div key={mi} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                              <span className="text-red-400 font-bold shrink-0 text-sm mt-0.5">✗</span>
                              <p className="text-red-800 text-sm">{m}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Mermaid Visual Diagram */}
        {caseStudy.mermaidDiagram && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Class Diagram</h2>
            <MermaidDiagram chart={caseStudy.mermaidDiagram} />
          </section>
        )}

        {/* Class Details */}
        {caseStudy.classes && caseStudy.classes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Class Details</h2>
            <div className="space-y-4">
              {caseStudy.classes.map((cls, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-stone-50 border-b border-stone-100">
                    <h3 className="font-mono font-bold text-stone-800 text-sm">{cls.name}</h3>
                  </div>
                  <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cls.fields.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Fields</p>
                        <ul className="space-y-1">
                          {cls.fields.map((f, fi) => (
                            <li key={fi} className="font-mono text-sm text-blue-700 bg-blue-50 rounded px-2 py-1">{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cls.methods.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Methods</p>
                        <ul className="space-y-1">
                          {cls.methods.map((m, mi) => (
                            <li key={mi} className="font-mono text-sm text-green-700 bg-green-50 rounded px-2 py-1">{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Relationships */}
        {caseStudy.relationships && caseStudy.relationships.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Relationships</h2>
            <div className="space-y-3">
              {caseStudy.relationships.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-stone-200 rounded-xl px-5 py-3">
                  <span className="text-green-500 font-bold shrink-0 mt-0.5">→</span>
                  <p className="text-stone-700 text-sm font-mono">{r}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Full Implementation Code */}
        {caseStudy.fullCode && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">Full Implementation (87%)</h2>
            <div className="bg-stone-900 rounded-2xl overflow-x-auto">
              <pre className="text-sm text-stone-200 p-6 leading-relaxed whitespace-pre font-mono">{caseStudy.fullCode}</pre>
            </div>
          </section>
        )}

        {/* Client / Wiring Code */}
        {caseStudy.clientCode && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Client Code — Wiring &amp; Usage</h2>
            <p className="text-stone-500 text-sm mb-4">How to wire all classes together and exercise every flow.</p>
            <div className="bg-stone-900 rounded-2xl overflow-x-auto">
              <pre className="text-sm text-stone-200 p-6 leading-relaxed whitespace-pre font-mono">{caseStudy.clientCode}</pre>
            </div>
          </section>
        )}

      </div>

      <Footer />
    </div>
  )
}

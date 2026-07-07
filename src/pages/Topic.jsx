import { useParams, Link } from 'react-router-dom'
import { topics } from '../data/topics'
import { topicContent } from '../data/topicContent'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const difficultyColors = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}

export default function Topic() {
  const { slug } = useParams()
  const topic = topics.find(t => t.slug === slug)
  const content = topicContent[slug]

  if (!topic) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-stone-800">Topic not found</h1>
      <Link to="/dehaaticoder/roadmap" className="mt-4 text-green-600 hover:underline">← Back to Roadmap</Link>
    </div>
  )

  if (!content) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <span className="text-5xl mb-4">{topic.icon}</span>
      <h1 className="text-3xl font-bold text-stone-800 mb-3">{topic.title}</h1>
      <p className="text-stone-500 text-lg mb-6">This topic is coming soon. Content is being prepared.</p>
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-6 py-4 max-w-md text-amber-700 italic text-sm mb-8">
        🌾 "{topic.gaonKiBaat}"
      </div>
      <Link to="/dehaaticoder/roadmap" className="text-green-600 hover:underline font-medium">← Back to Roadmap</Link>
    </div>
  )

  return (
    <div className="min-h-screen">

      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="text-sm text-stone-400">
          <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
          <span className="mx-2">›</span>
          <span className="text-stone-700 font-medium">{topic.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{topic.icon}</span>
          <div>
            <h1 className="text-4xl font-bold text-stone-900">{topic.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-stone-400">
              <span>⏱ {topic.estimatedTime}</span>
              <span>📝 {topic.problemCount} problems</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{topic.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Gaon Ki Baat */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-2">🌾 Gaon Ki Baat</p>
          <p className="text-amber-900 text-lg italic leading-relaxed">"{topic.gaonKiBaat}"</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-14">

        {/* What is it */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">What is {topic.title}?</h2>
          <p className="text-stone-600 text-lg leading-relaxed">{content.intro}</p>
        </section>

        {/* Why it works */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">Why does it work?</h2>
          <p className="text-stone-600 text-lg leading-relaxed">{content.whyItWorks}</p>
        </section>

        {/* Teaching flow */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Learning Path</h2>
          <div className="flex flex-col gap-3">
            {content.teachingFlow.map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white border border-stone-200 rounded-xl px-5 py-4">
                <span className="bg-green-100 text-green-700 font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <span className="font-semibold text-stone-800">{item.step}</span>
                  <span className="text-stone-500 text-sm ml-2">— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key insight */}
        <section className="bg-green-50 border border-green-200 rounded-xl px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">💡 Key Insight</p>
          <p className="text-green-900 text-xl font-semibold">{content.keyInsight}</p>
        </section>

        {/* Shared vs Own Copy — the WHY behind unpick */}
        {content.sharedVsOwnCopy && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">{content.sharedVsOwnCopy.title}</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5">
              {content.sharedVsOwnCopy.explanation.split('\n\n').map((para, i) => (
                <p key={i} className={`leading-relaxed mb-4 last:mb-0 ${
                  para.startsWith('SHARED') || para.startsWith('OWN') || para.startsWith('SIMPLE')
                    ? 'font-semibold text-stone-800 text-base'
                    : 'text-stone-700 text-sm'
                }`}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* 4 Patterns */}
        {content.patterns && (
          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">The 4 Backtracking Patterns</h2>
            <p className="text-stone-500 mb-6">Pick the right pattern based on your problem shape.</p>
            <div className="space-y-8">
              {content.patterns.map((pattern, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-stone-800 text-lg">{pattern.name}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pattern.unpick ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {pattern.unpick ? '⚠ Unpick required' : '✓ No unpick needed'}
                    </span>
                  </div>

                  {/* When to use */}
                  <div className="px-6 py-3 border-b border-stone-100 bg-stone-50">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">When to use: </span>
                    <span className="text-stone-700 text-sm">{pattern.when}</span>
                  </div>

                  {/* Why this pattern */}
                  <div className="px-6 py-4 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">Why this pattern?</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{pattern.whyThisPattern}</p>
                  </div>

                  {/* Why unpick / why not */}
                  <div className={`px-6 py-4 border-b border-stone-100 ${pattern.unpick ? 'bg-red-50' : 'bg-green-50'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${pattern.unpick ? 'text-red-500' : 'text-green-600'}`}>
                      {pattern.unpick ? 'Why must we unpick?' : 'Why no unpick?'}
                    </p>
                    <p className={`text-sm leading-relaxed ${pattern.unpick ? 'text-red-800' : 'text-green-800'}`}>{pattern.whyUnpick}</p>
                  </div>

                  {/* Examples */}
                  <div className="px-6 py-3 border-b border-stone-100">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Problems: </span>
                    <span className="text-stone-600 text-sm">{pattern.examples}</span>
                  </div>

                  {/* Code */}
                  <pre className="bg-stone-900 text-green-300 px-6 py-5 text-sm leading-relaxed overflow-x-auto font-mono">
                    {pattern.code}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Animations */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Visual Animations</h2>
          <p className="text-stone-500 mb-6">See the algorithm in action before reading code.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.animations.map(anim => (
              <a
                key={anim.file}
                href={`/dehaaticoder/animations/${anim.file}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-stone-200 hover:border-green-400 hover:shadow-sm rounded-xl p-5 transition text-center group"
              >
                <div className="text-3xl mb-3">🎥</div>
                <p className="font-semibold text-stone-700 group-hover:text-green-600 text-sm">{anim.title}</p>
                <p className="text-xs text-stone-400 mt-1">Click to open →</p>
              </a>
            ))}
          </div>
        </section>

        {/* Common mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Common Mistakes</h2>
          <div className="space-y-3">
            {content.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <p className="text-stone-700 text-sm">{m}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Problems */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Practice Problems</h2>
          <p className="text-stone-500 mb-6">Solve in this order — each one builds on the previous.</p>
          <div className="space-y-3">
            {content.problems.map((p, i) => (
              <Link
                key={p.slug}
                to={`/dehaaticoder/problem/${p.slug}`}
                className="flex items-center justify-between bg-white border border-stone-200 hover:border-green-400 hover:shadow-sm rounded-xl px-5 py-4 transition group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-stone-300 font-mono text-sm w-6">{i + 1}.</span>
                  <span className="font-semibold text-stone-700 group-hover:text-green-600">{p.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>LC #{p.lcNum}</span>
                  <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
}

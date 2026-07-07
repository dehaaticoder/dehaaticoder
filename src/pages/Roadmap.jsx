import { Link } from 'react-router-dom'
import { topics, difficultyOrder } from '../data/topics'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const difficultyColors = {
  Beginner:     { badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  Intermediate: { badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
  Advanced:     { badge: 'bg-red-100 text-red-700',      dot: 'bg-red-500'   },
}

export default function Roadmap() {
  const grouped = difficultyOrder.map(level => ({
    level,
    items: topics.filter(t => t.difficulty === level),
  }))

  return (
    <div className="min-h-screen">

      <Navbar />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">DSA Learning Roadmap</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Follow this path from the basics to advanced. Each topic builds on the previous one.
          Go in order — don't skip.
        </p>
      </div>

      {/* Legend */}
      <div className="max-w-5xl mx-auto px-6 mb-10 flex items-center gap-6 justify-center text-sm text-stone-500">
        {difficultyOrder.map(level => (
          <div key={level} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${difficultyColors[level].dot}`}></span>
            <span>{level}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span className="text-green-600 font-medium">Available now</span>
        </div>
      </div>

      {/* Topics by difficulty */}
      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        {grouped.map(({ level, items }) => (
          <div key={level}>
            <div className="flex items-center gap-3 mb-6">
              <span className={`w-3 h-3 rounded-full ${difficultyColors[level].dot}`}></span>
              <h2 className="text-xl font-bold text-stone-800">{level}</h2>
              <span className="text-stone-400 text-sm">{items.length} topics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((topic, idx) => {
                const isAvailable = topic.status === 'available'
                const card = (
                  <div className={`bg-white border rounded-xl p-5 transition group
                    ${isAvailable
                      ? 'border-green-200 hover:border-green-400 hover:shadow-sm cursor-pointer'
                      : 'border-stone-200 opacity-70 cursor-default'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <h3 className="font-semibold text-stone-800 text-base">{topic.title}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[topic.difficulty].badge}`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>
                      {isAvailable
                        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Available</span>
                        : <span className="text-xs bg-stone-100 text-stone-400 px-2 py-1 rounded-full">Coming soon</span>}
                    </div>
                    <p className="text-stone-500 text-sm mb-3 leading-relaxed">{topic.description}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-400">
                      <span>⏱ {topic.estimatedTime}</span>
                      <span>📝 {topic.problemCount} problems</span>
                    </div>
                    {/* Gaon Ki Baat preview */}
                    <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-amber-700 italic">
                      🌾 "{topic.gaonKiBaat.slice(0, 80)}..."
                    </div>
                  </div>
                )

                return isAvailable
                  ? <Link key={topic.slug} to={`/dehaaticoder/topic/${topic.slug}`}>{card}</Link>
                  : <div key={topic.slug}>{card}</div>
              })}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

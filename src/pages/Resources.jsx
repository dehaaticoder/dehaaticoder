import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { resources, tagColors, categoryColors } from '../data/resources'

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-green-200">
            🔖 Curated Resources
          </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-3">Important Links</h1>
          <p className="text-stone-500 text-lg">
            Hand-picked references for LLD, DSA, Java, and interview prep — all in one place.
          </p>
        </div>

        {/* Resource sections */}
        <div className="space-y-12">
          {resources.map((section) => {
            const colors = categoryColors[section.color] || categoryColors.green
            return (
              <div key={section.category}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <h2 className={`text-lg font-bold ${colors.text}`}>{section.category}</h2>
                  <div className={`h-px flex-1 ${colors.border} border-t`} />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.links.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block border rounded-xl p-5 hover:shadow-md transition group ${colors.border} ${colors.bg}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-stone-800 group-hover:text-green-600 transition text-base leading-snug">
                          {link.title}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${tagColors[link.tag] || 'bg-stone-100 text-stone-600'}`}>
                          {link.tag}
                        </span>
                      </div>
                      <p className="text-stone-500 text-sm leading-relaxed">{link.desc}</p>
                      <div className="mt-3 text-xs text-stone-400 group-hover:text-green-500 transition font-medium">
                        {link.url.replace(/^https?:\/\//, '').split('/')[0]} →
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 text-center text-sm text-stone-500">
          💡 <span className="font-medium text-stone-700">More links added as we learn.</span> Bookmark this page for quick access during revision.
        </div>
      </div>

      <Footer />
    </div>
  )
}

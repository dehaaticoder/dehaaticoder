import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { formulaData } from '../data/formulas'

export default function Formulas() {
  const [active, setActive] = useState(0)
  const topic = formulaData[active]

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-8 text-sm text-stone-400">
        <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-700 font-medium">Formulas</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Formula Sheet</h1>
          <p className="text-stone-500">Quick reference for math, bit tricks, and counting — before every contest or interview.</p>
        </div>

        {/* Topic Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {formulaData.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${
                active === i
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.topic}</span>
            </button>
          ))}
        </div>

        {/* Formula Table */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
            <span className="text-2xl">{topic.icon}</span>
            <h2 className="text-lg font-bold text-stone-800">{topic.topic}</h2>
            <span className="text-xs text-stone-400 ml-auto">{topic.formulas.length} formulas</span>
          </div>
          <div className="divide-y divide-stone-100">
            {topic.formulas.map((f, i) => (
              <div key={i} className="px-6 py-4 hover:bg-stone-50 transition">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 text-sm mb-1">{f.name}</p>
                    {f.note && <p className="text-xs text-stone-400 italic mt-1">{f.note}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <code className="bg-stone-100 text-green-700 font-mono text-sm px-3 py-1 rounded-lg font-semibold">{f.formula}</code>
                    {f.example && <span className="text-xs text-stone-400 italic">{f.example}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}

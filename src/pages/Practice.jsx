import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { practiceLog } from '../data/practice'

const INTERVALS = [3, 7, 14, 30] // days after each revision

function getNextRevisionDate(entry) {
  const count = entry.revisions.length
  if (count >= INTERVALS.length) return null // mastered
  const base = count === 0 ? entry.solvedOn : entry.revisions[count - 1]
  const d = new Date(base)
  d.setDate(d.getDate() + INTERVALS[count])
  return d.toISOString().slice(0, 10)
}

function getStatus(entry) {
  const count = entry.revisions.length
  if (count >= INTERVALS.length) return 'mastered'
  const next = getNextRevisionDate(entry)
  const today = new Date().toISOString().slice(0, 10)
  if (next <= today) return 'due'
  return 'upcoming'
}

function getRevisionLabel(entry) {
  const count = entry.revisions.length
  if (count >= INTERVALS.length) return 'Mastered'
  return `R${count + 1} Due`
}

const difficultyColors = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-600',
}

export default function Practice() {
  const today = new Date().toISOString().slice(0, 10)

  const due      = practiceLog.filter(e => getStatus(e) === 'due')
  const upcoming = practiceLog.filter(e => getStatus(e) === 'upcoming')
  const mastered = practiceLog.filter(e => getStatus(e) === 'mastered')

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-8 text-sm text-stone-400">
        <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-700 font-medium">Practice Tracker</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6 pb-24">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Practice Tracker</h1>
          <p className="text-stone-500 mb-5">Spaced repetition — solve once, revise 4 times, own it forever.</p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-stone-800">{practiceLog.length}</p>
              <p className="text-xs text-stone-400 mt-0.5">Total Solved</p>
            </div>
            <div className={`border rounded-xl px-5 py-3 text-center ${due.length > 0 ? 'bg-red-50 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
              <p className={`text-2xl font-bold ${due.length > 0 ? 'text-red-600' : 'text-stone-800'}`}>{due.length}</p>
              <p className="text-xs text-stone-400 mt-0.5">Due Today</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-stone-800">{upcoming.length}</p>
              <p className="text-xs text-stone-400 mt-0.5">Upcoming</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-green-700">{mastered.length}</p>
              <p className="text-xs text-stone-400 mt-0.5">Mastered</p>
            </div>
          </div>
        </div>

        {/* Revision Schedule Guide */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-2">Revision Schedule</p>
          <div className="flex gap-6 flex-wrap text-sm text-stone-600">
            <span>R1 → <strong>+3 days</strong></span>
            <span>R2 → <strong>+7 days</strong></span>
            <span>R3 → <strong>+14 days</strong></span>
            <span>R4 → <strong>+30 days</strong></span>
            <span>✓ → <strong className="text-green-700">Mastered</strong></span>
          </div>
        </div>

        {/* Due Today */}
        {due.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-red-600 mb-3">🔴 Revise Today ({due.length})</h2>
            <div className="space-y-2">
              {due.map(e => (
                <div key={e.id} className="bg-white border border-red-200 rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {e.lcUrl ? (
                        <a href={e.lcUrl} target="_blank" rel="noreferrer" className="font-semibold text-stone-800 hover:text-green-600 transition">{e.title}</a>
                      ) : (
                        <span className="font-semibold text-stone-800">{e.title}</span>
                      )}
                      {e.lcNum && <span className="text-xs text-stone-400">LC #{e.lcNum}</span>}
                    </div>
                    {e.note && <p className="text-xs text-stone-400 italic mt-0.5">{e.note}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[e.difficulty]}`}>{e.difficulty}</span>
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{e.pattern}</span>
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{getRevisionLabel(e)}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-3 italic">To mark as revised: add today's date "{today}" to the <code>revisions</code> array in <code>src/data/practice.js</code></p>
          </div>
        )}

        {due.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-5 mb-8 text-center">
            <p className="text-green-700 font-semibold">Nothing due today</p>
            <p className="text-sm text-stone-400 mt-1">Solve 2 new problems and add them to practice.js</p>
          </div>
        )}

        {/* All Problems */}
        <div>
          <h2 className="text-lg font-bold text-stone-800 mb-3">All Problems</h2>
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Problem</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Pattern</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Solved</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Next Revision</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {practiceLog.map(e => {
                  const status = getStatus(e)
                  const next = getNextRevisionDate(e)
                  const count = e.revisions.length
                  return (
                    <tr key={e.id} className="hover:bg-stone-50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {e.lcUrl ? (
                            <a href={e.lcUrl} target="_blank" rel="noreferrer" className="font-medium text-green-600 hover:underline transition flex items-center gap-1">
                              {e.title}
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                          ) : (
                            <span className="font-medium text-stone-800">{e.title}</span>
                          )}
                          {e.lcNum && <span className="text-xs text-stone-400">#{e.lcNum}</span>}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColors[e.difficulty]}`}>{e.difficulty}</span>
                        </div>
                        {e.note && <p className="text-xs text-stone-400 italic mt-1">{e.note}</p>}
                      </td>
                      <td className="px-4 py-3 text-stone-500">{e.pattern}</td>
                      <td className="px-4 py-3 text-stone-400">{e.solvedOn}</td>
                      <td className="px-4 py-3">
                        {status === 'mastered' ? (
                          <span className="text-green-600 font-semibold">✓ Mastered</span>
                        ) : (
                          <span className={status === 'due' ? 'text-red-600 font-semibold' : 'text-stone-500'}>{next}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {INTERVALS.map((_, i) => (
                            <div
                              key={i}
                              className={`w-5 h-2 rounded-full ${i < count ? 'bg-green-500' : 'bg-stone-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-stone-400 mt-1">{count}/{INTERVALS.length} revisions</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}

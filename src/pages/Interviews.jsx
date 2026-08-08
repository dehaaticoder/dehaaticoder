import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { interviewData } from '../data/interviews'

const typeColors = {
  coding:        'bg-blue-100 text-blue-700',
  lld:           'bg-purple-100 text-purple-700',
  'system-design': 'bg-amber-100 text-amber-700',
  screening:     'bg-stone-100 text-stone-500',
  behavioral:    'bg-green-100 text-green-700',
}

const typeLabel = {
  coding:          'Coding',
  lld:             'LLD',
  'system-design': 'System Design',
  screening:       'Screening',
  behavioral:      'Behavioral',
}

const topicColors = {
  'DSA':          'bg-blue-50 text-blue-700 border-blue-200',
  'LLD':          'bg-purple-50 text-purple-700 border-purple-200',
  'HLD':          'bg-amber-50 text-amber-700 border-amber-200',
  'SQL':          'bg-green-50 text-green-700 border-green-200',
  'Stack':        'bg-blue-50 text-blue-700 border-blue-200',
  'Database':     'bg-green-50 text-green-700 border-green-200',
  'Architecture': 'bg-orange-50 text-orange-700 border-orange-200',
  'Behavioral':   'bg-stone-50 text-stone-600 border-stone-200',
  'Arrays / HashMap': 'bg-blue-50 text-blue-700 border-blue-200',
  'Linked List':  'bg-blue-50 text-blue-700 border-blue-200',
  'Binary Search': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Security':       'bg-red-50 text-red-700 border-red-200',
  'Backend':        'bg-teal-50 text-teal-700 border-teal-200',
  'Sliding Window': 'bg-blue-50 text-blue-700 border-blue-200',
  'Math':           'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Graph':          'bg-violet-50 text-violet-700 border-violet-200',
  'Arrays':         'bg-blue-50 text-blue-700 border-blue-200',
  'HashMap':        'bg-cyan-50 text-cyan-700 border-cyan-200',
  'BFS':            'bg-violet-50 text-violet-700 border-violet-200',
  'Heap':           'bg-orange-50 text-orange-700 border-orange-200',
}

export default function Interviews() {
  const totalRounds    = interviewData.reduce((s, c) => s + c.rounds.length, 0)
  const totalQuestions = interviewData.reduce((s, c) => s + c.rounds.reduce((r, rd) => r + rd.questions.length, 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-8 text-sm text-stone-400">
        <Link to="/dehaaticoder/roadmap" className="hover:text-green-600">Roadmap</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-700 font-medium">Interview Journal</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Interview Journal</h1>
          <p className="text-stone-500 mb-5">Every question asked across all interviews — one place to review before any round.</p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-stone-800">{interviewData.length}</p>
              <p className="text-xs text-stone-400 mt-0.5">Companies</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-stone-800">{totalRounds}</p>
              <p className="text-xs text-stone-400 mt-0.5">Rounds Given</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-stone-800">{totalQuestions}</p>
              <p className="text-xs text-stone-400 mt-0.5">Questions Seen</p>
            </div>
          </div>
        </div>

        {/* Company Cards */}
        <div className="space-y-6">
          {interviewData.map((company, ci) => (
            <div key={ci} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">

              {/* Company Header */}
              <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-4">
                <span className="text-3xl">{company.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-stone-800">{company.company}</h2>
                  <p className="text-stone-400 text-sm">{company.domain}</p>
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs text-stone-400">
                  <span>{company.rounds.length} round{company.rounds.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Rounds */}
              <div className="divide-y divide-stone-100">
                {company.rounds.map((round, ri) => (
                  <div key={ri} className="px-6 py-4">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="font-semibold text-stone-700 text-sm">{round.round}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[round.type] || 'bg-stone-100 text-stone-500'}`}>
                        {typeLabel[round.type] || round.type}
                      </span>
                      {round.result === 'cleared' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓ Cleared</span>
                      )}
                      {round.result === 'rejected' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">✗ Rejected</span>
                      )}
                      {round.date && <span className="text-xs text-stone-400">{round.date}</span>}
                    </div>
                    <div className="space-y-2 pl-2">
                      {round.questions.map((q, qi) => (
                        <div key={qi} className="flex items-start gap-3 flex-wrap">
                          <span className="text-stone-300 text-xs mt-1 shrink-0">•</span>
                          <div className="flex-1">
                            <span className="text-stone-700 text-sm">{q.title}</span>
                            {q.note && (
                              <p className="text-xs text-stone-400 italic mt-0.5">{q.note}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${topicColors[q.topic] || 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                            {q.topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  )
}

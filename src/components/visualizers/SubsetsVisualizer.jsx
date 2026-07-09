import { useState } from 'react'
import { buildSVG, n } from './treeUtils'

// nums = [1, 2, 3]  →  2³ = 8 subsets
// At each index: pick A[idx] (left, green) OR skip A[idx] (right, grey dashed)
const tree = n('i=0, curr=[]', 'decide on A[0]=1', 'normal', '', '', [
  n('i=1, curr=[1]', 'decide on A[1]=2', 'normal', 'pick 1', 'pick', [
    n('i=2, curr=[1,2]', 'decide on A[2]=3', 'normal', 'pick 2', 'pick', [
      n('[1,2,3] ✅', 'i=3 LEAF', 'leaf', 'pick 3', 'pick', []),
      n('[1,2] ✅',   'i=3 LEAF', 'leaf', 'skip 3', 'skip', []),
    ]),
    n('i=2, curr=[1]', 'decide on A[2]=3', 'normal', 'skip 2', 'skip', [
      n('[1,3] ✅', 'i=3 LEAF', 'leaf', 'pick 3', 'pick', []),
      n('[1] ✅',   'i=3 LEAF', 'leaf', 'skip 3', 'skip', []),
    ]),
  ]),
  n('i=1, curr=[]', 'decide on A[1]=2', 'normal', 'skip 1', 'skip', [
    n('i=2, curr=[2]', 'decide on A[2]=3', 'normal', 'pick 2', 'pick', [
      n('[2,3] ✅', 'i=3 LEAF', 'leaf', 'pick 3', 'pick', []),
      n('[2] ✅',   'i=3 LEAF', 'leaf', 'skip 3', 'skip', []),
    ]),
    n('i=2, curr=[]', 'decide on A[2]=3', 'normal', 'skip 2', 'skip', [
      n('[3] ✅', 'i=3 LEAF', 'leaf', 'pick 3', 'pick', []),
      n('[] ✅',  'i=3 LEAF', 'leaf', 'skip 3', 'skip', []),
    ]),
  ]),
])

const LEGEND = [
  { bg: 'bg-green-100',  border: 'border-green-400',  label: 'Collected at leaf ✅' },
  { bg: 'bg-stone-100',  border: 'border-stone-300',  label: 'Exploring' },
]

export default function SubsetsVisualizer({ fullscreen = false }) {
  const { svg, width, height } = buildSVG(tree)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs text-stone-500">
        {LEGEND.map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${bg} border ${border}`} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#4caf50" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#4caf50" /></svg>
          <span>pick (left child)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,2" /><polygon points="16,3 22,6 16,9" fill="#aaa" /></svg>
          <span>skip (right child)</span>
        </div>
      </div>

      <div className={`border border-stone-200 rounded-xl bg-white ${fullscreen ? 'overflow-auto' : 'overflow-auto max-h-[520px]'}`}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={fullscreen ? '100%' : width}
          height={fullscreen ? undefined : height}
          style={fullscreen
            ? { minWidth: width, height: 'auto', userSelect: 'none', pointerEvents: 'none' }
            : { userSelect: 'none', pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      <div className="bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-xs font-medium text-green-900">
        ✅ All 8 subsets collected at leaves — 2³ = 8. Every path root→leaf is one unique subset: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
      </div>
    </div>
  )
}

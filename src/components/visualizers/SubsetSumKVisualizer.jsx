import { buildSVG, n } from './treeUtils'

// arr=[2,3,1], k=3  →  two solutions: {2,1} and {3}
// Include/Exclude with pruning:
//   sum == k → FOUND ✅
//   sum >  k → PRUNED ✗
//   idx == n → END (no match)
const tree = n('idx=0, sum=0', 'arr=[2,3,1] k=3', 'normal', '', '', [
  n('idx=1, sum=2', 'included arr[0]=2', 'normal', 'include 2', 'pick', [
    n('sum=5 > k ✗', 'PRUNED', 'pruned', 'include 3', 'pick', []),
    n('idx=2, sum=2', 'excluded arr[1]=3', 'normal', 'exclude 3', 'skip', [
      n('sum=3=k ✅', 'FOUND {2,1}', 'found', 'include 1', 'pick', []),
      n('idx=3, sum=2', 'no match', 'end', 'exclude 1', 'skip', []),
    ]),
  ]),
  n('idx=1, sum=0', 'excluded arr[0]=2', 'normal', 'exclude 2', 'skip', [
    n('sum=3=k ✅', 'FOUND {3}', 'found', 'include 3', 'pick', []),
    n('idx=2, sum=0', 'excluded arr[1]=3', 'normal', 'exclude 3', 'skip', [
      n('idx=3, sum=1', 'no match', 'end', 'include 1', 'pick', []),
      n('idx=3, sum=0', 'no match', 'end', 'exclude 1', 'skip', []),
    ]),
  ]),
])

const LEGEND = [
  { bg: 'bg-green-100', border: 'border-green-400', label: 'Found (sum=k) ✅' },
  { bg: 'bg-red-100',   border: 'border-red-400',   label: 'Pruned (sum>k) ✗' },
  { bg: 'bg-purple-100',border: 'border-purple-400', label: 'End (idx=n, miss)' },
  { bg: 'bg-stone-100', border: 'border-stone-300',  label: 'Exploring' },
]

export default function SubsetSumKVisualizer({ fullscreen = false }) {
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
          <span>include</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,2" /><polygon points="16,3 22,6 16,9" fill="#aaa" /></svg>
          <span>exclude</span>
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
        ✅ Two subsets sum to k=3: {"{2,1}"} and {"{3}"}. Pruning cuts branches early when sum&gt;k — saving unnecessary recursion. End nodes (sum≠k at idx=n) return false.
      </div>
    </div>
  )
}

import { buildSVG, n } from './treeUtils'

// candidates=[2,3], target=6  →  [2,2,2] and [3,3]
// For-loop from startIdx (same index reused = element can repeat)
// Green solid = include element   Red = pruned (sum > target)
const tree = n('idx=0, sum=0', 'candidates=[2,3] t=6', 'normal', '', '', [
  n('idx=0, sum=2', 'picked 2, reuse ok', 'normal', 'pick 2', 'pick', [
    n('idx=0, sum=4', 'picked 2 again', 'normal', 'pick 2', 'pick', [
      n('[2,2,2] ✅', 'sum=6=t LEAF', 'leaf',   'pick 2', 'pick', []),
      n('sum=7>t ✗', 'PRUNED', 'pruned', 'pick 3', 'skip', []),
    ]),
    n('idx=1, sum=5', 'picked 3', 'normal', 'pick 3', 'blue', [
      n('sum=8>t ✗', 'PRUNED', 'pruned', 'pick 3', 'blue', []),
    ]),
  ]),
  n('idx=1, sum=3', 'picked 3, idx moves', 'normal', 'pick 3', 'blue', [
    n('[3,3] ✅', 'sum=6=t LEAF', 'leaf',   'pick 3', 'blue', []),
  ]),
])

const LEGEND = [
  { bg: 'bg-green-100', border: 'border-green-400', label: 'Valid combination ✅' },
  { bg: 'bg-red-100',   border: 'border-red-400',   label: 'Pruned (sum>target) ✗' },
  { bg: 'bg-stone-100', border: 'border-stone-300', label: 'Exploring' },
]

export default function CombinationSumVisualizer({ fullscreen = false }) {
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
          <span>pick 2 (same idx — reuse)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#1565c0" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#1565c0" /></svg>
          <span>pick 3 (idx advances)</span>
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

      <div className="bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-xs font-medium text-green-900 space-y-1">
        <p>✅ 2 combinations: [2,2,2] and [3,3]. Key difference from Combination Sum II: recursive call passes <strong>same idx</strong> (reuse allowed), not idx+1.</p>
        <p>Pruning: if sum &gt; target at any point, stop that branch immediately — no need to go deeper.</p>
      </div>
    </div>
  )
}

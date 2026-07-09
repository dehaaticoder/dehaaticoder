import { buildSVG, n } from './treeUtils'

// n = 3  →  3 paths: [1,1,1], [1,2], [2,1]
// Two explicit calls: take 1 step OR take 2 steps
// Base: n == 0 → valid path ✅   n < 0 → pruned ✗
const tree = n('n=3, path=[]', 'Generate(3, [])', 'normal', '', '', [
  n('n=2, path=[1]', 'took 1 step', 'normal', 'take 1', 'pick', [
    n('n=1, path=[1,1]', 'took 1 step', 'normal', 'take 1', 'pick', [
      n('[1,1,1] ✅', 'n=0 REACHED', 'leaf',   'take 1', 'pick', []),
      n('n=-1 ✗',    'PRUNED n<0', 'pruned', 'take 2', 'skip', []),
    ]),
    n('[1,2] ✅', 'n=0 REACHED', 'leaf', 'take 2', 'skip', []),
  ]),
  n('n=1, path=[2]', 'took 2 steps', 'normal', 'take 2', 'skip', [
    n('[2,1] ✅', 'n=0 REACHED', 'leaf',   'take 1', 'pick', []),
    n('n=-1 ✗',  'PRUNED n<0', 'pruned', 'take 2', 'skip', []),
  ]),
])

const LEGEND = [
  { bg: 'bg-green-100', border: 'border-green-400', label: 'Valid path (n=0) ✅' },
  { bg: 'bg-red-100',   border: 'border-red-400',   label: 'Pruned (n<0) ✗' },
  { bg: 'bg-stone-100', border: 'border-stone-300', label: 'Exploring' },
]

export default function StaircasePathsVisualizer({ fullscreen = false }) {
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
          <span>take 1 step</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,2" /><polygon points="16,3 22,6 16,9" fill="#aaa" /></svg>
          <span>take 2 steps</span>
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
        ✅ 3 paths for n=3: [1,1,1], [1,2], [2,1] — same count as Fibonacci! Ways(n) = Ways(n-1) + Ways(n-2). Two branches per node, prune when n&lt;0.
      </div>
    </div>
  )
}

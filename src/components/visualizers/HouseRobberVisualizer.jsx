import { buildSVG, n } from './treeUtils'

// nums = [2, 7, 9, 3], GetMax(3)
// pick  → GetMax(1) = 7  [base: max(2,7)]
// notPick → GetMax(2)
//   pick  → GetMax(0) = 2  [base: nums[0]]
//   notPick → GetMax(1) = 7  ← OVERLAP! already solved above
const tree = n('GetMax(3)', 'max(pick,notPick) = 11', 'normal', '', '', [
  n('GetMax(1) = 7', 'base: max(2,7)', 'leaf', 'pick [3]=3', 'pick', []),
  n('GetMax(2)', 'max(pick,notPick) = 11', 'normal', 'notPick', 'skip', [
    n('GetMax(0) = 2', 'base: nums[0]', 'leaf', 'pick [2]=9', 'pick', []),
    n('GetMax(1) = 7 ⚠', 'DUP — solved above!', 'dup', 'notPick', 'skip', []),
  ]),
])

const LEGEND = [
  { bg: 'bg-stone-100',  border: 'border-stone-300',  label: 'Exploring' },
  { bg: 'bg-green-100',  border: 'border-green-400',  label: 'Base case ✓' },
  { bg: 'bg-orange-100', border: 'border-orange-400', label: 'Overlap ⚠ recomputed!' },
]

export default function HouseRobberVisualizer({ fullscreen = false }) {
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
          <span>pick (solid)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,2" /><polygon points="16,3 22,6 16,9" fill="#aaa" /></svg>
          <span>notPick (dashed)</span>
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

      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-xs font-medium text-orange-900">
        ⚠ GetMax(1) is computed twice — directly from GetMax(3) via pick, and again from GetMax(2) via notPick. Memoization stores it the first time and returns instantly the second time.
      </div>
    </div>
  )
}

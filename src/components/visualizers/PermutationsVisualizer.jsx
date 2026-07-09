import { buildSVG, n } from './treeUtils'

// nums = [1, 2, 3]  →  3! = 6 permutations
// For loop + visited[] approach: at each level try every unvisited index
// Color-coded by which element is being placed:
//   place 1 (idx=0) → green   place 2 (idx=1) → blue   place 3 (idx=2) → amber
const tree = n('curr=[], vis=FFF', 'for i=0..2, pick unvisited', 'normal', '', '', [
  n('curr=[1], vis=TFF', 'placed nums[0]=1', 'normal', 'place 1', 'pick', [
    n('curr=[1,2], vis=TTF', 'placed nums[1]=2', 'normal', 'place 2', 'blue', [
      n('[1,2,3] ✅', 'vis=TTT LEAF', 'leaf', 'place 3', 'amber', []),
    ]),
    n('curr=[1,3], vis=TFT', 'placed nums[2]=3', 'normal', 'place 3', 'amber', [
      n('[1,3,2] ✅', 'vis=TTT LEAF', 'leaf', 'place 2', 'blue', []),
    ]),
  ]),
  n('curr=[2], vis=FTF', 'placed nums[1]=2', 'normal', 'place 2', 'blue', [
    n('curr=[2,1], vis=TTF', 'placed nums[0]=1', 'normal', 'place 1', 'pick', [
      n('[2,1,3] ✅', 'vis=TTT LEAF', 'leaf', 'place 3', 'amber', []),
    ]),
    n('curr=[2,3], vis=FTT', 'placed nums[2]=3', 'normal', 'place 3', 'amber', [
      n('[2,3,1] ✅', 'vis=TTT LEAF', 'leaf', 'place 1', 'pick', []),
    ]),
  ]),
  n('curr=[3], vis=FFT', 'placed nums[2]=3', 'normal', 'place 3', 'amber', [
    n('curr=[3,1], vis=TFT', 'placed nums[0]=1', 'normal', 'place 1', 'pick', [
      n('[3,1,2] ✅', 'vis=TTT LEAF', 'leaf', 'place 2', 'blue', []),
    ]),
    n('curr=[3,2], vis=FTT', 'placed nums[1]=2', 'normal', 'place 2', 'blue', [
      n('[3,2,1] ✅', 'vis=TTT LEAF', 'leaf', 'place 1', 'pick', []),
    ]),
  ]),
])

const LEGEND = [
  { bg: 'bg-green-100', border: 'border-green-400', label: 'All permutations ✅' },
  { bg: 'bg-stone-100', border: 'border-stone-300', label: 'Exploring' },
]

export default function PermutationsVisualizer({ fullscreen = false }) {
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
          <span>place 1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#1565c0" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#1565c0" /></svg>
          <span>place 2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#f57f17" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#f57f17" /></svg>
          <span>place 3</span>
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
        ✅ 6 permutations of [1,2,3] — 3! = 6. At each level the for loop tries all 3 indices but skips visited ones. visited[] marks what's already in curr; backtrack restores it.
      </div>
    </div>
  )
}

import { buildSVG, n } from './treeUtils'

// Grammar expansion tree: n=1 → n=4
// Rule: 0 expands to [0, 1]   (0 writes its copy then its complement)
//       1 expands to [1, 0]   (1 writes its copy then its complement)
// Left child = same value  (blue solid edge)
// Right child = flipped value (amber dashed edge)
//
// Row 1:  0
// Row 2:  0  1
// Row 3:  0  1  1  0
// Row 4:  0  1  1  0  1  0  0  1

const tree = n('0', 'n=1, pos=1', 'zero', '', '', [
  n('0', 'n=2, pos=1', 'zero', 'same', 'blue', [
    n('0', 'n=3, pos=1', 'zero', 'same', 'blue', [
      n('0', 'n=4, pos=1', 'zero', 'same',  'blue',  []),
      n('1', 'n=4, pos=2', 'one',  'flip',  'amber', []),
    ]),
    n('1', 'n=3, pos=2', 'one', 'flip', 'amber', [
      n('1', 'n=4, pos=3', 'one',  'same', 'blue',  []),
      n('0', 'n=4, pos=4', 'zero', 'flip', 'amber', []),
    ]),
  ]),
  n('1', 'n=2, pos=2', 'one', 'flip', 'amber', [
    n('1', 'n=3, pos=3', 'one', 'same', 'blue', [
      n('1', 'n=4, pos=5', 'one',  'same', 'blue',  []),
      n('0', 'n=4, pos=6', 'zero', 'flip', 'amber', []),
    ]),
    n('0', 'n=3, pos=4', 'zero', 'flip', 'amber', [
      n('0', 'n=4, pos=7', 'zero', 'same', 'blue',  []),
      n('1', 'n=4, pos=8', 'one',  'flip', 'amber', []),
    ]),
  ]),
])

const LEGEND = [
  { bg: 'bg-blue-100',   border: 'border-blue-500',   label: 'Symbol 0' },
  { bg: 'bg-amber-100',  border: 'border-amber-500',  label: 'Symbol 1' },
]

export default function KthSymbolVisualizer({ fullscreen = false }) {
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
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#1565c0" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#1565c0" /></svg>
          <span>same (left child)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#f57f17" strokeWidth="1.5" strokeDasharray="4,2" /><polygon points="16,3 22,6 16,9" fill="#f57f17" /></svg>
          <span>flip (right child)</span>
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs font-medium text-blue-900 space-y-1">
        <p><strong>Rule:</strong> 0 → [0, 1] &nbsp;|&nbsp; 1 → [1, 0] (left = copy, right = flip)</p>
        <p><strong>Row 4:</strong> 0 1 1 0 1 0 0 1 &nbsp;—&nbsp; to find KthSymbol(n, k): recurse to parent at ceil(k/2). If k is odd → same as parent. If k is even → flip parent.</p>
      </div>
    </div>
  )
}

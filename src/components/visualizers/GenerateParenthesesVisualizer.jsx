import { buildSVG, n } from './treeUtils'

// n=2  →  2 valid combinations: "(())" and "()()"
// At each step:
//   add '(' if open < n
//   add ')' if close < open
// Green solid = add '('   Blue solid = add ')'
const tree = n('o=0, c=0', 'str="" (n=2)', 'normal', '', '', [
  n('"("', 'o=1, c=0', 'normal', "add '('", 'pick', [
    n('"(("', 'o=2, c=0', 'normal', "add '('", 'pick', [
      n('"(()"', 'o=2, c=1', 'normal', "add ')'", 'blue', [
        n('"(())" ✅', 'LEAF — done!', 'leaf', "add ')'", 'blue', []),
      ]),
    ]),
    n('"()"', 'o=1, c=1', 'normal', "add ')'", 'blue', [
      n('"()("', 'o=2, c=1', 'normal', "add '('", 'pick', [
        n('"()()" ✅', 'LEAF — done!', 'leaf', "add ')'", 'blue', []),
      ]),
    ]),
  ]),
])

const LEGEND = [
  { bg: 'bg-green-100',  border: 'border-green-400',  label: 'Valid combination ✅' },
  { bg: 'bg-stone-100',  border: 'border-stone-300',  label: 'Exploring' },
]

export default function GenerateParenthesesVisualizer({ fullscreen = false }) {
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
          <span>add '(' (open &lt; n)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#1565c0" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#1565c0" /></svg>
          <span>add ')' (close &lt; open)</span>
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
        ✅ 2 valid combinations for n=2: "(())" and "()()". Key rule: add '(' if open &lt; n, add ')' if close &lt; open — this guarantees we never close before opening.
      </div>
    </div>
  )
}

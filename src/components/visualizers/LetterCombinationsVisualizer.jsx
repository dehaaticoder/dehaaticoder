import { buildSVG, n } from './treeUtils'

// digits="23"  2→[a,b,c]  3→[d,e,f]  →  9 combinations
// For-loop over each letter of current digit, then recurse to next digit
// Color-codes by letter: a/d=green  b/e=blue  c/f=amber
const tree = n('idx=0, str=""', 'digits="23"', 'normal', '', '', [
  n('idx=1, str="a"', 'chose a from 2', 'normal', 'a', 'pick', [
    n('"ad" ✅', 'LEAF', 'leaf', 'd', 'pick',  []),
    n('"ae" ✅', 'LEAF', 'leaf', 'e', 'blue',  []),
    n('"af" ✅', 'LEAF', 'leaf', 'f', 'amber', []),
  ]),
  n('idx=1, str="b"', 'chose b from 2', 'normal', 'b', 'blue', [
    n('"bd" ✅', 'LEAF', 'leaf', 'd', 'pick',  []),
    n('"be" ✅', 'LEAF', 'leaf', 'e', 'blue',  []),
    n('"bf" ✅', 'LEAF', 'leaf', 'f', 'amber', []),
  ]),
  n('idx=1, str="c"', 'chose c from 2', 'normal', 'c', 'amber', [
    n('"cd" ✅', 'LEAF', 'leaf', 'd', 'pick',  []),
    n('"ce" ✅', 'LEAF', 'leaf', 'e', 'blue',  []),
    n('"cf" ✅', 'LEAF', 'leaf', 'f', 'amber', []),
  ]),
])

const PHONE = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' }

const LEGEND = [
  { bg: 'bg-green-100', border: 'border-green-400', label: 'All 9 combinations ✅' },
  { bg: 'bg-stone-100', border: 'border-stone-300', label: 'Exploring' },
]

export default function LetterCombinationsVisualizer({ fullscreen = false }) {
  const { svg, width, height } = buildSVG(tree)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
          {Object.entries(PHONE).map(([d, l]) => (
            <span key={d} className="text-stone-600"><span className="font-bold">{d}</span>:{l}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-stone-500">
        {LEGEND.map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${bg} border ${border}`} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#4caf50" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#4caf50" /></svg>
          <span>first letter (a/d)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#1565c0" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#1565c0" /></svg>
          <span>second letter (b/e)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="18" y2="6" stroke="#f57f17" strokeWidth="1.5" /><polygon points="16,3 22,6 16,9" fill="#f57f17" /></svg>
          <span>third letter (c/f)</span>
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
        ✅ 9 combinations for "23" — 3×3 = 9. For n digits with avg k letters each: O(k^n) leaves. Each level = one digit, each branch = one letter choice. Pattern: for-loop, not pick/not-pick.
      </div>
    </div>
  )
}

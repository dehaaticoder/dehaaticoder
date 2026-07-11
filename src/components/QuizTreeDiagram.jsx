import { buildSVG } from './visualizers/treeUtils'

const LEGEND = [
  { bg: 'bg-green-100',  border: 'border-green-400',  label: 'Leaf (collected)' },
  { bg: 'bg-stone-100',  border: 'border-stone-300',  label: 'Exploring' },
  { bg: 'bg-red-100',    border: 'border-red-300',    label: 'Pruned ❌' },
]

export default function QuizTreeDiagram({ root }) {
  const { svg, width, height } = buildSVG(root)
  return (
    <div className="mx-6 mt-4 mb-1 space-y-2">
      <div className="flex flex-wrap gap-3 text-xs text-stone-500">
        {LEGEND.map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${bg} border ${border}`} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12">
            <line x1="1" y1="6" x2="18" y2="6" stroke="#4caf50" strokeWidth="1.5" />
            <polygon points="16,3 22,6 16,9" fill="#4caf50" />
          </svg>
          <span>pick / add</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12">
            <line x1="1" y1="6" x2="18" y2="6" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,2" />
            <polygon points="16,3 22,6 16,9" fill="#aaa" />
          </svg>
          <span>skip / prune</span>
        </div>
      </div>
      <div className="border border-stone-200 rounded-xl bg-white overflow-auto max-h-[420px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          style={{ userSelect: 'none', pointerEvents: 'none', display: 'block' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  )
}

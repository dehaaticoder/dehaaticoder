import { useState } from 'react'

const TARGET = 5
const SVG_W = 700, LEVEL_H = 65, NW = 58, NH = 36

const PAL = [
  { fill: '#fee2e2', stroke: '#ef4444', text: '#b91c1c' }, // n=0 red (base)
  { fill: '#ffedd5', stroke: '#f97316', text: '#c2410c' }, // n=1 orange
  { fill: '#fef9c3', stroke: '#ca8a04', text: '#78350f' }, // n=2 amber
  { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d' }, // n=3 green
  { fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' }, // n=4 blue
  { fill: '#e0e7ff', stroke: '#6366f1', text: '#3730a3' }, // n=5 indigo
]

// DP values
const DP = new Array(TARGET + 1).fill(Infinity)
DP[0] = 0
for (let i = 1; i <= TARGET; i++) {
  for (let x = 1; x * x <= i; x++) DP[i] = Math.min(DP[i], 1 + DP[i - x * x])
}

// Perfect squares ≤ n
function squares(n) {
  const s = []; for (let x = 1; x * x <= n; x++) s.push(x * x); return s
}

function buildTree(n) {
  const node = { n, children: [] }
  if (n > 0) squares(n).forEach(sq => node.children.push(buildTree(n - sq)))
  return node
}

function assignDepth(node, d = 0) { node.d = d; node.children.forEach(c => assignDepth(c, d + 1)) }
function leafCount(node) { return node.children.length === 0 ? 1 : node.children.reduce((s, c) => s + leafCount(c), 0) }
let _li = 0
function assignX(node, total) {
  if (node.children.length === 0) { node.x = (_li++ + 0.5) * SVG_W / total; return }
  node.children.forEach(c => assignX(c, total))
  node.x = node.children.reduce((s, c) => s + c.x, 0) / node.children.length
}
let _uid = 0; const _seen = {}
function flattenDFS(node, pid = null, sqLabel = null) {
  const id = _uid++; node.id = id; node.pid = pid; node.sqLabel = sqLabel
  node.isMemo = _seen[node.n] !== undefined
  if (!node.isMemo) _seen[node.n] = true
  const r = [node]
  node.children.forEach((c, idx) => {
    const sq = squares(node.n)[idx]
    r.push(...flattenDFS(c, id, `-${Math.round(Math.sqrt(sq))}²`))
  })
  return r
}
function assignMemoVis(node, pv = true, pm = false) {
  node.memoVisible = pv && !pm
  node.children.forEach(c => assignMemoVis(c, node.memoVisible, node.isMemo))
}

const _tree = buildTree(TARGET)
assignDepth(_tree)
_li = 0; assignX(_tree, leafCount(_tree))
const nodes = flattenDFS(_tree)
assignMemoVis(_tree)

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))
const edges = nodes.filter(n => n.pid !== null).map(n => {
  const p = nodeById[n.pid]
  return { x1: p.x, y1: p.d * LEVEL_H + 38, x2: n.x, y2: n.d * LEVEL_H + 38, label: n.sqLabel, childId: n.id }
})
const callCounts = {}
nodes.forEach(n => { callCounts[n.n] = (callCounts[n.n] || 0) + 1 })
const maxD = Math.max(...nodes.map(n => n.d))
const SVG_H = maxD * LEVEL_H + 80
const memoCallCount = nodes.filter(n => n.memoVisible).length

export default function PerfectSquaresVisualizer({ fullscreen = false }) {
  const [memo, setMemo] = useState(false)
  const visIds = new Set(nodes.filter(n => memo ? n.memoVisible : true).map(n => n.id))

  return (
    <div className={`font-sans text-sm select-none ${fullscreen ? 'p-8' : 'p-4'}`}>
      <p className="text-xs text-stone-400 mb-3">
        minSq({TARGET}) — each edge label is the square subtracted (1² or 2²)
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
        {Array.from({ length: TARGET + 1 }, (_, i) => i).reverse().map(i => (
          <span key={i} className="px-2 py-1 rounded-md border font-mono"
            style={{ background: PAL[i].fill, borderColor: PAL[i].stroke, color: PAL[i].text }}>
            f({i}) = {DP[i] === Infinity ? '∞' : DP[i]} — {callCounts[i] || 0}×
          </span>
        ))}
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMemo(false)}
          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${!memo ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}>
          Without Memo ({nodes.length} calls)
        </button>
        <button onClick={() => setMemo(true)}
          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${memo ? 'bg-green-600 text-white border-green-600' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}>
          With Memoization ({memoCallCount} calls)
        </button>
      </div>

      {/* Tree */}
      <div className="overflow-x-auto rounded-xl border border-stone-100 bg-stone-50">
        <svg width={SVG_W} height={SVG_H} style={{ display: 'block', minWidth: SVG_W }}>
          <defs>
            <marker id="ps-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            if (!visIds.has(e.childId)) return null
            return <line key={i}
              x1={e.x1} y1={e.y1 + NH / 2 + 2} x2={e.x2} y2={e.y2 - NH / 2 - 2}
              stroke="#64748b" strokeWidth={1.5} markerEnd="url(#ps-arr)" />
          })}
          {edges.map((e, i) => {
            if (!visIds.has(e.childId)) return null
            return <text key={`l${i}`} x={(e.x1 + e.x2) / 2} y={(e.y1 + e.y2) / 2 + 2}
              textAnchor="middle" fontSize={8} fill="#94a3b8">{e.label}</text>
          })}
          {nodes.map(node => {
            if (!visIds.has(node.id)) return null
            const c = PAL[Math.min(node.n, PAL.length - 1)]
            const isCached = memo && node.isMemo
            const isRepeat = !memo && node.isMemo
            const cx = node.x, cy = node.d * LEVEL_H + 38
            return <g key={node.id}>
              <rect x={cx - NW / 2} y={cy - NH / 2} width={NW} height={NH} rx={8}
                fill={isCached ? '#f1f5f9' : c.fill}
                stroke={isCached ? '#94a3b8' : c.stroke}
                strokeWidth={isRepeat ? 1.5 : 2}
                strokeDasharray={isCached || isRepeat ? '4,2' : ''} />
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={isCached ? '#94a3b8' : isRepeat ? c.stroke : c.text}>
                f({node.n})
              </text>
              <text x={cx} y={cy + 11} textAnchor="middle" fontSize={9} fill={isCached ? '#94a3b8' : '#78716c'}>
                {isCached ? '✓ cached' : isRepeat ? 'repeat!' : node.n === 0 ? '= 0' : `= ${DP[node.n]}`}
              </text>
            </g>
          })}
        </svg>
      </div>

      <div className="mt-3 bg-stone-900 text-green-400 px-4 py-2.5 rounded-lg text-xs font-mono">
        {memo
          ? `With memo: ${memoCallCount} calls — f(0), f(1) cached and reused instead of recomputed.`
          : `Without memo: ${nodes.length} calls — f(0) called ${callCounts[0] || 0}×, f(1) called ${callCounts[1] || 0}× — same work done again!`}
      </div>
    </div>
  )
}

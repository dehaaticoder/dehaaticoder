import { useState } from 'react'

// 3x3 grid, no obstacles — shows overlapping subproblems clearly
const ROWS = 3, COLS = 3
const SVG_W = 700, LEVEL_H = 74, NW = 64, NH = 38

// 9 cell colors (row*COLS + col → color)
const PAL = [
  { fill: '#f1f5f9', stroke: '#94a3b8', text: '#64748b' }, // (0,0)
  { fill: '#fee2e2', stroke: '#ef4444', text: '#b91c1c' }, // (0,1)
  { fill: '#ffedd5', stroke: '#f97316', text: '#c2410c' }, // (0,2)
  { fill: '#fef9c3', stroke: '#ca8a04', text: '#78350f' }, // (1,0)
  { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d' }, // (1,1) ← overlaps here!
  { fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' }, // (1,2)
  { fill: '#e0e7ff', stroke: '#6366f1', text: '#3730a3' }, // (2,0)
  { fill: '#f3e8ff', stroke: '#a855f7', text: '#6b21a8' }, // (2,1)
  { fill: '#fce7f3', stroke: '#ec4899', text: '#9d174d' }, // (2,2)
]
const pal = (i, j) => PAL[i * COLS + j]

// DP values (top-left start, bottom-right end)
const DP = Array.from({ length: ROWS }, () => new Array(COLS).fill(0))
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLS; j++) {
    if (i === 0 || j === 0) DP[i][j] = 1
    else DP[i][j] = DP[i - 1][j] + DP[i][j - 1]
  }
}

// Build recursion tree: paths(i,j) = paths(i-1,j) + paths(i,j-1)
// Base: i==0 || j==0 → 1 (no children)
function buildTree(i, j) {
  const node = { i, j, key: `${i},${j}`, children: [] }
  if (i > 0 && j > 0) {
    node.children.push(buildTree(i - 1, j)) // from above
    node.children.push(buildTree(i, j - 1)) // from left
  }
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
function flattenDFS(node, pid = null, side = null) {
  const id = _uid++; node.id = id; node.pid = pid; node.side = side
  node.isMemo = _seen[node.key] !== undefined
  if (!node.isMemo) _seen[node.key] = true
  const r = [node]
  node.children.forEach((c, idx) => r.push(...flattenDFS(c, id, idx === 0 ? '↑' : '←')))
  return r
}
function assignMemoVis(node, pv = true, pm = false) {
  node.memoVisible = pv && !pm
  node.children.forEach(c => assignMemoVis(c, node.memoVisible, node.isMemo))
}

const _tree = buildTree(ROWS - 1, COLS - 1)
assignDepth(_tree)
_li = 0; assignX(_tree, leafCount(_tree))
const nodes = flattenDFS(_tree)
assignMemoVis(_tree)

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))
const edges = nodes.filter(n => n.pid !== null).map(n => {
  const p = nodeById[n.pid]
  return { x1: p.x, y1: p.d * LEVEL_H + 40, x2: n.x, y2: n.d * LEVEL_H + 40, side: n.side, childId: n.id }
})
const callCounts = {}
nodes.forEach(n => { callCounts[n.key] = (callCounts[n.key] || 0) + 1 })
const maxD = Math.max(...nodes.map(n => n.d))
const SVG_H = maxD * LEVEL_H + 90
const memoCallCount = nodes.filter(n => n.memoVisible).length

export default function UniquePathsVisualizer({ fullscreen = false }) {
  const [memo, setMemo] = useState(false)
  const visIds = new Set(nodes.filter(n => memo ? n.memoVisible : true).map(n => n.id))

  const overlapping = Object.entries(callCounts).filter(([, c]) => c > 1)

  return (
    <div className={`font-sans text-sm select-none ${fullscreen ? 'p-8' : 'p-4'}`}>
      <p className="text-xs text-stone-400 mb-3">
        {ROWS}×{COLS} grid — p(i,j) = paths from (0,0) to (i,j). ↑ = from above, ← = from left.
      </p>

      {/* Legend: only show cells that appear in the tree */}
      <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
        {nodes.filter(n => n.isFirst || !n.isMemo).map(n => n.key).filter((k, i, a) => a.indexOf(k) === i).map(key => {
          const [i, j] = key.split(',').map(Number)
          const c = pal(i, j)
          const isBase = i === 0 || j === 0
          return (
            <span key={key} className="px-2 py-1 rounded-md border font-mono"
              style={{ background: c.fill, borderColor: c.stroke, color: c.text }}>
              p({i},{j})={DP[i][j]} — {callCounts[key]}× {isBase ? '[base]' : ''}
            </span>
          )
        })}
        <span className="text-stone-400 self-center ml-1">↑ above &nbsp; ← left</span>
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
            <marker id="up-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            if (!visIds.has(e.childId)) return null
            return <line key={i}
              x1={e.x1} y1={e.y1 + NH / 2 + 2} x2={e.x2} y2={e.y2 - NH / 2 - 2}
              stroke={e.side === '↑' ? '#475569' : '#94a3b8'} strokeWidth={1.5}
              strokeDasharray={e.side === '←' ? '6,3' : ''} markerEnd="url(#up-arr)" />
          })}
          {edges.map((e, i) => {
            if (!visIds.has(e.childId)) return null
            return <text key={`l${i}`} x={(e.x1 + e.x2) / 2} y={(e.y1 + e.y2) / 2 + 2}
              textAnchor="middle" fontSize={10} fill={e.side === '↑' ? '#64748b' : '#94a3b8'}>
              {e.side}
            </text>
          })}
          {nodes.map(node => {
            if (!visIds.has(node.id)) return null
            const c = pal(node.i, node.j)
            const isCached = memo && node.isMemo
            const isRepeat = !memo && node.isMemo
            const isBase = node.i === 0 || node.j === 0
            const cx = node.x, cy = node.d * LEVEL_H + 40
            return <g key={node.id}>
              <rect x={cx - NW / 2} y={cy - NH / 2} width={NW} height={NH} rx={8}
                fill={isCached ? '#f1f5f9' : c.fill}
                stroke={isCached ? '#94a3b8' : c.stroke}
                strokeWidth={isRepeat ? 1.5 : 2}
                strokeDasharray={isCached || isRepeat ? '4,2' : ''} />
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={isCached ? '#94a3b8' : isRepeat ? c.stroke : c.text}>
                p({node.i},{node.j})
              </text>
              <text x={cx} y={cy + 11} textAnchor="middle" fontSize={9} fill={isCached ? '#94a3b8' : '#78716c'}>
                {isCached ? '✓ cached' : isRepeat ? 'repeat!' : isBase ? '= 1 [base]' : `= ${DP[node.i][node.j]}`}
              </text>
            </g>
          })}
        </svg>
      </div>

      <div className="mt-3 bg-stone-900 text-green-400 px-4 py-2.5 rounded-lg text-xs font-mono">
        {memo
          ? `With memo: ${memoCallCount} calls — p(1,1) computed once, reused from cache on second call.`
          : `Without memo: ${nodes.length} calls — ${overlapping.map(([k, c]) => `p(${k}) called ${c}×`).join(', ')}. Overlapping!`}
      </div>
    </div>
  )
}

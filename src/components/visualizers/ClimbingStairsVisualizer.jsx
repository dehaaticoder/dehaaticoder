import { useState } from 'react'

const N = 5
const SVG_W = 700
const LEVEL_H = 74
const NW = 56, NH = 38

// Color palette indexed by n value (0..5)
const PAL = [
  { fill: '#fee2e2', stroke: '#ef4444', text: '#b91c1c' }, // 0 red
  { fill: '#ffedd5', stroke: '#f97316', text: '#c2410c' }, // 1 orange
  { fill: '#fef9c3', stroke: '#ca8a04', text: '#78350f' }, // 2 amber
  { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d' }, // 3 green
  { fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' }, // 4 blue
  { fill: '#e0e7ff', stroke: '#6366f1', text: '#3730a3' }, // 5 indigo
]

// DP values
const DP = [1, 1]
for (let i = 2; i <= N; i++) DP.push(DP[i - 1] + DP[i - 2])

// --- Tree construction (runs once at module level) ---

function buildTree(n) {
  const node = { n, children: [] }
  if (n >= 2) {
    node.children.push(buildTree(n - 1))
    node.children.push(buildTree(n - 2))
  }
  return node
}

function assignDepth(node, d = 0) {
  node.d = d
  node.children.forEach(c => assignDepth(c, d + 1))
}

function leafCount(node) {
  return node.children.length === 0 ? 1 : node.children.reduce((s, c) => s + leafCount(c), 0)
}

let _leafIdx = 0
function assignX(node, total) {
  if (node.children.length === 0) {
    node.x = (_leafIdx++ + 0.5) * SVG_W / total
  } else {
    node.children.forEach(c => assignX(c, total))
    node.x = node.children.reduce((s, c) => s + c.x, 0) / node.children.length
  }
}

let _uid = 0
const _firstSeen = {}
function flattenDFS(node, pid = null, side = null) {
  const id = _uid++
  node.id = id; node.pid = pid; node.side = side
  node.isMemo = _firstSeen[node.n] !== undefined
  if (!node.isMemo) _firstSeen[node.n] = true
  const result = [node]
  node.children.forEach((c, i) => result.push(...flattenDFS(c, id, i === 0 ? 'left' : 'right')))
  return result
}

// memoVisible: a node is visible in memo mode only if its parent is visible AND parent is not a memo node
function assignMemoVis(node, parentVisible = true, parentIsMemo = false) {
  node.memoVisible = parentVisible && !parentIsMemo
  node.children.forEach(c => assignMemoVis(c, node.memoVisible, node.isMemo))
}

const _tree = buildTree(N)
assignDepth(_tree)
_leafIdx = 0
assignX(_tree, leafCount(_tree))
const nodes = flattenDFS(_tree)
assignMemoVis(_tree)

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))

const edges = nodes
  .filter(n => n.pid !== null)
  .map(n => {
    const p = nodeById[n.pid]
    return { x1: p.x, y1: p.d * LEVEL_H + 40, x2: n.x, y2: n.d * LEVEL_H + 40, side: n.side, childN: n.n, childId: n.id }
  })

const callCounts = {}
nodes.forEach(n => { callCounts[n.n] = (callCounts[n.n] || 0) + 1 })
const maxD = Math.max(...nodes.map(n => n.d))
const SVG_H = maxD * LEVEL_H + 90

// --- Component ---

export default function ClimbingStairsVisualizer({ fullscreen = false }) {
  const [memo, setMemo] = useState(false)

  const visibleNodeIds = new Set(
    nodes.filter(n => memo ? n.memoVisible : true).map(n => n.id)
  )
  const memoCallCount = nodes.filter(n => n.memoVisible).length

  return (
    <div className={`font-sans text-sm select-none ${fullscreen ? 'p-8' : 'p-4'}`}>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
        {[5, 4, 3, 2, 1, 0].map(i => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-md border font-mono"
            style={{ background: PAL[i].fill, borderColor: PAL[i].stroke, color: PAL[i].text }}>
            f({i}) — called {callCounts[i]}×
          </span>
        ))}
        <span className="flex items-center gap-2 text-stone-400 ml-1">
          <span>— left child (n-1)</span>
          <span className="opacity-60">- - right child (n-2)</span>
        </span>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMemo(false)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${!memo ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}>
          Without Memo ({nodes.length} calls)
        </button>
        <button onClick={() => setMemo(true)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${memo ? 'bg-green-600 text-white border-green-600' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}>
          With Memoization ({memoCallCount} calls)
        </button>
      </div>

      {/* SVG Tree */}
      <div className="overflow-x-auto rounded-xl border border-stone-100 bg-stone-50">
        <svg width={SVG_W} height={SVG_H} style={{ display: 'block', minWidth: SVG_W }}>
          <defs>
            <marker id="cs-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            if (!visibleNodeIds.has(e.childId)) return null
            return (
              <line key={i}
                x1={e.x1} y1={e.y1 + NH / 2 + 2}
                x2={e.x2} y2={e.y2 - NH / 2 - 2}
                stroke={e.side === 'left' ? '#475569' : '#94a3b8'}
                strokeWidth={1.5}
                strokeDasharray={e.side === 'right' ? '6,3' : ''}
                markerEnd="url(#cs-arr)"
              />
            )
          })}

          {/* Edge labels */}
          {edges.map((e, i) => {
            if (!visibleNodeIds.has(e.childId)) return null
            const mx = (e.x1 + e.x2) / 2
            const my = (e.y1 + e.y2) / 2 + 2
            const label = e.side === 'left' ? 'n−1' : 'n−2'
            return (
              <text key={`lbl-${i}`} x={mx} y={my} textAnchor="middle"
                fontSize={8} fill={e.side === 'left' ? '#64748b' : '#94a3b8'}
                style={{ pointerEvents: 'none' }}>
                {label}
              </text>
            )
          })}

          {/* Nodes */}
          {nodes.map(node => {
            if (!visibleNodeIds.has(node.id)) return null
            const c = PAL[node.n]
            const isCachedLeaf = memo && node.isMemo
            const isRepeat = !memo && node.isMemo
            const cx = node.x, cy = node.d * LEVEL_H + 40

            return (
              <g key={node.id}>
                <rect
                  x={cx - NW / 2} y={cy - NH / 2}
                  width={NW} height={NH} rx={8}
                  fill={isCachedLeaf ? '#f1f5f9' : c.fill}
                  stroke={isCachedLeaf ? '#94a3b8' : c.stroke}
                  strokeWidth={isRepeat ? 1.5 : 2}
                  strokeDasharray={isCachedLeaf || isRepeat ? '4,2' : ''}
                />
                <text x={cx} y={cy - 5} textAnchor="middle"
                  fontSize={12} fontWeight={700}
                  fill={isCachedLeaf ? '#94a3b8' : isRepeat ? c.stroke : c.text}>
                  f({node.n})
                </text>
                <text x={cx} y={cy + 11} textAnchor="middle"
                  fontSize={9}
                  fill={isCachedLeaf ? '#94a3b8' : isRepeat ? '#b45309' : '#78716c'}>
                  {isCachedLeaf ? '✓ cached' : isRepeat ? 'repeat!' : `= ${DP[node.n]}`}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Info bar */}
      <div className="mt-3 bg-stone-900 text-green-400 px-4 py-2.5 rounded-lg text-xs font-mono leading-5">
        {memo
          ? `With memo: ${memoCallCount} total calls — each subproblem computed once, then returned instantly from cache.`
          : `Without memo: ${nodes.length} total calls — f(2) called ${callCounts[2]}×, f(3) called ${callCounts[3]}× — same work repeated! That's why we need DP.`}
      </div>
    </div>
  )
}

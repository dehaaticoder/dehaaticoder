import { useState } from 'react'

// GC(3, 3): digit=3, sum=3 — shows how same GC(1,x) subproblems repeat across branches
const DIGIT = 3, SUM = 3
const SVG_W = 820, LEVEL_H = 72, NW = 56, NH = 36

// Colors keyed by "digit,sum" — same color = same subproblem
const COLORS = {
  '3,3': { fill: '#fef9c3', stroke: '#ca8a04', text: '#78350f' },
  '2,3': { fill: '#fde8ff', stroke: '#c026d3', text: '#701a75' },
  '2,2': { fill: '#e0e7ff', stroke: '#6366f1', text: '#3730a3' },
  '2,1': { fill: '#dbeafe', stroke: '#3b82f6', text: '#1e40af' },
  '2,0': { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d' },
  '1,3': { fill: '#f5f5f5', stroke: '#a3a3a3', text: '#525252' },
  '1,2': { fill: '#fff7ed', stroke: '#f97316', text: '#c2410c' },
  '1,1': { fill: '#fee2e2', stroke: '#ef4444', text: '#b91c1c' },
  '1,0': { fill: '#f0fdf4', stroke: '#16a34a', text: '#15803d' },
}
const pal = (digit, sum) => COLORS[`${digit},${sum}`] || { fill: '#f1f5f9', stroke: '#94a3b8', text: '#64748b' }

// DP values (memoized)
const _dp = {}
function dpVal(digit, sum) {
  const k = `${digit},${sum}`
  if (k in _dp) return _dp[k]
  if (digit === 1) return (_dp[k] = (sum >= 1 && sum <= 9) ? 1 : 0)
  let cnt = 0
  for (let d = 0; d <= Math.min(sum, 9); d++) cnt += dpVal(digit - 1, sum - d)
  return (_dp[k] = cnt)
}

// Build full recursion tree (no memoization — shows all repeated calls)
function buildTree(digit, sum) {
  const node = { digit, sum, children: [] }
  if (digit > 1) {
    for (let d = 0; d <= Math.min(sum, 9); d++) {
      node.children.push(buildTree(digit - 1, sum - d))
    }
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
function flattenDFS(node, pid = null, edgeD = null) {
  const id = _uid++; node.id = id; node.pid = pid; node.edgeD = edgeD
  const key = `${node.digit},${node.sum}`
  node.isMemo = _seen[key] !== undefined
  if (!node.isMemo) _seen[key] = true
  const r = [node]
  node.children.forEach((c, i) => r.push(...flattenDFS(c, id, i)))
  return r
}

function assignMemoVis(node, pv = true, pm = false) {
  node.memoVisible = pv && !pm
  node.children.forEach(c => assignMemoVis(c, node.memoVisible, node.isMemo))
}

const _tree = buildTree(DIGIT, SUM)
assignDepth(_tree)
_li = 0; assignX(_tree, leafCount(_tree))
const nodes = flattenDFS(_tree)
assignMemoVis(_tree)

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))
const edges = nodes.filter(n => n.pid !== null).map(n => {
  const p = nodeById[n.pid]
  return { x1: p.x, y1: p.d * LEVEL_H + 38, x2: n.x, y2: n.d * LEVEL_H + 38, d: n.edgeD, childId: n.id }
})

const callCounts = {}
nodes.forEach(n => { const k = `${n.digit},${n.sum}`; callCounts[k] = (callCounts[k] || 0) + 1 })
const maxD = Math.max(...nodes.map(n => n.d))
const SVG_H = maxD * LEVEL_H + 80
const memoCallCount = nodes.filter(n => n.memoVisible).length
const overlapping = Object.entries(callCounts).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1])

export default function NDigitNumbersVisualizer({ fullscreen = false }) {
  const [memo, setMemo] = useState(false)
  const visIds = new Set(nodes.filter(n => memo ? n.memoVisible : true).map(n => n.id))

  return (
    <div className={`font-sans text-sm select-none ${fullscreen ? 'p-8' : 'p-4'}`}>
      <p className="text-xs text-stone-400 mb-3">
        GC(digit, sum) — digit={DIGIT}, sum={SUM}. Each node branches into GC(digit−1, sum−d) for d=0..sum.
        Same color = same subproblem called again.
      </p>

      {/* Overlapping legend */}
      <div className="flex flex-wrap gap-1.5 mb-3 text-xs">
        {overlapping.map(([key, count]) => {
          const [digit, sum] = key.split(',').map(Number)
          const c = pal(digit, sum)
          return (
            <span key={key} className="px-2 py-1 rounded-md border font-mono"
              style={{ background: c.fill, borderColor: c.stroke, color: c.text }}>
              GC({digit},{sum}) — {count}× calls
            </span>
          )
        })}
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
            <marker id="nd-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            if (!visIds.has(e.childId)) return null
            return <line key={i}
              x1={e.x1} y1={e.y1 + NH / 2 + 2} x2={e.x2} y2={e.y2 - NH / 2 - 2}
              stroke="#94a3b8" strokeWidth={1} markerEnd="url(#nd-arr)" />
          })}
          {/* Edge labels (d value) */}
          {edges.map((e, i) => {
            if (!visIds.has(e.childId)) return null
            return <text key={`l${i}`} x={(e.x1 * 0.4 + e.x2 * 0.6)} y={(e.y1 + e.y2) / 2 + 2}
              textAnchor="middle" fontSize={7} fill="#94a3b8">d={e.d}</text>
          })}

          {/* Nodes */}
          {nodes.map(node => {
            if (!visIds.has(node.id)) return null
            const c = pal(node.digit, node.sum)
            const isCached = memo && node.isMemo
            const isRepeat = !memo && node.isMemo
            const isBase = node.digit === 1
            const val = dpVal(node.digit, node.sum)
            const cx = node.x, cy = node.d * LEVEL_H + 38
            return <g key={node.id}>
              <rect x={cx - NW / 2} y={cy - NH / 2} width={NW} height={NH} rx={7}
                fill={isCached ? '#f1f5f9' : c.fill}
                stroke={isCached ? '#94a3b8' : c.stroke}
                strokeWidth={isRepeat ? 1.5 : 2}
                strokeDasharray={isCached || isRepeat ? '4,2' : ''} />
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={isCached ? '#94a3b8' : isRepeat ? c.stroke : c.text}>
                GC({node.digit},{node.sum})
              </text>
              <text x={cx} y={cy + 10} textAnchor="middle" fontSize={8} fill={isCached ? '#94a3b8' : '#78716c'}>
                {isCached ? '✓ cached' : isRepeat ? 'repeat!' : isBase ? (node.sum >= 1 ? '= 1' : '= 0') : `= ${val}`}
              </text>
            </g>
          })}
        </svg>
      </div>

      <div className="mt-3 bg-stone-900 text-green-400 px-4 py-2.5 rounded-lg text-xs font-mono">
        {memo
          ? `With memo: ${memoCallCount} calls — GC(1,0) cached after 1st call, reused ${(callCounts['1,0'] || 1) - 1} more times.`
          : `Without memo: ${nodes.length} calls — GC(1,0) called ${callCounts['1,0'] || 0}×, GC(1,1) called ${callCounts['1,1'] || 0}×. Same work done again!`}
      </div>
    </div>
  )
}

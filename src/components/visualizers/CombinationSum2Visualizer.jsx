import { useState, useEffect, useRef } from 'react'

const NW = 112, NH = 40, LG = 68, SG = 14

const COLORS = {
  normal: { fill: '#f5f5f5', stroke: '#bbb',    text: '#222',    sw: 1.5 },
  found:  { fill: '#e8f5e9', stroke: '#4caf50',  text: '#2e7d32', sw: 2.2 },
  dup:    { fill: '#fff3e0', stroke: '#ff9800',  text: '#bf360c', sw: 2   },
  pruned: { fill: '#fce4ec', stroke: '#e57373',  text: '#b71c1c', sw: 1.5 },
  end:    { fill: '#f3e5f5', stroke: '#9c27b0',  text: '#4a148c', sw: 1.5 },
}

function n(label, sub, type, edge, et, children) {
  return { label, sub, type, edge, et, children }
}

const TREES = {
  unsorted: n('sum=0, []', 'idx=0  A[0]=2', 'normal', '', '', [
    n('sum=2, [2]', 'idx=1  A[1]=5', 'normal', 'pick 2', 'pick', [
      n('sum=7, [2,5]', 'PRUNED ✗ (7>5)', 'pruned', 'pick 5', 'pick', []),
      n('sum=2, [2]', 'idx=2  A[2]=2', 'normal', 'skip 5', 'skip', [
        n('sum=4, [2,2]', 'idx=3  A[3]=1', 'normal', 'pick 2', 'pick', [
          n('sum=5, [2,2,1]', '✅ FOUND', 'found', 'pick 1', 'pick', []),
          n('sum=4, [2,2]', 'idx=4  A[4]=2', 'normal', 'skip 1', 'skip', [
            n('sum=6, [2,2,2]', 'PRUNED ✗ (6>5)', 'pruned', 'pick 2', 'pick', []),
            n('sum=4, [2,2]', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
        ]),
        n('sum=2, [2]', 'idx=3  A[3]=1', 'normal', 'skip 2', 'skip', [
          n('sum=3, [2,1]', 'idx=4  A[4]=2', 'normal', 'pick 1', 'pick', [
            n('sum=5, [2,1,2]', '⚠ DUP of [2,2,1]!', 'dup', 'pick 2', 'pick', []),
            n('sum=3, [2,1]', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
          n('sum=2, [2]', 'idx=4  A[4]=2', 'normal', 'skip 1', 'skip', [
            n('sum=4, [2,2]', 'idx=5  END ∅', 'end', 'pick 2', 'pick', []),
            n('sum=2, [2]', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
        ]),
      ]),
    ]),
    n('sum=0, []', 'idx=1  A[1]=5', 'normal', 'skip 2', 'skip', [
      n('sum=5, [5]', '✅ FOUND', 'found', 'pick 5', 'pick', []),
      n('sum=0, []', 'idx=2  A[2]=2', 'normal', 'skip 5', 'skip', [
        n('sum=2, [2]', 'idx=3  A[3]=1', 'normal', 'pick 2', 'pick', [
          n('sum=3, [2,1]', 'idx=4  A[4]=2', 'normal', 'pick 1', 'pick', [
            n('sum=5, [2,1,2]', '⚠ DUP (HashSet blocks)', 'dup', 'pick 2', 'pick', []),
            n('sum=3, [2,1]', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
          n('sum=2, [2]', 'idx=4  A[4]=2', 'normal', 'skip 1', 'skip', [
            n('sum=4, [2,2]', 'idx=5  END ∅', 'end', 'pick 2', 'pick', []),
            n('sum=2, [2]', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
        ]),
        n('sum=0, []', 'idx=3  A[3]=1', 'normal', 'skip 2', 'skip', [
          n('sum=1, [1]', 'idx=4  A[4]=2', 'normal', 'pick 1', 'pick', [
            n('sum=3, [1,2]', 'idx=5  END ∅', 'end', 'pick 2', 'pick', []),
            n('sum=1, [1]', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
          n('sum=0, []', 'idx=4  A[4]=2', 'normal', 'skip 1', 'skip', [
            n('sum=2, [2]', 'idx=5  END ∅', 'end', 'pick 2', 'pick', []),
            n('sum=0, []', 'idx=5  END ∅', 'end', 'skip 2', 'skip', []),
          ]),
        ]),
      ]),
    ]),
  ]),

  sorted: n('sum=0, []', 'idx=0  A[0]=1', 'normal', '', '', [
    n('sum=1, [1]', 'idx=1  A[1]=2', 'normal', 'pick 1', 'pick', [
      n('sum=3, [1,2]', 'idx=2  A[2]=2', 'normal', 'pick 2', 'pick', [
        n('sum=5, [1,2,2]', '✅ FOUND', 'found', 'pick 2', 'pick', []),
        n('sum=3, [1,2]', 'idx=3  A[3]=2', 'normal', 'skip 2', 'skip', [
          n('sum=5, [1,2,2]', '⚠ DUP (HashSet blocks)', 'dup', 'pick 2', 'pick', []),
          n('sum=3, [1,2]', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=8, [1,2,5]', 'PRUNED ✗ (8>5)', 'pruned', 'pick 5', 'pick', []),
            n('sum=3, [1,2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
      ]),
      n('sum=1, [1]', 'idx=2  A[2]=2', 'normal', 'skip 2', 'skip', [
        n('sum=3, [1,2]', 'idx=3  A[3]=2', 'normal', 'pick 2', 'pick', [
          n('sum=5, [1,2,2]', '⚠ DUP (HashSet blocks)', 'dup', 'pick 2', 'pick', []),
          n('sum=3, [1,2]', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=8, [1,2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=3, [1,2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
        n('sum=1, [1]', 'idx=3  A[3]=2', 'normal', 'skip 2', 'skip', [
          n('sum=3, [1,2]', 'idx=4  A[4]=5', 'normal', 'pick 2', 'pick', [
            n('sum=8, [1,2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=3, [1,2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
          n('sum=1, [1]', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=6, [1,5]', 'PRUNED ✗ (6>5)', 'pruned', 'pick 5', 'pick', []),
            n('sum=1, [1]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
      ]),
    ]),
    n('sum=0, []', 'idx=1  A[1]=2', 'normal', 'skip 1', 'skip', [
      n('sum=2, [2]', 'idx=2  A[2]=2', 'normal', 'pick 2', 'pick', [
        n('sum=4, [2,2]', 'idx=3  A[3]=2', 'normal', 'pick 2', 'pick', [
          n('sum=6, [2,2,2]', 'PRUNED ✗ (6>5)', 'pruned', 'pick 2', 'pick', []),
          n('sum=4, [2,2]', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=9, [2,2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=4, [2,2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
        n('sum=2, [2]', 'idx=3  A[3]=2', 'normal', 'skip 2', 'skip', [
          n('sum=4, [2,2]', 'idx=4  A[4]=5', 'normal', 'pick 2', 'pick', [
            n('sum=9, [2,2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=4, [2,2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
          n('sum=2, [2]', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=7, [2,5]', 'PRUNED ✗ (7>5)', 'pruned', 'pick 5', 'pick', []),
            n('sum=2, [2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
      ]),
      n('sum=0, []', 'idx=2  A[2]=2', 'normal', 'skip 2', 'skip', [
        n('sum=2, [2]', 'idx=3  A[3]=2', 'normal', 'pick 2', 'pick', [
          n('sum=4, [2,2]', 'idx=4  A[4]=5', 'normal', 'pick 2', 'pick', [
            n('sum=9, [2,2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=4, [2,2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
          n('sum=2, [2]', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=7, [2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=2, [2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
        n('sum=0, []', 'idx=3  A[3]=2', 'normal', 'skip 2', 'skip', [
          n('sum=2, [2]', 'idx=4  A[4]=5', 'normal', 'pick 2', 'pick', [
            n('sum=7, [2,5]', 'PRUNED ✗', 'pruned', 'pick 5', 'pick', []),
            n('sum=2, [2]', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
          n('sum=0, []', 'idx=4  A[4]=5', 'normal', 'skip 2', 'skip', [
            n('sum=5, [5]', '✅ FOUND', 'found', 'pick 5', 'pick', []),
            n('sum=0, []', 'idx=5  END ∅', 'end', 'skip 5', 'skip', []),
          ]),
        ]),
      ]),
    ]),
  ]),
}

function computeWidth(node) {
  if (!node.children.length) { node._w = NW; return NW }
  let t = 0
  node.children.forEach(c => { t += computeWidth(c) + SG })
  t -= SG
  node._w = Math.max(NW, t)
  return node._w
}

function assignX(node, left) {
  if (!node.children.length) { node._x = left + node._w / 2; return }
  let cur = left
  node.children.forEach(c => { assignX(c, cur); cur += c._w + SG })
  const f = node.children[0]._x
  const l = node.children[node.children.length - 1]._x
  node._x = (f + l) / 2
}

function assignY(node, lvl) {
  node._y = lvl * (NH + LG) + 16
  node.children.forEach(c => assignY(c, lvl + 1))
}

function collect(node, arr) {
  arr.push(node)
  node.children.forEach(c => collect(c, arr))
  return arr
}

function buildSVG(treeKey) {
  const root = JSON.parse(JSON.stringify(TREES[treeKey]))
  computeWidth(root)
  assignX(root, 10)
  assignY(root, 0)
  const nodes = collect(root, [])
  let maxX = 0, maxY = 0
  nodes.forEach(nd => {
    maxX = Math.max(maxX, nd._x + NW / 2 + 10)
    maxY = Math.max(maxY, nd._y + NH + 10)
  })

  let h = `<defs>
    <marker id="mg" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#4caf50"/></marker>
    <marker id="ma" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#aaa"/></marker>
  </defs>`

  nodes.forEach(nd => {
    nd.children.forEach(ch => {
      const x1 = nd._x, y1 = nd._y + NH, x2 = ch._x, y2 = ch._y
      const my = (y1 + y2) / 2
      const col = ch.et === 'pick' ? '#4caf50' : '#aaa'
      const dash = ch.et === 'pick' ? '' : 'stroke-dasharray="5,3"'
      const mk = ch.et === 'pick' ? 'url(#mg)' : 'url(#ma)'
      h += `<path d="M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}" fill="none" stroke="${col}" stroke-width="1.5" ${dash} marker-end="${mk}"/>`
      const lx = x1 * 0.35 + x2 * 0.65
      const ly = y1 * 0.35 + y2 * 0.65 - 3
      h += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="9" font-weight="700" fill="${col}">${ch.edge}</text>`
    })
  })

  nodes.forEach(nd => {
    const c = COLORS[nd.type] || COLORS.normal
    const nx = nd._x - NW / 2, ny = nd._y
    h += `<rect x="${nx}" y="${ny}" width="${NW}" height="${NH}" rx="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${c.sw}"/>`
    h += `<text x="${nd._x}" y="${ny + 14}" text-anchor="middle" font-size="10" font-weight="700" fill="${c.text}">${nd.label}</text>`
    h += `<text x="${nd._x}" y="${ny + 27}" text-anchor="middle" font-size="9" fill="${c.text}">${nd.sub}</text>`
  })

  // watermark
  h += `<text x="${maxX - 8}" y="${maxY - 6}" text-anchor="end" font-size="10" fill="#ccc" font-family="sans-serif" opacity="0.8">dehaaticoder.com</text>`

  return { svg: h, width: maxX, height: maxY }
}

const RESULTS = {
  unsorted: {
    bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900',
    msg: '⚠ HashSet output: [[2,2,1], [2,1,2], [5]] — WRONG! [2,2,1] and [2,1,2] are the same combination in different order. HashSet cannot catch this without sorting.',
  },
  sorted: {
    bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900',
    msg: '✅ HashSet output: [[1,2,2], [5]] — CORRECT! Sorting guarantees all paths build combinations in ascending order → HashSet dedup works perfectly.',
  },
}

export default function CombinationSum2Visualizer({ fullscreen = false }) {
  const [active, setActive] = useState('unsorted')
  const { svg, width, height } = buildSVG(active)
  const result = RESULTS[active]

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {['unsorted', 'sorted'].map(key => (
          <button key={key} onClick={() => setActive(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              active === key
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-500 border-stone-300 hover:border-stone-400'
            }`}>
            {key === 'unsorted' ? 'Without Sort [2,5,2,1,2]' : 'With Sort [1,2,2,2,5]'}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-stone-500">
        {[
          { bg: 'bg-green-100', border: 'border-green-400', label: 'Found ✅' },
          { bg: 'bg-amber-100', border: 'border-amber-400', label: 'Duplicate ⚠' },
          { bg: 'bg-red-100',   border: 'border-red-400',   label: 'Pruned ✗' },
          { bg: 'bg-purple-100',border: 'border-purple-400',label: 'Exhausted ∅' },
          { bg: 'bg-stone-100', border: 'border-stone-300', label: 'Exploring' },
        ].map(({ bg, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${bg} border ${border}`} />
            <span>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="20" y2="6" stroke="#4caf50" strokeWidth="1.5"/><polygon points="18,3 24,6 18,9" fill="#4caf50"/></svg>
          <span>pick</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="12"><line x1="1" y1="6" x2="20" y2="6" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,2"/><polygon points="18,3 24,6 18,9" fill="#aaa"/></svg>
          <span>skip</span>
        </div>
      </div>

      {/* Tree */}
      <div className={`border border-stone-200 rounded-xl bg-white ${fullscreen ? 'overflow-auto' : 'overflow-auto max-h-[520px]'}`}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={fullscreen ? '100%' : width}
          height={fullscreen ? undefined : height}
          style={fullscreen ? { minWidth: width, height: 'auto', userSelect: 'none', pointerEvents: 'none' } : { userSelect: 'none', pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Result */}
      <div className={`${result.bg} border ${result.border} rounded-xl px-4 py-3 text-xs font-medium ${result.text}`}>
        {result.msg}
      </div>
    </div>
  )
}

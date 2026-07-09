export const NW = 112, NH = 40, LG = 68, SG = 14

export const DEFAULT_COLORS = {
  normal:    { fill: '#f5f5f5', stroke: '#bbb',    text: '#222',    sw: 1.5 },
  found:     { fill: '#e8f5e9', stroke: '#4caf50',  text: '#2e7d32', sw: 2.2 },
  leaf:      { fill: '#e8f5e9', stroke: '#4caf50',  text: '#2e7d32', sw: 2.2 },
  dup:       { fill: '#fff3e0', stroke: '#ff9800',  text: '#bf360c', sw: 2   },
  pruned:    { fill: '#fce4ec', stroke: '#e57373',  text: '#b71c1c', sw: 1.5 },
  end:       { fill: '#f3e5f5', stroke: '#9c27b0',  text: '#4a148c', sw: 1.5 },
  zero:      { fill: '#e3f2fd', stroke: '#1565c0',  text: '#0d47a1', sw: 1.5 },
  one:       { fill: '#fff8e1', stroke: '#f57f17',  text: '#e65100', sw: 1.5 },
}

export function n(label, sub, type, edge, et, children) {
  return { label, sub, type, edge, et, children }
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

export function buildSVG(root, colors = {}) {
  const C = { ...DEFAULT_COLORS, ...colors }
  const cloned = JSON.parse(JSON.stringify(root))
  computeWidth(cloned)
  assignX(cloned, 10)
  assignY(cloned, 0)
  const nodes = collect(cloned, [])
  let maxX = 0, maxY = 0
  nodes.forEach(nd => {
    maxX = Math.max(maxX, nd._x + NW / 2 + 10)
    maxY = Math.max(maxY, nd._y + NH + 10)
  })

  let h = `<defs>
    <marker id="mg" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#4caf50"/></marker>
    <marker id="ma" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#aaa"/></marker>
    <marker id="mb" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#1565c0"/></marker>
    <marker id="mo" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 z" fill="#f57f17"/></marker>
  </defs>`

  nodes.forEach(nd => {
    nd.children.forEach(ch => {
      const x1 = nd._x, y1 = nd._y + NH, x2 = ch._x, y2 = ch._y
      const my = (y1 + y2) / 2
      let col = '#aaa', dash = 'stroke-dasharray="5,3"', mk = 'url(#ma)'
      if (ch.et === 'pick')  { col = '#4caf50'; dash = ''; mk = 'url(#mg)' }
      if (ch.et === 'blue')  { col = '#1565c0'; dash = ''; mk = 'url(#mb)' }
      if (ch.et === 'amber') { col = '#f57f17'; dash = ''; mk = 'url(#mo)' }
      h += `<path d="M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}" fill="none" stroke="${col}" stroke-width="1.5" ${dash} marker-end="${mk}"/>`
      if (ch.edge) {
        const lx = x1 * 0.35 + x2 * 0.65
        const ly = y1 * 0.35 + y2 * 0.65 - 3
        h += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="9" font-weight="700" fill="${col}">${ch.edge}</text>`
      }
    })
  })

  nodes.forEach(nd => {
    const c = C[nd.type] || C.normal
    const nx = nd._x - NW / 2, ny = nd._y
    h += `<rect x="${nx}" y="${ny}" width="${NW}" height="${NH}" rx="5" fill="${c.fill}" stroke="${c.stroke}" stroke-width="${c.sw}"/>`
    h += `<text x="${nd._x}" y="${ny + 14}" text-anchor="middle" font-size="10" font-weight="700" fill="${c.text}">${nd.label}</text>`
    if (nd.sub) {
      h += `<text x="${nd._x}" y="${ny + 27}" text-anchor="middle" font-size="9" fill="${c.text}">${nd.sub}</text>`
    }
  })

  h += `<text x="${maxX - 8}" y="${maxY - 6}" text-anchor="end" font-size="10" fill="#ccc" font-family="sans-serif" opacity="0.8">dehaaticoder.com</text>`

  return { svg: h, width: maxX, height: maxY }
}

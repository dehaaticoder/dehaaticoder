import { useState } from 'react'

const N = 4

function computeSteps() {
  const steps = []
  const board = Array.from({ length: N }, () => Array(N).fill('.'))

  function isSafe(i, j) {
    for (let row = 0; row < i; row++)
      if (board[row][j] === 'Q') return false
    let p = i - 1, q = j - 1
    while (p >= 0 && q >= 0) {
      if (board[p][q] === 'Q') return false
      p--; q--
    }
    let r = i - 1, s = j + 1
    while (r >= 0 && s < N) {
      if (board[r][s] === 'Q') return false
      r--; s++
    }
    return true
  }

  function solve(row) {
    if (row === N) {
      steps.push({
        board: board.map(r => [...r]),
        action: 'solution',
        highlight: null,
        label: '✓ Solution found! All queens placed safely.',
        code: `row == n → ans.add(board as strings)`,
      })
      return
    }
    for (let col = 0; col < N; col++) {
      const safe = isSafe(row, col)
      steps.push({
        board: board.map(r => [...r]),
        action: safe ? 'check_safe' : 'check_fail',
        highlight: { row, col },
        label: safe
          ? `Row ${row}, Col ${col}: isSafe() = true → placing queen`
          : `Row ${row}, Col ${col}: isSafe() = false → skip`,
        code: safe
          ? `board[${row}][${col}] = 'Q'`
          : `// conflict found — try next col`,
      })
      if (safe) {
        board[row][col] = 'Q'
        steps.push({
          board: board.map(r => [...r]),
          action: 'place',
          highlight: { row, col },
          label: `♛ Queen placed at (${row}, ${col}) — recurse to row ${row + 1}`,
          code: `Generate(board, n, ${row + 1})`,
        })
        solve(row + 1)
        board[row][col] = '.'
        steps.push({
          board: board.map(r => [...r]),
          action: 'remove',
          highlight: { row, col },
          label: `↩ Backtrack — remove queen from (${row}, ${col})`,
          code: `board[${row}][${col}] = '.'`,
        })
      }
    }
  }

  solve(0)
  return steps
}

function getAttackedCells(board) {
  const attacked = Array.from({ length: N }, () => Array(N).fill(false))
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === 'Q') {
        for (let c = 0; c < N; c++) if (c !== j) attacked[i][c] = true
        for (let r = 0; r < N; r++) if (r !== i) attacked[r][j] = true
        for (let d = 1; d < N; d++) {
          if (i + d < N && j + d < N) attacked[i + d][j + d] = true
          if (i + d < N && j - d >= 0) attacked[i + d][j - d] = true
          if (i - d >= 0 && j + d < N) attacked[i - d][j + d] = true
          if (i - d >= 0 && j - d >= 0) attacked[i - d][j - d] = true
        }
      }
    }
  }
  return attacked
}

const STEPS = computeSteps()

const ACTION_STYLE = {
  check_safe: 'bg-blue-50 border-blue-300 text-blue-800',
  check_fail: 'bg-amber-50 border-amber-300 text-amber-800',
  place:      'bg-green-50 border-green-300 text-green-800',
  remove:     'bg-red-50 border-red-300 text-red-800',
  solution:   'bg-green-100 border-green-500 text-green-900',
}

export default function NQueensVisualizer({ fullscreen }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const attacked = getAttackedCells(current.board)

  const solutionCount = STEPS.slice(0, step + 1).filter(s => s.action === 'solution').length

  function cellStyle(r, c) {
    const isQueen     = current.board[r][c] === 'Q'
    const isHighlight = current.highlight?.row === r && current.highlight?.col === c
    const isAttacked  = attacked[r][c]
    const isLight     = (r + c) % 2 === 0

    if (isQueen)                                              return 'bg-green-500 text-white'
    if (isHighlight && current.action === 'check_fail')       return 'bg-red-400 text-white'
    if (isHighlight && current.action === 'check_safe')       return 'bg-blue-400 text-white'
    if (isHighlight && current.action === 'remove')           return 'bg-red-200'
    if (isAttacked)                                           return isLight ? 'bg-orange-100' : 'bg-orange-200'
    return isLight ? 'bg-stone-100' : 'bg-stone-200'
  }

  function cellContent(r, c) {
    if (current.board[r][c] === 'Q') return '♛'
    if (current.highlight?.row === r && current.highlight?.col === c) {
      if (current.action === 'check_fail') return '✗'
      if (current.action === 'check_safe') return '?'
    }
    return ''
  }

  const cellSize = fullscreen ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 select-none">

      {/* Status bar */}
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium px-4 py-2 rounded-lg border ${ACTION_STYLE[current.action]}`}>
            {current.label}
          </div>
          <p className="text-xs font-mono text-stone-400 mt-1.5 pl-1">{current.code}</p>
        </div>
        <div className="text-right text-xs text-stone-400 shrink-0">
          <p>Step <span className="font-mono font-bold text-stone-600">{step + 1}</span> / {STEPS.length}</p>
          {solutionCount > 0 && (
            <p className="text-green-600 font-semibold mt-0.5">✓ {solutionCount} solution{solutionCount > 1 ? 's' : ''} found</p>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex justify-center mb-5">
        <div>
          {/* Col labels */}
          <div className="flex mb-1 pl-6">
            {Array.from({ length: N }, (_, c) => (
              <div key={c} className={`flex items-center justify-center text-xs text-stone-400 font-mono ${fullscreen ? 'w-20' : 'w-16'}`}>
                col {c}
              </div>
            ))}
          </div>
          <div className="flex">
            {/* Row labels */}
            <div className="flex flex-col">
              {Array.from({ length: N }, (_, r) => (
                <div key={r} className={`flex items-center justify-center text-xs text-stone-400 font-mono w-6 ${fullscreen ? 'h-20' : 'h-16'}`}>
                  {r}
                </div>
              ))}
            </div>
            {/* Grid */}
            <div className="border-2 border-stone-400 rounded overflow-hidden"
              style={{ display: 'grid', gridTemplateColumns: `repeat(${N}, ${fullscreen ? '80px' : '64px'})` }}>
              {Array.from({ length: N }, (_, r) =>
                Array.from({ length: N }, (_, c) => (
                  <div key={`${r}-${c}`}
                    className={`flex items-center justify-center font-bold transition-colors duration-150 ${cellSize} ${cellStyle(r, c)}`}>
                    {cellContent(r, c)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-stone-500 mb-5">
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-green-500 inline-block"/>Queen placed</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-blue-400 inline-block"/>Checking (safe)</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-red-400 inline-block"/>Checking (unsafe)</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-orange-200 inline-block"/>Attacked by queen</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setStep(0)} disabled={step === 0}
          className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg disabled:opacity-30 hover:border-stone-400 transition">
          ⏮
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="px-5 py-1.5 text-sm border border-stone-200 rounded-lg disabled:opacity-30 hover:border-stone-400 transition">
          ← Prev
        </button>
        <span className="text-xs text-stone-400 font-mono w-24 text-center">{step + 1} / {STEPS.length}</span>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
          className="px-5 py-1.5 text-sm bg-green-600 text-white rounded-lg disabled:opacity-30 hover:bg-green-700 transition">
          Next →
        </button>
        <button onClick={() => setStep(STEPS.length - 1)} disabled={step === STEPS.length - 1}
          className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg disabled:opacity-30 hover:border-stone-400 transition">
          ⏭
        </button>
      </div>

    </div>
  )
}

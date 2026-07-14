import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Roadmap from '../pages/Roadmap'
import Topic from '../pages/Topic'
import Problem from '../pages/Problem'
import { allProblems } from '../data/problems'
import { topicContent } from '../data/topicContent'

// Helper to render with router and params
function renderWithRoute(element, path, route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  )
}

// ─── ROADMAP ──────────────────────────────────────────────────────────────────

describe('Roadmap page', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Roadmap />
      </MemoryRouter>
    )
    expect(screen.getByText(/DSA Learning Roadmap/i)).toBeInTheDocument()
  })

  it('shows available topics', () => {
    render(
      <MemoryRouter>
        <Roadmap />
      </MemoryRouter>
    )
    expect(screen.getByText('Backtracking')).toBeInTheDocument()
    expect(screen.getByText('Dynamic Programming')).toBeInTheDocument()
  })
})

// ─── TOPIC PAGES ──────────────────────────────────────────────────────────────

describe('Topic pages', () => {
  Object.keys(topicContent).forEach(slug => {
    it(`/topic/${slug} renders without crashing`, () => {
      renderWithRoute(
        <Topic />,
        '/dehaaticoder/topic/:slug',
        `/dehaaticoder/topic/${slug}`
      )
      // page title should appear
      const content = topicContent[slug]
      expect(document.body.textContent).toContain(content.keyInsight.slice(0, 20))
    })
  })

  it('unknown topic slug shows not found', () => {
    renderWithRoute(
      <Topic />,
      '/dehaaticoder/topic/:slug',
      '/dehaaticoder/topic/does-not-exist'
    )
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})

// ─── PROBLEM PAGES ────────────────────────────────────────────────────────────

describe('Problem pages', () => {
  Object.keys(allProblems).forEach(slug => {
    it(`/problem/${slug} renders without crashing`, () => {
      renderWithRoute(
        <Problem />,
        '/dehaaticoder/problem/:slug',
        `/dehaaticoder/problem/${slug}`
      )
      const problem = allProblems[slug]
      expect(document.body.textContent).toContain(problem.title)
    })
  })

  it('unknown problem slug shows not found', () => {
    renderWithRoute(
      <Problem />,
      '/dehaaticoder/problem/:slug',
      '/dehaaticoder/problem/does-not-exist'
    )
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})

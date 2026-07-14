import { describe, it, expect } from 'vitest'
import { topics } from '../data/topics'
import { topicContent } from '../data/topicContent'
import { allProblems, problemsByTopic, problemCountByTopic } from '../data/problems'
import { cheatsheets } from '../data/cheatsheets'

// ─── 1. TOPICS ────────────────────────────────────────────────────────────────

describe('topics.js', () => {
  it('every topic has required fields', () => {
    topics.forEach(topic => {
      expect(topic.slug,        `${topic.slug} missing slug`).toBeTruthy()
      expect(topic.title,       `${topic.slug} missing title`).toBeTruthy()
      expect(topic.icon,        `${topic.slug} missing icon`).toBeTruthy()
      expect(topic.difficulty,  `${topic.slug} missing difficulty`).toBeTruthy()
      expect(topic.status,      `${topic.slug} missing status`).toBeTruthy()
      expect(topic.gaonKiBaat,  `${topic.slug} missing gaonKiBaat`).toBeTruthy()
    })
  })

  it('status is one of: available, coming-soon', () => {
    topics.forEach(topic => {
      expect(['available', 'coming-soon']).toContain(topic.status)
    })
  })

  it('every available topic has a topicContent entry', () => {
    topics.filter(t => t.status === 'available').forEach(topic => {
      expect(
        topicContent[topic.slug],
        `topic "${topic.slug}" is available but missing from topicContent.js`
      ).toBeDefined()
    })
  })
})

// ─── 2. TOPIC CONTENT ─────────────────────────────────────────────────────────

describe('topicContent.js', () => {
  Object.entries(topicContent).forEach(([slug, content]) => {
    describe(`topicContent["${slug}"]`, () => {
      it('has required fields', () => {
        expect(content.intro).toBeTruthy()
        expect(content.whyItWorks).toBeTruthy()
        expect(content.teachingFlow).toBeDefined()
        expect(content.keyInsight).toBeTruthy()
        expect(content.animations).toBeDefined()
        expect(content.commonMistakes).toBeDefined()
        expect(content.problems).toBeDefined()
      })

      it('every problem in problems list exists in allProblems', () => {
        content.problems.forEach(p => {
          expect(
            allProblems[p.slug],
            `topicContent["${slug}"].problems has slug "${p.slug}" but no matching problem file entry`
          ).toBeDefined()
        })
      })

      it('every animation file is .html not .mp4 or .gif', () => {
        content.animations.forEach(a => {
          expect(
            a.file.endsWith('.html'),
            `animation "${a.file}" in topic "${slug}" should be .html`
          ).toBe(true)
        })
      })
    })
  })
})

// ─── 3. PROBLEMS ──────────────────────────────────────────────────────────────

describe('problems data files', () => {
  Object.entries(allProblems).forEach(([slug, problem]) => {
    describe(`problem: "${slug}"`, () => {
      it('has required fields', () => {
        expect(problem.slug).toBe(slug)
        expect(problem.title).toBeTruthy()
        expect(problem.difficulty).toBeTruthy()
        expect(problem.topic).toBeTruthy()
        expect(problem.description).toBeTruthy()
        expect(problem.gaonKiBaat).toBeTruthy()
        expect(problem.examples?.length).toBeGreaterThan(0)
        expect(problem.hints?.length).toBeGreaterThan(0)
        expect(problem.approaches?.length).toBeGreaterThan(0)
        expect(problem.mistakes?.length).toBeGreaterThan(0)
      })

      it('difficulty is Easy, Medium, or Hard', () => {
        expect(['Easy', 'Medium', 'Hard']).toContain(problem.difficulty)
      })

      it('every relatedProblem slug exists in allProblems', () => {
        problem.relatedProblems?.forEach(relSlug => {
          expect(
            allProblems[relSlug],
            `problem "${slug}" has relatedProblem "${relSlug}" which does not exist`
          ).toBeDefined()
        })
      })

      it('every approach has required fields', () => {
        problem.approaches.forEach((approach, i) => {
          expect(approach.label, `approach ${i} in "${slug}" missing label`).toBeTruthy()
          expect(approach.tc,    `approach ${i} in "${slug}" missing tc`).toBeTruthy()
          expect(approach.sc,    `approach ${i} in "${slug}" missing sc`).toBeTruthy()
          expect(approach.code,  `approach ${i} in "${slug}" missing code`).toBeTruthy()
        })
      })

      it('every mistake has text and dehaati quote', () => {
        problem.mistakes.forEach((m, i) => {
          expect(m.text,  `mistake ${i} in "${slug}" missing text`).toBeTruthy()
          expect(m.quote, `mistake ${i} in "${slug}" missing quote`).toBeTruthy()
        })
      })
    })
  })
})

// ─── 4. PROBLEM COUNT ─────────────────────────────────────────────────────────

describe('problemCountByTopic', () => {
  it('matches actual problem count in each topic', () => {
    Object.entries(problemsByTopic).forEach(([topic, problems]) => {
      const actual = Object.keys(problems).length
      expect(problemCountByTopic[topic]).toBe(actual)
    })
  })
})

// ─── 5. CHEATSHEETS ───────────────────────────────────────────────────────────

describe('cheatsheets', () => {
  it('every cheatsheet topic has a matching topic slug', () => {
    const topicSlugs = topics.map(t => t.slug)
    Object.keys(cheatsheets).forEach(slug => {
      expect(topicSlugs).toContain(slug)
    })
  })
})

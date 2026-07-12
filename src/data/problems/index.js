import { backtrackingProblems } from './backtracking'

// Add new topic imports here as topics are built:
// import { linkedListProblems } from './linked-list'
// import { dpProblems } from './dp'

export const problemsByTopic = {
  backtracking: backtrackingProblems,
}

export const allProblems = Object.assign({}, ...Object.values(problemsByTopic))

export const problemCountByTopic = Object.fromEntries(
  Object.entries(problemsByTopic).map(([topic, problems]) => [topic, Object.keys(problems).length])
)

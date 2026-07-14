import { backtrackingProblems } from './backtracking'
import { dpProblems } from './dp'

// Add new topic imports here as topics are built:
// import { linkedListProblems } from './linked-list'

export const problemsByTopic = {
  backtracking: backtrackingProblems,
  dp: dpProblems,
}

export const allProblems = Object.assign({}, ...Object.values(problemsByTopic))

export const problemCountByTopic = Object.fromEntries(
  Object.entries(problemsByTopic).map(([topic, problems]) => [topic, Object.keys(problems).length])
)

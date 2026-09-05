import { backtrackingProblems } from './backtracking'
import { dpProblems } from './dp'
import { arraysProblems } from './arrays'

export const problemsByTopic = {
  backtracking: backtrackingProblems,
  dp: dpProblems,
  arrays: arraysProblems,
}

export const allProblems = Object.assign({}, ...Object.values(problemsByTopic))

export const problemCountByTopic = Object.fromEntries(
  Object.entries(problemsByTopic).map(([topic, problems]) => [topic, Object.keys(problems).length])
)

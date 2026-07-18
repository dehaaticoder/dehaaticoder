import CombinationSum2Visualizer from './CombinationSum2Visualizer'
import SubsetsVisualizer from './SubsetsVisualizer'
import StaircasePathsVisualizer from './StaircasePathsVisualizer'
import KthSymbolVisualizer from './KthSymbolVisualizer'
import GenerateParenthesesVisualizer from './GenerateParenthesesVisualizer'
import PermutationsVisualizer from './PermutationsVisualizer'
import SubsetSumKVisualizer from './SubsetSumKVisualizer'
import LetterCombinationsVisualizer from './LetterCombinationsVisualizer'
import CombinationSumVisualizer from './CombinationSumVisualizer'
import NQueensVisualizer from './NQueensVisualizer'
import HouseRobberVisualizer from './HouseRobberVisualizer'

// Registry: problem slug → visualizer component
// To add a new visualizer: create the component and add one line here. Zero changes to Problem.jsx.
const visualizers = {
  'combination-sum-2':    CombinationSum2Visualizer,
  'subsets':              SubsetsVisualizer,
  'staircase-paths':      StaircasePathsVisualizer,
  'kth-symbol':           KthSymbolVisualizer,
  'generate-parentheses': GenerateParenthesesVisualizer,
  'permutations':         PermutationsVisualizer,
  'subset-sum-k':         SubsetSumKVisualizer,
  'letter-combinations':  LetterCombinationsVisualizer,
  'combination-sum':      CombinationSumVisualizer,
  'n-queens':             NQueensVisualizer,
  'house-robber':         HouseRobberVisualizer,
}

export default visualizers

import { format } from 'date-fns'
import { DurationInput } from 'duration-fns'
import { asTree, TreeObject } from 'treeify'

import { Period, RequisiteChain } from './engine'

const str = {
  /**
   * String representation of a date.
   */
  date: (date?: Date) => (date ? format(date, 'yyyy-MM-dd') : ''),

  /**
   * String representation of a duratioon
   */
  duration: (duration: DurationInput) => JSON.stringify(duration),

  /**
   * String representation of an engine chain.
   */
  chain: (chain: RequisiteChain<unknown>) => {
    const group = 'any' in chain ? 'any' : 'all' in chain ? 'all' : null
    const executor = 'any' in chain || 'all' in chain ? null : chain.executor
    const prefix = group ? `[${group}] ` : ''
    const name = chain.title ?? chain.description ?? executor?.toString() ?? ''

    return `${(prefix + name).trim()}`
    // const result = str.results(chain.lastResult || []) || 'N'

    // return `${(prefix + name).trim()}: ${result}`
  },

  /**
   * String representation of one result.
   */
  result: ({ from, to }: Period) => `${str.date(from)}^${str.date(to)}`,

  /**
   * String representation of multiple results.
   */
  results: (results: Period[]) => results.map(str.result).join(', '),

  /**
   * String tree representation of an object.
   */
  tree: (object: TreeObject) => asTree(object, true, true),
}

export { str }

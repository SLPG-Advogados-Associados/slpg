import { Contribution } from '../../../../types'
import { min, max } from '../../../date'
import { TODAY } from '../../../const'

import { ParsedProcessors } from './processors'

/**
 * Create a contribution time splitter based on the passed middle-point date.
 */
const split = (date: Date) => (contribution: Contribution) => {
  const { start, end } = contribution

  // no split necessary:
  if (start >= date || (end && end <= date)) return [contribution]

  const left = { ...contribution, start, end: min([end || TODAY, date]) }
  const right = { ...contribution, start: max([start, date]), end }

  return [left, right]
}

/**
 * Split contributions based on processors.
 */
const parseContributions = (
  original: Contribution[],
  processors: ParsedProcessors
) =>
  processors
    // get every start/end date
    .reduce((carry, { start, end }) => [...carry, start, end], [] as Date[])
    .filter(Boolean)
    // create splitters based on each date
    .map(split)
    .reduce(
      // apply each splitter to all contributions
      (contributions, splitter) =>
        contributions.reduce(
          // split contributions, and assamble back into contributions array
          (carry, contribution) => [...carry, ...splitter(contribution)],
          [] as Contribution[]
        ),
      original
    )

export { split, parseContributions }

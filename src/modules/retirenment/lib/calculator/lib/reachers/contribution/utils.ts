import { Contribution } from '../../../types'
import { min, max } from '../../date'
import { TODAY } from '../../const'

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

export { split }

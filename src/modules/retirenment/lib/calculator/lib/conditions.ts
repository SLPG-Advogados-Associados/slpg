/* cspell: disable */
import { last, curry } from 'ramda'
import { add } from 'date-fns'
import { ConditionResult, Contribution } from '../types'

/**
 * Age condition factory.
 * @param due The due date.
 * @param years The age to reach by due date.
 */
const age = curry(
  (
    due: Date,
    years: number,
    input: { birthDate: Date }
  ): ConditionResult<{ reached: Date }> => {
    const reached = add(input.birthDate, { years })
    return [reached <= due, { reached }]
  }
)

/**
 * Last contribution min years condition.
 * @param due The due date.
 * @param years The years the last contribution must have by due date.
 */
const lastContributionDuration = curry(
  (due: Date, years: number, input: { contributions: Contribution[] }) => {
    const { start, end } = last(input.contributions)
    const reached = add(start, { years })
    return [reached <= due && (!end || reached <= end), { reached }]
  }
)

/**
 * Condition lib factory.
 * @param due Date to consider as due.
 */
const buildConditions = (due: Date) => ({
  age: age(due),
  lastContributionDuration: lastContributionDuration(due),
})

export { buildConditions }

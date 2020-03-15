/* cspell: disable */
import { last, curry } from 'ramda'
import { add } from 'date-fns'
import { between, sum, Duration } from 'duration-fns'
import { ConditionResult, Contribution } from '../types'

const today = new Date()

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
 * Full contribution min years condition.
 * @param due The due date.
 * @param years The combined duration years contributions must have by due date.
 */
const contributionDuration = curry(
  (
    due: Date | null,
    years: number,
    input: { contributions: Contribution[] }
  ) => {
    let reached: Date
    let duration = {} as Duration

    for (const { start, end = today } of input.contributions) {
      // sum up for the whole duration
      duration = sum(duration, between(start, end))

      // calculate reaching date, when it happens.
      if (!reached && duration.years >= years) {
        reached = add(end, { years: years - duration.years })
      }
    }

    return [
      // when no due, simply count current duration
      due ? reached <= due : duration.years >= years,
      { reached, duration },
    ]
  }
)

/**
 * Condition lib factory.
 * @param due Date to consider as due.
 */
const buildConditions = (due: Date) => ({
  age: age(due),
  lastContributionDuration: lastContributionDuration(due),
  contributionDuration: contributionDuration(due),
})

export { buildConditions }

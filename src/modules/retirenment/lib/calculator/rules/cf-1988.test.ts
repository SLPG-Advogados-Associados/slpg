import { Gender } from '../types'
import { conditions } from './cf-1988'
import { isEqual } from 'date-fns'

const { MALE, FEMALE } = Gender

/**
 * Generates a valid cf-1988 rule input.
 */
const getInput = (gender: Gender, birth: string, start: string) => ({
  gender,
  birthDate: new Date(birth),
  contribution: { start: new Date(start) },
})

/**
 * Factory for reached date matcher.
 */
const reachedAtFactory = condition => year => input =>
  isEqual(condition(input)[1].reached.getFullYear(), year)

describe('retirement/calculator/rules/cf-1998', () => {
  describe('conditions', () => {
    describe('a)', () => {
      const condition = conditions[0]
      const reachedAt = reachedAtFactory(condition)

      it('should check qualification', () => {
        // qualified
        expect(condition(getInput(MALE, '1940', '1960'))[0]).toEqual(true)
        expect(condition(getInput(FEMALE, '1940', '1965'))[0]).toEqual(true)
        // unqualified
        expect(condition(getInput(MALE, '1940', '1970'))[0]).toEqual(false)
        expect(condition(getInput(FEMALE, '1940', '1970'))[0]).toEqual(false)
      })

      it('should return correct reached date in context', () => {
        // male, contributed since 1960, reached in 35 years
        expect(getInput(MALE, '1940', '1960')).toSatisfy(reachedAt(1995))
        // female, contributed since 1965, reached in 30 years
        expect(getInput(FEMALE, '1940', '1965')).toSatisfy(reachedAt(1995))
        // male, contributed since 1970, reached in 35 years
        expect(getInput(MALE, '1940', '1970')).toSatisfy(reachedAt(2005))
        // female, contributed since 1970, reached in 30 years
        expect(getInput(FEMALE, '1940', '1970')).toSatisfy(reachedAt(2000))
      })
    })
  })
})

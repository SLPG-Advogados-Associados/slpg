/* cspell: disable */
import { Gender } from '../types'
import { conditions } from './cf-1988'
import { isEqual } from 'date-fns'

const { MALE: M, FEMALE: F } = Gender

/**
 * Generates a valid cf-1988 rule input.
 */
const getInput = (
  gender: Gender,
  birth: string,
  start: string,
  teacher: boolean
) => ({
  gender,
  teacher,
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
    /**
     * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
     * com proventos integrais;
     */
    describe('a)', () => {
      const condition = conditions[0]
      const reachedAt = reachedAtFactory(condition)

      it('should check qualification', () => {
        // male
        expect(condition(getInput(M, '1940', '1963', false))[0]).toEqual(true)
        expect(condition(getInput(M, '1940', '1964', false))[0]).toEqual(false)
        // female
        expect(condition(getInput(F, '1940', '1968', false))[0]).toEqual(true)
        expect(condition(getInput(F, '1940', '1969', false))[0]).toEqual(false)
      })

      it('should return correct reached date in context', () => {
        // male, contributed since 1960, reached in 35 years
        expect(getInput(M, '1940', '1960', false)).toSatisfy(reachedAt(1995))
        // male, contributed since 1970, reached in 35 years
        expect(getInput(M, '1940', '1970', false)).toSatisfy(reachedAt(2005))
        // female, contributed since 1965, reached in 30 years
        expect(getInput(F, '1940', '1965', false)).toSatisfy(reachedAt(1995))
        // female, contributed since 1970, reached in 30 years
        expect(getInput(F, '1940', '1975', false)).toSatisfy(reachedAt(2005))
      })
    })

    /**
     * b) aos trinta anos de efetivo exercício em funções de magistério, se
     * professor, e vinte e cinco, se professora, com proventos integrais;
     */
    describe('b)', () => {
      const condition = conditions[1]
      const reachedAt = reachedAtFactory(condition)

      it('should check qualification', () => {
        // male teacher
        expect(condition(getInput(M, '1940', '1968', true))[0]).toEqual(true)
        expect(condition(getInput(M, '1940', '1969', true))[0]).toEqual(false)
        // female teacher
        expect(condition(getInput(F, '1940', '1973', true))[0]).toEqual(true)
        expect(condition(getInput(F, '1940', '1974', true))[0]).toEqual(false)
        // non-teacher
        expect(condition(getInput(M, '1940', '1960', false))[0]).toEqual(false)
        expect(condition(getInput(F, '1940', '1960', false))[0]).toEqual(false)
      })

      it('should return correct reached date in context', () => {
        // male teacher, contributed since 1960, reached in 30 years
        expect(getInput(M, '1940', '1960', true)).toSatisfy(reachedAt(1990))
        // female teacher, contributed since 1965, reached in 30 years
        expect(getInput(F, '1940', '1965', true)).toSatisfy(reachedAt(1990))
        // male teacher, contributed since 1970, reached in 35 years
        expect(getInput(M, '1940', '1970', true)).toSatisfy(reachedAt(2000))
        // female teacher, contributed since 1970, reached in 30 years
        expect(getInput(F, '1940', '1970', true)).toSatisfy(reachedAt(1995))
      })
    })
  })
})

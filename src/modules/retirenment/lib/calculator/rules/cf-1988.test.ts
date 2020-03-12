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
      const hasIntegrality = input => condition(input)[1].integrality === true

      it('should check qualification', () => {
        // male
        expect(condition(getInput(M, '1940', '1962', false))[0]).toEqual(true)
        expect(condition(getInput(M, '1940', '1964', false))[0]).toEqual(false)
        // female
        expect(condition(getInput(F, '1940', '1967', false))[0]).toEqual(true)
        expect(condition(getInput(F, '1940', '1969', false))[0]).toEqual(false)
      })

      it('should return correct reached date in context', () => {
        // male, contributed since 1960, reached in 35 years
        expect(getInput(M, '1940', '1962', false)).toSatisfy(reachedAt(1997))
        // male, contributed since 1970, reached in 35 years
        expect(getInput(M, '1940', '1964', false)).toSatisfy(reachedAt(1999))
        // female, contributed since 1965, reached in 30 years
        expect(getInput(F, '1940', '1967', false)).toSatisfy(reachedAt(1997))
        // female, contributed since 1970, reached in 30 years
        expect(getInput(F, '1940', '1969', false)).toSatisfy(reachedAt(1999))
      })

      it('should represent integrality', () => {
        expect(getInput(M, '1940', '1962', false)).toSatisfy(hasIntegrality)
        expect(getInput(M, '1940', '1964', false)).toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1967', false)).toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1969', false)).toSatisfy(hasIntegrality)
      })
    })

    /**
     * b) aos trinta anos de efetivo exercício em funções de magistério, se
     * professor, e vinte e cinco, se professora, com proventos integrais;
     */
    describe('b)', () => {
      const condition = conditions[1]
      const reachedAt = reachedAtFactory(condition)
      const hasIntegrality = input => condition(input)[1].integrality === true

      it('should check qualification', () => {
        // male teacher
        expect(condition(getInput(M, '1940', '1967', true))[0]).toEqual(true)
        expect(condition(getInput(M, '1940', '1969', true))[0]).toEqual(false)
        // female teacher
        expect(condition(getInput(F, '1940', '1972', true))[0]).toEqual(true)
        expect(condition(getInput(F, '1940', '1974', true))[0]).toEqual(false)
        // non-teacher
        expect(condition(getInput(M, '1940', '1960', false))[0]).toEqual(false)
        expect(condition(getInput(F, '1940', '1960', false))[0]).toEqual(false)
      })

      it('should return correct reached date in context', () => {
        // male teacher, contributed since 1960, reached in 30 years
        expect(getInput(M, '1940', '1967', true)).toSatisfy(reachedAt(1997))
        // male teacher, contributed since 1970, reached in 30 years
        expect(getInput(M, '1940', '1969', true)).toSatisfy(reachedAt(1999))
        // female teacher, contributed since 1965, reached in 25 years
        expect(getInput(F, '1940', '1972', true)).toSatisfy(reachedAt(1997))
        // female teacher, contributed since 1970, reached in 25 years
        expect(getInput(F, '1940', '1974', true)).toSatisfy(reachedAt(1999))
      })

      it('should represent integrality', () => {
        expect(getInput(M, '1940', '1967', true)).toSatisfy(hasIntegrality)
        expect(getInput(M, '1940', '1969', true)).toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1972', true)).toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1974', true)).toSatisfy(hasIntegrality)
        expect(getInput(M, '1940', '1960', false)).toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1960', false)).toSatisfy(hasIntegrality)
      })
    })

    /**
     * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
     * com proventos proporcionais a esse tempo;
     */
    describe('c)', () => {
      const condition = conditions[2]
      const reachedAt = reachedAtFactory(condition)
      const hasIntegrality = input => condition(input)[1].integrality === true

      it('should check qualification', () => {
        // male
        expect(condition(getInput(M, '1940', '1967', false))[0]).toEqual(true)
        expect(condition(getInput(M, '1940', '1969', false))[0]).toEqual(false)
        // female
        expect(condition(getInput(F, '1940', '1972', false))[0]).toEqual(true)
        expect(condition(getInput(F, '1940', '1974', false))[0]).toEqual(false)
      })

      it('should return correct reached date in context', () => {
        // male, contributed since 1967, reached in 30 years
        expect(getInput(M, '1940', '1967', false)).toSatisfy(reachedAt(1997))
        // male, contributed since 1969, reached in 30 years
        expect(getInput(M, '1940', '1969', false)).toSatisfy(reachedAt(1999))
        // female, contributed since 1972, reached in 25 years
        expect(getInput(F, '1940', '1972', false)).toSatisfy(reachedAt(1997))
        // female, contributed since 1974, reached in 25 years
        expect(getInput(F, '1940', '1974', false)).toSatisfy(reachedAt(1999))
      })

      it('should represent integrality', () => {
        expect(getInput(M, '1940', '1972', false)).not.toSatisfy(hasIntegrality)
        expect(getInput(M, '1940', '1974', false)).not.toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1972', false)).not.toSatisfy(hasIntegrality)
        expect(getInput(F, '1940', '1974', false)).not.toSatisfy(hasIntegrality)
      })
    })
  })
})

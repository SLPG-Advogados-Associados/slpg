/* cspell: disable */
import { Gender } from '../types'
import { conditions, Rule1988CF } from './1988-cf'
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
 * Generate a cf-1988 rule instance.
 */
const getRule = (
  gender: Gender,
  birth: string,
  start: string,
  teacher: boolean
) => new Rule1988CF(getInput(gender, birth, start, teacher))

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
        expect(condition(getInput(M, '1940', '1962', false))[0]).toBe(true)
        expect(condition(getInput(M, '1940', '1964', false))[0]).toBe(false)
        // female
        expect(condition(getInput(F, '1940', '1967', false))[0]).toBe(true)
        expect(condition(getInput(F, '1940', '1969', false))[0]).toBe(false)
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
        expect(condition(getInput(M, '1940', '1967', true))[0]).toBe(true)
        expect(condition(getInput(M, '1940', '1969', true))[0]).toBe(false)
        // female teacher
        expect(condition(getInput(F, '1940', '1972', true))[0]).toBe(true)
        expect(condition(getInput(F, '1940', '1974', true))[0]).toBe(false)
        // non-teacher
        expect(condition(getInput(M, '1940', '1960', false))[0]).toBe(false)
        expect(condition(getInput(F, '1940', '1960', false))[0]).toBe(false)
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
        expect(condition(getInput(M, '1940', '1967', false))[0]).toBe(true)
        expect(condition(getInput(M, '1940', '1969', false))[0]).toBe(false)
        // female
        expect(condition(getInput(F, '1940', '1972', false))[0]).toBe(true)
        expect(condition(getInput(F, '1940', '1974', false))[0]).toBe(false)
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

    /**
     * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher,
     * com proventos proporcionais ao tempo de serviço.
     */
    describe('d)', () => {
      const condition = conditions[3]
      const reachedAt = reachedAtFactory(condition)
      const hasIntegrality = input => condition(input)[1].integrality === true

      it('should check qualification', () => {
        // male
        expect(condition(getInput(M, '1932', '1990', false))[0]).toBe(true)
        expect(condition(getInput(M, '1934', '1990', false))[0]).toBe(false)
        // female
        expect(condition(getInput(F, '1937', '1990', false))[0]).toBe(true)
        expect(condition(getInput(F, '1939', '1990', false))[0]).toBe(false)
      })

      it('should return correct reached date in context', () => {
        // male, born in 1932, reached in 65 years
        expect(getInput(M, '1932', '1990', false)).toSatisfy(reachedAt(1997))
        // male, born in 1934, reached in 65 years
        expect(getInput(M, '1934', '1990', false)).toSatisfy(reachedAt(1999))
        // female, born in 1937, reached in 60 years
        expect(getInput(F, '1937', '1990', false)).toSatisfy(reachedAt(1997))
        // female, born in 1939, reached in 60 years
        expect(getInput(F, '1939', '1990', false)).toSatisfy(reachedAt(1999))
      })

      it('should represent integrality', () => {
        expect(getInput(M, '1932', '1990', false)).not.toSatisfy(hasIntegrality)
        expect(getInput(M, '1934', '1990', false)).not.toSatisfy(hasIntegrality)
        expect(getInput(F, '1937', '1990', false)).not.toSatisfy(hasIntegrality)
        expect(getInput(F, '1939', '1990', false)).not.toSatisfy(hasIntegrality)
      })
    })
  })

  describe('rule', () => {
    it('should have statics', () => {
      expect(Rule1988CF).toHaveProperty('title')
      expect(Rule1988CF).toHaveProperty('description')
    })

    it('should be possible to instantiate rule', () => {
      const rule = getRule(M, '1950', '1990', false)
      expect(rule).toBeInstanceOf(Rule1988CF)
    })

    it('should be possible to check rule satisfaction result', () => {
      // satisfies a)
      expect(getRule(M, '1940', '1962', false).satisfied).toBe(true)
      expect(getRule(F, '1940', '1967', false).satisfied).toBe(true)
      // satisfies b)
      expect(getRule(M, '1940', '1967', true).satisfied).toBe(true)
      expect(getRule(F, '1940', '1972', true).satisfied).toBe(true)
      // satisfies c)
      expect(getRule(M, '1940', '1967', false).satisfied).toBe(true)
      expect(getRule(F, '1940', '1972', false).satisfied).toBe(true)
      // satisfies d)
      expect(getRule(M, '1932', '1990', false).satisfied).toBe(true)
      expect(getRule(F, '1937', '1990', false).satisfied).toBe(true)
      // satisfies none
      expect(getRule(M, '1934', '1980', false).satisfied).toBe(false)
      expect(getRule(F, '1939', '1980', false).satisfied).toBe(false)
      expect(getRule(M, '1940', '1969', false).satisfied).toBe(false)
      expect(getRule(M, '1940', '1969', true).satisfied).toBe(false)
      expect(getRule(F, '1940', '1974', false).satisfied).toBe(false)
      expect(getRule(F, '1940', '1974', true).satisfied).toBe(false)
    })
  })
})

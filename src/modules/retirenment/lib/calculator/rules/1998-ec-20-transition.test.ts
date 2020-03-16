/* cspell: disable */
import { Gender, Post, ServiceKind } from '../types'
import { conditions } from './1998-ec-20-transition'

const { MALE: M, FEMALE: F } = Gender

/**
 * Generates a valid cf-1988 rule input.
 */
const getInput = (
  gender: Gender,
  birth: string,
  contributions: [string, string?, number?, boolean?][]
  // teacher: boolean
) => ({
  gender,
  // teacher,
  birthDate: new Date(birth),
  contributions: contributions.map(
    ([start, end, salary = 1000, teacher = false]) => ({
      salary,
      service: {
        kind: ServiceKind.PUBLIC,
        post: teacher ? Post.TEACHER : Post.OTHER,
      },
      start: new Date(start),
      end: end ? new Date(end) : undefined,
    })
  ),
})

describe('retirement/calculator/rules/1998-ec-20-transition', () => {
  describe('conditions', () => {
    /**
     * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
     * com proventos integrais;
     */
    describe('main', () => {
      const condition = conditions[0]
      // const reachedAt = reachedAtFactory(condition)
      // const hasIntegrality = input => condition(input)[1].integrality === true

      it.each([
        // male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [getInput(M, '1949', [['1967', '1977'], ['1977']]), true],
        // male, 52 ❌, contributing 36 ✅, last more than 5 ✅
        [getInput(M, '1951', [['1967', '1977'], ['1977']]), false],
        // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
        [getInput(M, '1949', [['1967', '1977'], ['1979']]), false],
        // male, 54 ✅, contributing 36 ✅, last less than 5 ❌
        [getInput(M, '1949', [['1967', '2000'], ['2000']]), false],

        // female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [getInput(F, '1954', [['1972', '1977'], ['1977']]), true],
        // female, 47 ❌, contributing 31 ✅, last more than 5 ✅
        [getInput(F, '1956', [['1972', '1977'], ['1977']]), false],
        // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
        [getInput(F, '1954', [['1972', '1977'], ['1979']]), false],
        // female, 49 ✅, contributing 31 ✅, last less than 5 ❌
        [getInput(F, '1954', [['1972', '2000'], ['2000']]), false],
      ])('should check qualification', (input, satisfied) => {
        expect(condition(input)[0]).toBe(satisfied)
      })
    })
  })
})

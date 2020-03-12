import { Gender } from '../types'
import { conditions } from './cf-1988'

const { MALE, FEMALE } = Gender

describe('retirement/calculator/rules/cf-1998', () => {
  const getInput = (gender: Gender, birth: string, start: string) => ({
    gender,
    birthDate: new Date(birth),
    contribution: { start: new Date(start) },
  })

  describe('conditions', () => {
    describe('a)', () => {
      const condition = conditions[0]

      it('should check qualification', () => {
        // qualified
        expect(condition(getInput(MALE, '1940', '1960'))[0]).toEqual(true)
        expect(condition(getInput(FEMALE, '1940', '1965'))[0]).toEqual(true)
        // unqualified
        expect(condition(getInput(MALE, '1940', '1970'))[0]).toEqual(false)
        expect(condition(getInput(FEMALE, '1940', '1970'))[0]).toEqual(false)
      })

      describe('context', () => {
        it('should return reached date in context', () => {
          // male, contributed since 1960, reached in 35 years
          expect(
            condition(getInput(MALE, '1940', '1960'))[1].reached.getFullYear()
          ).toBe(1995)

          // female, contributed since 1965, reached in 30 years
          expect(
            condition(getInput(FEMALE, '1940', '1965'))[1].reached.getFullYear()
          ).toBe(1995)

          // male, contributed since 1970, reached in 35 years
          expect(
            condition(getInput(MALE, '1940', '1970'))[1].reached.getFullYear()
          ).toBe(2005)

          // female, contributed since 1970, reached in 30 years
          expect(
            condition(getInput(FEMALE, '1940', '1970'))[1].reached.getFullYear()
          ).toBe(2000)
        })
      })
    })
  })
})

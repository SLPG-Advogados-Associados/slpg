import { Gender } from '../types'
import { conditions, Input } from './cf-1988'

interface InputMap {
  [key: string]: { [key: string]: Input }
}

describe('retirement/calculator/rules/cf-1998', () => {
  describe('conditions', () => {
    describe('a)', () => {
      const condition = conditions[0]

      const cases: InputMap = {
        qualified: {
          male: {
            gender: Gender.MALE,
            birthDate: new Date('1940'),
            contribution: { start: new Date('1960') },
          },

          female: {
            gender: Gender.FEMALE,
            birthDate: new Date('1940'),
            contribution: { start: new Date('1965') },
          },
        },

        unqualified: {
          male: {
            gender: Gender.MALE,
            birthDate: new Date('1940'),
            contribution: { start: new Date('1970') },
          },

          female: {
            gender: Gender.FEMALE,
            birthDate: new Date('1940'),
            contribution: { start: new Date('1970') },
          },
        },
      }

      it('should check qualification', () => {
        // qualified
        expect(condition(cases.qualified.male)[0]).toEqual(true)
        expect(condition(cases.qualified.female)[0]).toEqual(true)
        // unqualified
        expect(condition(cases.unqualified.male)[0]).toEqual(false)
        expect(condition(cases.unqualified.female)[0]).toEqual(false)
      })

      describe('context', () => {
        it('should return reached date in context', () => {
          // male, contributed since 1960, reached in 35 years
          expect(condition(cases.qualified.male)[1].reached.getFullYear()).toBe(
            1995
          )

          // female, contributed since 1965, reached in 30 years
          expect(
            condition(cases.qualified.female)[1].reached.getFullYear()
          ).toBe(1995)

          // male, contributed since 1970, reached in 35 years
          expect(
            condition(cases.unqualified.male)[1].reached.getFullYear()
          ).toBe(2005)

          // female, contributed since 1970, reached in 30 years
          expect(
            condition(cases.unqualified.female)[1].reached.getFullYear()
          ).toBe(2000)
        })
      })
    })
  })
})

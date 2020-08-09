import { c, d, u } from '../lib/test-utils'
import { Sex, Contribution, Post } from '../types'
import { rule } from './1988-cf.engine'

const { TEACHER: T } = Post
const { MALE: M, FEMALE: F } = Sex

describe('retirement/calculator/rules/cf-1988.engine', () => {
  describe('possibilities', () => {
    const [integral, proportional] = rule.possibilities

    const i = (
      sex: Sex,
      contributions: Contribution[],
      birthDate: Date = new Date('1940')
    ) => ({
      sex,
      birthDate,
      contributions,
    })

    const r = (
      satisfied: boolean,
      satisfiedAt?: string,
      satisfiable?: boolean,
      satisfiableAt?: string
    ) => ({
      satisfied,
      satisfiedAt: typeof satisfiedAt === 'string' ? d(satisfiedAt) : u,
      satisfiable,
      satisfiableAt: typeof satisfiableAt === 'string' ? d(satisfiableAt) : u,
    })

    describe('integral', () => {
      it.each([
        [i(M, [c('60')]), r(true, '1994-12-23', true, '1994-12-23')], //          male, 38/00, general ✅, teacher ❌ (in valid period)
        [i(M, [c('65')]), r(false, u, true, '1999-12-24')], //                    male, 33/00, general ❌, teacher ❌ (in valid period)
        [i(M, [c('65', [u, T])]), r(true, '1994-12-25', true, '1994-12-25')], //  male, 33/30, general ❌, teacher ✅ (in valid period)
        [i(M, [c('70', [u, T])]), r(false, u, true, '1999-12-25')], //            male, 28/28, general ❌, teacher ❌ (after valid period)
        [i(M, [c('60', [u, T])]), r(true, '1989-12-24', true, '1989-12-24')], //  male, 30/30, general ✅, teacher ✅ (in valid period)

        [i(F, [c('65')]), r(true, '1994-12-25', true, '1994-12-25')], //          female, 33/00, general ✅, teacher ❌ (in valid period)
        [i(F, [c('70')]), r(false, u, true, '1999-12-25')], //                    female, 28/00, general ❌, teacher ❌ (in valid period)
        [i(F, [c('70', [u, T])]), r(true, '1994-12-26', true, '1994-12-26')], //  female, 28/25, general ❌, teacher ✅ (in valid period)
        [i(F, [c('75', [u, T])]), r(false, u, true, '1999-12-26')], //            female, 28/28, general ❌, teacher ❌ (after valid period)
        [i(F, [c('65', [u, T])]), r(true, '1989-12-26', true, '1989-12-26')], //  female, 25/25, general ✅, teacher ✅ (in valid period)
      ])('should calculate possibility result', (input, expected) => {
        const result = integral.requisites.execute(input)
        expect(result).toMatchObject(expected)
      })
    })

    describe('proportional', () => {
      it.each([
        [i(M, [c('65')], d('50')), r(true, '1994-12-25', true, '1994-12-25')], //   male, 30/48, general ✅, age ❌ (in valid period)
        [i(M, [c('70')], d('50')), r(false, u, true, '1999-12-25')], //             male, 28/48, general ❌, age ❌ (in valid period)
        [i(M, [c('70')], d('30')), r(true, '1995-01-01', true, '1999-12-25')], //   male, 28/65, general ❌, age ✅ (in valid period)
        [i(M, [c('68')], d('30')), r(true, '1995-01-01', true, '1997-12-24')], //   male, 30/65, general ✅, age ✅ (in valid period)

        [i(F, [c('70')], d('55')), r(true, '1994-12-26', true, '1994-12-26')], //   female, 25/43, general ✅, age ❌ (in valid period)
        [i(F, [c('75')], d('55')), r(false, u, true, '1999-12-26')], //             female, 23/43, general ❌, age ❌ (in valid period)
        [i(F, [c('75')], d('35')), r(true, '1995-01-01', true, '1999-12-26')], //   female, 23/60, general ❌, age ✅ (in valid period)
        [i(F, [c('73')], d('35')), r(true, '1995-01-01', true, '1997-12-26')], //   female, 25/60, general ✅, age ✅ (in valid period)
      ])('should calculate possibility result', (input, expected) => {
        const result = proportional.requisites.execute(input)
        expect(result).toMatchObject(expected)
      })
    })
  })
})

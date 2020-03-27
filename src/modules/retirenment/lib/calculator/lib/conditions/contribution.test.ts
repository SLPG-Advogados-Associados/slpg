/* cspell: disable */
import { sum, normalize } from 'duration-fns'
import { Contribution } from '../../types'
import { d, c, reachedAt } from '../test-utils'

// @ts-ignore
import { last, total, __set__ } from './contribution'

describe('retirement/calculator/lib/conditions/contribution', () => {
  beforeEach(() => __set__('TODAY', d('2020')))

  describe('last', () => {
    const i = (...contributions: Contribution[]) => ({ contributions })

    it.each([
      [d('2000'), 10, i(c('1980')), true], //                       ✅ 20 of 10, from start to due
      [d('2000'), 20, i(c('1980')), true], //                       ✅ 20 of 20, from start to due (single)
      [d('2000'), 20, i(c('1950^1975'), c('1980')), true], //       ✅ 20 of 20, from start to due (multi)
      [d('2000'), 10, i(c('1970^1990')), true], //                  ✅ 20 of 10, from start to end (single)
      [d('2000'), 10, i(c('1950^1975'), c('1970^1990')), true], //  ✅ 20 of 10, from start to end (multi)
      [d('2000'), 20, i(c('1950^1975'), c('1970^1990')), true], //  ✅ 20 of 20, from start to end (multi)
      [d('2000'), 20, i(c('1981')), false], //                      ❌ 19 of 20, from start to due (single)
      [d('2000'), 20, i(c('1950^1975'), c('1981')), false], //      ❌ 19 of 20, from start to due (multi)
      [d('2000'), 20, i(c('1980^1990')), false], //                 ❌ 10 of 20, from start to end (single)
      [d('2000'), 20, i(c('1950^1975'), c('1980^1990')), false], // ❌ 10 of 20, from start to end (multi)
    ] as const)('should check qualify', (due, years, input, expected) => {
      expect(last(due)({ years })(input)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 10, i(c('1980'))], 1990], // reached 10 from 1980
      [[d('2000'), 30, i(c('1980'))], 2010], // reached 30 from 1980
      [[d('2000'), 10, i(c('1960^1970'), c('1980'))], 1990], // reached 10 from 1980
      [[d('2000'), 30, i(c('1960^1970'), c('1980'))], 2010], // reached 30 from 1980
    ] as const)('should check reached', ([due, years, input], expected) => {
      expect(last(due)({ years })(input)).toSatisfy(reachedAt(expected))
    })
  })

  describe('total', () => {
    const i = (...contributions: Contribution[]) => ({ contributions })

    it.each([
      [[d('2000'), 20, i(c('1970^1990'))], true], //                  ✅ 20 years, single, before due
      [[d('2000'), 20, i(c('1960^1965'), c('1970^1985'))], true], //  ✅ 20 years, double, before due
      [[d('2000'), 20, i(c('1970'))], true], //                       ✅ 20+ years, single, before due
      [[d('2000'), 20, i(c('1980^1990'))], false], //                 ❌ only 10 years, single, before due
      [[d('2000'), 20, i(c('1960^1965'), c('1970^1975'))], false], // ❌ only 10 years, double, before due
      [[d('2000'), 20, i(c('1990'))], false], //                      ❌ 20+ years, single, but after due
      [[d('2000'), 20, i(c('1990^1995'), c('2000'))], false], //      ❌ 20+ years, double, but after due

      // no due date, today is due date.
      [[null, 20, i(c('1990'))], true], //  20+ years by today
      [[null, 20, i(c('2010'))], false], // -20 years by today
    ] as const)('should check qualify', ([due, years, input], expected) => {
      expect(total(due)({ years })(input)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 20, i(c('1980'))], 2000, 40], // reached 20 at 2000, has currently 40
      [[d('2000'), 20, i(c('1990'))], 2010, 30], // reached 20 at 2010, has currently 30
      [[d('2000'), 20, i(c('1970^1995'))], 1990, 25], // reached 20 at 1990, has currently 25 (stopped)
      [[d('2000'), 20, i(c('1970^1980'), c('1985'))], 1995, 45], // reached 20 at 1995, has currently 45
    ] as const)('should check context', (item, reached, duration) => {
      const [due, years, input] = item
      const result = total(due)({ years })(input)

      expect(result).toSatisfy(reachedAt(reached))
      expect(result).toHaveProperty('1.durations.processed.years', duration)
    })

    describe('process', () => {
      it.each([
        [c('1991'), true, 2000], //  ✅ 9 of real duration, +1, reached on 2000
        [c('1992'), false, 2001], // ❌ 8 of real duration, +1, reached on 1990
      ] as const)(
        'should be possible to increment duration on processor',
        (input, satisfied, reached) => {
          const processor = duration => normalize(sum(duration, { years: 1 }))
          const cond = total(d('2000'))
          const duration = { years: 10 }
          const result = cond(duration, processor)({ contributions: [input] })

          expect(result[0]).toBe(satisfied)
          expect(result).toSatisfy(reachedAt(reached))
        }
      )
    })
  })
})

/* cspell: disable */
import { isValid } from 'date-fns'
import { sum, normalize } from 'duration-fns'
import { Condition, Contribution } from '../types'
import { d, b, c, reachedAt } from './test-utils'

import {
  age,
  contribution,
  merge,
  // @ts-ignore
  __set__,
} from './conditions'

describe('retirement/calculator/lib/conditions', () => {
  // beforeEach(() => __set__('TODAY', d('2020')))

  describe('age', () => {
    it.each([
      [[d('2000'), 50, b('1940')], true], //   ✅ 50+ by 2000
      [[d('2000'), 50, b('1950')], true], //   ✅ 50 by 2000
      [[d('2000'), 50, b('1960')], false], //  ❌ 40 by 2000
      [[d('2000'), 30, b('1960')], true], //   ✅ 40 by 2000
      [[d('2000'), 30, b('1970')], true], //   ✅ 30 by 2000
      [[d('2000'), 30, b('1980')], false], //  ❌ 20 by 2000
    ] as const)('should correctly qualify', ([due, years, input], expected) => {
      expect(age(due)(years)(input)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 50, b('1940')], 1990], // reached 50 yo from 1940
      [[d('2000'), 20, b('1940')], 1960], // reached 20 yo from 1940
    ] as const)('should reach correctly', ([due, years, input], expected) => {
      expect(age(due)(years)(input)).toSatisfy(reachedAt(expected))
    })
  })

  describe('contribution', () => {
    describe('last', () => {
      const i = (...contributions: Contribution[]) => ({ contributions })

      it.each([
        [[d('2000'), 10, i(c('1980'))], true], //                       ✅ 20 of 10, from start to due
        [[d('2000'), 20, i(c('1980'))], true], //                       ✅ 20 of 20, from start to due (single)
        [[d('2000'), 20, i(c('1950^1975'), c('1980'))], true], //       ✅ 20 of 20, from start to due (multi)
        [[d('2000'), 10, i(c('1970^1990'))], true], //                  ✅ 20 of 10, from start to end (single)
        [[d('2000'), 10, i(c('1950^1975'), c('1970^1990'))], true], //  ✅ 20 of 10, from start to end (multi)
        [[d('2000'), 20, i(c('1950^1975'), c('1970^1990'))], true], //  ✅ 20 of 20, from start to end (multi)
        [[d('2000'), 20, i(c('1981'))], false], //                      ❌ 19 of 20, from start to due (single)
        [[d('2000'), 20, i(c('1950^1975'), c('1981'))], false], //      ❌ 19 of 20, from start to due (multi)
        [[d('2000'), 20, i(c('1980^1990'))], false], //                 ❌ 10 of 20, from start to end (single)
        [[d('2000'), 20, i(c('1950^1975'), c('1980^1990'))], false], // ❌ 10 of 20, from start to end (multi)
      ] as const)('should check qualify', ([due, years, input], expected) => {
        expect(contribution.last(due)(years)(input)[0]).toBe(expected)
      })

      it.each([
        [[d('2000'), 10, i(c('1980'))], 1990], // reached 10 from 1980
        [[d('2000'), 30, i(c('1980'))], 2010], // reached 30 from 1980
        [[d('2000'), 10, i(c('1960^1970'), c('1980'))], 1990], // reached 10 from 1980
        [[d('2000'), 30, i(c('1960^1970'), c('1980'))], 2010], // reached 30 from 1980
      ] as const)('should check reached', ([due, years, input], expected) => {
        expect(contribution.last(due)(years)(input)).toSatisfy(
          reachedAt(expected)
        )
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
        expect(contribution.total(due)(years)(input)[0]).toBe(expected)
      })

      it.each([
        [[d('2000'), 20, i(c('1980'))], 2000, 40], // reached 20 at 2000, has currently 40
        [[d('2000'), 20, i(c('1990'))], 2010, 30], // reached 20 at 2010, has currently 30
        [[d('2000'), 20, i(c('1970^1995'))], 1990, 25], // reached 20 at 1990, has currently 25 (stopped)
        [[d('2000'), 20, i(c('1970^1980'), c('1985'))], 1995, 45], // reached 20 at 1995, has currently 45
      ] as const)('should check context', (item, reached, duration) => {
        const [due, years, input] = item
        const result = contribution.total(due)(years)(input)

        expect(result).toSatisfy(reachedAt(reached))
        expect(result).toHaveProperty('1.duration.processed.years', duration)
      })

      describe('process', () => {
        it.each([
          [c('1991'), true, 2000], //  ✅ 9 of real duration, +1, reached on 2000
          [c('1992'), false, 2001], // ❌ 8 of real duration, +1, reached on 1990
        ] as const)(
          'should be possible to increment duration on processor',
          (input, satisfied, reached) => {
            const processor = duration => normalize(sum(duration, { years: 1 }))
            const cond = contribution.total(d('2000'))
            const result = cond(10, processor)({ contributions: [input] })

            expect(result[0]).toBe(satisfied)
            expect(result).toSatisfy(reachedAt(reached))
          }
        )
      })
    })
  })

  describe('merge', () => {
    type CondsDictiorary = { [key: string]: { [key: string]: Condition } }
    const { all } = merge

    const conds: CondsDictiorary = {
      pass: {
        on1990: () => [true, { reached: d('1990') }],
        on2000: () => [true, { reached: d('2000') }],
      },
      fail: {
        on1995: () => [false, { reached: d('1995') }],
        on2005: () => [false, { reached: d('2005') }],
      },
    }

    describe('all', () => {
      it('should merge multiple conditions', () => {
        expect(all([])).toBeFunction()
        expect(all([conds.pass.on1990])).toBeFunction()
        expect(all([conds.pass.on1990, conds.pass.on2000])).toBeFunction()
      })

      it('should handle empty condition set', () => {
        const [satisfied, { reached }] = all([])({})
        expect(satisfied).toBe(true)
        expect(reached).toBeInstanceOf(Date)
        expect(reached).not.toSatisfy(isValid)
      })

      it('should have same result for single condition', () => {
        const left = all([conds.pass.on1990])({})
        const right = conds.pass.on1990({})
        expect(left).toMatchObject(right)
      })

      it.each([
        [all([conds.pass.on1990]), true], //                      ✅ single one (pass.on1990) succeded
        [all([conds.pass.on1990, conds.pass.on2000]), true], //   ✅ both (pass.on1990, pass.on2000) succeded
        [all([conds.pass.on1990, conds.fail.on2005]), false], //  ❌ one (fail.on2005) fails
        [all([conds.fail.on1995, conds.fail.on2005]), false], //  ❌ both (fail.on1995, fail.on2005) fails
      ])('should only satisfy if all satisfy', (cond, satisfied) => {
        expect(cond({})[0]).toBe(satisfied)
      })

      it.each([
        [all([conds.pass.on1990]), 1990],
        [all([conds.pass.on2000]), 2000],
        [all([conds.pass.on1990, conds.pass.on2000]), 2000],
        [all([conds.pass.on1990, conds.pass.on2000]), 2000],
        [all([conds.pass.on1990, conds.pass.on2000]), 2000],
        [all([conds.pass.on1990, conds.fail.on2005]), 2005],
        [all([conds.fail.on1995, conds.fail.on2005]), 2005],
        [all([conds.fail.on2005, conds.fail.on1995]), 2005],
      ])('should reach on latest reach, even failed ones', (cond, year) => {
        expect(cond({})).toSatisfy(reachedAt(year))
      })
    })
  })
})

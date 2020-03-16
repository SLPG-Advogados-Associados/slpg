/* cspell: disable */
import { isValid } from 'date-fns'
// @ts-ignore
import {
  age,
  lastContributionDuration,
  totalContributionDuration,
  merge,
} from './conditions'

import { Condition, Contribution } from '../types'

// @ts-ignore
// Shorter Date factory.
const d = (...args) => new Date(...args)

/**
 * Predicate factory for context.reached date year comparison.
 * @param year Year in number format.
 */
const reachedAt = year => ([, { reached }]) => reached.getFullYear() === year

describe('retirement/calculator/lib/conditions', () => {
  describe('age', () => {
    const getInput = (birthDate: string) => ({ birthDate: d(birthDate) })

    it.each([
      [[d('2000'), 50, getInput('1940')], true], //   ✅ 50+ by 2000
      [[d('2000'), 50, getInput('1950')], true], //   ✅ 50 by 2000
      [[d('2000'), 50, getInput('1960')], false], //  ❌ 40 by 2000
      [[d('2000'), 30, getInput('1960')], true], //   ✅ 40 by 2000
      [[d('2000'), 30, getInput('1970')], true], //   ✅ 30 by 2000
      [[d('2000'), 30, getInput('1980')], false], //  ❌ 20 by 2000
    ])('should correctly qualify', (args, expected) => {
      expect(age(...args)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 50, getInput('1940')], 1990], // reached 50 yo from 1940
      [[d('2000'), 20, getInput('1940')], 1960], // reached 20 yo from 1940
    ])('should return "reached" context', (args, expected) => {
      expect(age(...args)).toSatisfy(reachedAt(expected))
    })
  })

  describe('lastContributionDuration', () => {
    const getInput = (...spans: [string, string?][]) => ({
      contributions: spans.map(
        ([start, end]) =>
          ({
            start: d(start),
            end: end ? d(end) : undefined,
          } as Contribution)
      ),
    })

    it.each([
      [[d('2000'), 10, getInput(['1980'])], true], //                             ✅ 20 of 10, from start to due
      [[d('2000'), 20, getInput(['1980'])], true], //                             ✅ 20 of 20, from start to due (single)
      [[d('2000'), 20, getInput(['1950', '1975'], ['1980'])], true], //           ✅ 20 of 20, from start to due (multi)
      [[d('2000'), 10, getInput(['1970', '1990'])], true], //                     ✅ 20 of 10, from start to end (single)
      [[d('2000'), 10, getInput(['1950', '1975'], ['1970', '1990'])], true], //   ✅ 20 of 10, from start to end (multi)
      [[d('2000'), 20, getInput(['1950', '1975'], ['1970', '1990'])], true], //   ✅ 20 of 20, from start to end (multi)
      [[d('2000'), 20, getInput(['1981'])], false], //                            ❌ 19 of 20, from start to due (single)
      [[d('2000'), 20, getInput(['1950', '1975'], ['1981'])], false], //          ❌ 19 of 20, from start to due (multi)
      [[d('2000'), 20, getInput(['1980', '1990'])], false], //                    ❌ 10 of 20, from start to end (single)
      [[d('2000'), 20, getInput(['1950', '1975'], ['1980', '1990'])], false], //  ❌ 10 of 20, from start to end (multi)
    ])('should correctly qualify', (args, expected) => {
      expect(lastContributionDuration(...args)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 10, getInput(['1980'])], 1990], // reached 10 from 1980
      [[d('2000'), 30, getInput(['1980'])], 2010], // reached 30 from 1980
      [[d('2000'), 10, getInput(['1960', '1970'], ['1980'])], 1990], // reached 10 from 1980
      [[d('2000'), 30, getInput(['1960', '1970'], ['1980'])], 2010], // reached 30 from 1980
    ])('should return "reached" context', (input, expected) => {
      expect(lastContributionDuration(...input)).toSatisfy(reachedAt(expected))
    })
  })

  describe('totalContributionDuration', () => {
    const getInput = (...spans) => ({
      contributions: spans.map(([start, end]) => ({
        start: d(start),
        end: end ? d(end) : undefined,
      })),
    })

    it.each([
      [[d('2000'), 20, getInput(['1970', '1990'])], true], //                     ✅ 20 years, single, before due
      [[d('2000'), 20, getInput(['1960', '1965'], ['1970', '1985'])], true], //   ✅ 20 years, double, before due
      [[d('2000'), 20, getInput(['1970'])], true], //                             ✅ 20+ years, single, before due
      [[d('2000'), 20, getInput(['1980', '1990'])], false], //                    ❌ only 10 years, single, before due
      [[d('2000'), 20, getInput(['1960', '1965'], ['1970', '1975'])], false], //  ❌ only 10 years, double, before due
      [[d('2000'), 20, getInput(['1990'])], false], //                            ❌ 20+ years, single, but after due
      [[d('2000'), 20, getInput(['1990', '1995'], ['2000'])], false], //          ❌ 20+ years, double, but after due

      // no due date, today is due date.
      [[null, 20, getInput(['1990'])], true], //  20+ years by today
      [[null, 20, getInput(['2010'])], false], // -20 years by today
    ])('should correctly qualify', (args, expected) => {
      expect(totalContributionDuration(...args)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 20, getInput(['1980'])], 2000, 40], // reached 20 at 2000, has currently 40
      [[d('2000'), 20, getInput(['1990'])], 2010, 30], // reached 20 at 2010, has currently 30
      [[d('2000'), 20, getInput(['1970', '1995'])], 1990, 25], // reached 20 at 1990, has currently 25 (stopped)
      [[d('2000'), 20, getInput(['1970', '1980'], ['1985'])], 1995, 45], // reached 20 at 1995, has currently 45
    ])('should return context', (args, expected, durationInYears) => {
      const result = totalContributionDuration(...args)
      expect(result).toSatisfy(reachedAt(expected))
      expect(result).toHaveProperty('1.duration.years', durationInYears)
    })
  })

  describe('merge', () => {
    type CondsDictiorary = { [key: string]: { [key: string]: Condition } }
    const { all } = merge

    const conds: CondsDictiorary = {
      pass: {
        on1990: () => [true, { reached: new Date('1990') }],
        on2000: () => [true, { reached: new Date('2000') }],
      },
      fail: {
        on1995: () => [false, { reached: new Date('1995') }],
        on2005: () => [false, { reached: new Date('2005') }],
      },
    }

    describe('all', () => {
      it('should merge multiple conditions', () => {
        expect(all([])).toBeFunction()
        expect(all([conds.pass.on1990])).toBeFunction()
        expect(all([conds.pass.on1990, conds.pass.on2000])).toBeFunction()
      })

      it('should handle empty condition set', () => {
        const [satisfied, { reached }] = all([], {})
        expect(satisfied).toBe(true)
        expect(reached).toBeInstanceOf(Date)
        expect(reached).not.toSatisfy(isValid)
      })

      it('should have same result for single condition', () => {
        const left = all([conds.pass.on1990], {})
        const right = conds.pass.on1990({})
        expect(left).toMatchObject(right)
      })

      it.each([
        [all([conds.pass.on1990]), true],
        [all([conds.pass.on1990, conds.pass.on2000]), true],
        [all([conds.pass.on1990, conds.fail.on2005]), false],
        [all([conds.fail.on1995, conds.fail.on2005]), false],
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
      ])('should reach on latest reach, even failed ones', (cond, year) => {
        expect(cond({})).toSatisfy(reachedAt(year))
      })
    })
  })
})

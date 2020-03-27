/* cspell: disable */
import { isValid } from 'date-fns'
import { Condition } from '../../types'
import { d, b, reachedAt } from '../test-utils'

// @ts-ignore
import { age, merge, contribution, __set__ } from '.'

describe('retirement/calculator/lib/conditions', () => {
  beforeEach(() => __set__('TODAY', d('2020')))

  describe('contribution', () => {
    it('should exposed contribution based conditions', () => {
      expect(contribution).toHaveProperty('last')
      expect(contribution).toHaveProperty('total')
    })
  })

  describe('age', () => {
    it.each([
      [[d('2000'), 50, b('1940')], true], //   ✅ 50+ by 2000
      [[d('2000'), 50, b('1950')], true], //   ✅ 50 by 2000
      [[d('2000'), 50, b('1960')], false], //  ❌ 40 by 2000
      [[d('2000'), 30, b('1960')], true], //   ✅ 40 by 2000
      [[d('2000'), 30, b('1970')], true], //   ✅ 30 by 2000
      [[d('2000'), 30, b('1980')], false], //  ❌ 20 by 2000
    ] as const)('should correctly qualify', ([due, years, input], expected) => {
      expect(age(due)({ years })(input)[0]).toBe(expected)
    })

    it.each([
      [[d('2000'), 50, b('1940')], 1990], // reached 50 yo from 1940
      [[d('2000'), 20, b('1940')], 1960], // reached 20 yo from 1940
    ] as const)('should reach correctly', ([due, years, input], expected) => {
      expect(age(due)({ years })(input)).toSatisfy(reachedAt(expected))
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

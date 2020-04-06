/* cspell: disable */
import { isValid } from 'date-fns'
import { Condition } from '../../types'
import { eq, d, b } from '../test-utils'

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
      [50, '1940', 1990],
      [50, '1950', 2000],
      [50, '1960', 2010],
      [30, '1960', 1990],
      [30, '1970', 2000],
      [30, '1980', 2010],
    ] as const)('should correctly qualify', (years, birth, reached) => {
      expect(age({ years })(b(birth)).reached).toSatisfy(eq.date(reached))
    })
  })

  describe('merge', () => {
    type CondsDictiorary = { [key: string]: { [key: string]: Condition } }
    const { all } = merge

    const conds: CondsDictiorary = {
      pass: {
        on1990: () => ({ reached: d('1990') }),
        on2000: () => ({ reached: d('2000') }),
      },
      fail: {
        on1995: () => ({ reached: d('1995') }),
        on2005: () => ({ reached: d('2005') }),
      },
    }

    describe('all', () => {
      it('should merge multiple conditions', () => {
        expect(all([])).toBeFunction()
        expect(all([conds.pass.on1990])).toBeFunction()
        expect(all([conds.pass.on1990, conds.pass.on2000])).toBeFunction()
      })

      it('should handle empty condition set', () => {
        const { reached } = all([])({})
        expect(reached).toBeInstanceOf(Date)
        expect(reached).not.toSatisfy(isValid)
      })

      it('should have same result for single condition', () => {
        const left = all([conds.pass.on1990])({})
        const right = conds.pass.on1990({})
        expect(left).toMatchObject(right)
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
        expect(cond({}).reached).toSatisfy(eq.date(year))
      })
    })
  })
})

/* cspell: disable */
import { isValid } from 'date-fns'
import { Reacher } from '../../types'
import { eq, d, b } from '../test-utils'
import { age, merge /*, contribution*/ } from '.'

describe('retirement/calculator/lib/reachers', () => {
  // describe('contribution', () => {
  //   it('should exposed contribution based reachers', () => {
  //     expect(contribution).toHaveProperty('last')
  //     expect(contribution).toHaveProperty('total')
  //   })
  // })

  describe('age', () => {
    it.each([
      [50, '1940', 1990],
      [50, '1950', 2000],
      [50, '1960', 2010],
      [30, '1960', 1990],
      [30, '1970', 2000],
      [30, '1980', 2010],
    ] as const)('should correctly qualify', (years, birth, reached) => {
      expect(age({ years })(b(birth))[0]).toSatisfy(eq.date(reached))
    })
  })

  describe('merge', () => {
    type ReachersDictonary = { [key: string]: { [key: string]: Reacher } }
    const { all } = merge

    const reachers: ReachersDictonary = {
      pass: {
        on1990: () => [d('1990')],
        on2000: () => [d('2000')],
      },
      fail: {
        on1995: () => [d('1995')],
        on2005: () => [d('2005')],
      },
    }

    describe('all', () => {
      it('should merge multiple reachers', () => {
        expect(all([])).toBeFunction()
        expect(all([reachers.pass.on1990])).toBeFunction()
        expect(all([reachers.pass.on1990, reachers.pass.on2000])).toBeFunction()
      })

      it('should handle empty condition set', () => {
        const [reached] = all([])({})
        expect(reached).toBeInstanceOf(Date)
        expect(reached).not.toSatisfy(isValid)
      })

      it('should have same result for single condition', () => {
        const left = all([reachers.pass.on1990])({})
        const right = reachers.pass.on1990({})
        expect(left[0]).toEqual(right[0])
      })

      it.each([
        [all([reachers.pass.on1990]), 1990],
        [all([reachers.pass.on2000]), 2000],
        [all([reachers.pass.on1990, reachers.pass.on2000]), 2000],
        [all([reachers.pass.on1990, reachers.pass.on2000]), 2000],
        [all([reachers.pass.on1990, reachers.pass.on2000]), 2000],
        [all([reachers.pass.on1990, reachers.fail.on2005]), 2005],
        [all([reachers.fail.on1995, reachers.fail.on2005]), 2005],
        [all([reachers.fail.on2005, reachers.fail.on1995]), 2005],
      ])('should reach on latest reach, even failed ones', (cond, year) => {
        expect(cond({})[0]).toSatisfy(eq.date(year))
      })
    })
  })
})

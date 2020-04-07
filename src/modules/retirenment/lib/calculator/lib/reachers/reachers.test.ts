/* cspell: disable */
import { isValid } from 'date-fns'
import { Reacher } from '../../types'
import { eq, d, b } from '../test-utils'
import { NEVER } from '../const'
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
    const { all } = merge

    const reachers = {
      on1990: (() => [d('1990')]) as Reacher,
      on2000: (() => [d('2000')]) as Reacher,
      never: (() => [NEVER]) as Reacher,
    }

    describe('all', () => {
      it('should merge multiple reachers', () => {
        expect(all([])).toBeFunction()
        expect(all([reachers.on1990])).toBeFunction()
        expect(all([reachers.on1990, reachers.on2000])).toBeFunction()
      })

      it('should handle empty condition set', () => {
        const [reached] = all([])({})
        expect(reached).toBeInstanceOf(Date)
        expect(reached).not.toSatisfy(isValid)
      })

      it('should have same result for single condition', () => {
        const left = all([reachers.on1990])({})
        const right = reachers.on1990({})
        expect(left[0]).toEqual(right[0])
      })

      it.each([
        [all([reachers.on1990]), 1990],
        [all([reachers.on2000]), 2000],
        [all([reachers.on1990, reachers.on2000]), 2000],
        [all([reachers.on1990, reachers.on2000]), 2000],
        [all([reachers.on1990, reachers.on2000]), 2000],
        [all([reachers.on1990, reachers.never]), NaN],
        [all([reachers.never, reachers.on2000]), NaN],
        [all([reachers.never, reachers.never]), NaN],
      ])('should reach on latest reach', (cond, year) => {
        expect(cond({})[0]).toSatisfy(eq.date(year))
      })
    })
  })
})

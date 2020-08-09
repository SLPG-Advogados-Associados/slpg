/* cspell: disable */
import { Contribution, CalculatorInput } from '../../../types'
import { d, c } from '../../test-utils'
import { sum, normalize } from '../../duration'
import { NEVER } from '../../const'
import { total } from './total'
import { filter } from './utils'

describe('retirement/calculator/lib/reachers/contribution/total', () => {
  const i = (...contributions: Contribution[]) =>
    ({ contributions } as CalculatorInput)

  describe('simple', () => {
    it.each([
      [20, d('2000'), i(c('70^90')), d('1989-12-27'), 7305],
      [20, d('2000'), i(c('60^65'), c('70^85')), d('1984-12-26'), 7306],
      [20, d('2000'), i(c('70')), d('1989-12-27'), 18262],
      [20, d('2000'), i(c('80^90')), NEVER, 3653],
      [20, d('2000'), i(c('60^65'), c('70^75')), NEVER, 3653],
      [20, d('2000'), i(c('90')), d('2009-12-27'), 10957],
      [20, d('2000'), i(c('90^95'), c('2000')), d('2014-12-27'), 9131],
    ])(
      'should correctly calculate reach',
      (years, due, input, at, duration) => {
        const result = total({ expected: { years }, due })(input)

        expect(result.satisfied).toBe(at !== NEVER)
        expect(result.satisfiedAt).toEqual(at)
        expect(result.context).toHaveProperty('computed.real.days', duration)
        expect(result.context).toHaveProperty(
          'computed.processed.days',
          duration
        )
      }
    )
  })

  describe('filtered', () => {
    it.each([
      [20, i(c('70^80'), c('80')), NEVER, 3652],
      [20, i(c('70^90'), c('90^00')), d('1989-12-27'), 7305],
      [20, i(c('70^80'), c('80^90'), c('90^00')), d('1999-12-28'), 7304],
    ])('should correctly calculate reach', (years, input, at, duration) => {
      let curr = 0

      const reacher = total({
        expected: { years },
        // filter-in even contributions (just to difeer)
        processors: { '^': filter(() => curr++ % 2 === 0) },
      })

      const result = reacher(input)

      expect(result.satisfied).toBe(at !== NEVER)
      expect(result.satisfiedAt).toEqual(at)
      expect(result.context.computed.processed.days).toBe(duration)
      expect(result.context.computed.real.days).toBeGreaterThan(duration)
    })
  })

  describe('process', () => {
    it.each([
      [i(c('91^2000')), d('1999-12-30'), 3287, 3652],
      [i(c('92')), d('2000-12-29'), 10227, 10592],
      [i(c('92^93'), c('93')), d('1999-12-30'), 10227, 10957],
    ])(
      'should be possible to increment duration on processor',
      (input, at, real, processed) => {
        const reacher = total({
          expected: { years: 10 },
          processors: {
            '^': (duration) => normalize(sum(duration, { years: 1 })),
          },
        })

        const result = reacher(input)

        expect(result.satisfied).toBe(true)
        expect(result.satisfiedAt).toEqual(at)
        expect(result.context.computed.real.days).toBe(real)
        expect(result.context.computed.processed.days).toBe(processed)
      }
    )
  })
})

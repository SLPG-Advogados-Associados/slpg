/* cspell: disable */
import { sum, normalize } from 'duration-fns'
import { Contribution } from '../../types'
import { d, c } from '../test-utils'
import { NEVER } from '../const'

import { last, total, __set__ } from './contribution'

describe('retirement/calculator/lib/reachers/contribution', () => {
  describe('last', () => {
    const i = (...contributions: Contribution[]) => ({ contributions })

    it.each([
      [10, i(c('80')), d('1990')],
      [20, i(c('80')), d('2000')],
      [20, i(c('50^75'), c('80')), d('2000')],
      [10, i(c('70^90')), d('1980')],
      [10, i(c('50^75'), c('70^90')), d('1980')],
      [20, i(c('50^75'), c('70^90')), d('1990')],
      [20, i(c('81')), d('2001')],
      [20, i(c('50^75'), c('81')), d('2001')],
      [20, i(c('80^90')), NEVER],
      [20, i(c('50^75'), c('80^90')), NEVER],
    ])('should correctly calculate reach', (years, input, expected) => {
      expect(last({ years })(input)[0]).toEqual(expected)
    })
  })

  describe('total', () => {
    const i = (...contributions: Contribution[]) => ({ contributions })

    it.each([
      [20, i(c('70^90')), d('1990')],
      [20, i(c('60^65'), c('70^85')), d('1985')],
      [20, i(c('70')), d('1990')],
      [20, i(c('80^90')), NEVER],
      [20, i(c('60^65'), c('70^75')), NEVER],
      [20, i(c('90')), d('2010')],
      [20, i(c('90^95'), c('2000')), d('2015')],
    ])('should correctly calculate reach', (years, input, expected) => {
      expect(total({ years })(input)[0]).toEqual(expected)
    })

    it.each([
      [20, i(c('80')), d('2000'), 40], // reached 20 at 2000, has currently 40
      [20, i(c('90')), d('2010'), 30], // reached 20 at 2010, has currently 30
      [20, i(c('70^95')), d('1990'), 25], // reached 20 at 1990, has currently 25 (stopped)
      [20, i(c('70^80'), c('85')), d('1995'), 45], // reached 20 at 1995, has currently 45
    ])('should check context', (years, input, reached, duration) => {
      const [result, context] = total({ years })(input)

      expect(result).toEqual(reached)
      expect(context).toHaveProperty('durations.real.years', duration)
      expect(context).toHaveProperty('durations.processed.years', duration)
    })

    describe('process', () => {
      it.each([
        [i(c('91^2000')), d('2000'), 9, 10],
        [i(c('92')), d('2001'), 28, 29],
        [i(c('92^93'), c('93')), d('2000'), 28, 30],
      ])(
        'should be possible to increment duration on processor',
        (input, expected, real, processed) => {
          const processor = duration => normalize(sum(duration, { years: 1 }))
          const duration = { years: 10 }
          const [reached, context] = total(duration, processor)(input)

          expect(reached).toEqual(expected)
          expect(context).toHaveProperty('durations.real.years', real)
          expect(context).toHaveProperty('durations.processed.years', processed)
        }
      )
    })
  })
})

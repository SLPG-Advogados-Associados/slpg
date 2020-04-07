/* cspell: disable */
import { sum, normalize } from 'duration-fns'
import { Contribution } from '../../types'
import { d, c } from '../test-utils'
import { NEVER } from '../const'
import { last, total, utils } from './contribution'

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

  describe('utils', () => {
    describe('splitAt', () => {
      it.each([
        [c('70^90'), d('60'), [c('70^90')]], // cut before, keep same
        [c('70^90'), d('00'), [c('70^90')]], // cut after, keep same
        [c('70^90'), d('80'), [c('70^80'), c('80^90')]], // cut between
        [c('70'), d('80'), [c('70^80'), c('80')]], // cut without end
      ])('should split conditions based on date', (input, date, expected) => {
        expect(utils.splitAt(date)(input)).toMatchObject(expected)
      })
    })
  })

  describe('total', () => {
    const i = (...contributions: Contribution[]) => ({ contributions })

    describe('simple', () => {
      it.each([
        [20, i(c('70^90')), d('1990'), 20],
        [20, i(c('60^65'), c('70^85')), d('1985'), 20],
        [20, i(c('70')), d('1990'), 50],
        [20, i(c('80^90')), NEVER, 10],
        [20, i(c('60^65'), c('70^75')), NEVER, 10],
        [20, i(c('90')), d('2010'), 30],
        [20, i(c('90^95'), c('2000')), d('2015'), 25],
      ])('should correctly calculate reach', (years, input, by, duration) => {
        const [reached, context] = total({ years })(input)

        expect(reached).toEqual(by)
        expect(context).toHaveProperty('durations.real.years', duration)
        expect(context).toHaveProperty('durations.processed.years', duration)
      })
    })

    describe('filtered', () => {
      it.each([
        [20, i(c('70^80'), c('80')), NEVER, 10],
        [20, i(c('70^90'), c('90^00')), d('1990'), 20],
        [20, i(c('70^80'), c('80^90'), c('90^00')), d('2000'), 20],
      ])('should correctly calculate reach', (years, input, by, duration) => {
        let curr = 0
        // filter-in even contributions (just to difeer)
        const filter = () => curr++ % 2 === 0
        const [reached, context] = total({ years }, { filter })(input)

        expect(reached).toEqual(by)
        expect(context).toHaveProperty('durations.real.years', duration)
        expect(context).toHaveProperty('durations.processed.years', duration)
      })
    })

    describe('split', () => {
      it.each([
        [20, i(c('70^80')), NEVER, 10, 1], // uncut
        [20, i(c('70^90'), c('90^00')), d('1990'), 30, 2], // uncut
        [20, i(c('85^95')), NEVER, 10, 2], // cut to two
        [20, i(c('70^80'), c('85^00')), d('1995'), 25, 3], // cut to three
      ])('should process splitted', (years, input, by, duration, times) => {
        const split = utils.splitAt(d('90'))
        // watcher
        const process = jest.fn(d => d)
        const [reached, context] = total({ years }, { split, process })(input)

        expect(reached).toEqual(by)
        expect(process).toHaveBeenCalledTimes(times)
        expect(context).toHaveProperty('durations.real.years', duration)
        expect(context).toHaveProperty('durations.processed.years', duration)
      })
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

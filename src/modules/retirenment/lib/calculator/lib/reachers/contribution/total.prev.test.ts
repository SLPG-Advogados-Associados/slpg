/* cspell: disable */
import { Contribution, CalculatorInput } from '../../../types'
import { d, c } from '../../test-utils'
import { between, sum, normalize } from '../../duration'
import { NEVER, TODAY } from '../../const'
import { total, utils } from './total.prev'

describe('retirement/calculator/lib/reachers/contribution', () => {
  describe('utils', () => {
    describe('splitAt', () => {
      it.each([
        [c('70^90'), d('60'), [c('70^90')]], // cut before, keep same
        [c('70^90'), d('00'), [c('70^90')]], // cut after, keep same
        [c('70^90'), d('80'), [c('70^80'), c('80^90')]], // cut between
        [c('70'), d('80'), [c('70^80'), c('80')]], // cut without end
      ])('should split conditions based on date', (input, date, expected) => {
        expect(utils.splitAt(date)(input)).toMatchObject(expected)

        const left = between(input.start, input.end || TODAY)
        // prettier-ignore
        const right = sum(...expected.map(c => between(c.start, c.end || TODAY)))

        // assert total duration is the same.
        expect(left).toEqual(right)
      })
    })
  })

  describe('total', () => {
    const i = (...contributions: Contribution[]) =>
      ({ contributions } as CalculatorInput)

    describe('simple', () => {
      it.each([
        [20, i(c('70^90')), d('1989-12-27'), 7305],
        [20, i(c('60^65'), c('70^85')), d('1984-12-26'), 7306],
        [20, i(c('70')), d('1989-12-27'), 18262],
        [20, i(c('80^90')), NEVER, 3653],
        [20, i(c('60^65'), c('70^75')), NEVER, 3653],
        [20, i(c('90')), d('2009-12-27'), 10957],
        [20, i(c('90^95'), c('2000')), d('2014-12-27'), 9131],
      ])('should correctly calculate reach', (years, input, by, duration) => {
        const [reached, context] = total({ years })(input)

        expect(reached).toEqual(by)
        expect(context).toHaveProperty('computed.real.days', duration)
        expect(context).toHaveProperty('computed.processed.days', duration)
      })
    })

    describe('filtered', () => {
      it.each([
        [20, i(c('70^80'), c('80')), NEVER, 3652],
        [20, i(c('70^90'), c('90^00')), d('1989-12-27'), 7305],
        [20, i(c('70^80'), c('80^90'), c('90^00')), d('1999-12-28'), 7304],
      ])('should correctly calculate reach', (years, input, by, duration) => {
        let curr = 0
        // filter-in even contributions (just to difeer)
        const filter = () => curr++ % 2 === 0
        const [reached, context] = total({ years }, { filter })(input)

        expect(reached).toEqual(by)
        expect(context).toHaveProperty('computed.real.days', duration)
        expect(context).toHaveProperty('computed.processed.days', duration)
      })
    })

    describe('split', () => {
      it.each([
        [20, i(c('70^80')), NEVER, 3652, 1], // uncut
        [20, i(c('70^90'), c('90^00')), d('1989-12-27'), 10957, 2], // uncut
        [20, i(c('85^95')), NEVER, 3652, 2], // cut to two
        [20, i(c('70^80'), c('85^00')), d('1994-12-28'), 9130, 3], // cut to three
      ])('should process splitted', (years, input, by, duration, times) => {
        const split = utils.splitAt(d('90'))
        // watcher
        const process = jest.fn(d => d)
        const [reached, context] = total({ years }, { split, process })(input)

        expect(reached).toEqual(by)
        expect(process).toHaveBeenCalledTimes(times)
        expect(context).toHaveProperty('computed.real.days', duration)
        expect(context).toHaveProperty('computed.processed.days', duration)
      })
    })

    describe('process', () => {
      it.each([
        [i(c('91^2000')), d('1999-12-30'), 3287, 3652],
        [i(c('92')), d('2000-12-29'), 10227, 10592],
        [i(c('92^93'), c('93')), d('1999-12-30'), 10227, 10957],
      ])(
        'should be possible to increment duration on processor',
        (input, expected, real, processed) => {
          const process = duration => normalize(sum(duration, { years: 1 }))

          const duration = { years: 10 }
          const [reached, context] = total(duration, { process })(input)

          expect(reached).toEqual(expected)
          expect(context).toHaveProperty('computed.real.days', real)
          expect(context).toHaveProperty('computed.processed.days', processed)
        }
      )
    })

    describe('expected constructor', () => {
      it.each([
        [20, i(c('70^90')), d('1989-12-27'), 7305],
        [20, i(c('60^65'), c('70^85')), d('1984-12-26'), 7306],
        [20, i(c('70')), d('1989-12-27'), 18262],
        [20, i(c('80^90')), NEVER, 3653],
        [20, i(c('60^65'), c('70^75')), NEVER, 3653],
        [20, i(c('90')), d('2009-12-27'), 10957],
        [20, i(c('90^95'), c('2000')), d('2014-12-27'), 9131],
      ])('should correctly calculate reach', (years, input, by, duration) => {
        const expected = jest.fn(() => ({ years }))
        const [reached, context] = total(expected)(input)

        expect(reached).toEqual(by)
        expect(context).toHaveProperty('computed.real.days', duration)
        expect(context).toHaveProperty('computed.processed.days', duration)
        expect(expected).toHaveBeenCalledTimes(1)
        expect(expected).toHaveBeenCalledWith(input)
      })
    })
  })
})
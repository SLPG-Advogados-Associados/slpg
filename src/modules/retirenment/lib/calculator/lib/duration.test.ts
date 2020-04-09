import { parse, toString as string, Duration } from 'duration-fns'
import {
  normalize,
  multiply,
  max,
  min,
  round,
  precision,
  split,
  compare,
  between,
} from './duration'
import { d, p } from './test-utils'

describe('retirement/calculator/lib/duration', () => {
  describe('normalize', () => {
    it.each([
      ['P1Y', 'P365D'],
      ['P1Y1M', 'P395DT10H'],
      ['P1Y1W', 'P372D'],
      ['P1Y10D', 'P375D'],
      ['P1YT10H', 'P365DT10H'],
    ])('should normalize durations', (input, expected) => {
      expect(string(normalize(parse(input)))).toBe(expected)
    })
  })

  describe('between', () => {
    it.each([
      // normal
      [d('1990'), d('1991'), 'P365D'],
      [d('1990'), d('1991-01-02'), 'P366D'],
      // leap year
      [d('2000'), d('2001'), 'P366D'],
      [d('2000'), d('2001-01-02'), 'P367D'],
      // found inconsistences
      [d('1978-02-01'), d('1978-03-01'), 'P28D'],
    ])('should calculate duration', (start, end, expected) => {
      expect(string(between(start, end))).toBe(expected)
    })
  })

  describe('multiply', () => {
    const ref = d('2000')

    it.each([
      [2, { years: 1 }, null, 'P730D'],
      // floats to account for imprecision.
      [2.1, { years: 1 }, null, 'P766DT12H'],
      [3.1, { years: 2 }, null, 'P2263D'],
      [-1.1, { years: 1 }, null, 'P-402DT-12H'],
      [-2.1, { years: 2 }, null, 'P-1533D'],

      // using reference date (accounts for leap days)

      [2, { years: 1 }, ref, 'P1Y11M30D'], // leap year
      // floats to account for imprecision.
      [2.1, { years: 1 }, ref, 'P2Y1M4DT12H'],
      [3.1, { years: 2 }, ref, 'P6Y2M12D'],
      [-1.1, { years: 1 }, ref, 'P-1Y-2M23DT12H'],
      [-2.1, { years: 2 }, ref, 'P-4Y-3M20D'],
    ])(
      'should correctly apply durations transforms',
      (by, duration, ref, expected) => {
        expect(string(multiply(by, duration, ref))).toEqual(expected)
      }
    )
  })

  describe('round', () => {
    it.each([
      [{ days: 10, hours: 10 }, 'days', { days: 10 }],
      [{ days: 10, hours: 11 }, 'days', { days: 10 }],
      [{ days: 10, hours: 11, minutes: 59 }, 'days', { days: 10 }],
      [{ days: 10, hours: 11, minutes: 60 }, 'days', { days: 11 }],
      [{ days: 10, hours: 12 }, 'days', { days: 11 }],
      [{ days: 10, hours: 23 }, 'days', { days: 11 }],
      [{ days: 10, hours: 48 }, 'days', { days: 12 }],
    ] as const)('should correctly round', (input, by, expected) => {
      expect(round(input, by)).toMatchObject(expected)
    })
  })

  describe('max', () => {
    it.each([
      [{ years: 1 }, { years: 0 }, 'left'],
      [{ years: 1 }, { years: 2 }, 'right'],
      [{ years: -1 }, { years: -2 }, 'left'],
      [{ years: -1 }, { years: 0 }, 'right'],
    ])('should find the max between durations', (left, right, expected) => {
      expect(max(left, right)).toEqual(expected === 'left' ? left : right)
    })
  })

  describe('min', () => {
    it.each([
      [{ years: 1 }, { years: 0 }, 'right'],
      [{ years: 1 }, { years: 2 }, 'left'],
      [{ years: -1 }, { years: -2 }, 'right'],
      [{ years: -1 }, { years: 0 }, 'left'],
    ])('should find the max between durations', (left, right, expected) => {
      expect(min(left, right)).toEqual(expected === 'left' ? left : right)
    })
  })

  describe('compare', () => {
    describe('longer', () => {
      it.each([
        [{ years: 2 }, { years: 1 }, false, true],
        [{ years: 2 }, { years: 3 }, false, false],
        [{ years: 2 }, { years: 2 }, false, false],
        [{ years: 2 }, { years: 2 }, true, true],

        [{ years: 2, days: 2 }, { years: 2, days: 1 }, false, true],
        [{ years: 2, days: 2 }, { years: 2, days: 3 }, false, false],
        [{ years: 2, days: 2 }, { years: 2, days: 2 }, false, false],
        [{ years: 2, days: 2 }, { years: 2, days: 2 }, true, true],
      ])('should check longer duration', (left, right, equality, expected) => {
        expect(compare.longer(left, right, equality)).toBe(expected)
      })
    })

    describe('shorter', () => {
      it.each([
        [{ years: 1 }, { years: 2 }, false, true],
        [{ years: 3 }, { years: 2 }, false, false],
        [{ years: 2 }, { years: 2 }, false, false],
        [{ years: 2 }, { years: 2 }, true, true],

        [{ years: 2, days: 1 }, { years: 2, days: 2 }, false, true],
        [{ years: 2, days: 3 }, { years: 2, days: 2 }, false, false],
        [{ years: 2, days: 2 }, { years: 2, days: 2 }, false, false],
        [{ years: 2, days: 2 }, { years: 2, days: 2 }, true, true],
      ])('should check shorter duration', (left, right, equality, expected) => {
        expect(compare.shorter(left, right, equality)).toBe(expected)
      })
    })
  })

  describe('precision', () => {
    const input = {
      years: 2,
      months: 2,
      weeks: 2,
      days: 2,
      hours: 2,
      minutes: 2,
      seconds: 2,
      milliseconds: 2,
    }

    const results = {
      years: 'P2Y',
      months: 'P2Y2M',
      weeks: 'P2Y2M14D',
      days: 'P2Y2M16D',
      hours: 'P2Y2M16DT2H',
      minutes: 'P2Y2M16DT2H2M',
      seconds: 'P2Y2M16DT2H2M2S',
      milliseconds: 'P2Y2M16DT2H2M2,002S',
    }

    it.each([
      ['years', results.years],
      ['months', results.months],
      ['weeks', results.weeks],
      ['days', results.days],
      ['hours', results.hours],
      ['minutes', results.minutes],
      ['seconds', results.seconds],
      ['milliseconds', results.milliseconds],
    ])('should reduce duration to a precision', (prec, expected) => {
      expect(string(precision(prec as keyof Duration, input))).toEqual(expected)
    })
  })

  describe('split', () => {
    it.each([
      [p('2000^2005'), d('2003'), { days: 1096 }, { days: 731 }],
      [p('1990^2020'), d('2000'), { days: 3652 }, { days: 7305 }],
    ])('should split interval', ([start, end], middle, before, after) => {
      expect(split({ start, end }, middle)).toMatchObject([before, after])
    })
  })
})

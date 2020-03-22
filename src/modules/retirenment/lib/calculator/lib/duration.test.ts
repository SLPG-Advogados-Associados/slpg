import { Duration, DurationInput } from 'duration-fns'
import { ServiceKind, Contribution } from '../types'
import {
  apply,
  multiply,
  max,
  min,
  precision,
  split,
  compare,
  filters,
} from './duration'
import { NO_DURATION } from './const'
import { d, p } from './test-utils'

const { PUBLIC, PRIVATE } = ServiceKind

const ref = d('2000')

describe('retirement/calculator/lib/duration', () => {
  describe('apply', () => {
    type Item = [
      [(DurationInput) => DurationInput, DurationInput, Date?],
      DurationInput
    ]

    const process = {
      plusYear: ({ years }) => ({ years: years + 1 }),
      lessYear: ({ years }) => ({ years: years - 1 }),
    }

    it.each([
      [[process.plusYear, { years: 1 }, ref], { years: 2 }],
      [[process.plusYear, { years: 2 }, ref], { years: 3 }],
      [[process.lessYear, { years: 1 }, ref], { years: 0 }],
      [[process.lessYear, { years: 2 }, ref], { years: 1 }],
    ] as Item[])(
      'should correctly apply durations transforms',
      ([func, duration, ref], expected) => {
        expect(apply(func, duration, ref)).toMatchObject(expected)
      }
    )
  })

  describe('multiply', () => {
    type Item = [[number, DurationInput, Date?], DurationInput]

    // floats to account for imprecision.
    it.each([
      [[2.1, { years: 1 }, ref], { years: 2 }],
      [[3.1, { years: 2 }, ref], { years: 6 }],
      [[-1.1, { years: 1 }, ref], { years: -1 }],
      [[-2.1, { years: 2 }, ref], { years: -4 }],
    ] as Item[])(
      'should correctly apply durations transforms',
      ([by, duration, ref], expected) => {
        expect(multiply(by, duration, ref)).toMatchObject(expected)
      }
    )
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
        [[{ years: 2 }, { years: 1 }, false], true],
        [[{ years: 2 }, { years: 3 }, false], false],
        [[{ years: 2 }, { years: 2 }, false], false],
        [[{ years: 2 }, { years: 2 }, true], true],

        [[{ years: 2, days: 2 }, { years: 2, days: 1 }, false], true],
        [[{ years: 2, days: 2 }, { years: 2, days: 3 }, false], false],
        [[{ years: 2, days: 2 }, { years: 2, days: 2 }, false], false],
        [[{ years: 2, days: 2 }, { years: 2, days: 2 }, true], true],
      ] as const)(
        'should check longer duration',
        ([left, right, equality], expected) => {
          expect(compare.longer(left, right, equality)).toBe(expected)
        }
      )
    })

    describe('shorter', () => {
      it.each([
        [[{ years: 1 }, { years: 2 }, false], true],
        [[{ years: 3 }, { years: 2 }, false], false],
        [[{ years: 2 }, { years: 2 }, false], false],
        [[{ years: 2 }, { years: 2 }, true], true],

        [[{ years: 2, days: 1 }, { years: 2, days: 2 }, false], true],
        [[{ years: 2, days: 3 }, { years: 2, days: 2 }, false], false],
        [[{ years: 2, days: 2 }, { years: 2, days: 2 }, false], false],
        [[{ years: 2, days: 2 }, { years: 2, days: 2 }, true], true],
      ] as const)(
        'should check shorter duration',
        ([left, right, equality], expected) => {
          expect(compare.shorter(left, right, equality)).toBe(expected)
        }
      )
    })
  })

  describe('precision', () => {
    // prettier-ignore
    const durations = {
      original: { years: 2, months: 2, weeks: 2, days: 2, hours: 2, minutes: 2, seconds: 2, milliseconds: 2 },
      // results
      years: { years: 2, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
      months: { years: 2, months: 2, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
      weeks: { years: 2, months: 2, weeks: 2, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
      days: { years: 2, months: 2, weeks: 2, days: 2, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
      hours: { years: 2, months: 2, weeks: 2, days: 2, hours: 2, minutes: 0, seconds: 0, milliseconds: 0 },
      minutes: { years: 2, months: 2, weeks: 2, days: 2, hours: 2, minutes: 2, seconds: 0, milliseconds: 0 },
      seconds: { years: 2, months: 2, weeks: 2, days: 2, hours: 2, minutes: 2, seconds: 2, milliseconds: 0 },
      milliseconds: { years: 2, months: 2, weeks: 2, days: 2, hours: 2, minutes: 2, seconds: 2, milliseconds: 2 },
    }

    it.each([
      ['years', durations.years],
      ['months', durations.months],
      ['weeks', durations.weeks],
      ['days', durations.days],
      ['hours', durations.hours],
      ['minutes', durations.minutes],
      ['seconds', durations.seconds],
      ['milliseconds', durations.milliseconds],
    ] as const)('should find the max between durations', (prec, result) => {
      expect(precision(prec, durations.original)).toEqual(result)
    })
  })

  describe('split', () => {
    it.each([
      [p('2000^2005'), d('2003'), { years: 3 }, { years: 2 }],
      [p('1990^2020'), d('2000'), { years: 10 }, { years: 20 }],
    ])('should split interval', ([start, end], middle, before, after) => {
      expect(split({ start, end }, middle)).toMatchObject([before, after])
    })
  })

  describe('filters', () => {
    describe('serviceKind', () => {
      const factory = filters.serviceKind

      it.each([
        [factory(PUBLIC), PUBLIC, true],
        [factory(PUBLIC), PRIVATE, false],
        [factory(PRIVATE), PUBLIC, false],
        [factory(PRIVATE), PRIVATE, true],
      ])('serviceKind: should filter correctly', (filter, kind, result) => {
        const duration = { years: 1 } as Duration
        const contribution = { service: { kind } } as Contribution
        const context = { contribution }
        const expected = result ? duration : NO_DURATION

        expect(filter(duration, context)).toBe(expected)
      })
    })
  })
})

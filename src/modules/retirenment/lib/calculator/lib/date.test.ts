import { add, floor, ceil, splitPeriod, leapsBetween } from './date'
import { i, d } from './test-utils'

describe('retirement/calculator/lib/date', () => {
  describe('add', () => {
    it.each([
      [d('2002-01-01'), { days: 5 }, d('2002-01-06')],
      [d('2002-01-01'), { days: 60 }, d('2002-03-02')],
      [d('2000-01-01'), { days: 60 }, d('2000-03-01')], // leap
      // month
      [d('2002-01-01'), { months: 2 }, d('2002-03-02')],
      [d('2000-01-01'), { months: 2 }, d('2000-03-01')], // leap
      // year
      [d('2002-01-01'), { years: 2 }, d('2004-01-01')],
      [d('2000-01-01'), { years: 2 }, d('2001-12-31')], // leap
    ])('should compute as days', (date, duration, expected) => {
      expect(add(date, duration)).toEqual(expected)
    })

    it.each([
      [d('2002-01-01'), { days: 5 }, d('2002-01-06')],
      [d('2002-01-01'), { days: 60 }, d('2002-03-02')],
      [d('2000-01-01'), { days: 60 }, d('2000-03-01')], // leap
      // month
      [d('2002-01-01'), { months: 2 }, d('2002-03-01')],
      [d('2000-01-01'), { months: 2 }, d('2000-03-01')], // leap
      // year
      [d('2002-01-01'), { years: 2 }, d('2004-01-01')],
      [d('2000-01-01'), { years: 2 }, d('2002-01-01')], // leap
    ])('should compute as is', (date, duration, expected) => {
      expect(add(date, duration, true)).toEqual(expected)
    })
  })

  describe('floor', () => {
    const date = d('2019-09-18T19:10:52.230Z')

    it.each([
      ['years', '2019-01-01T00:00:00.000Z'],
      ['months', '2019-09-01T00:00:00.000Z'],
      ['days', '2019-09-18T00:00:00.000Z'],
      ['hours', '2019-09-18T19:00:00.000Z'],
      ['minutes', '2019-09-18T19:10:00.000Z'],
      ['seconds', '2019-09-18T19:10:52.000Z'],
      ['milliseconds', '2019-09-18T19:10:52.230Z'],
    ] as const)('should correctly floor a date', (precision, expected) => {
      expect(floor(precision, date).toISOString()).toBe(expected)
    })
  })

  describe('ceil', () => {
    it.each([
      [
        '2019-09-18T19:10:52.230Z',
        [
          ['years', '2020-01-01T00:00:00.000Z'],
          ['months', '2019-10-01T00:00:00.000Z'],
          ['days', '2019-09-19T00:00:00.000Z'],
          ['hours', '2019-09-18T20:00:00.000Z'],
          ['minutes', '2019-09-18T19:11:00.000Z'],
          ['seconds', '2019-09-18T19:10:53.000Z'],
          ['milliseconds', '2019-09-18T19:10:52.230Z'],
        ],
      ],
      [
        '2019-09-18T00:00:00.000Z',
        [
          ['years', '2020-01-01T00:00:00.000Z'],
          ['months', '2019-10-01T00:00:00.000Z'],
          // ceiled already.
          ['days', '2019-09-18T00:00:00.000Z'],
          ['hours', '2019-09-18T00:00:00.000Z'],
          ['minutes', '2019-09-18T00:00:00.000Z'],
          ['seconds', '2019-09-18T00:00:00.000Z'],
          ['milliseconds', '2019-09-18T00:00:00.000Z'],
        ],
      ],
    ] as const)('should correctly ceil a date', (date, results) => {
      for (const [precision, expected] of results) {
        expect(ceil(precision, d(date)).toISOString()).toBe(expected)
      }
    })
  })

  describe('splitPeriod', () => {
    it.each([
      ['2000^2010', '2005', '2000^2005', '2005^2010'],
      ['2000^2010', '1990', '2000^1990', '2000^2010'], // negative before
      ['2000^2010', '2020', '2000^2010', '2020^2010'], // negative after
    ] as const)('should split periods', (original, middle, before, after) => {
      expect(splitPeriod(i(original), d(middle))).toMatchObject([
        i(before),
        i(after),
      ])
    })

    it.each([
      ['2000^2010', '2005', false, false],
      ['2000^2010', '1990', true, false], // negative before
      ['2000^2010', '2020', false, true], // negative after
    ] as const)(
      'should identify negative periods',
      (original, middle, before, after) => {
        const split = splitPeriod(i(original), d(middle))
        expect(split[0]).toHaveProperty('negative', before)
        expect(split[1]).toHaveProperty('negative', after)
      }
    )
  })

  describe('leapsBetween', () => {
    it.each([
      // non-leap
      [d('1990'), d('1991'), 0],
      [d('1990'), d('1992'), 0],
      [d('1990'), d('1992-02-28'), 0],
      [d('1990'), d('1992-02-29'), 0],
      // leaped
      [d('1990'), d('1992-03-01'), 1],

      // leaped once
      [d('1990'), d('1996'), 1],
      [d('1990'), d('1996-02-28'), 1],
      [d('1990'), d('1996-02-29'), 1],
      // leaped twice
      [d('1990'), d('1996-03-01'), 2],

      // non-leap
      [d('1992-03-01'), d('1993'), 0],
      [d('1992-02-29'), d('1993'), 0],
      // leaped
      [d('1992-02-28'), d('1993'), 1],

      // should not break for invalid dates.
      [d('1990'), new Date(NaN), 0],
      [new Date(NaN), d('1990'), 0],
      [new Date(NaN), new Date(NaN), 0],
    ])('should count leap days', (start, end, expected) => {
      expect(leapsBetween(start, end)).toBe(expected)
    })
  })
})

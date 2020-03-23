import { floor, splitPeriod } from './date'
import { i, d } from './test-utils'

describe('retirement/calculator/lib/date', () => {
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
})

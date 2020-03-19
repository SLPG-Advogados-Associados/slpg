import { floor } from './date'

describe('retirement/calculator/lib/date', () => {
  describe('floor', () => {
    const date = new Date('2019-09-18T19:10:52.230Z')

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
})

import * as gen from './generators'

describe('retirement/calculator/lib/generators', () => {
  describe('date', () => {
    type Items = ConstructorParameters<typeof Date>[][]

    it.each([
      [['2020']],
      [[0]],
      [['December 17, 1995 03:24:00']],
      [['1995-12-17T03:24:00']],
      [[1995, 11, 17]],
      [[1995, 11, 17, 3, 24, 0]],
    ] as Items)('should generate valid dates', input => {
      expect(gen.d(...input)).toEqual(new Date(...input))
    })
  })
})

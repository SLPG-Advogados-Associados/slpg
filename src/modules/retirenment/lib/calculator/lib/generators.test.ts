import { DateParams, date, birth, period } from './generators'

describe('retirement/calculator/lib/generators', () => {
  describe('date', () => {
    type Items = [DateParams, number][]

    it.each([
      // default
      [['2020'], 2020],
      [[0], 1970],
      [['December 17, 1995 03:24:00'], 1995],
      [['1995-12-17T03:24:00'], 1995],
      [[1995, 11, 17], 1995],
      [[1995, 11, 17, 3, 24, 0], 1995],
      // extra
      [['00'], 2000],
      [['05'], 2005],
      [['10'], 1910],
      [['60'], 1960],
    ] as Items)('should generate valid dates', (input, year) => {
      expect(date(...input).getFullYear()).toEqual(year)
    })
  })

  describe('birth', () => {
    type Items = DateParams[][]

    it.each([
      [['2020']],
      [[0]],
      [['December 17, 1995 03:24:00']],
      [['1995-12-17T03:24:00']],
      [[1995, 11, 17]],
      [[1995, 11, 17, 3, 24, 0]],
    ] as Items)('should generate valid dates', input => {
      expect(birth(...input)).toEqual({ birthDate: new Date(...input) })
    })
  })

  describe('period', () => {
    it.each([
      ['2000^2002', [date('2000'), date('2002')]],
      ['1995^2010', [date('1995'), date('2010')]],
      ['1995', [date('1995')]],
    ] as const)('should generate valid dates', (input, expected) => {
      expect(period(input)).toMatchObject(expected)
    })
  })
})

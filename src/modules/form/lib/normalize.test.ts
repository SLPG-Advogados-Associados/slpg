import { date } from 'yup'
import { parse } from './normalize'

describe('form/normalize', () => {
  describe('parse/stringToDate', () => {
    it.each([
      ['dd/MM/yyyy', '01/01/1990', new Date('1990-01-01')],
      [undefined, '01/01/1990', new Date('1990-01-01')],
      ['yyyy', '1990', new Date('1990-01-01')],
      ['yyyy', '1990', new Date('1990-01-01')],
    ])('should parse date strings', async (format, original, expected) => {
      const parser = parse.stringToDate(format).bind(date())

      expect(await parser(null, original)).toEqual(expected)
    })
  })
})

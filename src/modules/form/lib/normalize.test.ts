import { date } from 'yup'
import { parse } from './normalize'

describe('form/normalize', () => {
  describe('parse/stringToDate', () => {
    it.each([
      ['dd/MM/yyyy', '01/01/1990', '01/01/1990', new Date('1990-01-01')],
      [null, '01/01/1990', '01/01/1990', new Date('1990-01-01')],
      ['yyyy', null, '1990', new Date('1990-01-01')],
      ['yyyy', new Date('2000'), '1990', new Date('2000')],
    ])(
      'should parse date strings',
      async (format, value, original, expected) => {
        const parser = parse.stringToDate(format || undefined).bind(date())

        expect(await parser(value, original)).toEqual(expected)
      }
    )
  })
})

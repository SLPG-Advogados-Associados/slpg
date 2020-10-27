import * as Yup from 'yup'
import { parse as parseDate, isValid } from 'date-fns'

const format = {}

const parse = {
  stringToDate: (
    format = 'dd/MM/yyyy'
  ): Yup.TransformFunction<Yup.DateSchema> =>
    function (_value: Date | string, value: string) {
      if (!value) return null
      if (value.length !== format.length) return new Date(NaN)
      const parsed = parseDate(value, format, new Date())
      return isValid(parsed) ? parsed : value
    },
}

const schemas = {
  ...Yup,
  date: (format?: string) =>
    Yup.date().nullable().transform(parse.stringToDate(format)),
}

export { format, parse, schemas }

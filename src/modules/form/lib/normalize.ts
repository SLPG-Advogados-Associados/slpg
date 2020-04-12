import * as Yup from 'yup'
import { parse as parseDate, isValid } from 'date-fns'

const format = {}

const parse = {
  stringToDate: (
    format = 'dd/MM/yyyy'
  ): Yup.TransformFunction<Yup.DateSchema> =>
    function(value: Date | string, originalValue: string) {
      if (this.isType(value)) return value
      if (!originalValue) return null
      const parsed = parseDate(originalValue, format, new Date())
      return isValid(parsed) ? parsed : originalValue
    },
}

const schemas = {
  date: (format?: string) =>
    Yup.date()
      .nullable()
      .transform(parse.stringToDate(format)),
}

export { format, parse, schemas }

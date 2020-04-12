import { TransformFunction, DateSchema } from 'yup'
import { parse as parseDate } from 'date-fns'

const format = {}

const parse = {
  stringToDate: (format = 'dd/MM/yyyy'): TransformFunction<DateSchema> =>
    function(value: Date | string, originalValue: Date | string) {
      if (this.isType(value)) return value
      if (typeof originalValue !== 'string') return null
      return parseDate(originalValue, format, new Date())
    },
}

export { format, parse }

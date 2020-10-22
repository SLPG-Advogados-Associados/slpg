import type { RequisiteResult } from '../engine'
import { str } from '../debug'
import { named } from './utils'

/**
 * After date requisite factory.
 */
const after = (date: Date) =>
  named((): RequisiteResult[] => [{ from: date }], `after ${str.date(date)}`)

export { after }

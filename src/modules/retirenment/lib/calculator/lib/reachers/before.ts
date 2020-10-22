import type { RequisiteResult } from '../engine'
import { str } from '../debug'
import { named } from './utils'

/**
 * Before date requisite factory.
 */
const before = (date: Date) =>
  named((): RequisiteResult[] => [{ to: date }], `before ${str.date(date)}`)

export { before }

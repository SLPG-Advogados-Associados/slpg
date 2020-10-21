import { RequisiteResults } from '../../types'

/**
 * Before date requisite factory.
 */
const before = (date: Date) => (): RequisiteResults => [{ to: date }]

export { before }

import { RequisiteResults } from '../../types'

/**
 * After date requisite factory.
 */
const after = (date: Date) => (): RequisiteResults => [{ from: date }]

export { after }

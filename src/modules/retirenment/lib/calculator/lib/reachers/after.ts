import { TODAY } from '../const'
import { RequisiteExecutor } from '../engine'

/**
 * After date requisite factory.
 */
const after = (date: Date): RequisiteExecutor<{}> => () => {
  const satisfied = date <= TODAY

  return {
    satisfied,
    satisfiedAt: satisfied ? date : undefined,
    satisfiable: true,
    satisfiableAt: date,
  }
}

export { after }

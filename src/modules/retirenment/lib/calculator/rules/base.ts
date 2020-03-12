import { Condition, ConditionResult } from '../types'

class BaseRule<Input extends object, ConditionContext = object> {
  public static title: string
  public static description: string

  /**
   * The conditions for a given person data input to qualify for this rule,
   * regardless of earning and rights calculation.
   */
  public conditions: Condition<Input, ConditionContext>[]

  // processed.
  public satisfied: boolean

  /**
   * The input processing results.
   */
  public results: ConditionResult<ConditionContext>[]

  constructor(input: Input, conditions: Condition<Input, ConditionContext>[]) {
    this.conditions = conditions
    this.results = this.conditions.map(condition => condition(input))
    this.satisfied = this.results.some(([satisfied]) => satisfied)
  }
}

export { BaseRule }

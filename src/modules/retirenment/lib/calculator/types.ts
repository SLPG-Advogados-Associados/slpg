/**
 * Classification used for retirement calc purposes.
 */
export enum Gender {
  MALE,
  FEMALE,
}

/**
 * An adapted logic predicate function the returns the result
 * with possible result context.
 */
export type Condition<Input = object, ConditionContext = object> = (
  input: Input
) => [boolean, ConditionContext?]

export interface Rule<Input extends object> {
  name: string
  date: Date
  description: string

  /**
   * The conditions for a given person data input to qualify for this rule,
   * regardless of earning and rights calculation.
   */
  conditions: Condition[]

  /**
   * Whether or not a given person data input satisfies this
   * rule's conditions.
   */
  satisfiedBy: (input: Input) => boolean
}

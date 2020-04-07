/**
 * Inputs and incoming types.
 * --------------------------
 */

/**
 * Classification used for retirement calc purposes.
 */
export enum Gender {
  MALE,
  FEMALE,
}

/**
 * Kinds of services.
 */
export enum ServiceKind {
  PUBLIC,
  PRIVATE,
}

/**
 * Kinds of post.
 */
export enum Post {
  TEACHER,
  OTHER,
}

/**
 * A service definition.
 */
export type Service = {
  title?: string
  kind: ServiceKind
  post: Post
}

/**
 * A contribution period.
 */
export type Contribution = {
  start: Date
  end?: Date
  salary: number
  service: Service
}

/**
 * Reachers are atomic reach date calculators.
 * -------------------------------------------
 */

export type Reached = Date

/**
 * Reacher execution result.
 */
export type ReacherResult<Context = {}> = [Reached] | [Reached, Context]

/**
 * Reacher functions.
 *
 * @return [0] The reaching date.
 * @return [1] The reaching context.
 */
export type Reacher<Input = object, Context = {}> = (
  input: Input
) => ReacherResult<Context>

/**
 * Minimum condition context shape.
 */
export type ConditionContextBase = { reached: Date | null }

/**
 * ConditionContext factory.
 */
export type ConditionContext<T extends {}> = T & ConditionContextBase

/**
 * A condition check result, with varying context.
 */
export type ConditionResult<ConditionContext = ConditionContextBase> = [
  boolean,
  ConditionContext
]

/**
 * An adapted logic predicate function the returns the result
 * with possible result context.
 */
export type Condition<Input = object, T = {}> = (
  input: Input
) => ConditionResult<ConditionContext<T>>

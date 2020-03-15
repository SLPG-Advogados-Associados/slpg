/**
 * Classification used for retirement calc purposes.
 */
export enum Gender {
  MALE,
  FEMALE,
}

/**
 * A condition check result, with varying context.
 */
export type ConditionResult<ConditionContext = object> = [
  boolean,
  ConditionContext
]

/**
 * An adapted logic predicate function the returns the result
 * with possible result context.
 */
export type Condition<Input = object, ConditionContext = object> = (
  input: Input
) => ConditionResult<ConditionContext>

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

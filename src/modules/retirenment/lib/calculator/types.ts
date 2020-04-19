import { Duration } from 'date-fns'

/**
 * Inputs and incoming types.
 * --------------------------
 */

/**
 * Classification used for retirement calc purposes.
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * Kinds of services.
 */
export enum ServiceKind {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

/**
 * Kinds of post.
 */
export enum Post {
  TEACHER = 'TEACHER',
  OTHER = 'OTHER',
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

export interface CalculatorInput {
  gender: Gender
  birthDate: Date
  contributions: Contribution[]
}

/**
 * Reachers are atomic reach date calculators.
 * -------------------------------------------
 */

export type Reached = Date

/**
 * Reacher execution result.
 */
export type ReacherResult<Context = {}> = readonly [
  Reached,
  Context & { reachable: boolean; byDue?: Duration }
]

/**
 * Reacher functions.
 *
 * @return [0] The reaching date.
 * @return [1] The reaching context.
 */
export type Reacher<Context = {}> = (
  input: CalculatorInput
) => ReacherResult<Context>

export enum Operation {
  OR = 'OR',
  AND = 'AND',
}

/**
 * Rules
 * -----
 */

export interface Condition {
  description: string
  execute: Reacher
}

// export type PossibilityResult = {
//   op: Operation
//   conditions: readonly (
//     | PossibilityResult
//     | readonly [Condition, ReacherResult]
//   )[]
// }

export type ConditionResult = readonly [Condition, ReacherResult]

export type PossibilityResult = {
  op: Operation
  conditions: readonly ConditionResult[]
}

export type PossibilityExecution = readonly [
  boolean,
  { reached: Date | null; result: PossibilityResult }
]

export interface Possibility<Conditions = readonly Condition[]> {
  title: string
  description: string
  conditions: Conditions
  execute: (input: CalculatorInput) => PossibilityExecution
}

export interface Rule {
  title: string
  description: string
  due?: Date
  promulgation: Date
  possibilities: Possibility[]
}

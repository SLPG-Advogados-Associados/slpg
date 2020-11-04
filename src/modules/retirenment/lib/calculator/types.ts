/**
 * Inputs and incoming types.
 * --------------------------
 */

/**
 * Classification used for retirement calc purposes.
 */
export enum Sex {
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
  career: number // random incremental number based on used input of career continuity
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
  sex: Sex
  birthDate: Date
  contributions: Contribution[]
}

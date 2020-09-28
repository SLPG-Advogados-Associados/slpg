import { ServiceKind, Contribution, Post } from '../types'

/**
 * Evaluate if a contribution is of a magisterium.
 */
const isTeacher = ({ service: { post } }: Contribution) => post === Post.TEACHER

/**
 * Evaluate if a contribution is of public service relationship.
 */
const isPublic = ({ service }: Contribution) =>
  service.kind === ServiceKind.PUBLIC

export { isTeacher, isPublic }

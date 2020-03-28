import { Post, ServiceKind, ConditionResult } from '../types'

const { OTHER } = Post
const { PUBLIC } = ServiceKind

export type DateParams = ConstructorParameters<typeof Date>

/**
 * Comparison helpers.
 */
const eq = {
  /**
   * Checks if the given date input is contained in a date.
   *
   * @param input Date in (possibly partial) ISO format.
   */
  date: (input: string | number) => (date: Date) =>
    date.toISOString().indexOf(input + '') === 0,
}

/*
 * Input/output generators.
 * ------------------------
 */

/**
 * Syntax sugar for `new Date` constructor. Good for shorter tests.
 */
const date = (...input: DateParams) => {
  const [year] = input

  if (input.length === 1 && typeof year === 'string' && year.length === 2) {
    return new Date(`${year[0] === '0' ? '20' : '19'}${year}`)
  }

  return new Date(...input)
}
const d = date // alias

/**
 * Constructs an object containing `birthDate` prop.
 */
const birth = (...input: DateParams) => ({ birthDate: date(...input) })
const b = birth // alias

/**
 * Constructs a time span tuple.
 *
 * @param span Span in string format. i.e.:
 *  - '2002' = [2002, today]
 *  - '2002^2004' = [2002, 2004]
 */
const period = (span: string) => {
  const result = span.split('^').map(side => date(side))

  if (!result.length) {
    throw new Error(`Invalid time span: \`${span}\``)
  }

  return result as [Date, Date?]
}
const p = period

/**
 * Constructs a time span interval.
 *
 * @param span Span in string format. i.e.:
 *  - '2002' = [2002, today]
 *  - '2002^2004' = [2002, 2004]
 */
const interval = (span: string) => {
  const [start, end] = period(span)
  return { start, end }
}
const i = interval

/**
 * Constructs a service object.
 */
const service = (kind = PUBLIC, post = OTHER) => ({ kind, post })

/**
 * Constructs a single contribution object.
 */
const contribution = (
  span: string,
  [kind, post]: [ServiceKind?, Post?] = []
) => {
  const [start, end] = period(span)
  return { start, end, salary: 1000, service: service(kind, post) }
}
const c = contribution

/*
 * Jest satisfaction predicates.
 * -----------------------------
 */

/**
 * Compares the given date with context.reached.
 *
 * @param input Date in (possibly partial) ISO format.
 */
const reachedAt = (input: string | number) => ([
  ,
  { reached },
]: ConditionResult) => reached.toISOString().indexOf(input + '') === 0

/*
 * Aliases and short vars.
 * -----------------------
 */

const und = undefined

export {
  eq,
  und,
  date,
  d,
  birth,
  b,
  contribution,
  c,
  period,
  p,
  interval,
  i,
  reachedAt,
}

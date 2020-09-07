import { isValid, sub } from './date'
import { Post, ServiceKind, Sex, Contribution, CalculatorInput } from '../types'

const { OTHER, TEACHER } = Post
const { PUBLIC, PRIVATE } = ServiceKind

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
  date: (input: string | number) => (date: Date) => {
    if (!isValid(date)) return isNaN(Number(input))
    return date.toISOString().indexOf(input + '') === 0
  },
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
 * Parses a birthdate notation.
 */
const birth = (input: string) => {
  const [years, target] = input.split('@')

  return target ? sub(date(target), { years: Number(years) }) : date(years)
}
const b = birth // alias

/**
 * Constructs a time span tuple.
 *
 * @param span Span in string format. i.e.:
 *  - '2002' = [2002, today]
 *  - '2002^2004' = [2002, 2004]
 */
const period = (span: string) => {
  const result = span.split('^').map((side) => date(side))

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
const reachedAt = (input: string | number) => ({
  reached,
}: {
  reached: Date
}) => eq.date(input)(reached)

const input = (
  sex?: Sex,
  birthDate = '1940',
  contributions?: Contribution[]
) => ({
  sex: sex || Sex.MALE,
  birthDate: birth(birthDate),
  contributions: contributions || [],
})
const I = input

/*
 * Aliases and short vars.
 * -----------------------
 */

const und = undefined
const u = und

const parsers: Array<[
  RegExp,
  (matched: RegExpMatchArray, result: CalculatorInput) => unknown
]> = [
  [/homem/iu, (_, result) => (result.sex = Sex.MALE)],
  [/mulher/iu, (_, result) => (result.sex = Sex.FEMALE)],

  [
    /nascid[oa] em (.+)/iu,
    ([, date], result) => (result.birthDate = birth(date)),
  ],

  [
    /servidora? de(?:sde)? ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) => result.contributions.push(c(date)),
  ],

  [
    /contribuinte de(?:sde)? ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) => result.contributions.push(c(date, [PRIVATE])),
  ],

  [
    /professora? de(?:sde)? ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) => result.contributions.push(c(date, [u, TEACHER])),
  ],

  [
    /professora? privad[oa] de(?:sde)? ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) =>
      result.contributions.push(c(date, [PRIVATE, TEACHER])),
  ],
]

/**
 * Input parser.
 */
const parse = (text: string) => {
  const result = { contributions: [] } as CalculatorInput
  const parts = text.split('|')

  parts: for (const part of parts) {
    for (const [regex, apply] of parsers) {
      const matched = part.trim().match(regex)
      if (matched) {
        apply(matched, result)
        // avoid double match
        continue parts
      }
    }
  }

  return result
}

const expected = ([satisfiedAt, satisfiableAt]: (null | string)[]) => ({
  satisfied: Boolean(satisfiedAt),
  satisfiedAt: satisfiedAt ? d(satisfiedAt) : u,
  satisfiable: Boolean(satisfiableAt),
  satisfiableAt: satisfiableAt ? d(satisfiableAt) : u,
})

export {
  eq,
  und,
  u,
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
  input,
  I,
  parse,
  expected,
}

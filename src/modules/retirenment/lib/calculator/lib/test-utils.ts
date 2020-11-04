import { isValid, sub, format } from './date'
import { Rule, Possibility, RequisiteChain, evaluate } from './engine'
import { Post, Service, ServiceKind, Sex, CalculatorInput } from '../types'

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
  date: (input: string | number) => (date: Date | number) => {
    if (!isValid(date)) return isNaN(Number(input))
    return new Date(date).toISOString().indexOf(input + '') === 0
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
  const result = span.split('^').map((side) => (side ? date(side) : void 0))

  if (!result.length) {
    throw new Error(`Invalid time span: \`${span}\``)
  }

  return result as [Date?, Date?]
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
 * Constructs a require result.
 *
 * @param span Span in string format. i.e.:
 *  - '2002' = [2002, today]
 *  - '2002^2004' = [2002, 2004]
 */
const result = (span: string) => {
  const [from, to] = period(span)
  return { from, to }
}
const r = result

/**
 * Constructs a service object.
 */
const service = (kind = PUBLIC, post = OTHER, career = 1): Service => ({
  kind,
  post,
  career,
})

/**
 * Constructs a single contribution object.
 */
const contribution = (
  span: string,
  [kind, post, career]: [ServiceKind?, Post?, number?] = []
) => {
  const [start, end] = period(span)
  return { start, end, salary: 1000, service: service(kind, post, career) }
}
const c = contribution

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
    /servidora? (?:de(?:sde)?|entre) ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) => result.contributions.push(c(date)),
  ],

  [
    /contribuinte (?:de(?:sde)?|entre) ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) => result.contributions.push(c(date, [PRIVATE])),
  ],

  [
    /professora? (?:de(?:sde)?|entre) ([^ a-zA-Z]+)( em diante)?/,
    ([, date], result) => result.contributions.push(c(date, [u, TEACHER])),
  ],

  [
    /professora? privad[oa] (?:de(?:sde)?|entre) ([^ a-zA-Z]+)( em diante)?/,
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

/* eslint-disable no-undef, @typescript-eslint/no-explicit-any */
type TestItems = [string, string[]]

/**
 * Wrapper for testers to allow use of only/skip
 */
const tester = <F extends (...args: any[]) => void>(
  fn: F
): F & { only: F; skip: F } => {
  const extended = fn as any

  extended.only = (...args) => fn(...args, it.only)
  extended.skip = (...args) => fn(...args, it.skip)

  return extended
}

const simplify = (item: TestItems) =>
  [
    item[0],
    item[1]
      .map(period)
      .map((dates) =>
        dates.map((date) => (date ? format(date, 'yyyy-MM-dd') : ''))
      )
      .map(([from, to]) => `${from}^${to}`),
  ] as const

const test = {
  /**
   * Jest test generator for human-language parsed tests of rule possibilities.
   */
  possibility: tester(
    (
      rule: Rule,
      possibility: Possibility,
      items: TestItems[],
      _it: jest.It = it
    ) =>
      _it.each(items.map(simplify))('%s: %j', (input, output) =>
        expect(rule.execute(possibility, parse(input))).toEqual(
          output.map(result)
        )
      )
  ),

  /**
   * Jest test generator for human-language parsed tests of requisite chains.
   */
  chain: tester(
    (
      title: string,
      chain: RequisiteChain<CalculatorInput>,
      items: Array<[string, string[]]>,
      _it: jest.It = it
    ) => {
      const register = () =>
        _it.each(items)('%s: %s', (input, output) =>
          expect(evaluate(parse(input), chain)).toEqual(output.map(result))
        )

      return title ? describe(title, register) : register()
    }
  ),
}

/* eslint-enable */

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
  result,
  r,
  parse,
  test,
}

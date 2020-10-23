import { isValid, sub } from './date'
import { RequisiteChain, evaluate } from './engine'
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

/**
 * Jest test generator for human-language parsed tests of requisite chains.
 */
/* eslint-disable no-undef */
const testChain = (
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

testChain.only = (
  title: string,
  chain: RequisiteChain<CalculatorInput>,
  items: Array<[string, string[]]>
) => testChain(title, chain, items, it.only)

testChain.skip = (
  title: string,
  chain: RequisiteChain<CalculatorInput>,
  items: Array<[string, string[]]>
) => testChain(title, chain, items, it.skip)
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
  testChain,
}

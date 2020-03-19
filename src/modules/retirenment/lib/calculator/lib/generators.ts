export type DateParams = ConstructorParameters<typeof Date>

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

export { date, d, birth, b, period, p }

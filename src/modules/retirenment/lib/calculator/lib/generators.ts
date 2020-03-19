type DateParams = ConstructorParameters<typeof Date>

/**
 * Syntax sugar for `new Date` constructor. Good for shorter tests.
 */
const date = (...input: DateParams) => new Date(...input)
const d = date // alias

/**
 * Constructs an object containing `birthDate` prop.
 */
const birth = (...input: DateParams) => ({ birthDate: date(...input) })
const b = birth // alias

export { date, d, birth, b }

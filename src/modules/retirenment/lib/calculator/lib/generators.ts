/**
 * Syntax sugar for `new Date` constructor. Good for shorter tests.
 */
const d = (...input: ConstructorParameters<typeof Date>) => new Date(...input)

export { d }

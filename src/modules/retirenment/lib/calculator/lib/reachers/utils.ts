/**
 * Higher-order function to set toString naming, for debug purposes.
 */
const named = <F extends Function>(fn: F, name: string) => {
  fn.toString = () => name
  return fn
}

export { named }

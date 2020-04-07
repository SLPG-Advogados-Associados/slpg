import { parse } from 'duration-fns'

const TODAY = new Date()
const NEVER = new Date(NaN)
const NO_DURATION = parse('PT0S')

export { TODAY, NEVER, NO_DURATION }

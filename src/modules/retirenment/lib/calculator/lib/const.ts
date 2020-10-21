import { parse } from 'duration-fns'
import { add, sub } from './date'

const TODAY = new Date()
const NEVER = new Date(NaN)
const PAST = sub(TODAY, { years: 100 })
const FUTURE = add(TODAY, { years: 100 })
const NO_DURATION = parse('PT0S')
const ALWAYS = { from: PAST, to: FUTURE }

export { TODAY, PAST, FUTURE, NEVER, NO_DURATION, ALWAYS }

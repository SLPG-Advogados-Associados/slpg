import { parse } from 'duration-fns'
import { add } from './date'

const TODAY = new Date()
const FUTURE = add(TODAY, { years: 100 })
const NO_DURATION = parse('PT0S')

export { TODAY, FUTURE, NO_DURATION }

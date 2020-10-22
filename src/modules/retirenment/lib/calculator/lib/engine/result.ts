import { format } from 'date-fns'
import { RequisiteResult } from '../../types'
import * as date from '../date'

/*
 * Date comparisons with null-as-infinity accounting.
 */

const before = (a?: Date, b?: Date) => Boolean(!a || (b && a <= b))
const after = (a?: Date, b?: Date) => Boolean(!a || (b && a >= b))

const min = (a?: Date, b?: Date, s = false) =>
  !a ? (s ? b : a) : !b ? (s ? a : b) : date.min([a, b])

const max = (a?: Date, b?: Date, s = false) =>
  !a ? (s ? b : a) : !b ? (s ? a : b) : date.max([a, b])

const byFrom = (a: RequisiteResult, b: RequisiteResult) =>
  !a.from && !b.from
    ? 0
    : !a.from || a.from < b.from
    ? -1
    : !b.from || b.from < a.from
    ? 1
    : 0

const overlaps = (a: RequisiteResult, b: RequisiteResult) =>
  ((before(a.from, b.from) || !b.from) && before(b.from, a.to)) ||
  (after(b.to, a.from) && after(a.to, b.to))

/**
 * Combine results using union logic.
 */
const union = (input: RequisiteResult[]): RequisiteResult[] => {
  const results: RequisiteResult[] = []

  next: for (const next of input.sort(byFrom)) {
    // try to merge with current intervals
    for (const curr of results) {
      // time overlap
      if (overlaps(curr, next)) {
        curr.from = min(curr.from, next.from)
        curr.to = max(curr.to, next.to)
        continue next
      }
    }

    // no overlap, add new
    results.push({ ...next })
  }

  return results
}

/**
 * Combine results using intersection logic.
 */
const intersection = (input: RequisiteResult[]): RequisiteResult[] => {
  const results: RequisiteResult[] = []

  next: for (const next of input.sort(byFrom)) {
    // try to merge with current intervals
    for (const curr of results) {
      // time overlap
      if (overlaps(curr, next)) {
        curr.from = max(curr.from, next.from, true)
        curr.to = min(curr.to, next.to, true)
        continue next
      }
    }

    // in case ANY fails to overlap, result is empty
    if (results.length) return []

    // no overlap, no result yet, add initial
    results.push({ ...next })
  }

  return results
}

const flatten = (results: RequisiteResult[][]) =>
  results.reduce((c, result) => [...c, ...result], [])

/**
 * Processes possible results using ANY logic.
 *
 * Basically, combine all periods, and perform a union.
 */
const any = (input: RequisiteResult[][]): RequisiteResult[] =>
  union(flatten(input))

/**
 * Processes possible results using ALL logic.
 *
 * Perform chained intersection.
 */
const all = (input: RequisiteResult[][]): RequisiteResult[] =>
  union(
    input.reduce((curr, next) => {
      const partials: RequisiteResult[] = []

      for (const a of curr) {
        for (const b of next) {
          partials.push(...intersection([a, b]))
        }
      }

      return partials
    })
  )

/**
 * Helper to get a textual description of results.
 */
const toText = (results: RequisiteResult[]) =>
  results
    .map(
      ({ from, to }: RequisiteResult) =>
        `${from ? format(from, 'yyyy-MM-dd') : ''}^${
          to ? format(to, 'yyyy-MM-dd') : ''
        }`
    )
    .join(', ')

export {
  union,
  intersection,
  before,
  after,
  overlaps,
  flatten,
  any,
  all,
  toText,
}

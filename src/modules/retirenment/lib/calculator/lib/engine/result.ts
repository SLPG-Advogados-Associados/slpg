import * as date from '../date'

import { Period } from './types'

/*
 * Date comparisons with null-as-infinity accounting.
 */

const before = (a?: Date, b?: Date) => Boolean(!a || (b && a <= b))
const after = (a?: Date, b?: Date) => Boolean(!a || (b && a >= b))

const min = (a?: Date, b?: Date, s = false) =>
  !a ? (s ? b : a) : !b ? (s ? a : b) : date.min([a, b])

const max = (a?: Date, b?: Date, s = false) =>
  !a ? (s ? b : a) : !b ? (s ? a : b) : date.max([a, b])

const byFrom = (a: Period, b: Period) =>
  !a.from && !b.from
    ? 0
    : !a.from || a.from < b.from
    ? -1
    : !b.from || b.from < a.from
    ? 1
    : 0

const overlaps = (a: Period, b: Period) =>
  ((before(a.from, b.from) || !b.from) && (before(b.from, a.to) || !a.to)) ||
  (after(b.to, a.from) && after(a.to, b.to))

/**
 * Combine results using union logic.
 */
const union = (input: Period[]): Period[] => {
  const results: Period[] = []

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
const intersection = (input: Period[]): Period[] => {
  const results: Period[] = []

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

const flatten = (results: Period[][]) =>
  results.reduce((c, result) => [...c, ...result], [])

/**
 * Processes possible results using ANY logic.
 *
 * Basically, combine all periods, and perform a union.
 */
const any = (input: Period[][]): Period[] => union(flatten(input))

/**
 * Processes possible results using ALL logic.
 *
 * Perform chained intersection.
 */
const all = (input: Period[][]): Period[] =>
  union(
    input.reduce((curr, next) => {
      const partials: Period[] = []

      for (const a of curr) {
        for (const b of next) {
          partials.push(...intersection([a, b]))
        }
      }

      return partials
    })
  )

export { union, intersection, before, after, overlaps, flatten, any, all }

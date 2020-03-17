import { apply, multiply } from './duration'
import { DurationInput } from 'duration-fns'

const ref = new Date('2000')

describe('retirement/calculator/lib/duration', () => {
  describe('apply', () => {
    type Item = [
      [(DurationInput) => DurationInput, DurationInput, Date?],
      DurationInput
    ]

    const process = {
      plusYear: ({ years }) => ({ years: years + 1 }),
      lessYear: ({ years }) => ({ years: years - 1 }),
    }

    it.each([
      [[process.plusYear, { years: 1 }, ref], { years: 2 }],
      [[process.plusYear, { years: 2 }, ref], { years: 3 }],
      [[process.lessYear, { years: 1 }, ref], { years: 0 }],
      [[process.lessYear, { years: 2 }, ref], { years: 1 }],
    ] as Item[])(
      'should correctly apply durations transforms',
      ([func, duration, ref], expected) => {
        expect(apply(func, duration, ref)).toMatchObject(expected)
      }
    )
  })

  describe('multiply', () => {
    type Item = [[number, DurationInput, Date?], DurationInput]

    // floats to account for imprecision.
    it.each([
      [[2.1, { years: 1 }, ref], { years: 2 }],
      [[3.1, { years: 2 }, ref], { years: 6 }],
      [[-1.1, { years: 1 }, ref], { years: -1 }],
      [[-2.1, { years: 2 }, ref], { years: -4 }],
    ] as Item[])(
      'should correctly apply durations transforms',
      ([by, duration, ref], expected) => {
        expect(multiply(by, duration, ref)).toMatchObject(expected)
      }
    )
  })
})

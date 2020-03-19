import { Post, ServiceKind } from '../types'
import {
  DateParams,
  und,
  date,
  birth,
  period,
  contribution,
} from './test-utils'

const { OTHER, TEACHER } = Post
const { PUBLIC, PRIVATE } = ServiceKind

describe('retirement/calculator/lib/test-utils', () => {
  describe('date', () => {
    type Items = [DateParams, number][]

    it.each([
      // default
      [['2020'], 2020],
      [[0], 1970],
      [['December 17, 1995 03:24:00'], 1995],
      [['1995-12-17T03:24:00'], 1995],
      [[1995, 11, 17], 1995],
      [[1995, 11, 17, 3, 24, 0], 1995],
      // extra
      [['00'], 2000],
      [['05'], 2005],
      [['10'], 1910],
      [['60'], 1960],
    ] as Items)('should generate valid dates', (input, year) => {
      expect(date(...input).getFullYear()).toEqual(year)
    })
  })

  describe('birth', () => {
    type Items = DateParams[][]

    it.each([
      [['2020']],
      [[0]],
      [['December 17, 1995 03:24:00']],
      [['1995-12-17T03:24:00']],
      [[1995, 11, 17]],
      [[1995, 11, 17, 3, 24, 0]],
    ] as Items)('should generate valid birthDate objects', input => {
      expect(birth(...input)).toEqual({ birthDate: new Date(...input) })
    })
  })

  describe('period', () => {
    it.each([
      ['2000^2002', [date('2000'), date('2002')]],
      ['1995^2010', [date('1995'), date('2010')]],
      ['1995', [date('1995')]],
    ] as const)('should generate date periods', (input, expected) => {
      expect(period(input)).toMatchObject(expected)
    })
  })

  describe('contribution', () => {
    type Input = [string, [ServiceKind?, Post?]?]

    it.each([
      // period.
      [['2000^2002'], { start: date('2000'), end: date('2002') }],
      [['1950^2010'], { start: date('1950'), end: date('2010') }],
      [['1950'], { start: date('1950'), end: und }],
      // service.
      [['2000'], { service: { kind: PUBLIC, post: OTHER } }],
      [['2000', [PRIVATE, und]], { service: { kind: PRIVATE, post: OTHER } }],
      [['2000', [und, TEACHER]], { service: { kind: PUBLIC, post: TEACHER } }],
    ])('should generate valid contributions', (input, expected) => {
      const [span, service] = input as Input
      expect(contribution(span, service)).toMatchObject(expected)
    })
  })
})

import { Post, ServiceKind, ConditionContextBase } from '../types'
import { NEVER } from './const'

import {
  DateParams,
  eq,
  und,
  date,
  birth,
  period,
  interval,
  contribution,
  reachedAt,
} from './test-utils'

const { OTHER, TEACHER } = Post
const { PUBLIC, PRIVATE } = ServiceKind

describe('retirement/calculator/lib/test-utils', () => {
  describe('eq', () => {
    describe('date', () => {
      it.each([
        ['2010', new Date('2010'), true],
        ['2011', new Date('2010'), false],
        ['2010-10-10', new Date('2010'), false],
        ['2010-10-10', new Date('2010-10-10'), true],
        ['2010', NEVER, false],
        [NaN, NEVER, true],
        [NaN, new Date('2010'), false],
      ])('should check date equality', (input, date, expected) => {
        expect(eq.date(input)(date)).toBe(expected)
      })
    })
  })

  describe('generators', () => {
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

    describe('interval', () => {
      it.each([
        ['2000^2002', [date('2000'), date('2002')]],
        ['1995^2010', [date('1995'), date('2010')]],
        ['1995', [date('1995')]],
      ] as const)('should generate date periods', (input, [start, end]) => {
        expect(interval(input)).toMatchObject({ start, end })
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
        [
          ['2000', [und, TEACHER]],
          { service: { kind: PUBLIC, post: TEACHER } },
        ],
      ])('should generate valid contributions', (input, expected) => {
        const [span, service] = input as Input
        expect(contribution(span, service)).toMatchObject(expected)
      })
    })
  })

  describe('predicates', () => {
    describe('reachedAt', () => {
      it.each([
        // correct
        [2000, new Date('2000'), true],
        ['2000', new Date('2000'), true],
        ['2000-01-01', new Date('2000'), true],
        // wrong
        [2001, new Date('2000'), false],
        ['2001', new Date('2000'), false],
        ['2001-01-01', new Date('2000'), false],
      ])('should correctly check reached date', (input, reached, expected) => {
        const conditionResult = { reached } as ConditionContextBase

        expect(reachedAt(input)(conditionResult)).toBe(expected)

        expected
          ? expect(conditionResult).toSatisfy(reachedAt(input))
          : expect(conditionResult).not.toSatisfy(reachedAt(input))
      })
    })
  })
})

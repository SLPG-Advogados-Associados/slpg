/* eslint-disable no-sparse-arrays */
import { Post, ServiceKind, Sex } from '../types'

import {
  DateParams,
  eq,
  u,
  date,
  birth,
  period,
  interval,
  contribution,
  parse,
  d,
  c,
} from './test-utils'

const { MALE: M, FEMALE: F } = Sex
const { OTHER, TEACHER: T } = Post
const { PUBLIC: PU, PRIVATE: PR } = ServiceKind

describe('retirement/calculator/lib/test-utils', () => {
  describe('eq', () => {
    describe('date', () => {
      it.each([
        ['2010', new Date('2010'), true],
        ['2011', new Date('2010'), false],
        ['2010-10-10', new Date('2010'), false],
        ['2010-10-10', new Date('2010-10-10'), true],
        ['2010', NaN, false],
        [NaN, NaN, true],
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
      it.each([
        ['2020', date('2020')],
        ['December 17, 1995 03:24:00', date('1995-12-17 03:24')],
        ['50@90', date('1940')],
        ['70@90', date('1920')],
        ['70@December 17, 1995 03:24:00', date('1925-12-17 03:24')],
      ] as const)(
        'should generate valid birthDate objects',
        (input, expected) => {
          expect(birth(input)).toEqual(expected)
        }
      )
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
      it.each([
        // period.
        [['2000^2002'], { start: date('2000'), end: date('2002') }],
        [['1950^2010'], { start: date('1950'), end: date('2010') }],
        [['1950'], { start: date('1950'), end: u }],
        // service.
        [['2000'], { service: { kind: PU, post: OTHER } }],
        [['2000', [PR, u]], { service: { kind: PR, post: OTHER } }],
        [['2000', [u, T]], { service: { kind: PU, post: T } }],
      ])('should generate valid contributions', (input, expected) => {
        const [span, service] = input as [string, [ServiceKind, Post]]
        expect(contribution(span, service)).toMatchObject(expected)
      })
    })

    describe('parse', () => {
      it.each([
        ['homem', { sex: M }],
        ['mulher', { sex: F }],
      ])('should parse sex', (text, result) =>
        expect(parse(text).sex).toEqual(result.sex)
      )

      it.each([
        ['nascido em 49', { birthDate: d('1949-01-01') }],
        ['nascido em 1950', { birthDate: d('1950-01-01') }],
        ['nascido em 1950-01-02', { birthDate: d('1950-01-02') }],
        ['nascido em 50@90', { birthDate: d('1940-01-01') }],
      ])('should parse birthDate', (text, result) =>
        expect(parse(text).birthDate).toMatchObject(result.birthDate)
      )

      it.each([
        ['servidor de 60^65', { contributions: [c('60^65')] }],
        ['servidor de 60', { contributions: [c('60')] }],
        ['servidor de 60 em diante', { contributions: [c('60')] }],
        ['contribuinte de 60 em diante', { contributions: [c('60', [PR])] }],
        ['professor de 60 em diante', { contributions: [c('60', [PU, T])] }],
        [
          'professor privado de 60 em diante',
          { contributions: [c('60', [PR, T])] },
        ],

        // multiple
        [
          'servidor de 60^65 | servidor de 70 em diante',
          { contributions: [c('60^65'), c('70')] },
        ],

        [
          'servidor de 60^65 | contribuinte de 70 em diante',
          { contributions: [c('60^65'), c('70', [PR])] },
        ],

        [
          'professor de 60^65 | contribuinte de 70 em diante',
          { contributions: [c('60^65', [PU, T]), c('70', [PR])] },
        ],
      ])('should parse contributions', (text, result) =>
        expect(parse(text).contributions).toEqual(result.contributions)
      )

      it.each([
        ['homem | nascido em 49', { birthDate: d('1949-01-01'), sex: M }],

        [
          'nascido em 49 | servidor de 60^65',
          { birthDate: d('1949-01-01'), contributions: [c('60^65')] },
        ],

        [
          'homem | nascido em 60 | contribuinte de 60^65 | professor de 77 em diante',
          {
            birthDate: d('1960-01-01'),
            contributions: [c('60^65', [PR]), c('77', [PU, T])],
          },
        ],
      ])('should parse full inputs', (text, result) =>
        expect(parse(text)).toMatchObject(result)
      )
    })
  })
})

import { test } from '../../lib/test-utils'
import { rule } from './1988-cf.rule'

const {
  due,
  promulgation,
  possibilities: [integral, proportional],
} = rule

describe('retirement/calculator/rules/cf-1988/possibilities', () => {
  describe('1988-cf-art-40-integral', () => {
    test.possibility(rule, integral, [
      // not civil servant
      ['homem | contribuinte desde 50', []],
      ['mulher | contribuinte desde 50', []],

      // male
      ['homem | servidor desde 50', [`${promulgation}^${due}`]],
      ['homem | servidor desde 60', [`1994-12-23^${due}`]],
      ['homem | servidor desde 65', []],
      // teacher
      ['homem | professor desde 50', [`${promulgation}^${due}`]],
      ['homem | professor desde 65', [`1994-12-25^${due}`]],
      ['homem | professor desde 70', []],

      // female
      ['mulher | servidor desde 55', [`${promulgation}^${due}`]],
      ['mulher | servidor desde 65', [`1994-12-25^${due}`]],
      ['mulher | servidor desde 70', []],
      // teacher
      ['mulher | professora desde 60', [`${promulgation}^${due}`]],
      ['mulher | professora desde 70', [`1994-12-26^${due}`]],
      ['mulher | professora desde 75', []],
    ])
  })

  describe('Proporcional', () => {
    // prettier-ignore
    test.possibility(rule, proportional, [
      // not civil servant
      ['homem | nascido em 20 | contribuinte desde 50', []],
      ['mulher | nascida em 20 | contribuinte desde 50', []],

      // male
      ['homem | nascido em 50 | servidor desde 65', [`1994-12-25^${due}`]],
      ['homem | nascido em 50 | servidor desde 70', []],
      ['homem | nascido em 30 | servidor desde 70', [`1995-01-01^${due}`]],
      ['homem | nascido em 30 | servidor desde 68', [`1995-01-01^${due}`]],

      // female
      ['mulher | nascida em 55 | servidora desde 70', [`1994-12-26^${due}`]],
      ['mulher | nascida em 55 | servidora desde 75', []],
      ['mulher | nascida em 35 | servidora desde 75', [`1995-01-01^${due}`]],
      ['mulher | nascida em 35 | servidora desde 73', [`1995-01-01^${due}`]],
    ])
  })
})

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
      // male
      ['homem | contribuinte desde 50', [`${promulgation}^${due}`]],
      ['homem | contribuinte desde 60', [`1994-12-23^${due}`]],
      ['homem | contribuinte desde 65', []],
      // teacher
      ['homem | professor desde 50', [`${promulgation}^${due}`]],
      ['homem | professor desde 65', [`1994-12-25^${due}`]],
      ['homem | professor desde 70', []],

      // female
      ['mulher | contribuinte desde 55', [`${promulgation}^${due}`]],
      ['mulher | contribuinte desde 65', [`1994-12-25^${due}`]],
      ['mulher | contribuinte desde 70', []],
      // teacher
      ['mulher | professora desde 60', [`${promulgation}^${due}`]],
      ['mulher | professora desde 70', [`1994-12-26^${due}`]],
      ['mulher | professora desde 75', []],
    ])
  })

  describe('Proporcional', () => {
    // prettier-ignore
    test.possibility(rule, proportional, [
      ['homem | nascido em 50 | contribuinte desde 65', [`1994-12-25^${due}`]],
      ['homem | nascido em 50 | contribuinte desde 70', []],
      ['homem | nascido em 30 | contribuinte desde 70', [`1995-01-01^${due}`]],
      ['homem | nascido em 30 | contribuinte desde 68', [`1995-01-01^${due}`]],

      ['mulher | nascida em 55 | contribuinte desde 70', [`1994-12-26^${due}`]],
      ['mulher | nascida em 55 | contribuinte desde 75', []],
      ['mulher | nascida em 35 | contribuinte desde 75', [`1995-01-01^${due}`]],
      ['mulher | nascida em 35 | contribuinte desde 73', [`1995-01-01^${due}`]],
    ])
  })
})

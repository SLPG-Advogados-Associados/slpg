import { Sex } from '../../types'
import { parse } from '../test-utils'
import { sex } from './sex'

const { MALE, FEMALE } = Sex

describe('retirement/calculator/lib/requisites/sex', () => {
  it.each([
    [MALE, parse('homem'), [{}]],
    [MALE, parse('mulher'), []],
    [FEMALE, parse('homem'), []],
    [FEMALE, parse('mulher'), [{}]],
  ])('should correctly satisfy sexes', (expected, input, result) => {
    expect(sex(expected)(input)).toEqual(result)
  })
})

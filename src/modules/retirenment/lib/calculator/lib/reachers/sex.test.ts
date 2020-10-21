import { Sex } from '../../types'
import { I } from '../test-utils'
import { ALWAYS } from '../const'
import { sex } from './sex'

const { MALE, FEMALE } = Sex

describe('retirement/calculator/lib/requisites/sex', () => {
  it.each([
    [MALE, I(MALE), [ALWAYS]],
    [MALE, I(FEMALE), []],
    [FEMALE, I(MALE), []],
    [FEMALE, I(FEMALE), [ALWAYS]],
  ])('should correctly satisfy sexes', (expected, input, result) => {
    expect(sex(expected)(input)).toEqual(result)
  })
})

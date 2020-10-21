import { Sex } from '../../types'
import { I } from '../test-utils'
import { sex } from './sex'

const { MALE, FEMALE } = Sex

describe('retirement/calculator/lib/requisites/sex', () => {
  it.each([
    [MALE, I(MALE), [{}]],
    [MALE, I(FEMALE), []],
    [FEMALE, I(MALE), []],
    [FEMALE, I(FEMALE), [{}]],
  ])('should correctly satisfy sexes', (expected, input, result) => {
    expect(sex(expected)(input)).toEqual(result)
  })
})

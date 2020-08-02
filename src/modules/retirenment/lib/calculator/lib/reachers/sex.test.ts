import { Sex } from '../../types'
import { I } from '../test-utils'
import { sex } from './sex'

const { MALE, FEMALE } = Sex

describe('retirement/calculator/lib/requisites/sex', () => {
  it.each([
    [MALE, I(MALE), true],
    [MALE, I(FEMALE), false],
    [FEMALE, I(MALE), false],
    [FEMALE, I(FEMALE), true],
  ])('should correctly satisfy sexes', (expected, input, satisfied) => {
    expect(sex(expected)(input)).toEqual({
      satisfied,
      satisfiedAt: null,
      satisfiable: false,
    })
  })
})

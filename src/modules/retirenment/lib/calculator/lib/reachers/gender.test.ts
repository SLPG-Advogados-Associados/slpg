import { Gender } from '../../types'
import { I } from '../test-utils'
import { gender } from './gender'

const { MALE, FEMALE } = Gender

describe('retirement/calculator/lib/reachers/sex', () => {
  it.each([
    [MALE, I(MALE), true],
    [MALE, I(FEMALE), false],
    [FEMALE, I(MALE), false],
    [FEMALE, I(FEMALE), true],
  ])('should correctly satisfy genders', (expected, input, satisfied) => {
    expect(gender(expected)(input)).toEqual({
      satisfied,
      satisfiedAt: null,
      satisfiable: false,
    })
  })
})

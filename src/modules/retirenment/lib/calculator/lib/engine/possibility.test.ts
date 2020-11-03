import { CalculatorInput } from '../../types'

import { Requisites } from './requisites'
import { Possibility } from './possibility'

describe('retirement/calculator/engine/possibility', () => {
  const input = {} as CalculatorInput

  it('should instantiate a possibility', () => {
    const instance = new Possibility({
      title: 'Title',
      description: 'Description',
      requisites: new Requisites({ executor: () => [{}] }),
    })

    expect(instance).toBeInstanceOf(Possibility)
  })

  it('should be possible to execute a possibility', () => {
    const instance = new Possibility({
      title: 'Title',
      description: 'Description',
      requisites: new Requisites({ executor: () => [{}] }),
    })

    expect(instance.execute(input)).toEqual([{}])
  })
})

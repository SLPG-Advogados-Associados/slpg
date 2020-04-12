import { renderHook, act } from '@testing-library/react-hooks'
import { useForm } from './useForm'

describe('form/useForm', () => {
  it('should return core api', () => {
    const { result } = renderHook(() => useForm())

    const coreKeys = [
      'watch',
      'control',
      'handleSubmit',
      'setValue',
      'triggerValidation',
      'getValues',
      'reset',
      'register',
      'unregister',
      'clearError',
      'setError',
      'errors',
      'formState',
    ]

    for (const key of coreKeys) {
      expect(result.current).toHaveProperty(key)
    }
  })

  describe('field', () => {
    const shape = (name: string, meta?: {}) => ({
      meta: { touched: false, error: undefined, ...meta },
      input: { name, ref: expect.toBeFunction() },
    })

    it('should retrieve a single field api', () => {
      const { result } = renderHook(() => useForm())

      expect(result.current).toHaveProperty('field')

      expect(result.current.field('field-name')).toMatchObject(
        shape('field-name')
      )
    })

    it('should update with form values', () => {
      const { result } = renderHook(() => useForm())

      expect(result.current.field('field-name')).toMatchObject(
        shape('field-name')
      )

      act(() => {
        result.current.setError('field-name', null, 'error message')
      })

      expect(result.current.field('field-name')).toMatchObject(
        shape('field-name', { error: 'error message' })
      )
    })

    describe('fields', () => {
      it('should retrieve first level fields', () => {
        const { result } = renderHook(() => useForm())

        expect(result.current.fields(['a', 'b'])).toMatchObject({
          a: shape('a'),
          b: shape('b'),
        })
      })
    })
  })
})

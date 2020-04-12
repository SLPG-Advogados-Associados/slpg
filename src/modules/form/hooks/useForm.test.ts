import { renderHook } from '@testing-library/react-hooks'
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
})

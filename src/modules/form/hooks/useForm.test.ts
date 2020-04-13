import { renderHook, act } from '@testing-library/react-hooks'
import { useForm } from './useForm'

describe('form/useForm', () => {
  it('should return core api', () => {
    const { result } = renderHook(() => useForm())

    // core

    expect(result.current).toHaveProperty('watch')
    expect(result.current).toHaveProperty('control')
    expect(result.current).toHaveProperty('handleSubmit')
    expect(result.current).toHaveProperty('setValue')
    expect(result.current).toHaveProperty('triggerValidation')
    expect(result.current).toHaveProperty('getValues')
    expect(result.current).toHaveProperty('reset')
    expect(result.current).toHaveProperty('register')
    expect(result.current).toHaveProperty('unregister')
    expect(result.current).toHaveProperty('clearError')
    expect(result.current).toHaveProperty('setError')
    expect(result.current).toHaveProperty('errors')
    expect(result.current).toHaveProperty('formState')

    // custom
    expect(result.current).toHaveProperty('useField')
    expect(result.current).toHaveProperty('useFieldArray')
  })

  const shape = (name: string, meta?: {}) => ({
    meta: { touched: false, error: undefined, ...meta },
    input: { name, ref: expect.toBeFunction() },
  })

  const arrShape = <Mapped = ReturnType<typeof shape>>(
    name: string,
    value: any,
    meta?: {},
    // @ts-ignore
    mapper: (name: string) => Mapped = () => shape(name, meta)
  ) => ({
    item: { id: expect.toBeString(), value },
    field: mapper(name),
  })

  describe('useField', () => {
    it('should retrieve a single field api', () => {
      const { result } = renderHook(() => useForm())

      expect(result.current.useField('field-name')).toMatchObject(
        shape('field-name')
      )
    })

    it('should update with form values', () => {
      const { result } = renderHook(() => useForm())

      expect(result.current.useField('field-name')).toMatchObject(
        shape('field-name')
      )

      act(() => {
        result.current.setError('field-name', null, 'error message')
      })

      expect(result.current.useField('field-name')).toMatchObject(
        shape('field-name', { error: 'error message' })
      )
    })

    it('should retrieve nested meta', () => {
      const form = renderHook(() => useForm())
      let field = renderHook(() => form.result.current.useField('foo.bar'))

      form.result.current.register({ name: 'foo.bar' })

      expect(field.result.current.meta.touched).toBe(false)

      act(() => form.result.current.setValue('foo.bar', 'value'))
      field = renderHook(() => form.result.current.useField('foo.bar'))

      expect(field.result.current.meta.touched).toBe(true)

      act(() => form.result.current.setError('foo.bar', 'type', 'message'))
      field = renderHook(() => form.result.current.useField('foo.bar'))

      expect(field.result.current.meta.error).toBe('message')
    })
  })

  describe('useFieldArray', () => {
    it('should retrieve a single field array api', () => {
      const form = renderHook(() => useForm())

      expect(form.result.current).toHaveProperty('useFieldArray')

      const field = renderHook(() =>
        form.result.current.useFieldArray('field-name')
      )

      expect(field.result.current).toHaveProperty('swap')
      expect(field.result.current).toHaveProperty('move')
      expect(field.result.current).toHaveProperty('prepend')
      expect(field.result.current).toHaveProperty('append')
      expect(field.result.current).toHaveProperty('remove')
      expect(field.result.current).toHaveProperty('insert')
      expect(field.result.current).toHaveProperty('fields', [])
    })

    it('should update with form values', () => {
      const form = renderHook(() => useForm<{ 'field-name': string[] }>())

      expect(form.result.current).toHaveProperty('useFieldArray')

      const field = renderHook(() =>
        form.result.current.useFieldArray('field-name')
      )

      act(() => field.result.current.append('first'))

      expect(field.result.current.items).toMatchObject([
        arrShape('field-name[0]', 'first'),
      ])

      act(() => field.result.current.append('second'))

      expect(field.result.current.items).toMatchObject([
        arrShape('field-name[0]', 'first'),
        arrShape('field-name[1]', 'second'),
      ])

      // ensure we register before deleting, for refs to be set.
      act(() => {
        form.result.current.register({ name: 'field-name[0]' })
        form.result.current.register({ name: 'field-name[1]' })
      })

      act(() => field.result.current.remove(0))

      expect(field.result.current.items).toMatchObject([
        arrShape('field-name[0]', 'second'),
      ])
    })

    it('should be possible to control field value', () => {
      const form = renderHook(() => useForm<{ 'field-name': string[] }>())

      expect(form.result.current).toHaveProperty('useFieldArray')

      const field = renderHook(() =>
        form.result.current.useFieldArray('field-name', () => true)
      )

      act(() => field.result.current.append('first'))

      expect(field.result.current.items).toMatchObject([
        arrShape('field-name[0]', 'first', {}, () => true),
      ])
    })

    it('should be possible to return sub-fields', () => {
      const form = renderHook(() =>
        useForm<{ 'field-name': { a: boolean; b: boolean } }>()
      )

      expect(form.result.current).toHaveProperty('useFieldArray')

      const field = renderHook(() =>
        form.result.current.useFieldArray('field-name', path => ({
          a: form.result.current.useField(`${path}.a`),
          b: form.result.current.useField(`${path}.b`),
        }))
      )

      act(() => field.result.current.append({ a: true, b: false }))

      expect(field.result.current.items).toMatchObject([
        {
          item: { id: expect.toBeString(), a: true, b: false },
          field: {
            a: shape(`field-name[0].a`),
            b: shape(`field-name[0].b`),
          },
        },
      ])
    })
  })
})

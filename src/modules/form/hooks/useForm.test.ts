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

    it('should update with form errors', () => {
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

    it('should be possible to interact with a field value', () => {
      const form = renderHook(() => useForm<{ foo: number }>())
      const field = renderHook(() => form.result.current.useField('foo'))
      form.result.current.register({ name: 'foo' })

      expect(field.result.current.meta).toEqual({
        touched: false,
        error: undefined,
      })

      expect(field.result.current.value).toBeUndefined()
      expect(form.result.current.getValues()).toEqual({})

      act(() => void (field.result.current.value = 1))

      expect(field.result.current.value).toBe(1)
      expect(form.result.current.getValues()).toEqual({ foo: 1 })
    })

    it('should re-render only when acessing a field value', () => {
      let rendered = 0

      const form = renderHook(() => {
        rendered++
        return useForm<{ foo: number }>()
      })

      const field = renderHook(() => form.result.current.useField('foo'))

      // must create ref for watchers to work
      form.result.current.register({ name: 'foo' })

      expect(rendered).toBe(1)

      // set without watching

      act(() => void (field.result.current.value = 1))
      expect(rendered).toBe(2)
      expect(form.result.current.getValues()).toEqual({ foo: 1 })

      act(() => void (field.result.current.value = 2))
      expect(rendered).toBe(2)
      expect(form.result.current.getValues()).toEqual({ foo: 2 })

      act(() => void (field.result.current.value = 3))
      expect(rendered).toBe(2)
      expect(form.result.current.getValues()).toEqual({ foo: 3 })

      // start watching
      field.result.current.value

      // set with watching

      act(() => void (field.result.current.value = 4))
      expect(rendered).toBe(3)
      expect(form.result.current.getValues()).toEqual({ foo: 4 })

      act(() => void (field.result.current.value = 5))
      expect(rendered).toBe(4)
      expect(form.result.current.getValues()).toEqual({ foo: 5 })
    })
  })

  describe('useFieldArray', () => {
    it('should retrieve a single field array api', () => {
      const form = renderHook(() => useForm())

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

    it('should be possible to get field value', () => {
      const form = renderHook(() => useForm<{ 'field-name': string[] }>())

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

    it('should be possible to interact with a field array value', () => {
      const form = renderHook(() => useForm<{ foo: string[] }>())
      const field = renderHook(() => form.result.current.useFieldArray('foo'))
      form.result.current.register({ name: 'foo' })

      expect(field.result.current.value).toBeUndefined()
      expect(form.result.current.getValues()).toEqual({})

      act(() => void (field.result.current.value = []))

      expect(field.result.current.value).toEqual([])
      expect(form.result.current.getValues()).toEqual({ foo: [] })
    })

    it('should re-render only when acessing a field value', () => {
      let rendered = 0

      const form = renderHook(() => {
        rendered++
        return useForm<{ foo: string[] }>()
      })

      const field = renderHook(() => form.result.current.useFieldArray('foo'))

      // must create ref for watchers to work
      form.result.current.register({ name: 'foo' })

      expect(rendered).toBe(1)
      expect(form.result.current.getValues().foo).toBeUndefined()

      // set without watching

      act(() => void (field.result.current.value = ['first']))
      expect(rendered).toBe(1)
      expect(form.result.current.getValues().foo).toEqual(['first'])

      act(() => void (field.result.current.value = ['first', 'second']))
      expect(rendered).toBe(1)
      expect(form.result.current.getValues().foo).toEqual(['first', 'second'])

      // start watching
      expect(field.result.current.value).toEqual(['first', 'second'])

      // set with watching

      act(() => void (field.result.current.value = ['third']))
      expect(rendered).toBe(2)
      expect(form.result.current.getValues().foo).toEqual(['third'])

      act(() => void (field.result.current.value = ['fourth']))
      expect(rendered).toBe(3)
      expect(form.result.current.getValues().foo).toEqual(['fourth'])
    })
  })
})

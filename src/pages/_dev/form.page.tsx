import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

const FormPage = () => {
  const form = useForm()
  const field = useFieldArray({ name: 'field', control: form.control })
  const values = form.getValues()
  const watched = form.watch('field')

  React.useEffect(() => {
    setTimeout(() => {
      if (field.fields.length === 0) field.append({ text: 'first' })
      else if (field.fields.length === 1) field.append({ text: 'second' })
      else if (field.fields.length === 2) field.append({ text: 'third' })
      else if (field.fields.length === 3) field.remove(1)
    }, 2000)
  }, [field.fields.length])

  return (
    <div className="p-10 bg-gray text-white text-600 flex">
      <pre className="width-50 flex-shrink-0">
        {JSON.stringify(
          { values, field, watched },
          (_key, value) =>
            typeof value === 'undefined' ? '[undefined]' : value,
          2
        )}
      </pre>

      <div style={{ width: '50%', flexShrink: 0 }} className="text-black">
        <button onClick={() => field.append(['teste'])}>Add</button>

        {field.fields.map((item, index) => (
          <div key={item.id} className="mb-1">
            <input
              type="text"
              name={`field[${index}].text`}
              ref={form.register()}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormPage

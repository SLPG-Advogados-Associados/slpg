import { Typeform } from '@typeform/api-client'

import { adaptor } from '~app/lib/lambda'
import { airtable } from '~app/lib/airtable'

import fields from './fields.json'

// Base "Base de Servidores Públicos"
// Table "Tempo especial pós-90 - Tema nº 942 - Cadastro"
const table = airtable.base('appYMhBiEYOwpWX9e').table('tblvvxXBrtGBG3EOp')

type Payload = {
  event_id: string
  event_type: string
  form_response: Typeform.Response & {
    form_id: string
  }
}

type Record = { fields: { [key: string]: any } }

const mapValue = {
  text: ({ text }) => text,
  choice: ({ choice }) => choice.label,
  boolean: ({ boolean }) => boolean,
  number: ({ number }) => number,
  date: ({ date }) => date,
  choices: ({ choices }) => choices.labels,
}

const toAirtable = async (payload: Payload) => {
  const record: Record = { fields: {} }

  for (const answer of payload.form_response.answers) {
    const field = fields.find(({ typeForm }) => typeForm.id === answer.field.id)

    if (!field) {
      throw new Error(`Could not map field for answer "${answer.field.id}"`)
    }

    if (!mapValue[answer.type]) {
      throw new Error(
        `Could not find field conversion for type "${answer.type}"`
      )
    }

    record.fields[field.airtable.id] = mapValue[answer.type](answer)
  }

  // console.log({ record })
  await table.create([record])
}

const { netlify, next } = adaptor(async (req, res) => {
  try {
    await toAirtable(req.body)
    res.status(200).send('ok')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(500).send('failed')
  }
})

export const handler = netlify // for Netlify
export default next // for Next.js

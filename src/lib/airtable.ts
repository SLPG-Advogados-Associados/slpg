import Airtable from 'airtable'

import { env } from '~app/env'

if (env.NODE_ENV === 'production' && !env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is required on production')
}

const airtable = new Airtable({ apiKey: env.AIRTABLE_API_KEY })

export { airtable }

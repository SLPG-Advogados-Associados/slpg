/* eslint-disable @typescript-eslint/camelcase */
import { NextApiHandler } from 'next'

import { mailchimp, info } from '~app/modules/newsletter/lib/mailchimp'
import md5 from 'md5'

interface ParsedBody {
  email: string
  name: string
  interests: string[]
}

const interestMap = (interests: string[]): { [key: string]: true } =>
  interests.reduce((carry, interest) => ({ ...carry, [interest]: true }), {})

const register = async ({ email, interests, name }: ParsedBody) => {
  const payload = {
    email_address: email,
    interests: interestMap(interests),
    status: 'subscribed',
    merge_fields: {
      NAME: name,
    },
  }

  try {
    // first, try to register a new subscriber
    await mailchimp.post(`/lists/${info.audience}/members/`, payload)
  } catch (error) {
    // if member exists, try to update it
    if (error.title === 'Member Exists') {
      await mailchimp.put(
        `/lists/${info.audience}/members/${md5(email.toLowerCase())}`,
        payload
      )
    } else {
      throw error
    }
  }
}

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Only POST requests are allowed')
    }

    // perform the subscription
    await register(req.body)

    // no need for a returning value
    res.status(200).send('ok')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(400).send('failed')
  }
}

export { handler } // for Netlify
export default handler // for Next.js

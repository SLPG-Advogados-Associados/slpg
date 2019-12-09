/* eslint-disable @typescript-eslint/camelcase */
import Mailchimp from 'mailchimp-api-v3'
import md5 from 'md5'

interface LambdaEvent {
  body: string
  httpMethod: 'GET' | 'POST'
}

interface ParsedBody {
  email: string
  name: string
  interests: string[]
}

const audience = 'bee915ad21'
const mailchimp = new Mailchimp(
  process.env.MAILCHIMP_API_KEY || '8845a706e03473ea51ecb42b51aad5eb-us4'
)

const failure = { statusCode: 400, body: 'failed' }

export async function handler({ body, httpMethod }: LambdaEvent) {
  const { email, name, interests: interestsList }: ParsedBody = JSON.parse(body)

  const interests = interestsList.reduce(
    (carry, interest) => ({ ...carry, [interest]: true }),
    {}
  )

  try {
    if (httpMethod !== 'POST') {
      throw new Error('/newsletter-form accepts only POST requests')
    }

    await mailchimp.post(`/lists/${audience}/members/`, {
      email_address: email,
      interests,
      status: 'subscribed',
      merge_fields: {
        NAME: name,
      },
    })

    return { statusCode: 200, body: 'ok' }
  } catch (error) {
    if (error.title === 'Member Exists') {
      await mailchimp.put(
        `/lists/${audience}/members/${md5(email.toLowerCase())}`,
        {
          email_address: email,
          interests,
          status: 'subscribed',
          merge_fields: {
            NAME: name,
          },
        }
      )

      return { statusCode: 200, body: 'ok' }
    }

    // eslint-disable-next-line no-console
    console.error(error)

    return failure
  }
}

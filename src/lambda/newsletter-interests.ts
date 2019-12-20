/* eslint-disable @typescript-eslint/camelcase */
import { mailchimp, config } from '~app/modules/newsletter/lib/mailchimp'

const failure = { statusCode: 400, body: 'failed' }
const link = `/lists/${config.audience}/interest-categories/${config.interestsCategory}/interests`

export async function handler() {
  try {
    const { interests } = await mailchimp.get(link)
    return { statusCode: 200, body: JSON.stringify(interests) }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return failure
  }
}

import { mailchimp, info } from '~app/modules/newsletter/lib/mailchimp'

import { adaptor } from './adaptor'

const link = `/lists/${info.audience}/interest-categories/${info.interestsCategory}/interests`

const { netlify, next } = adaptor(async (_req, res) => {
  try {
    const { interests } = await mailchimp.get(link)
    res.status(200).json(interests)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(500).send('failed')
  }
})

export const handler = netlify // for Netlify
export default next // for Next.js

import { adaptor } from 'next-to-netlify/adaptor'

import { mailchimp, info } from '~app/modules/newsletter/lib/mailchimp'

const link = `/lists/${info.audience}/interest-categories/${info.interestsCategory}/interests`

const handler = adaptor(async (_req, res) => {
  try {
    const { interests } = await mailchimp.get(link)
    res.status(200).json(interests)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(500).send('failed')
  }
})

export { handler } // for Netlify
export default handler // for Next.js

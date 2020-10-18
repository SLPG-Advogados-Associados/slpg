import { mailchimp, info } from '~app/modules/newsletter/lib/mailchimp'

const link = `/lists/${info.audience}/interest-categories/${info.interestsCategory}/interests`

export default async (_req, res) => {
  try {
    const { interests } = await mailchimp.get(link)
    res.status(200).json(interests)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(500).send('failed')
  }
}

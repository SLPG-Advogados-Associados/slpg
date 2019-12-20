import Mailchimp from 'mailchimp-api-v3'

/* prettier-ignore */
if (process.env.NODE_ENV === 'production') {
  if (!process.env.MAILCHIMP_AUDIENCE) throw new Error('MAILCHIMP_AUDIENCE is required on production')
  if (!process.env.MAILCHIMP_INTERESTS_CATEGORY) throw new Error('MAILCHIMP_INTERESTS_CATEGORY is required on production')
  if (!process.env.MAILCHIMP_API_KEY) throw new Error('MAILCHIMP_API_KEY is required on production')
}

const config = {
  // @see: https://mailchimp.com/pt/help/find-audience-id/
  audience: process.env.MAILCHIMP_AUDIENCE,
  // the category can be figured out by hitting Mailchimp API at the following:
  // `/lists/{audience}/interest-categories/`
  interestsCategory: process.env.MAILCHIMP_INTERESTS_CATEGORY,
}

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY)

export { mailchimp, config }

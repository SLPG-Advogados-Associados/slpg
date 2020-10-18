/* eslint-disable @typescript-eslint/camelcase */
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

interface ParsedBody {
  name: string
  message: string
  phone?: string
  email?: string
}

// how to replace this vars: https://levelup.gitconnected.com/create-a-free-serverless-email-bot-using-gmail-nodejs-and-aws-lambda-8e56dbfde7a7

// prettier-ignore
const config = {
  GOOGLE_USER: process.env.GOOGLE_USER,
  GOOGLE_TO_EMAIL: process.env.GOOGLE_TO_EMAIL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_REDIRECT_URL: 'https://developers.google.com/oauthplayground',
}

/* prettier-ignore */
if (process.env.NODE_ENV === 'production') {
  if (!process.env.GOOGLE_USER) throw new Error('GOOGLE_USER is required in production')
  if (!process.env.GOOGLE_TO_EMAIL) throw new Error('GOOGLE_TO_EMAIL is required in production')
  if (!process.env.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is required in production')
  if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is required in production')
  if (!process.env.GOOGLE_REFRESH_TOKEN) throw new Error('GOOGLE_REFRESH_TOKEN is required in production')
}

/**
 * Builds a OAuth2 enabled nodemailer transport.
 */
const getTransport = async () => {
  const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URL
  )

  oauth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN,
  })

  const { token: accessToken } = await oauth2Client.getAccessToken()

  return nodemailer.createTransport({
    // @ts-ignore
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.GOOGLE_USER,
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      refreshToken: config.GOOGLE_REFRESH_TOKEN,
      accessToken,
    },
  })
}

const contact = async ({ name, message, phone, email }: ParsedBody) => {
  // prettier-ignore
  const mail = {
    from: 'site@slpgadvogados.adv.br',
    replyTo: email,
    to: config.GOOGLE_TO_EMAIL,
    subject: `[slpgadvogados.adv.br] Contato: ${name}`,
    generateTextFromHTML: true,
    html: `
      <p>
        E-mail recebido através do formulário de contato no site:
      </p>

      <p>
        Nome: <b style="font-family: monospace;">${name}</b><br />
        Telefone: <b style="font-family: monospace;">${phone || 'não enviado'}</b><br />
        E-mail: <b style="font-family: monospace;">${email || 'não enviado'}</b><br />
        Mensagem:
      </p>

      <p style="font-family: monospace;">
        ${message}
      </p>
    `,
  }

  const transport = await getTransport()

  await new Promise((resolve, reject) => {
    transport.sendMail(mail, (error, response) => {
      transport.close()

      error ? reject(error) : resolve(response)
    })
  })
}

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Only POST requests are allowed')
    }

    // perform the subscription
    await contact(req.body)

    // no need for a returning value
    res.status(200).send('ok')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(400).send('failed')
  }
}

/* eslint-disable @typescript-eslint/camelcase */
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

interface LambdaEvent {
  body: string
  httpMethod: 'GET' | 'POST'
}

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

const failure = { statusCode: 400, body: 'failed' }

export async function handler({ body, httpMethod }: LambdaEvent) {
  try {
    if (httpMethod !== 'POST') {
      throw new Error('/contact-form accepts only POST requests')
    }

    const oauth2Client = new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URL
    )

    oauth2Client.setCredentials({
      refresh_token: config.GOOGLE_REFRESH_TOKEN,
    })

    const { token: accessToken } = await oauth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
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

    const { name, message, phone, email }: ParsedBody = JSON.parse(body)

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

    await new Promise((resolve, reject) => {
      transport.sendMail(mail, (error, response) => {
        transport.close()

        error ? reject(error) : resolve(response)
      })
    })

    return { statusCode: 200, body: 'ok' }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return failure
  }
}